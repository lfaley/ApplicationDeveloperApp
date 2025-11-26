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
import { OrchestrationPattern, OrchestrationRequest, OrchestrationResult } from '../types.js';
/**
 * Concurrent Pattern Implementation
 *
 * Executes multiple agents in parallel, respecting maxConcurrency limits.
 * All agents must complete before returning results.
 */
export declare class ConcurrentPattern implements OrchestrationPattern {
    readonly type = "concurrent";
    readonly name = "Concurrent Orchestration";
    readonly description = "Execute agents in parallel with optional concurrency limits";
    /**
     * Execute agents concurrently
     *
     * @param request - Orchestration request
     * @returns Orchestration result
     */
    execute(request: OrchestrationRequest): Promise<OrchestrationResult>;
    /**
     * Validate concurrent pattern configuration
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
     * Execute agents with concurrency control
     *
     * @param agents - Agent configurations
     * @param maxConcurrency - Maximum parallel executions
     * @param continueOnError - Continue on agent failure
     * @returns Array of agent results
     */
    private executeWithConcurrency;
    /**
     * Execute a single agent
     *
     * @param agentConfig - Agent configuration
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
//# sourceMappingURL=concurrent.d.ts.map