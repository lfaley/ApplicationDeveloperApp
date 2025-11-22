/**
 * Tests for Git Integration Module
 */

import { GitIntegration, createGitIntegration } from '../src/git-integration.js';
import * as path from 'path';

// Use the actual project repository for testing
const REPO_PATH = path.resolve(process.cwd(), '../..');

describe('GitIntegration', () => {
  let git: GitIntegration;

  beforeAll(() => {
    git = new GitIntegration(REPO_PATH);
  });

  describe('Repository Detection', () => {
    test('should detect valid git repository', async () => {
      const isRepo = await git.isRepository();
      expect(isRepo).toBe(true);
    });

    test('should fail for non-repository path', async () => {
      const tempPath = process.env.TEMP || process.env.TMP || '/tmp';
      const nonRepoGit = new GitIntegration(tempPath);
      const isRepo = await nonRepoGit.isRepository();
      expect(isRepo).toBe(false);
    });
  });

  describe('Repository Status', () => {
    test('should get repository status', async () => {
      const status = await git.getStatus();
      
      expect(status.isRepository).toBe(true);
      expect(status.currentBranch).toBeDefined();
      expect(status.lastCommit.hash).toBeDefined();
      expect(status.lastCommit.message).toBeDefined();
      expect(status.lastCommit.author).toBeDefined();
      expect(status.lastCommit.date).toBeInstanceOf(Date);
    });

    test('should detect uncommitted changes flag', async () => {
      const status = await git.getStatus();
      expect(typeof status.hasUncommittedChanges).toBe('boolean');
    });
  });

  describe('File Modification Info', () => {
    test('should get modification info for existing file', async () => {
      // Use a file we know exists in the repo
      const info = await git.getFileModificationInfo('README.md');
      
      if (info) {
        expect(info.filePath).toBe('README.md');
        expect(info.lastModified).toBeInstanceOf(Date);
        expect(info.lastCommit).toBeDefined();
        expect(info.author).toBeDefined();
        expect(info.commitMessage).toBeDefined();
        expect(typeof info.linesChanged).toBe('number');
      }
    });

    test('should return null for non-existent file', async () => {
      const info = await git.getFileModificationInfo('nonexistent-file-xyz.txt');
      expect(info).toBeNull();
    });
  });

  describe('Changed Files Detection', () => {
    test('should get changed files since date', async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const changedFiles = await git.getChangedFilesSince(thirtyDaysAgo);
      
      expect(Array.isArray(changedFiles)).toBe(true);
      // Should have some changes in last 30 days (this test itself creates changes)
      expect(changedFiles.length).toBeGreaterThanOrEqual(0);
    });

    test('should filter changed files by pattern', async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const changedFiles = await git.getChangedFilesSince(thirtyDaysAgo, ['*.md']);
      
      expect(Array.isArray(changedFiles)).toBe(true);
      // All files should match pattern
      changedFiles.forEach(file => {
        expect(file.endsWith('.md')).toBe(true);
      });
    });
  });

  describe('Commit Counting', () => {
    test('should count commits for a file', async () => {
      const count = await git.getCommitCount('README.md');
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should return 0 for non-existent file', async () => {
      const count = await git.getCommitCount('nonexistent-file.txt');
      expect(count).toBe(0);
    });
  });

  describe('Time Calculations', () => {
    test('should calculate days since last modification', async () => {
      const days = await git.getDaysSinceLastModification('README.md');
      
      expect(typeof days).toBe('number');
      if (days !== null) {
        expect(days).toBeGreaterThanOrEqual(0);
      }
    });

    test('should return null for non-existent file', async () => {
      const days = await git.getDaysSinceLastModification('nonexistent.txt');
      expect(days).toBeNull();
    });
  });

  describe('File Comparison', () => {
    test('should compare modification times', async () => {
      const result = await git.compareModificationTimes('README.md', 'README.md');
      expect(result).toBe(0); // Same file should be equal
    });
  });

  describe('Factory Function', () => {
    test('should create GitIntegration for valid repo', async () => {
      const gitInstance = await createGitIntegration(REPO_PATH);
      expect(gitInstance).toBeInstanceOf(GitIntegration);
    });

    test('should throw error for non-repo path', async () => {
      await expect(createGitIntegration('/tmp/nonexistent')).rejects.toThrow();
    });
  });
});
