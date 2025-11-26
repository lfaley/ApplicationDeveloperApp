"use strict";
/**
 * Bug Repository
 * High-level API for managing bug work items
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BugRepository = void 0;
const FileSystemStorage_1 = require("../storage/FileSystemStorage");
const Bug_1 = require("../schemas/Bug");
const common_1 = require("../../types/common");
/**
 * Repository for Bug work items
 */
class BugRepository {
    storage;
    BUGS_DIR = 'bugs';
    cache;
    cacheExpiry;
    CACHE_TTL = 5 * 60 * 1000; // 5 minutes
    constructor(baseDir) {
        this.storage = new FileSystemStorage_1.FileSystemStorage(baseDir);
        this.cache = new Map();
        this.cacheExpiry = new Map();
    }
    /**
     * Create a new bug
     */
    async create(data, createdBy) {
        try {
            // Generate ID
            const listResult = await this.storage.list(this.BUGS_DIR);
            const existingIds = listResult.success ?
                listResult.data.map(f => f.replace('.json', '')) : [];
            const id = (0, Bug_1.generateBugId)(existingIds);
            // Create bug object
            const now = new Date().toISOString();
            const bug = {
                id,
                type: 'bug',
                title: data.title,
                description: data.description,
                createdAt: now,
                updatedAt: now,
                createdBy,
                status: 'open',
                currentPhase: 'triage',
                workflow: 'standard-bug',
                severity: data.severity,
                priority: data.priority,
                category: data.category,
                tags: data.tags || [],
                environment: data.environment,
                reproducibility: data.reproducibility,
                stepsToReproduce: data.stepsToReproduce,
                affectedFeatures: [],
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
                artifacts: {
                    commits: [],
                    pullRequests: [],
                    tests: [],
                    logs: []
                },
                estimates: {},
                custom: data.custom || {}
            };
            const errors = (0, Bug_1.validateBug)(bug);
            if (errors.length > 0) {
                return (0, common_1.failure)(new Error(`Validation failed: ${errors.join(', ')}`));
            }
            const filePath = `${this.BUGS_DIR}/${bug.id}.json`;
            const saveResult = await this.storage.write(filePath, bug);
            if (!saveResult.success) {
                return (0, common_1.failure)(saveResult.error);
            }
            this.setCache(bug.id, bug);
            return (0, common_1.success)(bug);
        }
        catch (error) {
            return (0, common_1.failure)(error);
        }
    }
    /**
     * Get a bug by ID
     */
    async getById(id) {
        try {
            // Check cache first
            const cached = this.getCache(id);
            if (cached) {
                return (0, common_1.success)(cached);
            }
            const filePath = `${this.BUGS_DIR}/${id}.json`;
            const readResult = await this.storage.read(filePath);
            if (!readResult.success) {
                if (readResult.error.message.includes('ENOENT')) {
                    return (0, common_1.success)(null);
                }
                return (0, common_1.failure)(readResult.error);
            }
            const bug = readResult.data;
            this.setCache(id, bug);
            return (0, common_1.success)(bug);
        }
        catch (error) {
            return (0, common_1.failure)(error);
        }
    }
    /**
     * Update an existing bug
     */
    async update(id, updates) {
        try {
            const existingResult = await this.getById(id);
            if (!existingResult.success) {
                return (0, common_1.failure)(existingResult.error);
            }
            if (!existingResult.data) {
                return (0, common_1.failure)(new Error(`Bug ${id} not found`));
            }
            const updated = {
                ...existingResult.data,
                ...updates,
                id,
                type: 'bug',
                createdAt: existingResult.data.createdAt,
                createdBy: existingResult.data.createdBy,
                updatedAt: new Date().toISOString(),
            };
            const errors = (0, Bug_1.validateBug)(updated);
            if (errors.length > 0) {
                return (0, common_1.failure)(new Error(`Validation failed: ${errors.join(', ')}`));
            }
            const filePath = `${this.BUGS_DIR}/${id}.json`;
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
     * Delete a bug
     */
    async delete(id) {
        try {
            const filePath = `${this.BUGS_DIR}/${id}.json`;
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
     * List all bugs with optional filtering, sorting, and pagination
     */
    async list(filter, sort, pagination) {
        try {
            const listResult = await this.storage.list(this.BUGS_DIR);
            if (!listResult.success) {
                return (0, common_1.failure)(listResult.error);
            }
            // Read all bugs
            const bugs = [];
            for (const filename of listResult.data) {
                const id = filename.replace('.json', '');
                const bugResult = await this.getById(id);
                if (bugResult.success && bugResult.data) {
                    bugs.push(bugResult.data);
                }
            }
            // Apply filters
            let filtered = bugs;
            if (filter) {
                filtered = this.applyFilter(bugs, filter);
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
     * Find bugs by feature ID
     */
    async findByFeature(featureId) {
        const listResult = await this.list({ featureId });
        if (!listResult.success) {
            return (0, common_1.failure)(listResult.error);
        }
        return (0, common_1.success)(listResult.data.items);
    }
    /**
     * Find bugs by status
     */
    async findByStatus(status) {
        const listResult = await this.list({ status });
        if (!listResult.success) {
            return (0, common_1.failure)(listResult.error);
        }
        return (0, common_1.success)(listResult.data.items);
    }
    /**
     * Find bugs by severity
     */
    async findBySeverity(severity) {
        const listResult = await this.list({ severity });
        if (!listResult.success) {
            return (0, common_1.failure)(listResult.error);
        }
        return (0, common_1.success)(listResult.data.items);
    }
    /**
     * Search bugs by text
     */
    async search(searchText) {
        const listResult = await this.list({ searchText });
        if (!listResult.success) {
            return (0, common_1.failure)(listResult.error);
        }
        return (0, common_1.success)(listResult.data.items);
    }
    /**
     * Update bug status
     */
    async updateStatus(id, status) {
        return this.update(id, { status });
    }
    /**
     * Update bug phase
     */
    async updatePhase(id, currentPhase) {
        return this.update(id, { currentPhase });
    }
    /**
     * Add tag to bug
     */
    async addTag(id, tag) {
        const bugResult = await this.getById(id);
        if (!bugResult.success || !bugResult.data) {
            return bugResult;
        }
        const tags = [...bugResult.data.tags, tag];
        return this.update(id, { tags });
    }
    /**
     * Remove tag from bug
     */
    async removeTag(id, tag) {
        const bugResult = await this.getById(id);
        if (!bugResult.success || !bugResult.data) {
            return bugResult;
        }
        const tags = bugResult.data.tags.filter((t) => t !== tag);
        return this.update(id, { tags });
    }
    /**
     * Clear all caches
     */
    clearCache() {
        this.cache.clear();
        this.cacheExpiry.clear();
    }
    // Private helper methods
    setCache(id, bug) {
        this.cache.set(id, bug);
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
    applyFilter(bugs, filter) {
        return bugs.filter((bug) => {
            // Status filter
            if (filter.status) {
                const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
                if (!statuses.includes(bug.status)) {
                    return false;
                }
            }
            // Phase filter
            if (filter.phase) {
                const phases = Array.isArray(filter.phase) ? filter.phase : [filter.phase];
                if (!phases.includes(bug.currentPhase)) {
                    return false;
                }
            }
            // Severity filter
            if (filter.severity) {
                const severities = Array.isArray(filter.severity) ? filter.severity : [filter.severity];
                if (!severities.includes(bug.severity)) {
                    return false;
                }
            }
            // Priority filter
            if (filter.priority) {
                const priorities = Array.isArray(filter.priority) ? filter.priority : [filter.priority];
                if (!priorities.includes(bug.priority)) {
                    return false;
                }
            }
            // Tags filter
            if (filter.tags) {
                const requiredTags = Array.isArray(filter.tags) ? filter.tags : [filter.tags];
                if (!requiredTags.every((tag) => bug.tags.includes(tag))) {
                    return false;
                }
            }
            // Feature ID filter
            if (filter.featureId !== undefined) {
                if (!bug.affectedFeatures.includes(filter.featureId)) {
                    return false;
                }
            }
            // Boolean filters
            if (filter.hasRootCause !== undefined) {
                const hasRootCause = bug.rootCause !== undefined;
                if (hasRootCause !== filter.hasRootCause) {
                    return false;
                }
            }
            if (filter.hasResolution !== undefined) {
                const hasResolution = bug.resolution !== undefined;
                if (hasResolution !== filter.hasResolution) {
                    return false;
                }
            }
            // Date range filters
            if (filter.createdAfter) {
                if (new Date(bug.createdAt) < filter.createdAfter) {
                    return false;
                }
            }
            if (filter.createdBefore) {
                if (new Date(bug.createdAt) > filter.createdBefore) {
                    return false;
                }
            }
            if (filter.updatedAfter) {
                if (new Date(bug.updatedAt) < filter.updatedAfter) {
                    return false;
                }
            }
            if (filter.updatedBefore) {
                if (new Date(bug.updatedAt) > filter.updatedBefore) {
                    return false;
                }
            }
            // Search text filter
            if (filter.searchText) {
                const searchLower = filter.searchText.toLowerCase();
                const searchable = [
                    bug.title,
                    bug.description,
                    bug.stepsToReproduce || '',
                    ...bug.tags,
                ].join(' ').toLowerCase();
                if (!searchable.includes(searchLower)) {
                    return false;
                }
            }
            return true;
        });
    }
    applySort(bugs, sort) {
        const sorted = [...bugs];
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
                case 'severity':
                    // critical > high > medium > low
                    const severityOrder = {
                        'critical': 4,
                        'high': 3,
                        'medium': 2,
                        'low': 1,
                    };
                    aValue = severityOrder[a.severity];
                    bValue = severityOrder[b.severity];
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
exports.BugRepository = BugRepository;
//# sourceMappingURL=BugRepository.js.map