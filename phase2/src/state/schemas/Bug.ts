/**
 * Bug schema - represents a defect or issue
 */

import { BugId, FeatureId, Timestamp, Priority, Severity, WorkflowId } from '../../types/common';

export interface Bug {
  // Identity
  id: BugId;
  type: 'bug';
  
  // Metadata
  title: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  
  // Workflow
  status: BugStatus;
  currentPhase: BugPhase;
  workflow: WorkflowId;
  
  // Classification
  severity: Severity;
  priority: Priority;
  category: string;
  tags: string[];
  
  // Bug specifics
  environment: Environment;
  reproducibility: Reproducibility;
  stepsToReproduce?: string;
  
  // Relationships
  affectedFeatures: FeatureId[];
  duplicateOf?: BugId;
  relatedBugs: BugId[];
  
  // Analysis
  rootCause?: RootCauseInfo;
  
  // Resolution
  resolution?: ResolutionInfo;
  
  // Progress tracking
  progress: BugProgress;
  
  // Artifacts
  artifacts: BugArtifacts;
  
  // Estimates
  estimates: BugEstimates;
  
  // Custom fields
  custom: Record<string, any>;
}

export type BugStatus = 
  | 'open'
  | 'in-progress'
  | 'fixed'
  | 'verified'
  | 'closed'
  | 'wont-fix'
  | 'duplicate';

export type BugPhase = 
  | 'triage'
  | 'analysis'
  | 'fix-implementation'
  | 'testing'
  | 'verification'
  | 'complete';

export type Reproducibility = 'always' | 'sometimes' | 'rarely' | 'unable';

export interface Environment {
  os: string;
  version: string;
  additionalInfo?: Record<string, string>;
}

export type RootCauseCategory = 
  | 'logic-error'
  | 'race-condition'
  | 'memory-leak'
  | 'configuration'
  | 'dependency'
  | 'performance'
  | 'security'
  | 'data-corruption'
  | 'integration-failure'
  | 'ui-ux'
  | 'other';

export interface RootCauseInfo {
  analysis: string;
  category: RootCauseCategory;
  analyzedBy: 'human' | 'agent';
  analyzedAt: Timestamp;
  confidence: number; // 0-1
}

export type ResolutionType = 
  | 'fixed'
  | 'wont-fix'
  | 'duplicate'
  | 'works-as-designed'
  | 'cannot-reproduce';

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
export function validateBug(bug: Bug): string[] {
  const errors: string[] = [];
  
  if (!bug.id || !bug.id.match(/^BUG-\d{3,}$/)) {
    errors.push('Invalid bug ID format. Expected: BUG-XXX');
  }
  
  if (!bug.title || bug.title.trim().length === 0) {
    errors.push('Bug title is required');
  }
  
  if (!bug.description || bug.description.trim().length === 0) {
    errors.push('Bug description is required');
  }
  
  if (!bug.createdAt) {
    errors.push('createdAt timestamp is required');
  }
  
  if (!bug.createdBy) {
    errors.push('createdBy is required');
  }
  
  if (!bug.environment || !bug.environment.os) {
    errors.push('Environment information is required');
  }
  
  if (!['open', 'in-progress', 'fixed', 'verified', 'closed', 'wont-fix', 'duplicate'].includes(bug.status)) {
    errors.push('Invalid bug status');
  }
  
  if (!['triage', 'analysis', 'fix-implementation', 'testing', 'verification', 'complete'].includes(bug.currentPhase)) {
    errors.push('Invalid bug phase');
  }
  
  return errors;
}

/**
 * Generate next bug ID
 */
export function generateBugId(existingIds: BugId[]): BugId {
  const numbers = existingIds
    .map(id => parseInt(id.replace('BUG-', ''), 10))
    .filter(n => !isNaN(n));

  const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
  const nextNumber = maxNumber + 1;

  return `BUG-${String(nextNumber).padStart(3, '0')}`;
}
