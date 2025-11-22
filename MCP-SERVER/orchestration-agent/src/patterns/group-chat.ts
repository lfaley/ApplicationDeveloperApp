/**
 * Group Chat Orchestration Pattern
 * 
 * Enables multi-agent discussion where agents can build on each other's outputs.
 * All agents participate in rounds of execution, with results shared between rounds.
 * 
 * Use case: When multiple agents need to collaborate and refine results iteratively
 * (e.g., code review → refactor suggestions → test recommendations → final review).
 * 
 * @module patterns/group-chat
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
 * Group Chat Pattern Implementation
 * 
 * Executes agents in rounds, allowing them to see and build on previous results.
 * Continues for multiple rounds or until convergence.
 */
export class GroupChatPattern implements OrchestrationPattern {
  public readonly type = 'group-chat';
  public readonly name = 'Group Chat';
  public readonly description = 'Multi-agent discussion with iterative refinement';

  private readonly maxRounds = 3; // Default maximum rounds
  private readonly minRounds = 1; // Minimum rounds to execute

  /**
   * Execute agents in group chat mode
   * 
   * @param request - Orchestration request
   * @returns Orchestration result
   */
  public async execute(request: OrchestrationRequest): Promise<OrchestrationResult> {
    const startTime = new Date();
    const allResults: AgentResult[] = [];
    const { agents, config = {} } = request;
    const { continueOnError = true } = config; // Default true for discussions

    // Execute multiple rounds
    for (let round = 0; round < this.maxRounds; round++) {
      const roundResults: AgentResult[] = [];

      // Execute all agents in this round
      for (const agentConfig of agents) {
        const result = await this.executeAgent(agentConfig, allResults, round);
        roundResults.push(result);
        allResults.push(result);

        // Stop if critical failure and continueOnError is false
        if (!continueOnError && result.status === 'failed') {
          const endTime = new Date();
          return this.buildResult(request, allResults, startTime, endTime);
        }
      }

      // Check if we should continue to next round
      if (round >= this.minRounds - 1 && this.shouldStopRounds(roundResults)) {
        break;
      }
    }

    const endTime = new Date();

    return this.buildResult(request, allResults, startTime, endTime);
  }

  /**
   * Validate group chat pattern configuration
   * 
   * @param request - Orchestration request
   * @returns Validation result
   */
  public validate(request: OrchestrationRequest): { isValid: boolean; valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate at least two agents for meaningful discussion
    if (request.agents.length < 2) {
      errors.push('At least two agents are required for group chat');
    }

    // Validate each agent exists and has the specified tool
    for (let i = 0; i < request.agents.length; i++) {
      const agent = request.agents[i];
      const validation = registry.validateAgentTool(agent.agentId, agent.toolName);
      
      if (!validation.valid) {
        errors.push(`Agent ${i + 1}: ${validation.error}`);
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
   * Check if we should stop executing rounds
   * 
   * @param roundResults - Results from current round
   * @returns True if should stop
   */
  private shouldStopRounds(roundResults: AgentResult[]): boolean {
    // Stop if all agents completed successfully
    const allCompleted = roundResults.every(r => r.status === 'completed');
    
    // TODO: In future, implement convergence detection
    // For now, always continue for max rounds if agents succeed
    
    return false;
  }

  /**
   * Execute a single agent in the group chat
   * 
   * @param agentConfig - Agent configuration
   * @param previousResults - All previous results from all rounds
   * @param round - Current round number
   * @returns Agent result
   */
  private async executeAgent(
    agentConfig: AgentConfig,
    previousResults: AgentResult[],
    round: number
  ): Promise<AgentResult> {
    const startTime = new Date();
    const timeout = agentConfig.timeout || 30000;

    try {
      // Pass all previous results as discussion context
      const context = this.buildDiscussionContext(previousResults, round);
      const output = await this.simulateAgentExecution(
        agentConfig,
        context,
        timeout
      );

      const endTime = new Date();

      return {
        agentId: agentConfig.agentId,
        status: 'completed',
        output: {
          ...(typeof output === 'object' && output !== null ? output : {}),
          round: round + 1,
          discussionContext: context.summary,
        },
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
   * Build discussion context from previous results
   * 
   * @param previousResults - All previous agent results
   * @param currentRound - Current round number
   * @returns Discussion context
   */
  private buildDiscussionContext(
    previousResults: AgentResult[],
    currentRound: number
  ): {
    totalRounds: number;
    currentRound: number;
    previousOutputs: unknown[];
    summary: string;
  } {
    const previousOutputs = previousResults
      .filter(r => r.status === 'completed')
      .map(r => r.output);

    return {
      totalRounds: this.maxRounds,
      currentRound: currentRound + 1,
      previousOutputs,
      summary: `Round ${currentRound + 1}/${this.maxRounds} - ${previousResults.length} previous results available`,
    };
  }

  /**
   * Simulate agent execution (placeholder)
   * 
   * @param agentConfig - Agent configuration
   * @param context - Discussion context
   * @param timeout - Execution timeout
   * @returns Simulated output
   */
  private async simulateAgentExecution(
    agentConfig: AgentConfig,
    context: { currentRound: number; previousOutputs: unknown[] },
    _timeout: number
  ): Promise<unknown> {
    // Check for shouldFail simulation flag
    if (agentConfig.args && typeof agentConfig.args === 'object' && 
        'shouldFail' in agentConfig.args && agentConfig.args.shouldFail === true) {
      throw new Error('Agent configured to fail');
    }

    // Simulate async execution
    await new Promise(resolve => setTimeout(resolve, 150));

    return {
      agent: agentConfig.agentId,
      tool: agentConfig.toolName,
      result: `Group chat contribution from ${agentConfig.agentId}`,
      round: context.currentRound,
      consideredPreviousOutputs: context.previousOutputs.length,
    };
  }

  /**
   * Build final orchestration result
   * 
   * @param request - Original request
   * @param agentResults - Results from all agents across all rounds
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

    // For group chat, aggregate final round results
    const uniqueAgents = Array.from(new Set(agentResults.map(r => r.agentId)));
    const finalRoundResults = uniqueAgents.map(agentId => {
      // Get last result for each agent
      const agentResultsList = agentResults.filter(r => r.agentId === agentId);
      return agentResultsList[agentResultsList.length - 1];
    });

    const aggregatedOutput = {
      results: agentResults,
      finalRoundOutputs: finalRoundResults
        .filter(r => r.status === 'completed')
        .map(r => r.output),
    };

    const summary = `Group chat orchestration completed: ${successCount} succeeded, ${failureCount} failed, ${skippedCount} skipped (${totalDuration}ms)`;

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
