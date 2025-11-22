/**
 * Workflow schemas index
 * Exports all workflow-related schemas and types
 */

// Workflow Template
export type {
  WorkflowTemplate,
  PhaseDefinition,
  TransitionRule,
  Condition,
  ConditionType,
  ConditionOperator,
  TransitionAction,
  TransitionActionType,
  QualityGateDefinition,
  QualityCheck,
  QualityCheckType,
  ChecklistDefinition,
  ChecklistItemDefinition
} from './WorkflowTemplate';

export {
  STANDARD_FEATURE_WORKFLOW,
  STANDARD_BUG_WORKFLOW,
  validateWorkflowTemplate
} from './WorkflowTemplate';

// Workflow Instance
export type {
  WorkflowInstance,
  WorkflowStatus,
  PhaseHistoryEntry,
  WorkflowChecklist,
  WorkflowQualityGateResult,
  QualityCheckResult,
  WorkflowApproval,
  WorkflowTransition,
  ConditionCheckResult,
  ActionExecutionResult
} from './WorkflowInstance';

export {
  createWorkflowInstance,
  validateWorkflowInstance,
  calculateWorkflowStatistics
} from './WorkflowInstance';
