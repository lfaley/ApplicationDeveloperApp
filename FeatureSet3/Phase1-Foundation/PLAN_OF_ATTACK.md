# Phase 1: Foundation - Plan of Attack

**Phase**: 1 of 5  
**Name**: Foundation  
**Duration**: ~15 hours  
**Priority**: CRITICAL  
**Status**: 🔴 Not Started  
**Dependencies**: None (Entry point)

---

## 🎯 Phase Overview

Phase 1 establishes the foundational capabilities that unlock multi-agent coordination and workspace-level operations. This phase is critical because all subsequent phases depend on these core capabilities.

### Primary Objectives
1. **Multi-Agent Orchestration**: Create a coordination system that allows multiple agents to work together seamlessly
2. **Batch Operations**: Enable all existing agents to process entire workspaces instead of single files

### Strategic Importance
- **10x Productivity**: Users can coordinate 3+ agents with a single command
- **Workspace-Scale Analysis**: Process entire projects in minutes, not hours
- **Foundation for Intelligence**: Orchestration enables sophisticated workflows in Phase 2+

### Success Criteria
- [ ] Orchestration agent deployed with 4 patterns working
- [ ] All 3 existing agents enhanced with batch operations
- [ ] 85+ new tests, all passing (100%)
- [ ] Zero regressions in existing functionality
- [ ] Documentation complete with real-world examples

---

## 📋 Feature 1: Multi-Agent Orchestration System

### Overview
Create a new MCP agent that coordinates the existing Code Documentation, Code Review, and Test Generator agents using proven orchestration patterns from Microsoft's Agent Framework.

### Business Value
- **Time Savings**: 2-3 hours/week per developer
- **Workflow Automation**: One command instead of 3+ manual steps
- **Consistency**: Standardized multi-agent workflows
- **Flexibility**: 4 patterns cover 90% of use cases

---

### Task 1.1: Planning & Design (2 hours)

#### Pre-Implementation Checklist
- [ ] Read this entire plan of attack
- [ ] Review `ORCHESTRATION_DESIGN.md` (to be created)
- [ ] Study Microsoft Agent Framework orchestration patterns
- [ ] Review existing agent APIs (READMEs)
- [ ] Verify baseline: Run `npm test` in all 3 agent directories (must be 100%)
- [ ] Create feature branch: `git checkout -b feature/orchestration-agent`

#### Design Decisions

**1. Orchestration Patterns to Implement**

Microsoft recommends 5 patterns; we'll implement 4 most valuable:

| Pattern | Description | Use Case | Priority |
|---------|-------------|----------|----------|
| **Sequential** | Pass output from Agent A → Agent B → Agent C in order | Document → Review → Test workflow | HIGH |
| **Concurrent** | Run all agents in parallel, collect results independently | Multi-perspective analysis | HIGH |
| **Handoff** | Dynamically route to agents based on context | Smart routing, escalation | MEDIUM |
| **Group Chat** | Manager coordinates agents in collaborative conversation | Iterative refinement, consensus | MEDIUM |

*Skip for now: Magentic (too complex for initial release)*

**2. Architecture Design**

```typescript
// Core structure
orchestration-agent/
├── src/
│   ├── types.ts              // Type definitions for patterns
│   ├── registry.ts           // Agent registry (discover available agents)
│   ├── patterns/
│   │   ├── sequential.ts     // Sequential orchestration
│   │   ├── concurrent.ts     // Concurrent orchestration
│   │   ├── handoff.ts        // Handoff orchestration
│   │   └── group-chat.ts     // Group chat orchestration
│   ├── tools/
│   │   ├── orchestrate.ts    // Main orchestration tool
│   │   ├── list-patterns.ts  // List available patterns
│   │   └── pattern-info.ts   // Get pattern details
│   └── index.ts              // MCP server entry point
├── tests/
│   ├── sequential.test.ts    // Sequential pattern tests
│   ├── concurrent.test.ts    // Concurrent pattern tests
│   ├── handoff.test.ts       // Handoff pattern tests
│   ├── group-chat.test.ts    // Group chat pattern tests
│   └── integration.test.ts   // End-to-end workflow tests
├── package.json
├── tsconfig.json
├── jest.config.cjs
├── README.md
├── CONTRIBUTING.md
└── .gitignore
```

