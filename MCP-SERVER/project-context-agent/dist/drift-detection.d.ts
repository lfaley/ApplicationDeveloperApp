/**
 * Drift Detection Engine
 *
 * Compares code and documentation to identify drift
 *
 * @module drift-detection
 */
import { GitIntegration } from './git-integration.js';
import type { DriftDetectionResult, DriftItem, DriftSeverity } from './types.js';
/**
 * Drift Detection Engine
 *
 * Analyzes workspace to find drift between code and documentation
 */
export declare class DriftDetector {
    private git;
    constructor(git: GitIntegration);
    /**
     * Detect all drift in workspace
     *
     * @param options - Detection options
     * @returns Drift detection result
     */
    detectDrift(options?: {
        includePatterns?: string[];
        excludePatterns?: string[];
        severityThreshold?: DriftSeverity;
    }): Promise<DriftDetectionResult>;
    /**
     * Check a code/doc file pair for drift
     */
    private checkFilePairForDrift;
    /**
     * Create drift item for missing documentation
     */
    private createMissingDocDrift;
    /**
     * Create drift item for orphaned documentation
     */
    private createOrphanedDocDrift;
    /**
     * Find documentation files related to a code file
     */
    private findRelatedDocumentation;
    /**
     * Find code files related to a documentation file
     */
    private findRelatedCode;
    /**
     * Calculate severity based on time difference and change volume
     */
    private calculateSeverity;
    /**
     * Calculate overall severity from all drift items
     */
    private calculateOverallSeverity;
    /**
     * Generate actionable recommendations
     */
    private generateRecommendations;
    static publicGenerateRecommendations(driftItems: DriftItem[]): string[];
}
/**
 * Create a DriftDetector for a workspace
 */
export declare function createDriftDetector(git: GitIntegration): Promise<DriftDetector>;
//# sourceMappingURL=drift-detection.d.ts.map