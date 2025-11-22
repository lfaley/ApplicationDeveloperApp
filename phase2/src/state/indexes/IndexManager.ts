/**
 * Index Manager
 * Maintains in-memory indexes for fast querying of work items
 */

import { FeatureId, BugId, WorkItemId, Timestamp } from '../../types/common';
import { Feature } from '../schemas/Feature';
import { Bug } from '../schemas/Bug';

export type WorkItem = Feature | Bug;

/**
 * Index structures for fast lookups
 */
export interface Indexes {
  // By status
  byStatus: Map<string, Set<WorkItemId>>;
  
  // By assignee (for custom fields)
  byAssignee: Map<string, Set<WorkItemId>>;
  
  // By tags
  byTag: Map<string, Set<WorkItemId>>;
  
  // By relationships
  byParent: Map<FeatureId, Set<FeatureId>>; // parent -> children
  byFeature: Map<FeatureId, Set<BugId>>; // feature -> bugs
  
  // By date ranges (bucketed by month for efficiency)
  byCreationMonth: Map<string, Set<WorkItemId>>; // YYYY-MM -> items
  byUpdateMonth: Map<string, Set<WorkItemId>>; // YYYY-MM -> items
  
  // Full text search (simple word index)
  byWord: Map<string, Set<WorkItemId>>;
}

/**
 * Index Manager - maintains and queries indexes
 */
export class IndexManager {
  private indexes: Indexes;
  private items: Map<WorkItemId, WorkItem>;

  constructor() {
    this.indexes = {
      byStatus: new Map(),
      byAssignee: new Map(),
      byTag: new Map(),
      byParent: new Map(),
      byFeature: new Map(),
      byCreationMonth: new Map(),
      byUpdateMonth: new Map(),
      byWord: new Map(),
    };
    this.items = new Map();
  }

  /**
   * Add or update an item in all indexes
   */
  index(item: WorkItem): void {
    // Remove old indexes if item exists
    if (this.items.has(item.id)) {
      this.remove(item.id);
    }

    // Store item
    this.items.set(item.id, item);

    // Index by status
    this.addToIndex(this.indexes.byStatus, item.status, item.id);

    // Index by tags
    for (const tag of item.tags) {
      this.addToIndex(this.indexes.byTag, tag, item.id);
    }

    // Index by assignee (if in custom fields)
    if (item.custom.assignee && typeof item.custom.assignee === 'string') {
      this.addToIndex(this.indexes.byAssignee, item.custom.assignee, item.id);
    }

    // Index relationships
    if (item.type === 'feature') {
      const feature = item as Feature;
      if (feature.parentId) {
        this.addToIndex(this.indexes.byParent, feature.parentId, feature.id);
      }
    } else if (item.type === 'bug') {
      const bug = item as Bug;
      for (const featureId of bug.affectedFeatures) {
        this.addToIndex(this.indexes.byFeature, featureId, bug.id);
      }
    }

    // Index by creation month
    const creationMonth = this.getMonthKey(item.createdAt);
    this.addToIndex(this.indexes.byCreationMonth, creationMonth, item.id);

    // Index by update month
    const updateMonth = this.getMonthKey(item.updatedAt);
    this.addToIndex(this.indexes.byUpdateMonth, updateMonth, item.id);

    // Index words for full-text search
    const words = this.extractWords(item);
    for (const word of words) {
      this.addToIndex(this.indexes.byWord, word, item.id);
    }
  }

  /**
   * Remove an item from all indexes
   */
  remove(id: WorkItemId): void {
    const item = this.items.get(id);
    if (!item) return;

    // Remove from status index
    this.removeFromIndex(this.indexes.byStatus, item.status, id);

    // Remove from tag indexes
    for (const tag of item.tags) {
      this.removeFromIndex(this.indexes.byTag, tag, id);
    }

    // Remove from assignee index
    if (item.custom.assignee && typeof item.custom.assignee === 'string') {
      this.removeFromIndex(this.indexes.byAssignee, item.custom.assignee, id);
    }

    // Remove from relationship indexes
    if (item.type === 'feature') {
      const feature = item as Feature;
      if (feature.parentId) {
        this.removeFromIndex(this.indexes.byParent, feature.parentId, id);
      }
    } else if (item.type === 'bug') {
      const bug = item as Bug;
      for (const featureId of bug.affectedFeatures) {
        this.removeFromIndex(this.indexes.byFeature, featureId, id);
      }
    }

    // Remove from date indexes
    const creationMonth = this.getMonthKey(item.createdAt);
    this.removeFromIndex(this.indexes.byCreationMonth, creationMonth, id);

    const updateMonth = this.getMonthKey(item.updatedAt);
    this.removeFromIndex(this.indexes.byUpdateMonth, updateMonth, id);

    // Remove from word indexes
    const words = this.extractWords(item);
    for (const word of words) {
      this.removeFromIndex(this.indexes.byWord, word, id);
    }

    // Remove item
    this.items.delete(id);
  }

  /**
   * Get item by ID
   */
  get(id: WorkItemId): WorkItem | undefined {
    return this.items.get(id);
  }

  /**
   * Find items by status
   */
  findByStatus(status: string): WorkItem[] {
    const ids = this.indexes.byStatus.get(status) || new Set();
    return this.getItems(ids);
  }

  /**
   * Find items by tag
   */
  findByTag(tag: string): WorkItem[] {
    const ids = this.indexes.byTag.get(tag) || new Set();
    return this.getItems(ids);
  }

  /**
   * Find items by multiple tags (intersection)
   */
  findByTags(tags: string[]): WorkItem[] {
    if (tags.length === 0) return [];

    let resultIds = this.indexes.byTag.get(tags[0]!) || new Set();
    
    for (let i = 1; i < tags.length; i++) {
      const tagIds = this.indexes.byTag.get(tags[i]!) || new Set();
      resultIds = new Set([...resultIds].filter(id => tagIds.has(id)));
    }

    return this.getItems(resultIds);
  }