**3. Tool Interface Design**

```typescript
// orchestrate_workflow tool
interface OrchestrationRequest {
  pattern: 'sequential' | 'concurrent' | 'handoff' | 'group-chat';
  agents: AgentConfig[];
  input: any;
  options?: {
    timeout?: number;           // Max execution time (default: 300s)
    continueOnError?: boolean;  // Continue if agent fails (default: false)
    collectMetrics?: boolean;   // Collect performance metrics (default: true)
  };
}

interface AgentConfig {
  agentId: 'code-documentation' | 'code-review' | 'test-generator';
  tool: string;                 // Tool name within agent
  parameters?: Record<string, any>;
}

interface OrchestrationResult {
  success: boolean;
  pattern: string;
  results: AgentResult[];       // Results from each agent
  metrics?: {
    totalDuration: number;
    agentDurations: Record<string, number>;
    tokensUsed?: number;
  };
  errors?: Array<{
    agentId: string;
    error: string;
  }>;
}
```

**4. Key Design Principles**

✅ **DO**:
- Keep orchestration logic simple and testable
- Use existing agent MCP tools (no direct imports)
- Provide detailed error messages for debugging
- Track performance metrics for optimization
- Support timeout controls for long-running workflows
- Follow existing TypeScript strict mode patterns

❌ **DON'T**:
- Create tight coupling between agents
- Implement complex AI decision-making (keep deterministic where possible)
- Bypass agent validation layers
- Store state between orchestration calls (stateless design)

#### Deliverables
- [ ] `ORCHESTRATION_DESIGN.md` document completed
- [ ] Architecture diagrams created (use Mermaid or draw.io)
- [ ] API contract defined and reviewed
- [ ] Design review checklist completed

---

### Task 1.2: Project Setup (1 hour)

#### Steps

1. **Create Project Structure**
```powershell
cd c:\Users\faley\Desktop\Code\Repos\ProjectPlanner\MCP-SERVER
mkdir orchestration-agent
cd orchestration-agent
```

2. **Initialize Package**
```powershell
# Create package.json
npm init -y

# Update package.json with proper configuration
```

**package.json** (use as template):
```json
{
  "name": "@projectplanner/orchestration-agent",
  "version": "1.0.0",
  "description": "Multi-agent orchestration system for MCP agents",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
    "test:watch": "npm run test -- --watch",
    "inspector": "npx @modelcontextprotocol/inspector node dist/index.js"
  },
  "keywords": ["mcp", "orchestration", "multi-agent", "coordination"],
  "author": "lfaley",
  "license": "MIT",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.4",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "@types/node": "^20.0.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.0",
    "typescript": "^5.6.3"
  }
}
```

3. **Install Dependencies**
```powershell
npm install
```

4. **Configure TypeScript**

Create **tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

5. **Configure Jest**

Create **jest.config.cjs**:
```javascript
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'ES2022',
          target: 'ES2022',
        },
      },
    ],
  },
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts'],
};
```

6. **Create .gitignore**

Create **.gitignore**:
```
node_modules/
dist/
*.log
.DS_Store
coverage/
.vscode/
.idea/
```

7. **Create Directory Structure**
```powershell
mkdir src\patterns
mkdir src\tools
mkdir tests
```

#### Deliverables
- [ ] Project initialized with all configuration files
- [ ] Dependencies installed successfully
- [ ] Directory structure created
- [ ] `npm run build` executes (even with empty src/)
- [ ] Git tracking configured

#### Verification
```powershell
# Should all succeed
npm run build  # (will fail until src files created, that's OK)
Test-Path package.json
Test-Path tsconfig.json
Test-Path jest.config.cjs
Test-Path .gitignore
```

---

### Task 1.3: Core Orchestration Engine (3 hours)

#### Sub-task 1.3.1: Type Definitions (30 minutes)

Create **src/types.ts**:

