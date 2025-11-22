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
  id: string; // Unique instance ID
  workflowTemplateId: WorkflowId;
  workItemId: WorkItemId;
  workItemType: 'feature' | 'bug';
  
  // Current state
  currentPhaseId: string; // PhaseDefinition.id
  currentPhase: FeaturePhase | BugPhase;
  status: WorkflowStatus;
  
  // Timeline
  startedAt: Timestamp;
  completedAt?: Timestamp;
  currentPhaseStartedAt: Timestamp;
  
  // Phase history
  phaseHistory: PhaseHistoryEntry[];
  
  // Checklist progress
  checklists: WorkflowChecklist[];
  
  // Quality gate results
  qualityGateResults: WorkflowQualityGateResult[];
  
  // Approvals
  approvals: WorkflowApproval[];
  
  // Metadata
  custom: Record<string, any>;
}

export type WorkflowStatus = 
  | 'active' // Workflow in progress
  | 'paused' // Temporarily paused
  | 'blocked' // Blocked by conditions
  | 'completed' // Successfully completed
  | 'cancelled' // Cancelled before completion
  | 'failed'; // Failed due to errors

/**
 * Phase history entry
 */
export interface PhaseHistoryEntry {
  phaseId: string;
  phaseName: string;
  phase: FeaturePhase | BugPhase;
  
  // Timing
  startedAt: Timestamp;
  completedAt?: Timestamp;
  duration?: number; // milliseconds
  
  // Outcome
  outcome: 'completed' | 'skipped' | 'failed' | 'cancelled';
  outcomeReason?: string;
  
  // Transition info
  transitionedBy: string; // user or 'system'
  transitionType: 'manual' | 'automatic';
  
  // Context
  notes?: string;
}

/**
 * Workflow checklist instance
 */
export interface WorkflowChecklist {
  checklistId: string;
  checklistName: string;
  
  // Progress
  items: ChecklistItem[];
  totalItems: number;
  completedItems: number;
  requiredItems: number;
  completedRequiredItems: number;
  
  // State
  isComplete: boolean;
  isMandatory: boolean;
  
  // Timing
  startedAt?: Timestamp;
  completedAt?: Timestamp;
}

/**
 * Quality gate result instance
 */
export interface WorkflowQualityGateResult {
  gateId: string;
  gateName: string;
  
  // Result
  passed: boolean;
  score: number; // 0-100
  passingScore: number;
  
  // Evaluation
  evaluatedAt: Timestamp;
  evaluatedBy: string; // user or 'system'
  
  // Check results
  checks: QualityCheckResult[];
  
  // Bypass info (if bypassed)
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
  
  // Result
  passed: boolean;
  score: number;
  message: string;
  
  // Details
  severity: 'error' | 'warning' | 'info';
  isRequired: boolean;
  
  // Auto-fix
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
  
  // Context
  phaseId?: string;
  reason: string;
  
  // Status
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  
  // Request
  requestedBy: string;
  requestedAt: Timestamp;
  
  // Response
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
  
  // Transition details
  fromPhaseId: string;
  fromPhase: FeaturePhase | BugPhase;
  toPhaseId: string;
  toPhase: FeaturePhase | BugPhase;
  
  // Timing
  triggeredAt: Timestamp;
  completedAt?: Timestamp;
  
  // Trigger
  triggeredBy: string; // user or 'system'
  triggerType: 'manual' | 'automatic';
  
  // Status
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'cancelled';
  
  // Validation
  conditionsChecked: ConditionCheckResult[];
  allConditionsMet: boolean;
  
  // Actions
  actionsExecuted: ActionExecutionResult[];
  
  // Outcome
  error?: string;
}

/**
 * Condition check result
 */
export interface ConditionCheckResult {
  conditionId: string;
  conditionType: string;
  
  // Result
  passed: boolean;
  actualValue: any;
  expectedValue: any;
  
  // Details
  message: string;
  checkedAt: Timestamp;
}

/**
 * Action execution result
 */
export interface ActionExecutionResult {
  actionId: string;
  actionType: string;
  
  // Result
  success: boolean;
  output?: any;
  error?: string;
  
  // Timing
  executedAt: Timestamp;
  duration: number; // milliseconds
}

/**
 * Create a new workflow instance
 */
export function createWorkflowInstance(
  workflowTemplateId: WorkflowId,
  workItemId: WorkItemId,
  workItemType: 'feature' | 'bug',
  initialPhaseId: string,
  initialPhase: FeaturePhase | BugPhase
): WorkflowInstance {
  const now = new Date().toISOString();
  
  return {
    id: `WFI-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    workflowTemplateId,
    workItemId,
    workItemType,
    currentPhaseId: initialPhaseId,
    currentPhase: initialPhase,
    status: 'active',
    startedAt: now,
    currentPhaseStartedAt: now,
    phaseHistory: [],
    checklists: [],
    qualityGateResults: [],
    approvals: [],
    custom: {}
  };
}

/**
 * Validate workflow instance
 */
export function validateWorkflowInstance(instance: WorkflowInstance): string[] {
  const errors: string[] = [];
  
  if (!instance.id) {
    errors.push('Workflow instance ID is required');
  }
  
  if (!instance.workflowTemplateId) {
    errors.push('Workflow template ID is required');
  }
  
  if (!instance.workItemId) {
    errors.push('Work item ID is required');
  }
  
  if (!instance.currentPhaseId) {
    errors.push('Current phase ID is required');
  }
  
  if (!instance.startedAt) {
    errors.push('Start timestamp is required');
  }
  
  // Validate completed instances have completion timestamp
  if (instance.status === 'completed' && !instance.completedAt) {
    errors.push('Completed workflows must have completedAt timestamp');
  }
  
  return errors;
}

/**
 * Calculate workflow instance statistics
 */
export function calculateWorkflowStatistics(instance: WorkflowInstance): {
  totalDuration?: number;
  currentPhaseDuration: number;
  completedPhases: number;
  totalPhases: number;
  checklistCompletion: number;
  qualityGatesPass: number;
  qualityGatesTotal: number;
  pendingApprovals: number;
} {
  const now = Date.now();
  const startTime = new Date(instance.startedAt).getTime();
  const currentPhaseStartTime = new Date(instance.currentPhaseStartedAt).getTime();
  
  const totalDuration = instance.completedAt 
    ? new Date(instance.completedAt).getTime() - startTime
    : undefined;
  
  const currentPhaseDuration = now - currentPhaseStartTime;
  
  const completedPhases = instance.phaseHistory.filter(
    h => h.outcome === 'completed'
  ).length;
  
  const totalPhases = instance.phaseHistory.length + 1; // +1 for current phase
  
  const totalChecklistItems = instance.checklists.reduce(
    (sum, cl) => sum + cl.totalItems,
    0
  );
  const completedChecklistItems = instance.checklists.reduce(
    (sum, cl) => sum + cl.completedItems,
    0
  );
  const checklistCompletion = totalChecklistItems > 0
    ? (completedChecklistItems / totalChecklistItems) * 100
    : 0;
  
  const qualityGatesPass = instance.qualityGateResults.filter(
    qg => qg.passed || qg.bypassed
  ).length;
  const qualityGatesTotal = instance.qualityGateResults.length;
  
  const pendingApprovals = instance.approvals.filter(
    a => a.status === 'pending'
  ).length;
  
  return {
    totalDuration,
    currentPhaseDuration,
    completedPhases,
    totalPhases,
    checklistCompletion,
    qualityGatesPass,
    qualityGatesTotal,
    pendingApprovals
  };
}
