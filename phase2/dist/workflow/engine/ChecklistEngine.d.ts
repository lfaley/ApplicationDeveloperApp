/**
 * Checklist Engine
 * Manages checklist progress and validation
 */
import { Result } from '../../types/common';
import { ChecklistDefinition } from '../schemas/WorkflowTemplate';
import { WorkflowInstance, WorkflowChecklist } from '../schemas/WorkflowInstance';
import { ChecklistItem } from '../../state/schemas/Feature';
import { Feature } from '../../state/schemas/Feature';
import { Bug } from '../../state/schemas/Bug';
type WorkItem = Feature | Bug;
/**
 * Checklist Engine - manages checklist creation, updates, and validation
 */
export declare class ChecklistEngine {
    /**
     * Initialize checklist from definition
     */
    initializeChecklist(definition: ChecklistDefinition, workItem: WorkItem): WorkflowChecklist;
    /**
     * Check if item should be included based on conditions
     */
    private shouldIncludeItem;
    /**
     * Create checklist item from definition
     */
    private createChecklistItem;
    /**
     * Complete a checklist item
     */
    completeItem(checklist: WorkflowChecklist, itemId: string, completedBy: string): Result<WorkflowChecklist>;
    /**
     * Uncomplete a checklist item
     */
    uncompleteItem(checklist: WorkflowChecklist, itemId: string): Result<WorkflowChecklist>;
    /**
     * Check if checklist is complete
     */
    private isChecklistComplete;
    /**
     * Validate checklist completion
     */
    validateChecklist(checklist: WorkflowChecklist, definition: ChecklistDefinition): Result<{
        valid: boolean;
        errors: string[];
    }>;
    /**
     * Get checklist progress percentage
     */
    getProgress(checklist: WorkflowChecklist): number;
    /**
     * Get required items progress percentage
     */
    getRequiredProgress(checklist: WorkflowChecklist): number;
    /**
     * Get checklist summary
     */
    getSummary(checklist: WorkflowChecklist): {
        progress: number;
        requiredProgress: number;
        status: 'not-started' | 'in-progress' | 'complete';
        completedCount: string;
        requiredCount: string;
        timeElapsed?: number;
    };
    /**
     * Get incomplete items
     */
    getIncompleteItems(checklist: WorkflowChecklist): ChecklistItem[];
    /**
     * Get incomplete required items
     */
    getIncompleteRequiredItems(checklist: WorkflowChecklist): ChecklistItem[];
    /**
     * Batch complete multiple items
     */
    batchCompleteItems(checklist: WorkflowChecklist, itemIds: string[], completedBy: string): Result<{
        checklist: WorkflowChecklist;
        completed: string[];
        failed: string[];
    }>;
    /**
     * Get checklists for current phase
     */
    getPhaseChecklists(instance: WorkflowInstance, currentPhaseId: string, definitions: ChecklistDefinition[]): WorkflowChecklist[];
    /**
     * Add checklist to instance
     */
    addChecklist(instance: WorkflowInstance, definition: ChecklistDefinition, workItem: WorkItem): Result<WorkflowInstance>;
    /**
     * Remove checklist from instance
     */
    removeChecklist(instance: WorkflowInstance, checklistId: string): Result<WorkflowInstance>;
    /**
     * Reset checklist (mark all items as incomplete)
     */
    resetChecklist(checklist: WorkflowChecklist): WorkflowChecklist;
    /**
     * Get field value from work item
     */
    private getFieldValue;
    /**
     * Evaluate condition
     */
    private evaluateCondition;
}
export {};
//# sourceMappingURL=ChecklistEngine.d.ts.map