```typescript
/**
 * Orchestration pattern types and interfaces
 * 
 * Based on Microsoft Agent Framework orchestration patterns:
 * - Sequential: Chain agents in defined order
 * - Concurrent: Run agents in parallel
 * - Handoff: Dynamic agent selection
 * - Group Chat: Collaborative conversation
 */

import { z } from 'zod';

// ============================================================================
// Core Types
// ============================================================================

/**
 * Supported orchestration patterns
 */
export type OrchestrationPattern = 'sequential' | 'concurrent' | 'handoff' | 'group-chat';

/**
 * Available agent IDs in the system
 */
export type AgentId = 'code-documentation' | 'code-review' | 'test-generator';

/**
 * Agent execution result
 */
export interface AgentResult {
  agentId: AgentId;
  tool: string;
  success: boolean;
  output?: any;
  error?: string;
  duration: number;  // milliseconds
  timestamp: Date;
}

/**
 * Configuration for a single agent in orchestration
 */
export interface AgentConfig {
  agentId: AgentId;
  tool: string;
  parameters?: Record<string, any>;
}

/**
 * Orchestration execution options
 */
export interface OrchestrationOptions {
  timeout?: number;           // Max execution time in seconds (default: 300)
  continueOnError?: boolean;  // Continue if agent fails (default: false)
  collectMetrics?: boolean;   // Collect performance metrics (default: true)
}

/**
 * Complete orchestration request
 */
export interface OrchestrationRequest {
  pattern: OrchestrationPattern;
  agents: AgentConfig[];
  input: any;
  options?: OrchestrationOptions;
}

/**
 * Performance metrics for orchestration
 */
export interface OrchestrationMetrics {
  totalDuration: number;           // Total time in ms
  agentDurations: Record<string, number>;  // Time per agent
  patternOverhead: number;         // Orchestration overhead
  parallelismGain?: number;        // Time saved by parallelism (concurrent only)
}

/**
 * Complete orchestration result
 */
export interface OrchestrationResult {
  success: boolean;
  pattern: OrchestrationPattern;
  results: AgentResult[];
  metrics?: OrchestrationMetrics;
  errors?: Array<{
    agentId: AgentId;
    error: string;
    timestamp: Date;
  }>;
  summary: string;  // Human-readable summary
}

// ============================================================================
// Zod Validation Schemas
// ============================================================================

/**
 * Agent ID validation schema
 */
export const AgentIdSchema = z.enum(['code-documentation', 'code-review', 'test-generator']);

/**
 * Agent configuration validation schema
 */
export const AgentConfigSchema = z.object({
  agentId: AgentIdSchema,
  tool: z.string().min(1, 'Tool name cannot be empty'),
  parameters: z.record(z.any()).optional(),
});

/**
 * Orchestration options validation schema
 */
export const OrchestrationOptionsSchema = z.object({
  timeout: z.number().int().min(1).max(3600).optional(),  // 1s to 1 hour
  continueOnError: z.boolean().optional(),
  collectMetrics: z.boolean().optional(),
});

/**
 * Orchestration request validation schema
 */
export const OrchestrationRequestSchema = z.object({
  pattern: z.enum(['sequential', 'concurrent', 'handoff', 'group-chat']),
  agents: z.array(AgentConfigSchema).min(1, 'At least one agent required'),
  input: z.any(),
  options: OrchestrationOptionsSchema.optional(),
});

// ============================================================================
// Pattern-Specific Types
// ============================================================================

/**
 * Handoff routing rule
 */
export interface HandoffRule {
  condition: (input: any, previousResults: AgentResult[]) => boolean;
  targetAgent: AgentId;
  description: string;
}

/**
 * Group chat manager configuration
 */
export interface GroupChatManager {
  maxRounds: number;           // Max conversation rounds (default: 5)
  terminationCondition?: (results: AgentResult[]) => boolean;
  speakerSelection: 'round-robin' | 'manager-decides';
}

/**
 * Orchestration pattern interface
 * All patterns must implement this interface
 */
export interface IOrchestrationPattern {
  execute(request: OrchestrationRequest): Promise<OrchestrationResult>;
  getName(): string;
  getDescription(): string;
}
```

