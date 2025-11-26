/**
 * Group Chat Orchestration Pattern
 *
 * Enables multi-agent discussion where agents can build on each other's outputs.
 * All agents participate in rounds of execution, with results shared between rounds.
 *
 * Use case: When multiple agents need to collaborate and refine results iteratively
 * (e.g., code review → refactor suggestions → test recommendations → final review).
 *
 * @module patterns/group-chat
 */
import { OrchestrationPattern, OrchestrationRequest, OrchestrationResult } from '../types.js';
/**
 * Group Chat Pattern Implementation
 *
 * Executes agents in rounds, allowing them to see and build on previous results.
 * Continues for multiple rounds or until convergence.
 */
export declare class GroupChatPattern implements OrchestrationPattern {
    readonly type = "group-chat";
    readonly name = "Group Chat";
    readonly description = "Multi-agent discussion with iterative refinement";
    private readonly maxRounds;
    private readonly minRounds;
    /**
     * Execute agents in group chat mode
     *
     * @param request - Orchestration request
     * @returns Orchestration result
     */
    execute(request: OrchestrationRequest): Promise<OrchestrationResult>;
    /**
     * Validate group chat pattern configuration
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
     * Check if we should stop executing rounds
     *
     * @param roundResults - Results from current round
     * @returns True if should stop
     */
    private shouldStopRounds;
    /**
     * Execute a single agent in the group chat
     *
     * @param agentConfig - Agent configuration
     * @param previousResults - All previous results from all rounds
     * @param round - Current round number
     * @returns Agent result
     */
    private executeAgent;
    /**
     * Build discussion context from previous results
     *
     * @param previousResults - All previous agent results
     * @param currentRound - Current round number
     * @returns Discussion context
     */
    private buildDiscussionContext;
    /**
     * Simulate agent execution (placeholder)
     *
     * @param agentConfig - Agent configuration
     * @param context - Discussion context
     * @param timeout - Execution timeout
     * @returns Simulated output
     */
    private simulateAgentExecution;
    /**
     * Build final orchestration result
     *
     * @param request - Original request
     * @param agentResults - Results from all agents across all rounds
     * @param startTime - Workflow start time
     * @param endTime - Workflow end time
     * @returns Orchestration result
     */
    private buildResult;
}
//# sourceMappingURL=group-chat.d.ts.map