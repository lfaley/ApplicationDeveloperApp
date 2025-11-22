/**
 * Handoff Orchestration Pattern
 * 
 * Passes control from one agent to another based on results or conditions.
 * Each agent can decide which agent should execute next, enabling dynamic workflows.
 * 
 * Use case: When workflow path depends on results (e.g., if code review finds
 * security issues, hand off to security agent; otherwise continue to tests).
 * 
 * @module patterns/handoff
 */

import {
  OrchestrationPattern,
  OrchestrationRequest,
  OrchestrationResult,
  AgentConfig,
  AgentResult,
} from '../types.js';
import { registry } from '../registry.js';

/**
 * Handoff Pattern Implementation
 * 
 * Executes agents based on conditional handoffs, where each agent's result
 * determines which agent executes next.
 */
export class HandoffPattern implements OrchestrationPattern {
  public readonly type = 'handoff';
  public readonly name = 'Handoff Orchestration';
  public readonly description = 'dynamic workflow with conditional agent handoffs';

  /**
   * Execute agents with handoff logic
   * 
   * @param request - Orchestration request
   * @returns Orchestration result
   */
  public async execute(request: OrchestrationRequest): Promise<OrchestrationResult> {
    const startTime = new Date();
    const agentResults: AgentResult[] = [];
    const { agents, config = {} } = request;
    const { continueOnError = false } = config;

    // Start with first agent
    let currentIndex = 0;
    const maxIterations = agents.length * 2; // Prevent infinite loops
    let iterations = 0;

    while (currentIndex < agents.length && iterations < maxIterations) {
      iterations++;
      const agentConfig = agents[currentIndex];

      // Check if agent should be skipped based on conditions
      if (this.shouldSkip(agentConfig, agentResults)) {
        agentResults.push(this.createSkippedResult(agentConfig));
        currentIndex++;
        continue;
      }

      // Execute current agent
      const result = await this.executeAgent(agentConfig, agentResults);
      agentResults.push(result);

      // Handle failures
      if (result.status === 'failed' && !continueOnError) {
        break;
      }

      // Determine next agent based on result
      const nextIndex = this.determineNextAgent(
        result,
        agents,
        currentIndex
      );

      if (nextIndex === -1) {
        break; // No more agents to execute
      }

      currentIndex = nextIndex;
    }

    const endTime = new Date();

    return this.buildResult(request, agentResults, startTime, endTime);
  }

  /**
   * Validate handoff pattern configuration
   * 
   * @param request - Orchestration request
   * @returns Validation result
   */
  public validate(request: OrchestrationRequest): { isValid: boolean; valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate at least one agent
    if (request.agents.length === 0) {
      errors.push('At least one agent must be specified');
    }

    // Validate each agent exists and has the specified tool
    for (let i = 0; i < request.agents.length; i++) {
      const agent = request.agents[i];
      const validation = registry.validateAgentTool(agent.agentId, agent.toolName);
      
      if (!validation.valid) {
        errors.push(`Agent ${i + 1}: ${validation.error}`);
      }
    }

    // Validate handoff targets exist
    for (let i = 0; i < request.agents.length; i++) {
      const agent = request.agents[i];
      
      if (agent.handoffTo) {
        const exists = request.agents.some(
          a => a.agentId === agent.handoffTo
        );
        
        if (!exists) {
          warnings.push(
            `Agent ${agent.agentId} has handoffTo target ${agent.handoffTo} which is not in the workflow`
          );
        }
      }
    }

    return {
      isValid: errors.length === 0,
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Check if agent should be skipped
   * 
   * @param agentConfig - Agent configuration
   * @param previousResults - Results from previous agents
   * @returns True if agent should be skipped
   */
  private shouldSkip(
    agentConfig: AgentConfig,
    previousResults: AgentResult[]
  ): boolean {
    // Check dependency conditions
    if (agentConfig.dependsOn) {
      const dependency = previousResults.find(
        r => r.agentId === agentConfig.dependsOn
      );

      if (!dependency) {
        return false; // Not skipped, will be executed
      }

      if (agentConfig.requiresSuccess && dependency.status !== 'completed') {
        return true; // Skip because dependency didn't succeed
      }
    }
    
    // Check custom condition function
    if (agentConfig.condition && typeof agentConfig.condition === 'function') {
      return !agentConfig.condition(previousResults);
    }

    return false;
  }

  /**
   * Determine which agent should execute next
   * 
   * @param currentResult - Result from current agent
   * @param agents - All agent configurations
   * @param currentIndex - Current agent index
   * @returns Next agent index or -1 if done
   */
  private determineNextAgent(
    currentResult: AgentResult,
    agents: AgentConfig[],
    currentIndex: number
  ): number {
    // If current agent failed, stop workflow
    if (currentResult.status === 'failed') {
      return -1;
    }

    // Default: proceed to next agent in sequence
    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= agents.length) {
      return -1; // No more agents
    }

    // TODO: In future, analyze output to determine dynamic handoffs
    // For now, simple sequential execution with conditions

    return nextIndex;
  }

  /**
   * Execute a single agent
   * 
   * @param agentConfig - Agent configuration
   * @param previousResults - Results from previous agents
   * @returns Agent result
   */
  private async executeAgent(
    agentConfig: AgentConfig,
    previousResults: AgentResult[]
  ): Promise<AgentResult> {
    const startTime = new Date();
    const timeout = agentConfig.timeout || 30000;

    try {
      // Pass previous results as context
      const output = await this.simulateAgentExecution(
        agentConfig,
        previousResults,
        timeout
      );

      const endTime = new Date();

      return {
        agentId: agentConfig.agentId,
        status: 'completed',
        output: typeof output === 'object' && output !== null ? output as { success?: boolean; [key: string]: unknown } : { result: output },
        metadata: {
          startTime,
          endTime,
          duration: endTime.getTime() - startTime.getTime(),
          retries: 0,
        },
      };
    } catch (error) {
      const endTime = new Date();

      return {
        agentId: agentConfig.agentId,
        status: 'failed',
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          code: 'EXECUTION_ERROR',
          stack: error instanceof Error ? error.stack : undefined,
        },
        metadata: {
          startTime,
          endTime,
          duration: endTime.getTime() - startTime.getTime(),
          retries: 0,
        },
      };
    }
  }

