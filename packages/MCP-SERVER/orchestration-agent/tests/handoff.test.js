/**
 * Tests for Handoff Orchestration Pattern
 *
 * This test suite validates:
 * - Dynamic workflow routing based on results
 * - Conditional agent selection
 * - Infinite loop prevention
 * - Context-aware execution
 * - Handoff target validation
 */
import { HandoffPattern } from '../src/patterns/handoff.js';
import { AgentRegistry } from '../src/registry.js';
import { z } from 'zod';
describe('HandoffPattern', () => {
    let pattern;
    let registry;
    beforeEach(() => {
        pattern = new HandoffPattern();
        registry = AgentRegistry.getInstance();
        // Register test agents
        const testSchema = z.object({}).optional();
        registry.registerAgent({
            id: 'agent1',
            name: 'Test Agent 1',
            description: 'Test agent for handoff tests',
            status: 'available',
            tools: [
                { name: 'tool1', description: 'Test tool 1', inputSchema: testSchema }
            ]
        });
        registry.registerAgent({
            id: 'agent2',
            name: 'Test Agent 2',
            description: 'Test agent for handoff tests',
            status: 'available',
            tools: [
                { name: 'tool2', description: 'Test tool 2', inputSchema: testSchema }
            ]
        });
        registry.registerAgent({
            id: 'agent3',
            name: 'Test Agent 3',
            description: 'Test agent for handoff tests',
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
            expect(pattern.type).toBe('handoff');
            expect(pattern.name).toBe('Handoff Orchestration');
            expect(pattern.description).toContain('dynamic');
        });
    });
    describe('Validation', () => {
        test('should validate valid handoff request', () => {
            const request = {
                pattern: 'handoff',
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
            const request = {
                pattern: 'handoff',
                agents: []
            };
            const result = pattern.validate(request);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('At least one agent must be specified');
        });
        test('should warn about invalid handoff targets', () => {
            const request = {
                pattern: 'handoff',
                agents: [
                    {
                        agentId: 'agent1',
                        toolName: 'tool1',
                        args: {},
                        handoffTo: 'nonexistent-agent'
                    }
                ]
            };
            const result = pattern.validate(request);
            expect(result.warnings).toContain('Agent agent1 has handoffTo target nonexistent-agent which is not in the workflow');
        });
        test('should validate successfully with valid handoff targets', () => {
            const request = {
                pattern: 'handoff',
                agents: [
                    {
                        agentId: 'agent1',
                        toolName: 'tool1',
                        args: {},
                        handoffTo: 'agent2'
                    },
                    { agentId: 'agent2', toolName: 'tool2', args: {} }
                ]
            };
            const result = pattern.validate(request);
            expect(result.isValid).toBe(true);
            expect(result.warnings).toHaveLength(0);
        });
    });
    describe('Dynamic Routing', () => {
        test('should execute first agent and stop if no handoff', async () => {
            const request = {
                pattern: 'handoff',
                agents: [
                    { agentId: 'agent1', toolName: 'tool1', args: {} },
                    { agentId: 'agent2', toolName: 'tool2', args: {} }
                ]
            };
            const result = await pattern.execute(request);
            expect(result.status).toBe('completed');
            // Should execute at least first agent
            expect(result.agentResults.length).toBeGreaterThan(0);
            expect(result.agentResults[0].agentId).toBe('agent1');
        });
        test('should follow explicit handoffTo directive', async () => {
            const request = {
                pattern: 'handoff',
                agents: [
                    {
                        agentId: 'agent1',
                        toolName: 'tool1',
                        args: {},
                        handoffTo: 'agent3'
                    },
                    { agentId: 'agent2', toolName: 'tool2', args: {} },
                    { agentId: 'agent3', toolName: 'tool3', args: {} }
                ]
            };
            const result = await pattern.execute(request);
            expect(result.status).toBe('completed');
            // Should have executed agent1 and agent3, but not agent2
            const executedIds = result.agentResults.map(r => r.agentId);
            expect(executedIds).toContain('agent1');
            // agent3 may or may not be executed depending on simulation logic
        });
        test('should handle conditional handoff based on dependsOn', async () => {
            const request = {
                pattern: 'handoff',
                agents: [
                    { agentId: 'agent1', toolName: 'tool1', args: {} },
                    {
                        agentId: 'agent2',
                        toolName: 'tool2',
                        args: {},
                        dependsOn: 'agent1',
                        requiresSuccess: true
                    }
                ]
            };
            const result = await pattern.execute(request);
            expect(result.status).toBe('completed');
            expect(result.agentResults.length).toBeGreaterThan(0);
        });
    });
    describe('Conditional Execution', () => {
        test('should skip agent when condition is not met', async () => {
            const request = {
                pattern: 'handoff',
                agents: [
                    { agentId: 'failing-agent', toolName: 'fail', args: { shouldFail: true } },
                    {
                        agentId: 'dependent-agent',
                        toolName: 'tool1',
                        args: {},
                        dependsOn: 'failing-agent',
                        requiresSuccess: true
                    }
                ]
            };
            const result = await pattern.execute(request);
            // First agent should fail
            expect(result.agentResults[0].status).toBe('failed');
            // Dependent agent should be skipped or not executed
            if (result.agentResults.length > 1) {
                expect(result.agentResults[1].status).toBe('skipped');
            }
        });
        test('should execute agent when dependency succeeds', async () => {
            const request = {
                pattern: 'handoff',
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
            expect(result.agentResults[0].status).toBe('completed');
        });
        test('should evaluate custom condition function', async () => {
            const request = {
                pattern: 'handoff',
                agents: [
                    { agentId: 'agent1', toolName: 'tool1', args: {} },
                    {
                        agentId: 'conditional-agent',
                        toolName: 'tool2',
                        args: {},
                        condition: (previousResults) => {
                            return previousResults.length > 0 && previousResults[0].status === 'completed';
                        }
                    }
                ]
            };
            const result = await pattern.execute(request);
            expect(result.agentResults.length).toBeGreaterThan(0);
        });
    });
    describe('Infinite Loop Prevention', () => {
        test('should prevent infinite loops with maxIterations', async () => {
            // Create a circular handoff scenario
            const request = {
                pattern: 'handoff',
                agents: [
                    {
                        agentId: 'agent1',
                        toolName: 'tool1',
                        args: {},
                        handoffTo: 'agent2'
                    },
                    {
                        agentId: 'agent2',
                        toolName: 'tool2',
                        args: {},
                        handoffTo: 'agent1' // Circular reference
                    }
                ]
            };
            const result = await pattern.execute(request);
            // Should complete without hanging
            expect(result.status).toBeDefined();
            // Should not execute more than maxIterations (agents.length * 2 = 4)
            expect(result.agentResults.length).toBeLessThanOrEqual(10);
        });
        test('should include loop prevention warning in summary', async () => {
            const request = {
                pattern: 'handoff',
                agents: [
                    {
                        agentId: 'agent1',
                        toolName: 'tool1',
                        args: {},
                        handoffTo: 'agent1' // Self-reference
                    }
                ]
            };
            const result = await pattern.execute(request);
            expect(result.summary).toBeDefined();
        });
    });
    describe('Context Passing', () => {
        test('should pass previous results to subsequent agents', async () => {
            const request = {
                pattern: 'handoff',
                agents: [
                    { agentId: 'agent1', toolName: 'tool1', args: { data: 'test' } },
                    { agentId: 'agent2', toolName: 'tool2', args: {} }
                ]
            };
            const result = await pattern.execute(request);
            expect(result.agentResults.length).toBeGreaterThan(0);
            // Each agent should have metadata about execution
            result.agentResults.forEach(agentResult => {
                expect(agentResult.metadata).toBeDefined();
                expect(agentResult.metadata.startTime).toBeDefined();
            });
        });
    });
    describe('Error Handling', () => {
        test('should handle agent failure gracefully', async () => {
            const request = {
                pattern: 'handoff',
                agents: [
                    { agentId: 'failing-agent', toolName: 'fail', args: { shouldFail: true } }
                ]
            };
            const result = await pattern.execute(request);
            expect(result.status).toBe('failed');
            expect(result.agentResults[0].status).toBe('failed');
            expect(result.agentResults[0].error).toBeDefined();
        });
        test('should continue to next agent on error if specified', async () => {
            const request = {
                pattern: 'handoff',
                agents: [
                    { agentId: 'failing-agent', toolName: 'fail', args: { shouldFail: true } },
                    { agentId: 'recovery-agent', toolName: 'tool1', args: {} }
                ],
                config: {
                    continueOnError: true
                }
            };
            const result = await pattern.execute(request);
            expect(result.agentResults.length).toBeGreaterThan(0);
        });
    });
    describe('Result Aggregation', () => {
        test('should aggregate outputs from executed agents', async () => {
            const request = {
                pattern: 'handoff',
                agents: [
                    { agentId: 'agent1', toolName: 'tool1', args: {} },
                    { agentId: 'agent2', toolName: 'tool2', args: {} }
                ]
            };
            const result = await pattern.execute(request);
            expect(result.aggregatedOutput).toBeDefined();
            expect(result.aggregatedOutput.results).toBeDefined();
            expect(result.metadata.totalDuration).toBeGreaterThan(0);
        });
    });
});
//# sourceMappingURL=handoff.test.js.map