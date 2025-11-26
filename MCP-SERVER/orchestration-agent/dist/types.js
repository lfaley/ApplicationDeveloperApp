/**
 * Type definitions for Multi-Agent Orchestration System
 *
 * This module defines the core types, interfaces, and schemas for orchestrating
 * multiple MCP agents in coordinated workflows.
 *
 * @module types
 */
import { z } from 'zod';
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
//# sourceMappingURL=types.js.map