/**
 * Index Manager
 * Maintains in-memory indexes for fast querying of work items
 */
import { FeatureId, BugId, WorkItemId } from '../../types/common';
import { Feature } from '../schemas/Feature';
import { Bug } from '../schemas/Bug';
export type WorkItem = Feature | Bug;
/**
 * Index structures for fast lookups
 */
export interface Indexes {
    byStatus: Map<string, Set<WorkItemId>>;
    byAssignee: Map<string, Set<WorkItemId>>;
    byTag: Map<string, Set<WorkItemId>>;
    byParent: Map<FeatureId, Set<FeatureId>>;
    byFeature: Map<FeatureId, Set<BugId>>;
    byCreationMonth: Map<string, Set<WorkItemId>>;
    byUpdateMonth: Map<string, Set<WorkItemId>>;
    byWord: Map<string, Set<WorkItemId>>;
}
/**
 * Index Manager - maintains and queries indexes
 */
export declare class IndexManager {
    private indexes;
    private items;
    constructor();
    /**
     * Add or update an item in all indexes
     */
    index(item: WorkItem): void;
    /**
     * Remove an item from all indexes
     */
    remove(id: WorkItemId): void;
    /**
     * Get item by ID
     */
    get(id: WorkItemId): WorkItem | undefined;
    /**
     * Find items by status
     */
    findByStatus(status: string): WorkItem[];
    /**
     * Find items by tag
     */
    findByTag(tag: string): WorkItem[];
    /**
     * Find items by multiple tags (intersection)
     */
    findByTags(tags: string[]): WorkItem[];
    /**
     * Find items by assignee
     */
    findByAssignee(assignee: string): WorkItem[];
    /**
     * Find child features of a parent
     */
    findChildFeatures(parentId: FeatureId): Feature[];
    /**
     * Find bugs affecting a feature
     */
    findBugsByFeature(featureId: FeatureId): Bug[];
    /**
     * Find items created in a date range
     */
    findByCreationDateRange(startDate: Date, endDate: Date): WorkItem[];
    /**
     * Find items updated in a date range
     */
    findByUpdateDateRange(startDate: Date, endDate: Date): WorkItem[];
    /**
     * Full-text search
     */
    search(query: string): WorkItem[];
    /**
     * Get all items of a specific type
     */
    getAllFeatures(): Feature[];
    getAllBugs(): Bug[];
    /**
     * Get statistics
     */
    getStatistics(): {
        totalItems: number;
        features: number;
        bugs: number;
        statusCounts: Map<string, number>;
        tagCounts: Map<string, number>;
    };
    /**
     * Clear all indexes
     */
    clear(): void;
    /**
     * Rebuild all indexes from items
     */
    rebuild(items: WorkItem[]): void;
    private addToIndex;
    private removeFromIndex;
    private getItems;
    private getMonthKey;
    private getMonthsInRange;
    private extractWords;
}
//# sourceMappingURL=IndexManager.d.ts.map