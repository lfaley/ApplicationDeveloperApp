/**
 * Orchestration MCP Tools
 *
 * Provides MCP tools for orchestrating multiple agents in various patterns.
 * Enables complex multi-agent workflows through a simple tool interface.
 *
 * @module tools
 */
import type { OrchestrationRequest, OrchestrationResult } from './types.js';
/**
 * Orchestrate Workflow Tool
 *
 * Executes a multi-agent workflow using the specified orchestration pattern.
 * This is the main tool for coordinating multiple agents.
 *
 * @param request - Orchestration request
 * @returns Orchestration result
 */
export declare function orchestrateWorkflow(request: OrchestrationRequest): Promise<OrchestrationResult>;
/**
 * List Patterns Tool
 *
 * Returns information about all available orchestration patterns.
 * Useful for discovering capabilities and understanding pattern options.
 *
 * @returns Array of pattern information
 */
export declare function listPatterns(): Array<{
    type: string;
    name: string;
    description: string;
    capabilities: string[];
}>;
/**
 * Pattern Info Tool
 *
 * Returns detailed information about a specific orchestration pattern,
 * including usage examples and best practices.
 *
 * @param patternType - Pattern type to get info for
 * @returns Detailed pattern information
 */
export declare function getPatternInfo(patternType: string): {
    type: string;
    name: string;
    description: string;
    useCases: string[];
    example: OrchestrationRequest;
    bestPractices: string[];
};
/**
 * List Available Agents Tool
 *
 * Returns information about all registered agents and their tools.
 * Useful for discovering what agents are available for orchestration.
 *
 * @returns Agent registry information
 */
export declare function listAvailableAgents(): {
    agents: Array<{
        id: string;
        name: string;
        description: string;
        status: string;
        toolCount: number;
        tools: string[];
    }>;
    stats: {
        totalAgents: number;
        availableAgents: number;
        totalTools: number;
    };
};
/**
 * Validate Workflow Tool
 *
 * Validates an orchestration request without executing it.
 * Useful for checking configuration before execution.
 *
 * @param request - Orchestration request to validate
 * @returns Validation result
 */
export declare function validateWorkflow(request: OrchestrationRequest): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
//# sourceMappingURL=tools.d.ts.map