# Contributing to Orchestration Agent

Thank you for your interest in contributing to the Orchestration Agent! This document provides guidelines and instructions for contributing to this project.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Requirements](#testing-requirements)
- [Commit Conventions](#commit-conventions)
- [Pull Request Process](#pull-request-process)
- [Architecture Guidelines](#architecture-guidelines)
- [Adding New Features](#adding-new-features)
- [Debugging Tips](#debugging-tips)

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js 18+** installed
- **npm** or **yarn** package manager
- **Git** for version control
- **TypeScript** knowledge (strict mode experience preferred)
- **MCP Protocol** familiarity (helpful but not required)

### Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/ProjectPlanner.git
cd ProjectPlanner/MCP-SERVER/orchestration-agent

# Add upstream remote
git remote add upstream https://github.com/lfaley/ProjectPlanner.git

# Create a feature branch
git checkout -b feature/your-feature-name
```

---

## Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### 3. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- --testPathPattern=sequential

# Run with coverage
npm test -- --coverage
```

### 4. Development Workflow

```bash
# Make changes to TypeScript files in src/

# Rebuild
npm run build

# Run tests to verify
npm test

# Fix any TypeScript errors
npx tsc --noEmit
```

### 5. IDE Setup

**Recommended: VS Code**

Install these extensions:
- **ESLint** (if configured)
- **Prettier** (optional, for formatting)
- **Jest** (for test running)
- **TypeScript and JavaScript Language Features** (built-in)

**VS Code Settings** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## Project Structure

Understanding the codebase structure:

```
orchestration-agent/
├── src/
│   ├── index.ts              # MCP server entry point
│   │                         # - Registers MCP tools
│   │                         # - Exports server instance
│   │
│   ├── types.ts              # TypeScript type definitions
│   │                         # - All interfaces and types
│   │                         # - Zod validation schemas
│   │                         # - JSDoc comments
│   │
│   ├── registry.ts           # Agent registry
│   │                         # - Register/unregister agents
│   │                         # - Validate agent-tool pairs
│   │                         # - Query available agents
│   │
│   ├── tools.ts              # MCP tool implementations
│   │                         # - orchestrate_workflow
│   │                         # - list_patterns
│   │                         # - get_pattern_info
│   │                         # - list_available_agents
│   │                         # - validate_workflow
│   │
│   └── patterns/
│       ├── sequential.ts     # Sequential execution pattern
│       ├── concurrent.ts     # Parallel execution pattern
│       ├── handoff.ts        # Dynamic routing pattern
│       └── group-chat.ts     # Multi-round discussion pattern
│
├── tests/
│   ├── sequential.test.ts    # Sequential pattern tests
│   ├── concurrent.test.ts    # Concurrent pattern tests
│   ├── handoff.test.ts       # Handoff pattern tests
│   ├── group-chat.test.ts    # Group chat pattern tests
│   └── tools.test.ts         # MCP tools tests
│
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── jest.config.cjs           # Jest testing configuration
├── README.md                 # User documentation
└── CONTRIBUTING.md           # This file
```

### Key Files to Understand

**Start here**:
1. `types.ts` - All data structures
2. `sequential.ts` - Simplest pattern implementation
3. `tools.ts` - How patterns are exposed
4. `sequential.test.ts` - How to test patterns

**Then review**:
5. `concurrent.ts` - Parallel execution logic
6. `handoff.ts` - Dynamic routing
7. `group-chat.ts` - Multi-round execution

**Finally**:
8. `registry.ts` - Agent management
9. `index.ts` - MCP server setup

---

## Code Style Guidelines

### TypeScript Standards

#### Strict Mode

This project uses **TypeScript strict mode**. All code must:
- Have explicit types (no implicit `any`)
- Use `unknown` instead of `any` when flexibility needed
- Handle `null` and `undefined` properly
- Use strict function types

```typescript
// ✅ Good
function processResult(result: AgentResult | undefined): void {
  if (!result) return;
  console.log(result.agentId);
}

// ❌ Bad
function processResult(result: any): void {
  console.log(result.agentId);
}
```

#### Type Definitions

- Define types in `types.ts`
- Use interfaces for object shapes
- Use type aliases for unions and primitives
- Export all public types

```typescript
// ✅ Good
export interface AgentConfig {
  agentId: string;
  toolName: string;
  args: Record<string, unknown>;
}

export type AgentStatus = 'pending' | 'running' | 'completed' | 'failed';

// ❌ Bad
export const AgentConfig = { ... }; // Not a type
```

#### ESM Imports

This project uses **ES Modules (ESM)**. All imports must:
- Include `.js` extension (even for TypeScript files)
- Use ES6 import/export syntax
- No CommonJS `require()`

```typescript
// ✅ Good
import { OrchestrationRequest } from './types.js';
import type { AgentResult } from './types.js';

// ❌ Bad
import { OrchestrationRequest } from './types'; // Missing .js
const { AgentResult } = require('./types'); // CommonJS
```

### Documentation Standards

#### JSDoc Comments

All public APIs must have JSDoc comments:

```typescript
/**
 * Execute agents in sequential order
 * 
 * @param request - Orchestration request with sequential pattern
 * @returns Promise resolving to orchestration result
 * @throws {Error} If validation fails or execution errors occur
 * 
 * @example
 * ```typescript
 * const result = await executeSequential({
 *   pattern: 'sequential',
 *   agents: [...]
 * });
 * ```
 */
export async function executeSequential(
  request: OrchestrationRequest
): Promise<OrchestrationResult> {
  // Implementation
}
```

#### Inline Comments

Use inline comments for complex logic:

```typescript
// Check if agent should execute based on dependencies
if (config.dependsOn) {
  const dependency = results.find(r => r.agentId === config.dependsOn);
  
  // Skip if dependency failed and requiresSuccess is true
  if (dependency?.status === 'failed' && config.requiresSuccess !== false) {
    return skipAgent(config.agentId);
  }
}
```

### Naming Conventions

#### Variables and Functions

- Use `camelCase` for variables and functions
- Use descriptive names (no single letters except loop indices)
- Boolean variables should be questions: `isValid`, `hasError`, `canExecute`

```typescript
// ✅ Good
const agentResult = await executeAgent(config);
const isValid = validateConfig(request);
const hasErrors = errors.length > 0;

// ❌ Bad
const ar = await executeAgent(config);
const valid = validateConfig(request);
const errors_exist = errors.length > 0;
```

#### Classes and Interfaces

- Use `PascalCase` for classes and interfaces
- Interfaces don't need `I` prefix
- Patterns end with `Pattern` suffix

```typescript
// ✅ Good
interface AgentConfig { ... }
class SequentialPattern implements OrchestrationPattern { ... }

// ❌ Bad
interface IAgentConfig { ... }
class Sequential { ... }
```

#### Constants

- Use `UPPER_SNAKE_CASE` for true constants
- Use `camelCase` for configuration objects

```typescript
// ✅ Good
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT = 30000;
const defaultConfig = { passResults: true };

// ❌ Bad
const max_retry_attempts = 3;
const DefaultConfig = { passResults: true };
```

### Error Handling

#### Always Use Try-Catch for Async

```typescript
// ✅ Good
async function executeAgent(config: AgentConfig): Promise<AgentResult> {
  try {
    const output = await simulateAgentExecution(config);
    return createSuccessResult(config.agentId, output);
  } catch (error) {
    return createErrorResult(config.agentId, error as Error);
  }
}

// ❌ Bad
async function executeAgent(config: AgentConfig): Promise<AgentResult> {
  const output = await simulateAgentExecution(config); // Unhandled rejection
  return createSuccessResult(config.agentId, output);
}
```

#### Descriptive Error Messages

```typescript
// ✅ Good
throw new Error(
  `Agent '${agentId}' not found in registry. ` +
  `Available agents: ${availableAgents.join(', ')}`
);

// ❌ Bad
throw new Error('Agent not found');
```

---

## Testing Requirements

### Test Coverage Standards

- **All new features** must have tests
- **All bug fixes** must have regression tests
- Aim for **comprehensive coverage**, not just high percentage
- Test both success and failure cases

### Test Structure

Use this structure for all test files:

```typescript
import { describe, it, expect, beforeEach } from '@jest/globals';
import { SequentialPattern } from '../src/patterns/sequential.js';
import type { OrchestrationRequest } from '../src/types.js';

describe('SequentialPattern', () => {
  let pattern: SequentialPattern;

  beforeEach(() => {
    pattern = new SequentialPattern();
  });

  describe('execute', () => {
    it('should execute agents in order', async () => {
      const request: OrchestrationRequest = {
        pattern: 'sequential',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: {} },
          { agentId: 'agent2', toolName: 'tool2', args: {} },
        ],
      };

      const result = await pattern.execute(request);

      expect(result.status).toBe('completed');
      expect(result.agentResults).toHaveLength(2);
      expect(result.agentResults[0].agentId).toBe('agent1');
      expect(result.agentResults[1].agentId).toBe('agent2');
    });

    it('should handle agent failures', async () => {
      const request: OrchestrationRequest = {
        pattern: 'sequential',
        agents: [
          { agentId: 'agent1', toolName: 'tool1', args: { shouldFail: true } },
        ],
      };

      const result = await pattern.execute(request);

      expect(result.status).toBe('failed');
      expect(result.agentResults[0].status).toBe('failed');
      expect(result.agentResults[0].error).toBeDefined();
    });
  });

  describe('validate', () => {
    it('should validate valid request', () => {
      const request: OrchestrationRequest = {
        pattern: 'sequential',
        agents: [{ agentId: 'agent1', toolName: 'tool1', args: {} }],
      };

      const validation = pattern.validate(request);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toBeUndefined();
    });

    it('should reject empty agents array', () => {
      const request: OrchestrationRequest = {
        pattern: 'sequential',
        agents: [],
      };

      const validation = pattern.validate(request);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('At least one agent required');
    });
  });
});
```

### Test Categories

Your tests should cover:

1. **Happy Path**: Normal successful execution
2. **Error Cases**: Failures, timeouts, invalid input
3. **Edge Cases**: Empty arrays, boundary values
4. **Integration**: Multiple components working together
5. **Performance**: Timing and duration validation

### Running Tests

```bash
# Run all tests before committing
npm test

# Verify specific functionality
npm test -- --testPathPattern=sequential

# Check test coverage
npm test -- --coverage
```

### Test Simulation

Currently, agents use `simulateAgentExecution()`. When testing:
- Use `args.shouldFail = true` to simulate failures
- Use `args.delay` to simulate timeouts (future)
- Check `metadata.duration` for timing validation

---

## Commit Conventions

### Commit Message Format

Use **Conventional Commits** format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type

Must be one of:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring (no feature change)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, tooling

#### Scope

Optional, but recommended:

- `sequential`: Sequential pattern
- `concurrent`: Concurrent pattern
- `handoff`: Handoff pattern
- `group-chat`: Group chat pattern
- `tools`: MCP tools
- `registry`: Agent registry
- `types`: Type definitions
- `tests`: Test suite

#### Examples

```bash
# Good commit messages
git commit -m "feat(sequential): add conditional execution support"
git commit -m "fix(concurrent): correct race condition in parallel execution"
git commit -m "docs: add troubleshooting section to README"
git commit -m "test(handoff): add tests for loop prevention"
git commit -m "refactor(tools): simplify pattern registry lookup"

# Bad commit messages
git commit -m "fixed bug"
git commit -m "update"
git commit -m "WIP"
```

#### Detailed Commit Body

For complex changes, add a body:

```
feat(handoff): implement dynamic routing based on agent output

- Add handoffTo directive support in agent output
- Implement loop prevention (max 10 iterations)
- Add context passing between handoff agents
- Update tests with handoff scenarios

Closes #123
```

---

## Pull Request Process

### Before Submitting PR

1. **Run Tests**: Ensure all tests pass
   ```bash
   npm test
   ```

2. **Run Build**: Verify no TypeScript errors
   ```bash
   npm run build
   ```

3. **Check Types**: Verify strict type checking
   ```bash
   npx tsc --noEmit
   ```

4. **Update Documentation**: If adding features, update README.md

5. **Add Tests**: Ensure new code has test coverage

### PR Template

Use this template for your PR description:

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Changes Made
- Detailed list of changes
- Each change on its own line

## Testing
- Description of tests added/updated
- How to verify the changes work

## Checklist
- [ ] Tests pass locally (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Code follows project style guidelines
- [ ] Added/updated tests for changes
- [ ] Updated documentation (if needed)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
```

### PR Review Process

1. **Submit PR** to `feature/orchestration-agent` branch
2. **Automated Checks** run (tests, build)
3. **Code Review** by maintainers
4. **Address Feedback** if requested
5. **Approval** by at least one maintainer
6. **Merge** by maintainer

### PR Guidelines

- **One feature per PR**: Keep PRs focused
- **Small PRs**: Easier to review (<500 lines ideal)
- **Clear description**: Explain what and why
- **Link issues**: Reference related issues
- **Be responsive**: Address review comments promptly

---

## Architecture Guidelines

### Adding New Patterns

To add a new orchestration pattern:

#### 1. Define Pattern Interface

In `src/types.ts`:
```typescript
export type OrchestrationPatternType = 
  | 'sequential'
  | 'concurrent'
  | 'handoff'
  | 'group-chat'
  | 'your-new-pattern'; // Add here
```

#### 2. Implement Pattern Class

Create `src/patterns/your-pattern.ts`:
```typescript
import type { 
  OrchestrationPattern,
  OrchestrationRequest,
  OrchestrationResult,
  ValidationResult 
} from '../types.js';

export class YourPattern implements OrchestrationPattern {
  readonly type = 'your-new-pattern';
  readonly name = 'Your Pattern Name';
  readonly description = 'Description of what it does';

  async execute(request: OrchestrationRequest): Promise<OrchestrationResult> {
    // Implementation
  }

  validate(request: OrchestrationRequest): ValidationResult {
    // Validation logic
  }
}
```

#### 3. Register Pattern

In `src/tools.ts`:
```typescript
import { YourPattern } from './patterns/your-pattern.js';

const patterns = new Map<string, OrchestrationPattern>([
  ['sequential', new SequentialPattern()],
  ['concurrent', new ConcurrentPattern()],
  ['handoff', new HandoffPattern()],
  ['group-chat', new GroupChatPattern()],
  ['your-new-pattern', new YourPattern()], // Add here
]);
```

#### 4. Add Pattern Info

In `src/tools.ts`, add to `listPatterns()` and `getPatternInfo()`:
```typescript
{
  type: 'your-new-pattern',
  name: 'Your Pattern Name',
  description: 'What it does',
  capabilities: [
    'Feature 1',
    'Feature 2',
  ],
}
```

#### 5. Write Tests

Create `tests/your-pattern.test.ts`:
```typescript
import { YourPattern } from '../src/patterns/your-pattern.js';

describe('YourPattern', () => {
  // Tests here
});
```

#### 6. Update Documentation

Add pattern section to `README.md` with:
- Purpose and when to use
- Features
- Configuration options
- Complete example
- Best practices

### Adding New Tools

To add a new MCP tool:

#### 1. Implement Tool Function

In `src/tools.ts`:
```typescript
export async function yourNewTool(
  input: YourInputType
): Promise<YourOutputType> {
  // Implementation
}
```

#### 2. Define Input/Output Schemas

In `src/types.ts`:
```typescript
export const YourInputSchema = z.object({
  // Schema definition
});

export type YourInputType = z.infer<typeof YourInputSchema>;
```

#### 3. Register Tool

In `src/index.ts`:
```typescript
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // ... existing tools
    {
      name: 'your_new_tool',
      description: 'What your tool does',
      inputSchema: zodToJsonSchema(YourInputSchema),
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'your_new_tool') {
    const result = await yourNewTool(request.params.arguments);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
  // ... other tools
});
```

#### 4. Add Tests

In `tests/tools.test.ts`:
```typescript
describe('yourNewTool', () => {
  it('should handle valid input', async () => {
    // Test implementation
  });
});
```

#### 5. Document Tool

Add tool documentation to `README.md` MCP Tools Reference section.

---

## Adding New Features

### Feature Development Workflow

1. **Discuss First**: Open an issue to discuss the feature
2. **Create Branch**: `git checkout -b feature/your-feature`
3. **Implement**: Write code following style guidelines
4. **Add Tests**: Comprehensive test coverage
5. **Update Docs**: README and inline comments
6. **Submit PR**: Follow PR process above

### Feature Checklist

- [ ] Feature implemented and working
- [ ] Tests added (unit + integration)
- [ ] Documentation updated
- [ ] Types defined (if new data structures)
- [ ] Error handling implemented
- [ ] Performance considered
- [ ] Backward compatibility maintained (or breaking change noted)

---

## Debugging Tips

### Common Issues

#### TypeScript Errors

```bash
# Check for type errors
npx tsc --noEmit

# Common fixes:
# - Add .js extension to imports
# - Ensure types are exported
# - Check for missing return types
```

#### Test Failures

```bash
# Run specific test
npm test -- --testPathPattern=sequential

# Run with verbose output
npm test -- --verbose

# Debug with Node
node --inspect-brk node_modules/.bin/jest --runInBand
```

#### Build Errors

```bash
# Clean and rebuild
rm -rf dist
npm run build

# Check tsconfig.json settings
# Verify all imports have .js extensions
```

### Debugging Patterns

Add console logs in patterns:
```typescript
async execute(request: OrchestrationRequest): Promise<OrchestrationResult> {
  console.log('[DEBUG] Starting execution:', request.pattern);
  console.log('[DEBUG] Agent count:', request.agents.length);
  
  // ... execution logic
  
  console.log('[DEBUG] Completed:', result.status);
  return result;
}
```

Use debugger in VS Code:
1. Add breakpoint in code
2. Run "Debug Jest Tests" configuration
3. Step through execution

---

## Code Review Checklist

Before requesting review, verify:

### Functionality
- [ ] Code works as intended
- [ ] All tests pass
- [ ] No regressions introduced
- [ ] Error cases handled

### Code Quality
- [ ] Follows TypeScript strict mode
- [ ] No `any` types (use `unknown` if needed)
- [ ] Descriptive variable/function names
- [ ] No dead code or commented-out sections
- [ ] DRY principle followed

### Documentation
- [ ] JSDoc comments on public APIs
- [ ] Inline comments for complex logic
- [ ] README updated (if needed)
- [ ] Types documented

### Testing
- [ ] Tests for new features
- [ ] Tests for bug fixes
- [ ] Edge cases covered
- [ ] All tests passing

### Performance
- [ ] No obvious performance issues
- [ ] Async operations handled efficiently
- [ ] No blocking operations

---

## Release Process

**Note**: This section is for maintainers.

### Version Bumping

```bash
# Patch release (bug fixes)
npm version patch

# Minor release (new features)
npm version minor

# Major release (breaking changes)
npm version major
```

### Release Checklist

- [ ] All tests passing
- [ ] Documentation up to date
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Git tag created
- [ ] PR merged to main branch
- [ ] Release notes published

---

## Getting Help

### Resources

- **README.md**: User-facing documentation
- **Inline Comments**: Code-level documentation
- **Test Files**: Usage examples
- **HANDOFF.md**: Project context and architecture

### Communication

- **Questions**: Open a GitHub Discussion
- **Bugs**: Open a GitHub Issue
- **Features**: Open an Issue with proposal
- **Security**: Email maintainers directly

---

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

---

## Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort! 🎉

---

**Happy Coding! 🚀**
