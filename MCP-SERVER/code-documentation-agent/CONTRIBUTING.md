# Contributing to Code Documentation Agent

Thank you for your interest in contributing to the Code Documentation Agent! This document provides guidelines for contributing code, reporting issues, and submitting pull requests.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Change Control Protocol](#change-control-protocol)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Adding New Features](#adding-new-features)
- [Reporting Bugs](#reporting-bugs)

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful and collaborative environment. We expect:

- **Respectful Communication**: Treat all contributors with respect
- **Constructive Feedback**: Provide helpful, actionable feedback
- **Collaboration**: Work together to improve the codebase
- **Quality Focus**: Prioritize code quality and maintainability

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Git
- TypeScript knowledge
- Familiarity with MCP (Model Context Protocol)

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/lfaley/ProjectPlanner.git
cd ProjectPlanner/MCP-SERVER/code-documentation-agent

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Start in watch mode for development
npm run dev
```

### Verify Your Setup

```bash
# All tests should pass
npm test
# Expected: 75/75 tests passing

# Build should succeed with 0 errors
npm run build
# Expected: Compilation successful

# MCP Inspector (optional - for testing MCP tools)
npm run inspector
```

---

## Development Workflow

### CRITICAL: Before Making Any Changes

**READ THIS FIRST**: All development MUST follow the Change Control Protocol to prevent accidental removal of approved functionality.

**Required Reading**:
1. `STANDARDS/CODING/CHANGE_CONTROL_PROTOCOL.md` (MANDATORY)
2. `STANDARDS/TESTING/REGRESSION_TESTING_GUIDE.md` (MANDATORY)
3. `STANDARDS/QUICK_REFERENCE_CHANGE_CONTROL.md` (Quick Reference)
4. `STANDARDS/PRE_CHANGE_CHECKLIST.md` (Keep open during development)

### Pre-Session Checklist

Before starting any development work:

- [ ] Read Change Control Protocol if first time contributing
- [ ] Pull latest changes: `git pull origin master`
- [ ] Install dependencies: `npm install`
- [ ] Verify all tests pass: `npm test` → **MUST BE 75/75 (100%)**
- [ ] Run clean build: `npm run build` → **MUST SUCCEED**
- [ ] Review `STANDARDS/PRE_CHANGE_CHECKLIST.md`

### Standard Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Verify baseline (ALL TESTS MUST PASS)
npm test
# MANDATORY: 75/75 tests passing before any changes

# 3. Make your changes (ONE SMALL CHANGE AT A TIME)
# Edit files...

# 4. Test after EVERY change
npm run build && npm test
# MANDATORY: Tests must still pass after each change

# 5. Commit frequently with descriptive messages
git add .
git commit -m "feat: Add specific feature description"

# 6. Final verification before PR
npm run build  # Must succeed
npm test       # Must show 75/75 passing

# 7. Push and create PR
git push origin feature/your-feature-name
```

---

## Change Control Protocol

### Core Principle

**NEVER remove or modify approved functionality without explicit written approval and the release word "remove it".**

### Prohibited Actions (Without Approval + "remove it")

❌ **DO NOT** do any of the following without explicit approval:

1. **Delete Functions/Methods/Classes** - Breaks existing integrations
2. **Remove Parameters** - Breaks function signatures
3. **Change Function Signatures** - Alters expected behavior
4. **Remove Configuration Options** - Breaks user configurations
5. **Delete Test Files/Cases** - Tests represent approved functionality
6. **Comment Out Working Code** - Effectively removes functionality
7. **Remove Parser Features** - Degrades language support

### Allowed Actions (No Approval Needed)

✅ **SAFE** to do without approval:

- **Add new features** (additive changes only)
- **Add new tests** (increases coverage)
- **Fix bugs** (while maintaining behavior)
- **Add documentation/comments**
- **Refactor internal implementation** (without changing behavior)
- **Improve performance** (with same outputs)
- **Add new language support**
- **Enhance existing parsers** (detect more patterns)

### Pre-Change Verification

Before ANY code change:

```bash
# 1. Document what you're changing
echo "Changing: [describe change]" > CHANGE_NOTES.txt
echo "Reason: [why this change is needed]" >> CHANGE_NOTES.txt

# 2. Verify tests pass (establish baseline)
npm test
# REQUIRED: 75/75 passing

# 3. Make ONE small change

# 4. Verify tests still pass
npm run build && npm test
# REQUIRED: Still 75/75 passing

# 5. If tests fail, either:
#    a) Fix your code (if you broke functionality)
#    b) Update tests (if expectations changed validly)
#    c) Revert changes (if unsure)
```

### Requesting Approval for Removal

If you need to remove functionality:

1. **Open GitHub Issue** with title: `[REMOVAL REQUEST] Feature Name`
2. **Use Template**:
   ```markdown
   ## Functionality Removal Request
   
   **What to Remove**: [Specific function/feature/parameter]
   **Current Usage**: [Where/how it's used]
   **Reason for Removal**: [Why it should be removed]
   **Impact Analysis**: [What will break]
   **Migration Path**: [How users can adapt]
   **Breaking Change**: YES
   
   **Request**: I request approval to proceed with this removal.
   ```
3. **Wait for Approval**: Maintainers will review and respond
4. **Release Word Required**: Approval must include the phrase **"remove it"**
5. **Only Then Proceed**: Make changes only after explicit approval received

---

## Code Standards

### TypeScript Configuration

- **Strict Mode**: Enabled (tsconfig.json: `"strict": true`)
- **No Implicit Any**: All types must be explicit
- **Unused Variables**: Prefix with `_` if intentionally unused
- **ESM Modules**: Use `import/export`, not `require`

### Code Style

```typescript
// ✅ GOOD: Clear types, descriptive names
export interface FunctionInfo {
  name: string;
  parameters: ParameterInfo[];
  returnType?: string;
  documentation?: string;
  isAsync: boolean;
}

export function parseCode(
  code: string,
  language: Language
): ParsedCode {
  const functions: FunctionInfo[] = [];
  // Implementation...
  return { functions, classes, interfaces };
}

// ❌ BAD: Implicit any, short names, no types
function parse(c, l) {
  var funcs = [];
  // Implementation...
  return funcs;
}
```

### Naming Conventions

- **Functions/Methods**: `camelCase` - `parseCode()`, `generateDocumentation()`
- **Classes/Interfaces**: `PascalCase` - `PythonParser`, `DocumentationResult`
- **Constants**: `UPPER_SNAKE_CASE` - `DEFAULT_STYLE`, `MAX_LINE_LENGTH`
- **Private Members**: Prefix with `_` - `_cache`, `_extractMetadata()`
- **Type Parameters**: Single uppercase letter or `PascalCase` - `T`, `TParser`

### File Organization

```
src/
├── parsers/            # Language-specific parsers
│   ├── python.ts       # Python parser
│   ├── typescript.ts   # TypeScript parser
│   ├── javascript.ts   # JavaScript parser
│   └── base.ts         # Parser base class
├── generators/         # Documentation generators
│   ├── markdown.ts     # Markdown generator
│   ├── jsdoc.ts        # JSDoc generator
│   └── xmldoc.ts       # XMLDoc generator
├── tools/              # MCP tool implementations
│   ├── analyze.ts      # analyze_code tool
│   └── generate.ts     # generate_documentation tool
├── types.ts            # Type definitions
├── utils.ts            # Utility functions
└── index.ts            # MCP server entry
```

### Documentation

All public functions MUST have JSDoc comments:

```typescript
/**
 * Parses source code to extract functions, classes, and interfaces.
 * 
 * @param code - Source code to parse
 * @param language - Programming language
 * @returns Parsed code structure with metadata
 * 
 * @throws {Error} If language is not supported
 * 
 * @example
 * ```typescript
 * const parsed = parseCode(sourceCode, 'typescript');
 * console.log(`Found ${parsed.functions.length} functions`);
 * ```
 */
export function parseCode(
  code: string,
  language: Language
): ParsedCode {
  // Implementation
}
```

---

## Testing Requirements

### Test Coverage Mandate

- **100% Test Pass Rate Required**: All 75 tests MUST pass before committing
- **No Regressions Allowed**: New changes cannot break existing tests
- **Add Tests for New Features**: Every new feature needs tests
- **Test After Every Change**: Run tests after each modification

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/analyze.test.ts

# Run in watch mode (during development)
npm test -- --watch

# Run with coverage report
npm test -- --coverage

# Verbose output
npm test -- --verbose
```

### Test Structure

Follow the existing test patterns:

```typescript
// tests/your-feature.test.ts
import { yourFunction } from '../src/your-module';

describe('yourFunction', () => {
  // Happy path
  it('should handle valid input correctly', () => {
    const result = yourFunction('valid input');
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });
  
  // Edge cases
  it('should handle empty input', () => {
    const result = yourFunction('');
    expect(result).toEqual([]);
  });
  
  // Error handling
  it('should throw error for invalid input', () => {
    expect(() => yourFunction(null as any)).toThrow();
  });
});
```

### Test Naming Convention

Use descriptive test names that explain what is being tested:

```typescript
// ✅ GOOD: Clear, descriptive
it('should extract async function with type hints', () => { ... });
it('should parse class with multiple methods', () => { ... });
it('should handle decorators on class methods', () => { ... });

// ❌ BAD: Vague, unclear
it('works', () => { ... });
it('test1', () => { ... });
it('parses functions', () => { ... });
```

### Test Quality Standards

Tests MUST:
- Be **independent** (no shared state between tests)
- Be **deterministic** (same input → same output every time)
- Be **fast** (entire suite runs in < 3 seconds)
- Have **clear assertions** (verify specific expected behavior)
- **Clean up** after themselves (no side effects)

---

## Pull Request Process

### Before Submitting PR

Checklist:

- [ ] All tests pass (75/75)
- [ ] Build succeeds with 0 errors
- [ ] Code follows style guidelines
- [ ] New features have tests (100% of new code)
- [ ] Documentation updated (README, JSDoc)
- [ ] No console.log statements left in code
- [ ] No commented-out code blocks
- [ ] Commit messages follow convention

### PR Title Format

Use conventional commit prefixes:

- `feat: Add Ruby language parser`
- `fix: Correct Python class method extraction`
- `docs: Update batch processing documentation`
- `test: Add edge case tests for async functions`
- `refactor: Extract common parser utilities`
- `perf: Optimize regex patterns for parsing`

### PR Description Template

```markdown
## Description

Brief description of changes made.

## Motivation

Why is this change needed? What problem does it solve?

## Changes Made

- Change 1
- Change 2
- Change 3

## Testing

- [ ] All existing tests pass (75/75)
- [ ] Added X new tests for new functionality
- [ ] Tested manually with sample code in [languages]

## Breaking Changes

- [ ] No breaking changes
- [ ] Breaking change (explain impact)

## Checklist

- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] Build succeeds
- [ ] Change Control Protocol followed
```

### Review Process

1. **Automated Checks**: CI/CD runs tests and build
2. **Code Review**: Maintainer reviews code quality
3. **Testing Verification**: Reviewer confirms tests pass
4. **Documentation Review**: Checks docs are updated
5. **Approval**: Maintainer approves PR
6. **Merge**: PR merged to master branch

### After PR is Merged

- Update your local branch: `git pull origin master`
- Delete feature branch: `git branch -d feature/your-feature-name`
- Celebrate! 🎉

---

## Commit Message Guidelines

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `test`: Adding/updating tests
- `refactor`: Code restructuring (no behavior change)
- `perf`: Performance improvement
- `chore`: Maintenance (deps, build, etc.)

### Examples

```bash
# Simple feature
git commit -m "feat: Add support for PHP parser"

# Bug fix with details
git commit -m "fix: Correct async function detection in Python

The regex was not matching 'async def' keyword properly.
Updated pattern to handle both sync and async functions."

# Test addition
git commit -m "test: Add tests for multi-function file parsing"

# Documentation
git commit -m "docs: Update troubleshooting section with parser issues"
```

---

## Adding New Features

### New Language Parser

Example: Adding support for a new programming language

1. **Create Parser** (`src/parsers/newlang.ts`):
```typescript
import { FunctionInfo, ClassInfo, ParsedCode } from '../types';

export function parseNewLang(code: string): ParsedCode {
  const functions: FunctionInfo[] = [];
  const classes: ClassInfo[] = [];
  
  // Function extraction logic
  const functionRegex = /function_pattern/g;
  let match;
  while ((match = functionRegex.exec(code)) !== null) {
    functions.push({
      name: match[1],
      parameters: parseParameters(match[2]),
      returnType: match[3],
      isAsync: false,
      lineNumber: getLineNumber(code, match.index)
    });
  }
  
  return { functions, classes, interfaces: [] };
}

function parseParameters(paramStr: string): ParameterInfo[] {
  // Parameter parsing logic
  return [];
}
```

2. **Add to Language Type** (`src/types.ts`):
```typescript
export type Language = 
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'newlang'  // Add here
  | ...;
```

3. **Integrate Parser** (`src/analyzers/code-analyzer.ts`):
```typescript
import { parseNewLang } from '../parsers/newlang';

function getParser(language: Language): ParserFunction {
  switch (language) {
    case 'typescript': return parseTypeScript;
    case 'python': return parsePython;
    case 'newlang': return parseNewLang;  // Add here
    default: throw new Error(`Unsupported language: ${language}`);
  }
}
```

4. **Add Tests** (`tests/analyze.test.ts`):
```typescript
describe('parseNewLang', () => {
  it('should extract functions from newlang code', () => {
    const code = `
      function myFunc(param1: type1) -> returnType {
        // implementation
      }
    `;
    
    const result = parseNewLang(code);
    
    expect(result.functions).toHaveLength(1);
    expect(result.functions[0].name).toBe('myFunc');
    expect(result.functions[0].parameters).toHaveLength(1);
  });
  
  it('should extract classes from newlang code', () => {
    const code = `
      class MyClass {
        method1() { }
        method2() { }
      }
    `;
    
    const result = parseNewLang(code);
    
    expect(result.classes).toHaveLength(1);
    expect(result.classes[0].name).toBe('MyClass');
    expect(result.classes[0].methods).toHaveLength(2);
  });
  
  // Add more tests for edge cases
});
```

5. **Update Documentation** (`README.md`):
```markdown
### Supported Languages

- TypeScript
- JavaScript
- Python
- Java
- C#
- **NewLang** (NEW) - Full support for functions and classes
```

6. **Test Everything**:
```bash
npm run build  # Must succeed
npm test       # Must pass (now 80/75 - you added 5 tests)
```

### New Documentation Style

To add support for a new documentation format:

1. Create generator in `src/generators/`
2. Add style type to `src/types.ts`
3. Update tool to support new style
4. Add tests with sample output
5. Update README.md documentation

---

## Reporting Bugs

### Before Reporting

- Check existing issues for duplicates
- Verify it's actually a bug (not expected behavior)
- Test with latest version
- Try to reproduce consistently

### Bug Report Template

```markdown
## Bug Description

Clear description of the bug.

## Steps to Reproduce

1. Parse this code: `[code sample]`
2. With language: `[language]`
3. Expected: `[expected output]`
4. Actual: `[actual output]`

## Expected Behavior

What should happen.

## Actual Behavior

What actually happens.

## Sample Code

```python
# Code that triggers the bug
async def my_function(param1, param2):
    return param1 + param2
```

## Environment

- Code Documentation Agent Version: X.X.X
- Node Version: X.X.X
- OS: Windows/Mac/Linux
- Language Being Parsed: TypeScript/Python/etc.

## Additional Context

Any other relevant information.
```

---

## Parser Development Guidelines

### Regex Best Practices

```typescript
// ✅ GOOD: Named capture groups, handles edge cases
const functionRegex = /^(?<async>async\s+)?def\s+(?<name>\w+)\s*\((?<params>.*?)\)(?:\s*->\s*(?<return>[^:]+))?:/gm;

// ❌ BAD: Unnamed groups, fragile
const functionRegex = /def\s+(\w+)\s*\((.*?)\):/g;
```

### Handling Edge Cases

Always consider:
- **Async functions**: `async def`, `async function`
- **Decorators**: `@property`, `@staticmethod`
- **Multi-line signatures**: Function spanning multiple lines
- **Nested structures**: Classes within classes
- **Comments**: Ignore commented-out code
- **String literals**: Don't parse code inside strings

### Testing Parsers

Test with real-world code samples:

```typescript
it('should handle real-world complex function', () => {
  const code = `
    @decorator
    @another_decorator(arg='value')
    async def complex_function(
        param1: str,
        param2: Optional[int] = None,
        *args,
        **kwargs
    ) -> Dict[str, Any]:
        """Docstring here."""
        # Implementation
        pass
  `;
  
  const result = parsePython(code);
  // Verify all metadata extracted correctly
});
```

---

## Questions?

- **Documentation**: Check README.md and STANDARDS/ directory
- **Issues**: Open a GitHub issue
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact maintainers (see README.md)

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to Code Documentation Agent!** 🚀
