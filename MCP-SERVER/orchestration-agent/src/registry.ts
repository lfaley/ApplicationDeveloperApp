/**
 * Agent Registry
 * 
 * Centralized registry for all available MCP agents and their tools.
 * Provides metadata and discovery capabilities for orchestration.
 * 
 * @module registry
 */

import { AgentMetadata, ToolMetadata } from './types.js';
import { z } from 'zod';

/**
 * Agent Registry Singleton
 * 
 * Maintains metadata for all available agents and their tools.
 * Used by orchestration patterns to validate and route requests.
 */
export class AgentRegistry {
  private static instance: AgentRegistry;
  private agents: Map<string, AgentMetadata>;

  private constructor() {
    this.agents = new Map();
    this.initializeAgents();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  /**
   * Initialize registry with known agents
   */
  private initializeAgents(): void {
    // Code Documentation Agent
    this.registerAgent({
      id: 'code-documentation',
      name: 'Code Documentation Agent',
      description: 'Analyzes code and generates documentation',
      status: 'available',
      tools: [
        {
          name: 'analyze_code',
          description: 'Parse source code and extract structure',
          inputSchema: z.object({
            code: z.string(),
            language: z.string().optional(),
          }),
        },
        {
          name: 'generate_documentation',
          description: 'Create formatted documentation',
          inputSchema: z.object({
            analysis: z.any(),
            format: z.enum(['markdown', 'html', 'json']).optional(),
          }),
        },
        {
          name: 'analyze_and_generate',
          description: 'Combined analysis and generation',
          inputSchema: z.object({
            code: z.string(),
            language: z.string().optional(),
            format: z.enum(['markdown', 'html', 'json']).optional(),
          }),
        },
        {
          name: 'calculate_coverage',
          description: 'Compute documentation coverage percentage',
          inputSchema: z.object({
            code: z.string(),
            language: z.string().optional(),
          }),
        },
        {
          name: 'batch_process',
          description: 'Process multiple files at once',
          inputSchema: z.object({
            files: z.array(z.object({
              path: z.string(),
              code: z.string(),
            })),
            format: z.enum(['markdown', 'html', 'json']).optional(),
          }),
        },
        {
          name: 'suggest_improvements',
          description: 'Recommend documentation improvements',
          inputSchema: z.object({
            code: z.string(),
            language: z.string().optional(),
          }),
        },
      ],
    });

    // Code Review Agent
    this.registerAgent({
      id: 'code-review',
      name: 'Code Review Agent',
      description: 'Reviews code for quality, security, and performance',
      status: 'available',
      tools: [
        {
          name: 'review_code',
          description: 'Comprehensive code review',
          inputSchema: z.object({
            code: z.string(),
            language: z.string().optional(),
            severity: z.enum(['all', 'high', 'critical']).optional(),
          }),
        },
        {
          name: 'quick_review',
          description: 'Fast review focusing on high/critical issues',
          inputSchema: z.object({
            code: z.string(),
            language: z.string().optional(),
          }),
        },
        {
          name: 'security_review',
          description: 'Security-focused analysis only',
          inputSchema: z.object({
            code: z.string(),
            language: z.string().optional(),
          }),
        },
      ],
    });

    // Test Generator Agent
    this.registerAgent({
      id: 'test-generator',
      name: 'Test Generator Agent',
      description: 'Automatically generates unit tests from source code',
      status: 'available',
      tools: [
        {
          name: 'generate_tests',
          description: 'Comprehensive test generation',
          inputSchema: z.object({
            code: z.string(),
            language: z.string().optional(),
            framework: z.string().optional(),
            includeEdgeCases: z.boolean().optional(),
            includeErrorHandling: z.boolean().optional(),
            includeMocks: z.boolean().optional(),
            generateFixtures: z.boolean().optional(),
            style: z.enum(['descriptive', 'concise']).optional(),
          }),
        },
        {
          name: 'analyze_testability',
          description: 'Analyze code testability',
          inputSchema: z.object({
            code: z.string(),
            language: z.string().optional(),
          }),
        },
        {
          name: 'quick_generate',
          description: 'Rapid test generation with defaults',
          inputSchema: z.object({
            code: z.string(),
            language: z.string().optional(),
          }),
        },
      ],
    });

    // Context Agent (stub for testing)
    this.registerAgent({
      id: 'context-agent',
      name: 'Context Agent',
      description: 'Handles guided user prompts and context clarification',
      status: 'available',
      tools: [
        {
          name: 'guided_prompt',
          description: 'Collect user goals and clarify project context',
          inputSchema: z.object({
            promptType: z.string(),
            contextFromPrevious: z.boolean().optional(),
          }),
        },
      ],
    });
  }

  /**
   * Register a new agent
   * 
   * @param agent - Agent metadata
   */
  public registerAgent(agent: AgentMetadata): void {
    this.agents.set(agent.id, agent);
  }

  /**
   * Get agent by ID
   * 
   * @param agentId - Agent identifier
   * @returns Agent metadata or undefined
   */
  public getAgent(agentId: string): AgentMetadata | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Get all registered agents
   * 
   * @returns Array of agent metadata
   */
  public getAllAgents(): AgentMetadata[] {
    return Array.from(this.agents.values());
  }

  /**
   * Check if agent exists
   * 
   * @param agentId - Agent identifier
   * @returns True if agent is registered
   */
  public hasAgent(agentId: string): boolean {
    return this.agents.has(agentId);
  }

  /**
   * Get tool metadata for an agent
   * 
   * @param agentId - Agent identifier
   * @param toolName - Tool name
   * @returns Tool metadata or undefined
   */
  public getTool(agentId: string, toolName: string): ToolMetadata | undefined {
    const agent = this.agents.get(agentId);
    if (!agent) return undefined;
    
    return agent.tools.find(tool => tool.name === toolName);
  }

  /**
   * Get all available tools across all agents
   * 
   * @returns Array of tool metadata with agent info
   */
  public getAllTools(): Array<ToolMetadata & { agentId: string }> {
    const tools: Array<ToolMetadata & { agentId: string }> = [];
    
    for (const agent of this.agents.values()) {
      for (const tool of agent.tools) {
        tools.push({ ...tool, agentId: agent.id });
      }
    }
    
    return tools;
  }

  /**
   * Validate agent and tool exist
   * 
   * @param agentId - Agent identifier
   * @param toolName - Tool name
   * @returns Validation result
   */
  public validateAgentTool(
    agentId: string,
    toolName: string
  ): { valid: boolean; error?: string } {
    const agent = this.agents.get(agentId);
    
    if (!agent) {
      return {
        valid: false,
        error: `Agent '${agentId}' not found in registry`,
      };
    }
    
    if (agent.status !== 'available') {
      return {
        valid: false,
        error: `Agent '${agentId}' is not available (status: ${agent.status})`,
      };
    }
    
    const tool = agent.tools.find(t => t.name === toolName);
    if (!tool) {
      return {
        valid: false,
        error: `Tool '${toolName}' not found in agent '${agentId}'`,
      };
    }
    
    return { valid: true };
  }

  /**
   * Get agent statistics
   * 
   * @returns Registry statistics
   */
  public getStats(): {
    totalAgents: number;
    availableAgents: number;
    totalTools: number;
  } {
    const agents = Array.from(this.agents.values());
    
    return {
      totalAgents: agents.length,
      availableAgents: agents.filter(a => a.status === 'available').length,
      totalTools: agents.reduce((sum, agent) => sum + agent.tools.length, 0),
    };
  }
}

/**
 * Get the global agent registry instance
 */
export const registry = AgentRegistry.getInstance();
