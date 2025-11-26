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
import type { FileModificationInfo, GitStatus } from './types.js';
/**
 * Git Integration Manager
 *
 * Wraps simple-git with workspace-specific operations
 */
export declare class GitIntegration {
    private git;
    private _workspacePath;
    /**
     * Initialize git integration for workspace
     *
     * @param workspacePath - Absolute path to git repository root
     */
    constructor(workspacePath: string);
    /**
     * Get workspace path
     */
    get workspacePath(): string;
    /**
     * Verify workspace is a git repository
     *
     * @returns True if workspace is a git repository
     */
    isRepository(): Promise<boolean>;
    /**
     * Get repository status
     *
     * @returns Git repository status information
     */
    getStatus(): Promise<GitStatus>;
    /**
     * Get file modification information from git history
     *
     * @param filePath - Relative path to file from workspace root
     * @returns File modification information
     */
    getFileModificationInfo(filePath: string): Promise<FileModificationInfo | null>;
    /**
     * Get all files changed since a specific date
     *
     * @param since - Date to check changes since
     * @param patterns - Glob patterns to filter files (optional)
     * @returns Array of changed file paths
     */
    getChangedFilesSince(since: Date, patterns?: string[]): Promise<string[]>;
    /**
     * Get files modified between two commits
     *
     * @param fromCommit - Starting commit hash
     * @param toCommit - Ending commit hash (default: HEAD)
     * @returns Array of modified file paths
     */
    getFilesBetweenCommits(fromCommit: string, toCommit?: string): Promise<string[]>;
    /**
     * Check if file exists in repository
     *
     * @param filePath - Relative path to file from workspace root
     * @returns True if file exists in git
     */
    fileExistsInRepo(filePath: string): Promise<boolean>;
    /**
     * Get commit count for a file
     *
     * @param filePath - Relative path to file from workspace root
     * @returns Number of commits that modified this file
     */
    getCommitCount(filePath: string): Promise<number>;
    /**
     * Get time since last modification
     *
     * @param filePath - Relative path to file from workspace root
     * @returns Days since last modification, or null if file not found
     */
    getDaysSinceLastModification(filePath: string): Promise<number | null>;
    /**
     * Compare modification times of two files
     *
     * @param file1 - First file path
     * @param file2 - Second file path
     * @returns Negative if file1 is older, positive if file2 is older, 0 if same
     */
    compareModificationTimes(file1: string, file2: string): Promise<number>;
}
/**
 * Create a GitIntegration instance for a workspace
 *
 * @param workspacePath - Absolute path to workspace
 * @returns GitIntegration instance
 * @throws Error if workspace is not a git repository
 */
export declare function createGitIntegration(workspacePath: string): Promise<GitIntegration>;
//# sourceMappingURL=git-integration.d.ts.map