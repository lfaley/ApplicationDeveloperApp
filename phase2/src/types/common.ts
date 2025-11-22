/**
 * Common types used throughout ProjectPlanner Phase 2
 */

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Common ID types
 */
export type FeatureId = string; // Format: FEA-001
export type BugId = string;     // Format: BUG-001
export type WorkItemId = FeatureId | BugId;
export type AgentId = string;
export type WorkflowId = string;

/**
 * ISO 8601 timestamp
 */
export type Timestamp = string;

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * Pagination result
 */
export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Sort options
 */
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Filter options
 */
export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';

export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

/**
 * Priority levels
 */
export type Priority = 'critical' | 'high' | 'medium' | 'low';

/**
 * Complexity levels
 */
export type Complexity = 'xl' | 'l' | 'm' | 's' | 'xs';

/**
 * Severity levels
 */
export type Severity = 'critical' | 'high' | 'medium' | 'low';

/**
 * Helper function to create successful result
 */
export function success<T>(data: T): Result<T> {
  return { success: true, data };
}

/**
 * Helper function to create error result
 */
export function failure<T>(error: Error): Result<T> {
  return { success: false, error };
}

/**
 * Type guard to check if result is successful
 */
export function isSuccess<T>(result: Result<T>): result is { success: true; data: T } {
  return result.success;
}

/**
 * Type guard to check if result is failure
 */
export function isFailure<T>(result: Result<T>): result is { success: false; error: Error } {
  return !result.success;
}
