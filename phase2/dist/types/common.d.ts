/**
 * Common types used throughout ProjectPlanner Phase 2
 */
/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> = {
    success: true;
    data: T;
} | {
    success: false;
    error: E;
};
/**
 * Common ID types
 */
export type FeatureId = string;
export type BugId = string;
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
export declare function success<T>(data: T): Result<T>;
/**
 * Helper function to create error result
 */
export declare function failure<T>(error: Error): Result<T>;
/**
 * Type guard to check if result is successful
 */
export declare function isSuccess<T>(result: Result<T>): result is {
    success: true;
    data: T;
};
/**
 * Type guard to check if result is failure
 */
export declare function isFailure<T>(result: Result<T>): result is {
    success: false;
    error: Error;
};
//# sourceMappingURL=common.d.ts.map