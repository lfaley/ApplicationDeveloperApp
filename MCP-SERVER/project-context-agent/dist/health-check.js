/**
 * Context Health Module
 *
 * Calculates health scores for documentation coverage and quality
 *
 * @module health-check
 */
/**
 * Health Check Engine
 *
 * Evaluates overall documentation health
 */
export class HealthChecker {
    detector;
    constructor(_git, detector) {
        this.detector = detector;
    }
    /**
     * Calculate context health score
     *
     * @param options - Health check options
     * @returns Health score and analysis
     */
    async calculateHealth(options = {}) {
        void options; // For future use
        // Get drift analysis
        const driftResult = await this.detector.detectDrift();
        // Calculate individual factors
        const documentationCoverage = this.calculateCoverage(driftResult);
        const documentationFreshness = this.calculateFreshness(driftResult);
        const consistencyScore = this.calculateConsistency(driftResult);
        const completenessScore = this.calculateCompleteness(driftResult);
        // Calculate overall score (weighted average)
        const score = Math.round(documentationCoverage * 0.3 +
            documentationFreshness * 0.3 +
            consistencyScore * 0.2 +
            completenessScore * 0.2);
        // Determine grade
        const grade = this.scoreToGrade(score);
        // Identify issues and strengths
        const issues = this.identifyIssues(driftResult, {
            documentationCoverage,
            documentationFreshness,
            consistencyScore,
            completenessScore,
        });
        const strengths = this.identifyStrengths({
            documentationCoverage,
            documentationFreshness,
            consistencyScore,
            completenessScore,
        });
        return {
            score,
            grade,
            factors: {
                documentationCoverage,
                documentationFreshness,
                consistencyScore,
                completenessScore,
            },
            issues,
            strengths,
        };
    }
    /**
     * Calculate documentation coverage (% of code files with docs)
     */
    calculateCoverage(driftResult) {
        const missingCount = driftResult.driftItems.filter(d => d.type === 'missing').length;
        const totalFiles = driftResult.scannedFiles;
        if (totalFiles === 0)
            return 100;
        const coveredFiles = totalFiles - missingCount;
        return Math.round((coveredFiles / totalFiles) * 100);
    }
    /**
     * Calculate documentation freshness (how up-to-date docs are)
     */
    calculateFreshness(driftResult) {
        const outdatedCount = driftResult.driftItems.filter(d => d.type === 'outdated').length;
        const totalDocs = driftResult.scannedFiles -
            driftResult.driftItems.filter(d => d.type === 'missing').length;
        if (totalDocs === 0)
            return 100;
        const freshDocs = totalDocs - outdatedCount;
        return Math.round((freshDocs / totalDocs) * 100);
    }
    /**
     * Calculate consistency score (no orphaned or inconsistent docs)
     */
    calculateConsistency(driftResult) {
        const inconsistentCount = driftResult.driftItems.filter(d => d.type === 'orphaned' || d.type === 'inconsistent').length;
        const totalDocs = driftResult.scannedFiles;
        if (totalDocs === 0)
            return 100;
        // Penalty for inconsistencies
        const penalty = (inconsistentCount / totalDocs) * 100;
        return Math.max(0, Math.round(100 - penalty));
    }
    /**
     * Calculate completeness score (quality and detail of docs)
     */
    calculateCompleteness(driftResult) {
        // Based on severity distribution
        const { critical, high, medium, low, totalDrifts } = driftResult.summary;
        if (totalDrifts === 0)
            return 100;
        // Weight critical issues more heavily
        const weightedIssues = (critical * 4) + (high * 3) + (medium * 2) + (low * 1);
        const maxPossibleWeight = totalDrifts * 4;
        const score = 100 - Math.round((weightedIssues / maxPossibleWeight) * 100);
        return Math.max(0, score);
    }
    /**
     * Convert numeric score to letter grade
     */
    scoreToGrade(score) {
        if (score >= 90)
            return 'A';
        if (score >= 80)
            return 'B';
        if (score >= 70)
            return 'C';
        if (score >= 60)
            return 'D';
        return 'F';
    }
    /**
     * Identify specific issues from analysis
     */
    identifyIssues(driftResult, factors) {
        const issues = [];
        if (factors.documentationCoverage < 80) {
            const missingCount = driftResult.driftItems.filter(d => d.type === 'missing').length;
            issues.push(`Low documentation coverage: ${missingCount} files without documentation`);
        }
        if (factors.documentationFreshness < 80) {
            const outdatedCount = driftResult.driftItems.filter(d => d.type === 'outdated').length;
            issues.push(`Documentation is outdated in ${outdatedCount} files`);
        }
        if (factors.consistencyScore < 80) {
            const orphanedCount = driftResult.driftItems.filter(d => d.type === 'orphaned').length;
            issues.push(`${orphanedCount} orphaned documentation files found`);
        }
        if (driftResult.summary.critical > 0) {
            issues.push(`${driftResult.summary.critical} critical drift issues require immediate attention`);
        }
        if (factors.completenessScore < 70) {
            issues.push('Documentation quality and detail need improvement');
        }
        if (issues.length === 0) {
            issues.push('No significant issues detected');
        }
        return issues;
    }
    /**
     * Identify strengths from analysis
     */
    identifyStrengths(factors) {
        const strengths = [];
        if (factors.documentationCoverage >= 90) {
            strengths.push('Excellent documentation coverage');
        }
        if (factors.documentationFreshness >= 90) {
            strengths.push('Documentation is well-maintained and up-to-date');
        }
        if (factors.consistencyScore >= 90) {
            strengths.push('High consistency between code and documentation');
        }
        if (factors.completenessScore >= 90) {
            strengths.push('Documentation is detailed and comprehensive');
        }
        if (strengths.length === 0) {
            strengths.push('Room for improvement in documentation practices');
        }
        return strengths;
    }
}
/**
 * Create a HealthChecker instance
 */
export function createHealthChecker(git, detector) {
    return new HealthChecker(git, detector);
}
//# sourceMappingURL=health-check.js.map