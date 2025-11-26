/**
 * Feature schema - represents a new capability or enhancement
 */
import { FeatureId, Timestamp, Priority, Complexity, WorkflowId } from '../../types/common';
export interface Feature {
    id: FeatureId;
    type: 'feature';
    title: string;
    description: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    createdBy: string;
    status: FeatureStatus;
    currentPhase: FeaturePhase;
    workflow: WorkflowId;
    priority: Priority;
    complexity: Complexity;
    category: string;
    tags: string[];
    parentId?: FeatureId;
    dependencies: FeatureId[];
    relatedBugs: string[];
    progress: FeatureProgress;
    compliance: ComplianceInfo;
    artifacts: FeatureArtifacts;
    estimates: FeatureEstimates;
    custom: Record<string, unknown>;
}
export type FeatureStatus = 'draft' | 'active' | 'on-hold' | 'completed' | 'cancelled';
export type FeaturePhase = 'planning' | 'design' | 'implementation' | 'testing' | 'review' | 'documentation' | 'deployment' | 'complete';
export interface FeatureProgress {
    phasesCompleted: FeaturePhase[];
    checklistProgress: ChecklistProgress;
    qualityGateResults: QualityGateResult[];
}
export interface ChecklistProgress {
    total: number;
    completed: number;
    percentage: number;
    items: ChecklistItem[];
}
export interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
    completedAt?: Timestamp;
    completedBy?: string;
    required: boolean;
    conditional?: {
        field: string;
        value: unknown;
    };
}
export interface QualityGateResult {
    gateId: string;
    gateName: string;
    passed: boolean;
    score: number;
    checkedAt: Timestamp;
    details: QualityGateDetail[];
    bypassed?: {
        bypassedAt: Timestamp;
        bypassedBy: string;
        reason: string;
    };
}
export interface QualityGateDetail {
    check: string;
    passed: boolean;
    message: string;
    severity: 'error' | 'warning' | 'info';
}
export interface ComplianceInfo {
    score: number;
    lastChecked: Timestamp;
    violations: ComplianceViolation[];
}
export interface ComplianceViolation {
    rule: string;
    severity: 'error' | 'warning';
    file: string;
    line?: number;
    column?: number;
    message: string;
    autoFixable: boolean;
}
export interface FeatureArtifacts {
    branch?: string;
    commits: string[];
    pullRequests: string[];
    documentation: string[];
    tests: string[];
}
export interface FeatureEstimates {
    originalHours?: number;
    revisedHours?: number;
    actualHours?: number;
}
/**
 * Create feature data (for creation)
 */
export interface CreateFeatureData {
    title: string;
    description: string;
    priority: Priority;
    complexity: Complexity;
    category: string;
    tags?: string[];
    parentId?: FeatureId;
    custom?: Record<string, unknown>;
}
/**
 * Validate feature data
 */
export declare function validateFeature(feature: Feature): string[];
/**
 * Generate next feature ID
 */
export declare function generateFeatureId(existingIds: FeatureId[]): FeatureId;
//# sourceMappingURL=Feature.d.ts.map