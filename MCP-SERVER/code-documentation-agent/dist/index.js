#!/usr/bin/env node
/**
 * Code Documentation Agent - MCP Server
 *
 * Automatically analyzes and generates documentation for source code across
 * multiple programming languages (TypeScript, Python, C#, PowerShell).
 *
 * @module code-documentation-agent
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
// Tool imports
import { analyzeCodeTool } from './tools/analyze.js';
import { generateDocumentationTool } from './tools/generate.js';
import { updateCommentsTool } from './tools/update.js';
import { validateDocumentationTool } from './tools/validate.js';
import { extractInterfacesTool } from './tools/extract.js';
import { batchDocumentTool } from './tools/batch.js';
/**
 * Available MCP tools for code documentation
 */
const tools = [
    {
        name: 'analyze_code',
        description: 'Analyzes source code and extracts function/class/method signatures with complexity metrics',
        inputSchema: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: 'Source code to analyze',
                },
                language: {
                    type: 'string',
                    enum: ['typescript', 'javascript', 'python', 'csharp', 'powershell'],
                    description: 'Programming language of the code',
                },
                filePath: {
                    type: 'string',
                    description: 'File path (for context)',
                },
            },
            required: ['code', 'language'],
        },
    },
    {
        name: 'generate_documentation',
        description: 'Generates documentation comments for specified code elements (JSDoc, TSDoc, docstrings, XML docs)',
        inputSchema: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: 'Code element to document',
                },
                language: {
                    type: 'string',
                    enum: ['typescript', 'javascript', 'python', 'csharp', 'powershell'],
                    description: 'Programming language',
                },
                style: {
                    type: 'string',
                    enum: ['jsdoc', 'tsdoc', 'google', 'numpy', 'sphinx', 'xmldoc', 'help'],
                    description: 'Documentation style to use',
                },
                includeExamples: {
                    type: 'boolean',
                    description: 'Whether to include usage examples',
                    default: false,
                },
                includeDescription: {
                    type: 'boolean',
                    description: 'Whether to infer and include description',
                    default: true,
                },
            },
            required: ['code', 'language', 'style'],
        },
    },
    {
        name: 'update_comments',
        description: 'Updates existing documentation or adds new documentation comments to source files',
        inputSchema: {
            type: 'object',
            properties: {
                filePath: {
                    type: 'string',
                    description: 'Path to file to update',
                },
                updates: {
                    type: 'array',
                    description: 'Array of documentation updates',
                    items: {
                        type: 'object',
                        properties: {
                            elementName: {
                                type: 'string',
                                description: 'Name of function/class/interface',
                            },
                            elementType: {
                                type: 'string',
                                enum: ['function', 'class', 'interface'],
                            },
                            documentation: {
                                type: 'string',
                                description: 'Generated documentation to insert',
                            },
                            line: {
                                type: 'number',
                                description: 'Line number to insert at',
                            },
                        },
                        required: ['elementName', 'elementType', 'documentation', 'line'],
                    },
                },
                dryRun: {
                    type: 'boolean',
                    description: 'Preview changes without writing',
                    default: false,
                },
            },
            required: ['filePath', 'updates'],
        },
    },
    {
        name: 'validate_documentation',
        description: 'Validates documentation completeness and quality against configurable rules',
        inputSchema: {
            type: 'object',
            properties: {
                filePath: {
                    type: 'string',
                    description: 'Path to file to validate',
                },
                language: {
                    type: 'string',
                    enum: ['typescript', 'javascript', 'python', 'csharp', 'powershell'],
                },
                rules: {
                    type: 'object',
                    description: 'Validation rules',
                    properties: {
                        requireParamDocs: { type: 'boolean', default: true },
                        requireReturnDocs: { type: 'boolean', default: true },
                        requireThrowsDocs: { type: 'boolean', default: false },
                        requireExamples: { type: 'boolean', default: false },
                        requireDescriptions: { type: 'boolean', default: true },
                        maxComplexityWithoutDocs: { type: 'number', default: 5 },
                    },
                },
            },
            required: ['filePath', 'language'],
        },
    },
    {
        name: 'extract_interfaces',
        description: 'Extracts interface/type definitions and generates documentation for them',
        inputSchema: {
            type: 'object',
            properties: {
                filePath: {
                    type: 'string',
                    description: 'Path to file containing interfaces',
                },
                language: {
                    type: 'string',
                    enum: ['typescript', 'javascript', 'python', 'csharp'],
                },
                includePrivate: {
                    type: 'boolean',
                    description: 'Include private/internal interfaces',
                    default: false,
                },
            },
            required: ['filePath', 'language'],
        },
    },
    {
        name: 'batch_document',
        description: 'Processes multiple files in batch for documentation generation',
        inputSchema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of file paths to process',
                },
                language: {
                    type: 'string',
                    enum: ['typescript', 'javascript', 'python', 'csharp', 'powershell'],
                },
                style: {
                    type: 'string',
                    enum: ['jsdoc', 'tsdoc', 'google', 'numpy', 'sphinx', 'xmldoc', 'help'],
                },
                mode: {
                    type: 'string',
                    enum: ['add-missing', 'update-all', 'validate-only'],
                    description: 'Processing mode',
                    default: 'add-missing',
                },
                maxConcurrency: {
                    type: 'number',
                    description: 'Maximum parallel file processing',
                    default: 5,
                },
            },
            required: ['files', 'language', 'style'],
        },
    },
];
/**
 * Main server instance
 */
const server = new Server({
    name: 'code-documentation-agent',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
/**
 * Handle tool list requests
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
});
/**
 * Handle tool execution requests
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case 'analyze_code':
                return await analyzeCodeTool(args);
            case 'generate_documentation':
                return await generateDocumentationTool(args);
            case 'update_comments':
                return await updateCommentsTool(args);
            case 'validate_documentation':
                return await validateDocumentationTool(args);
            case 'extract_interfaces':
                return await extractInterfacesTool(args);
            case 'batch_document':
                return await batchDocumentTool(args);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
            isError: true,
            content: [
                {
                    type: 'text',
                    text: `Error executing ${name}: ${errorMessage}`,
                },
            ],
        };
    }
});
/**
 * Start the MCP server
 */
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Code Documentation Agent MCP server running on stdio');
}
main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map