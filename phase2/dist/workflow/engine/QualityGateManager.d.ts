/**
 * Quality Gate Manager
 * Evaluates quality gates and performs validation checks
 */
import { Result } from '../../types/common';
import { QualityGateDefinition, QualityCheck } from '../schemas/WorkflowTemplate';
import { WorkflowInstance, WorkflowQualityGateResult, QualityCheckResult } from '../schemas/WorkflowInstance';
import { Feature } from '../../state/schemas/Feature';
import { Bug } from '../../state/schemas/Bug';
type WorkItem = Feature | Bug;
/**
 * Quality Gate Manager - evaluates quality gates and checks
 */
export declare class QualityGateManager {
    /**
     * Evaluate a quality gate
     */
    evaluateGate(gate: QualityGateDefinition, workItem: WorkItem, instance: WorkflowInstance, evaluatedBy: string): Promise<Result<WorkflowQualityGateResult>>;
    /**
     * Evaluate a single quality check
     */
    evaluateCheck(check: QualityCheck, workItem: WorkItem, instance: WorkflowInstance): Promise<QualityCheckResult>;
    /**
     * Execute specific check type
     */
    private executeCheckType;
    /**
     * Check code coverage
     */
    private checkCodeCoverage;
    /**
     * Check lint errors
     */
    private checkLintErrors;
    /**
     * Check security vulnerabilities
     */
    private checkSecurity;
    /**
     * Check compliance
     */
    private checkCompliance;
    /**
     * Check documentation completeness
     */
    private checkDocumentation;
    /**
     * Check test pass rate
     */
    private checkTestPassRate;
    /**
     * Check performance benchmarks
     */
    private checkPerformance;
    /**
     * Check accessibility standards
     */
    private checkAccessibility;
    /**
     * Execute custom check
     */
    private checkCustom;
    /**
     * Calculate overall gate score from check results
     */
    private calculateGateScore;
    /**
     * Bypass a quality gate (with approval if required)
     */
    bypassGate(gate: QualityGateDefinition, result: WorkflowQualityGateResult, bypassedBy: string, reason: string, approvedBy?: string): Promise<Result<WorkflowQualityGateResult>>;
    /**
     * Get gate status summary
     */
    getGateStatus(result: WorkflowQualityGateResult): {
        status: 'passed' | 'failed' | 'bypassed';
        message: string;
        details: string[];
    };
}
export {};
//# sourceMappingURL=QualityGateManager.d.ts.map