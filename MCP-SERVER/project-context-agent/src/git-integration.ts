/**
 * Git Integration Module
 * 
 * Provides git operations for drift detection:
 * - File modification timestamps
 * - Commit history analysis
 * - Changed files detection
 * - Repository status
 * 
 * @module git-integration
 */

import simpleGit, { SimpleGit } from 'simple-git';
import type { FileModificationInfo, GitStatus } from './types.js';

/**
 * Git Integration Manager
 * 
 * Wraps simple-git with workspace-specific operations
 */
export class GitIntegration {
  private git: SimpleGit;
  private _workspacePath: string;

  /**
   * Initialize git integration for workspace
   * 
   * @param workspacePath - Absolute path to git repository root
   */
  constructor(workspacePath: string) {
    this._workspacePath = workspacePath;
    this.git = simpleGit(workspacePath);
  }

  /**
   * Get workspace path
   */
  get workspacePath(): string {
    return this._workspacePath;
  }

  /**
   * Verify workspace is a git repository
   * 
   * @returns True if workspace is a git repository
   */
  async isRepository(): Promise<boolean> {
    try {
      await this.git.status();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get repository status
   * 
   * @returns Git repository status information
   */
  async getStatus(): Promise<GitStatus> {
    const status = await this.git.status();
    const log = await this.git.log({ maxCount: 1 });
    const latestCommit = log.latest;

    return {
      isRepository: true,
      hasUncommittedChanges: !status.isClean(),
      currentBranch: status.current || 'unknown',
      lastCommit: {
        hash: latestCommit?.hash || '',
        message: latestCommit?.message || '',
        author: latestCommit?.author_name || '',
        date: latestCommit?.date ? new Date(latestCommit.date) : new Date(),
      },
    };
  }

  /**
   * Get file modification information from git history
   * 
   * @param filePath - Relative path to file from workspace root
   * @returns File modification information
   */
  async getFileModificationInfo(filePath: string): Promise<FileModificationInfo | null> {
    try {
      const log = await this.git.log({ file: filePath, maxCount: 1 });
      const latestCommit = log.latest;

      if (!latestCommit) {
        return null;
      }

      // Get lines changed in last commit for this file
      let linesChanged = 0;
      try {
        const diff = await this.git.diff(['--numstat', `${latestCommit.hash}^`, latestCommit.hash, '--', filePath]);
        const lines = diff.split('\n')[0]?.split('\t');
        if (lines && lines.length >= 2) {
          linesChanged = parseInt(lines[0] || '0') + parseInt(lines[1] || '0');
        }
      } catch {
        // Ignore diff errors for first commit
      }

      return {
        filePath,
        lastModified: new Date(latestCommit.date),
        lastCommit: latestCommit.hash,
        author: latestCommit.author_name,
        commitMessage: latestCommit.message,
        linesChanged,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Get all files changed since a specific date
   * 
   * @param since - Date to check changes since
   * @param patterns - Glob patterns to filter files (optional)
   * @returns Array of changed file paths
   */
  async getChangedFilesSince(since: Date, patterns?: string[]): Promise<string[]> {
    try {
      const sinceStr = since.toISOString();
      const log = await this.git.log({ '--since': sinceStr });

      const changedFiles = new Set<string>();

      for (const commit of log.all) {
        const diff = await this.git.diff(['--name-only', `${commit.hash}^`, commit.hash]);
        const files = diff.split('\n').filter(f => f.trim());
        
        for (const file of files) {
          if (patterns && patterns.length > 0) {
            // Simple pattern matching (would use minimatch in production)
            const matches = patterns.some(pattern => {
              const regex = new RegExp(pattern.replace('*', '.*'));
              return regex.test(file);
            });
            if (matches) {
              changedFiles.add(file);
            }
          } else {
            changedFiles.add(file);
          }
        }
      }

      return Array.from(changedFiles);
    } catch (error) {
      return [];
    }
  }

  /**
   * Get files modified between two commits
   * 
   * @param fromCommit - Starting commit hash
   * @param toCommit - Ending commit hash (default: HEAD)
   * @returns Array of modified file paths
   */
  async getFilesBetweenCommits(fromCommit: string, toCommit: string = 'HEAD'): Promise<string[]> {
    try {
      const diff = await this.git.diff(['--name-only', fromCommit, toCommit]);
      return diff.split('\n').filter(f => f.trim());
    } catch (error) {
      return [];
    }
  }

  /**
   * Check if file exists in repository
   * 
   * @param filePath - Relative path to file from workspace root
   * @returns True if file exists in git
   */
  async fileExistsInRepo(filePath: string): Promise<boolean> {
    try {
      await this.git.show([`HEAD:${filePath}`]);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get commit count for a file
   * 
   * @param filePath - Relative path to file from workspace root
   * @returns Number of commits that modified this file
   */
  async getCommitCount(filePath: string): Promise<number> {
    try {
      const log = await this.git.log({ file: filePath });
      return log.total;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get time since last modification
   * 
   * @param filePath - Relative path to file from workspace root
   * @returns Days since last modification, or null if file not found
   */
  async getDaysSinceLastModification(filePath: string): Promise<number | null> {
    const info = await this.getFileModificationInfo(filePath);
    if (!info) {
      return null;
    }

    const now = new Date();
    const diffMs = now.getTime() - info.lastModified.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Compare modification times of two files
   * 
   * @param file1 - First file path
   * @param file2 - Second file path
   * @returns Negative if file1 is older, positive if file2 is older, 0 if same
   */
  async compareModificationTimes(file1: string, file2: string): Promise<number> {
    const info1 = await this.getFileModificationInfo(file1);
    const info2 = await this.getFileModificationInfo(file2);

    if (!info1 || !info2) {
      return 0;
    }

    return info1.lastModified.getTime() - info2.lastModified.getTime();
  }
}

/**
 * Create a GitIntegration instance for a workspace
 * 
 * @param workspacePath - Absolute path to workspace
 * @returns GitIntegration instance
 * @throws Error if workspace is not a git repository
 */
export async function createGitIntegration(workspacePath: string): Promise<GitIntegration> {
  const git = new GitIntegration(workspacePath);
  
  if (!await git.isRepository()) {
    throw new Error(`Workspace is not a git repository: ${workspacePath}`);
  }

  return git;
}
