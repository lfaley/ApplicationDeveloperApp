/**
 * Phase Manager
 * Handles phase transitions and validation in workflows
 */

import { Result, success, failure } from '../../types/common';
import { WorkflowTemplate, PhaseDefinition, TransitionRule, Condition } from '../schemas/WorkflowTemplate';
import { 
  WorkflowInstance, 
  WorkflowTransition, 
  PhaseHistoryEntry,
  ConditionCheckResult,
  ActionExecutionResult
} from '../schemas/WorkflowInstance';
import { Feature, FeaturePhase } from '../../state/schemas/Feature';
import { Bug, BugPhase } from '../../state/schemas/Bug';

type WorkItem = Feature | Bug;

/**
 * Phase Manager - orchestrates workflow phase transitions
 */
export class PhaseManager {
  /**
   * Get current phase definition
   */
  getCurrentPhase(
    template: WorkflowTemplate,
    instance: WorkflowInstance
  ): Result<PhaseDefinition> {
    const phase = template.phases.find(p => p.id === instance.currentPhaseId);
    
    if (!phase) {
      return failure(new Error(`Phase ${instance.currentPhaseId} not found in template`));
    }
    
    return success(phase);
  }

  /**
   * Get next phase in workflow
   */
  getNextPhase(
    template: WorkflowTemplate,
    currentPhaseId: string
  ): Result<PhaseDefinition | null> {
    const currentPhase = template.phases.find(p => p.id === currentPhaseId);
    
    if (!currentPhase) {
      return failure(new Error(`Phase ${currentPhaseId} not found`));
    }
    
    // Find phase with order = currentPhase.order + 1
    const nextPhase = template.phases.find(p => p.order === currentPhase.order + 1);
    
    return success(nextPhase || null);
  }

  /**
   * Get previous phase in workflow
   */
  getPreviousPhase(
    template: WorkflowTemplate,
    currentPhaseId: string
  ): Result<PhaseDefinition | null> {
    const currentPhase = template.phases.find(p => p.id === currentPhaseId);
    
    if (!currentPhase) {
      return failure(new Error(`Phase ${currentPhaseId} not found`));
    }
    
    // Find phase with order = currentPhase.order - 1
    const previousPhase = template.phases.find(p => p.order === currentPhase.order - 1);
    
    return success(previousPhase || null);
  }

  /**
   * Check if can transition to next phase
   */
  async canTransitionToNextPhase(
    template: WorkflowTemplate,
    instance: WorkflowInstance,
    workItem: WorkItem
  ): Promise<Result<{ canTransition: boolean; reasons: string[] }>> {
    const currentPhaseResult = this.getCurrentPhase(template, instance);
    if (!currentPhaseResult.success) {
      return failure(currentPhaseResult.error);
    }
    
    const currentPhase = currentPhaseResult.data;
    const reasons: string[] = [];
    
    // Check exit conditions
    for (const condition of currentPhase.exitConditions) {
      const checkResult = await this.checkCondition(condition, instance, workItem);
      if (!checkResult.passed) {
        reasons.push(checkResult.message);
      }
    }
    
    const canTransition = reasons.length === 0;
    return success({ canTransition, reasons });
  }

  /**
   * Transition to next phase
   */
  async transitionToNextPhase(
    template: WorkflowTemplate,
    instance: WorkflowInstance,
    workItem: WorkItem,
    triggeredBy: string,
    triggerType: 'manual' | 'automatic' = 'manual'
  ): Promise<Result<WorkflowTransition>> {
    // Check if can transition
    const canTransitionResult = await this.canTransitionToNextPhase(template, instance, workItem);
    if (!canTransitionResult.success) {
      return failure(canTransitionResult.error);
    }
    
    if (!canTransitionResult.data.canTransition) {
      return failure(new Error(
        `Cannot transition: ${canTransitionResult.data.reasons.join(', ')}`
      ));
    }
    
    // Get next phase
    const nextPhaseResult = this.getNextPhase(template, instance.currentPhaseId);
    if (!nextPhaseResult.success) {
      return failure(nextPhaseResult.error);
    }
    
    if (!nextPhaseResult.data) {
      return failure(new Error('No next phase available'));
    }
    
    const nextPhase = nextPhaseResult.data;
    
    // Execute transition
    return this.executeTransition(
      template,
      instance,
      workItem,
      instance.currentPhaseId,
      nextPhase.id,
      triggeredBy,
      triggerType
    );
  }

  /**
   * Transition to specific phase
   */
  async transitionToPhase(
    template: WorkflowTemplate,
    instance: WorkflowInstance,
    workItem: WorkItem,
    targetPhaseId: string,
    triggeredBy: string,
    triggerType: 'manual' | 'automatic' = 'manual'
  ): Promise<Result<WorkflowTransition>> {
    const targetPhase = template.phases.find(p => p.id === targetPhaseId);
    if (!targetPhase) {
      return failure(new Error(`Target phase ${targetPhaseId} not found`));
    }
    
    return this.executeTransition(
      template,
      instance,
      workItem,
      instance.currentPhaseId,
      targetPhaseId,
      triggeredBy,
      triggerType
    );
  }

