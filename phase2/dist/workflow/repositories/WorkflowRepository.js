"use strict";
/**
 * Workflow Repository
 * Manages persistence of workflow templates and instances
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowInstanceRepository = exports.WorkflowTemplateRepository = void 0;
const FileSystemStorage_1 = require("../../state/storage/FileSystemStorage");
const common_1 = require("../../types/common");
const WorkflowTemplate_1 = require("../schemas/WorkflowTemplate");
const WorkflowInstance_1 = require("../schemas/WorkflowInstance");
/**
 * Repository for workflow templates
 */
class WorkflowTemplateRepository {
    storage;
    TEMPLATES_DIR = 'workflows/templates';
    cache;
    constructor(baseDir) {
        this.storage = new FileSystemStorage_1.FileSystemStorage(baseDir);
        this.cache = new Map();
    }
    /**
     * Create a new workflow template
     */
    async create(template) {
        try {
            const now = new Date().toISOString();
            const fullTemplate = {
                ...template,
                createdAt: now,
                updatedAt: now
            };
            const errors = (0, WorkflowTemplate_1.validateWorkflowTemplate)(fullTemplate);
            if (errors.length > 0) {
                return (0, common_1.failure)(new Error(`Validation failed: ${errors.join(', ')}`));
            }
            const filePath = `${this.TEMPLATES_DIR}/${template.id}.json`;
            const saveResult = await this.storage.write(filePath, fullTemplate);
            if (!saveResult.success) {
                return (0, common_1.failure)(saveResult.error);
            }
            this.cache.set(template.id, fullTemplate);
            return (0, common_1.success)(fullTemplate);
        }
        catch (error) {
            return (0, common_1.failure)(error);
        }
    }
    /**
     * Get template by ID
     */
    async getById(id) {
        try {
            const cached = this.cache.get(id);
            if (cached) {
                return (0, common_1.success)(cached);
            }
            const filePath = `${this.TEMPLATES_DIR}/${id}.json`;
            const readResult = await this.storage.read(filePath);
            if (!readResult.success) {
                if (readResult.error.message.includes('ENOENT')) {
                    return (0, common_1.success)(null);
                }
                return (0, common_1.failure)(readResult.error);
            }
            this.cache.set(id, readResult.data);
            return (0, common_1.success)(readResult.data);
        }
        catch (error) {
            return (0, common_1.failure)(error);
        }
    }
    /**
     * Update template
     */
    async update(id, updates) {
        try {
            const existingResult = await this.getById(id);
            if (!existingResult.success) {
                return (0, common_1.failure)(existingResult.error);
            }
            if (!existingResult.data) {
                return (0, common_1.failure)(new Error(`Template ${id} not found`));
            }
            const updated = {
                ...existingResult.data,
                ...updates,
                id,
                createdAt: existingResult.data.createdAt,
                updatedAt: new Date().toISOString()
            };
            const errors = (0, WorkflowTemplate_1.validateWorkflowTemplate)(updated);
            if (errors.length > 0) {
                return (0, common_1.failure)(new Error(`Validation failed: ${errors.join(', ')}`));
            }
            const filePath = `${this.TEMPLATES_DIR}/${id}.json`;
            const saveResult = await this.storage.write(filePath, updated);
            if (!saveResult.success) {
                return (0, common_1.failure)(saveResult.error);
            }
            this.cache.set(id, updated);
            return (0, common_1.success)(updated);
        }
        catch (error) {
            return (0, common_1.failure)(error);
        }
    }
    /**
     * List all templates
     */
    async list(workItemType) {
        try {
            const listResult = await this.storage.list(this.TEMPLATES_DIR);
            if (!listResult.success) {
                return (0, common_1.failure)(listResult.error);
            }
            const templates = [];
            for (const filename of listResult.data) {
                const id = filename.replace('.json', '');
                const templateResult = await this.getById(id);
                if (templateResult.success && templateResult.data) {
                    if (!workItemType || templateResult.data.workItemType === workItemType) {
                        templates.push(templateResult.data);
                    }
                }
            }
            return (0, common_1.success)(templates);
        }
        catch (error) {
            return (0, common_1.failure)(error);
        }
    }
    /**
     * Get default template for work item type
     */
    async getDefault(workItemType) {
        const listResult = await this.list(workItemType);
        if (!listResult.success) {
            return (0, common_1.failure)(listResult.error);
        }
        const defaultTemplate = listResult.data.find(t => t.isDefault && t.isActive);
        return (0, common_1.success)(defaultTemplate || null);
    }
    /**
     * Delete template
     */
    async delete(id) {
        try {
            const filePath = `${this.TEMPLATES_DIR}/${id}.json`;
            const deleteResult = await this.storage.delete(filePath);
            if (!deleteResult.success) {
                return (0, common_1.failure)(deleteResult.error);
            }
            this.cache.delete(id);
            return (0, common_1.success)(undefined);
        }
        catch (error) {
            return (0, common_1.failure)(error);
        }
    }
    clearCache() {
        this.cache.clear();
    }
}
exports.WorkflowTemplateRepository = WorkflowTemplateRepository;
/**
 * Repository for workflow instances
 */
