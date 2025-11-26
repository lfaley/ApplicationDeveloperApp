/**
 * Sync Engine Module
 *
 * Handles automatic synchronization of documentation with code changes
 *
 * @module sync-engine
 */
import { GitIntegration } from './git-integration.js';
import { DriftDetector } from './drift-detection.js';
import type { SyncResult, SyncOptions } from './types.js';
/**
 * Sync Engine
 *
 * Orchestrates documentation synchronization with approval workflow
 */
export declare class SyncEngine {
    private detector;
    constructor(_git: GitIntegration, detector: DriftDetector);
    /**
     * Synchronize documentation with code changes
     *
     * @param options - Sync options with approval and backup settings
     * @returns Sync result with success status and modified files
     */
    sync(options: SyncOptions): Promise<SyncResult>;
    /**
     * Sync a single drift item
     */
    private syncDriftItem;
    /**
     * Create backup of file before modification
     */
    private createBackup;
    /**
     * Add update notification to outdated documentation
     */
    private addUpdateNotification;
    /**
     * Create documentation placeholder for missing docs
     */
    private createDocumentationPlaceholder;
    /**
     * Add orphaned notice to documentation
     */
    private addOrphanedNotice;
    /**
     * Add review notice to inconsistent documentation
     */
    private addReviewNotice;
    /**
     * Get expected documentation path for a code file
     */
    private getExpectedDocPath;
    /**
     * Generate a unique ID for a drift item
     */
    private getDriftItemId;
    /**
     * Restore files from backup
     */
    restoreFromBackup(backupPath: string): Promise<void>;
}
/**
 * Create a SyncEngine instance
 */
export declare function createSyncEngine(git: GitIntegration, detector: DriftDetector): SyncEngine;
//# sourceMappingURL=sync-engine.d.ts.map