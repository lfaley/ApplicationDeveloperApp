/**
 * Sequential Orchestration Pattern
 *
 * Executes agents one after another in sequence. Each agent waits for the
 * previous agent to complete before starting. Results can be passed between
 * agents if configured.
 *
 * Use case: When agents have dependencies or need to build on previous results
 * (e.g., analyze code → review code → generate tests).
 *
 * @module patterns/sequential
 */
import { OrchestrationPattern, OrchestrationRequest, OrchestrationResult } from '../types.js';
/**
 * Sequential Pattern Implementation
 *
 * Executes agents in order, waiting for each to complete before starting the next.
 * Supports conditional execution and result passing between agents.
 */
export declare class SequentialPattern implements OrchestrationPattern {
    readonly type = "sequential";
    readonly name = "Sequential Orchestration";
    readonly description = "Execute agents one after another in sequence";
    /**
     * Execute agents sequentially
     *
     * @param request - Orchestration request
     * @returns Orchestration result
     */
    execute(request: OrchestrationRequest): Promise<OrchestrationResult>;
    /**
     * Validate sequential pattern configuration
     *
     * @param request - Orchestration request
     * @returns Validation result
     */
    validate(request: OrchestrationRequest): {
        isValid: boolean;
        valid: boolean;
        errors: string[];
        warnings: string[];
    };
    /**
     * Check if agent should be skipped
     *
     * @param agentConfig - Agent configuration
     * @param previousResults - Results from previous agents
     * @param hasFailure - Whether any previous agent failed
     * @param continueOnError - Whether to continue on error
     * @returns True if agent should be skipped
     */
    private shouldSkip;
    /**
     * Execute a single agent
     *
     * @param agentConfig - Agent configuration
     * @param receivedContext - Whether this agent received context from previous result
     * @returns Agent result
     */
    private executeAgent;
    /**
     * Simulate agent execution (placeholder)
     *
     * @param agentConfig - Agent configuration
     * @param timeout - Execution timeout
     * @returns Simulated output
     */
    private simulateAgentExecution;
    /**
     * Create skipped result
     *
     * @param agentConfig - Agent configuration
     * @returns Agent result with skipped status
     */
    private createSkippedResult;
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
    private buildResult;
}
//# sourceMappingURL=sequential.d.ts.map