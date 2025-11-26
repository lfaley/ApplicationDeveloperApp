/**
 * State Management System
 * Main entry point for state management functionality
 */
export type { Feature, FeatureStatus, FeaturePhase, FeatureProgress, FeatureArtifacts, FeatureEstimates, CreateFeatureData, ComplianceInfo, ComplianceViolation, } from './schemas/Feature';
export { validateFeature, generateFeatureId } from './schemas/Feature';
export type { Bug, BugStatus, BugPhase, BugProgress, BugArtifacts, BugEstimates, CreateBugData, Environment, Reproducibility, RootCauseCategory, RootCauseInfo, ResolutionType, ResolutionInfo, } from './schemas/Bug';
export { validateBug, generateBugId } from './schemas/Bug';
export type { ChecklistProgress, ChecklistItem, QualityGateResult, QualityGateDetail } from './schemas/Feature';
export { FileSystemStorage } from './storage/FileSystemStorage';
export type { IFileSystemStorage } from './storage/FileSystemStorage';
export * from './repositories';
export * from './indexes';
export * from './transactions';
//# sourceMappingURL=index.d.ts.map