/**
 * Assessment Module Interface
 *
 * Provides a unified interface for running project assessments: lint, test, audit, doc scan.
 * This module can be expanded to invoke the appropriate agent/tool or run custom logic.
 */
export interface AssessmentOptions {
    workspacePath: string;
    includeLint?: boolean;
    includeTestCoverage?: boolean;
    includeSecurity?: boolean;
    includeDocs?: boolean;
}
export interface AssessmentResult {
    lint?: string;
    testCoverage?: string;
    security?: string;
    docs?: string;
    summary: string;
}
/**
 * Run project assessment using orchestration workflow
 * @param options Assessment options
 * @returns AssessmentResult
 */
export declare function runAssessment(options: AssessmentOptions): Promise<AssessmentResult>;
//# sourceMappingURL=assessment.d.ts.map