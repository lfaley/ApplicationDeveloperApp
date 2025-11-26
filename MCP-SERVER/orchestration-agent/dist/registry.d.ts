/**
 * Agent Registry
 *
 * Centralized registry for all available MCP agents and their tools.
 * Provides metadata and discovery capabilities for orchestration.
 *
 * @module registry
 */
import { AgentMetadata, ToolMetadata } from './types.js';
/**
 * Agent Registry Singleton
 *
 * Maintains metadata for all available agents and their tools.
 * Used by orchestration patterns to validate and route requests.
 */
export declare class AgentRegistry {
    private static instance;
    private agents;
    private constructor();
    /**
     * Get singleton instance
     */
    static getInstance(): AgentRegistry;
    /**
     * Initialize registry with known agents
     */
    private initializeAgents;
    /**
     * Register a new agent
     *
     * @param agent - Agent metadata
     */
    registerAgent(agent: AgentMetadata): void;
    /**
     * Get agent by ID
     *
     * @param agentId - Agent identifier
     * @returns Agent metadata or undefined
     */
    getAgent(agentId: string): AgentMetadata | undefined;
    /**
     * Get all registered agents
     *
     * @returns Array of agent metadata
     */
    getAllAgents(): AgentMetadata[];
    /**
     * Check if agent exists
     *
     * @param agentId - Agent identifier
     * @returns True if agent is registered
     */
    hasAgent(agentId: string): boolean;
    /**
     * Get tool metadata for an agent
     *
     * @param agentId - Agent identifier
     * @param toolName - Tool name
     * @returns Tool metadata or undefined
     */
    getTool(agentId: string, toolName: string): ToolMetadata | undefined;
    /**
     * Get all available tools across all agents
     *
     * @returns Array of tool metadata with agent info
     */
    getAllTools(): Array<ToolMetadata & {
        agentId: string;
    }>;
    /**
     * Validate agent and tool exist
     *
     * @param agentId - Agent identifier
     * @param toolName - Tool name
     * @returns Validation result
     */
    validateAgentTool(agentId: string, toolName: string): {
        valid: boolean;
        error?: string;
    };
    /**
     * Get agent statistics
     *
     * @returns Registry statistics
     */
    getStats(): {
        totalAgents: number;
        availableAgents: number;
        totalTools: number;
    };
}
/**
 * Get the global agent registry instance
 */
export declare const registry: AgentRegistry;
//# sourceMappingURL=registry.d.ts.map