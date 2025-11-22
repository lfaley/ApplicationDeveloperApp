/**
 * Sync Engine Module
 * 
 * Handles automatic synchronization of documentation with code changes
 * 
 * @module sync-engine
 */

import { GitIntegration } from './git-integration.js';
import { DriftDetector } from './drift-detection.js';
import type { DriftItem, SyncResult, SyncOptions } from './types.js';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Sync Engine
 * 
 * Orchestrates documentation synchronization with approval workflow
 */
export class SyncEngine {
  private detector: DriftDetector;

  constructor(_git: GitIntegration, detector: DriftDetector) {
    this.detector = detector;
  }

  /**
   * Synchronize documentation with code changes
   * 
   * @param options - Sync options with approval and backup settings
   * @returns Sync result with success status and modified files
   */
  async sync(options: SyncOptions): Promise<SyncResult> {
    const filesModified: string[] = [];
    const errors: string[] = [];

    try {
      // Detect drift to identify what needs syncing
      const driftResult = await this.detector.detectDrift({
        includePatterns: options.includePatterns,
        excludePatterns: options.excludePatterns,
      });

      // Filter drift items if specific IDs provided
      let itemsToSync = driftResult.driftItems;
      if (options.driftItemIds && options.driftItemIds.length > 0) {
        itemsToSync = driftResult.driftItems.filter(item =>
          options.driftItemIds?.includes(this.getDriftItemId(item))
        );
      }

      // Filter by severity threshold if provided
      if (options.severityThreshold) {
        const severityOrder = ['low', 'medium', 'high', 'critical'];
        const thresholdIndex = severityOrder.indexOf(options.severityThreshold);
        itemsToSync = itemsToSync.filter(item =>
          severityOrder.indexOf(item.severity) >= thresholdIndex
        );
      }

      if (itemsToSync.length === 0) {
        return {
          success: true,
          itemsSynced: 0,
          itemsFailed: 0,
          filesModified: [],
          errors: [],
          timestamp: new Date(),
        };
      }

      // Create backups if requested
      if (options.createBackup !== false) {
        for (const item of itemsToSync) {
          try {
            await this.createBackup(item);
          } catch (err) {
            const error = err as Error;
            errors.push(`Failed to create backup for ${item.filePath}: ${error.message}`);
          }
        }
      }

      // Sync each drift item
      let syncedCount = 0;
      let failedCount = 0;

      for (const item of itemsToSync) {
        try {
          const result = await this.syncDriftItem(item, options);
          if (result.success) {
            syncedCount++;
            filesModified.push(...result.filesModified);
          } else {
            failedCount++;
            errors.push(...result.errors);
          }
        } catch (err) {
          const error = err as Error;
          failedCount++;
          errors.push(`Failed to sync ${item.filePath}: ${error.message}`);
        }
      }

      return {
        success: failedCount === 0,
        itemsSynced: syncedCount,
        itemsFailed: failedCount,
        filesModified: [...new Set(filesModified)], // Deduplicate
        errors,
        timestamp: new Date(),
      };

    } catch (err) {
      const error = err as Error;
      return {
        success: false,
        itemsSynced: 0,
        itemsFailed: 0,
        filesModified: [],
        errors: [error.message],
        timestamp: new Date(),
      };
    }
  }

  /**
   * Sync a single drift item
   */
  private async syncDriftItem(item: DriftItem, options: SyncOptions): Promise<{
    success: boolean;
    filesModified: string[];
    errors: string[];
  }> {
    const filesModified: string[] = [];
    const errors: string[] = [];

    try {
      switch (item.type) {
        case 'outdated':
          // For outdated docs, add a notification comment
          await this.addUpdateNotification(item);
          filesModified.push(item.filePath);
          break;

        case 'missing':
          // For missing docs, create a placeholder
          if (options.autoCreateMissing) {
            await this.createDocumentationPlaceholder(item);
            if (item.relatedFiles.length > 0) {
              filesModified.push(item.relatedFiles[0]);
            }
          }
          break;

        case 'orphaned':
          // For orphaned docs, add a deprecation notice
          if (options.handleOrphaned) {
            await this.addOrphanedNotice(item);
            filesModified.push(item.filePath);
          }
          break;

        case 'inconsistent':
          // For inconsistent docs, add a review notice
          await this.addReviewNotice(item);
          filesModified.push(item.filePath);
          break;
      }

      return { success: true, filesModified, errors };
    } catch (err) {
      const error = err as Error;
      errors.push(error.message);
      return { success: false, filesModified, errors };
    }
  }

