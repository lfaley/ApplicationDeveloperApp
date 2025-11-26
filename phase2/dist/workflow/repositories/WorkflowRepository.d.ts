/**
 * Workflow Repository
 * Manages persistence of workflow templates and instances
 */
import { Result, WorkflowId } from '../../types/common';
import { WorkflowTemplate } from '../schemas/WorkflowTemplate';
import { WorkflowInstance } from '../schemas/WorkflowInstance';
/**
 * Repository for workflow templates
 */
export declare class WorkflowTemplateRepository {
    private storage;
    private readonly TEMPLATES_DIR;
    private cache;
    constructor(baseDir: string);
    /**
     * Create a new workflow template
     */
    create(template: Omit<WorkflowTemplate, 'createdAt' | 'updatedAt'>): Promise<Result<WorkflowTemplate>>;
    /**
     * Get template by ID
     */
    getById(id: WorkflowId): Promise<Result<WorkflowTemplate | null>>;
    /**
     * Update template
     */
    update(id: WorkflowId, updates: Partial<Omit<WorkflowTemplate, 'id' | 'createdAt'>>): Promise<Result<WorkflowTemplate>>;
    /**
     * List all templates
     */
    list(workItemType?: 'feature' | 'bug'): Promise<Result<WorkflowTemplate[]>>;
    /**
     * Get default template for work item type
     */
    getDefault(workItemType: 'feature' | 'bug'): Promise<Result<WorkflowTemplate | null>>;
    /**
     * Delete template
     */
    delete(id: WorkflowId): Promise<Result<void>>;
    clearCache(): void;
}
/**
 * Repository for workflow instances
 */
export declare class WorkflowInstanceRepository {
    private storage;
    private readonly INSTANCES_DIR;
    private cache;
    constructor(baseDir: string);
    /**
     * Create new workflow instance
     */
    create(instance: WorkflowInstance): Promise<Result<WorkflowInstance>>;
    /**
     * Get instance by ID
     */
    getById(id: string): Promise<Result<WorkflowInstance | null>>;
    /**
     * Get instance by work item ID
     */
    getByWorkItemId(workItemId: string): Promise<Result<WorkflowInstance | null>>;
    /**
     * Update instance
     */
    update(instance: WorkflowInstance): Promise<Result<WorkflowInstance>>;
    /**
     * List instances
     */
    list(filter?: {
        workItemType?: 'feature' | 'bug';
        status?: string;
    }): Promise<Result<WorkflowInstance[]>>;
    /**
     * Delete instance
     */
    delete(id: string): Promise<Result<void>>;
    clearCache(): void;
}
//# sourceMappingURL=WorkflowRepository.d.ts.map