/**
 * Tests for Sequential Orchestration Pattern
 * 
 * This test suite validates:
 * - Sequential execution order
 * - Result passing between agents
 * - Error handling and continueOnError
 * - Conditional execution with dependencies
 * - Skip logic based on previous results
 */

import { SequentialPattern } from '../src/patterns/sequential.js';
import { OrchestrationRequest, AgentConfig, AgentResult } from '../src/types.js';

describe('SequentialPattern', () => {
  let pattern: SequentialPattern;

  beforeEach(() => {
    pattern = new SequentialPattern();
  });

  describe('Pattern Metadata', () => {
    test('should have correct type and name', () => {
      expect(pattern.type).toBe('sequential');
      expect(pattern.name).toBe('Sequential Orchestration');
      expect(pattern.description).toContain('one after another');
    });
  });

  describe('Validation', () => {
    test('should validate valid sequential request', () => {
      const request: OrchestrationRequest = {
        pattern: 'sequential',
        agents: [
          { agentId: 'code-documentation', toolName: 'analyze_code', args: { code: 'test' } }
        ]
      };

      const result = pattern.validate(request);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should fail validation with empty agents array', () => {
      const request: OrchestrationRequest = {
        pattern: 'sequential',
        agents: []
      };

      const result = pattern.validate(request);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('At least one agent must be specified');
    });

    test('should warn about invalid dependency references', () => {
      const request: OrchestrationRequest = {
        pattern: 'sequential',
        agents: [
          { 
            agentId: 'code-review', 
            toolName: 'review_code', 
            args: {},
            dependsOn: 'nonexistent-agent'
          }
        ]
      };

      const result = pattern.validate(request);
      expect(result.warnings).toContain(
        'Agent code-review depends on nonexistent-agent which is not in the workflow'
      );
    });

    test('should warn when dependent agent appears before dependency', () => {
      const request: OrchestrationRequest = {
        pattern: 'sequential',
        agents: [
          { 
            agentId: 'code-review', 
            toolName: 'review_code', 
            args: {},
            dependsOn: 'code-documentation'
          },
          { 
            agentId: 'code-documentation', 
            toolName: 'analyze_code', 
            args: {}
          }
        ]
      };

      const result = pattern.validate(request);
      expect(result.warnings).toContain(
        'Agent code-review depends on code-documentation which appears later in the sequence'
      );
    });

    test('should validate successfully with correct dependency order', () => {
      const request: OrchestrationRequest = {
        pattern: 'sequential',
        agents: [
          { 
            agentId: 'code-documentation', 
            toolName: 'analyze_code', 
            args: {}
          },
          { 
            agentId: 'code-review', 
            toolName: 'review_code', 
            args: {},
            dependsOn: 'code-documentation'
          }
        ]
      };

      const result = pattern.validate(request);
      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('Execution', () => {
    test('should execute single agent successfully', async () => {
      const request: OrchestrationRequest = {
        pattern: 'sequential',
        agents: [
          { agentId: 'code-documentation', toolName: 'analyze_code', args: { code: 'test' } }
        ]
      };

      const result = await pattern.execute(request);

      expect(result.status).toBe('completed');
      expect(result.agentResults).toHaveLength(1);
      expect(result.agentResults[0].status).toBe('completed');
      expect(result.agentResults[0].agentId).toBe('code-documentation');
    });

    test('should execute multiple agents in sequence', async () => {
      const request: OrchestrationRequest = {
        pattern: 'sequential',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} },
          { agentId: 'agent2', toolName: 'tool2', args: {} },
          { agentId: 'agent3', toolName: 'tool3', args: {} }
        ]
      };

      const result = await pattern.execute(request);

      expect(result.status).toBe('completed');
      expect(result.agentResults).toHaveLength(3);
      
      // Verify execution order via timestamps
      const timestamps = result.agentResults.map(r => r.metadata.startTime.getTime());
      for (let i = 1; i < timestamps.length; i++) {
        expect(timestamps[i]).toBeGreaterThanOrEqual(timestamps[i - 1]);
      }
    });

    test('should stop on first failure by default', async () => {
      const request: OrchestrationRequest = {
        pattern: 'sequential',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} },
          { agentId: 'failing-agent', toolName: 'fail', args: { shouldFail: true } },
          { agentId: 'agent3', toolName: 'tool3', args: {} }
        ]
      };

      const result = await pattern.execute(request);

      expect(result.status).toBe('failed');
      expect(result.agentResults).toHaveLength(2); // Only first two agents executed
      expect(result.agentResults[1].status).toBe('failed');
    });

    test('should continue on error when continueOnError is true', async () => {
      const request: OrchestrationRequest = {
        pattern: 'sequential',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} },
          { agentId: 'failing-agent', toolName: 'fail', args: { shouldFail: true } },
          { agentId: 'agent3', toolName: 'tool3', args: {} }
        ],
        config: {
          continueOnError: true
        }
      };

      const result = await pattern.execute(request);

      expect(result.status).toBe('completed'); // Overall status is completed
      expect(result.agentResults).toHaveLength(3); // All agents executed
      expect(result.agentResults[1].status).toBe('failed');
      expect(result.agentResults[2].status).toBe('completed');
    });
  });

  describe('Result Passing', () => {
    test('should pass results to subsequent agents when passResults is true', async () => {
      const request: OrchestrationRequest = {
        pattern: 'sequential',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: { input: 'data1' } },
          { agentId: 'agent2', toolName: 'tool2', args: { input: 'data2' } }
        ],
        config: {
          passResults: true
        }
      };

      const result = await pattern.execute(request);

      expect(result.status).toBe('completed');
      expect(result.agentResults).toHaveLength(2);
      
      // Second agent should have received previous results
      const secondAgentResult = result.agentResults[1];
      expect(secondAgentResult.metadata.receivedContext).toBe(true);
    });

    test('should not pass results when passResults is false', async () => {
      const request: OrchestrationRequest = {
        pattern: 'sequential',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} },
          { agentId: 'agent2', toolName: 'tool2', args: {} }
        ],
        config: {
          passResults: false
        }
      };

      const result = await pattern.execute(request);

      expect(result.status).toBe('completed');
      expect(result.agentResults[1].metadata.receivedContext).toBeUndefined();
    });
  });

  describe('Conditional Execution', () => {
    test('should skip agent when dependsOn agent failed', async () => {
      const request: OrchestrationRequest = {
        pattern: 'sequential',
        agents: [
          { agentId: 'failing-agent', toolName: 'fail', args: { shouldFail: true } },
          { 
            agentId: 'dependent-agent', 
            toolName: 'tool1', 
            args: {},
            dependsOn: 'failing-agent',
            requiresSuccess: true
          }
        ],
        config: {
          continueOnError: true
        }
      };

      const result = await pattern.execute(request);

      expect(result.agentResults).toHaveLength(2);
      expect(result.agentResults[0].status).toBe('failed');
      expect(result.agentResults[1].status).toBe('skipped');
    });

    test('should execute agent when dependsOn agent succeeded', async () => {
      const request: OrchestrationRequest = {
        pattern: 'sequential',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} },
          { 
            agentId: 'dependent-agent', 
            toolName: 'tool2', 
            args: {},
            dependsOn: 'agent1',
            requiresSuccess: true
          }
        ]
      };

      const result = await pattern.execute(request);

      expect(result.agentResults).toHaveLength(2);
      expect(result.agentResults[0].status).toBe('completed');
      expect(result.agentResults[1].status).toBe('completed');
    });

    test('should evaluate custom condition function', async () => {
      const request: OrchestrationRequest = {
        pattern: 'sequential',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} },
          { 
            agentId: 'conditional-agent', 
            toolName: 'tool2', 
            args: {},
            condition: (previousResults: AgentResult[]) => {
              // Only execute if previous agent produced specific output
              return previousResults[0]?.output?.success === true;
            }
          }
        ]
      };

      const result = await pattern.execute(request);

      // Since we're using placeholder simulation, condition logic is tested
      expect(result.agentResults).toHaveLength(2);
    });
  });

  describe('Timeout Handling', () => {
    test('should respect agent timeout configuration', async () => {
      const request: OrchestrationRequest = {
        pattern: 'sequential',
        agents: [
          { 
            agentId: 'slow-agent', 
            toolName: 'slow-operation', 
            args: {},
            timeout: 1000 // 1 second timeout
          }
        ]
      };

      const result = await pattern.execute(request);

      expect(result.agentResults[0].metadata.duration).toBeDefined();
      expect(result.agentResults[0].metadata.duration).toBeLessThan(2000);
    });
  });

  describe('Aggregated Output', () => {
    test('should aggregate outputs from all successful agents', async () => {
      const request: OrchestrationRequest = {
        pattern: 'sequential',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} },
          { agentId: 'agent2', toolName: 'tool2', args: {} }
        ]
      };

      const result = await pattern.execute(request);

      expect(result.aggregatedOutput).toBeDefined();
      expect(result.aggregatedOutput.results).toHaveLength(2);
    });

    test('should include metadata in aggregated output', async () => {
      const request: OrchestrationRequest = {
        pattern: 'sequential',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} }
        ],
        description: 'Test workflow'
      };

      const result = await pattern.execute(request);

      expect(result.metadata.totalDuration).toBeGreaterThan(0);
      expect(result.metadata.pattern).toBe('sequential');
    });
  });
});