  /**
   * Execute phase transition
   */
  private async executeTransition(
    template: WorkflowTemplate,
    instance: WorkflowInstance,
    workItem: WorkItem,
    fromPhaseId: string,
    toPhaseId: string,
    triggeredBy: string,
    triggerType: 'manual' | 'automatic'
  ): Promise<Result<WorkflowTransition>> {
    const now = new Date().toISOString();
    const fromPhase = template.phases.find(p => p.id === fromPhaseId);
    const toPhase = template.phases.find(p => p.id === toPhaseId);
    
    if (!fromPhase || !toPhase) {
      return failure(new Error('Invalid phase IDs'));
    }
    
    // Create transition record
    const transition: WorkflowTransition = {
      id: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      workflowInstanceId: instance.id,
      fromPhaseId,
      fromPhase: fromPhase.phase as FeaturePhase | BugPhase,
      toPhaseId,
      toPhase: toPhase.phase as FeaturePhase | BugPhase,
      triggeredAt: now,
      triggeredBy,
      triggerType,
      status: 'pending',
      conditionsChecked: [],
      allConditionsMet: true,
      actionsExecuted: []
    };
    
    try {
      // Check entry conditions of target phase
      transition.status = 'in-progress';
      
      for (const condition of toPhase.entryConditions) {
        const checkResult = await this.checkCondition(condition, instance, workItem);
        transition.conditionsChecked.push(checkResult);
        
        if (!checkResult.passed) {
          transition.allConditionsMet = false;
        }
      }
      
      if (!transition.allConditionsMet) {
        transition.status = 'failed';
        transition.error = 'Entry conditions not met';
        transition.completedAt = new Date().toISOString();
        return failure(new Error('Entry conditions not met'));
      }
      
      // Find and execute transition rule actions
      const transitionRule = template.transitions.find(
        tr => tr.fromPhase === fromPhaseId && tr.toPhase === toPhaseId
      );
      
      if (transitionRule) {
        for (const action of transitionRule.actions) {
          const actionResult = await this.executeAction(action, instance, workItem);
          transition.actionsExecuted.push(actionResult);
          
          if (!actionResult.success) {
            transition.status = 'failed';
            transition.error = `Action ${action.type} failed: ${actionResult.error}`;
            transition.completedAt = new Date().toISOString();
            return failure(new Error(transition.error));
          }
        }
      }
      
      // Update instance
      const phaseEndTime = new Date().toISOString();
      const phaseStartTime = new Date(instance.currentPhaseStartedAt).getTime();
      const phaseEndTimeMs = new Date(phaseEndTime).getTime();
      
      const historyEntry: PhaseHistoryEntry = {
        phaseId: fromPhaseId,
        phaseName: fromPhase.name,
        phase: fromPhase.phase as FeaturePhase | BugPhase,
        startedAt: instance.currentPhaseStartedAt,
        completedAt: phaseEndTime,
        duration: phaseEndTimeMs - phaseStartTime,
        outcome: 'completed',
        transitionedBy: triggeredBy,
        transitionType: triggerType
      };
      
      instance.phaseHistory.push(historyEntry);
      instance.currentPhaseId = toPhaseId;
      instance.currentPhase = toPhase.phase as FeaturePhase | BugPhase;
      instance.currentPhaseStartedAt = new Date().toISOString();
      
      // Check if workflow is complete
      if (toPhase.phase === 'complete') {
        instance.status = 'completed';
        instance.completedAt = new Date().toISOString();
      }
      
      transition.status = 'completed';
      transition.completedAt = new Date().toISOString();
      
      return success(transition);
    } catch (error) {
      transition.status = 'failed';
      transition.error = error instanceof Error ? error.message : 'Unknown error';
      transition.completedAt = new Date().toISOString();
      
      return failure(error as Error);
    }
  }