**Code Comments Requirements**:
- ✅ All interfaces have JSDoc comments
- ✅ Complex types explained
- ✅ Zod schemas documented
- ✅ References to Microsoft patterns included

#### Sub-task 1.3.2: Agent Registry (30 minutes)

Create **src/registry.ts**:

```typescript
/**
 * Agent Registry
 * 
 * Maintains a registry of available MCP agents and their capabilities.
 * Used by orchestration patterns to discover and invoke agent tools.
 * 
 * @module registry
 */

import { AgentId } from './types.js';

/**
 * Agent metadata stored in registry
 */
export interface AgentMetadata {
  id: AgentId;
  name: string;
  description: string;
  tools: ToolMetadata[];
  serverPath: string;  // Path to compiled MCP server
}

/**
 * Tool metadata for each agent
 */
export interface ToolMetadata {
  name: string;
  description: string;
  inputSchema?: Record<string, any>;
  exampleUsage?: string;
}

/**
 * Agent Registry
 * 
 * Singleton registry of all available MCP agents.
 * Provides discovery and metadata lookup.
 */
class AgentRegistry {
  private agents: Map<AgentId, AgentMetadata> = new Map();

  constructor() {
    this.initializeAgents();
  }

  /**
   * Initialize registry with known agents
   * 
   * In production, this could read from configuration file
   * or discover agents dynamically via MCP protocol.
   */
  private initializeAgents(): void {
    // Code Documentation Agent
    this.agents.set('code-documentation', {
      id: 'code-documentation',
      name: 'Code Documentation Agent',
      description: 'Analyzes code and generates comprehensive documentation',
      serverPath: 'c:\\Users\\faley\\Desktop\\Code\\Repos\\ProjectPlanner\\MCP-SERVER\\code-documentation-agent\\dist\\index.js',
      tools: [
        {
          name: 'analyze_code',
          description: 'Parse source code and extract structure',
          exampleUsage: 'Analyze TypeScript function to extract parameters and return type',
        },
        {
          name: 'generate_documentation',
          description: 'Generate formatted documentation',
          exampleUsage: 'Create JSDoc comments for extracted functions',
        },
        {
          name: 'analyze_and_generate',
          description: 'Combined analysis and generation',
          exampleUsage: 'One-step documentation generation',
        },
        {
          name: 'calculate_coverage',
          description: 'Calculate documentation coverage percentage',
          exampleUsage: 'Measure how much code is documented',
        },
        {
          name: 'batch_process',
          description: 'Process multiple files at once',
          exampleUsage: 'Generate docs for entire module',
        },
        {
          name: 'suggest_improvements',
          description: 'Recommend documentation improvements',
          exampleUsage: 'Identify missing or incomplete documentation',
        },
      ],
    });

    // Code Review Agent
    this.agents.set('code-review', {
      id: 'code-review',
      name: 'Code Review Agent',
      description: 'Reviews code for quality, security, and performance issues',
      serverPath: 'c:\\Users\\faley\\Desktop\\Code\\Repos\\ProjectPlanner\\MCP-SERVER\\code-review-agent\\dist\\index.js',
      tools: [
        {
          name: 'review_code',
          description: 'Comprehensive code review',
          exampleUsage: 'Review for quality, security, and performance',
        },
        {
          name: 'quick_review',
          description: 'Fast review (high+ severity only)',
          exampleUsage: 'Quick scan for critical issues',
        },
        {
          name: 'security_review',
          description: 'Security-focused analysis',
          exampleUsage: 'Scan for vulnerabilities and secrets',
        },
      ],
    });

    // Test Generator Agent
    this.agents.set('test-generator', {
      id: 'test-generator',
      name: 'Test Generator Agent',
      description: 'Automatically generates unit tests from source code',
      serverPath: 'c:\\Users\\faley\\Desktop\\Code\\Repos\\ProjectPlanner\\MCP-SERVER\\test-generator-agent\\dist\\index.js',
      tools: [
        {
          name: 'generate_tests',
          description: 'Generate comprehensive test suite',
          exampleUsage: 'Create Jest tests with edge cases',
        },
        {
          name: 'analyze_testability',
          description: 'Analyze code testability',
          exampleUsage: 'Identify hard-to-test code patterns',
        },
        {
          name: 'quick_generate',
          description: 'Rapid test generation',
          exampleUsage: 'Generate basic tests with defaults',
        },
      ],
    });
  }

  /**
   * Get agent metadata by ID
   * 
   * @param agentId - Agent identifier
   * @returns Agent metadata or undefined if not found
   */
  getAgent(agentId: AgentId): AgentMetadata | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Get all registered agents
   * 
   * @returns Array of all agent metadata
   */
  getAllAgents(): AgentMetadata[] {
    return Array.from(this.agents.values());
  }

  /**
   * Check if agent exists
   * 
   * @param agentId - Agent identifier
   * @returns True if agent is registered
   */
  hasAgent(agentId: AgentId): boolean {
    return this.agents.has(agentId);
  }

  /**
   * Get tool metadata for specific agent
   * 
   * @param agentId - Agent identifier
   * @param toolName - Tool name
   * @returns Tool metadata or undefined if not found
   */
  getTool(agentId: AgentId, toolName: string): ToolMetadata | undefined {
    const agent = this.agents.get(agentId);
    return agent?.tools.find(tool => tool.name === toolName);
  }
}

// Export singleton instance
export const agentRegistry = new AgentRegistry();
```

