/**
 * Sequential Orchestration Pattern
 * 
 * Executes agents one after another in sequence. Each agent waits for the
 * previous agent to complete before starting. Results can be passed between
 * agents if configured.
 * 
 * Use case: When agents have dependencies or need to build on previous results
 * (e.g., analyze code → review code → generate tests).
 * 
 * @module patterns/sequential
 */

import {
  OrchestrationPattern,
  OrchestrationRequest,
  OrchestrationResult,
  AgentConfig,
  AgentResult,
  AgentStatus,
} from '../types.js';
import { registry } from '../registry.js';

/**
 * Sequential Pattern Implementation
 * 
 * Executes agents in order, waiting for each to complete before starting the next.
 * Supports conditional execution and result passing between agents.
 */
export class SequentialPattern implements OrchestrationPattern {
  public readonly type = 'sequential';
  public readonly name = 'Sequential Orchestration';
  public readonly description = 'Execute agents one after another in sequence';

  /**
   * Execute agents sequentially
   * 
   * @param request - Orchestration request
   * @returns Orchestration result
   */
  public async execute(request: OrchestrationRequest): Promise<OrchestrationResult> {
    const startTime = new Date();
    const agentResults: AgentResult[] = [];
    const { agents, config = {} } = request;
    const { continueOnError = false, passResults = false } = config;

    let previousResult: unknown = undefined;
    let hasFailure = false;

    for (const agentConfig of agents) {
      // Check if we should skip this agent
      if (this.shouldSkip(agentConfig, agentResults, hasFailure, continueOnError)) {
        agentResults.push(this.createSkippedResult(agentConfig));
        continue;
      }

      // Prepare arguments with previous result if passResults enabled
      const receivedContext = passResults && previousResult !== undefined;
      const args = receivedContext
        ? { ...agentConfig.args, previousResult }
        : agentConfig.args;

      // Execute agent
      const result = await this.executeAgent({
        ...agentConfig,
        args,
      }, receivedContext);

      agentResults.push(result);

      // Track failure state
      if (result.status === 'failed') {
        hasFailure = true;
        if (!continueOnError) {
          break; // Stop execution on first failure
        }
      }

      // Save result for next agent
      if (result.status === 'completed') {
        previousResult = result.output;
      }
    }

    const endTime = new Date();

    return this.buildResult(
      request,
      agentResults,
      startTime,
      endTime,
      continueOnError
    );
  }

  /**
   * Validate sequential pattern configuration
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

    // Validate dependencies
    for (let i = 0; i < request.agents.length; i++) {
      const agent = request.agents[i];
      
      if (agent.dependsOn) {
        const dependencyIndex = request.agents.findIndex(
          a => a.agentId === agent.dependsOn
        );
        
        if (dependencyIndex === -1) {
          warnings.push(
            `Agent ${agent.agentId} depends on ${agent.dependsOn} which is not in the workflow`
          );
        } else if (dependencyIndex >= i) {
          warnings.push(
            `Agent ${agent.agentId} depends on ${agent.dependsOn} which appears later in the sequence`
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
   * @param hasFailure - Whether any previous agent failed
   * @param continueOnError - Whether to continue on error
   * @returns True if agent should be skipped
   */
  private shouldSkip(
    agentConfig: AgentConfig,
    previousResults: AgentResult[],
    hasFailure: boolean,
    continueOnError: boolean
  ): boolean {
    // Skip if previous agent failed and continueOnError is false
    if (hasFailure && !continueOnError) {
      return true;
    }

    // Check dependency conditions
    if (agentConfig.dependsOn) {
      const dependency = previousResults.find(
        r => r.agentId === agentConfig.dependsOn
      );

      if (!dependency) {
        return true; // Dependency not executed yet
      }

      if (agentConfig.requiresSuccess && dependency.status !== 'completed') {
        return true; // Dependency must succeed but didn't
      }
    }
    
    // Check custom condition function
    if (agentConfig.condition && typeof agentConfig.condition === 'function') {
      return !agentConfig.condition(previousResults);
    }

    return false;
  }

  /**
   * Execute a single agent
   * 
   * @param agentConfig - Agent configuration
   * @param receivedContext - Whether this agent received context from previous result
   * @returns Agent result
   */
  private async executeAgent(agentConfig: AgentConfig, receivedContext: boolean = false): Promise<AgentResult> {
    const startTime = new Date();
    const timeout = agentConfig.timeout || 30000;

    try {
      // TODO: Actual agent execution will be implemented in Task 1.3
      // For now, simulate execution
      const output = await this.simulateAgentExecution(agentConfig, timeout);

      const endTime = new Date();

      const metadata: AgentResult['metadata'] = {
        startTime,
        endTime,
        duration: endTime.getTime() - startTime.getTime(),
        retries: 0,
      };
      
      // Only add receivedContext if it's true
      if (receivedContext) {
        metadata.receivedContext = true;
      }

      return {
        agentId: agentConfig.agentId,
        status: 'completed',
        output: typeof output === 'object' && output !== null ? output as { success?: boolean; [key: string]: unknown } : { result: output },
        metadata,
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
   * @param timeout - Execution timeout
   * @returns Simulated output
   */
  private async simulateAgentExecution(
    agentConfig: AgentConfig,
    timeout: number
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
      result: 'Simulated execution result',
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
   * @param continueOnError - Whether errors were continued
   * @returns Orchestration result
   */
  private buildResult(
    request: OrchestrationRequest,
    agentResults: AgentResult[],
    startTime: Date,
    endTime: Date,
    continueOnError: boolean
  ): OrchestrationResult {
    const successCount = agentResults.filter(r => r.status === 'completed').length;
    const failureCount = agentResults.filter(r => r.status === 'failed').length;
    const skippedCount = agentResults.filter(r => r.status === 'skipped').length;
    const totalDuration = endTime.getTime() - startTime.getTime();

    // Determine status based on results and continueOnError setting
    const allAgentsExecuted = agentResults.length === request.agents.length;
    let status: 'completed' | 'partial' | 'failed';
    
    if (failureCount === 0) {
      status = 'completed';
    } else if (continueOnError) {
      // With continueOnError, all agents ran - consider it completed
      status = 'completed';
    } else if (allAgentsExecuted && successCount > 0) {
      // All agents ran (shouldn't happen without continueOnError), but partial success
      status = 'partial';
    } else {
      // Stopped early due to failure
      status = 'failed';
    }

    const aggregatedOutput = {
      results: agentResults,
      outputs: agentResults
        .filter(r => r.status === 'completed')
        .map(r => r.output),
    };

    const summary = `Sequential orchestration completed: ${successCount} succeeded, ${failureCount} failed, ${skippedCount} skipped (${totalDuration}ms)`;

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
