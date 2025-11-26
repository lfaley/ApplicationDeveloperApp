"use strict";
/**
 * Workflow Instance Schema
 * Represents the runtime state of a workflow for a specific work item
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkflowInstance = createWorkflowInstance;
exports.validateWorkflowInstance = validateWorkflowInstance;
exports.calculateWorkflowStatistics = calculateWorkflowStatistics;
/**
 * Create a new workflow instance
 */
function createWorkflowInstance(workflowTemplateId, workItemId, workItemType, initialPhaseId, initialPhase) {
    const now = new Date().toISOString();
    return {
        id: `WFI-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        workflowTemplateId,
        workItemId,
        workItemType,
        currentPhaseId: initialPhaseId,
        currentPhase: initialPhase,
        status: 'active',
        startedAt: now,
        currentPhaseStartedAt: now,
        phaseHistory: [],
        checklists: [],
        qualityGateResults: [],
        approvals: [],
        custom: {}
    };
}
/**
 * Validate workflow instance
 */
function validateWorkflowInstance(instance) {
    const errors = [];
    if (!instance.id) {
        errors.push('Workflow instance ID is required');
    }
    if (!instance.workflowTemplateId) {
        errors.push('Workflow template ID is required');
    }
    if (!instance.workItemId) {
        errors.push('Work item ID is required');
    }
    if (!instance.currentPhaseId) {
        errors.push('Current phase ID is required');
    }
    if (!instance.startedAt) {
        errors.push('Start timestamp is required');
    }
    // Validate completed instances have completion timestamp
    if (instance.status === 'completed' && !instance.completedAt) {
        errors.push('Completed workflows must have completedAt timestamp');
    }
    return errors;
}
/**
 * Calculate workflow instance statistics
 */
function calculateWorkflowStatistics(instance) {
    const now = Date.now();
    const startTime = new Date(instance.startedAt).getTime();
    const currentPhaseStartTime = new Date(instance.currentPhaseStartedAt).getTime();
    const totalDuration = instance.completedAt
        ? new Date(instance.completedAt).getTime() - startTime
        : undefined;
    const currentPhaseDuration = now - currentPhaseStartTime;
    const completedPhases = instance.phaseHistory.filter(h => h.outcome === 'completed').length;
    const totalPhases = instance.phaseHistory.length + 1; // +1 for current phase
    const totalChecklistItems = instance.checklists.reduce((sum, cl) => sum + cl.totalItems, 0);
    const completedChecklistItems = instance.checklists.reduce((sum, cl) => sum + cl.completedItems, 0);
    const checklistCompletion = totalChecklistItems > 0
        ? (completedChecklistItems / totalChecklistItems) * 100
        : 0;
    const qualityGatesPass = instance.qualityGateResults.filter(qg => qg.passed || qg.bypassed).length;
    const qualityGatesTotal = instance.qualityGateResults.length;
    const pendingApprovals = instance.approvals.filter(a => a.status === 'pending').length;
    return {
        totalDuration,
        currentPhaseDuration,
        completedPhases,
        totalPhases,
        checklistCompletion,
        qualityGatesPass,
        qualityGatesTotal,
        pendingApprovals
    };
}
//# sourceMappingURL=WorkflowInstance.js.map