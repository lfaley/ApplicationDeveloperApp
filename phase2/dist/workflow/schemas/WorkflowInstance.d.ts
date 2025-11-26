/**
 * Workflow Instance Schema
 * Represents the runtime state of a workflow for a specific work item
 */
import { WorkItemId, WorkflowId, Timestamp } from '../../types/common';
import { FeaturePhase } from '../../state/schemas/Feature';
import { BugPhase } from '../../state/schemas/Bug';
import { ChecklistItem } from '../../state/schemas/Feature';
/**
 * Workflow instance - tracks execution state
 */
export interface WorkflowInstance {
    id: string;
    workflowTemplateId: WorkflowId;
    workItemId: WorkItemId;
    workItemType: 'feature' | 'bug';
    currentPhaseId: string;
    currentPhase: FeaturePhase | BugPhase;
    status: WorkflowStatus;
    startedAt: Timestamp;
    completedAt?: Timestamp;
    currentPhaseStartedAt: Timestamp;
    phaseHistory: PhaseHistoryEntry[];
    checklists: WorkflowChecklist[];
    qualityGateResults: WorkflowQualityGateResult[];
    approvals: WorkflowApproval[];
    custom: Record<string, any>;
}
export type WorkflowStatus = 'active' | 'paused' | 'blocked' | 'completed' | 'cancelled' | 'failed';
/**
 * Phase history entry
 */
export interface PhaseHistoryEntry {
    phaseId: string;
    phaseName: string;
    phase: FeaturePhase | BugPhase;
    startedAt: Timestamp;
    completedAt?: Timestamp;
    duration?: number;
    outcome: 'completed' | 'skipped' | 'failed' | 'cancelled';
    outcomeReason?: string;
    transitionedBy: string;
    transitionType: 'manual' | 'automatic';
    notes?: string;
}
/**
 * Workflow checklist instance
 */
export interface WorkflowChecklist {
    checklistId: string;
    checklistName: string;
    items: ChecklistItem[];
    totalItems: number;
    completedItems: number;
    requiredItems: number;
    completedRequiredItems: number;
    isComplete: boolean;
    isMandatory: boolean;
    startedAt?: Timestamp;
    completedAt?: Timestamp;
}
/**
 * Quality gate result instance
 */
export interface WorkflowQualityGateResult {
    gateId: string;
    gateName: string;
    passed: boolean;
    score: number;
    passingScore: number;
    evaluatedAt: Timestamp;
    evaluatedBy: string;
    checks: QualityCheckResult[];
    bypassed?: {
        bypassedAt: Timestamp;
        bypassedBy: string;
        reason: string;
        approvedBy?: string;
    };
}
/**
 * Individual quality check result
 */
export interface QualityCheckResult {
    checkId: string;
    checkName: string;
    passed: boolean;
    score: number;
    message: string;
    severity: 'error' | 'warning' | 'info';
    isRequired: boolean;
    canAutoFix: boolean;
    autoFixed?: {
        fixedAt: Timestamp;
        fixedBy: string;
    };
}
/**
 * Workflow approval
 */
export interface WorkflowApproval {
    id: string;
    type: 'phase-transition' | 'quality-gate-bypass' | 'deployment' | 'custom';
    phaseId?: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    requestedBy: string;
    requestedAt: Timestamp;
    respondedBy?: string;
    respondedAt?: Timestamp;
    comments?: string;
}
/**
 * Workflow transition event
 */
export interface WorkflowTransition {
    id: string;
    workflowInstanceId: string;
    fromPhaseId: string;
    fromPhase: FeaturePhase | BugPhase;
    toPhaseId: string;
    toPhase: FeaturePhase | BugPhase;
    triggeredAt: Timestamp;
    completedAt?: Timestamp;
    triggeredBy: string;
    triggerType: 'manual' | 'automatic';
    status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'cancelled';
    conditionsChecked: ConditionCheckResult[];
    allConditionsMet: boolean;
    actionsExecuted: ActionExecutionResult[];
    error?: string;
}
/**
 * Condition check result
 */
export interface ConditionCheckResult {
    conditionId: string;
    conditionType: string;
    passed: boolean;
    actualValue: any;
    expectedValue: any;
    message: string;
    checkedAt: Timestamp;
}
/**
 * Action execution result
 */
export interface ActionExecutionResult {
    actionId: string;
    actionType: string;
    success: boolean;
    output?: any;
    error?: string;
    executedAt: Timestamp;
    duration: number;
}
/**
 * Create a new workflow instance
 */
export declare function createWorkflowInstance(workflowTemplateId: WorkflowId, workItemId: WorkItemId, workItemType: 'feature' | 'bug', initialPhaseId: string, initialPhase: FeaturePhase | BugPhase): WorkflowInstance;
/**
 * Validate workflow instance
 */
export declare function validateWorkflowInstance(instance: WorkflowInstance): string[];
/**
 * Calculate workflow instance statistics
 */
export declare function calculateWorkflowStatistics(instance: WorkflowInstance): {
    totalDuration?: number;
    currentPhaseDuration: number;
    completedPhases: number;
    totalPhases: number;
    checklistCompletion: number;
    qualityGatesPass: number;
    qualityGatesTotal: number;
    pendingApprovals: number;
};
//# sourceMappingURL=WorkflowInstance.d.ts.map