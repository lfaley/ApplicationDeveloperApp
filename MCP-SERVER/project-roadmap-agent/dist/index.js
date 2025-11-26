"use strict";
/**
 * Project Roadmap Agent - MCP Server
 *
 * Automates project roadmap management with:
 * - Roadmap parsing and analysis
 * - Progress tracking and updates
 * - Gantt chart generation
 * - Velocity calculations and forecasting
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const tools_1 = require("./tools");
const parsers_1 = require("./parsers");
// Create MCP server
const server = new index_js_1.Server({
    name: 'project-roadmap-agent',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
// List available tools
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'analyze_roadmap',
                description: 'Parse and analyze ROADMAP.md to extract features, calculate metrics, and assess project health',
                inputSchema: {
                    type: 'object',
                    properties: {
                        roadmapContent: {
                            type: 'string',
                            description: 'The full content of ROADMAP.md file',
                        },
                    },
                    required: ['roadmapContent'],
                },
            },
            {
                name: 'update_roadmap',
                description: 'Update feature status, progress, and metadata in ROADMAP.md',
                inputSchema: {
                    type: 'object',
                    properties: {
                        roadmapContent: {
                            type: 'string',
                            description: 'The current ROADMAP.md content',
                        },
                        updates: {
                            type: 'array',
                            description: 'Array of updates to apply',
                            items: {
                                type: 'object',
                                properties: {
                                    featureId: {
                                        type: 'string',
                                        description: 'Feature ID to update',
                                    },
                                    updates: {
                                        type: 'object',
                                        properties: {
                                            status: {
                                                type: 'string',
                                                enum: ['draft', 'planned', 'in-progress', 'review', 'completed', 'blocked', 'cancelled'],
                                            },
                                            progress: {
                                                type: 'number',
                                                minimum: 0,
                                                maximum: 100,
                                            },
                                            assignee: { type: 'string' },
                                            completedDate: { type: 'string' },
                                        },
                                    },
                                },
                                required: ['featureId', 'updates'],
                            },
                        },
                    },
                    required: ['roadmapContent', 'updates'],
                },
            },
            {
                name: 'generate_gantt',
                description: 'Generate a Mermaid Gantt chart from roadmap features',
                inputSchema: {
                    type: 'object',
                    properties: {
                        roadmapContent: {
                            type: 'string',
                            description: 'The ROADMAP.md content to visualize',
                        },
                        groupBySprint: {
                            type: 'boolean',
                            description: 'Group features by sprint (default: false)',
                            default: false,
                        },
                    },
                    required: ['roadmapContent'],
                },
            },
            {
                name: 'calculate_velocity',
                description: 'Calculate team velocity metrics and generate forecasts',
                inputSchema: {
                    type: 'object',
                    properties: {
                        roadmapContent: {
                            type: 'string',
                            description: 'The ROADMAP.md content',
                        },
                        sprintName: {
                            type: 'string',
                            description: 'Optional: Generate burndown for specific sprint',
                        },
                    },
                    required: ['roadmapContent'],
                },
            },
        ],
    };
});
// Handle tool calls
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    try {
        const { name, arguments: args } = request.params;
        switch (name) {
            case 'analyze_roadmap': {
                const { roadmapContent } = args;
                const analysis = await (0, tools_1.analyzeRoadmap)(roadmapContent);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(analysis, null, 2),
                        },
                    ],
                };
            }
            case 'update_roadmap': {
                const { roadmapContent, updates } = args;
                const updatedContent = await (0, tools_1.updateRoadmap)(roadmapContent, updates);
                return {
                    content: [
                        {
                            type: 'text',
                            text: updatedContent,
                        },
                    ],
                };
            }
            case 'generate_gantt': {
                const { roadmapContent, groupBySprint } = args;
                const parser = new parsers_1.RoadmapParser();
                const { features, sprints } = parser.parseRoadmap(roadmapContent);
                const gantt = groupBySprint
                    ? await Promise.resolve().then(() => __importStar(require('./tools/gantt'))).then(m => m.generateGanttBySprint(features, sprints.map(s => s.name)))
                    : await (0, tools_1.generateGantt)(features);
                return {
                    content: [
                        {
                            type: 'text',
                            text: gantt.diagram,
                        },
                    ],
                };
            }
            case 'calculate_velocity': {
                const { roadmapContent, sprintName } = args;
                const parser = new parsers_1.RoadmapParser();
                const { features, sprints } = parser.parseRoadmap(roadmapContent);
                if (sprintName) {
                    // Generate burndown for specific sprint
                    const sprint = sprints.find(s => s.name === sprintName);
                    if (!sprint) {
                        throw new Error(`Sprint "${sprintName}" not found`);
                    }
                    const burndown = await (0, tools_1.generateBurndown)(sprint, features);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(burndown, null, 2),
                            },
                        ],
                    };
                }
                else {
                    // Calculate overall metrics
                    const metrics = await (0, tools_1.calculateTeamMetrics)(sprints, features);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(metrics, null, 2),
                            },
                        ],
                    };
                }
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${message}`,
                },
            ],
            isError: true,
        };
    }
});
// Start server
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error('Project Roadmap Agent MCP server running on stdio');
}
main().catch((error) => {
    console.error('Fatal error in main():', error);
    process.exit(1);
});
