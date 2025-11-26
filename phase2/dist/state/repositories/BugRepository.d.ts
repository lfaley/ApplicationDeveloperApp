/**
 * Bug Repository
 * High-level API for managing bug work items
 */
import { Bug, BugStatus, BugPhase, CreateBugData } from '../schemas/Bug';
import { Result, BugId, FeatureId, Severity } from '../../types/common';
export interface BugFilter {
    status?: BugStatus | BugStatus[];
    phase?: BugPhase | BugPhase[];
    severity?: Severity | Severity[];
    priority?: string | string[];
    tags?: string | string[];
    featureId?: FeatureId;
    hasRootCause?: boolean;
    hasResolution?: boolean;
    createdAfter?: Date;
    createdBefore?: Date;
    updatedAfter?: Date;
    updatedBefore?: Date;
    searchText?: string;
}
export interface BugSortOptions {
    field: 'createdAt' | 'updatedAt' | 'severity' | 'priority' | 'status' | 'title';
    direction: 'asc' | 'desc';
}
export interface BugPaginationOptions {
    page: number;
    pageSize: number;
}
export interface BugPaginatedResult {
    items: Bug[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
/**
 * Repository for Bug work items
 */
export declare class BugRepository {
    private storage;
    private readonly BUGS_DIR;
    private cache;
    private cacheExpiry;
    private readonly CACHE_TTL;
    constructor(baseDir: string);
    /**
     * Create a new bug
     */
    create(data: CreateBugData, createdBy: string): Promise<Result<Bug>>;
    /**
     * Get a bug by ID
     */
    getById(id: BugId): Promise<Result<Bug | null>>;
    /**
     * Update an existing bug
     */
    update(id: BugId, updates: Partial<Omit<Bug, 'id' | 'createdAt' | 'type' | 'createdBy'>>): Promise<Result<Bug>>;
    /**
     * Delete a bug
     */
    delete(id: BugId): Promise<Result<void>>;
    /**
     * List all bugs with optional filtering, sorting, and pagination
     */
    list(filter?: BugFilter, sort?: BugSortOptions, pagination?: BugPaginationOptions): Promise<Result<BugPaginatedResult>>;
    /**
     * Find bugs by feature ID
     */
    findByFeature(featureId: FeatureId): Promise<Result<Bug[]>>;
    /**
     * Find bugs by status
     */
    findByStatus(status: BugStatus | BugStatus[]): Promise<Result<Bug[]>>;
    /**
     * Find bugs by severity
     */
    findBySeverity(severity: Severity | Severity[]): Promise<Result<Bug[]>>;
    /**
     * Search bugs by text
     */
    search(searchText: string): Promise<Result<Bug[]>>;
    /**
     * Update bug status
     */
    updateStatus(id: BugId, status: BugStatus): Promise<Result<Bug>>;
    /**
     * Update bug phase
     */
    updatePhase(id: BugId, currentPhase: BugPhase): Promise<Result<Bug>>;
    /**
     * Add tag to bug
     */
    addTag(id: BugId, tag: string): Promise<Result<Bug>>;
    /**
     * Remove tag from bug
     */
    removeTag(id: BugId, tag: string): Promise<Result<Bug>>;
    /**
     * Clear all caches
     */
    clearCache(): void;
    private setCache;
    private getCache;
    private applyFilter;
    private applySort;
}
//# sourceMappingURL=BugRepository.d.ts.map