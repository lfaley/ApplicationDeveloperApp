/**
 * Type definitions for Project Context Agent
 *
 * Defines interfaces for drift detection, git integration,
 * and context health monitoring.
 *
 * @module types
 */
import { z } from 'zod';
// Zod Schemas for validation
/**
 * Schema for drift detection request
 */
export const DriftDetectionRequestSchema = z.object({
    workspacePath: z.string().describe('Absolute path to workspace/repository'),
    includePatterns: z.array(z.string()).optional().describe('Glob patterns for files to include'),
    excludePatterns: z.array(z.string()).optional().describe('Glob patterns for files to exclude'),
    severityThreshold: z.enum(['critical', 'high', 'medium', 'low']).optional().describe('Minimum severity to report'),
});
/**
 * Schema for auto-sync request
 */
export const AutoSyncRequestSchema = z.object({
    workspacePath: z.string().describe('Absolute path to workspace/repository'),
    driftItemIds: z.array(z.string()).optional().describe('Specific drift items to sync (empty = all)'),
    requireApproval: z.boolean().default(true).describe('Require user approval before syncing'),
    createBackup: z.boolean().default(true).describe('Create backup before modifying files'),
});
/**
 * Schema for health check request
 */
export const HealthCheckRequestSchema = z.object({
    workspacePath: z.string().describe('Absolute path to workspace/repository'),
    includePatterns: z.array(z.string()).optional().describe('Glob patterns for files to include'),
});
//# sourceMappingURL=types.js.map