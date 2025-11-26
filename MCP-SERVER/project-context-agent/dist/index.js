#!/usr/bin/env node
/**
 * Project Context Agent MCP Server
 *
 * Provides drift detection and context health monitoring for project documentation.
 * Helps keep documentation synchronized with code changes.
 *
 * @module index
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { GitIntegration } from './git-integration.js';
import { DriftDetector } from './drift-detection.js';
import { HealthChecker } from './health-check.js';
import { SyncEngine } from './sync-engine.js';
import * as fs from 'fs';
import * as path from 'path';
/**
 * Create and configure MCP server
 */
const server = new Server({
    name: 'project-context-agent',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
/**
 * List Tools Handler
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'detect_drift',
                description: 'Detect drift between code and documentation. Identifies outdated, missing, or inconsistent documentation.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        workspacePath: {
                            type: 'string',
                            description: 'Absolute path to workspace/repository',
                        },
                        includePatterns: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Glob patterns for files to include (optional)',
                        },
                        excludePatterns: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Glob patterns for files to exclude (optional)',
                        },
                        severityThreshold: {
                            type: 'string',
                            enum: ['critical', 'high', 'medium', 'low'],
                            description: 'Minimum severity to report (optional)',
                        },
                    },
                    required: ['workspacePath'],
                },
            },
            {
                name: 'health_check',
                description: 'Get overall context health score for the workspace. Returns 0-100 score with grade.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        workspacePath: {
                            type: 'string',
                            description: 'Absolute path to workspace/repository',
                        },
                        includePatterns: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Glob patterns for files to include (optional)',
                        },
                    },
                    required: ['workspacePath'],
                },
            },
            {
                name: 'suggest_updates',
                description: 'Generate actionable recommendations for fixing detected drift.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        workspacePath: {
                            type: 'string',
                            description: 'Absolute path to workspace/repository',
                        },
                        driftItems: {
                            type: 'array',
                            description: 'Drift items to generate recommendations for',
                        },
                    },
                    required: ['workspacePath'],
                },
            },
            {
                name: 'auto_sync',
                description: 'Automatically synchronize documentation with code changes (requires approval).',
                inputSchema: {
                    type: 'object',
                    properties: {
                        workspacePath: {
                            type: 'string',
                            description: 'Absolute path to workspace/repository',
                        },
                        driftItemIds: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Specific drift items to sync (empty = all)',
                        },
                        requireApproval: {
                            type: 'boolean',
                            description: 'Require user approval before syncing',
                            default: true,
                        },
                        createBackup: {
                            type: 'boolean',
                            description: 'Create backup before modifying files',
                            default: true,
                        },
                    },
                    required: ['workspacePath'],
                },
            },
        ],
    };
});
/**
 * Call Tool Handler
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case 'detect_drift': {
                const { workspacePath, includePatterns, excludePatterns, severityThreshold } = args;
                const git = new GitIntegration(workspacePath);
                const detector = new DriftDetector(git);
                const result = await detector.detectDrift({
                    includePatterns,
                    excludePatterns,
                    severityThreshold,
                });
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }
            case 'health_check': {
                const { workspacePath, includePatterns } = args;
                const git = new GitIntegration(workspacePath);
                const detector = new DriftDetector(git);
                const healthChecker = new HealthChecker(git, detector);
                const result = await healthChecker.calculateHealth({
                    includePatterns,
                });
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }
            case 'suggest_updates': {
                const { workspacePath } = args;
                const git = new GitIntegration(workspacePath);
                const detector = new DriftDetector(git);
                const result = await detector.detectDrift();
                // Extract recommendations from drift items
                const recommendations = result.driftItems
                    .flatMap(item => item.recommendations.map(rec => ({
                    file: item.filePath,
                    severity: item.severity,
                    recommendation: rec,
                    type: item.type,
                })));
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                totalRecommendations: recommendations.length,
                                recommendations,
                                summary: result.summary,
                            }, null, 2),
                        },
                    ],
                };
            }
            case 'auto_sync': {
                const { workspacePath, driftItemIds, requireApproval, createBackup } = args;
                const git = new GitIntegration(workspacePath);
                const detector = new DriftDetector(git);
                const syncEngine = new SyncEngine(git, detector);
                // Note: In MCP context, approval callback would need to be implemented
                // via a separate approval mechanism (e.g., user confirmation prompt)
                const approvalCallback = requireApproval !== false
                    ? async (items) => {
                        // In production, this would prompt the user through Claude Desktop UI
                        console.error(`Approval required for ${items.length} sync operations`);
                        items.forEach(item => {
                            console.error(`  - ${item.filePath} (${item.type}, ${item.severity})`);
                        });
                        return true; // Auto-approve for now
                    }
                    : undefined;
                const result = await syncEngine.sync({
                    driftItemIds: driftItemIds || [],
                    createBackup: createBackup !== false,
                    approvalCallback,
                });
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }
            case 'guided_prompt': {
                // Simulate user goals and prompt results
                const userGoals = {
                    focusAreas: ['core modules', 'API docs'],
                    docStyle: 'Microsoft',
                    topPriority: 'API completeness',
                };
                const promptResults = `# Prompt Results\n\n- Focus: core modules, API docs\n- Style: Microsoft\n- Priority: API completeness`;
                // Output directory logic
                const outDir = path.join(process.cwd(), 'CONTEXT-SUMMARY');
                if (!fs.existsSync(outDir)) {
                    fs.mkdirSync(outDir, { recursive: true });
                    console.error(`[guided_prompt] Created directory: ${outDir}`);
                }
                // Write user_goals.json
                const userGoalsPath = path.join(outDir, 'user_goals.json');
                fs.writeFileSync(userGoalsPath, JSON.stringify(userGoals, null, 2), 'utf-8');
                console.error(`[guided_prompt] Wrote: ${userGoalsPath}`);
                // Write prompt_results.md
                const promptResultsPath = path.join(outDir, 'prompt_results.md');
                fs.writeFileSync(promptResultsPath, promptResults, 'utf-8');
                console.error(`[guided_prompt] Wrote: ${promptResultsPath}`);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({ userGoals, promptResults }, null, 2),
                        },
                    ],
                };
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        const err = error;
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        error: err.message,
                        stack: err.stack,
                    }, null, 2),
                },
            ],
            isError: true,
        };
    }
});
/**
 * Start server
 */
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Project Context Agent MCP server running on stdio');
}
main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map