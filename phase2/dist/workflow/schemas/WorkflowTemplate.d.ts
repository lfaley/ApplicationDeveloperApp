/**
 * Workflow Template Schema
 * Defines the structure and rules for workflow execution
 */
import { FeaturePhase } from '../../state/schemas/Feature';
import { BugPhase } from '../../state/schemas/Bug';
import { WorkflowId, Timestamp } from '../../types/common';
/**
 * A workflow template defines the phases, transitions, and gates
 * for a specific type of work item
 */
export interface WorkflowTemplate {
    id: WorkflowId;
    name: string;
    description: string;
    version: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    workItemType: 'feature' | 'bug';
    phases: PhaseDefinition[];
    transitions: TransitionRule[];
    qualityGates: QualityGateDefinition[];
    checklists: ChecklistDefinition[];
    tags: string[];
    isDefault: boolean;
    isActive: boolean;
}
/**
 * Phase definition in a workflow
 */
export interface PhaseDefinition {
    id: string;
    name: string;
    phase: FeaturePhase | BugPhase;
    description: string;
    order: number;
    isOptional: boolean;
    canSkip: boolean;
    requiresApproval: boolean;
    estimatedDuration?: number;
    timeLimit?: number;
    entryConditions: Condition[];
    exitConditions: Condition[];
    checklistIds: string[];
    qualityGateIds: string[];
}
/**
 * Transition rule between phases
 */
export interface TransitionRule {
    id: string;
    name: string;
    fromPhase: string;
    toPhase: string;
    isAutomatic: boolean;
    requiresApproval: boolean;
    conditions: Condition[];
    actions: TransitionAction[];
}
/**
 * Condition to evaluate
 */
export interface Condition {
    id: string;
    type: ConditionType;
    field: string;
    operator: ConditionOperator;
    value: any;
    errorMessage?: string;
}
export type ConditionType = 'field-value' | 'quality-gate' | 'checklist' | 'time-elapsed' | 'approval' | 'custom';
export type ConditionOperator = 'equals' | 'not-equals' | 'greater-than' | 'less-than' | 'contains' | 'not-contains' | 'exists' | 'not-exists' | 'all' | 'any';
/**
 * Action to execute during transition
 */
export interface TransitionAction {
    id: string;
    type: TransitionActionType;
    config: Record<string, any>;
}
export type TransitionActionType = 'update-field' | 'send-notification' | 'create-artifact' | 'run-validation' | 'assign-reviewer' | 'update-checklist' | 'custom';
/**
 * Quality gate definition
 */
export interface QualityGateDefinition {
    id: string;
    name: string;
    description: string;
    isMandatory: boolean;
    canBypass: boolean;
    bypassRequiresApproval: boolean;
    checks: QualityCheck[];
    passingScore: number;
    evaluateOn: 'phase-entry' | 'phase-exit' | 'manual' | 'continuous';
}
/**
 * Individual quality check within a gate
 */
export interface QualityCheck {
    id: string;
    name: string;
    description: string;
    type: QualityCheckType;
    config: Record<string, any>;
    weight: number;
    severity: 'error' | 'warning' | 'info';
    isRequired: boolean;
    canAutoFix: boolean;
}
export type QualityCheckType = 'code-coverage' | 'lint-errors' | 'security-scan' | 'compliance-check' | 'documentation' | 'test-pass-rate' | 'performance-benchmark' | 'accessibility' | 'custom';
/**
 * Checklist definition
 */
export interface ChecklistDefinition {
    id: string;
    name: string;
    description: string;
    items: ChecklistItemDefinition[];
    isMandatory: boolean;
    requiresAllComplete: boolean;
    activeInPhases: string[];
}
/**
 * Checklist item definition
 */
export interface ChecklistItemDefinition {
    id: string;
    text: string;
    description?: string;
    isRequired: boolean;
    isConditional: boolean;
    condition?: Condition;
    validation?: {
        type: 'manual' | 'automated';
        validationRule?: string;
    };
    helpText?: string;
    links?: Array<{
        title: string;
        url: string;
    }>;
}
/**
 * Standard workflow templates
 */
export declare const STANDARD_FEATURE_WORKFLOW: Omit<WorkflowTemplate, 'createdAt' | 'updatedAt'>;
export declare const STANDARD_BUG_WORKFLOW: Omit<WorkflowTemplate, 'createdAt' | 'updatedAt'>;
/**
 * Validate workflow template
 */
export declare function validateWorkflowTemplate(template: WorkflowTemplate): string[];
//# sourceMappingURL=WorkflowTemplate.d.ts.map