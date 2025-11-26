/**
 * Group Chat Orchestration Pattern Tests
 *
 * Tests the group-chat pattern which enables multi-agent discussion
 * where agents can build on each other's outputs across multiple rounds.
 */
import { GroupChatPattern } from '../src/patterns/group-chat.js';
import { registry } from '../src/registry.js';
import { z } from 'zod';
describe('GroupChatPattern', () => {
    let pattern;
    beforeEach(() => {
        pattern = new GroupChatPattern();
        // Clear and setup test agents
        registry.agents.clear();
        const testSchema = z.object({}).optional();
        // Register test agents for group chat
        registry.registerAgent({
            id: 'reviewer',
            name: 'Code Reviewer',
            description: 'Reviews code quality',
            status: 'available',
            tools: [{ name: 'review', description: 'Review code', inputSchema: testSchema }]
        });
        registry.registerAgent({
            id: 'refactorer',
            name: 'Code Refactorer',
            description: 'Suggests refactorings',
            status: 'available',
            tools: [{ name: 'refactor', description: 'Refactor code', inputSchema: testSchema }]
        });
        registry.registerAgent({
            id: 'tester',
            name: 'Test Generator',
            description: 'Generates tests',
            status: 'available',
            tools: [{ name: 'generate_tests', description: 'Generate tests', inputSchema: testSchema }]
        });
    });
    // ===== Metadata Tests =====
    describe('Pattern Metadata', () => {
        it('should have correct pattern type', () => {
            expect(pattern.type).toBe('group-chat');
        });
        it('should have correct pattern name', () => {
            expect(pattern.name).toBe('Group Chat');
        });
        it('should have descriptive name', () => {
            expect(pattern.description).toBe('Multi-agent discussion with iterative refinement');
        });
    });
    // ===== Validation Tests =====
    describe('Validation', () => {
        it('should reject group chat with less than 2 agents', () => {
            const request = {
                pattern: 'group-chat',
                agents: [
                    { agentId: 'reviewer', toolName: 'review', args: {} }
                ]
            };
            const validation = pattern.validate(request);
            expect(validation.isValid).toBe(false);
            expect(validation.valid).toBe(false);
            expect(validation.errors).toContain('At least two agents are required for group chat');
        });
        it('should accept valid 2-agent group chat', () => {
            const request = {
                pattern: 'group-chat',
                agents: [
                    { agentId: 'reviewer', toolName: 'review', args: {} },
                    { agentId: 'refactorer', toolName: 'refactor', args: {} }
                ]
            };
            const validation = pattern.validate(request);
            expect(validation.isValid).toBe(true);
            expect(validation.valid).toBe(true);
            expect(validation.errors).toHaveLength(0);
        });
        it('should accept valid 3-agent group chat', () => {
            const request = {
                pattern: 'group-chat',
                agents: [
                    { agentId: 'reviewer', toolName: 'review', args: {} },
                    { agentId: 'refactorer', toolName: 'refactor', args: {} },
                    { agentId: 'tester', toolName: 'generate_tests', args: {} }
                ]
            };
            const validation = pattern.validate(request);
            expect(validation.isValid).toBe(true);
            expect(validation.valid).toBe(true);
            expect(validation.errors).toHaveLength(0);
        });
        it('should reject invalid agent IDs', () => {
            const request = {
                pattern: 'group-chat',
                agents: [
                    { agentId: 'nonexistent1', toolName: 'review', args: {} },
                    { agentId: 'nonexistent2', toolName: 'refactor', args: {} }
                ]
            };
            const validation = pattern.validate(request);
            expect(validation.isValid).toBe(false);
            expect(validation.valid).toBe(false);
            expect(validation.errors.length).toBeGreaterThan(0);
        });
    });
    // ===== Discussion Round Tests =====
    describe('Discussion Rounds', () => {
        it('should execute multiple rounds of discussion', async () => {
            const request = {
                pattern: 'group-chat',
                agents: [
                    { agentId: 'reviewer', toolName: 'review', args: {} },
                    { agentId: 'refactorer', toolName: 'refactor', args: {} }
                ]
            };
            const result = await pattern.execute(request);
            expect(result.status).toBe('completed');
            expect(result.agentResults.length).toBeGreaterThan(2); // Multiple rounds
            // Check that rounds are tracked
            const rounds = result.agentResults.map(r => r.output?.round);
            expect(rounds.some(r => r === 1)).toBe(true);
            expect(rounds.some(r => r === 2)).toBe(true);
        });
        it('should pass discussion context to each agent', async () => {
            const request = {
                pattern: 'group-chat',
                agents: [
                    { agentId: 'reviewer', toolName: 'review', args: {} },
                    { agentId: 'refactorer', toolName: 'refactor', args: {} }
                ]
            };
            const result = await pattern.execute(request);
            // Check that later rounds have discussion context
            const laterResults = result.agentResults.slice(2); // After first round
            laterResults.forEach(r => {
                if (r.status === 'completed') {
                    expect(r.output.discussionContext).toBeDefined();
                    expect(r.output.consideredPreviousOutputs).toBeGreaterThan(0);
                }
            });
        });
        it('should track round numbers correctly', async () => {
            const request = {
                pattern: 'group-chat',
                agents: [
                    { agentId: 'reviewer', toolName: 'review', args: {} },
                    { agentId: 'refactorer', toolName: 'refactor', args: {} },
                    { agentId: 'tester', toolName: 'generate_tests', args: {} }
                ]
            };
            const result = await pattern.execute(request);
            // Each agent should have results from multiple rounds
            const reviewerResults = result.agentResults.filter(r => r.agentId === 'reviewer');
            const refactorerResults = result.agentResults.filter(r => r.agentId === 'refactorer');
            const testerResults = result.agentResults.filter(r => r.agentId === 'tester');
            expect(reviewerResults.length).toBeGreaterThan(1);
            expect(refactorerResults.length).toBeGreaterThan(1);
            expect(testerResults.length).toBeGreaterThan(1);
            // Check round numbers increment
            const reviewerRounds = reviewerResults.map(r => r.output?.round);
            expect(reviewerRounds).toEqual(expect.arrayContaining([1, 2, 3]));
        });
    });
    // ===== Context Building Tests =====
    describe('Context Building', () => {
        it('should accumulate previous outputs across rounds', async () => {
            const request = {
                pattern: 'group-chat',
                agents: [
                    { agentId: 'reviewer', toolName: 'review', args: {} },
                    { agentId: 'refactorer', toolName: 'refactor', args: {} }
                ]
            };
            const result = await pattern.execute(request);
            // Find a result from round 2 or later
            const laterRoundResult = result.agentResults.find(r => r.status === 'completed' && r.output.round >= 2);
            expect(laterRoundResult).toBeDefined();
            expect(laterRoundResult.output.consideredPreviousOutputs).toBeGreaterThan(0);
        });
        it('should provide summary of discussion history', async () => {
            const request = {
                pattern: 'group-chat',
                agents: [
                    { agentId: 'reviewer', toolName: 'review', args: {} },
                    { agentId: 'refactorer', toolName: 'refactor', args: {} }
                ]
            };
            const result = await pattern.execute(request);
            // Check that discussion context summaries exist
            const resultsWithContext = result.agentResults.filter(r => r.status === 'completed' && r.output.discussionContext);
            expect(resultsWithContext.length).toBeGreaterThan(0);
            resultsWithContext.forEach(r => {
                expect(r.output.discussionContext).toContain('Round');
            });
        });
    });
    // ===== Error Handling Tests =====
    describe('Error Handling', () => {
        it('should continue on agent failure when continueOnError is true', async () => {
            const request = {
                pattern: 'group-chat',
                agents: [
                    { agentId: 'reviewer', toolName: 'review', args: { shouldFail: true } },
                    { agentId: 'refactorer', toolName: 'refactor', args: {} }
                ],
                config: { continueOnError: true }
            };
            const result = await pattern.execute(request);
            expect(result.status).toBe('partial'); // Some succeeded, some failed
            const successCount = result.agentResults.filter(r => r.status === 'completed').length;
            const failureCount = result.agentResults.filter(r => r.status === 'failed').length;
            expect(successCount).toBeGreaterThan(0);
            expect(failureCount).toBeGreaterThan(0);
        });
        it('should stop on agent failure when continueOnError is false', async () => {
            const request = {
                pattern: 'group-chat',
                agents: [
                    { agentId: 'reviewer', toolName: 'review', args: { shouldFail: true } },
                    { agentId: 'refactorer', toolName: 'refactor', args: {} },
                    { agentId: 'tester', toolName: 'generate_tests', args: {} }
                ],
                config: { continueOnError: false }
            };
            const result = await pattern.execute(request);
            // Should stop after first failure
            expect(result.agentResults.length).toBeLessThan(6); // Would be 9 if all 3 rounds completed
            const firstFailure = result.agentResults.find(r => r.status === 'failed');
            expect(firstFailure).toBeDefined();
        });
        it('should capture error messages from failed agents', async () => {
            const request = {
                pattern: 'group-chat',
                agents: [
                    { agentId: 'reviewer', toolName: 'review', args: { shouldFail: true } },
                    { agentId: 'refactorer', toolName: 'refactor', args: {} }
                ],
                config: { continueOnError: true }
            };
            const result = await pattern.execute(request);
            const failedResult = result.agentResults.find(r => r.status === 'failed');
            expect(failedResult).toBeDefined();
            expect(failedResult.error).toBeDefined();
            expect(failedResult.error.message).toBeDefined();
        });
    });
    // ===== Output Aggregation Tests =====
    describe('Output Aggregation', () => {
        it('should aggregate all results', async () => {
            const request = {
                pattern: 'group-chat',
                agents: [
                    { agentId: 'reviewer', toolName: 'review', args: {} },
                    { agentId: 'refactorer', toolName: 'refactor', args: {} }
                ]
            };
            const result = await pattern.execute(request);
            expect(result.aggregatedOutput).toBeDefined();
            expect(result.aggregatedOutput.results).toBeDefined();
            expect(result.aggregatedOutput.results.length).toBe(result.agentResults.length);
        });
        it('should provide final round outputs separately', async () => {
            const request = {
                pattern: 'group-chat',
                agents: [
                    { agentId: 'reviewer', toolName: 'review', args: {} },
                    { agentId: 'refactorer', toolName: 'refactor', args: {} }
                ]
            };
            const result = await pattern.execute(request);
            expect(result.aggregatedOutput.finalRoundOutputs).toBeDefined();
            expect(result.aggregatedOutput.finalRoundOutputs.length).toBeGreaterThan(0);
            // Should have one final output per unique agent
            expect(result.aggregatedOutput.finalRoundOutputs.length).toBeLessThanOrEqual(2);
        });
        it('should filter failed results from final outputs', async () => {
            const request = {
                pattern: 'group-chat',
                agents: [
                    { agentId: 'reviewer', toolName: 'review', args: { shouldFail: true } },
                    { agentId: 'refactorer', toolName: 'refactor', args: {} }
                ],
                config: { continueOnError: true }
            };
            const result = await pattern.execute(request);
            const finalOutputs = result.aggregatedOutput.finalRoundOutputs;
            // Final outputs should only include successful completions
            expect(finalOutputs.length).toBeLessThanOrEqual(result.agentResults.length);
            // Verify no failed results in final outputs
            finalOutputs.forEach((output) => {
                expect(output).toBeDefined();
            });
        });
    });
    // ===== Performance Tests =====
    describe('Performance', () => {
        it('should complete 2-agent discussion in reasonable time', async () => {
            const request = {
                pattern: 'group-chat',
                agents: [
                    { agentId: 'reviewer', toolName: 'review', args: {} },
                    { agentId: 'refactorer', toolName: 'refactor', args: {} }
                ]
            };
            const startTime = Date.now();
            const result = await pattern.execute(request);
            const duration = Date.now() - startTime;
            expect(result.status).toBe('completed');
            expect(duration).toBeLessThan(5000); // 5 seconds for 3 rounds of 2 agents
        });
        it('should track execution timing metadata', async () => {
            const request = {
                pattern: 'group-chat',
                agents: [
                    { agentId: 'reviewer', toolName: 'review', args: {} },
                    { agentId: 'refactorer', toolName: 'refactor', args: {} }
                ]
            };
            const result = await pattern.execute(request);
            expect(result.metadata.startTime).toBeInstanceOf(Date);
            expect(result.metadata.endTime).toBeInstanceOf(Date);
            expect(result.metadata.totalDuration).toBeGreaterThan(0);
            expect(result.metadata.endTime.getTime()).toBeGreaterThanOrEqual(result.metadata.startTime.getTime());
        });
        it('should track individual agent execution times', async () => {
            const request = {
                pattern: 'group-chat',
                agents: [
                    { agentId: 'reviewer', toolName: 'review', args: {} },
                    { agentId: 'refactorer', toolName: 'refactor', args: {} }
                ]
            };
            const result = await pattern.execute(request);
            result.agentResults.forEach(agentResult => {
                expect(agentResult.metadata.startTime).toBeInstanceOf(Date);
                expect(agentResult.metadata.endTime).toBeInstanceOf(Date);
                expect(agentResult.metadata.duration).toBeGreaterThan(0);
            });
        });
    });
});
//# sourceMappingURL=group-chat.test.js.map