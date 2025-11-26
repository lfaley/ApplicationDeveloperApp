/**
 * Orchestration MCP Tools
 *
 * Provides MCP tools for orchestrating multiple agents in various patterns.
 * Enables complex multi-agent workflows through a simple tool interface.
 *
 * @module tools
 */
import { OrchestrationRequestSchema } from './types.js';
import { registry } from './registry.js';
import { SequentialPattern } from './patterns/sequential.js';
import { ConcurrentPattern } from './patterns/concurrent.js';
import { HandoffPattern } from './patterns/handoff.js';
import { GroupChatPattern } from './patterns/group-chat.js';
/**
 * Pattern Registry
 *
 * Maps pattern types to their implementations
 */
const patterns = new Map([
    ['sequential', new SequentialPattern()],
    ['concurrent', new ConcurrentPattern()],
    ['handoff', new HandoffPattern()],
    ['group-chat', new GroupChatPattern()],
]);
/**
 * Orchestrate Workflow Tool
 *
 * Executes a multi-agent workflow using the specified orchestration pattern.
 * This is the main tool for coordinating multiple agents.
 *
 * @param request - Orchestration request
 * @returns Orchestration result
 */
export async function orchestrateWorkflow(request) {
    // Validate request
    const validation = OrchestrationRequestSchema.safeParse(request);
    if (!validation.success) {
        throw new Error(`Invalid orchestration request: ${validation.error.message}`);
    }
    // Get pattern implementation
    const pattern = patterns.get(request.pattern);
    if (!pattern) {
        throw new Error(`Unknown orchestration pattern: ${request.pattern}`);
    }
    // Validate pattern-specific configuration
    const patternValidation = pattern.validate(request);
    if (!patternValidation.valid) {
        throw new Error(`Pattern validation failed: ${patternValidation.errors?.join(', ')}`);
    }
    // Execute orchestration
    const result = await pattern.execute(request);
    return result;
}
/**
 * List Patterns Tool
 *
 * Returns information about all available orchestration patterns.
 * Useful for discovering capabilities and understanding pattern options.
 *
 * @returns Array of pattern information
 */
export function listPatterns() {
    return [
        {
            type: 'sequential',
            name: 'Sequential Execution',
            description: 'Execute agents one after another in order',
            capabilities: [
                'Ordered execution',
                'Result passing between agents',
                'Conditional execution based on previous results',
                'Stop on first failure (configurable)',
                'Dependencies between agents',
            ],
        },
        {
            type: 'concurrent',
            name: 'Concurrent Execution',
            description: 'Execute agents in parallel',
            capabilities: [
                'Parallel execution',
                'Configurable concurrency limit',
                'Continue on error (configurable)',
                'Aggregate results',
                'Faster execution for independent tasks',
            ],
        },
        {
            type: 'handoff',
            name: 'Handoff Execution',
            description: 'Pass control between agents based on results',
            capabilities: [
                'Dynamic workflow paths',
                'Conditional agent selection',
                'Context-aware execution',
                'Result-based routing',
                'Flexible workflow control',
            ],
        },
        {
            type: 'group-chat',
            name: 'Group Chat',
            description: 'Multi-agent discussion with iterative refinement',
            capabilities: [
                'Multiple execution rounds',
                'Collaborative refinement',
                'Shared context across agents',
                'Iterative improvement',
                'Convergence detection',
            ],
        },
    ];
}
/**
 * Pattern Info Tool
 *
 * Returns detailed information about a specific orchestration pattern,
 * including usage examples and best practices.
 *
 * @param patternType - Pattern type to get info for
 * @returns Detailed pattern information
 */