**Code Comments**:
- ✅ All classes and methods have JSDoc
- ✅ Registry pattern explained
- ✅ Future extensibility noted

#### Sub-task 1.3.3: Sequential Pattern (45 minutes)

Create **src/patterns/sequential.ts**:

```typescript
/**
 * Sequential Orchestration Pattern
 * 
 * Passes the result from one agent to the next in a defined order.
 * Agent A → Agent B → Agent C (output of A becomes input of B, etc.)
 * 
 * Use cases:
 * - Document → Review → Test Generation pipeline
 * - Step-by-step workflows
 * - Multi-stage processing where each stage depends on previous
 * 
 * Based on Microsoft Agent Framework Sequential pattern:
 * https://learn.microsoft.com/en-us/agent-framework/user-guide/workflows/orchestrations/sequential
 * 
 * @module patterns/sequential
 */

import {
  IOrchestrationPattern,
  OrchestrationRequest,
  OrchestrationResult,
  AgentResult,
  OrchestrationMetrics,
} from '../types.js';
import { agentRegistry } from '../registry.js';

/**
 * Sequential Orchestration Pattern Implementation
 * 
 * Executes agents in order, passing output from each agent as input to the next.
 * Stops on first error unless continueOnError is true.
 */
export class SequentialPattern implements IOrchestrationPattern {
  /**
   * Execute sequential orchestration
   * 
   * @param request - Orchestration request with agents in desired order
   * @returns Orchestration result with all agent outputs
   */
  async execute(request: OrchestrationRequest): Promise<OrchestrationResult> {
    const startTime = Date.now();
    const results: AgentResult[] = [];
    const errors: Array<{ agentId: any; error: string; timestamp: Date }> = [];
    const agentDurations: Record<string, number> = {};

    // Validate all agents exist before starting
    for (const agentConfig of request.agents) {
      if (!agentRegistry.hasAgent(agentConfig.agentId)) {
        throw new Error(`Agent not found: ${agentConfig.agentId}`);
      }
    }

    // Start with initial input
    let currentInput = request.input;

    // Execute agents sequentially
    for (const agentConfig of request.agents) {
      const agentStartTime = Date.now();

      try {
        // Simulate agent execution
        // TODO: Replace with actual MCP tool invocation
        const result = await this.executeAgent(
          agentConfig.agentId,
          agentConfig.tool,
          currentInput,
          agentConfig.parameters
        );

        const duration = Date.now() - agentStartTime;
        agentDurations[agentConfig.agentId] = duration;

        const agentResult: AgentResult = {
          agentId: agentConfig.agentId,
          tool: agentConfig.tool,
          success: true,
          output: result,
          duration,
          timestamp: new Date(),
        };

        results.push(agentResult);

        // Output becomes input for next agent
        currentInput = result;

      } catch (error) {
        const duration = Date.now() - agentStartTime;
        agentDurations[agentConfig.agentId] = duration;

        const errorMessage = error instanceof Error ? error.message : String(error);

        errors.push({
          agentId: agentConfig.agentId,
          error: errorMessage,
          timestamp: new Date(),
        });

        const agentResult: AgentResult = {
          agentId: agentConfig.agentId,
          tool: agentConfig.tool,
          success: false,
          error: errorMessage,
          duration,
          timestamp: new Date(),
        };

        results.push(agentResult);

        // Stop on error unless continueOnError is true
        if (!request.options?.continueOnError) {
          break;
        }
      }
    }

    // Calculate metrics
    const totalDuration = Date.now() - startTime;
    const metrics: OrchestrationMetrics = {
      totalDuration,
      agentDurations,
      patternOverhead: totalDuration - Object.values(agentDurations).reduce((a, b) => a + b, 0),
    };

    // Generate summary
    const successCount = results.filter(r => r.success).length;
    const summary = `Sequential orchestration: ${successCount}/${results.length} agents succeeded in ${totalDuration}ms`;

    return {
      success: errors.length === 0,
      pattern: 'sequential',
      results,
      metrics: request.options?.collectMetrics !== false ? metrics : undefined,
      errors: errors.length > 0 ? errors : undefined,
      summary,
    };
  }

  /**
   * Execute a single agent tool
   * 
   * @param agentId - Agent identifier
   * @param tool - Tool name to invoke
   * @param input - Input data for tool
   * @param parameters - Additional parameters
   * @returns Tool output
   * 
   * TODO: Implement actual MCP tool invocation
   * Currently simulates execution for testing
   */
  private async executeAgent(
    agentId: string,
    tool: string,
    input: any,
    parameters?: Record<string, any>
  ): Promise<any> {
    // Simulate agent execution delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // TODO: Replace with actual MCP SDK tool invocation
    // Example:
    // const agent = agentRegistry.getAgent(agentId);
    // const client = new MCPClient(agent.serverPath);
    // return await client.callTool(tool, { ...parameters, input });

    // For now, return mock result
    return {
      agentId,
      tool,
      input,
      parameters,
      result: `Processed by ${agentId}.${tool}`,
    };
  }

  /**
   * Get pattern name
   */
  getName(): string {
    return 'sequential';
  }

  /**
   * Get pattern description
   */
  getDescription(): string {
    return 'Executes agents in defined order, passing output from each to the next';
  }
}
```

