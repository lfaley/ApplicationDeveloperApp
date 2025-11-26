/**
 * Feature Repository
 * High-level API for managing feature work items
 */
import { Feature, FeatureStatus, CreateFeatureData } from '../schemas/Feature';
import { Result, FeatureId } from '../../types/common';
export interface FeatureFilter {
    status?: FeatureStatus | FeatureStatus[];
    priority?: string | string[];
    assignee?: string | string[];
    tags?: string | string[];
    parentId?: FeatureId;
    hasParent?: boolean;
    hasChildren?: boolean;
    createdAfter?: Date;
    createdBefore?: Date;
    updatedAfter?: Date;
    updatedBefore?: Date;
    searchText?: string;
}
export interface FeatureSortOptions {
    field: 'createdAt' | 'updatedAt' | 'priority' | 'status' | 'title';
    direction: 'asc' | 'desc';
}
export interface FeaturePaginationOptions {
    page: number;
    pageSize: number;
}
export interface FeaturePaginatedResult {
    items: Feature[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
/**
 * Repository for Feature work items
 */
export declare class FeatureRepository {
    private storage;
    private readonly FEATURES_DIR;
    private cache;
    private cacheExpiry;
    private readonly CACHE_TTL;
    constructor(baseDir: string);
    /**
     * Create a new feature
     */
    create(data: CreateFeatureData, createdBy: string): Promise<Result<Feature>>;
    /**
     * Get a feature by ID
     */
    getById(id: FeatureId): Promise<Result<Feature | null>>;
    /**
     * Update an existing feature
     */
    update(id: FeatureId, updates: Partial<Omit<Feature, 'id' | 'createdAt' | 'type' | 'createdBy'>>): Promise<Result<Feature>>;
    /**
     * Delete a feature
     */
    delete(id: FeatureId): Promise<Result<void>>;
    /**
     * List all features with optional filtering, sorting, and pagination
     */
    list(filter?: FeatureFilter, sort?: FeatureSortOptions, pagination?: FeaturePaginationOptions): Promise<Result<FeaturePaginatedResult>>;
    /**
     * Find features by parent ID
     */
    findByParent(parentId: FeatureId): Promise<Result<Feature[]>>;
    /**
     * Find features by status
     */
    findByStatus(status: FeatureStatus | FeatureStatus[]): Promise<Result<Feature[]>>;
    /**
     * Search features by text
     */
    search(searchText: string): Promise<Result<Feature[]>>;
    /**
     * Update feature status
     */
    updateStatus(id: FeatureId, status: FeatureStatus): Promise<Result<Feature>>;
    /**
     * Add tag to feature
     */
    addTag(id: FeatureId, tag: string): Promise<Result<Feature>>;
    /**
     * Remove tag from feature
     */
    removeTag(id: FeatureId, tag: string): Promise<Result<Feature>>;
    /**
     * Get feature hierarchy (parent and children)
     */
    getHierarchy(id: FeatureId): Promise<Result<{
        feature: Feature;
        parent?: Feature;
        children: Feature[];
    }>>;
    /**
     * Clear all caches
     */
    clearCache(): void;
    private setCache;
    private getCache;
    private applyFilter;
    private applySort;
}
//# sourceMappingURL=FeatureRepository.d.ts.map