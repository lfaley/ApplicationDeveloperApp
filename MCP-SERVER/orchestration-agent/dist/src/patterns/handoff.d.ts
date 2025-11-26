/**
 * Handoff Orchestration Pattern
 *
 * Passes control from one agent to another based on results or conditions.
 * Each agent can decide which agent should execute next, enabling dynamic workflows.
 *
 * Use case: When workflow path depends on results (e.g., if code review finds
 * security issues, hand off to security agent; otherwise continue to tests).
 *
 * @module patterns/handoff
 */
import { OrchestrationPattern, OrchestrationRequest, OrchestrationResult } from '../types.js';
/**
 * Handoff Pattern Implementation
 *
 * Executes agents based on conditional handoffs, where each agent's result
 * determines which agent executes next.
 */
export declare class HandoffPattern implements OrchestrationPattern {
    readonly type = "handoff";
    readonly name = "Handoff Orchestration";
    readonly description = "dynamic workflow with conditional agent handoffs";
    /**
     * Execute agents with handoff logic
     *
     * @param request - Orchestration request
     * @returns Orchestration result
     */
    execute(request: OrchestrationRequest): Promise<OrchestrationResult>;
    /**
     * Validate handoff pattern configuration
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
     * @returns True if agent should be skipped
     */
    private shouldSkip;
    /**
     * Determine which agent should execute next
     *
     * @param currentResult - Result from current agent
     * @param agents - All agent configurations
     * @param currentIndex - Current agent index
     * @returns Next agent index or -1 if done
     */
    private determineNextAgent;
    /**
     * Execute a single agent
     *
     * @param agentConfig - Agent configuration
     * @param previousResults - Results from previous agents
     * @returns Agent result
     */
    private executeAgent;
    /**
     * Simulate agent execution (placeholder)
     *
     * @param agentConfig - Agent configuration
     * @param previousResults - Previous results for context
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
     * @returns Orchestration result
     */
    private buildResult;
}
//# sourceMappingURL=handoff.d.ts.map