**Code Comments**:
- ✅ Pattern purpose and use cases documented
- ✅ Microsoft reference link included
- ✅ TODO markers for actual MCP integration
- ✅ All methods have JSDoc

#### Sub-task 1.3.4: Concurrent Pattern (45 minutes)

*Similar structure to Sequential pattern - implement broadcast to all agents in parallel, collect results*

Create **src/patterns/concurrent.ts** following same comment and structure standards.

#### Sub-task 1.3.5: Handoff Pattern (45 minutes)

*Implement dynamic routing based on conditions*

Create **src/patterns/handoff.ts** following same standards.

#### Sub-task 1.3.6: Group Chat Pattern (45 minutes)

*Implement manager-coordinated conversation*

Create **src/patterns/group-chat.ts** following same standards.

#### Deliverables
- [ ] `src/types.ts` complete with full JSDoc comments
- [ ] `src/registry.ts` complete with agent metadata
- [ ] All 4 pattern implementations complete:
  - [ ] `src/patterns/sequential.ts`
  - [ ] `src/patterns/concurrent.ts`
  - [ ] `src/patterns/handoff.ts`
  - [ ] `src/patterns/group-chat.ts`
- [ ] All code compiles: `npm run build` succeeds
- [ ] Code follows TypeScript strict mode

---

### Task 1.4: MCP Tools Implementation (2 hours)

