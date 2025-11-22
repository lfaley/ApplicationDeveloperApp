/**
 * Type definitions for Project Context Agent
 * 
 * Defines interfaces for drift detection, git integration,
 * and context health monitoring.
 * 
 * @module types
 */

import { z } from 'zod';

/**
 * Drift severity levels
 */
export type DriftSeverity = 'critical' | 'high' | 'medium' | 'low';

/**
 * Types of drift that can be detected
 */
export type DriftType = 
  | 'outdated'      // Documentation exists but is outdated
  | 'missing'       // No documentation for code
  | 'orphaned'      // Documentation for non-existent code
  | 'inconsistent'; // Documentation contradicts code

/**
 * File modification information from git
 */
export interface FileModificationInfo {
  filePath: string;
  lastModified: Date;
  lastCommit: string;
  author: string;
  commitMessage: string;
  linesChanged: number;
}

/**
 * Individual drift item representing a specific documentation issue
 */
export interface DriftItem {
  type: DriftType;
  severity: DriftSeverity;
  filePath: string;
  relatedFiles: string[];
  relatedDocPath?: string;
  description: string;
  lastCodeChange: Date;
  lastDocChange?: Date;
  lastDocUpdate?: Date;
  affectedElements: string[];
  recommendations: string[];
}

/**
 * Result of drift detection analysis
 */
export interface DriftDetectionResult {
  hasDrift: boolean;
  driftItems: DriftItem[];
  overallSeverity: DriftSeverity;
  summary: {
    totalDrifts: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  timestamp: Date;
  scannedFiles: number;
  recommendations: string[];
}

/**
 * Context health score (0-100)
 */
export interface ContextHealthScore {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  factors: {
    documentationCoverage: number;
    documentationFreshness: number;
    consistencyScore: number;
    completenessScore: number;
  };
  issues: string[];
  strengths: string[];
}

/**
 * Sync recommendation for fixing drift
 */
export interface SyncRecommendation {
  driftItemId: string;
  action: 'update' | 'create' | 'delete' | 'verify';
  targetFile: string;
  suggestedContent?: string;
  priority: number;
  estimatedEffort: 'low' | 'medium' | 'high';
  autoSyncable: boolean;
}

/**
 * Auto-sync execution result
 */
export interface AutoSyncResult {
  success: boolean;
  itemsSynced: number;
  itemsFailed: number;
  filesModified: string[];
  errors: string[];
  timestamp: Date;
}

/**
 * Sync engine result with detailed information
 */
export interface SyncResult {
  success: boolean;
  itemsSynced: number;
  itemsFailed: number;
  filesModified: string[];
  errors: string[];
  timestamp: Date;
}

/**
 * Options for sync engine
 */
export interface SyncOptions {
  includePatterns?: string[];
  excludePatterns?: string[];
  driftItemIds?: string[];
  severityThreshold?: DriftSeverity;
  createBackup?: boolean;
  requireApproval?: boolean;
  approvalCallback?: (items: DriftItem[]) => Promise<boolean>;
  autoCreateMissing?: boolean;
  handleOrphaned?: boolean;
}

/**
 * Git repository status
 */
export interface GitStatus {
  isRepository: boolean;
  hasUncommittedChanges: boolean;
  currentBranch: string;
  lastCommit: {
    hash: string;
    message: string;
    author: string;
    date: Date;
  };
}

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

export type DriftDetectionRequest = z.infer<typeof DriftDetectionRequestSchema>;

/**
 * Schema for auto-sync request
 */
export const AutoSyncRequestSchema = z.object({
  workspacePath: z.string().describe('Absolute path to workspace/repository'),
  driftItemIds: z.array(z.string()).optional().describe('Specific drift items to sync (empty = all)'),
  requireApproval: z.boolean().default(true).describe('Require user approval before syncing'),
  createBackup: z.boolean().default(true).describe('Create backup before modifying files'),
});

export type AutoSyncRequest = z.infer<typeof AutoSyncRequestSchema>;

/**
 * Schema for health check request
 */
export const HealthCheckRequestSchema = z.object({
  workspacePath: z.string().describe('Absolute path to workspace/repository'),
  includePatterns: z.array(z.string()).optional().describe('Glob patterns for files to include'),
});

export type HealthCheckRequest = z.infer<typeof HealthCheckRequestSchema>;
