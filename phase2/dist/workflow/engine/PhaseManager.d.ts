/**
 * Phase Manager
 * Handles phase transitions and validation in workflows
 */
import { Result } from '../../types/common';
import { WorkflowTemplate, PhaseDefinition, TransitionRule } from '../schemas/WorkflowTemplate';
import { WorkflowInstance, WorkflowTransition } from '../schemas/WorkflowInstance';
import { Feature } from '../../state/schemas/Feature';
import { Bug } from '../../state/schemas/Bug';
type WorkItem = Feature | Bug;
/**
 * Phase Manager - orchestrates workflow phase transitions
 */
export declare class PhaseManager {
    /**
     * Get current phase definition
     */
    getCurrentPhase(template: WorkflowTemplate, instance: WorkflowInstance): Result<PhaseDefinition>;
    /**
     * Get next phase in workflow
     */
    getNextPhase(template: WorkflowTemplate, currentPhaseId: string): Result<PhaseDefinition | null>;
    /**
     * Get previous phase in workflow
     */
    getPreviousPhase(template: WorkflowTemplate, currentPhaseId: string): Result<PhaseDefinition | null>;
    /**
     * Check if can transition to next phase
     */
    canTransitionToNextPhase(template: WorkflowTemplate, instance: WorkflowInstance, workItem: WorkItem): Promise<Result<{
        canTransition: boolean;
        reasons: string[];
    }>>;
    /**
     * Transition to next phase
     */
    transitionToNextPhase(template: WorkflowTemplate, instance: WorkflowInstance, workItem: WorkItem, triggeredBy: string, triggerType?: 'manual' | 'automatic'): Promise<Result<WorkflowTransition>>;
    /**
     * Transition to specific phase
     */
    transitionToPhase(template: WorkflowTemplate, instance: WorkflowInstance, workItem: WorkItem, targetPhaseId: string, triggeredBy: string, triggerType?: 'manual' | 'automatic'): Promise<Result<WorkflowTransition>>;
    /**
     * Execute phase transition
     */
    private executeTransition;
    /**
     * Check a condition
     */
    private checkCondition;
    /**
     * Execute transition action
     */
    private executeAction;
    /**
     * Get field value from work item
     */
    private getFieldValue;
    /**
     * Compare values using operator
     */
    private compareValues;
    /**
     * Get available transitions from current phase
     */
    getAvailableTransitions(template: WorkflowTemplate, instance: WorkflowInstance): TransitionRule[];
    /**
     * Skip current phase (if allowed)
     */
    skipPhase(template: WorkflowTemplate, instance: WorkflowInstance, workItem: WorkItem, triggeredBy: string, reason: string): Promise<Result<WorkflowTransition>>;
}
export {};
//# sourceMappingURL=PhaseManager.d.ts.map