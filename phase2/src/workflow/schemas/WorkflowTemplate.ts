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
  
  // Applicable work item types
  workItemType: 'feature' | 'bug';
  
  // Workflow configuration
  phases: PhaseDefinition[];
  transitions: TransitionRule[];
  qualityGates: QualityGateDefinition[];
  checklists: ChecklistDefinition[];
  
  // Metadata
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
  
  // Phase behavior
  isOptional: boolean;
  canSkip: boolean;
  requiresApproval: boolean;
  
  // Time tracking
  estimatedDuration?: number; // hours
  timeLimit?: number; // hours
  
  // Entry/exit criteria
  entryConditions: Condition[];
  exitConditions: Condition[];
  
  // Associated checklists
  checklistIds: string[];
  
  // Associated quality gates
  qualityGateIds: string[];
}

/**
 * Transition rule between phases
 */
export interface TransitionRule {
  id: string;
  name: string;
  fromPhase: string; // PhaseDefinition.id
  toPhase: string; // PhaseDefinition.id
  
  // Transition behavior
  isAutomatic: boolean;
  requiresApproval: boolean;
  
  // Conditions that must be met
  conditions: Condition[];
  
  // Actions to execute during transition
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

export type ConditionType = 
  | 'field-value' // Check work item field value
  | 'quality-gate' // Check quality gate passed
  | 'checklist' // Check checklist completion
  | 'time-elapsed' // Check time since phase start
  | 'approval' // Check approval status
  | 'custom'; // Custom condition evaluation

export type ConditionOperator = 
  | 'equals'
  | 'not-equals'
  | 'greater-than'
  | 'less-than'
  | 'contains'
  | 'not-contains'
  | 'exists'
  | 'not-exists'
  | 'all'
  | 'any';

/**
 * Action to execute during transition
 */
export interface TransitionAction {
  id: string;
  type: TransitionActionType;
  config: Record<string, any>;
}

export type TransitionActionType = 
  | 'update-field' // Update work item field
  | 'send-notification' // Send notification
  | 'create-artifact' // Create artifact (branch, PR, etc.)
  | 'run-validation' // Run validation checks
  | 'assign-reviewer' // Assign reviewer
  | 'update-checklist' // Update checklist item
  | 'custom'; // Custom action

/**
 * Quality gate definition
 */
export interface QualityGateDefinition {
  id: string;
  name: string;
  description: string;
  
  // Gate behavior
  isMandatory: boolean;
  canBypass: boolean;
  bypassRequiresApproval: boolean;
  
  // Evaluation
  checks: QualityCheck[];
  passingScore: number; // 0-100
  
  // Timing
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
  
  // Scoring
  weight: number; // Relative weight for scoring
  severity: 'error' | 'warning' | 'info';
  
  // Behavior
  isRequired: boolean; // If true, must pass for gate to pass
  canAutoFix: boolean;
}

export type QualityCheckType = 
  | 'code-coverage' // Test coverage check
  | 'lint-errors' // Linting check
  | 'security-scan' // Security vulnerability scan
  | 'compliance-check' // Compliance rules check
  | 'documentation' // Documentation completeness
  | 'test-pass-rate' // Test pass rate
  | 'performance-benchmark' // Performance metrics
  | 'accessibility' // Accessibility standards
  | 'custom'; // Custom check

/**
 * Checklist definition
 */
export interface ChecklistDefinition {
  id: string;
  name: string;
  description: string;
  
  // Checklist items
  items: ChecklistItemDefinition[];
  
  // Behavior
  isMandatory: boolean;
  requiresAllComplete: boolean; // If false, only required items must complete
  
  // Timing
  activeInPhases: string[]; // PhaseDefinition.id[]
}

/**
 * Checklist item definition
 */
export interface ChecklistItemDefinition {
  id: string;
  text: string;
  description?: string;
  
  // Item behavior
  isRequired: boolean;
  isConditional: boolean;
  condition?: Condition;
  
  // Validation
  validation?: {
    type: 'manual' | 'automated';
    validationRule?: string;
  };
  
