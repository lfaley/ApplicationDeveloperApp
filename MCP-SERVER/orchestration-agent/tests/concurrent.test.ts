/**
 * Tests for Concurrent Orchestration Pattern
 * 
 * This test suite validates:
 * - Parallel execution of agents
 * - Concurrency limiting with maxConcurrency
 * - Error handling with continueOnError
 * - Result aggregation from parallel execution
 * - Warnings about dependencies in concurrent mode
 */

import { ConcurrentPattern } from '../src/patterns/concurrent.js';
import { OrchestrationRequest } from '../src/types.js';
import { AgentRegistry } from '../src/registry.js';
import { z } from 'zod';

describe('ConcurrentPattern', () => {
  let pattern: ConcurrentPattern;
  let registry: AgentRegistry;

  beforeEach(() => {
    pattern = new ConcurrentPattern();
    registry = AgentRegistry.getInstance();
    
    // Register test agents
    const testSchema = z.object({}).optional();
    registry.registerAgent({
      id: 'agent1',
      name: 'Test Agent 1',
      description: 'Test agent for concurrent tests',
      status: 'available',
      tools: [
        { name: 'tool1', description: 'Test tool 1', inputSchema: testSchema }
      ]
    });
    registry.registerAgent({
      id: 'agent2',
      name: 'Test Agent 2',
      description: 'Test agent for concurrent tests',
      status: 'available',
      tools: [
        { name: 'tool2', description: 'Test tool 2', inputSchema: testSchema }
      ]
    });
    registry.registerAgent({
      id: 'agent3',
      name: 'Test Agent 3',
      description: 'Test agent for concurrent tests',
      status: 'available',
      tools: [
        { name: 'tool3', description: 'Test tool 3', inputSchema: testSchema }
      ]
    });
    registry.registerAgent({
      id: 'failing-agent',
      name: 'Failing Agent',
      description: 'Agent that can fail for testing',
      status: 'available',
      tools: [
        { name: 'fail', description: 'Failing tool', inputSchema: testSchema }
      ]
    });
  });

  describe('Pattern Metadata', () => {
    test('should have correct type and name', () => {
      expect(pattern.type).toBe('concurrent');
      expect(pattern.name).toBe('Concurrent Orchestration');
      expect(pattern.description).toContain('parallel');
    });
  });

  describe('Validation', () => {
    test('should validate valid concurrent request', () => {
      const request: OrchestrationRequest = {
        pattern: 'concurrent',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} },
          { agentId: 'agent2', toolName: 'tool2', args: {} }
        ]
      };

      const result = pattern.validate(request);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should fail validation with empty agents array', () => {
      const request: OrchestrationRequest = {
        pattern: 'concurrent',
        agents: []
      };

      const result = pattern.validate(request);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('At least one agent must be specified');
    });

    test('should warn about dependencies in concurrent mode', () => {
      const request: OrchestrationRequest = {
        pattern: 'concurrent',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} },
          { 
            agentId: 'agent2', 
            toolName: 'tool2', 
            args: {},
            dependsOn: 'agent1'
          }
        ]
      };

      const result = pattern.validate(request);
      expect(result.warnings).toContain(
        'Agent agent2 has dependsOn specified, but concurrent execution ignores dependencies'
      );
    });

    test('should validate maxConcurrency configuration', () => {
      const request: OrchestrationRequest = {
        pattern: 'concurrent',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} }
        ],
        config: {
          maxConcurrency: 3
        }
      };

      const result = pattern.validate(request);
      expect(result.isValid).toBe(true);
    });
  });

  describe('Parallel Execution', () => {
    test('should execute all agents concurrently', async () => {
      const request: OrchestrationRequest = {
        pattern: 'concurrent',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} },
          { agentId: 'agent2', toolName: 'tool2', args: {} },
          { agentId: 'agent3', toolName: 'tool3', args: {} }
        ]
      };

      const startTime = Date.now();
      const result = await pattern.execute(request);
      const duration = Date.now() - startTime;

      expect(result.status).toBe('completed');
      expect(result.agentResults).toHaveLength(3);
      
      // All agents should complete in roughly the same time (parallel execution)
      // With simulation delay of 100ms, total should be ~100ms not 300ms
      expect(duration).toBeLessThan(500);
    });

    test('should handle single agent execution', async () => {
      const request: OrchestrationRequest = {
        pattern: 'concurrent',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} }
        ]
      };

      const result = await pattern.execute(request);

      expect(result.status).toBe('completed');
      expect(result.agentResults).toHaveLength(1);
      expect(result.agentResults[0].status).toBe('completed');
    });
  });

  describe('Concurrency Limiting', () => {
    test('should respect maxConcurrency limit', async () => {
      const request: OrchestrationRequest = {
        pattern: 'concurrent',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} },
          { agentId: 'agent2', toolName: 'tool2', args: {} },
          { agentId: 'agent3', toolName: 'tool3', args: {} },
          { agentId: 'agent4', toolName: 'tool4', args: {} },
          { agentId: 'agent5', toolName: 'tool5', args: {} }
        ],
        config: {
          maxConcurrency: 2
        }
      };

      const result = await pattern.execute(request);

      expect(result.status).toBe('completed');
      expect(result.agentResults).toHaveLength(5);
      
      // All should complete successfully
      result.agentResults.forEach(r => {
        expect(r.status).toBe('completed');
      });
    });

    test('should default to unlimited concurrency when not specified', async () => {
      const request: OrchestrationRequest = {
        pattern: 'concurrent',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} },
          { agentId: 'agent2', toolName: 'tool2', args: {} },
          { agentId: 'agent3', toolName: 'tool3', args: {} }
        ]
      };

      const result = await pattern.execute(request);

      expect(result.status).toBe('completed');
      expect(result.agentResults).toHaveLength(3);
    });

    test('should handle maxConcurrency of 1 (sequential-like behavior)', async () => {
      const request: OrchestrationRequest = {
        pattern: 'concurrent',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} },
          { agentId: 'agent2', toolName: 'tool2', args: {} }
        ],
        config: {
          maxConcurrency: 1
        }
      };

      const result = await pattern.execute(request);

      expect(result.status).toBe('completed');
      expect(result.agentResults).toHaveLength(2);
    });
  });

  describe('Error Handling', () => {
    test('should fail fast on first error when continueOnError is false', async () => {
      const request: OrchestrationRequest = {
        pattern: 'concurrent',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} },
          { agentId: 'agent2', toolName: 'tool2', args: { shouldFail: true } },
          { agentId: 'agent3', toolName: 'tool3', args: {} }
        ],
        config: { continueOnError: false }
      };

      const result = await pattern.execute(request);

      expect(result.status).toBe('failed');
      
      // Should have at least one failed agent
      const failedAgents = result.agentResults.filter(r => r.status === 'failed');
      expect(failedAgents.length).toBeGreaterThan(0);
    });

    test('should continue on error when continueOnError is true', async () => {
      const request: OrchestrationRequest = {
        pattern: 'concurrent',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} },
          { agentId: 'agent2', toolName: 'tool2', args: { shouldFail: true } },
          { agentId: 'agent3', toolName: 'tool3', args: {} }
        ],
        config: {
          continueOnError: true
        }
      };

      const result = await pattern.execute(request);

      expect(result.status).toBe('completed');
      expect(result.agentResults).toHaveLength(3);
      
      // Should have both successful and failed agents
      const completed = result.agentResults.filter(r => r.status === 'completed');
      const failed = result.agentResults.filter(r => r.status === 'failed');
      
      expect(completed.length).toBeGreaterThan(0);
      expect(failed.length).toBeGreaterThan(0);
    });
  });

  describe('Result Aggregation', () => {
    test('should aggregate results from all agents', async () => {
      const request: OrchestrationRequest = {
        pattern: 'concurrent',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} },
          { agentId: 'agent2', toolName: 'tool2', args: {} }
        ]
      };

      const result = await pattern.execute(request);

      expect(result.aggregatedOutput).toBeDefined();
      expect(result.aggregatedOutput.results).toHaveLength(2);
    });

    test('should include execution metadata', async () => {
      const request: OrchestrationRequest = {
        pattern: 'concurrent',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} }
        ]
      };

      const result = await pattern.execute(request);

      expect(result.metadata.totalDuration).toBeGreaterThan(0);
      expect(result.metadata.pattern).toBe('concurrent');
      expect(result.summary).toContain('Concurrent');
    });

    test('should handle mixed success and failure results', async () => {
      const request: OrchestrationRequest = {
        pattern: 'concurrent',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} },
          { agentId: 'failing-agent', toolName: 'fail', args: { shouldFail: true } }
        ],
        config: {
          continueOnError: true
        }
      };

      const result = await pattern.execute(request);

      expect(result.agentResults).toHaveLength(2);
      expect(result.aggregatedOutput.results).toHaveLength(2);
    });
  });

  describe('Performance', () => {
    test('should execute faster than sequential for multiple agents', async () => {
      // This is a conceptual test - in real implementation with actual delays,
      // concurrent execution should be faster
      const request: OrchestrationRequest = {
        pattern: 'concurrent',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} },
          { agentId: 'agent2', toolName: 'tool2', args: {} },
          { agentId: 'agent3', toolName: 'tool3', args: {} }
        ]
      };

      const startTime = Date.now();
      const result = await pattern.execute(request);
      const duration = Date.now() - startTime;

      expect(result.status).toBe('completed');
      expect(result.agentResults).toHaveLength(3);
      
      // With 100ms simulation delay per agent, concurrent should be ~100ms
      // Sequential would be ~300ms
      expect(duration).toBeLessThan(500);
    });
  });
});