  /**
   * Find items by assignee
   */
  findByAssignee(assignee: string): WorkItem[] {
    const ids = this.indexes.byAssignee.get(assignee) || new Set();
    return this.getItems(ids);
  }

  /**
   * Find child features of a parent
   */
  findChildFeatures(parentId: FeatureId): Feature[] {
    const ids = this.indexes.byParent.get(parentId) || new Set();
    return this.getItems(ids).filter((item): item is Feature => item.type === 'feature');
  }

  /**
   * Find bugs affecting a feature
   */
  findBugsByFeature(featureId: FeatureId): Bug[] {
    const ids = this.indexes.byFeature.get(featureId) || new Set();
    return this.getItems(ids).filter((item): item is Bug => item.type === 'bug');
  }

  /**
   * Find items created in a date range
   */
  findByCreationDateRange(startDate: Date, endDate: Date): WorkItem[] {
    const months = this.getMonthsInRange(startDate, endDate);
    const ids = new Set<WorkItemId>();

    for (const month of months) {
      const monthIds = this.indexes.byCreationMonth.get(month) || new Set();
      monthIds.forEach(id => ids.add(id));
    }

    // Filter by exact date range
    return this.getItems(ids).filter(item => {
      const createdAt = new Date(item.createdAt);
      return createdAt >= startDate && createdAt <= endDate;
    });
  }

  /**
   * Find items updated in a date range
   */
  findByUpdateDateRange(startDate: Date, endDate: Date): WorkItem[] {
    const months = this.getMonthsInRange(startDate, endDate);
    const ids = new Set<WorkItemId>();

    for (const month of months) {
      const monthIds = this.indexes.byUpdateMonth.get(month) || new Set();
      monthIds.forEach(id => ids.add(id));
    }

    // Filter by exact date range
    return this.getItems(ids).filter(item => {
      const updatedAt = new Date(item.updatedAt);
      return updatedAt >= startDate && updatedAt <= endDate;
    });
  }

  /**
   * Full-text search
   */
  search(query: string): WorkItem[] {
    const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return [];

    // Find items containing all words (AND logic)
    let resultIds = this.indexes.byWord.get(words[0]!) || new Set();
    
    for (let i = 1; i < words.length; i++) {
      const wordIds = this.indexes.byWord.get(words[i]!) || new Set();
      resultIds = new Set([...resultIds].filter(id => wordIds.has(id)));
    }

    return this.getItems(resultIds);
  }

  /**
   * Get all items of a specific type
   */
  getAllFeatures(): Feature[] {
    return Array.from(this.items.values())
      .filter((item): item is Feature => item.type === 'feature');
  }

  getAllBugs(): Bug[] {
    return Array.from(this.items.values())
      .filter((item): item is Bug => item.type === 'bug');
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalItems: number;
    features: number;
    bugs: number;
    statusCounts: Map<string, number>;
    tagCounts: Map<string, number>;
  } {
    const stats = {
      totalItems: this.items.size,
      features: 0,
      bugs: 0,
      statusCounts: new Map<string, number>(),
      tagCounts: new Map<string, number>(),
    };

    for (const item of this.items.values()) {
      if (item.type === 'feature') stats.features++;
      if (item.type === 'bug') stats.bugs++;

      // Count statuses
      const statusCount = stats.statusCounts.get(item.status) || 0;
      stats.statusCounts.set(item.status, statusCount + 1);

      // Count tags
      for (const tag of item.tags) {
        const tagCount = stats.tagCounts.get(tag) || 0;
        stats.tagCounts.set(tag, tagCount + 1);
      }
    }

    return stats;
  }

  /**
   * Clear all indexes
   */
  clear(): void {
    this.indexes = {
      byStatus: new Map(),
      byAssignee: new Map(),
      byTag: new Map(),
      byParent: new Map(),
      byFeature: new Map(),
      byCreationMonth: new Map(),
      byUpdateMonth: new Map(),
      byWord: new Map(),
    };
    this.items.clear();
  }

  /**
   * Rebuild all indexes from items
   */
  rebuild(items: WorkItem[]): void {
    this.clear();
    for (const item of items) {
      this.index(item);
    }
  }

  // Private helper methods

  private addToIndex<K>(index: Map<K, Set<WorkItemId>>, key: K, id: WorkItemId): void {
    if (!index.has(key)) {
      index.set(key, new Set());
    }
    index.get(key)!.add(id);
  }

  private removeFromIndex<K>(index: Map<K, Set<WorkItemId>>, key: K, id: WorkItemId): void {
    const set = index.get(key);
    if (set) {
      set.delete(id);
      if (set.size === 0) {
        index.delete(key);
      }
    }
  }

  private getItems(ids: Set<WorkItemId>): WorkItem[] {
    const items: WorkItem[] = [];
    for (const id of ids) {
      const item = this.items.get(id);
      if (item) items.push(item);
    }
    return items;
  }

  private getMonthKey(timestamp: Timestamp): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  private getMonthsInRange(startDate: Date, endDate: Date): string[] {
    const months: string[] = [];
    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    while (current <= end) {
      months.push(this.getMonthKey(current.toISOString()));
      current.setMonth(current.getMonth() + 1);
    }

    return months;
  }

  private extractWords(item: WorkItem): string[] {
    const text = [
      item.title,
      item.description,
      item.category,
      ...item.tags,
    ].join(' ');

    return text
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2) // Ignore very short words
      .map(word => word.replace(/[^a-z0-9]/g, '')) // Remove punctuation
      .filter(word => word.length > 0);
  }
}
