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
export type DriftType = 'outdated' | 'missing' | 'orphaned' | 'inconsistent';
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
/**
 * Schema for drift detection request
 */
export declare const DriftDetectionRequestSchema: z.ZodObject<{
    workspacePath: z.ZodString;
    includePatterns: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    excludePatterns: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    severityThreshold: z.ZodOptional<z.ZodEnum<["critical", "high", "medium", "low"]>>;
}, "strip", z.ZodTypeAny, {
    workspacePath: string;
    includePatterns?: string[] | undefined;
    excludePatterns?: string[] | undefined;
    severityThreshold?: "critical" | "high" | "medium" | "low" | undefined;
}, {
    workspacePath: string;
    includePatterns?: string[] | undefined;
    excludePatterns?: string[] | undefined;
    severityThreshold?: "critical" | "high" | "medium" | "low" | undefined;
}>;
export type DriftDetectionRequest = z.infer<typeof DriftDetectionRequestSchema>;
/**
 * Schema for auto-sync request
 */
export declare const AutoSyncRequestSchema: z.ZodObject<{
    workspacePath: z.ZodString;
    driftItemIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    requireApproval: z.ZodDefault<z.ZodBoolean>;
    createBackup: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    workspacePath: string;
    requireApproval: boolean;
    createBackup: boolean;
    driftItemIds?: string[] | undefined;
}, {
    workspacePath: string;
    driftItemIds?: string[] | undefined;
    requireApproval?: boolean | undefined;
    createBackup?: boolean | undefined;
}>;
export type AutoSyncRequest = z.infer<typeof AutoSyncRequestSchema>;
/**
 * Schema for health check request
 */
export declare const HealthCheckRequestSchema: z.ZodObject<{
    workspacePath: z.ZodString;
    includePatterns: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    workspacePath: string;
    includePatterns?: string[] | undefined;
}, {
    workspacePath: string;
    includePatterns?: string[] | undefined;
}>;
export type HealthCheckRequest = z.infer<typeof HealthCheckRequestSchema>;
//# sourceMappingURL=types.d.ts.map