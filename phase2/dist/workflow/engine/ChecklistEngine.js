"use strict";
/**
 * Checklist Engine
 * Manages checklist progress and validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecklistEngine = void 0;
const common_1 = require("../../types/common");
/**
 * Checklist Engine - manages checklist creation, updates, and validation
 */
class ChecklistEngine {
    /**
     * Initialize checklist from definition
     */
    initializeChecklist(definition, workItem) {
        const items = definition.items
            .filter(itemDef => this.shouldIncludeItem(itemDef, workItem))
            .map(itemDef => this.createChecklistItem(itemDef));
        const totalItems = items.length;
        const requiredItems = items.filter(item => item.required).length;
        return {
            checklistId: definition.id,
            checklistName: definition.name,
            items,
            totalItems,
            completedItems: 0,
            requiredItems,
            completedRequiredItems: 0,
            isComplete: false,
            isMandatory: definition.isMandatory,
            startedAt: new Date().toISOString()
        };
    }
    /**
     * Check if item should be included based on conditions
     */
    shouldIncludeItem(itemDef, workItem) {
        if (!itemDef.isConditional || !itemDef.condition) {
            return true;
        }
        // Evaluate condition
        const condition = itemDef.condition;
        const fieldValue = this.getFieldValue(workItem, condition.field);
        return this.evaluateCondition(fieldValue, condition.value, condition.operator);
    }
    /**
     * Create checklist item from definition
     */
    createChecklistItem(itemDef) {
        return {
            id: itemDef.id,
            text: itemDef.text,
            completed: false,
            required: itemDef.isRequired
        };
    }
    /**
     * Complete a checklist item
     */
    completeItem(checklist, itemId, completedBy) {
        const item = checklist.items.find(i => i.id === itemId);
        if (!item) {
            return (0, common_1.failure)(new Error(`Checklist item ${itemId} not found`));
        }
        if (item.completed) {
            return (0, common_1.failure)(new Error(`Checklist item ${itemId} already completed`));
        }
        // Mark item as completed
        const now = new Date().toISOString();
        item.completed = true;
        item.completedAt = now;
        item.completedBy = completedBy;
        // Update counts
        checklist.completedItems++;
        if (item.required) {
            checklist.completedRequiredItems++;
        }
        // Check if checklist is complete
        checklist.isComplete = this.isChecklistComplete(checklist);
        if (checklist.isComplete && !checklist.completedAt) {
            checklist.completedAt = now;
        }
        return (0, common_1.success)(checklist);
    }
    /**
     * Uncomplete a checklist item
     */
    uncompleteItem(checklist, itemId) {
        const item = checklist.items.find(i => i.id === itemId);
        if (!item) {
            return (0, common_1.failure)(new Error(`Checklist item ${itemId} not found`));
        }
        if (!item.completed) {
            return (0, common_1.failure)(new Error(`Checklist item ${itemId} not completed`));
        }
        // Mark item as not completed
        item.completed = false;
        item.completedAt = undefined;
        item.completedBy = undefined;
        // Update counts
        checklist.completedItems--;
        if (item.required) {
            checklist.completedRequiredItems--;
        }
        // Update completion status
        checklist.isComplete = false;
        checklist.completedAt = undefined;
        return (0, common_1.success)(checklist);
    }
    /**
     * Check if checklist is complete
     */
    isChecklistComplete(checklist) {
        // If mandatory, all items must be complete
        if (checklist.isMandatory) {
            return checklist.completedItems === checklist.totalItems;
        }
        // If not mandatory, only required items must be complete
        return checklist.completedRequiredItems === checklist.requiredItems;
    }
    /**
     * Validate checklist completion
     */
    validateChecklist(checklist, definition) {
        const errors = [];
        // Check required items
        const incompleteRequired = checklist.items.filter(item => item.required && !item.completed);
        if (incompleteRequired.length > 0) {
            errors.push(`${incompleteRequired.length} required items not completed: ${incompleteRequired.map(i => i.text).join(', ')}`);
        }
        // Check if all items complete when required
        if (definition.requiresAllComplete) {
            const incompleteItems = checklist.items.filter(item => !item.completed);
            if (incompleteItems.length > 0) {
                errors.push(`All items must be completed. ${incompleteItems.length} items remaining.`);
            }
        }
        return (0, common_1.success)({
            valid: errors.length === 0,
            errors
        });
    }
    /**
     * Get checklist progress percentage
     */
    getProgress(checklist) {
        if (checklist.totalItems === 0)
            return 100;
        return (checklist.completedItems / checklist.totalItems) * 100;
    }
    /**
     * Get required items progress percentage
     */
    getRequiredProgress(checklist) {
        if (checklist.requiredItems === 0)
            return 100;
        return (checklist.completedRequiredItems / checklist.requiredItems) * 100;
    }
    /**
     * Get checklist summary
     */
    getSummary(checklist) {
        const progress = this.getProgress(checklist);
        const requiredProgress = this.getRequiredProgress(checklist);
        let status = 'not-started';
        if (checklist.isComplete) {
            status = 'complete';
        }
        else if (checklist.completedItems > 0) {
            status = 'in-progress';
        }
        const timeElapsed = checklist.startedAt
            ? Date.now() - new Date(checklist.startedAt).getTime()
            : undefined;
        return {
            progress,
            requiredProgress,
            status,
            completedCount: `${checklist.completedItems}/${checklist.totalItems}`,
            requiredCount: `${checklist.completedRequiredItems}/${checklist.requiredItems}`,
            timeElapsed
        };
    }
    /**
     * Get incomplete items
     */
    getIncompleteItems(checklist) {
        return checklist.items.filter(item => !item.completed);
    }
    /**
     * Get incomplete required items
     */
    getIncompleteRequiredItems(checklist) {
        return checklist.items.filter(item => item.required && !item.completed);
    }
    /**
     * Batch complete multiple items
     */
    batchCompleteItems(checklist, itemIds, completedBy) {
        const completed = [];
        const failed = [];
        for (const itemId of itemIds) {
            const result = this.completeItem(checklist, itemId, completedBy);
            if (result.success) {
                completed.push(itemId);
            }
            else {
                failed.push(itemId);
            }
        }
        return (0, common_1.success)({
            checklist,
            completed,
            failed
        });
    }
    /**
     * Get checklists for current phase
     */
    getPhaseChecklists(instance, currentPhaseId, definitions) {
        return instance.checklists.filter(checklist => {
            const definition = definitions.find(d => d.id === checklist.checklistId);
            return definition?.activeInPhases.includes(currentPhaseId);
        });
    }
    /**
     * Add checklist to instance
     */
    addChecklist(instance, definition, workItem) {
        // Check if checklist already exists
        const existing = instance.checklists.find(cl => cl.checklistId === definition.id);
        if (existing) {
            return (0, common_1.failure)(new Error(`Checklist ${definition.id} already exists`));
        }
        // Initialize and add checklist
        const checklist = this.initializeChecklist(definition, workItem);
        instance.checklists.push(checklist);
        return (0, common_1.success)(instance);
    }
    /**
     * Remove checklist from instance
     */
    removeChecklist(instance, checklistId) {
        const index = instance.checklists.findIndex(cl => cl.checklistId === checklistId);
        if (index === -1) {
            return (0, common_1.failure)(new Error(`Checklist ${checklistId} not found`));
        }
        instance.checklists.splice(index, 1);
        return (0, common_1.success)(instance);
    }
    /**
     * Reset checklist (mark all items as incomplete)
     */
    resetChecklist(checklist) {
        for (const item of checklist.items) {
            item.completed = false;
            item.completedAt = undefined;
            item.completedBy = undefined;
        }
        checklist.completedItems = 0;
        checklist.completedRequiredItems = 0;
        checklist.isComplete = false;
        checklist.completedAt = undefined;
        return checklist;
    }
    /**
     * Get field value from work item
     */
    getFieldValue(workItem, fieldPath) {
        const parts = fieldPath.split('.');
        let value = workItem;
        for (const part of parts) {
            if (value && typeof value === 'object' && part in value) {
                value = value[part];
            }
            else {
                return undefined;
            }
        }
        return value;
    }
    /**
     * Evaluate condition
     */
    evaluateCondition(actual, expected, operator) {
        switch (operator) {
            case 'equals':
                return actual === expected;
            case 'not-equals':
                return actual !== expected;
            case 'greater-than':
                return actual > expected;
            case 'less-than':
                return actual < expected;
            case 'contains':
                return Array.isArray(actual)
                    ? actual.includes(expected)
                    : String(actual).includes(String(expected));
            case 'exists':
                return actual !== undefined && actual !== null;
            case 'not-exists':
                return actual === undefined || actual === null;
            default:
                return false;
        }
    }
}
exports.ChecklistEngine = ChecklistEngine;
//# sourceMappingURL=ChecklistEngine.js.map