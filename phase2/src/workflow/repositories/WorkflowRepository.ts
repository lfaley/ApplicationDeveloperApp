/**
 * Workflow Repository
 * Manages persistence of workflow templates and instances
 */

import { FileSystemStorage } from '../../state/storage/FileSystemStorage';
import { Result, success, failure, WorkflowId } from '../../types/common';
import { WorkflowTemplate, validateWorkflowTemplate } from '../schemas/WorkflowTemplate';
import { WorkflowInstance, validateWorkflowInstance } from '../schemas/WorkflowInstance';

/**
 * Repository for workflow templates
 */
export class WorkflowTemplateRepository {
  private storage: FileSystemStorage;
  private readonly TEMPLATES_DIR = 'workflows/templates';
  private cache: Map<WorkflowId, WorkflowTemplate>;

  constructor(baseDir: string) {
    this.storage = new FileSystemStorage(baseDir);
    this.cache = new Map();
  }

  /**
   * Create a new workflow template
   */
  async create(template: Omit<WorkflowTemplate, 'createdAt' | 'updatedAt'>): Promise<Result<WorkflowTemplate>> {
    try {
      const now = new Date().toISOString();
      const fullTemplate: WorkflowTemplate = {
        ...template,
        createdAt: now,
        updatedAt: now
      };

      const errors = validateWorkflowTemplate(fullTemplate);
      if (errors.length > 0) {
        return failure(new Error(`Validation failed: ${errors.join(', ')}`));
      }

      const filePath = `${this.TEMPLATES_DIR}/${template.id}.json`;
      const saveResult = await this.storage.write(filePath, fullTemplate);

      if (!saveResult.success) {
        return failure(saveResult.error);
      }

      this.cache.set(template.id, fullTemplate);
      return success(fullTemplate);
    } catch (error) {
      return failure(error as Error);
    }
  }

  /**
   * Get template by ID
   */
  async getById(id: WorkflowId): Promise<Result<WorkflowTemplate | null>> {
    try {
      const cached = this.cache.get(id);
      if (cached) {
        return success(cached);
      }

      const filePath = `${this.TEMPLATES_DIR}/${id}.json`;
      const readResult = await this.storage.read<WorkflowTemplate>(filePath);

      if (!readResult.success) {
        if (readResult.error.message.includes('ENOENT')) {
          return success(null);
        }
        return failure(readResult.error);
      }

      this.cache.set(id, readResult.data);
      return success(readResult.data);
    } catch (error) {
      return failure(error as Error);
    }
  }

  /**
   * Update template
   */
  async update(id: WorkflowId, updates: Partial<Omit<WorkflowTemplate, 'id' | 'createdAt'>>): Promise<Result<WorkflowTemplate>> {
    try {
      const existingResult = await this.getById(id);
      if (!existingResult.success) {
        return failure(existingResult.error);
      }

      if (!existingResult.data) {
        return failure(new Error(`Template ${id} not found`));
      }

      const updated: WorkflowTemplate = {
        ...existingResult.data,
        ...updates,
        id,
        createdAt: existingResult.data.createdAt,
        updatedAt: new Date().toISOString()
      };

      const errors = validateWorkflowTemplate(updated);
      if (errors.length > 0) {
        return failure(new Error(`Validation failed: ${errors.join(', ')}`));
      }

      const filePath = `${this.TEMPLATES_DIR}/${id}.json`;
      const saveResult = await this.storage.write(filePath, updated);

      if (!saveResult.success) {
        return failure(saveResult.error);
      }

      this.cache.set(id, updated);
      return success(updated);
    } catch (error) {
      return failure(error as Error);
    }
  }

  /**
   * List all templates
   */
  async list(workItemType?: 'feature' | 'bug'): Promise<Result<WorkflowTemplate[]>> {
    try {
      const listResult = await this.storage.list(this.TEMPLATES_DIR);
      if (!listResult.success) {
        return failure(listResult.error);
      }

      const templates: WorkflowTemplate[] = [];
      for (const filename of listResult.data) {
        const id = filename.replace('.json', '') as WorkflowId;
        const templateResult = await this.getById(id);
        if (templateResult.success && templateResult.data) {
          if (!workItemType || templateResult.data.workItemType === workItemType) {
            templates.push(templateResult.data);
          }
        }
      }

      return success(templates);
    } catch (error) {
      return failure(error as Error);
    }
  }

