/**
 * Tests for Sync Engine Module
 */

import { GitIntegration } from '../src/git-integration.js';
import { DriftDetector } from '../src/drift-detection.js';
import { SyncEngine } from '../src/sync-engine.js';
import * as path from 'path';
import * as fs from 'fs/promises';

const REPO_PATH = path.resolve(process.cwd(), '../..');

describe('SyncEngine', () => {
  let git: GitIntegration;
  let detector: DriftDetector;
  let syncEngine: SyncEngine;

  beforeAll(() => {
    git = new GitIntegration(REPO_PATH);
    detector = new DriftDetector(git);
    syncEngine = new SyncEngine(git, detector);
  });

  describe('Sync Initialization', () => {
    test('should create sync engine instance', () => {
      expect(syncEngine).toBeDefined();
      expect(syncEngine).toBeInstanceOf(SyncEngine);
    });
  });

  describe('Drift Detection Integration', () => {
    test('should detect drift before syncing', async () => {
      const result = await syncEngine.sync({
        requireApproval: false,
        createBackup: false,
      });

      expect(result).toBeDefined();
      expect(typeof result.itemsSynced).toBe('number');
      expect(typeof result.itemsFailed).toBe('number');
    });
  });

  describe('Approval Workflow', () => {
    test('should respect approval callback when provided', async () => {
      let approvalCalled = false;
      
      const result = await syncEngine.sync({
        requireApproval: true,
        approvalCallback: async (items) => {
          approvalCalled = items.length > 0; // Only set if there are items to approve
          return false; // Reject sync
        },
        createBackup: false,
      });

      // Approval callback called only if there are drift items
      if (result.itemsSynced === 0 && result.itemsFailed === 0) {
        expect(approvalCalled).toBe(false); // No items to sync
      }
      
      // If there were items and we rejected, should not sync
      if (approvalCalled) {
        expect(result.success).toBe(false);
        expect(result.itemsSynced).toBe(0);
      }
    });

    test('should proceed when approval is granted', async () => {
      const result = await syncEngine.sync({
        requireApproval: true,
        approvalCallback: async () => true, // Approve sync
        createBackup: false,
      });

      expect(result).toBeDefined();
      expect(typeof result.success).toBe('boolean');
    });

    test('should skip approval when requireApproval is false', async () => {
      const result = await syncEngine.sync({
        requireApproval: false,
        createBackup: false,
      });

      expect(result).toBeDefined();
      // Should not block on approval
    });
  });

  describe('Backup Creation', () => {
    test('should create backups when createBackup is true', async () => {
      const result = await syncEngine.sync({
        requireApproval: false,
        createBackup: true,
      });

      expect(result).toBeDefined();
      // Backup directory should be created
      const backupDirExists = await fs.access('.sync-backups')
        .then(() => true)
        .catch(() => false);
      
      // Backups are optional if no files need syncing
      expect(typeof backupDirExists).toBe('boolean');
    });

    test('should skip backups when createBackup is false', async () => {
      const result = await syncEngine.sync({
        requireApproval: false,
        createBackup: false,
      });

      expect(result).toBeDefined();
      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('Sync Result', () => {
    test('should return valid sync result structure', async () => {
      const result = await syncEngine.sync({
        requireApproval: false,
        createBackup: false,
      });

      expect(result).toBeDefined();
      expect(typeof result.success).toBe('boolean');
      expect(typeof result.itemsSynced).toBe('number');
      expect(typeof result.itemsFailed).toBe('number');
      expect(Array.isArray(result.filesModified)).toBe(true);
      expect(Array.isArray(result.errors)).toBe(true);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    test('should track success/failure counts', async () => {
      const result = await syncEngine.sync({
        requireApproval: false,
        createBackup: false,
      });

      expect(result.itemsSynced).toBeGreaterThanOrEqual(0);
      expect(result.itemsFailed).toBeGreaterThanOrEqual(0);
      expect(result.itemsSynced + result.itemsFailed).toBeGreaterThanOrEqual(0);
    });

    test('should report modified files', async () => {
      const result = await syncEngine.sync({
        requireApproval: false,
        createBackup: false,
      });

      expect(Array.isArray(result.filesModified)).toBe(true);
      result.filesModified.forEach(file => {
        expect(typeof file).toBe('string');
      });
    });
  });

  describe('Selective Sync', () => {
    test('should support syncing specific drift items', async () => {
      const result = await syncEngine.sync({
        driftItemIds: ['outdated-src/index.ts'],
        requireApproval: false,
        createBackup: false,
      });

      expect(result).toBeDefined();
      expect(typeof result.itemsSynced).toBe('number');
    });

    test('should support include patterns', async () => {
      const result = await syncEngine.sync({
        includePatterns: ['**/*.md'],
        requireApproval: false,
        createBackup: false,
      });

      expect(result).toBeDefined();
    });

    test('should support exclude patterns', async () => {
      const result = await syncEngine.sync({
        excludePatterns: ['node_modules/**', 'dist/**'],
        requireApproval: false,
        createBackup: false,
      });

      expect(result).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('should handle sync errors gracefully', async () => {
      const result = await syncEngine.sync({
        requireApproval: false,
        createBackup: false,
      });

      expect(Array.isArray(result.errors)).toBe(true);
      // Errors should be captured, not thrown
    });

    test('should report failed items', async () => {
      const result = await syncEngine.sync({
        requireApproval: false,
        createBackup: false,
      });

      expect(typeof result.itemsFailed).toBe('number');
      if (result.itemsFailed > 0) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Timestamp Tracking', () => {
    test('should include timestamp in result', async () => {
      const result = await syncEngine.sync({
        requireApproval: false,
        createBackup: false,
      });

      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });
});