export function getPatternInfo(patternType) {
    const pattern = patterns.get(patternType);
    if (!pattern) {
        throw new Error(`Unknown pattern type: ${patternType}`);
    }
    // Pattern-specific information
    const info = {
        sequential: {
            useCases: [
                'When agents have dependencies on previous results',
                'Building a processing pipeline (analyze → review → test)',
                'When order of execution matters',
                'Sequential refinement workflows',
            ],
            example: {
                pattern: 'sequential',
                agents: [
                    {
                        agentId: 'code-documentation',
                        toolName: 'analyze_code',
                        args: { code: 'function example() {}', language: 'typescript' },
                    },
                    {
                        agentId: 'code-review',
                        toolName: 'review_code',
                        args: { code: 'function example() {}', language: 'typescript' },
                    },
                ],
                config: {
                    passResults: true,
                    continueOnError: false,
                },
                description: 'Analyze then review code',
            },
            bestPractices: [
                'Use passResults to enable result sharing',
                'Set continueOnError: false to stop on first failure',
                'Use conditions for complex dependencies',
                'Keep workflows linear when possible',
            ],
        },
        concurrent: {
            useCases: [
                'When agents are independent and can run simultaneously',
                'Parallel analysis (documentation + review + tests)',
                'Speed up execution of independent tasks',
                'Batch processing workflows',
            ],
            example: {
                pattern: 'concurrent',
                agents: [
                    {
                        agentId: 'code-documentation',
                        toolName: 'analyze_code',
                        args: { code: 'function example() {}' },
                    },
                    {
                        agentId: 'code-review',
                        toolName: 'review_code',
                        args: { code: 'function example() {}' },
                    },
                    {
                        agentId: 'test-generator',
                        toolName: 'generate_tests',
                        args: { code: 'function example() {}' },
                    },
                ],
                config: {
                    maxConcurrency: 3,
                    aggregateResults: true,
                },
                description: 'Parallel code analysis',
            },
            bestPractices: [
                'Set maxConcurrency to control resource usage',
                'Use for truly independent tasks only',
                'Enable aggregateResults for combined output',
                'Set continueOnError: true to get all results',
            ],
        },
        handoff: {
            useCases: [
                'When workflow path depends on results',
                'Conditional branching (if security issues, use security agent)',
                'Dynamic agent selection',
                'Context-aware workflows',
            ],
            example: {
                pattern: 'handoff',
                agents: [
                    {
                        agentId: 'code-review',
                        toolName: 'quick_review',
                        args: { code: 'function example() {}' },
                    },
                    {
                        agentId: 'code-review',
                        toolName: 'security_review',
                        args: { code: 'function example() {}' },
                        dependsOn: 'code-review',
                        requiresSuccess: true,
                    },
                ],
                config: {
                    continueOnError: false,
                },
                description: 'Review then deep dive if needed',
            },
            bestPractices: [
                'Use conditions to control handoffs',
                'Keep handoff chains short',
                'Validate handoff targets exist',
                'Document decision logic clearly',
            ],
        },
        'group-chat': {
            useCases: [
                'When multiple agents need to collaborate',
                'Iterative refinement workflows',
                'Consensus building between agents',
                'Complex problem solving requiring multiple perspectives',
            ],
            example: {
                pattern: 'group-chat',
                agents: [
                    {
                        agentId: 'code-review',
                        toolName: 'review_code',
                        args: { code: 'function example() {}' },
                    },
                    {
                        agentId: 'test-generator',
                        toolName: 'analyze_testability',
                        args: { code: 'function example() {}' },
                    },
                ],
                config: {
                    continueOnError: true,
                    aggregateResults: true,
                },
                description: 'Collaborative code analysis',
            },
            bestPractices: [
                'Use at least 2-3 agents for meaningful discussion',
                'Enable aggregateResults to see final outputs',
                'Set continueOnError: true for robust discussions',
                'Limit rounds to prevent excessive execution',
            ],
        },
    };
    const patternInfo = info[patternType];
    if (!patternInfo) {
        throw new Error(`No detailed info available for pattern: ${patternType}`);
    }
    return {
        type: pattern.type,
        name: pattern.name,
        description: pattern.description,
        useCases: patternInfo.useCases,
        example: patternInfo.example,
        bestPractices: patternInfo.bestPractices,
    };
}
/**
 * List Available Agents Tool
 *
 * Returns information about all registered agents and their tools.
 * Useful for discovering what agents are available for orchestration.
 *
 * @returns Agent registry information
 */
export function listAvailableAgents() {
    const agents = registry.getAllAgents().map(agent => ({
        id: agent.id,
        name: agent.name,
        description: agent.description,
        status: agent.status,
        toolCount: agent.tools.length,
        tools: agent.tools.map(t => t.name),
    }));
    return {
        agents,
        stats: registry.getStats(),
    };
}
/**
 * Validate Workflow Tool
 *
 * Validates an orchestration request without executing it.
 * Useful for checking configuration before execution.
 *
 * @param request - Orchestration request to validate
 * @returns Validation result
 */
export function validateWorkflow(request) {
    const errors = [];
    const warnings = [];
    // Validate schema
    const schemaValidation = OrchestrationRequestSchema.safeParse(request);
    if (!schemaValidation.success) {
        errors.push(...schemaValidation.error.errors.map(e => e.message));
        return { valid: false, errors, warnings };
    }
    // Get pattern
    const pattern = patterns.get(request.pattern);
    if (!pattern) {
        errors.push(`Unknown pattern: ${request.pattern}`);
        return { valid: false, errors, warnings };
    }
    // Validate pattern-specific rules
    const patternValidation = pattern.validate(request);
    if (!patternValidation.valid && patternValidation.errors) {
        errors.push(...patternValidation.errors);
    }
    // Add warnings
    if (request.agents.length > 10) {
        warnings.push('Large number of agents (>10) may impact performance');
    }
    if (request.pattern === 'concurrent' && !request.config?.maxConcurrency) {
        warnings.push('No maxConcurrency set - all agents will run in parallel');
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
//# sourceMappingURL=tools.js.map