*Implement the MCP server tools that expose orchestration to Claude*

#### Sub-task 1.4.1: Orchestrate Tool (1 hour)

Create **src/tools/orchestrate.ts**

#### Sub-task 1.4.2: Pattern Info Tools (1 hour)

Create **src/tools/list-patterns.ts** and **src/tools/pattern-info.ts**

#### Sub-task 1.4.3: MCP Server Entry Point (30 minutes)

Create **src/index.ts** - Main MCP server that registers all tools

#### Deliverables
- [ ] All tools implemented with Zod validation
- [ ] MCP server starts successfully
- [ ] Tools callable via MCP Inspector
- [ ] Error handling comprehensive

---

### Task 1.5: Testing (2 hours)

*Write comprehensive test suite*

#### Test Strategy
- Unit tests for each pattern (10 tests each = 40 tests)
- Integration tests for workflows (20 tests)
- Error scenario tests (15 tests)
- Edge case tests (10 tests)

**Total: 85+ tests**

#### Deliverables
- [ ] `tests/sequential.test.ts` (10+ tests)
- [ ] `tests/concurrent.test.ts` (10+ tests)
- [ ] `tests/handoff.test.ts` (10+ tests)
- [ ] `tests/group-chat.test.ts` (10+ tests)
- [ ] `tests/integration.test.ts` (20+ tests)
- [ ] `tests/errors.test.ts` (15+ tests)
- [ ] `tests/edge-cases.test.ts` (10+ tests)
- [ ] All tests passing: `npm test` shows 100%

---

### Task 1.6: Documentation (1 hour)

#### Create README.md

**Structure**:
- Overview and features
- Installation
- Quick start
- Tool reference (all 3 tools)
- Pattern guide (all 4 patterns)
- Real-world examples (5+ scenarios)
- Troubleshooting
- API reference

#### Create CONTRIBUTING.md

**Structure**:
- Development setup
- Code standards
- Testing requirements
- Adding new patterns
- PR process

#### Deliverables
- [ ] `README.md` complete (~600 lines)
- [ ] `CONTRIBUTING.md` complete (~400 lines)
- [ ] Examples tested and working

---

## 📋 Feature 2: Batch Operations Enhancement

### Overview
Add workspace-level batch processing to all 3 existing agents, enabling them to process entire directories instead of single files.

### Business Value
- **Time Savings**: Process 100 files in same time as 1 file
- **Consistency**: Uniform analysis across entire codebase
- **Progress Tracking**: See real-time progress (X of Y files)

---

### Task 2.1: Code Documentation Agent Batch Operations (1 hour)

#### Implementation

**New Tools**:
1. `analyze_workspace` - Analyze all code files in workspace
2. `batch_generate_docs` - Generate documentation for multiple files

**Specification**:
```typescript
// analyze_workspace tool
interface AnalyzeWorkspaceRequest {
  workspacePath: string;
  filePattern?: string;  // Glob pattern (default: **/*.{ts,js,py,java,cs})
  excludePattern?: string;  // Exclude pattern (default: **/node_modules/**)
  maxFiles?: number;  // Safety limit (default: 1000)
  includeHidden?: boolean;  // Include hidden files (default: false)
}

interface AnalyzeWorkspaceResult {
  totalFiles: number;
  analyzedFiles: number;
  skippedFiles: number;
  results: Array<{
    filePath: string;
    functions: number;
    classes: number;
    interfaces: number;
    coverage: number;  // Percentage
  }>;
  aggregateStats: {
    totalFunctions: number;
    totalClasses: number;
    averageCoverage: number;
  };
  duration: number;
}
```

#### Steps
1. Add new tools to `src/tools/` directory
2. Add Zod validation schemas
3. Implement file discovery (use glob patterns)
4. Add progress tracking
5. Write tests (15+ tests)
6. Update README with examples
7. Update CONTRIBUTING.md

#### Deliverables
- [ ] 2 new tools implemented
- [ ] 15+ tests added and passing
- [ ] README updated with batch examples
- [ ] Zero regressions (75 existing tests still pass)

---