  /**
   * Create backup of file before modification
   */
  private async createBackup(item: DriftItem): Promise<string | null> {
    try {
      const filePath = item.relatedFiles[0] || item.filePath;
      const exists = await fs.access(filePath).then(() => true).catch(() => false);
      
      if (!exists) {
        return null;
      }

      const backupDir = path.join(path.dirname(filePath), '.backups');
      await fs.mkdir(backupDir, { recursive: true });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(
        backupDir,
        `${path.basename(filePath)}.${timestamp}.backup`
      );

      await fs.copyFile(filePath, backupPath);
      return backupPath;
    } catch (err) {
      // Backup failure shouldn't stop sync
      return null;
    }
  }

  /**
   * Add update notification to outdated documentation
   */
  private async addUpdateNotification(item: DriftItem): Promise<void> {
    const filePath = item.relatedFiles[0];
    if (!filePath) return;

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const notification = `\n> **⚠️ Documentation Update Needed**\n> This documentation may be outdated. Code was modified on ${item.lastCodeChange?.toISOString().split('T')[0]}.\n> Last documentation update: ${item.lastDocUpdate?.toISOString().split('T')[0]}.\n\n`;
      
      // Add notification at the top (after any front matter)
      const updatedContent = content.includes('---\n')
        ? content.replace(/---\n([\s\S]*?)---\n/, `---\n$1---\n${notification}`)
        : notification + content;

      await fs.writeFile(filePath, updatedContent, 'utf-8');
    } catch (err) {
      throw new Error(`Failed to add update notification: ${(err as Error).message}`);
    }
  }

  /**
   * Create documentation placeholder for missing docs
   */
  private async createDocumentationPlaceholder(item: DriftItem): Promise<void> {
    const codeFile = item.filePath;
    const docFile = this.getExpectedDocPath(codeFile);

    const placeholder = `# ${path.basename(codeFile)} Documentation

> **📝 Auto-generated placeholder**
> This documentation was automatically created because code exists without documentation.

## Overview

TODO: Add overview of \`${path.basename(codeFile)}\`

## Usage

TODO: Add usage examples

## API Reference

TODO: Document public APIs

---

**Related Code**: [\`${path.basename(codeFile)}\`](${path.relative(path.dirname(docFile), codeFile)})
`;

    try {
      await fs.mkdir(path.dirname(docFile), { recursive: true });
      await fs.writeFile(docFile, placeholder, 'utf-8');
    } catch (err) {
      throw new Error(`Failed to create placeholder: ${(err as Error).message}`);
    }
  }

  /**
   * Add orphaned notice to documentation
   */
  private async addOrphanedNotice(item: DriftItem): Promise<void> {
    const filePath = item.filePath;

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const notice = `\n> **⚠️ Orphaned Documentation**\n> The code referenced by this documentation may no longer exist or has been moved.\n> Please review and update or remove this documentation.\n\n`;
      
      const updatedContent = content.includes('---\n')
        ? content.replace(/---\n([\s\S]*?)---\n/, `---\n$1---\n${notice}`)
        : notice + content;

      await fs.writeFile(filePath, updatedContent, 'utf-8');
    } catch (err) {
      throw new Error(`Failed to add orphaned notice: ${(err as Error).message}`);
    }
  }

  /**
   * Add review notice to inconsistent documentation
   */
  private async addReviewNotice(item: DriftItem): Promise<void> {
    const filePath = item.relatedFiles[0] || item.filePath;

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const notice = `\n> **🔍 Review Needed**\n> This documentation may be inconsistent with the current code implementation.\n> Please review and update as needed.\n\n`;
      
      const updatedContent = content.includes('---\n')
        ? content.replace(/---\n([\s\S]*?)---\n/, `---\n$1---\n${notice}`)
        : notice + content;

      await fs.writeFile(filePath, updatedContent, 'utf-8');
    } catch (err) {
      throw new Error(`Failed to add review notice: ${(err as Error).message}`);
    }
  }

  /**
   * Get expected documentation path for a code file
   */
  private getExpectedDocPath(codeFile: string): string {
    // Convert src/module/file.ts -> docs/module/file.md
    const relativePath = codeFile.replace(/^src\//, '');
    const withoutExt = relativePath.replace(/\.(ts|js|tsx|jsx)$/, '');
    return path.join('docs', `${withoutExt}.md`);
  }

  /**
   * Generate a unique ID for a drift item
   */
  private getDriftItemId(item: DriftItem): string {
    return `${item.type}-${item.filePath}`;
  }

  /**
   * Restore files from backup
   */
  async restoreFromBackup(backupPath: string): Promise<void> {
    try {
      const originalPath = backupPath
        .replace('.backups/', '')
        .replace(/\.\d{4}-\d{2}-\d{2}T.*\.backup$/, '');

      await fs.copyFile(backupPath, originalPath);
    } catch (err) {
      throw new Error(`Failed to restore backup: ${(err as Error).message}`);
    }
  }
}

/**
 * Create a SyncEngine instance
 */
export function createSyncEngine(
  git: GitIntegration,
  detector: DriftDetector
): SyncEngine {
  return new SyncEngine(git, detector);
}
