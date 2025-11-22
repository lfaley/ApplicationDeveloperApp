#!/usr/bin/env node

/**
 * Multi-Agent Orchestration MCP Server
 * 
 * Provides orchestration capabilities for coordinating multiple MCP agents
 * in various patterns (sequential, concurrent, handoff, group-chat).
 * 
 * @module index
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import {
  orchestrateWorkflow,
  listPatterns,
  getPatternInfo,
  listAvailableAgents,
  validateWorkflow,
} from './tools.js';
import { OrchestrationRequestSchema } from './types.js';

/**
 * Create and configure MCP server
 */
const server = new Server(
  {
    name: 'orchestration-agent',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * List Tools Handler
 * 
 * Returns all available orchestration tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'orchestrate_workflow',
        description: 'Execute a multi-agent workflow using specified orchestration pattern. Supports sequential, concurrent, handoff, and group-chat patterns.',
        inputSchema: {
          type: 'object',
          properties: {
            pattern: {
              type: 'string',
              enum: ['sequential', 'concurrent', 'handoff', 'group-chat'],
              description: 'Orchestration pattern to use',
            },
            agents: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  agentId: {
                    type: 'string',
                    description: 'Agent identifier (e.g., code-documentation, code-review)',
                  },
                  toolName: {
                    type: 'string',
                    description: 'Tool name to invoke on the agent',
                  },
                  args: {
                    type: 'object',
                    description: 'Arguments to pass to the tool',
                  },
                  condition: {
                    type: 'object',
                    properties: {
                      dependsOn: {
                        type: 'string',
                        description: 'Agent ID this agent depends on',
                      },
                      requiresSuccess: {
                        type: 'boolean',
                        description: 'Whether dependency must succeed',
                      },
                    },
                  },
                  timeout: {
                    type: 'number',
                    description: 'Execution timeout in milliseconds',
                  },
                },
                required: ['agentId', 'toolName', 'args'],
              },
              description: 'Agents to orchestrate',
            },
            config: {
              type: 'object',
              properties: {
                continueOnError: {
                  type: 'boolean',
                  description: 'Continue execution if an agent fails',
                },
                maxConcurrency: {
                  type: 'number',
                  description: 'Maximum parallel executions (concurrent pattern)',
                },
                passResults: {
                  type: 'boolean',
                  description: 'Pass results between agents',
                },
                aggregateResults: {
                  type: 'boolean',
                  description: 'Aggregate results into single output',
                },
              },
            },
            description: {
              type: 'string',
              description: 'Workflow description',
            },
          },
          required: ['pattern', 'agents'],
        },
      },
      {
        name: 'list_patterns',
        description: 'List all available orchestration patterns with their capabilities and descriptions.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'pattern_info',
        description: 'Get detailed information about a specific orchestration pattern, including use cases, examples, and best practices.',
        inputSchema: {
          type: 'object',
          properties: {
            pattern: {
              type: 'string',
              enum: ['sequential', 'concurrent', 'handoff', 'group-chat'],
              description: 'Pattern type to get information about',
            },
          },
          required: ['pattern'],
        },
      },
      {
        name: 'list_agents',
        description: 'List all available agents and their tools that can be used in orchestration.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'validate_workflow',
        description: 'Validate an orchestration workflow configuration without executing it.',
        inputSchema: {
          type: 'object',
          properties: {
            pattern: {
              type: 'string',
              enum: ['sequential', 'concurrent', 'handoff', 'group-chat'],
            },
            agents: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
            config: {
              type: 'object',
            },
          },
          required: ['pattern', 'agents'],
        },
      },
    ],
  };
});

/**
 * Call Tool Handler
 * 
 * Executes the requested tool
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'orchestrate_workflow': {
        const result = await orchestrateWorkflow(args as any);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'list_patterns': {
        const patterns = listPatterns();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(patterns, null, 2),
            },
          ],
        };
      }

      case 'pattern_info': {
        const pattern = z.object({ pattern: z.string() }).parse(args);
        const info = getPatternInfo(pattern.pattern);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(info, null, 2),
            },
          ],
        };
      }

      case 'list_agents': {
        const agents = listAvailableAgents();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(agents, null, 2),
            },
          ],
        };
      }

      case 'validate_workflow': {
        const validation = validateWorkflow(args as any);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(validation, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              error: errorMessage,
              stack: error instanceof Error ? error.stack : undefined,
            },
            null,
            2
          ),
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
  
  // Log to stderr so it doesn't interfere with MCP communication
  console.error('Orchestration Agent MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