### Task 2.2: Code Review Agent Batch Operations (1 hour)

*Similar structure - implement `review_workspace` and `batch_security_audit`*

#### Deliverables
- [ ] 2 new tools implemented
- [ ] 15+ tests added and passing
- [ ] README updated
- [ ] Zero regressions (150 existing tests still pass)

---

### Task 2.3: Test Generator Agent Batch Operations (1 hour)

*Implement `generate_project_tests` and `analyze_project_testability`*

#### Deliverables
- [ ] 2 new tools implemented
- [ ] 15+ tests added and passing
- [ ] README updated
- [ ] Zero regressions (98 existing tests still pass)

---

## 📋 Integration & Deployment

### Task 3.1: Integration Testing (1 hour)

#### Test Scenarios
1. Orchestration with real agents (not mocks)
2. Batch operation end-to-end workflows
3. Performance benchmarks
4. Error recovery scenarios

#### Deliverables
- [ ] Integration tests pass
- [ ] Performance acceptable (measure baseline vs. batch)
- [ ] Error handling verified

---

### Task 3.2: Deployment (30 minutes)

#### Steps
1. Build all agents: `npm run build`
2. Update Claude Desktop config with orchestration agent
3. Restart Claude Desktop
4. Test each tool manually
5. Verify all 4 agents show up in MCP list

#### Deliverables
- [ ] All builds successful
- [ ] Claude Desktop config updated
- [ ] All tools accessible in Claude
- [ ] Smoke tests pass

---

## ✅ Phase 1 Completion Checklist

### Code Quality
- [ ] All code compiles with 0 errors
- [ ] TypeScript strict mode enabled
- [ ] All code has comprehensive JSDoc comments
- [ ] No console.log statements in production code
- [ ] Error handling is consistent and comprehensive

### Testing
- [ ] 85+ new tests added
- [ ] All new tests passing (100%)
- [ ] All existing tests still passing (323/323)
- [ ] Test coverage >= 90% for new code
- [ ] Integration tests pass

### Documentation
- [ ] Orchestration agent README complete
- [ ] Orchestration agent CONTRIBUTING.md complete
- [ ] All 3 agent READMEs updated with batch examples
- [ ] ORCHESTRATION_DESIGN.md complete
- [ ] BATCH_OPERATIONS_SPEC.md complete
- [ ] IMPLEMENTATION_NOTES.md captures decisions

### Git & Version Control
- [ ] All code committed with conventional commit messages
- [ ] Feature branch merged to master (after approval)
- [ ] No merge conflicts
- [ ] .gitignore properly configured

### Deployment
- [ ] All agents build successfully
- [ ] Claude Desktop config updated
- [ ] All tools tested manually
- [ ] No regressions in existing functionality

### Master Checklist Update
- [ ] Update `FeatureSet3/MASTER_CHECKLIST.md` Phase 1 status
- [ ] Record actual time spent vs. estimate
- [ ] Document any deviations from plan
- [ ] Note lessons learned

---

## 📊 Success Metrics

### Quantitative
- **Lines of Code Added**: ~2,000 lines
- **Tests Added**: 85+ tests
- **Test Pass Rate**: 100%
- **Build Errors**: 0
- **Documentation**: ~1,500 lines added

### Qualitative
- Orchestration patterns working smoothly
- Batch operations provide significant time savings
- Documentation clear and comprehensive
- Code is maintainable and well-commented

---

## 🚨 Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| MCP tool invocation complexity | Start with mock execution, refine incrementally |
| Performance issues with batch operations | Add timeout controls, progress tracking, file limits |
| Breaking existing agents | Comprehensive regression testing, feature flags |
| Time overrun | Prioritize sequential pattern first, defer group-chat if needed |

---

## 📞 Support

**Questions?** Review:
- `ORCHESTRATION_DESIGN.md` for architecture details
- Microsoft Agent Framework documentation
- Existing agent code for patterns
- MASTER_CHECKLIST.md for coordination

---

**Last Updated**: November 18, 2025  
**Status**: Ready for Implementation  
**Next Step**: Begin Task 1.1 (Planning & Design)
