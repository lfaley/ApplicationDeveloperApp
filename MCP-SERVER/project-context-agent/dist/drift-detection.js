/**
 * Drift Detection Engine
 *
 * Compares code and documentation to identify drift
 *
 * @module drift-detection
 */
import * as path from 'path';
/**
 * File patterns for documentation
 */
const DOC_PATTERNS = [
    '**/*.md',
    '**/README*',
    '**/CONTRIBUTING*',
    '**/CHANGELOG*',
    '**/*.mdx',
    '**/docs/**',
];
/**
 * File patterns for source code
 */
const CODE_PATTERNS = [
    '**/*.ts',
    '**/*.js',
    '**/*.tsx',
    '**/*.jsx',
    '**/*.py',
    '**/*.java',
    '**/*.cs',
    '**/*.cpp',
    '**/*.c',
    '**/*.go',
    '**/*.rs',
    '**/*.rb',
    '**/*.php',
];
/**
 * Drift Detection Engine
 *
 * Analyzes workspace to find drift between code and documentation
 */
export class DriftDetector {
    git;
    constructor(git) {
        this.git = git;
    }
    /**
     * Detect all drift in workspace
     *
     * @param options - Detection options
     * @returns Drift detection result
     */
    async detectDrift(options = {}) {
        const startTime = new Date();
        const driftItems = [];
        // Options will be used for filtering in future enhancements
        void options; // Acknowledged for future use
        // Get all files that have been modified recently
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const changedCodeFiles = await this.git.getChangedFilesSince(thirtyDaysAgo, CODE_PATTERNS);
        // For each changed code file, check if related docs exist and are up to date
        for (const codeFile of changedCodeFiles) {
            const relatedDocs = await this.findRelatedDocumentation(codeFile);
            for (const docFile of relatedDocs) {
                const drift = await this.checkFilePairForDrift(codeFile, docFile);
                if (drift) {
                    driftItems.push(drift);
                }
            }
            // Check for missing documentation
            if (relatedDocs.length === 0) {
                const missingDrift = await this.createMissingDocDrift(codeFile);
                driftItems.push(missingDrift);
            }
        }
        // Check for orphaned documentation
        const changedDocFiles = await this.git.getChangedFilesSince(thirtyDaysAgo, DOC_PATTERNS);
        for (const docFile of changedDocFiles) {
            const relatedCode = await this.findRelatedCode(docFile);
            if (relatedCode.length === 0) {
                const orphanedDrift = await this.createOrphanedDocDrift(docFile);
                if (orphanedDrift) {
                    driftItems.push(orphanedDrift);
                }
            }
        }
        // Calculate summary
        const summary = {
            totalDrifts: driftItems.length,
            critical: driftItems.filter(d => d.severity === 'critical').length,
            high: driftItems.filter(d => d.severity === 'high').length,
            medium: driftItems.filter(d => d.severity === 'medium').length,
            low: driftItems.filter(d => d.severity === 'low').length,
        };
        // Determine overall severity
        const overallSeverity = this.calculateOverallSeverity(driftItems);
        // Generate recommendations
        const recommendations = this.generateRecommendations(driftItems);
        return {
            hasDrift: driftItems.length > 0,
            driftItems,
            overallSeverity,
            summary,
            timestamp: startTime,
            scannedFiles: changedCodeFiles.length + changedDocFiles.length,
            recommendations,
        };
    }
    /**
     * Check a code/doc file pair for drift
     */
    async checkFilePairForDrift(codeFile, docFile) {
        const codeInfo = await this.git.getFileModificationInfo(codeFile);
        const docInfo = await this.git.getFileModificationInfo(docFile);
        if (!codeInfo || !docInfo) {
            return null;
        }
        // Check if code was modified after documentation
        const codeDays = await this.git.getDaysSinceLastModification(codeFile);
        const docDays = await this.git.getDaysSinceLastModification(docFile);
        if (codeDays === null || docDays === null) {
            return null;
        }
        // If code is newer than docs, it's potentially outdated
        if (codeInfo.lastModified > docInfo.lastModified) {
            const daysDiff = Math.abs(codeDays - docDays);
            const severity = this.calculateSeverity(daysDiff, codeInfo.linesChanged);
            return {
                type: 'outdated',
                severity,
                filePath: docFile,
                relatedFiles: [codeFile],
                relatedDocPath: codeFile,
                description: `Documentation is ${daysDiff} days behind code changes`,
                lastCodeChange: codeInfo.lastModified,
                lastDocChange: docInfo.lastModified,
                affectedElements: [], // Would be populated by content analysis
                recommendations: [
                    `Review changes in ${codeFile} since ${docInfo.lastModified.toLocaleDateString()}`,
                    `Update ${docFile} to reflect current implementation`,
                ],
            };
        }
        return null;
    }
    /**
     * Create drift item for missing documentation
     */
    async createMissingDocDrift(codeFile) {
        const codeInfo = await this.git.getFileModificationInfo(codeFile);
        const commitCount = await this.git.getCommitCount(codeFile);
        // More commits = more critical to have docs
        const severity = commitCount > 10 ? 'high' : commitCount > 5 ? 'medium' : 'low';
        return {
            type: 'missing',
            severity,
            filePath: codeFile,
            relatedFiles: [],
            description: `No documentation found for ${codeFile}`,
            lastCodeChange: codeInfo?.lastModified || new Date(),
            affectedElements: [],
            recommendations: [
                `Create README or documentation file for ${codeFile}`,
                'Document public APIs and usage examples',
            ],
        };
    }
    /**
     * Create drift item for orphaned documentation
     */
    async createOrphanedDocDrift(docFile) {
        const docInfo = await this.git.getFileModificationInfo(docFile);
        if (!docInfo) {
            return null;
        }
        return {
            type: 'orphaned',
            severity: 'low',
            filePath: docFile,
            relatedFiles: [],
            description: `Documentation exists without corresponding code`,
            lastCodeChange: new Date(), // Not applicable
            lastDocChange: docInfo.lastModified,
            affectedElements: [],
            recommendations: [
                `Verify if ${docFile} is still needed`,
                'Remove or archive if obsolete',
            ],
        };
    }
    /**
     * Find documentation files related to a code file
     */
    async findRelatedDocumentation(codeFile) {
        const dir = path.dirname(codeFile);
        const basename = path.basename(codeFile, path.extname(codeFile));
        // Common doc naming patterns
        const possibleDocs = [
            path.join(dir, 'README.md'),
            path.join(dir, `${basename}.md`),
            path.join(dir, 'docs', `${basename}.md`),
            path.join('docs', `${basename}.md`),
        ];
        const existingDocs = [];
        for (const doc of possibleDocs) {
            if (await this.git.fileExistsInRepo(doc)) {
                existingDocs.push(doc);
            }
        }
        return existingDocs;
    }
    /**
     * Find code files related to a documentation file
     */
    async findRelatedCode(docFile) {
        // Simplified - would use content analysis in production
        const dir = path.dirname(docFile);
        const basename = path.basename(docFile, '.md');
        const possibleCode = [
            path.join(dir, `${basename}.ts`),
            path.join(dir, `${basename}.js`),
            path.join(dir, 'src', `${basename}.ts`),
        ];
        const existingCode = [];
        for (const code of possibleCode) {
            if (await this.git.fileExistsInRepo(code)) {
                existingCode.push(code);
            }
        }
        return existingCode;
    }
    /**
     * Calculate severity based on time difference and change volume
     */
    calculateSeverity(daysDiff, linesChanged) {
        if (daysDiff > 30 || linesChanged > 100) {
            return 'critical';
        }
        if (daysDiff > 14 || linesChanged > 50) {
            return 'high';
        }
        if (daysDiff > 7 || linesChanged > 20) {
            return 'medium';
        }
        return 'low';
    }
    /**
     * Calculate overall severity from all drift items
     */
    calculateOverallSeverity(driftItems) {
        if (driftItems.some(d => d.severity === 'critical')) {
            return 'critical';
        }
        if (driftItems.some(d => d.severity === 'high')) {
            return 'high';
        }
        if (driftItems.some(d => d.severity === 'medium')) {
            return 'medium';
        }
        return 'low';
    }
    /**
     * Generate actionable recommendations
     */
    generateRecommendations(driftItems) {
        const recommendations = [];
        const criticalCount = driftItems.filter(d => d.severity === 'critical').length;
        const outdatedCount = driftItems.filter(d => d.type === 'outdated').length;
        const missingCount = driftItems.filter(d => d.type === 'missing').length;
        if (criticalCount > 0) {
            recommendations.push(`Address ${criticalCount} critical drift items immediately`);
        }
        if (outdatedCount > 0) {
            recommendations.push(`Update ${outdatedCount} outdated documentation files`);
        }
        if (missingCount > 0) {
            recommendations.push(`Create documentation for ${missingCount} undocumented files`);
        }
        if (driftItems.length === 0) {
            recommendations.push('Documentation is up to date!');
        }
        return recommendations;
    }
    static publicGenerateRecommendations(driftItems) {
        return driftItems.map(item => {
            switch (item.type) {
                case 'outdated':
                    return `Update documentation for ${item.filePath} to match latest code changes.`;
                case 'missing':
                    return `Add documentation for ${item.filePath}.`;
                case 'orphaned':
                    return `Remove or update orphaned documentation: ${item.relatedDocPath || item.filePath}.`;
                case 'inconsistent':
                    return `Resolve inconsistencies in documentation for ${item.filePath}.`;
                default:
                    return `Review drift item in ${item.filePath}.`;
            }
        });
    }
}
/**
 * Create a DriftDetector for a workspace
 */
export async function createDriftDetector(git) {
    return new DriftDetector(git);
}
//# sourceMappingURL=drift-detection.js.map