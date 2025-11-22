/**
 * Type definitions for Multi-Agent Orchestration System
 * 
 * This module defines the core types, interfaces, and schemas for orchestrating
 * multiple MCP agents in coordinated workflows.
 * 
 * @module types
 */

import { z } from 'zod';

/**
 * Orchestration pattern types
 */
export type OrchestrationPatternType = 
  | 'sequential'     // Execute agents one after another
  | 'concurrent'     // Execute agents in parallel
  | 'handoff'        // Pass control between agents
  | 'group-chat';    // Multi-agent discussion

/**
 * Agent execution status
 */
export type AgentStatus = 
  | 'pending'        // Not yet started
  | 'running'        // Currently executing
  | 'completed'      // Successfully finished
  | 'failed'         // Encountered an error
  | 'skipped';       // Skipped due to conditions

/**
 * Configuration for a single agent in the orchestration
 */
export interface AgentConfig {
  /** Unique agent identifier (e.g., 'code-documentation', 'code-review') */
  agentId: string;
  
  /** Tool name to invoke on this agent */
  toolName: string;
  
  /** Arguments to pass to the tool */
  args: Record<string, unknown>;
  
  /** Optional custom condition function for execution */
  condition?: (previousResults: AgentResult[]) => boolean;
  
  /** Agent dependency - execute only if this agent succeeded */
  dependsOn?: string;
  
  /** Require success of dependent agent (used with dependsOn) */
  requiresSuccess?: boolean;
  
  /** Handoff target agent ID (handoff pattern) */
  handoffTo?: string;
  
  /** Maximum execution time in milliseconds (default: 30000) */
  timeout?: number;
}

/**
 * Result from a single agent execution
 */
export interface AgentResult {
  /** Agent identifier */
  agentId: string;
  
  /** Execution status */
  status: AgentStatus;
  
  /** Tool output if successful */
  output?: {
    success?: boolean;
    [key: string]: unknown;
  };
  
  /** Error information if failed */
  error?: {
    message: string;
    code?: string;
    stack?: string;
  };
  
  /** Execution metadata */
  metadata: {
    /** Start timestamp */
    startTime: Date;
    
    /** End timestamp */
    endTime: Date;
    
    /** Duration in milliseconds */
    duration: number;
    
    /** Number of retry attempts */
    retries: number;
    
    /** Whether context was received from previous agents */
    receivedContext?: boolean;
  };
}

/**
 * Request to orchestrate multiple agents
 */
export interface OrchestrationRequest {
  /** Orchestration pattern to use */
  pattern: OrchestrationPatternType;
  
  /** Agents to orchestrate */
  agents: AgentConfig[];
  
  /** Optional workflow configuration */
  config?: {
    /** Continue on agent failure (default: false) */
    continueOnError?: boolean;
    
    /** Maximum parallel executions (concurrent pattern only) */
    maxConcurrency?: number;
    
    /** Enable result passing between agents */
    passResults?: boolean;
    
    /** Aggregate results into single output */
    aggregateResults?: boolean;
  };
  
  /** Optional workflow description */
  description?: string;
}

/**
 * Result from orchestrated workflow execution
 */
export interface OrchestrationResult {
  /** Overall workflow status */
  status: 'completed' | 'partial' | 'failed';
  
  /** Results from each agent */
  agentResults: AgentResult[];
  
  /** Aggregated output from all agents */
  aggregatedOutput: {
    results: AgentResult[];
    [key: string]: unknown;
  };
  
  /** Workflow execution summary */
  summary: string;
  
  /** Workflow metadata */
  metadata: {
    /** Pattern used */
    pattern: OrchestrationPatternType;
    
    /** Start timestamp */
    startTime?: Date;
    
    /** End timestamp */
    endTime?: Date;
    
    /** Total execution time */
    totalDuration: number;
    
    /** Workflow description */
    description?: string;
  };
}

/**
 * Interface for orchestration pattern implementations
 */
export interface OrchestrationPattern {
  /** Pattern type identifier */
  readonly type: OrchestrationPatternType;
  
  /** Pattern display name */
  readonly name: string;
  
  /** Pattern description */
  readonly description: string;
  
  /**
   * Execute the orchestration pattern
   * 
   * @param request - Orchestration request
   * @returns Orchestration result
   */
  execute(request: OrchestrationRequest): Promise<OrchestrationResult>;
  
  /**
   * Validate pattern-specific configuration
   * 
   * @param request - Orchestration request
   * @returns Validation result with valid flag, errors, and warnings
   */
  validate(request: OrchestrationRequest): { 
    isValid: boolean; 
    valid: boolean;
    errors: string[];
    warnings: string[];
  };
}

/**
 * Agent metadata for registry
 */
export interface AgentMetadata {
  /** Agent identifier */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Agent description */
  description: string;
  
  /** Available tools */
  tools: ToolMetadata[];
  
  /** Agent status */
  status: 'available' | 'unavailable';
}

/**
 * Tool metadata for registry
 */
export interface ToolMetadata {
  /** Tool name */
  name: string;
  
  /** Tool description */
  description: string;
  
  /** Input schema */
  inputSchema: z.ZodSchema;
}

// ==================== Zod Schemas ====================

/**
 * Schema for agent configuration validation
 */
export const AgentConfigSchema = z.object({
  agentId: z.string().min(1, 'Agent ID is required'),
  toolName: z.string().min(1, 'Tool name is required'),
  args: z.record(z.unknown()),
  condition: z.function().args(z.array(z.any())).returns(z.boolean()).optional(),
  dependsOn: z.string().optional(),
  requiresSuccess: z.boolean().optional(),
  handoffTo: z.string().optional(),
  timeout: z.number().positive().optional(),
});

/**
 * Schema for orchestration request validation
 */
export const OrchestrationRequestSchema = z.object({
  pattern: z.enum(['sequential', 'concurrent', 'handoff', 'group-chat']),
  agents: z.array(AgentConfigSchema).min(1, 'At least one agent is required'),
  config: z.object({
    continueOnError: z.boolean().optional(),
    maxConcurrency: z.number().positive().optional(),
    passResults: z.boolean().optional(),
    aggregateResults: z.boolean().optional(),
  }).optional(),
  description: z.string().optional(),
});