class WorkflowInstanceRepository {
    storage;
    INSTANCES_DIR = 'workflows/instances';
    cache;
    constructor(baseDir) {
        this.storage = new FileSystemStorage_1.FileSystemStorage(baseDir);
        this.cache = new Map();
    }
    /**
     * Create new workflow instance
     */
    async create(instance) {
        try {
            const errors = (0, WorkflowInstance_1.validateWorkflowInstance)(instance);
            if (errors.length > 0) {
                return (0, common_1.failure)(new Error(`Validation failed: ${errors.join(', ')}`));
            }
            const filePath = `${this.INSTANCES_DIR}/${instance.id}.json`;
            const saveResult = await this.storage.write(filePath, instance);
            if (!saveResult.success) {
                return (0, common_1.failure)(saveResult.error);
            }
            this.cache.set(instance.id, instance);
            return (0, common_1.success)(instance);
        }
        catch (error) {
            return (0, common_1.failure)(error);
        }
    }
    /**
     * Get instance by ID
     */
    async getById(id) {
        try {
            const cached = this.cache.get(id);
            if (cached) {
                return (0, common_1.success)(cached);
            }
            const filePath = `${this.INSTANCES_DIR}/${id}.json`;
            const readResult = await this.storage.read(filePath);
            if (!readResult.success) {
                if (readResult.error.message.includes('ENOENT')) {
                    return (0, common_1.success)(null);
                }
                return (0, common_1.failure)(readResult.error);
            }
            this.cache.set(id, readResult.data);
            return (0, common_1.success)(readResult.data);
        }
        catch (error) {
            return (0, common_1.failure)(error);
        }
    }
    /**
     * Get instance by work item ID
     */
    async getByWorkItemId(workItemId) {
        try {
            const listResult = await this.storage.list(this.INSTANCES_DIR);
            if (!listResult.success) {
                return (0, common_1.failure)(listResult.error);
            }
            for (const filename of listResult.data) {
                const id = filename.replace('.json', '');
                const instanceResult = await this.getById(id);
                if (instanceResult.success && instanceResult.data) {
                    if (instanceResult.data.workItemId === workItemId) {
                        return (0, common_1.success)(instanceResult.data);
                    }
                }
            }
            return (0, common_1.success)(null);
        }
        catch (error) {
            return (0, common_1.failure)(error);
        }
    }
    /**
     * Update instance
     */
    async update(instance) {
        try {
            const errors = (0, WorkflowInstance_1.validateWorkflowInstance)(instance);
            if (errors.length > 0) {
                return (0, common_1.failure)(new Error(`Validation failed: ${errors.join(', ')}`));
            }
            const filePath = `${this.INSTANCES_DIR}/${instance.id}.json`;
            const saveResult = await this.storage.write(filePath, instance);
            if (!saveResult.success) {
                return (0, common_1.failure)(saveResult.error);
            }
            this.cache.set(instance.id, instance);
            return (0, common_1.success)(instance);
        }
        catch (error) {
            return (0, common_1.failure)(error);
        }
    }
    /**
     * List instances
     */
    async list(filter) {
        try {
            const listResult = await this.storage.list(this.INSTANCES_DIR);
            if (!listResult.success) {
                return (0, common_1.failure)(listResult.error);
            }
            const instances = [];
            for (const filename of listResult.data) {
                const id = filename.replace('.json', '');
                const instanceResult = await this.getById(id);
                if (instanceResult.success && instanceResult.data) {
                    const instance = instanceResult.data;
                    if (filter) {
                        if (filter.workItemType && instance.workItemType !== filter.workItemType) {
                            continue;
                        }
                        if (filter.status && instance.status !== filter.status) {
                            continue;
                        }
                    }
                    instances.push(instance);
                }
            }
            return (0, common_1.success)(instances);
        }
        catch (error) {
            return (0, common_1.failure)(error);
        }
    }
    /**
     * Delete instance
     */
    async delete(id) {
        try {
            const filePath = `${this.INSTANCES_DIR}/${id}.json`;
            const deleteResult = await this.storage.delete(filePath);
            if (!deleteResult.success) {
                return (0, common_1.failure)(deleteResult.error);
            }
            this.cache.delete(id);
            return (0, common_1.success)(undefined);
        }
        catch (error) {
            return (0, common_1.failure)(error);
        }
    }
    clearCache() {
        this.cache.clear();
    }
}
exports.WorkflowInstanceRepository = WorkflowInstanceRepository;
//# sourceMappingURL=WorkflowRepository.js.map