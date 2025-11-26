"use strict";
/**
 * Feature Repository
 * High-level API for managing feature work items
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureRepository = void 0;
const FileSystemStorage_1 = require("../storage/FileSystemStorage");
const Feature_1 = require("../schemas/Feature");
const common_1 = require("../../types/common");
/**
 * Repository for Feature work items
 */
class FeatureRepository {
    storage;
    FEATURES_DIR = 'features';
    cache;
    cacheExpiry;
    CACHE_TTL = 5 * 60 * 1000; // 5 minutes
    constructor(baseDir) {
        this.storage = new FileSystemStorage_1.FileSystemStorage(baseDir);
        this.cache = new Map();
        this.cacheExpiry = new Map();
    }
    /**
     * Create a new feature
     */
    async create(data, createdBy) {
        try {
            // Generate ID
            const listResult = await this.storage.list(this.FEATURES_DIR);
            const existingIds = listResult.success ?
                listResult.data.map(f => f.replace('.json', '')) : [];
            const id = (0, Feature_1.generateFeatureId)(existingIds);
            // Create feature object
            const now = new Date().toISOString();
            const feature = {
                id,
                type: 'feature',
                title: data.title,
                description: data.description,
                createdAt: now,
                updatedAt: now,
                createdBy,
                status: 'draft',
                currentPhase: 'planning',
                workflow: 'standard-feature',
                priority: data.priority,
                complexity: data.complexity,
                category: data.category,
                tags: data.tags || [],
                parentId: data.parentId,
                dependencies: [],
                relatedBugs: [],
                progress: {
                    phasesCompleted: [],
                    checklistProgress: {
                        total: 0,
                        completed: 0,
                        percentage: 0,
                        items: []
                    },
                    qualityGateResults: []
                },
                compliance: {
                    score: 0,
                    lastChecked: now,
                    violations: []
                },
                artifacts: {
                    commits: [],
                    pullRequests: [],
                    documentation: [],
                    tests: []
                },
                estimates: {},
                custom: data.custom || {}
            };
            const errors = (0, Feature_1.validateFeature)(feature);
            if (errors.length > 0) {
                return (0, common_1.failure)(new Error(`Validation failed: ${errors.join(', ')}`));
            }
            const filePath = `${this.FEATURES_DIR}/${feature.id}.json`;
            const saveResult = await this.storage.write(filePath, feature);
            if (!saveResult.success) {
                return (0, common_1.failure)(saveResult.error);
            }
            this.setCache(feature.id, feature);
            return (0, common_1.success)(feature);
        }
        catch (error) {
            return (0, common_1.failure)(error);
        }
    }
    /**
     * Get a feature by ID
     */
    async getById(id) {
        try {
            // Check cache first
            const cached = this.getCache(id);
            if (cached) {
                return (0, common_1.success)(cached);
            }
            const filePath = `${this.FEATURES_DIR}/${id}.json`;
            const readResult = await this.storage.read(filePath);
            if (!readResult.success) {
                if (readResult.error.message.includes('ENOENT')) {
                    return (0, common_1.success)(null);
                }
                return (0, common_1.failure)(readResult.error);
            }
            const feature = readResult.data;
            this.setCache(id, feature);
            return (0, common_1.success)(feature);
        }
        catch (error) {
            return (0, common_1.failure)(error);
        }
    }
    /**
     * Update an existing feature
     */
    async update(id, updates) {
        try {
            const existingResult = await this.getById(id);
            if (!existingResult.success) {
                return (0, common_1.failure)(existingResult.error);
            }
            if (!existingResult.data) {
                return (0, common_1.failure)(new Error(`Feature ${id} not found`));
            }
            const updated = {
                ...existingResult.data,
                ...updates,
                id,
                type: 'feature',
                createdAt: existingResult.data.createdAt,
                createdBy: existingResult.data.createdBy,
                updatedAt: new Date().toISOString(),
            };
            const errors = (0, Feature_1.validateFeature)(updated);
            if (errors.length > 0) {
                return (0, common_1.failure)(new Error(`Validation failed: ${errors.join(', ')}`));
            }
            const filePath = `${this.FEATURES_DIR}/${id}.json`;
            const saveResult = await this.storage.write(filePath, updated);
            if (!saveResult.success) {
                return (0, common_1.failure)(saveResult.error);
            }
            this.setCache(id, updated);
            return (0, common_1.success)(updated);
        }
        catch (error) {
            return (0, common_1.failure)(error);
        }
    }
    /**
     * Delete a feature
     */
    async delete(id) {
        try {
            const filePath = `${this.FEATURES_DIR}/${id}.json`;
            const deleteResult = await this.storage.delete(filePath);
            if (!deleteResult.success) {
                return (0, common_1.failure)(deleteResult.error);
            }
            this.cache.delete(id);
            this.cacheExpiry.delete(id);
            return (0, common_1.success)(undefined);
        }
        catch (error) {
            return (0, common_1.failure)(error);
        }
    }
    /**
     * List all features with optional filtering, sorting, and pagination
     */
    async list(filter, sort, pagination) {
        try {
            const listResult = await this.storage.list(this.FEATURES_DIR);
            if (!listResult.success) {
                return (0, common_1.failure)(listResult.error);
            }
            // Read all features
            const features = [];
            for (const filename of listResult.data) {
                const id = filename.replace('.json', '');
                const featureResult = await this.getById(id);
                if (featureResult.success && featureResult.data) {
                    features.push(featureResult.data);
                }
            }
            // Apply filters
            let filtered = features;
            if (filter) {
                filtered = this.applyFilter(features, filter);
            }
            // Apply sorting
            if (sort) {
                filtered = this.applySort(filtered, sort);
            }
            // Apply pagination
            const total = filtered.length;
            let paginated = filtered;
            let page = 1;
            let pageSize = total;
            let totalPages = 1;
            if (pagination) {
                page = pagination.page;
                pageSize = pagination.pageSize;
                totalPages = Math.ceil(total / pageSize);
                const start = (page - 1) * pageSize;
                const end = start + pageSize;
                paginated = filtered.slice(start, end);
            }
            return (0, common_1.success)({
                items: paginated,
                total,
                page,
                pageSize,
                totalPages,
            });
        }
        catch (error) {
            return (0, common_1.failure)(error);
        }
    }
    /**
     * Find features by parent ID
     */
    async findByParent(parentId) {
        const listResult = await this.list({ parentId });
        if (!listResult.success) {
            return (0, common_1.failure)(listResult.error);
        }
        return (0, common_1.success)(listResult.data.items);
    }
    /**
     * Find features by status
     */
    async findByStatus(status) {
        const listResult = await this.list({ status });
        if (!listResult.success) {
            return (0, common_1.failure)(listResult.error);
        }
        return (0, common_1.success)(listResult.data.items);
    }
    /**
     * Search features by text
     */
    async search(searchText) {
        const listResult = await this.list({ searchText });
        if (!listResult.success) {
            return (0, common_1.failure)(listResult.error);
        }
        return (0, common_1.success)(listResult.data.items);
    }
    /**
     * Update feature status
     */
    async updateStatus(id, status) {
        return this.update(id, { status });
    }
    // Note: Feature schema doesn't have assignee field
    // Use custom fields if assignment tracking is needed
    /**
     * Add tag to feature
     */
    async addTag(id, tag) {
        const featureResult = await this.getById(id);
        if (!featureResult.success || !featureResult.data) {
            return featureResult;
        }
        const tags = [...featureResult.data.tags, tag];
        return this.update(id, { tags });
    }
    /**
     * Remove tag from feature
     */
    async removeTag(id, tag) {
        const featureResult = await this.getById(id);
        if (!featureResult.success || !featureResult.data) {
            return featureResult;
        }
        const tags = featureResult.data.tags.filter((t) => t !== tag);
        return this.update(id, { tags });
    }
    /**
     * Get feature hierarchy (parent and children)
     */
    async getHierarchy(id) {
        try {
            const featureResult = await this.getById(id);
            if (!featureResult.success || !featureResult.data) {
                return (0, common_1.failure)(new Error(`Feature ${id} not found`));
            }
            const feature = featureResult.data;
            let parent;
            const children = [];
            // Get parent
            if (feature.parentId) {
                const parentResult = await this.getById(feature.parentId);
                if (parentResult.success && parentResult.data) {
                    parent = parentResult.data;
                }
            }
            // Get children
            const childrenResult = await this.findByParent(id);
            if (childrenResult.success) {
                children.push(...childrenResult.data);
            }
            return (0, common_1.success)({ feature, parent, children });
        }
        catch (error) {
            return (0, common_1.failure)(error);
        }
    }
    /**
     * Clear all caches
     */
    clearCache() {
        this.cache.clear();
        this.cacheExpiry.clear();
    }
    // Private helper methods
    setCache(id, feature) {
        this.cache.set(id, feature);
        this.cacheExpiry.set(id, Date.now() + this.CACHE_TTL);
    }
    getCache(id) {
        const expiry = this.cacheExpiry.get(id);
        if (!expiry || Date.now() > expiry) {
            this.cache.delete(id);
            this.cacheExpiry.delete(id);
            return null;
        }
        return this.cache.get(id) || null;
    }
    applyFilter(features, filter) {
        return features.filter((feature) => {
            // Status filter
            if (filter.status) {
                const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
                if (!statuses.includes(feature.status)) {
                    return false;
                }
            }
            // Priority filter
            if (filter.priority) {
                const priorities = Array.isArray(filter.priority) ? filter.priority : [filter.priority];
                if (!priorities.includes(feature.priority)) {
                    return false;
                }
            }
            // Assignee filter (Note: Feature schema doesn't have assignee)
            // This filter is not supported for features
            // Tags filter (feature must have ALL specified tags)
            if (filter.tags) {
                const requiredTags = Array.isArray(filter.tags) ? filter.tags : [filter.tags];
                if (!requiredTags.every((tag) => feature.tags.includes(tag))) {
                    return false;
                }
            }
            // Parent ID filter
            if (filter.parentId !== undefined) {
                if (feature.parentId !== filter.parentId) {
                    return false;
                }
            }
            // Has parent filter
            if (filter.hasParent !== undefined) {
                const hasParent = feature.parentId !== undefined;
                if (hasParent !== filter.hasParent) {
                    return false;
                }
            }
            // Date range filters
            if (filter.createdAfter) {
                if (new Date(feature.createdAt) < filter.createdAfter) {
                    return false;
                }
            }
            if (filter.createdBefore) {
                if (new Date(feature.createdAt) > filter.createdBefore) {
                    return false;
                }
            }
            if (filter.updatedAfter) {
                if (new Date(feature.updatedAt) < filter.updatedAfter) {
                    return false;
                }
            }
            if (filter.updatedBefore) {
                if (new Date(feature.updatedAt) > filter.updatedBefore) {
                    return false;
                }
            }
            // Search text filter
            if (filter.searchText) {
                const searchLower = filter.searchText.toLowerCase();
                const searchable = [
                    feature.title,
                    feature.description,
                    ...feature.tags,
                ].join(' ').toLowerCase();
                if (!searchable.includes(searchLower)) {
                    return false;
                }
            }
            return true;
        });
    }
    applySort(features, sort) {
        const sorted = [...features];
        sorted.sort((a, b) => {
            let aValue;
            let bValue;
            switch (sort.field) {
                case 'createdAt':
                    aValue = new Date(a.createdAt).getTime();
                    bValue = new Date(b.createdAt).getTime();
                    break;
                case 'updatedAt':
                    aValue = new Date(a.updatedAt).getTime();
                    bValue = new Date(b.updatedAt).getTime();
                    break;
                case 'priority':
                    aValue = a.priority;
                    bValue = b.priority;
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                case 'title':
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
                    break;
                default:
                    return 0;
            }
            if (aValue < bValue) {
                return sort.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sort.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        return sorted;
    }
}
exports.FeatureRepository = FeatureRepository;
//# sourceMappingURL=FeatureRepository.js.map