/**
 * Context Health Module
 *
 * Calculates health scores for documentation coverage and quality
 *
 * @module health-check
 */
import { GitIntegration } from './git-integration.js';
import { DriftDetector } from './drift-detection.js';
import type { ContextHealthScore } from './types.js';
/**
 * Health Check Engine
 *
 * Evaluates overall documentation health
 */
export declare class HealthChecker {
    private detector;
    constructor(_git: GitIntegration, detector: DriftDetector);
    /**
     * Calculate context health score
     *
     * @param options - Health check options
     * @returns Health score and analysis
     */
    calculateHealth(options?: {
        includePatterns?: string[];
    }): Promise<ContextHealthScore>;
    /**
     * Calculate documentation coverage (% of code files with docs)
     */
    private calculateCoverage;
    /**
     * Calculate documentation freshness (how up-to-date docs are)
     */
    private calculateFreshness;
    /**
     * Calculate consistency score (no orphaned or inconsistent docs)
     */
    private calculateConsistency;
    /**
     * Calculate completeness score (quality and detail of docs)
     */
    private calculateCompleteness;
    /**
     * Convert numeric score to letter grade
     */
    private scoreToGrade;
    /**
     * Identify specific issues from analysis
     */
    private identifyIssues;
    /**
     * Identify strengths from analysis
     */
    private identifyStrengths;
}
/**
 * Create a HealthChecker instance
 */
export declare function createHealthChecker(git: GitIntegration, detector: DriftDetector): HealthChecker;
//# sourceMappingURL=health-check.d.ts.map