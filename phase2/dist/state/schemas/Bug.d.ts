/**
 * Bug schema - represents a defect or issue
 */
import { BugId, FeatureId, Timestamp, Priority, Severity, WorkflowId } from '../../types/common';
export interface Bug {
    id: BugId;
    type: 'bug';
    title: string;
    description: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    createdBy: string;
    status: BugStatus;
    currentPhase: BugPhase;
    workflow: WorkflowId;
    severity: Severity;
    priority: Priority;
    category: string;
    tags: string[];
    environment: Environment;
    reproducibility: Reproducibility;
    stepsToReproduce?: string;
    affectedFeatures: FeatureId[];
    duplicateOf?: BugId;
    relatedBugs: BugId[];
    rootCause?: RootCauseInfo;
    resolution?: ResolutionInfo;
    progress: BugProgress;
    artifacts: BugArtifacts;
    estimates: BugEstimates;
    custom: Record<string, any>;
}
export type BugStatus = 'open' | 'in-progress' | 'fixed' | 'verified' | 'closed' | 'wont-fix' | 'duplicate';
export type BugPhase = 'triage' | 'analysis' | 'fix-implementation' | 'testing' | 'verification' | 'complete';
export type Reproducibility = 'always' | 'sometimes' | 'rarely' | 'unable';
export interface Environment {
    os: string;
    version: string;
    additionalInfo?: Record<string, string>;
}
export type RootCauseCategory = 'logic-error' | 'race-condition' | 'memory-leak' | 'configuration' | 'dependency' | 'performance' | 'security' | 'data-corruption' | 'integration-failure' | 'ui-ux' | 'other';
export interface RootCauseInfo {
    analysis: string;
    category: RootCauseCategory;
    analyzedBy: 'human' | 'agent';
    analyzedAt: Timestamp;
    confidence: number;
}
export type ResolutionType = 'fixed' | 'wont-fix' | 'duplicate' | 'works-as-designed' | 'cannot-reproduce';
export interface ResolutionInfo {
    type: ResolutionType;
    description: string;
    resolvedAt: Timestamp;
    resolvedBy: string;
    verifiedAt?: Timestamp;
    verifiedBy?: string;
}
export interface BugProgress {
    phasesCompleted: BugPhase[];
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
}
export interface QualityGateResult {
    gateId: string;
    gateName: string;
    passed: boolean;
    score: number;
    checkedAt: Timestamp;
    details: QualityGateDetail[];
}
export interface QualityGateDetail {
    check: string;
    passed: boolean;
    message: string;
    severity: 'error' | 'warning' | 'info';
}
export interface BugArtifacts {
    branch?: string;
    commits: string[];
    pullRequests: string[];
    tests: string[];
    logs: string[];
}
export interface BugEstimates {
    originalHours?: number;
    actualHours?: number;
}
/**
 * Data required to create a new bug
 */
export interface CreateBugData {
    title: string;
    description: string;
    severity: Severity;
    priority: Priority;
    category: string;
    environment: Environment;
    reproducibility: Reproducibility;
    stepsToReproduce?: string;
    tags?: string[];
    custom?: Record<string, any>;
}
/**
 * Validate bug data
 */
export declare function validateBug(bug: Bug): string[];
/**
 * Generate next bug ID
 */
export declare function generateBugId(existingIds: BugId[]): BugId;
//# sourceMappingURL=Bug.d.ts.map