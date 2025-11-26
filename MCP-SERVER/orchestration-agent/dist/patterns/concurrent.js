/**
 * Concurrent Orchestration Pattern
 *
 * Executes agents in parallel with configurable concurrency limits.
 * All agents start simultaneously (or up to maxConcurrency limit) and
 * results are collected when all complete.
 *
 * Use case: When agents are independent and can run simultaneously
 * (e.g., review code + generate tests + analyze documentation in parallel).
 *
 * @module patterns/concurrent
 */
import { registry } from '../registry.js';
/**
 * Concurrent Pattern Implementation
 *
 * Executes multiple agents in parallel, respecting maxConcurrency limits.
 * All agents must complete before returning results.
 */
export class ConcurrentPattern {
    type = 'concurrent';
    name = 'Concurrent Orchestration';
    description = 'Execute agents in parallel with optional concurrency limits';
    /**
     * Execute agents concurrently
     *
     * @param request - Orchestration request
     * @returns Orchestration result
     */
    async execute(request) {
        const startTime = new Date();
        const { agents, config = {} } = request;
        const { maxConcurrency = agents.length, continueOnError = false } = config;
        // Execute agents with concurrency control
        const agentResults = await this.executeWithConcurrency(agents, maxConcurrency, continueOnError);
        const endTime = new Date();
        return this.buildResult(request, agentResults, startTime, endTime, continueOnError);
    }
    /**
     * Validate concurrent pattern configuration
     *
     * @param request - Orchestration request
     * @returns Validation result
     */
    validate(request) {
        const errors = [];
        const warnings = [];
        // Validate at least one agent
        if (request.agents.length === 0) {
            errors.push('At least one agent must be specified');
        }
        // Validate each agent exists and has the specified tool
        for (let i = 0; i < request.agents.length; i++) {
            const agent = request.agents[i];
            const validation = registry.validateAgentTool(agent.agentId, agent.toolName);
            if (!validation.valid) {
                errors.push(`Agent ${i + 1}: ${validation.error}`);
            }
        }
        // Validate maxConcurrency
        if (request.config?.maxConcurrency !== undefined) {
            if (request.config.maxConcurrency < 1) {
                errors.push('maxConcurrency must be at least 1');
            }
        }
        // Warn about dependencies in concurrent mode
        for (const agent of request.agents) {
            if (agent.dependsOn) {
                warnings.push(`Agent ${agent.agentId} has dependsOn specified, but concurrent execution ignores dependencies`);
            }
        }
        return {
            isValid: errors.length === 0,
            valid: errors.length === 0,
            errors,
            warnings,
        };
    }
    /**
     * Execute agents with concurrency control
     *
     * @param agents - Agent configurations
     * @param maxConcurrency - Maximum parallel executions
     * @param continueOnError - Continue on agent failure
     * @returns Array of agent results
     */
    async executeWithConcurrency(agents, maxConcurrency, continueOnError) {
        const results = [];
        const queue = [...agents];
        const running = [];
        while (queue.length > 0 || running.length > 0) {
            // Start new agents up to concurrency limit
            while (queue.length > 0 && running.length < maxConcurrency) {
                const agent = queue.shift();
                const promise = this.executeAgent(agent);
                running.push(promise);
            }
            // Wait for at least one agent to complete
            if (running.length > 0) {
                const result = await Promise.race(running);
                results.push(result);
                // Remove completed agent from running list
                const index = running.findIndex(async (p) => (await p) === result);
                if (index !== -1) {
                    running.splice(index, 1);
                }
                // Check if we should stop on error
                if (!continueOnError && result.status === 'failed') {
                    // Cancel remaining agents
                    break;
                }
            }
        }
        // Wait for all remaining agents if continueOnError is true
        if (continueOnError && running.length > 0) {
            const remainingResults = await Promise.all(running);
            results.push(...remainingResults);
        }
        return results;
    }
    /**
     * Execute a single agent
     *
     * @param agentConfig - Agent configuration
     * @returns Agent result
     */
    async executeAgent(agentConfig) {
        const startTime = new Date();
        const timeout = agentConfig.timeout || 30000;
        try {
            // TODO: Actual agent execution will be implemented later
            const output = await this.simulateAgentExecution(agentConfig, timeout);
            const endTime = new Date();
            return {
                agentId: agentConfig.agentId,
                status: 'completed',
                output: typeof output === 'object' && output !== null ? output : { result: output },
                metadata: {
                    startTime,
                    endTime,
                    duration: endTime.getTime() - startTime.getTime(),
                    retries: 0,
                },
            };
        }
        catch (error) {
            const endTime = new Date();
            return {
                agentId: agentConfig.agentId,
                status: 'failed',
                error: {
                    message: error instanceof Error ? error.message : 'Unknown error',
                    code: 'EXECUTION_ERROR',
                    stack: error instanceof Error ? error.stack : undefined,
                },
                metadata: {
                    startTime,
                    endTime,
                    duration: endTime.getTime() - startTime.getTime(),
                    retries: 0,
                },
            };
        }
    }
    /**
     * Simulate agent execution (placeholder)
     *
     * @param agentConfig - Agent configuration
     * @param timeout - Execution timeout
     * @returns Simulated output
     */
    async simulateAgentExecution(agentConfig, _timeout) {
        // Simulate variable execution time
        const delay = Math.random() * 200 + 100;
        await new Promise(resolve => setTimeout(resolve, delay));
        // Check if agent should fail (for testing)
        if (agentConfig.args && typeof agentConfig.args === 'object' && 'shouldFail' in agentConfig.args && agentConfig.args.shouldFail === true) {
            throw new Error('Agent configured to fail');
        }
        return {
            agent: agentConfig.agentId,
            tool: agentConfig.toolName,
            result: 'Concurrent execution result',
        };
    }
    /**
     * Build final orchestration result
     *
     * @param request - Original request
     * @param agentResults - Results from all agents
     * @param startTime - Workflow start time
     * @param endTime - Workflow end time
     * @param continueOnError - Whether errors were continued
     * @returns Orchestration result
     */
    buildResult(request, agentResults, startTime, endTime, continueOnError) {
        const successCount = agentResults.filter(r => r.status === 'completed').length;
        const failureCount = agentResults.filter(r => r.status === 'failed').length;
        const skippedCount = agentResults.filter(r => r.status === 'skipped').length;
        const totalDuration = endTime.getTime() - startTime.getTime();
        // Determine status based on results and continueOnError setting
        let status;
        if (failureCount === 0) {
            status = 'completed';
        }
        else if (continueOnError) {
            // With continueOnError, we accept failures - consider it completed
            status = 'completed';
        }
        else {
            // Without continueOnError, any failure means failed status
            status = 'failed';
        }
        const aggregatedOutput = {
            results: agentResults,
            outputs: agentResults
                .filter(r => r.status === 'completed')
                .map(r => r.output),
        };
        const summary = `Concurrent orchestration completed: ${successCount} succeeded, ${failureCount} failed, ${skippedCount} skipped (${totalDuration}ms)`;
        return {
            status,
            agentResults,
            aggregatedOutput,
            summary,
            metadata: {
                pattern: this.type,
                startTime,
                endTime,
                totalDuration,
                description: request.description,
            },
        };
    }
}
//# sourceMappingURL=concurrent.js.map