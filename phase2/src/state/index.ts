/**
 * State Management System
 * Main entry point for state management functionality
 */

// Schemas - Feature
export type {
  Feature,
  FeatureStatus,
  FeaturePhase,
  FeatureProgress,
  FeatureArtifacts,
  FeatureEstimates,
  CreateFeatureData,
  ComplianceInfo,
  ComplianceViolation,
} from './schemas/Feature';

export { validateFeature, generateFeatureId } from './schemas/Feature';

// Schemas - Bug
export type {
  Bug,
  BugStatus,
  BugPhase,
  BugProgress,
  BugArtifacts,
  BugEstimates,
  CreateBugData,
  Environment,
  Reproducibility,
  RootCauseCategory,
  RootCauseInfo,
  ResolutionType,
  ResolutionInfo,
} from './schemas/Bug';

export { validateBug, generateBugId } from './schemas/Bug';

// Shared schema types (export once to avoid conflicts)
export type { ChecklistProgress, ChecklistItem, QualityGateResult, QualityGateDetail } from './schemas/Feature';

// Storage
export { FileSystemStorage } from './storage/FileSystemStorage';
export type { IFileSystemStorage } from './storage/FileSystemStorage';

// Repositories
export * from './repositories';

// Indexes
export * from './indexes';

// Transactions
export * from './transactions';
