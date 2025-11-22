/**
 * Feature schema - represents a new capability or enhancement
 */

import { FeatureId, Timestamp, Priority, Complexity, WorkflowId } from '../../types/common';

export interface Feature {
  // Identity
  id: FeatureId;
  type: 'feature';
  
  // Metadata
  title: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  
  // Workflow
  status: FeatureStatus;
  currentPhase: FeaturePhase;
  workflow: WorkflowId;
  
  // Classification
  priority: Priority;
  complexity: Complexity;
  category: string;
  tags: string[];
  
  // Relationships
  parentId?: FeatureId; // For sub-features
  dependencies: FeatureId[];
  relatedBugs: string[];
  
  // Progress tracking
  progress: FeatureProgress;
  
  // Compliance
  compliance: ComplianceInfo;
  
  // Artifacts
  artifacts: FeatureArtifacts;
  
  // Estimates
  estimates: FeatureEstimates;
  
  // Custom fields
  custom: Record<string, unknown>;
}

export type FeatureStatus = 
  | 'draft'
  | 'active'
  | 'on-hold'
  | 'completed'
  | 'cancelled';

export type FeaturePhase = 
  | 'planning'
  | 'design'
  | 'implementation'
  | 'testing'
  | 'review'
  | 'documentation'
  | 'deployment'
  | 'complete';

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
  score: number; // 0-100
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
export function validateFeature(feature: Feature): string[] {
  const errors: string[] = [];

  if (!feature.id || !feature.id.startsWith('FEA-')) {
    errors.push('Invalid feature ID format. Must start with FEA-');
  }

  if (!feature.title || feature.title.length === 0) {
    errors.push('Feature title is required');
  }

  if (!feature.description || feature.description.length === 0) {
    errors.push('Feature description is required');
  }

  if (!['draft', 'active', 'on-hold', 'completed', 'cancelled'].includes(feature.status)) {
    errors.push('Invalid feature status');
  }

  if (!['planning', 'design', 'implementation', 'testing', 'review', 'documentation', 'deployment', 'complete'].includes(feature.currentPhase)) {
    errors.push('Invalid feature phase');
  }

  return errors;
}

/**
 * Generate next feature ID
 */
export function generateFeatureId(existingIds: FeatureId[]): FeatureId {
  const numbers = existingIds
    .map(id => parseInt(id.replace('FEA-', ''), 10))
    .filter(n => !isNaN(n));

  const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
  const nextNumber = maxNumber + 1;

  return `FEA-${String(nextNumber).padStart(3, '0')}`;
}
