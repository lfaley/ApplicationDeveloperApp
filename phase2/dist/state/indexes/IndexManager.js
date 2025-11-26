"use strict";
/**
 * Index Manager
 * Maintains in-memory indexes for fast querying of work items
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexManager = void 0;
/**
 * Index Manager - maintains and queries indexes
 */
class IndexManager {
    indexes;
    items;
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
    index(item) {
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
            const feature = item;
            if (feature.parentId) {
                this.addToIndex(this.indexes.byParent, feature.parentId, feature.id);
            }
        }
        else if (item.type === 'bug') {
            const bug = item;
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
    remove(id) {
        const item = this.items.get(id);
        if (!item)
            return;
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
            const feature = item;
            if (feature.parentId) {
                this.removeFromIndex(this.indexes.byParent, feature.parentId, id);
            }
        }
        else if (item.type === 'bug') {
            const bug = item;
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
    get(id) {
        return this.items.get(id);
    }
    /**
     * Find items by status
     */
    findByStatus(status) {
        const ids = this.indexes.byStatus.get(status) || new Set();
        return this.getItems(ids);
    }
    /**
     * Find items by tag
     */
    findByTag(tag) {
        const ids = this.indexes.byTag.get(tag) || new Set();
        return this.getItems(ids);
    }
    /**
     * Find items by multiple tags (intersection)
     */
    findByTags(tags) {
        if (tags.length === 0)
            return [];
        let resultIds = this.indexes.byTag.get(tags[0]) || new Set();
        for (let i = 1; i < tags.length; i++) {
            const tagIds = this.indexes.byTag.get(tags[i]) || new Set();
            resultIds = new Set([...resultIds].filter(id => tagIds.has(id)));
        }
        return this.getItems(resultIds);
    }
    /**
     * Find items by assignee
     */
    findByAssignee(assignee) {
        const ids = this.indexes.byAssignee.get(assignee) || new Set();
        return this.getItems(ids);
    }
    /**
     * Find child features of a parent
     */
    findChildFeatures(parentId) {
        const ids = this.indexes.byParent.get(parentId) || new Set();
        return this.getItems(ids).filter((item) => item.type === 'feature');
    }
    /**
     * Find bugs affecting a feature
     */
    findBugsByFeature(featureId) {
        const ids = this.indexes.byFeature.get(featureId) || new Set();
        return this.getItems(ids).filter((item) => item.type === 'bug');
    }
    /**
     * Find items created in a date range
     */
    findByCreationDateRange(startDate, endDate) {
        const months = this.getMonthsInRange(startDate, endDate);
        const ids = new Set();
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
    findByUpdateDateRange(startDate, endDate) {
        const months = this.getMonthsInRange(startDate, endDate);
        const ids = new Set();
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
    search(query) {
        const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
        if (words.length === 0)
            return [];
        // Find items containing all words (AND logic)
        let resultIds = this.indexes.byWord.get(words[0]) || new Set();
        for (let i = 1; i < words.length; i++) {
            const wordIds = this.indexes.byWord.get(words[i]) || new Set();
            resultIds = new Set([...resultIds].filter(id => wordIds.has(id)));
        }
        return this.getItems(resultIds);
    }
    /**
     * Get all items of a specific type
     */
    getAllFeatures() {
        return Array.from(this.items.values())
            .filter((item) => item.type === 'feature');
    }
    getAllBugs() {
        return Array.from(this.items.values())
            .filter((item) => item.type === 'bug');
    }
    /**
     * Get statistics
     */
    getStatistics() {
        const stats = {
            totalItems: this.items.size,
            features: 0,
            bugs: 0,
            statusCounts: new Map(),
            tagCounts: new Map(),
        };
        for (const item of this.items.values()) {
            if (item.type === 'feature')
                stats.features++;
            if (item.type === 'bug')
                stats.bugs++;
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
    clear() {
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
    rebuild(items) {
        this.clear();
        for (const item of items) {
            this.index(item);
        }
    }
    // Private helper methods
    addToIndex(index, key, id) {
        if (!index.has(key)) {
            index.set(key, new Set());
        }
        index.get(key).add(id);
    }
    removeFromIndex(index, key, id) {
        const set = index.get(key);
        if (set) {
            set.delete(id);
            if (set.size === 0) {
                index.delete(key);
            }
        }
    }
    getItems(ids) {
        const items = [];
        for (const id of ids) {
            const item = this.items.get(id);
            if (item)
                items.push(item);
        }
        return items;
    }
    getMonthKey(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    }
    getMonthsInRange(startDate, endDate) {
        const months = [];
        const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        while (current <= end) {
            months.push(this.getMonthKey(current.toISOString()));
            current.setMonth(current.getMonth() + 1);
        }
        return months;
    }
    extractWords(item) {
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
exports.IndexManager = IndexManager;
//# sourceMappingURL=IndexManager.js.map