  /**
   * Get default template for work item type
   */
  async getDefault(workItemType: 'feature' | 'bug'): Promise<Result<WorkflowTemplate | null>> {
    const listResult = await this.list(workItemType);
    if (!listResult.success) {
      return failure(listResult.error);
    }

    const defaultTemplate = listResult.data.find(t => t.isDefault && t.isActive);
    return success(defaultTemplate || null);
  }

  /**
   * Delete template
   */
  async delete(id: WorkflowId): Promise<Result<void>> {
    try {
      const filePath = `${this.TEMPLATES_DIR}/${id}.json`;
      const deleteResult = await this.storage.delete(filePath);

      if (!deleteResult.success) {
        return failure(deleteResult.error);
      }

      this.cache.delete(id);
      return success(undefined);
    } catch (error) {
      return failure(error as Error);
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

/**
 * Repository for workflow instances
 */
export class WorkflowInstanceRepository {
  private storage: FileSystemStorage;
  private readonly INSTANCES_DIR = 'workflows/instances';
  private cache: Map<string, WorkflowInstance>;

  constructor(baseDir: string) {
    this.storage = new FileSystemStorage(baseDir);
    this.cache = new Map();
  }

  /**
   * Create new workflow instance
   */
  async create(instance: WorkflowInstance): Promise<Result<WorkflowInstance>> {
    try {
      const errors = validateWorkflowInstance(instance);
      if (errors.length > 0) {
        return failure(new Error(`Validation failed: ${errors.join(', ')}`));
      }

      const filePath = `${this.INSTANCES_DIR}/${instance.id}.json`;
      const saveResult = await this.storage.write(filePath, instance);

      if (!saveResult.success) {
        return failure(saveResult.error);
      }

      this.cache.set(instance.id, instance);
      return success(instance);
    } catch (error) {
      return failure(error as Error);
    }
  }

  /**
   * Get instance by ID
   */
  async getById(id: string): Promise<Result<WorkflowInstance | null>> {
    try {
      const cached = this.cache.get(id);
      if (cached) {
        return success(cached);
      }

      const filePath = `${this.INSTANCES_DIR}/${id}.json`;
      const readResult = await this.storage.read<WorkflowInstance>(filePath);

      if (!readResult.success) {
        if (readResult.error.message.includes('ENOENT')) {
          return success(null);
        }
        return failure(readResult.error);
      }

      this.cache.set(id, readResult.data);
      return success(readResult.data);
    } catch (error) {
      return failure(error as Error);
    }
  }

  /**
   * Get instance by work item ID
   */
  async getByWorkItemId(workItemId: string): Promise<Result<WorkflowInstance | null>> {
    try {
      const listResult = await this.storage.list(this.INSTANCES_DIR);
      if (!listResult.success) {
        return failure(listResult.error);
      }

      for (const filename of listResult.data) {
        const id = filename.replace('.json', '');
        const instanceResult = await this.getById(id);
        if (instanceResult.success && instanceResult.data) {
          if (instanceResult.data.workItemId === workItemId) {
            return success(instanceResult.data);
          }
        }
      }

      return success(null);
    } catch (error) {
      return failure(error as Error);
    }
  }

  /**
   * Update instance
   */
  async update(instance: WorkflowInstance): Promise<Result<WorkflowInstance>> {
    try {
      const errors = validateWorkflowInstance(instance);
      if (errors.length > 0) {
        return failure(new Error(`Validation failed: ${errors.join(', ')}`));
      }

      const filePath = `${this.INSTANCES_DIR}/${instance.id}.json`;
      const saveResult = await this.storage.write(filePath, instance);

      if (!saveResult.success) {
        return failure(saveResult.error);
      }

      this.cache.set(instance.id, instance);
      return success(instance);
    } catch (error) {
      return failure(error as Error);
    }
  }

  /**
   * List instances
   */
  async list(filter?: {
    workItemType?: 'feature' | 'bug';
    status?: string;
  }): Promise<Result<WorkflowInstance[]>> {
    try {
      const listResult = await this.storage.list(this.INSTANCES_DIR);
      if (!listResult.success) {
        return failure(listResult.error);
      }

      const instances: WorkflowInstance[] = [];
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

      return success(instances);
    } catch (error) {
      return failure(error as Error);
    }
  }

  /**
   * Delete instance
   */
  async delete(id: string): Promise<Result<void>> {
    try {
      const filePath = `${this.INSTANCES_DIR}/${id}.json`;
      const deleteResult = await this.storage.delete(filePath);

      if (!deleteResult.success) {
        return failure(deleteResult.error);
      }

      this.cache.delete(id);
      return success(undefined);
    } catch (error) {
      return failure(error as Error);
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}