  /**
   * Check a condition
   */
  private async checkCondition(
    condition: Condition,
    instance: WorkflowInstance,
    workItem: WorkItem
  ): Promise<ConditionCheckResult> {
    const now = new Date().toISOString();
    let passed = false;
    let actualValue: any = null;
    let message = '';
    
    try {
      switch (condition.type) {
        case 'field-value':
          actualValue = this.getFieldValue(workItem, condition.field);
          passed = this.compareValues(actualValue, condition.value, condition.operator);
          message = passed 
            ? `Field ${condition.field} check passed`
            : condition.errorMessage || `Field ${condition.field} check failed`;
          break;
          
        case 'quality-gate':
          const gateResult = instance.qualityGateResults.find(
            qg => qg.gateId === condition.field
          );
          actualValue = gateResult?.passed || false;
          passed = actualValue === condition.value;
          message = passed
            ? `Quality gate ${condition.field} passed`
            : condition.errorMessage || `Quality gate ${condition.field} not passed`;
          break;
          
        case 'checklist':
          const checklist = instance.checklists.find(
            cl => cl.checklistId === condition.field
          );
          actualValue = checklist?.isComplete || false;
          passed = actualValue === condition.value;
          message = passed
            ? `Checklist ${condition.field} complete`
            : condition.errorMessage || `Checklist ${condition.field} not complete`;
          break;
          
        case 'time-elapsed':
          const elapsed = Date.now() - new Date(instance.currentPhaseStartedAt).getTime();
          actualValue = elapsed;
          passed = this.compareValues(elapsed, condition.value, condition.operator);
          message = passed
            ? `Time check passed`
            : condition.errorMessage || `Time check failed`;
          break;
          
        case 'approval':
          const approval = instance.approvals.find(
            a => a.type === 'phase-transition' && a.phaseId === instance.currentPhaseId
          );
          actualValue = approval?.status || 'none';
          passed = actualValue === condition.value;
          message = passed
            ? `Approval check passed`
            : condition.errorMessage || `Approval required`;
          break;
          
        default:
          message = `Unknown condition type: ${condition.type}`;
          passed = false;
      }
    } catch (error) {
      message = error instanceof Error ? error.message : 'Condition check error';
      passed = false;
    }
    
    return {
      conditionId: condition.id,
      conditionType: condition.type,
      passed,
      actualValue,
      expectedValue: condition.value,
      message,
      checkedAt: now
    };
  }

  /**
   * Execute transition action
   */
  private async executeAction(
    action: { id: string; type: string; config: Record<string, any> },
    _instance: WorkflowInstance,
    _workItem: WorkItem
  ): Promise<ActionExecutionResult> {
    const startTime = Date.now();
    const now = new Date().toISOString();
    
    try {
      // Action execution would be implemented here
      // For now, return success placeholder
      // Parameters prefixed with _ are intentionally unused but kept for interface consistency
      
      return {
        actionId: action.id,
        actionType: action.type,
        success: true,
        executedAt: now,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        actionId: action.id,
        actionType: action.type,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executedAt: now,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Get field value from work item
   */
  private getFieldValue(workItem: WorkItem, fieldPath: string): any {
    const parts = fieldPath.split('.');
    let value: any = workItem;
    
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part as keyof typeof value];
      } else {
        return undefined;
      }
    }
    
    return value;
  }

  /**
   * Compare values using operator
   */
  private compareValues(actual: any, expected: any, operator: string): boolean {
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
      case 'not-contains':
        return Array.isArray(actual)
          ? !actual.includes(expected)
          : !String(actual).includes(String(expected));
      case 'exists':
        return actual !== undefined && actual !== null;
      case 'not-exists':
        return actual === undefined || actual === null;
      case 'all':
        return Array.isArray(actual) && actual.every(v => v === expected);
      case 'any':
        return Array.isArray(actual) && actual.some(v => v === expected);
      default:
        return false;
    }
  }

  /**
   * Get available transitions from current phase
   */
  getAvailableTransitions(
    template: WorkflowTemplate,
    instance: WorkflowInstance
  ): TransitionRule[] {
    return template.transitions.filter(
      tr => tr.fromPhase === instance.currentPhaseId
    );
  }

  /**
   * Skip current phase (if allowed)
   */
  async skipPhase(
    template: WorkflowTemplate,
    instance: WorkflowInstance,
    workItem: WorkItem,
    triggeredBy: string,
    reason: string
  ): Promise<Result<WorkflowTransition>> {
    const currentPhaseResult = this.getCurrentPhase(template, instance);
    if (!currentPhaseResult.success) {
      return failure(currentPhaseResult.error);
    }
    
    const currentPhase = currentPhaseResult.data;
    
    if (!currentPhase.canSkip) {
      return failure(new Error('Current phase cannot be skipped'));
    }
    
    // Record phase as skipped
    const phaseEndTime = new Date().toISOString();
    const historyEntry: PhaseHistoryEntry = {
      phaseId: currentPhase.id,
      phaseName: currentPhase.name,
      phase: currentPhase.phase as FeaturePhase | BugPhase,
      startedAt: instance.currentPhaseStartedAt,
      completedAt: phaseEndTime,
      duration: new Date(phaseEndTime).getTime() - new Date(instance.currentPhaseStartedAt).getTime(),
      outcome: 'skipped',
      outcomeReason: reason,
      transitionedBy: triggeredBy,
      transitionType: 'manual',
      notes: reason
    };
    
    instance.phaseHistory.push(historyEntry);
    
    // Transition to next phase
    return this.transitionToNextPhase(template, instance, workItem, triggeredBy, 'manual');
  }
}