  /**
   * Simulate agent execution (placeholder)
   * 
   * @param agentConfig - Agent configuration
   * @param previousResults - Previous results for context
   * @param timeout - Execution timeout
   * @returns Simulated output
   */
  private async simulateAgentExecution(
    agentConfig: AgentConfig,
    _previousResults: AgentResult[],
    _timeout: number
  ): Promise<unknown> {
    // Simulate async execution
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check if agent should fail (for testing)
    if (agentConfig.args && typeof agentConfig.args === 'object' && 'shouldFail' in agentConfig.args && agentConfig.args.shouldFail === true) {
      throw new Error('Agent configured to fail');
    }

    return {
      agent: agentConfig.agentId,
      tool: agentConfig.toolName,
      result: 'Handoff execution result',
    };
  }

  /**
   * Create skipped result
   * 
   * @param agentConfig - Agent configuration
   * @returns Agent result with skipped status
   */
  private createSkippedResult(agentConfig: AgentConfig): AgentResult {
    const now = new Date();

    return {
      agentId: agentConfig.agentId,
      status: 'skipped',
      metadata: {
        startTime: now,
        endTime: now,
        duration: 0,
        retries: 0,
      },
    };
  }

  /**
   * Build final orchestration result
   * 
   * @param request - Original request
   * @param agentResults - Results from all agents
   * @param startTime - Workflow start time
   * @param endTime - Workflow end time
   * @returns Orchestration result
   */
  private buildResult(
    request: OrchestrationRequest,
    agentResults: AgentResult[],
    startTime: Date,
    endTime: Date
  ): OrchestrationResult {
    const successCount = agentResults.filter(r => r.status === 'completed').length;
    const failureCount = agentResults.filter(r => r.status === 'failed').length;
    const skippedCount = agentResults.filter(r => r.status === 'skipped').length;
    const totalDuration = endTime.getTime() - startTime.getTime();

    const status =
      failureCount === 0 ? 'completed' :
      successCount > 0 ? 'partial' :
      'failed';

    const aggregatedOutput = {
      results: agentResults,
      outputs: agentResults
        .filter(r => r.status === 'completed')
        .map(r => r.output),
    };

    const summary = `Handoff orchestration completed: ${successCount} succeeded, ${failureCount} failed, ${skippedCount} skipped (${totalDuration}ms)`;

    return {
      status,
      agentResults,
      aggregatedOutput,
      summary,
      metadata: {
        pattern: this.type,
        startTime,
        endTime,
        totalDuration,
        description: request.description,
      },
    };
  }
}
