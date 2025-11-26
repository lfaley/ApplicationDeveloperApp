/**
 * MCP Tools Tests
 *
 * Tests all 5 orchestration MCP tools:
 * - orchestrateWorkflow
 * - listPatterns
 * - getPatternInfo
 * - listAvailableAgents
 * - validateWorkflow
 */
import { orchestrateWorkflow, listPatterns, getPatternInfo, listAvailableAgents, validateWorkflow, } from '../src/tools.js';
import { registry } from '../src/registry.js';
import { z } from 'zod';
describe('MCP Tools', () => {
    beforeEach(() => {
        // Clear and setup test agents
        registry.agents.clear();
        const testSchema = z.object({}).optional();
        registry.registerAgent({
            id: 'test-agent-1',
            name: 'Test Agent 1',
            description: 'First test agent',
            status: 'available',
            tools: [
                { name: 'tool1', description: 'Tool 1', inputSchema: testSchema },
                { name: 'tool2', description: 'Tool 2', inputSchema: testSchema }
            ]
        });
        registry.registerAgent({
            id: 'test-agent-2',
            name: 'Test Agent 2',
            description: 'Second test agent',
            status: 'available',
            tools: [
                { name: 'tool3', description: 'Tool 3', inputSchema: testSchema }
            ]
        });
    });
    // ===== orchestrateWorkflow Tests =====
    describe('orchestrateWorkflow', () => {
        it('should execute sequential workflow', async () => {
            const request = {
                pattern: 'sequential',
                agents: [
                    { agentId: 'test-agent-1', toolName: 'tool1', args: {} },
                    { agentId: 'test-agent-2', toolName: 'tool3', args: {} }
                ]
            };
            const result = await orchestrateWorkflow(request);
            expect(result.status).toBe('completed');
            expect(result.agentResults.length).toBe(2);
            expect(result.summary).toContain('succeeded');
        });
        it('should execute concurrent workflow', async () => {
            const request = {
                pattern: 'concurrent',
                agents: [
                    { agentId: 'test-agent-1', toolName: 'tool1', args: {} },
                    { agentId: 'test-agent-2', toolName: 'tool3', args: {} }
                ]
            };
            const result = await orchestrateWorkflow(request);
            expect(result.status).toBe('completed');
            expect(result.agentResults.length).toBe(2);
        });
        it('should execute handoff workflow', async () => {
            const request = {
                pattern: 'handoff',
                agents: [
                    { agentId: 'test-agent-1', toolName: 'tool1', args: {} },
                    { agentId: 'test-agent-2', toolName: 'tool3', args: {} }
                ]
            };
            const result = await orchestrateWorkflow(request);
            expect(result.status).toBe('completed');
            expect(result.agentResults.length).toBeGreaterThan(0);
        });
        it('should execute group-chat workflow', async () => {
            const request = {
                pattern: 'group-chat',
                agents: [
                    { agentId: 'test-agent-1', toolName: 'tool1', args: {} },
                    { agentId: 'test-agent-2', toolName: 'tool3', args: {} }
                ]
            };
            const result = await orchestrateWorkflow(request);
            expect(result.status).toBe('completed');
            expect(result.agentResults.length).toBeGreaterThan(2); // Multiple rounds
        });
        it('should throw on invalid pattern', async () => {
            const request = {
                pattern: 'invalid',
                agents: [
                    { agentId: 'test-agent-1', toolName: 'tool1', args: {} }
                ]
            };
            await expect(orchestrateWorkflow(request)).rejects.toThrow('Invalid orchestration request');
        });
        it('should throw on invalid request schema', async () => {
            const request = {
                pattern: 'sequential',
                agents: 'not-an-array', // Invalid
            };
            await expect(orchestrateWorkflow(request)).rejects.toThrow('Invalid orchestration request');
        });
        it('should throw on pattern validation failure', async () => {
            const request = {
                pattern: 'sequential',
                agents: [] // Empty agents array - invalid
            };
            await expect(orchestrateWorkflow(request)).rejects.toThrow('Invalid orchestration request');
        });
        it('should include metadata in result', async () => {
            const request = {
                pattern: 'sequential',
                agents: [
                    { agentId: 'test-agent-1', toolName: 'tool1', args: {} }
                ],
                description: 'Test workflow'
            };
            const result = await orchestrateWorkflow(request);
            expect(result.metadata).toBeDefined();
            expect(result.metadata.pattern).toBe('sequential');
            expect(result.metadata.startTime).toBeInstanceOf(Date);
            expect(result.metadata.endTime).toBeInstanceOf(Date);
            expect(result.metadata.description).toBe('Test workflow');
        });
    });
    // ===== listPatterns Tests =====
    describe('listPatterns', () => {
        it('should return all 4 patterns', () => {
            const patterns = listPatterns();
            expect(patterns).toHaveLength(4);
            expect(patterns.map(p => p.type)).toEqual(expect.arrayContaining(['sequential', 'concurrent', 'handoff', 'group-chat']));
        });
        it('should include pattern names', () => {
            const patterns = listPatterns();
            patterns.forEach(pattern => {
                expect(pattern.name).toBeDefined();
                expect(pattern.name.length).toBeGreaterThan(0);
            });
        });
        it('should include pattern descriptions', () => {
            const patterns = listPatterns();
            patterns.forEach(pattern => {
                expect(pattern.description).toBeDefined();
                expect(pattern.description.length).toBeGreaterThan(0);
            });
        });
        it('should include pattern capabilities', () => {
            const patterns = listPatterns();
            patterns.forEach(pattern => {
                expect(pattern.capabilities).toBeDefined();
                expect(Array.isArray(pattern.capabilities)).toBe(true);
                expect(pattern.capabilities.length).toBeGreaterThan(0);
            });
        });
        it('should have sequential pattern with correct capabilities', () => {
            const patterns = listPatterns();
            const sequential = patterns.find(p => p.type === 'sequential');
            expect(sequential).toBeDefined();
            expect(sequential.capabilities).toContain('Ordered execution');
            expect(sequential.capabilities).toContain('Result passing between agents');
        });
        it('should have concurrent pattern with correct capabilities', () => {
            const patterns = listPatterns();
            const concurrent = patterns.find(p => p.type === 'concurrent');
            expect(concurrent).toBeDefined();
            expect(concurrent.capabilities).toContain('Parallel execution');
            expect(concurrent.capabilities).toContain('Configurable concurrency limit');
        });
    });
    // ===== getPatternInfo Tests =====
    describe('getPatternInfo', () => {
        it('should return info for sequential pattern', () => {
            const info = getPatternInfo('sequential');
            expect(info.type).toBe('sequential');
            expect(info.name).toBe('Sequential Orchestration');
            expect(info.description).toBeDefined();
            expect(info.useCases).toBeDefined();
            expect(info.example).toBeDefined();
            expect(info.bestPractices).toBeDefined();
        });
        it('should return info for concurrent pattern', () => {
            const info = getPatternInfo('concurrent');
            expect(info.type).toBe('concurrent');
            expect(info.name).toBe('Concurrent Orchestration');
            expect(info.useCases.length).toBeGreaterThan(0);
            expect(info.bestPractices.length).toBeGreaterThan(0);
        });
        it('should return info for handoff pattern', () => {
            const info = getPatternInfo('handoff');
            expect(info.type).toBe('handoff');
            expect(info.name).toBe('Handoff Orchestration');
            expect(info.useCases).toContain('When workflow path depends on results');
        });
        it('should return info for group-chat pattern', () => {
            const info = getPatternInfo('group-chat');
            expect(info.type).toBe('group-chat');
            expect(info.name).toBe('Group Chat');
            expect(info.useCases).toContain('When multiple agents need to collaborate');
        });
        it('should throw on unknown pattern', () => {
            expect(() => getPatternInfo('unknown')).toThrow('Unknown pattern type');
        });
        it('should include valid example request', () => {
            const info = getPatternInfo('sequential');
            expect(info.example.pattern).toBe('sequential');
            expect(info.example.agents).toBeDefined();
            expect(Array.isArray(info.example.agents)).toBe(true);
            expect(info.example.agents.length).toBeGreaterThan(0);
        });
        it('should include best practices for all patterns', () => {
            const patterns = ['sequential', 'concurrent', 'handoff', 'group-chat'];
            patterns.forEach(pattern => {
                const info = getPatternInfo(pattern);
                expect(info.bestPractices).toBeDefined();
                expect(info.bestPractices.length).toBeGreaterThan(2);
            });
        });
    });
    // ===== listAvailableAgents Tests =====
    describe('listAvailableAgents', () => {
        it('should list all registered agents', () => {
            const result = listAvailableAgents();
            expect(result.agents).toHaveLength(2);
            expect(result.agents.map(a => a.id)).toEqual(expect.arrayContaining(['test-agent-1', 'test-agent-2']));
        });
        it('should include agent names', () => {
            const result = listAvailableAgents();
            result.agents.forEach(agent => {
                expect(agent.name).toBeDefined();
                expect(agent.name.length).toBeGreaterThan(0);
            });
        });
        it('should include agent descriptions', () => {
            const result = listAvailableAgents();
            result.agents.forEach(agent => {
                expect(agent.description).toBeDefined();
                expect(agent.description.length).toBeGreaterThan(0);
            });
        });
        it('should include agent status', () => {
            const result = listAvailableAgents();
            result.agents.forEach(agent => {
                expect(agent.status).toBeDefined();
                expect(agent.status).toBe('available');
            });
        });
        it('should include tool count', () => {
            const result = listAvailableAgents();
            const agent1 = result.agents.find(a => a.id === 'test-agent-1');
            const agent2 = result.agents.find(a => a.id === 'test-agent-2');
            expect(agent1.toolCount).toBe(2);
            expect(agent2.toolCount).toBe(1);
        });
        it('should list tool names', () => {
            const result = listAvailableAgents();
            const agent1 = result.agents.find(a => a.id === 'test-agent-1');
            expect(agent1.tools).toEqual(['tool1', 'tool2']);
        });
        it('should include statistics', () => {
            const result = listAvailableAgents();
            expect(result.stats).toBeDefined();
            expect(result.stats.totalAgents).toBe(2);
            expect(result.stats.availableAgents).toBe(2);
            expect(result.stats.totalTools).toBe(3);
        });
        it('should return empty list when no agents registered', () => {
            registry.agents.clear();
            const result = listAvailableAgents();
            expect(result.agents).toHaveLength(0);
            expect(result.stats.totalAgents).toBe(0);
        });
    });
    // ===== validateWorkflow Tests =====
    describe('validateWorkflow', () => {
        it('should validate correct sequential workflow', () => {
            const request = {
                pattern: 'sequential',
                agents: [
                    { agentId: 'test-agent-1', toolName: 'tool1', args: {} },
                    { agentId: 'test-agent-2', toolName: 'tool3', args: {} }
                ]
            };
            const result = validateWorkflow(request);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('should validate correct concurrent workflow', () => {
            const request = {
                pattern: 'concurrent',
                agents: [
                    { agentId: 'test-agent-1', toolName: 'tool1', args: {} },
                    { agentId: 'test-agent-2', toolName: 'tool3', args: {} }
                ]
            };
            const result = validateWorkflow(request);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('should reject unknown pattern', () => {
            const request = {
                pattern: 'unknown',
                agents: [
                    { agentId: 'test-agent-1', toolName: 'tool1', args: {} }
                ]
            };
            const result = validateWorkflow(request);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors[0]).toContain('Invalid enum value');
        });
        it('should reject invalid schema', () => {
            const request = {
                pattern: 'sequential',
                agents: 'not-an-array'
            };
            const result = validateWorkflow(request);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
        it('should reject empty agents array', () => {
            const request = {
                pattern: 'sequential',
                agents: []
            };
            const result = validateWorkflow(request);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
        it('should reject nonexistent agent', () => {
            const request = {
                pattern: 'sequential',
                agents: [
                    { agentId: 'nonexistent', toolName: 'tool1', args: {} }
                ]
            };
            const result = validateWorkflow(request);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
        it('should reject nonexistent tool', () => {
            const request = {
                pattern: 'sequential',
                agents: [
                    { agentId: 'test-agent-1', toolName: 'nonexistent-tool', args: {} }
                ]
            };
            const result = validateWorkflow(request);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
        it('should warn on large number of agents', () => {
            const agents = Array.from({ length: 12 }, (_, i) => ({
                agentId: i < 6 ? 'test-agent-1' : 'test-agent-2',
                toolName: i < 6 ? 'tool1' : 'tool3',
                args: {}
            }));
            const request = {
                pattern: 'sequential',
                agents
            };
            const result = validateWorkflow(request);
            expect(result.warnings.length).toBeGreaterThan(0);
            expect(result.warnings.some(w => w.includes('Large number of agents'))).toBe(true);
        });
        it('should warn on concurrent without maxConcurrency', () => {
            const request = {
                pattern: 'concurrent',
                agents: [
                    { agentId: 'test-agent-1', toolName: 'tool1', args: {} },
                    { agentId: 'test-agent-2', toolName: 'tool3', args: {} }
                ]
            };
            const result = validateWorkflow(request);
            expect(result.warnings.length).toBeGreaterThan(0);
            expect(result.warnings.some(w => w.includes('maxConcurrency'))).toBe(true);
        });
        it('should accept concurrent with maxConcurrency', () => {
            const request = {
                pattern: 'concurrent',
                agents: [
                    { agentId: 'test-agent-1', toolName: 'tool1', args: {} },
                    { agentId: 'test-agent-2', toolName: 'tool3', args: {} }
                ],
                config: {
                    maxConcurrency: 2
                }
            };
            const result = validateWorkflow(request);
            expect(result.valid).toBe(true);
            // Should not warn about maxConcurrency
            expect(result.warnings.some(w => w.includes('maxConcurrency'))).toBe(false);
        });
        it('should validate group-chat pattern requirements', () => {
            const request = {
                pattern: 'group-chat',
                agents: [
                    { agentId: 'test-agent-1', toolName: 'tool1', args: {} }
                ]
            };
            const result = validateWorkflow(request);
            // Group chat requires at least 2 agents
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('At least two agents'))).toBe(true);
        });
        it('should validate handoff pattern with dependencies', () => {
            const request = {
                pattern: 'handoff',
                agents: [
                    { agentId: 'test-agent-1', toolName: 'tool1', args: {} },
                    {
                        agentId: 'test-agent-2',
                        toolName: 'tool3',
                        args: {}
                    }
                ]
            };
            const result = validateWorkflow(request);
            // Valid handoff pattern
            expect(result.valid).toBe(true);
        });
    });
});
//# sourceMappingURL=tools.test.js.map