  // Guidance
  helpText?: string;
  links?: Array<{
    title: string;
    url: string;
  }>;
}

/**
 * Standard workflow templates
 */
export const STANDARD_FEATURE_WORKFLOW: Omit<WorkflowTemplate, 'createdAt' | 'updatedAt'> = {
  id: 'standard-feature',
  name: 'Standard Feature Workflow',
  description: 'Default workflow for feature development',
  version: '1.0.0',
  workItemType: 'feature',
  isDefault: true,
  isActive: true,
  tags: ['standard', 'feature'],
  
  phases: [
    {
      id: 'planning',
      name: 'Planning',
      phase: 'planning',
      description: 'Define requirements and plan implementation',
      order: 1,
      isOptional: false,
      canSkip: false,
      requiresApproval: false,
      entryConditions: [],
      exitConditions: [
        {
          id: 'planning-checklist-complete',
          type: 'checklist',
          field: 'planning-checklist',
          operator: 'all',
          value: true,
          errorMessage: 'Planning checklist must be complete'
        }
      ],
      checklistIds: ['planning-checklist'],
      qualityGateIds: []
    },
    {
      id: 'design',
      name: 'Design',
      phase: 'design',
      description: 'Create technical design and architecture',
      order: 2,
      isOptional: false,
      canSkip: false,
      requiresApproval: false,
      entryConditions: [],
      exitConditions: [
        {
          id: 'design-review-complete',
          type: 'quality-gate',
          field: 'design-review',
          operator: 'equals',
          value: 'passed',
          errorMessage: 'Design review must pass'
        }
      ],
      checklistIds: ['design-checklist'],
      qualityGateIds: ['design-review']
    },
    {
      id: 'implementation',
      name: 'Implementation',
      phase: 'implementation',
      description: 'Implement the feature',
      order: 3,
      isOptional: false,
      canSkip: false,
      requiresApproval: false,
      entryConditions: [],
      exitConditions: [
        {
          id: 'implementation-complete',
          type: 'checklist',
          field: 'implementation-checklist',
          operator: 'all',
          value: true
        },
        {
          id: 'code-quality-gate',
          type: 'quality-gate',
          field: 'code-quality',
          operator: 'equals',
          value: 'passed'
        }
      ],
      checklistIds: ['implementation-checklist'],
      qualityGateIds: ['code-quality']
    },
    {
      id: 'testing',
      name: 'Testing',
      phase: 'testing',
      description: 'Test the implementation',
      order: 4,
      isOptional: false,
      canSkip: false,
      requiresApproval: false,
      entryConditions: [],
      exitConditions: [
        {
          id: 'testing-complete',
          type: 'checklist',
          field: 'testing-checklist',
          operator: 'all',
          value: true
        },
        {
          id: 'test-quality-gate',
          type: 'quality-gate',
          field: 'test-quality',
          operator: 'equals',
          value: 'passed'
        }
      ],
      checklistIds: ['testing-checklist'],
      qualityGateIds: ['test-quality']
    },
    {
      id: 'review',
      name: 'Review',
      phase: 'review',
      description: 'Code review and approval',
      order: 5,
      isOptional: false,
      canSkip: false,
      requiresApproval: true,
      entryConditions: [],
      exitConditions: [
        {
          id: 'review-approved',
          type: 'approval',
          field: 'review-status',
          operator: 'equals',
          value: 'approved'
        }
      ],
      checklistIds: ['review-checklist'],
      qualityGateIds: []
    },
    {
      id: 'documentation',
      name: 'Documentation',
      phase: 'documentation',
      description: 'Create and review documentation',
      order: 6,
      isOptional: false,
      canSkip: false,
      requiresApproval: false,
      entryConditions: [],
      exitConditions: [
        {
          id: 'documentation-complete',
          type: 'checklist',
          field: 'documentation-checklist',
          operator: 'all',
          value: true
        }
      ],
      checklistIds: ['documentation-checklist'],
      qualityGateIds: ['documentation-quality']
    },
    {
      id: 'deployment',
      name: 'Deployment',
      phase: 'deployment',
      description: 'Deploy to production',
      order: 7,
      isOptional: false,
      canSkip: false,
      requiresApproval: true,
      entryConditions: [],
      exitConditions: [
        {
          id: 'deployment-successful',
          type: 'field-value',
          field: 'deployment-status',
          operator: 'equals',
          value: 'success'
        }
      ],
      checklistIds: ['deployment-checklist'],
      qualityGateIds: ['deployment-readiness']
    },
    {
      id: 'complete',
      name: 'Complete',
      phase: 'complete',
      description: 'Feature is complete',
      order: 8,
      isOptional: false,
      canSkip: false,
      requiresApproval: false,
      entryConditions: [],
      exitConditions: [],
      checklistIds: [],
      qualityGateIds: []
    }
  ],
  
  transitions: [],
  qualityGates: [],
  checklists: []
};

export const STANDARD_BUG_WORKFLOW: Omit<WorkflowTemplate, 'createdAt' | 'updatedAt'> = {
  id: 'standard-bug',
  name: 'Standard Bug Workflow',
  description: 'Default workflow for bug fixes',
  version: '1.0.0',
  workItemType: 'bug',
  isDefault: true,
  isActive: true,
  tags: ['standard', 'bug'],
  
  phases: [
    {
      id: 'triage',
      name: 'Triage',
      phase: 'triage',
      description: 'Assess and prioritize the bug',
      order: 1,
      isOptional: false,
      canSkip: false,
      requiresApproval: false,
      entryConditions: [],
      exitConditions: [
        {
          id: 'triage-complete',
          type: 'checklist',
          field: 'triage-checklist',
          operator: 'all',
          value: true
        }
      ],
      checklistIds: ['triage-checklist'],
      qualityGateIds: []
    },
    {
      id: 'analysis',
      name: 'Analysis',
      phase: 'analysis',
      description: 'Analyze root cause',
      order: 2,
      isOptional: false,
      canSkip: false,
      requiresApproval: false,
      entryConditions: [],
      exitConditions: [
        {
          id: 'root-cause-identified',
          type: 'field-value',
          field: 'rootCause',
          operator: 'exists',
          value: true
        }
      ],
      checklistIds: ['analysis-checklist'],
      qualityGateIds: []
    },
    {
      id: 'fix-implementation',
      name: 'Fix Implementation',
      phase: 'fix-implementation',
      description: 'Implement the fix',
      order: 3,
      isOptional: false,
      canSkip: false,
      requiresApproval: false,
      entryConditions: [],
      exitConditions: [
        {
          id: 'fix-implemented',
          type: 'checklist',
          field: 'fix-checklist',
          operator: 'all',
          value: true
        }
      ],
      checklistIds: ['fix-checklist'],
      qualityGateIds: ['code-quality']
    },
    {
      id: 'testing',
      name: 'Testing',
      phase: 'testing',
      description: 'Test the fix',
      order: 4,
      isOptional: false,
      canSkip: false,
      requiresApproval: false,
      entryConditions: [],
      exitConditions: [
        {
          id: 'testing-complete',
          type: 'checklist',
          field: 'testing-checklist',
          operator: 'all',
          value: true
        }
      ],
      checklistIds: ['testing-checklist'],
      qualityGateIds: ['test-quality']
    },
    {
      id: 'verification',
      name: 'Verification',
      phase: 'verification',
      description: 'Verify the fix resolves the issue',
      order: 5,
      isOptional: false,
      canSkip: false,
      requiresApproval: false,
      entryConditions: [],
      exitConditions: [
        {
          id: 'verification-passed',
          type: 'field-value',
          field: 'resolution.verifiedAt',
          operator: 'exists',
          value: true
        }
      ],
      checklistIds: ['verification-checklist'],
      qualityGateIds: []
    },
    {
      id: 'complete',
      name: 'Complete',
      phase: 'complete',
      description: 'Bug is resolved',
      order: 6,
      isOptional: false,
      canSkip: false,
      requiresApproval: false,
      entryConditions: [],
      exitConditions: [],
      checklistIds: [],
      qualityGateIds: []
    }
  ],
  
  transitions: [],
  qualityGates: [],
  checklists: []
};

/**
 * Validate workflow template
 */
export function validateWorkflowTemplate(template: WorkflowTemplate): string[] {
  const errors: string[] = [];
  
  if (!template.id) {
    errors.push('Workflow template ID is required');
  }
  
  if (!template.name) {
    errors.push('Workflow template name is required');
  }
  
  if (!template.workItemType) {
    errors.push('Work item type is required');
  }
  
  if (!template.phases || template.phases.length === 0) {
    errors.push('At least one phase is required');
  }
  
  // Validate phase order is sequential
  if (template.phases) {
    const orders = template.phases.map(p => p.order);
    const expectedOrders = Array.from({ length: orders.length }, (_, i) => i + 1);
    if (JSON.stringify([...orders].sort()) !== JSON.stringify(expectedOrders)) {
      errors.push('Phase order must be sequential starting from 1');
    }
  }
  
  return errors;
}
