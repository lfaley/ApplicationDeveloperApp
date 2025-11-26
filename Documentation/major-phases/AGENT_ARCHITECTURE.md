# Agent Architecture Specification

## Document Information
- **Version**: 1.0.0
- **Last Updated**: 2025-11-17
- **Status**: Draft - Part 1 of 3
- **Related Documents**: 
  - [Technical Architecture](../architecture/TECHNICAL_ARCHITECTURE.md)
  - [Workflow System](../specifications/WORKFLOW_SYSTEM.md)
  - [Integration Layer](../specifications/INTEGRATION_LAYER.md)

---

## Table of Contents
1. [Agent System Overview](#agent-system-overview)
2. [Agent 1: Feature Implementation Agent](#agent-1-feature-implementation-agent)
3. [Agent 2: Standards Compliance Agent](#agent-2-standards-compliance-agent)
4. [Agent 3: Test Generation Agent](#agent-3-test-generation-agent)
5. [Agents 4-6: See Part 2](#agents-4-6-see-part-2)
6. [Agent Orchestration: See Part 3](#agent-orchestration-see-part-3)

---

## Agent System Overview

### Purpose
ProjectPlanner Phase 2 includes 6 specialized AI agents that automate key development tasks while maintaining standards compliance. Agents work independently or in orchestrated workflows to accelerate development without sacrificing quality.

### Agent Catalog

| Agent | Primary Function | Automation Level | Status |
|-------|------------------|------------------|--------|
| **Feature Implementation** | Generate feature code from requirements | High | Planned |
| **Standards Compliance** | Validate code against standards | High | Planned |
| **Test Generation** | Create comprehensive test suites | High | Planned |
| **Code Documentation** | Generate inline and API documentation | Very High | 90% Complete |
| **Bug Analysis** | Diagnose and suggest fixes for bugs | Medium | Planned |
| **Project Roadmap** | Plan and track project progress | Medium | In Progress |

### Agent Architecture Pattern

All agents follow a common architecture:

```typescript
export interface Agent {
  // Identity
  name: string;
  version: string;
  capabilities: string[];
  
  // Lifecycle
  initialize(context: AgentContext): Promise<void>;
  shutdown(): Promise<void>;
  
  // Execution
  execute(task: AgentTask): Promise<AgentResult>;
  
  // Status
  getStatus(): AgentStatus;
  getMetrics(): AgentMetrics;
}

export interface AgentContext {
  workspaceRoot: string;
  stateManager: StateManager;
  standardsEngine: ComplianceEngine;
  mcpConnection: MCPConnection;
  config: AgentConfig;
}

export interface AgentTask {
  id: string;
  type: string;
  input: any;
  options?: Record<string, any>;
}

export interface AgentResult {
  success: boolean;
  output: any;
  metrics: {
    duration: number;
    tokensUsed?: number;
    filesModified?: number;
  };
  errors?: Error[];
}
```

### MCP Integration

All agents communicate via Model Context Protocol (MCP):

```typescript
export interface MCPConnection {
  // Server connection
  connect(serverPath: string): Promise<void>;
  disconnect(): Promise<void>;
  
  // Tool invocation
  callTool(toolName: string, args: any): Promise<any>;
  
  // Prompt templates
  getPrompt(promptName: string, args: any): Promise<string>;
  
  // Resource access
  getResource(resourceUri: string): Promise<any>;
}
```

### Agent Communication

```
┌─────────────────────────────────────────────────────────┐
│              Agent Orchestrator                          │
├─────────────────────────────────────────────────────────┤
│  • Task routing                                          │
│  • Dependency management                                 │
│  • Result aggregation                                    │
└───────────────┬─────────────────────────────────────────┘
                │
    ┌───────────┴───────────────────────────┐
    │                                        │
    ▼                                        ▼
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│ Feature │  │Standards│  │  Test   │  │   Doc   │
│  Agent  │  │ Agent   │  │  Agent  │  │  Agent  │
└────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘
     │            │            │            │
     └────────────┴────────────┴────────────┘
                  │
     ┌────────────▼────────────┐
     │   MCP Server(s)         │
     │   • LLM access          │
     │   • Tool execution      │
     │   • Resource management │
     └─────────────────────────┘
```

---

## Agent 1: Feature Implementation Agent

### Purpose
Automatically generate production-ready feature implementation code from high-level requirements, following project standards and best practices.

### Capabilities

- **Requirements Analysis**: Parse feature requirements and extract implementation details
- **Architecture Planning**: Design component structure and dependencies
- **Code Generation**: Generate TypeScript/PowerShell/other language code
- **Standards Compliance**: Ensure generated code meets all standards
- **Integration**: Create necessary integration points and APIs
- **Documentation**: Generate inline documentation automatically

### Agent Specification

```typescript
export class FeatureImplementationAgent implements Agent {
  name = 'Feature Implementation Agent';
  version = '1.0.0';
  capabilities = [
    'requirements-analysis',
    'code-generation',
    'architecture-design',
    'standards-validation',
    'integration-creation',
  ];
  
  constructor(
    private context: AgentContext,
    private codeGenerator: CodeGenerator,
    private standardsValidator: StandardsValidator
  ) {}
  
  async execute(task: AgentTask): Promise<AgentResult> {
    const startTime = Date.now();
    
    try {
      // Parse requirements
      const requirements = await this.parseRequirements(task.input.feature);
      
      // Design architecture
      const architecture = await this.designArchitecture(requirements);
      
      // Generate code
      const generatedCode = await this.generateCode(architecture);
      
      // Validate against standards
      const validationResult = await this.validateStandards(generatedCode);
      
      if (!validationResult.isValid) {
        // Attempt auto-fix
        generatedCode = await this.applyFixes(generatedCode, validationResult.violations);
      }
      
      // Write files
      await this.writeFiles(generatedCode);
      
      // Generate tests (delegate to Test Agent)
      await this.context.mcpConnection.callTool('generate-tests', {
        files: generatedCode.files,
      });
      
      return {
        success: true,
        output: {
          filesCreated: generatedCode.files.map(f => f.path),
          architecture: architecture,
          validationResult: validationResult,
        },
        metrics: {
          duration: Date.now() - startTime,
          filesModified: generatedCode.files.length,
        },
      };
      
    } catch (error) {
      return {
        success: false,
        output: null,
        metrics: { duration: Date.now() - startTime },
        errors: [error],
      };
    }
  }
  
  private async parseRequirements(feature: Feature): Promise<Requirements> {
    // Use MCP to parse requirements with LLM
    const prompt = await this.context.mcpConnection.getPrompt(
      'parse-feature-requirements',
      { feature }
    );
    
    const result = await this.context.mcpConnection.callTool(
      'analyze-requirements',
      { prompt, feature }
    );
    
    return {
      functionalRequirements: result.functional,
      technicalRequirements: result.technical,
      constraints: result.constraints,
      dependencies: result.dependencies,
    };
  }
  
  private async designArchitecture(requirements: Requirements): Promise<Architecture> {
    // Design component structure
    const prompt = await this.context.mcpConnection.getPrompt(
      'design-architecture',
      { requirements }
    );
    
    const result = await this.context.mcpConnection.callTool(
      'design-components',
      { prompt, requirements }
    );
    
    return {
      components: result.components,
      dataFlow: result.dataFlow,
      interfaces: result.interfaces,
      dependencies: result.dependencies,
    };
  }
  
  private async generateCode(architecture: Architecture): Promise<GeneratedCode> {
    const files: GeneratedFile[] = [];
    
    for (const component of architecture.components) {
      const code = await this.codeGenerator.generate({
        componentSpec: component,
        language: this.detectLanguage(component),
        style: 'idiomatic',
        includeDocumentation: true,
        includeErrorHandling: true,
      });
      
      files.push({
        path: component.filePath,
        content: code,
        language: component.language,
      });
    }
    
    return { files, architecture };
  }
  
  private async validateStandards(code: GeneratedCode): Promise<ValidationResult> {
    const violations: Violation[] = [];
    
    for (const file of code.files) {
      const fileViolations = await this.standardsValidator.validate(
        file.path,
        file.content
      );
      violations.push(...fileViolations);
    }
    
    return {
      isValid: violations.length === 0,
      violations: violations,
      score: this.calculateComplianceScore(violations),
    };
  }
  
  private async applyFixes(
    code: GeneratedCode,
    violations: Violation[]
  ): Promise<GeneratedCode> {
    // Attempt automatic fixes for common violations
    const fixableViolations = violations.filter(v => v.autoFixable);
    
    for (const violation of fixableViolations) {
      const fix = await this.generateFix(violation);
      code = await this.applyFix(code, fix);
    }
    
    return code;
  }
}
```

### Usage Example

```typescript
// Create feature implementation agent
const agent = new FeatureImplementationAgent(context, codeGenerator, validator);

// Execute implementation task
const result = await agent.execute({
  id: 'impl-001',
  type: 'implement-feature',
  input: {
    feature: {
      id: 'FEA-123',
      title: 'User Authentication',
      requirements: [
        'Support email/password login',
        'Implement JWT tokens',
        'Include password reset flow',
      ],
      technicalSpec: {
        language: 'TypeScript',
        framework: 'Express',
        database: 'PostgreSQL',
      },
    },
  },
});

if (result.success) {
  console.log(`Created ${result.output.filesCreated.length} files`);
  console.log(`Compliance score: ${result.output.validationResult.score}%`);
}
```

### MCP Tools Required

```json
{
  "tools": [
    {
      "name": "analyze-requirements",
      "description": "Parse feature requirements into structured format",
      "inputSchema": {
        "type": "object",
        "properties": {
          "feature": { "type": "object" },
          "prompt": { "type": "string" }
        }
      }
    },
    {
      "name": "design-components",
      "description": "Design software architecture from requirements",
      "inputSchema": {
        "type": "object",
        "properties": {
          "requirements": { "type": "object" },
          "prompt": { "type": "string" }
        }
      }
    },
    {
      "name": "generate-code",
      "description": "Generate production code for component",
      "inputSchema": {
        "type": "object",
        "properties": {
          "component": { "type": "object" },
          "language": { "type": "string" },
          "style": { "type": "string" }
        }
      }
    }
  ]
}
```

### Configuration

```typescript
interface FeatureImplementationConfig {
  // Code generation preferences
  language: 'typescript' | 'javascript' | 'powershell' | 'python';
  style: 'functional' | 'oop' | 'mixed';
  targetVersion: string;                    // e.g., "ES2022", "PowerShell 7"
  
  // Quality settings
  minComplianceScore: number;               // 0-100, fail if below
  maxComplexity: number;                    // Cyclomatic complexity limit
  requireTests: boolean;
  requireDocumentation: boolean;
  
  // Automation settings
  autoFix: boolean;                         // Attempt to fix violations
  autoCommit: boolean;                      // Commit generated code
  createPR: boolean;                        // Create pull request
  
  // Integration settings
  runTestsAfter: boolean;                   // Run tests after generation
  runLinterAfter: boolean;                  // Run linter after generation
  notifyOnComplete: boolean;                // Send notification
}
```

---

## Agent 2: Standards Compliance Agent

### Purpose
Continuously validate code against project standards, providing real-time feedback and automated fixes to maintain code quality.

### Capabilities

- **Multi-Language Validation**: Support TypeScript, JavaScript, PowerShell, Python, C#
- **Real-Time Checking**: Validate files on save, commit, or on-demand
- **Automated Fixes**: Apply standard fixes for common violations
- **Custom Rules**: Support project-specific standards
- **Reporting**: Generate compliance reports and trends
- **Integration**: Work with CI/CD pipelines and Git hooks

### Agent Specification

```typescript
export class StandardsComplianceAgent implements Agent {
  name = 'Standards Compliance Agent';
  version = '1.0.0';
  capabilities = [
    'code-validation',
    'auto-fix',
    'custom-rules',
    'reporting',
    'real-time-checking',
  ];
  
  private ruleEngine: RuleEngine;
  private cache: ComplianceCache;
  
  constructor(private context: AgentContext) {
    this.ruleEngine = new RuleEngine(context.standardsEngine);
    this.cache = new ComplianceCache();
  }
  
  async execute(task: AgentTask): Promise<AgentResult> {
    const startTime = Date.now();
    
    try {
      const { files, options } = task.input;
      const results: FileComplianceResult[] = [];
      
      for (const file of files) {
        // Check cache first
        const cached = await this.cache.get(file);
        if (cached && !options.ignoreCache) {
          results.push(cached);
          continue;
        }
        
        // Validate file
        const result = await this.validateFile(file);
        
        // Auto-fix if enabled
        if (options.autoFix && result.fixableViolations.length > 0) {
          const fixed = await this.applyFixes(file, result.fixableViolations);
          result.fixesApplied = fixed;
        }
        
        // Cache result
        await this.cache.set(file, result);
        
        results.push(result);
      }
      
      // Generate summary
      const summary = this.generateSummary(results);
      
      return {
        success: true,
        output: {
          results: results,
          summary: summary,
          passed: summary.violationCount === 0,
        },
        metrics: {
          duration: Date.now() - startTime,
          filesModified: results.filter(r => r.fixesApplied > 0).length,
        },
      };
      
    } catch (error) {
      return {
        success: false,
        output: null,
        metrics: { duration: Date.now() - startTime },
        errors: [error],
      };
    }
  }
  
  private async validateFile(filePath: string): Promise<FileComplianceResult> {
    const content = await fs.readFile(filePath, 'utf-8');
    const language = this.detectLanguage(filePath);
    
    // Load applicable rules
    const rules = await this.ruleEngine.getRulesForLanguage(language);
    
    // Run validation
    const violations: Violation[] = [];
    
    for (const rule of rules) {
      const ruleViolations = await rule.validate(filePath, content);
      violations.push(...ruleViolations);
    }
    
    // Categorize violations
    const fixable = violations.filter(v => v.autoFixable);
    const critical = violations.filter(v => v.severity === 'error');
    
    return {
      filePath: filePath,
      language: language,
      violations: violations,
      fixableViolations: fixable,
      criticalViolations: critical,
      complianceScore: this.calculateScore(violations, rules.length),
      fixesApplied: 0,
    };
  }
  
  private async applyFixes(
    filePath: string,
    violations: Violation[]
  ): Promise<number> {
    let fixCount = 0;
    let content = await fs.readFile(filePath, 'utf-8');
    
    for (const violation of violations) {
      try {
        const fix = await this.generateFix(violation);
        content = this.applyFix(content, fix);
        fixCount++;
      } catch (error) {
        console.warn(`Could not auto-fix ${violation.ruleId}:`, error.message);
      }
    }
    
    if (fixCount > 0) {
      await fs.writeFile(filePath, content, 'utf-8');
    }
    
    return fixCount;
  }
  
  private calculateScore(violations: Violation[], totalRules: number): number {
    if (totalRules === 0) return 100;
    
    // Weight violations by severity
    const weights = { error: 3, warning: 2, info: 1 };
    const totalWeight = violations.reduce(
      (sum, v) => sum + weights[v.severity],
      0
    );
    
    const maxWeight = totalRules * 3; // Assume worst case (all errors)
    return Math.max(0, Math.round((1 - totalWeight / maxWeight) * 100));
  }
  
  private generateSummary(results: FileComplianceResult[]): ComplianceSummary {
    const totalViolations = results.reduce((sum, r) => sum + r.violations.length, 0);
    const totalFixable = results.reduce((sum, r) => sum + r.fixableViolations.length, 0);
    const totalFixed = results.reduce((sum, r) => sum + r.fixesApplied, 0);
    
    const avgScore = results.reduce((sum, r) => sum + r.complianceScore, 0) / results.length;
    
    return {
      filesChecked: results.length,
      violationCount: totalViolations,
      fixableCount: totalFixable,
      fixedCount: totalFixed,
      averageScore: Math.round(avgScore),
      passed: totalViolations === 0,
      details: results,
    };
  }
}
```

### Rule Engine

```typescript
export class RuleEngine {
  private rules: Map<string, Rule[]> = new Map();
  
  constructor(private standardsEngine: ComplianceEngine) {
    this.loadBuiltInRules();
  }
  
  private async loadBuiltInRules(): Promise<void> {
    // TypeScript/JavaScript rules
    this.registerRule('typescript', new RequireJSDocRule());
    this.registerRule('typescript', new NoAnyTypeRule());
    this.registerRule('typescript', new MaxComplexityRule({ max: 10 }));
    this.registerRule('typescript', new RequireErrorHandlingRule());
    
    // PowerShell rules
    this.registerRule('powershell', new RequireCommentHelpRule());
    this.registerRule('powershell', new RequireParamValidationRule());
    this.registerRule('powershell', new AvoidAliasingRule());
    
    // Cross-language rules
    this.registerRule('*', new MaxLineLengthRule({ max: 120 }));
    this.registerRule('*', new NoHardcodedCredentialsRule());
    this.registerRule('*', new RequireLicenseHeaderRule());
  }
  
  registerRule(language: string, rule: Rule): void {
    if (!this.rules.has(language)) {
      this.rules.set(language, []);
    }
    this.rules.get(language).push(rule);
  }
  
  async getRulesForLanguage(language: string): Promise<Rule[]> {
    const specific = this.rules.get(language) || [];
    const universal = this.rules.get('*') || [];
    return [...specific, ...universal];
  }
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  category: string;
  autoFixable: boolean;
  
  validate(filePath: string, content: string): Promise<Violation[]>;
  fix?(content: string, violation: Violation): Promise<string>;
}

// Example rule implementation
export class RequireJSDocRule implements Rule {
  id = 'SDLC-DOC-001';
  name = 'Require JSDoc Comments';
  description = 'All functions must have JSDoc documentation';
  severity = 'warning' as const;
  category = 'documentation';
  autoFixable = true;
  
  async validate(filePath: string, content: string): Promise<Violation[]> {
    const violations: Violation[] = [];
    
    // Parse TypeScript/JavaScript
    const ast = parseTypeScript(content);
    
    // Find all function declarations
    const functions = findFunctions(ast);
    
    for (const func of functions) {
      // Check if has JSDoc
      if (!func.hasJSDoc) {
        violations.push({
          ruleId: this.id,
          filePath: filePath,
          line: func.line,
          column: func.column,
          message: `Function '${func.name}' missing JSDoc documentation`,
          severity: this.severity,
          autoFixable: this.autoFixable,
          fix: () => this.fix(content, func),
        });
      }
    }
    
    return violations;
  }
  
  async fix(content: string, violation: Violation): Promise<string> {
    // Generate JSDoc template
    const jsdoc = this.generateJSDocTemplate(violation.context.function);
    
    // Insert before function
    return insertAtLine(content, violation.line, jsdoc);
  }
  
  private generateJSDocTemplate(func: FunctionNode): string {
    const params = func.parameters.map(p => 
      ` * @param {${p.type || 'any'}} ${p.name} - ${p.description || 'Description'}`
    ).join('\n');
    
    const returns = func.returnType !== 'void' 
      ? ` * @returns {${func.returnType}} Description`
      : '';
    
    return `/**
 * Description
${params}${returns}
 */`;
  }
}
```

### Usage Example

```typescript
// Create compliance agent
const agent = new StandardsComplianceAgent(context);

// Check files
const result = await agent.execute({
  id: 'compliance-001',
  type: 'validate-files',
  input: {
    files: [
      'src/features/auth/login.ts',
      'src/features/auth/register.ts',
    ],
    options: {
      autoFix: true,
      ignoreCache: false,
    },
  },
});

console.log(`Checked ${result.output.summary.filesChecked} files`);
console.log(`Found ${result.output.summary.violationCount} violations`);
console.log(`Fixed ${result.output.summary.fixedCount} issues`);
console.log(`Average score: ${result.output.summary.averageScore}%`);
```

### Configuration

```typescript
interface StandardsComplianceConfig {
  // Validation settings
  enabledLanguages: string[];
  enabledCategories: string[];
  minScore: number;                         // Fail if below
  
  // Auto-fix settings
  autoFix: boolean;
  autoFixPatterns: string[];                // Which violations to auto-fix
  
  // Caching
  cacheEnabled: boolean;
  cacheTTL: number;                         // seconds
  
  // Reporting
  reportFormat: 'json' | 'html' | 'markdown';
  includeFixSuggestions: boolean;
  
  // Integration
  runOnSave: boolean;
  runOnCommit: boolean;
  runOnPush: boolean;
  blockOnFailure: boolean;                  // Prevent commit/push
}
```

---

## Agent 3: Test Generation Agent

### Purpose
Automatically generate comprehensive test suites for code, ensuring high coverage and quality without manual test writing.

### Capabilities

- **Unit Test Generation**: Create unit tests for functions/methods
- **Integration Test Generation**: Generate integration tests for components
- **E2E Test Generation**: Create end-to-end test scenarios
- **Test Data Generation**: Generate realistic test data
- **Mocking**: Create mocks for dependencies
- **Coverage Analysis**: Identify untested code paths
- **Framework Support**: Jest, Mocha, Pytest, Pester

### Agent Specification

```typescript
export class TestGenerationAgent implements Agent {
  name = 'Test Generation Agent';
  version = '1.0.0';
  capabilities = [
    'unit-test-generation',
    'integration-test-generation',
    'e2e-test-generation',
    'mock-generation',
    'coverage-analysis',
  ];
  
  private testFrameworks: Map<string, TestFramework>;
  
  constructor(private context: AgentContext) {
    this.testFrameworks = new Map([
      ['typescript', new JestFramework()],
      ['javascript', new MochaFramework()],
      ['python', new PytestFramework()],
      ['powershell', new PesterFramework()],
    ]);
  }
  
  async execute(task: AgentTask): Promise<AgentResult> {
    const startTime = Date.now();
    
    try {
      const { sourceFiles, testType, options } = task.input;
      const generatedTests: GeneratedTest[] = [];
      
      for (const sourceFile of sourceFiles) {
        // Analyze source code
        const analysis = await this.analyzeSourceCode(sourceFile);
        
        // Generate tests
        const tests = await this.generateTests(analysis, testType, options);
        
        // Write test files
        await this.writeTestFiles(tests);
        
        generatedTests.push(...tests);
      }
      
      // Run tests to verify
      if (options.runAfterGeneration) {
        await this.runTests(generatedTests);
      }
      
      return {
        success: true,
        output: {
          testsGenerated: generatedTests.length,
          testFiles: generatedTests.map(t => t.filePath),
          coverage: await this.calculateCoverage(generatedTests),
        },
        metrics: {
          duration: Date.now() - startTime,
          filesModified: generatedTests.length,
        },
      };
      
    } catch (error) {
      return {
        success: false,
        output: null,
        metrics: { duration: Date.now() - startTime },
        errors: [error],
      };
    }
  }
  
  private async analyzeSourceCode(filePath: string): Promise<SourceAnalysis> {
    const content = await fs.readFile(filePath, 'utf-8');
    const language = this.detectLanguage(filePath);
    
    // Parse code
    const ast = this.parseCode(content, language);
    
    // Extract testable units
    const functions = this.extractFunctions(ast);
    const classes = this.extractClasses(ast);
    const dependencies = this.extractDependencies(ast);
    
    return {
      filePath: filePath,
      language: language,
      functions: functions,
      classes: classes,
      dependencies: dependencies,
      complexity: this.calculateComplexity(ast),
    };
  }
  
  private async generateTests(
    analysis: SourceAnalysis,
    testType: TestType,
    options: TestOptions
  ): Promise<GeneratedTest[]> {
    const framework = this.testFrameworks.get(analysis.language);
    const tests: GeneratedTest[] = [];
    
    switch (testType) {
      case 'unit':
        tests.push(...await this.generateUnitTests(analysis, framework, options));
        break;
        
      case 'integration':
        tests.push(...await this.generateIntegrationTests(analysis, framework, options));
        break;
        
      case 'e2e':
        tests.push(...await this.generateE2ETests(analysis, framework, options));
        break;
        
      case 'all':
        tests.push(...await this.generateUnitTests(analysis, framework, options));
        tests.push(...await this.generateIntegrationTests(analysis, framework, options));
        break;
    }
    
    return tests;
  }
  
  private async generateUnitTests(
    analysis: SourceAnalysis,
    framework: TestFramework,
    options: TestOptions
  ): Promise<GeneratedTest[]> {
    const tests: GeneratedTest[] = [];
    
    // Generate tests for each function
    for (const func of analysis.functions) {
      const testCases = await this.generateTestCases(func);
      
      const testCode = framework.generateTestSuite({
        name: `${func.name} tests`,
        describe: `Test suite for ${func.name}`,
        tests: testCases.map(tc => ({
          name: tc.description,
          code: framework.generateTestCase(tc),
        })),
        setup: await this.generateSetup(func, analysis.dependencies),
        teardown: await this.generateTeardown(func),
      });
      
      tests.push({
        type: 'unit',
        sourceFile: analysis.filePath,
        filePath: this.getTestFilePath(analysis.filePath, 'unit'),
        content: testCode,
        coverage: testCases.length,
      });
    }
    
    // Generate tests for each class
    for (const cls of analysis.classes) {
      const testCode = await this.generateClassTests(cls, framework, options);
      
      tests.push({
        type: 'unit',
        sourceFile: analysis.filePath,
        filePath: this.getTestFilePath(analysis.filePath, 'unit'),
        content: testCode,
        coverage: cls.methods.length,
      });
    }
    
    return tests;
  }
  
  private async generateTestCases(func: FunctionNode): Promise<TestCase[]> {
    const testCases: TestCase[] = [];
    
    // Happy path test
    testCases.push({
      description: `should ${func.description || 'work correctly'} with valid input`,
      type: 'happy-path',
      input: await this.generateValidInput(func),
      expectedOutput: await this.predictOutput(func, 'valid'),
      assertions: ['toBeDefined', 'toMatchExpected'],
    });
    
    // Edge cases
    if (func.parameters.some(p => p.type === 'number')) {
      testCases.push({
        description: 'should handle zero value',
        type: 'edge-case',
        input: this.generateEdgeCaseInput(func, 'zero'),
        expectedOutput: await this.predictOutput(func, 'zero'),
        assertions: ['toBeDefined'],
      });
      
      testCases.push({
        description: 'should handle negative values',
        type: 'edge-case',
        input: this.generateEdgeCaseInput(func, 'negative'),
        expectedOutput: await this.predictOutput(func, 'negative'),
        assertions: ['toBeDefined'],
      });
    }
    
    if (func.parameters.some(p => p.type === 'string')) {
      testCases.push({
        description: 'should handle empty string',
        type: 'edge-case',
        input: this.generateEdgeCaseInput(func, 'empty-string'),
        expectedOutput: await this.predictOutput(func, 'empty-string'),
        assertions: ['toBeDefined'],
      });
    }
    
    // Error cases
    if (func.throws || func.hasErrorHandling) {
      testCases.push({
        description: 'should throw error with invalid input',
        type: 'error-case',
        input: this.generateInvalidInput(func),
        expectedOutput: 'throws',
        assertions: ['toThrow'],
      });
    }
    
    // Null/undefined cases
    if (!func.parameters.every(p => p.required)) {
      testCases.push({
        description: 'should handle null/undefined input',
        type: 'edge-case',
        input: this.generateNullInput(func),
        expectedOutput: await this.predictOutput(func, 'null'),
        assertions: ['toBeDefined'],
      });
    }
    
    return testCases;
  }
  
  private async generateIntegrationTests(
    analysis: SourceAnalysis,
    framework: TestFramework,
    options: TestOptions
  ): Promise<GeneratedTest[]> {
    // Analyze component interactions
    const interactions = await this.analyzeInteractions(analysis);
    
    const tests: GeneratedTest[] = [];
    
    for (const interaction of interactions) {
      const testCode = framework.generateTestSuite({
        name: `${interaction.name} integration tests`,
        describe: `Integration tests for ${interaction.name}`,
        tests: [
          {
            name: 'should integrate components correctly',
            code: await this.generateIntegrationTestCode(interaction, framework),
          },
        ],
        setup: await this.generateIntegrationSetup(interaction),
        teardown: await this.generateIntegrationTeardown(interaction),
      });
      
      tests.push({
        type: 'integration',
        sourceFile: analysis.filePath,
        filePath: this.getTestFilePath(analysis.filePath, 'integration'),
        content: testCode,
        coverage: 1,
      });
    }
    
    return tests;
  }
  
  private async generateMocks(dependencies: Dependency[]): Promise<Mock[]> {
    const mocks: Mock[] = [];
    
    for (const dep of dependencies) {
      const mockCode = `
jest.mock('${dep.module}', () => ({
  ${dep.exports.map(exp => `${exp}: jest.fn()`).join(',\n  ')}
}));
`;
      
      mocks.push({
        module: dep.module,
        code: mockCode,
      });
    }
    
    return mocks;
  }
}
```

### Test Framework Interface

```typescript
export interface TestFramework {
  name: string;
  language: string;
  
  generateTestSuite(config: TestSuiteConfig): string;
  generateTestCase(testCase: TestCase): string;
  generateAssertion(assertion: Assertion): string;
  generateMock(dependency: Dependency): string;
}

// Jest implementation
export class JestFramework implements TestFramework {
  name = 'Jest';
  language = 'typescript';
  
  generateTestSuite(config: TestSuiteConfig): string {
    return `
import { ${config.imports.join(', ')} } from '${config.sourceModule}';

describe('${config.name}', () => {
  ${config.setup || ''}
  
  ${config.tests.map(t => `
  test('${t.name}', ${t.async ? 'async ' : ''}() => {
    ${t.code}
  });
  `).join('\n')}
  
  ${config.teardown || ''}
});
`;
  }
  
  generateTestCase(testCase: TestCase): string {
    const { input, expectedOutput, assertions } = testCase;
    
    return `
    // Arrange
    ${this.generateArrange(input)}
    
    // Act
    const result = ${testCase.functionCall};
    
    // Assert
    ${assertions.map(a => this.generateAssertion(a, result, expectedOutput)).join('\n    ')}
    `;
  }
  
  generateAssertion(assertion: string, result: string, expected: any): string {
    switch (assertion) {
      case 'toBeDefined':
        return `expect(${result}).toBeDefined();`;
      case 'toMatchExpected':
        return `expect(${result}).toEqual(${JSON.stringify(expected)});`;
      case 'toThrow':
        return `expect(() => ${result}).toThrow();`;
      default:
        return `expect(${result}).${assertion}();`;
    }
  }
  
  generateMock(dependency: Dependency): string {
    return `
const mock${dependency.name} = {
  ${dependency.methods.map(m => `${m.name}: jest.fn()`).join(',\n  ')}
};
`;
  }
}
```

### Usage Example

```typescript
// Create test generation agent
const agent = new TestGenerationAgent(context);

// Generate tests
const result = await agent.execute({
  id: 'test-gen-001',
  type: 'generate-tests',
  input: {
    sourceFiles: [
      'src/features/auth/login.ts',
      'src/features/auth/register.ts',
    ],
    testType: 'unit',
    options: {
      runAfterGeneration: true,
      targetCoverage: 80,
      includeMocks: true,
      framework: 'jest',
    },
  },
});

console.log(`Generated ${result.output.testsGenerated} tests`);
console.log(`Coverage: ${result.output.coverage}%`);
```

### Configuration

```typescript
interface TestGenerationConfig {
  // Framework settings
  framework: 'jest' | 'mocha' | 'pytest' | 'pester';
  testPattern: string;                      // e.g., "**/*.test.ts"
  
  // Generation settings
  targetCoverage: number;                   // 0-100
  generateEdgeCases: boolean;
  generateErrorCases: boolean;
  generateMocks: boolean;
  
  // Test data
  useRealisticData: boolean;
  dataGenerationStrategy: 'random' | 'realistic' | 'minimal';
  
  // Execution
  runAfterGeneration: boolean;
  failOnTestFailure: boolean;
  
  // Output
  testDirectory: string;
  fileNamingPattern: string;                // e.g., "{name}.test.{ext}"
}
```

---

---

## Agent 4: Code Documentation Agent

### Purpose
Automatically generate comprehensive, high-quality documentation for codebases, including inline comments, API documentation, and usage guides.

**Status**: 90% Complete - Existing MCP server implementation operational

### Capabilities

- **Inline Documentation**: Generate JSDoc, TypeDoc, XML Doc comments
- **API Documentation**: Create API reference documentation
- **Usage Examples**: Generate practical code examples
- **Markdown Generation**: Create README, CONTRIBUTING, and guide files
- **Multi-Language Support**: TypeScript, JavaScript, PowerShell, Python, C#
- **Context-Aware**: Understand code purpose and generate relevant documentation

### Existing Implementation

The Code Documentation Agent is already 90% implemented as an MCP server located at:
`MCP-SERVER/code-documentation-agent/`

**Current Features**:
- File-level documentation generation
- Function/class documentation
- Multiple output formats (markdown, inline)
- TypeScript/JavaScript support
- PowerShell support

### Agent Specification

```typescript
export class CodeDocumentationAgent implements Agent {
  name = 'Code Documentation Agent';
  version = '1.0.0';
  capabilities = [
    'inline-documentation',
    'api-documentation',
    'readme-generation',
    'example-generation',
    'multi-language',
  ];
  
  private mcpServer: MCPServer;
  private documentationEngine: DocumentationEngine;
  
  constructor(private context: AgentContext) {
    this.mcpServer = new MCPServer('code-documentation-agent');
    this.documentationEngine = new DocumentationEngine();
  }
  
  async initialize(context: AgentContext): Promise<void> {
    // Connect to existing MCP server
    await this.mcpServer.connect();
    
    // Load documentation templates
    await this.documentationEngine.loadTemplates();
  }
  
  async execute(task: AgentTask): Promise<AgentResult> {
    const startTime = Date.now();
    
    try {
      const { files, documentationType, options } = task.input;
      const results: DocumentationResult[] = [];
      
      for (const file of files) {
        // Analyze code
        const analysis = await this.analyzeCode(file);
        
        // Generate documentation
        const documentation = await this.generateDocumentation(
          analysis,
          documentationType,
          options
        );
        
        // Apply documentation
        if (documentationType === 'inline') {
          await this.applyInlineDocumentation(file, documentation);
        } else {
          await this.createDocumentationFile(documentation);
        }
        
        results.push({
          sourceFile: file,
          documentationType: documentationType,
          outputFile: documentation.outputPath,
          itemsDocumented: documentation.items.length,
        });
      }
      
      return {
        success: true,
        output: {
          results: results,
          totalItemsDocumented: results.reduce((sum, r) => sum + r.itemsDocumented, 0),
        },
        metrics: {
          duration: Date.now() - startTime,
          filesModified: results.length,
        },
      };
      
    } catch (error) {
      return {
        success: false,
        output: null,
        metrics: { duration: Date.now() - startTime },
        errors: [error],
      };
    }
  }
  
  private async analyzeCode(filePath: string): Promise<CodeAnalysis> {
    const content = await fs.readFile(filePath, 'utf-8');
    const language = this.detectLanguage(filePath);
    
    // Use MCP server to analyze
    const analysis = await this.mcpServer.callTool('analyze-code', {
      filePath: filePath,
      content: content,
      language: language,
    });
    
    return {
      filePath: filePath,
      language: language,
      functions: analysis.functions,
      classes: analysis.classes,
      interfaces: analysis.interfaces,
      exports: analysis.exports,
      imports: analysis.imports,
      complexity: analysis.complexity,
    };
  }
  
  private async generateDocumentation(
    analysis: CodeAnalysis,
    type: DocumentationType,
    options: DocumentationOptions
  ): Promise<Documentation> {
    switch (type) {
      case 'inline':
        return await this.generateInlineDocumentation(analysis, options);
      
      case 'api':
        return await this.generateAPIDocumentation(analysis, options);
      
      case 'readme':
        return await this.generateReadme(analysis, options);
      
      case 'usage':
        return await this.generateUsageExamples(analysis, options);
      
      default:
        throw new Error(`Unsupported documentation type: ${type}`);
    }
  }
  
  private async generateInlineDocumentation(
    analysis: CodeAnalysis,
    options: DocumentationOptions
  ): Promise<Documentation> {
    const items: DocumentationItem[] = [];
    
    // Generate function documentation
    for (const func of analysis.functions) {
      const docComment = await this.generateFunctionDoc(func, analysis.language);
      items.push({
        type: 'function',
        name: func.name,
        location: { line: func.line, column: func.column },
        content: docComment,
      });
    }
    
    // Generate class documentation
    for (const cls of analysis.classes) {
      const docComment = await this.generateClassDoc(cls, analysis.language);
      items.push({
        type: 'class',
        name: cls.name,
        location: { line: cls.line, column: cls.column },
        content: docComment,
      });
      
      // Document methods
      for (const method of cls.methods) {
        const methodDoc = await this.generateMethodDoc(method, analysis.language);
        items.push({
          type: 'method',
          name: `${cls.name}.${method.name}`,
          location: { line: method.line, column: method.column },
          content: methodDoc,
        });
      }
    }
    
    return {
      type: 'inline',
      sourceFile: analysis.filePath,
      outputPath: analysis.filePath, // Same file
      items: items,
    };
  }
  
  private async generateFunctionDoc(
    func: FunctionNode,
    language: string
  ): Promise<string> {
    // Use MCP to generate with LLM
    const prompt = await this.mcpServer.getPrompt('generate-function-doc', {
      function: func,
      language: language,
    });
    
    const docComment = await this.mcpServer.callTool('generate-documentation', {
      prompt: prompt,
      style: this.getDocStyle(language),
    });
    
    return docComment;
  }
  
  private async generateAPIDocumentation(
    analysis: CodeAnalysis,
    options: DocumentationOptions
  ): Promise<Documentation> {
    const markdown = new MarkdownBuilder();
    
    // Title
    markdown.heading(1, `${analysis.fileName} API Documentation`);
    
    // Overview
    markdown.heading(2, 'Overview');
    const overview = await this.generateOverview(analysis);
    markdown.paragraph(overview);
    
    // Exports
    markdown.heading(2, 'Exports');
    
    // Document classes
    if (analysis.classes.length > 0) {
      markdown.heading(3, 'Classes');
      for (const cls of analysis.classes) {
        await this.documentClass(markdown, cls);
      }
    }
    
    // Document functions
    if (analysis.functions.length > 0) {
      markdown.heading(3, 'Functions');
      for (const func of analysis.functions) {
        await this.documentFunction(markdown, func);
      }
    }
    
    // Document interfaces
    if (analysis.interfaces.length > 0) {
      markdown.heading(3, 'Interfaces');
      for (const iface of analysis.interfaces) {
        await this.documentInterface(markdown, iface);
      }
    }
    
    // Examples
    markdown.heading(2, 'Usage Examples');
    const examples = await this.generateExamples(analysis);
    for (const example of examples) {
      markdown.heading(3, example.title);
      markdown.codeBlock(example.code, analysis.language);
    }
    
    return {
      type: 'api',
      sourceFile: analysis.filePath,
      outputPath: this.getAPIDocPath(analysis.filePath),
      items: [{ type: 'api', name: 'API Documentation', content: markdown.toString() }],
    };
  }
  
  private async documentClass(markdown: MarkdownBuilder, cls: ClassNode): Promise<void> {
    markdown.heading(4, cls.name);
    
    // Description
    const description = await this.generateDescription(cls);
    markdown.paragraph(description);
    
    // Constructor
    if (cls.constructor) {
      markdown.heading(5, 'Constructor');
      markdown.codeBlock(this.formatSignature(cls.constructor), 'typescript');
      
      // Parameters
      if (cls.constructor.parameters.length > 0) {
        markdown.paragraph('**Parameters:**');
        markdown.list(cls.constructor.parameters.map(p => 
          `\`${p.name}\` (${p.type}): ${p.description || 'No description'}`
        ));
      }
    }
    
    // Properties
    if (cls.properties.length > 0) {
      markdown.heading(5, 'Properties');
      markdown.table(
        ['Name', 'Type', 'Description'],
        cls.properties.map(p => [
          `\`${p.name}\``,
          `\`${p.type}\``,
          p.description || 'No description',
        ])
      );
    }
    
    // Methods
    if (cls.methods.length > 0) {
      markdown.heading(5, 'Methods');
      for (const method of cls.methods) {
        await this.documentMethod(markdown, method);
      }
    }
    
    // Example
    const example = await this.generateClassExample(cls);
    if (example) {
      markdown.heading(5, 'Example');
      markdown.codeBlock(example, 'typescript');
    }
  }
  
  private async documentFunction(markdown: MarkdownBuilder, func: FunctionNode): Promise<void> {
    markdown.heading(4, func.name);
    
    // Description
    const description = await this.generateDescription(func);
    markdown.paragraph(description);
    
    // Signature
    markdown.codeBlock(this.formatSignature(func), 'typescript');
    
    // Parameters
    if (func.parameters.length > 0) {
      markdown.paragraph('**Parameters:**');
      markdown.list(func.parameters.map(p => 
        `\`${p.name}\` (${p.type}): ${p.description || 'No description'}`
      ));
    }
    
    // Returns
    if (func.returnType && func.returnType !== 'void') {
      markdown.paragraph(`**Returns:** \`${func.returnType}\``);
      const returnDesc = await this.generateReturnDescription(func);
      if (returnDesc) {
        markdown.paragraph(returnDesc);
      }
    }
    
    // Example
    const example = await this.generateFunctionExample(func);
    if (example) {
      markdown.paragraph('**Example:**');
      markdown.codeBlock(example, 'typescript');
    }
  }
  
  private async generateReadme(
    analysis: CodeAnalysis,
    options: DocumentationOptions
  ): Promise<Documentation> {
    const markdown = new MarkdownBuilder();
    
    // Title
    const title = options.projectName || analysis.fileName;
    markdown.heading(1, title);
    
    // Badges (if provided)
    if (options.badges) {
      markdown.paragraph(options.badges.join(' '));
    }
    
    // Description
    markdown.heading(2, 'Description');
    const description = await this.generateProjectDescription(analysis);
    markdown.paragraph(description);
    
    // Installation
    markdown.heading(2, 'Installation');
    markdown.codeBlock(options.installCommand || 'npm install', 'bash');
    
    // Usage
    markdown.heading(2, 'Usage');
    const usageExample = await this.generateUsageExample(analysis);
    markdown.codeBlock(usageExample, analysis.language);
    
    // Features
    markdown.heading(2, 'Features');
    const features = await this.extractFeatures(analysis);
    markdown.list(features);
    
    // API Reference
    markdown.heading(2, 'API Reference');
    markdown.paragraph(`See [API Documentation](./docs/API.md) for detailed API reference.`);
    
    // Contributing
    markdown.heading(2, 'Contributing');
    markdown.paragraph('Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details.');
    
    // License
    markdown.heading(2, 'License');
    markdown.paragraph(options.license || 'MIT');
    
    return {
      type: 'readme',
      sourceFile: analysis.filePath,
      outputPath: path.join(path.dirname(analysis.filePath), 'README.md'),
      items: [{ type: 'readme', name: 'README', content: markdown.toString() }],
    };
  }
  
  private getDocStyle(language: string): string {
    const styles: Record<string, string> = {
      'typescript': 'jsdoc',
      'javascript': 'jsdoc',
      'python': 'docstring',
      'powershell': 'comment-help',
      'csharp': 'xml-doc',
    };
    
    return styles[language] || 'jsdoc';
  }
}
```

### MCP Server Integration

The existing MCP server provides these tools:

```json
{
  "tools": [
    {
      "name": "analyze-code",
      "description": "Analyze source code and extract documentation candidates",
      "inputSchema": {
        "type": "object",
        "properties": {
          "filePath": { "type": "string" },
          "content": { "type": "string" },
          "language": { "type": "string" }
        }
      }
    },
    {
      "name": "generate-documentation",
      "description": "Generate documentation for code element",
      "inputSchema": {
        "type": "object",
        "properties": {
          "prompt": { "type": "string" },
          "style": { "type": "string" },
          "element": { "type": "object" }
        }
      }
    },
    {
      "name": "format-documentation",
      "description": "Format documentation in specified style",
      "inputSchema": {
        "type": "object",
        "properties": {
          "content": { "type": "string" },
          "style": { "type": "string" }
        }
      }
    }
  ]
}
```

### Usage Example

```typescript
// Create documentation agent
const agent = new CodeDocumentationAgent(context);
await agent.initialize(context);

// Generate inline documentation
const result = await agent.execute({
  id: 'doc-001',
  type: 'generate-documentation',
  input: {
    files: ['src/StateManager.ts'],
    documentationType: 'inline',
    options: {
      style: 'jsdoc',
      includeExamples: true,
    },
  },
});

console.log(`Documented ${result.output.totalItemsDocumented} items`);
```

### Configuration

```typescript
interface CodeDocumentationConfig {
  // Documentation style
  defaultStyle: 'jsdoc' | 'typedoc' | 'docstring' | 'xml-doc';
  includeExamples: boolean;
  includeTypeInfo: boolean;
  
  // Generation settings
  autoGenerateOnCreate: boolean;           // Generate docs when file created
  autoUpdateOnChange: boolean;             // Update docs when code changes
  requireDocumentation: boolean;           // Enforce documentation
  
  // Output settings
  apiDocDirectory: string;
  includePrivateMembers: boolean;
  includeInternalMembers: boolean;
  
  // Quality settings
  minDescriptionLength: number;            // Minimum description characters
  requireParameterDocs: boolean;
  requireReturnDocs: boolean;
}
```

---

## Agent 5: Bug Analysis Agent

### Purpose
Automatically diagnose bugs, identify root causes, suggest fixes, and generate bug reports with comprehensive context.

### Capabilities

- **Error Analysis**: Parse stack traces and error messages
- **Root Cause Detection**: Identify underlying causes of bugs
- **Fix Suggestion**: Propose code fixes with explanations
- **Regression Analysis**: Check if bug is a regression
- **Impact Assessment**: Evaluate bug severity and scope
- **Report Generation**: Create detailed bug reports
- **Test Case Generation**: Create tests that reproduce the bug

### Agent Specification

```typescript
export class BugAnalysisAgent implements Agent {
  name = 'Bug Analysis Agent';
  version = '1.0.0';
  capabilities = [
    'error-analysis',
    'root-cause-detection',
    'fix-suggestion',
    'regression-analysis',
    'impact-assessment',
  ];
  
  private errorParser: ErrorParser;
  private codeAnalyzer: CodeAnalyzer;
  private gitAnalyzer: GitAnalyzer;
  
  constructor(private context: AgentContext) {
    this.errorParser = new ErrorParser();
    this.codeAnalyzer = new CodeAnalyzer();
    this.gitAnalyzer = new GitAnalyzer(context.workspaceRoot);
  }
  
  async execute(task: AgentTask): Promise<AgentResult> {
    const startTime = Date.now();
    
    try {
      const { bug, options } = task.input;
      
      // Parse error information
      const errorInfo = await this.parseError(bug);
      
      // Analyze root cause
      const rootCause = await this.analyzeRootCause(errorInfo);
      
      // Check for regression
      const regressionInfo = await this.checkRegression(errorInfo);
      
      // Assess impact
      const impact = await this.assessImpact(errorInfo, rootCause);
      
      // Generate fix suggestions
      const fixes = await this.generateFixSuggestions(rootCause);
      
      // Create reproduction test
      const reproductionTest = await this.generateReproductionTest(errorInfo);
      
      // Generate bug report
      const report = await this.generateBugReport({
        bug,
        errorInfo,
        rootCause,
        regressionInfo,
        impact,
        fixes,
        reproductionTest,
      });
      
      return {
        success: true,
        output: {
          rootCause: rootCause,
          fixes: fixes,
          impact: impact,
          report: report,
          reproductionTest: reproductionTest,
        },
        metrics: {
          duration: Date.now() - startTime,
          fixSuggestionsGenerated: fixes.length,
        },
      };
      
    } catch (error) {
      return {
        success: false,
        output: null,
        metrics: { duration: Date.now() - startTime },
        errors: [error],
      };
    }
  }
  
  private async parseError(bug: Bug): Promise<ErrorInfo> {
    // Extract error information from bug
    const stackTrace = bug.reproduction?.stackTrace || '';
    const errorMessage = bug.description || '';
    
    // Parse stack trace
    const parsedStack = this.errorParser.parseStackTrace(stackTrace);
    
    // Extract file and line information
    const errorLocation = parsedStack.frames[0];
    
    // Load source code at error location
    const sourceCode = await this.loadSourceCode(
      errorLocation.file,
      errorLocation.line,
      20 // context lines
    );
    
    return {
      message: errorMessage,
      type: this.detectErrorType(errorMessage),
      stackTrace: parsedStack,
      location: errorLocation,
      sourceCode: sourceCode,
      environment: bug.environment,
    };
  }
  
  private async analyzeRootCause(errorInfo: ErrorInfo): Promise<RootCause> {
    // Use MCP to analyze with LLM
    const prompt = await this.context.mcpConnection.getPrompt(
      'analyze-bug-root-cause',
      { errorInfo }
    );
    
    const analysis = await this.context.mcpConnection.callTool(
      'analyze-root-cause',
      {
        prompt: prompt,
        errorInfo: errorInfo,
        codeContext: errorInfo.sourceCode,
      }
    );
    
    return {
      description: analysis.description,
      category: analysis.category, // e.g., 'logic-error', 'null-reference', 'race-condition'
      affectedFiles: analysis.affectedFiles,
      confidence: analysis.confidence, // 0-100
      explanation: analysis.explanation,
      relatedIssues: await this.findRelatedIssues(errorInfo),
    };
  }
  
  private async checkRegression(errorInfo: ErrorInfo): Promise<RegressionInfo> {
    // Get git history for affected files
    const history = await this.gitAnalyzer.getFileHistory(
      errorInfo.location.file,
      { limit: 50 }
    );
    
    // Find when error was introduced
    const introducedIn = await this.gitAnalyzer.bisect({
      file: errorInfo.location.file,
      errorPattern: errorInfo.message,
    });
    
    if (introducedIn) {
      const commit = await this.gitAnalyzer.getCommit(introducedIn.sha);
      
      return {
        isRegression: true,
        introducedIn: {
          commit: commit.sha,
          date: commit.date,
          author: commit.author,
          message: commit.message,
        },
        previouslyWorked: true,
        workingVersion: introducedIn.previousSha,
      };
    }
    
    return {
      isRegression: false,
      introducedIn: null,
      previouslyWorked: false,
      workingVersion: null,
    };
  }
  
  private async assessImpact(
    errorInfo: ErrorInfo,
    rootCause: RootCause
  ): Promise<ImpactAssessment> {
    // Analyze affected code paths
    const affectedPaths = await this.codeAnalyzer.findCallers(
      errorInfo.location.file,
      errorInfo.location.function
    );
    
    // Check test coverage
    const testCoverage = await this.codeAnalyzer.getTestCoverage(
      errorInfo.location.file
    );
    
    // Assess severity
    const severity = this.calculateSeverity({
      errorType: errorInfo.type,
      affectedPathsCount: affectedPaths.length,
      testCoverage: testCoverage,
      category: rootCause.category,
    });
    
    return {
      severity: severity,
      affectedComponents: affectedPaths.map(p => p.component),
      affectedUsers: this.estimateAffectedUsers(affectedPaths),
      dataLossRisk: this.assessDataLossRisk(errorInfo, rootCause),
      securityRisk: this.assessSecurityRisk(errorInfo, rootCause),
      workaroundAvailable: await this.checkWorkaroundAvailable(errorInfo),
    };
  }
  
  private async generateFixSuggestions(rootCause: RootCause): Promise<FixSuggestion[]> {
    const fixes: FixSuggestion[] = [];
    
    // Use MCP to generate fix suggestions
    const prompt = await this.context.mcpConnection.getPrompt(
      'generate-bug-fix',
      { rootCause }
    );
    
    const suggestions = await this.context.mcpConnection.callTool(
      'suggest-fixes',
      {
        prompt: prompt,
        rootCause: rootCause,
      }
    );
    
    for (const suggestion of suggestions) {
      fixes.push({
        description: suggestion.description,
        code: suggestion.code,
        file: suggestion.file,
        line: suggestion.line,
        confidence: suggestion.confidence,
        risks: suggestion.risks,
        testingRequired: suggestion.testingRequired,
      });
    }
    
    return fixes;
  }
  
  private async generateReproductionTest(errorInfo: ErrorInfo): Promise<string> {
    // Use Test Generation Agent to create test
    const testAgent = new TestGenerationAgent(this.context);
    
    const testCode = await testAgent.generateReproductionTest({
      errorMessage: errorInfo.message,
      errorLocation: errorInfo.location,
      stackTrace: errorInfo.stackTrace,
    });
    
    return testCode;
  }
  
  private async generateBugReport(data: BugReportData): Promise<string> {
    const markdown = new MarkdownBuilder();
    
    // Title
    markdown.heading(1, `Bug Analysis: ${data.bug.id}`);
    
    // Summary
    markdown.heading(2, 'Summary');
    markdown.paragraph(data.bug.title);
    
    // Error Information
    markdown.heading(2, 'Error Information');
    markdown.paragraph(`**Type:** ${data.errorInfo.type}`);
    markdown.paragraph(`**Location:** ${data.errorInfo.location.file}:${data.errorInfo.location.line}`);
    markdown.codeBlock(data.errorInfo.message, 'text');
    
    // Root Cause
    markdown.heading(2, 'Root Cause Analysis');
    markdown.paragraph(`**Category:** ${data.rootCause.category}`);
    markdown.paragraph(`**Confidence:** ${data.rootCause.confidence}%`);
    markdown.paragraph(data.rootCause.explanation);
    
    // Regression Information
    if (data.regressionInfo.isRegression) {
      markdown.heading(2, 'Regression Information');
      markdown.paragraph(`This is a regression introduced in commit ${data.regressionInfo.introducedIn.commit}`);
      markdown.paragraph(`**Date:** ${data.regressionInfo.introducedIn.date}`);
      markdown.paragraph(`**Author:** ${data.regressionInfo.introducedIn.author}`);
      markdown.paragraph(`**Message:** ${data.regressionInfo.introducedIn.message}`);
    }
    
    // Impact Assessment
    markdown.heading(2, 'Impact Assessment');
    markdown.paragraph(`**Severity:** ${data.impact.severity}`);
    markdown.paragraph(`**Affected Components:** ${data.impact.affectedComponents.join(', ')}`);
    markdown.paragraph(`**Security Risk:** ${data.impact.securityRisk}`);
    markdown.paragraph(`**Data Loss Risk:** ${data.impact.dataLossRisk}`);
    
    // Fix Suggestions
    markdown.heading(2, 'Suggested Fixes');
    for (let i = 0; i < data.fixes.length; i++) {
      const fix = data.fixes[i];
      markdown.heading(3, `Fix Option ${i + 1} (${fix.confidence}% confidence)`);
      markdown.paragraph(fix.description);
      markdown.codeBlock(fix.code, 'typescript');
      
      if (fix.risks.length > 0) {
        markdown.paragraph('**Risks:**');
        markdown.list(fix.risks);
      }
    }
    
    // Reproduction Test
    markdown.heading(2, 'Reproduction Test');
    markdown.codeBlock(data.reproductionTest, 'typescript');
    
    return markdown.toString();
  }
  
  private calculateSeverity(factors: SeverityFactors): number {
    let score = 0;
    
    // Error type weight
    const errorWeights: Record<string, number> = {
      'crash': 5,
      'data-corruption': 5,
      'security': 5,
      'logic-error': 3,
      'ui-error': 2,
      'performance': 2,
    };
    score += errorWeights[factors.errorType] || 3;
    
    // Affected paths weight
    if (factors.affectedPathsCount > 10) score += 2;
    else if (factors.affectedPathsCount > 5) score += 1;
    
    // Test coverage weight (lower coverage = higher severity)
    if (factors.testCoverage < 50) score += 1;
    
    return Math.min(5, score);
  }
}
```

### Usage Example

```typescript
// Create bug analysis agent
const agent = new BugAnalysisAgent(context);

// Analyze a bug
const result = await agent.execute({
  id: 'bug-analysis-001',
  type: 'analyze-bug',
  input: {
    bug: {
      id: 'BUG-456',
      title: 'Application crashes on login',
      description: 'TypeError: Cannot read property "username" of undefined',
      reproduction: {
        stackTrace: `
          at LoginController.authenticate (src/auth/login.ts:45:12)
          at async POST /api/login (src/routes/auth.ts:23:5)
        `,
        steps: [
          'Navigate to /login',
          'Enter credentials',
          'Click login button',
        ],
      },
      environment: 'production',
    },
    options: {
      generateFixes: true,
      checkRegression: true,
      generateTest: true,
    },
  },
});

console.log(`Root cause: ${result.output.rootCause.description}`);
console.log(`Generated ${result.output.fixes.length} fix suggestions`);
console.log(`Severity: ${result.output.impact.severity}/5`);
```

### Configuration

```typescript
interface BugAnalysisConfig {
  // Analysis settings
  maxStackTraceDepth: number;
  contextLines: number;                    // Lines of code context around error
  
  // Root cause analysis
  useHistoricalData: boolean;              // Learn from past bugs
  checkSimilarIssues: boolean;             // Find similar bugs
  
  // Fix generation
  generateFixSuggestions: boolean;
  maxFixSuggestions: number;
  applyAutoFixes: boolean;                 // Apply high-confidence fixes
  
  // Regression analysis
  checkRegression: boolean;
  gitHistoryDepth: number;                 // Commits to analyze
  
  // Testing
  generateReproductionTest: boolean;
  runReproductionTest: boolean;
}
```

---

## Agent 6: Project Roadmap Agent

### Purpose
Manage project planning, track progress, estimate effort, and provide project visibility through automated roadmap generation and maintenance.

**Status**: In Progress - Partial implementation exists

### Capabilities

- **Roadmap Generation**: Create project roadmaps from requirements
- **Progress Tracking**: Monitor feature and bug progress
- **Effort Estimation**: Estimate task completion time using historical data
- **Dependency Analysis**: Identify and visualize task dependencies
- **Risk Assessment**: Identify project risks and mitigation strategies
- **Milestone Planning**: Define and track project milestones
- **Reporting**: Generate status reports and dashboards

### Agent Specification

```typescript
export class ProjectRoadmapAgent implements Agent {
  name = 'Project Roadmap Agent';
  version = '1.0.0';
  capabilities = [
    'roadmap-generation',
    'progress-tracking',
    'effort-estimation',
    'dependency-analysis',
    'risk-assessment',
  ];
  
  private historyAnalyzer: HistoryAnalyzer;
  private dependencyGraph: DependencyGraph;
  
  constructor(private context: AgentContext) {
    this.historyAnalyzer = new HistoryAnalyzer(context.stateManager);
    this.dependencyGraph = new DependencyGraph();
  }
  
  async execute(task: AgentTask): Promise<AgentResult> {
    const startTime = Date.now();
    
    try {
      const { action, input } = task.input;
      
      switch (action) {
        case 'generate-roadmap':
          return await this.generateRoadmap(input);
        
        case 'estimate-effort':
          return await this.estimateEffort(input);
        
        case 'analyze-dependencies':
          return await this.analyzeDependencies(input);
        
        case 'assess-risks':
          return await this.assessRisks(input);
        
        case 'generate-report':
          return await this.generateReport(input);
        
        default:
          throw new Error(`Unknown action: ${action}`);
      }
      
    } catch (error) {
      return {
        success: false,
        output: null,
        metrics: { duration: Date.now() - startTime },
        errors: [error],
      };
    }
  }
  
  private async generateRoadmap(input: RoadmapInput): Promise<AgentResult> {
    const startTime = Date.now();
    
    // Get all features and bugs
    const features = await this.context.stateManager.getAllFeatures();
    const bugs = await this.context.stateManager.getAllBugs();
    
    // Analyze dependencies
    const dependencies = await this.dependencyGraph.analyze(features);
    
    // Estimate efforts
    const estimates = await this.estimateItems([...features, ...bugs]);
    
    // Create phases
    const phases = await this.createPhases(features, dependencies, estimates);
    
    // Identify milestones
    const milestones = await this.identifyMilestones(phases);
    
    // Generate timeline
    const timeline = await this.generateTimeline(phases, milestones);
    
    // Create roadmap document
    const roadmapDoc = await this.createRoadmapDocument({
      phases,
      milestones,
      timeline,
      features,
      bugs,
    });
    
    return {
      success: true,
      output: {
        roadmap: roadmapDoc,
        phases: phases,
        milestones: milestones,
        timeline: timeline,
      },
      metrics: {
        duration: Date.now() - startTime,
        itemsAnalyzed: features.length + bugs.length,
      },
    };
  }
  
  private async estimateEffort(input: EstimationInput): Promise<AgentResult> {
    const startTime = Date.now();
    const estimates: EffortEstimate[] = [];
    
    for (const item of input.items) {
      // Get historical data for similar items
      const similarItems = await this.historyAnalyzer.findSimilar(item);
      
      // Calculate base estimate from historical data
      const baseEstimate = this.calculateBaseEstimate(similarItems);
      
      // Adjust for complexity
      const complexityFactor = this.getComplexityFactor(item.complexity);
      
      // Adjust for dependencies
      const dependencyFactor = await this.getDependencyFactor(item);
      
      // Calculate final estimate
      const estimate = baseEstimate * complexityFactor * dependencyFactor;
      
      estimates.push({
        itemId: item.id,
        estimatedHours: estimate,
        confidence: this.calculateConfidence(similarItems.length),
        breakdown: {
          base: baseEstimate,
          complexityAdjustment: complexityFactor,
          dependencyAdjustment: dependencyFactor,
        },
        similarItems: similarItems.map(si => ({
          id: si.id,
          actualHours: si.actualHours,
          similarity: si.similarity,
        })),
      });
    }
    
    return {
      success: true,
      output: { estimates },
      metrics: {
        duration: Date.now() - startTime,
        itemsEstimated: estimates.length,
      },
    };
  }
  
  private async analyzeDependencies(input: DependencyInput): Promise<AgentResult> {
    const startTime = Date.now();
    
    // Build dependency graph
    await this.dependencyGraph.build(input.items);
    
    // Find critical path
    const criticalPath = this.dependencyGraph.findCriticalPath();
    
    // Identify bottlenecks
    const bottlenecks = this.dependencyGraph.findBottlenecks();
    
    // Calculate parallel work opportunities
    const parallelGroups = this.dependencyGraph.findParallelGroups();
    
    // Visualize graph
    const visualization = await this.visualizeDependencies(this.dependencyGraph);
    
    return {
      success: true,
      output: {
        criticalPath: criticalPath,
        bottlenecks: bottlenecks,
        parallelGroups: parallelGroups,
        visualization: visualization,
        totalDuration: this.calculateTotalDuration(criticalPath),
      },
      metrics: {
        duration: Date.now() - startTime,
      },
    };
  }
  
  private async assessRisks(input: RiskInput): Promise<AgentResult> {
    const startTime = Date.now();
    const risks: Risk[] = [];
    
    // Technical complexity risks
    const complexityRisks = await this.assessComplexityRisks(input.features);
    risks.push(...complexityRisks);
    
    // Dependency risks
    const dependencyRisks = await this.assessDependencyRisks(input.features);
    risks.push(...dependencyRisks);
    
    // Resource risks
    const resourceRisks = await this.assessResourceRisks(input.timeline);
    risks.push(...resourceRisks);
    
    // Schedule risks
    const scheduleRisks = await this.assessScheduleRisks(input.timeline);
    risks.push(...scheduleRisks);
    
    // Generate mitigation strategies
    for (const risk of risks) {
      risk.mitigations = await this.generateMitigations(risk);
    }
    
    return {
      success: true,
      output: {
        risks: risks,
        summary: {
          high: risks.filter(r => r.severity === 'high').length,
          medium: risks.filter(r => r.severity === 'medium').length,
          low: risks.filter(r => r.severity === 'low').length,
        },
      },
      metrics: {
        duration: Date.now() - startTime,
      },
    };
  }
  
  private async generateReport(input: ReportInput): Promise<AgentResult> {
    const startTime = Date.now();
    
    // Gather data
    const features = await this.context.stateManager.getAllFeatures();
    const bugs = await this.context.stateManager.getAllBugs();
    
    // Calculate metrics
    const metrics = {
      features: {
        total: features.length,
        completed: features.filter(f => f.status === 'complete').length,
        inProgress: features.filter(f => f.status === 'in-progress').length,
        blocked: features.filter(f => f.blockers.length > 0).length,
      },
      bugs: {
        total: bugs.length,
        open: bugs.filter(b => b.status === 'open').length,
        inProgress: bugs.filter(b => b.status === 'in-progress').length,
        closed: bugs.filter(b => b.status === 'closed').length,
      },
      velocity: await this.calculateVelocity(),
      compliance: await this.calculateAverageCompliance(),
    };
    
    // Generate report document
    const report = await this.createReportDocument(metrics, input.type);
    
    return {
      success: true,
      output: {
        report: report,
        metrics: metrics,
      },
      metrics: {
        duration: Date.now() - startTime,
      },
    };
  }
  
  private calculateBaseEstimate(similarItems: HistoricalItem[]): number {
    if (similarItems.length === 0) {
      return 8; // Default 1 day
    }
    
    // Weight more recent items higher
    const weightedSum = similarItems.reduce((sum, item, index) => {
      const weight = (similarItems.length - index) / similarItems.length;
      return sum + (item.actualHours * weight * item.similarity);
    }, 0);
    
    const weightSum = similarItems.reduce((sum, item, index) => {
      const weight = (similarItems.length - index) / similarItems.length;
      return sum + (weight * item.similarity);
    }, 0);
    
    return weightedSum / weightSum;
  }
  
  private getComplexityFactor(complexity: number): number {
    // Complexity 1-5 maps to 0.5x-2.0x
    const factors = [0.5, 0.75, 1.0, 1.5, 2.0];
    return factors[complexity - 1] || 1.0;
  }
  
  private async calculateVelocity(): Promise<number> {
    // Calculate average features completed per week
    const history = await this.historyAnalyzer.getCompletionHistory(30); // Last 30 days
    
    const weeksData = this.groupByWeek(history);
    const avgPerWeek = weeksData.reduce((sum, week) => sum + week.count, 0) / weeksData.length;
    
    return avgPerWeek;
  }
  
  private async createRoadmapDocument(data: RoadmapData): Promise<string> {
    const markdown = new MarkdownBuilder();
    
    // Title
    markdown.heading(1, 'Project Roadmap');
    markdown.paragraph(`Generated: ${new Date().toISOString()}`);
    
    // Overview
    markdown.heading(2, 'Overview');
    markdown.paragraph(`Total Features: ${data.features.length}`);
    markdown.paragraph(`Total Bugs: ${data.bugs.length}`);
    markdown.paragraph(`Estimated Duration: ${this.formatDuration(data.timeline.totalDuration)}`);
    
    // Timeline visualization
    markdown.heading(2, 'Timeline');
    markdown.codeBlock(this.renderTimeline(data.timeline), 'text');
    
    // Phases
    markdown.heading(2, 'Development Phases');
    for (const phase of data.phases) {
      markdown.heading(3, phase.name);
      markdown.paragraph(`**Duration:** ${this.formatDuration(phase.duration)}`);
      markdown.paragraph(`**Features:** ${phase.features.length}`);
      markdown.list(phase.features.map(f => `${f.id}: ${f.title}`));
    }
    
    // Milestones
    markdown.heading(2, 'Milestones');
    for (const milestone of data.milestones) {
      markdown.heading(3, milestone.name);
      markdown.paragraph(`**Target Date:** ${milestone.targetDate}`);
      markdown.paragraph(`**Deliverables:** ${milestone.deliverables.join(', ')}`);
    }
    
    return markdown.toString();
  }
}
```

### Usage Example

```typescript
// Create roadmap agent
const agent = new ProjectRoadmapAgent(context);

// Generate project roadmap
const result = await agent.execute({
  id: 'roadmap-001',
  type: 'project-planning',
  input: {
    action: 'generate-roadmap',
    input: {
      includeFeatures: true,
      includeBugs: true,
      estimateEfforts: true,
      identifyRisks: true,
    },
  },
});

console.log('Roadmap generated');
console.log(`Phases: ${result.output.phases.length}`);
console.log(`Milestones: ${result.output.milestones.length}`);
console.log(`Estimated duration: ${result.output.timeline.totalDuration} hours`);
```

### Configuration

```typescript
interface ProjectRoadmapConfig {
  // Estimation settings
  useHistoricalData: boolean;
  minSimilarItems: number;                 // Minimum similar items for estimation
  defaultEstimateHours: number;            // Default if no historical data
  
  // Roadmap generation
  phaseDuration: number;                   // Target phase duration (weeks)
  includeBufferTime: boolean;              // Add buffer for risks
  bufferPercentage: number;                // Buffer % (e.g., 20%)
  
  // Dependency analysis
  analyzeCriticalPath: boolean;
  identifyBottlenecks: boolean;
  maxParallelTasks: number;                // Max concurrent tasks
  
  // Risk assessment
  assessRisks: boolean;
  riskThreshold: 'low' | 'medium' | 'high';
  
  // Reporting
  reportingFrequency: 'daily' | 'weekly' | 'monthly';
  includeVelocityTrends: boolean;
  includeComplianceMetrics: boolean;
}
```

---

## Agent Orchestration System

### Purpose
The Agent Orchestrator coordinates multiple agents to work together on complex tasks, managing dependencies, sequencing, and data flow between agents.

### Orchestration Patterns

#### 1. Sequential Workflow
Execute agents one after another, passing output as input to the next agent.

```typescript
export class AgentOrchestrator {
  private agents: Map<string, Agent> = new Map();
  private workflows: Map<string, Workflow> = new Map();
  
  constructor(private context: AgentContext) {}
  
  registerAgent(agent: Agent): void {
    this.agents.set(agent.name, agent);
  }
  
  async executeSequential(workflow: SequentialWorkflow): Promise<OrchestrationResult> {
    const results: AgentResult[] = [];
    let previousOutput: any = workflow.initialInput;
    
    for (const step of workflow.steps) {
      const agent = this.agents.get(step.agentName);
      if (!agent) {
        throw new Error(`Agent not found: ${step.agentName}`);
      }
      
      // Execute agent with previous output
      const result = await agent.execute({
        id: `${workflow.id}-${step.name}`,
        type: step.taskType,
        input: step.inputMapper 
          ? step.inputMapper(previousOutput)
          : previousOutput,
      });
      
      results.push(result);
      
      // Stop on failure if required
      if (!result.success && step.stopOnFailure) {
        break;
      }
      
      // Pass output to next step
      previousOutput = result.output;
    }
    
    return {
      workflowId: workflow.id,
      success: results.every(r => r.success),
      results: results,
      finalOutput: previousOutput,
    };
  }
}

// Example: Feature Implementation Workflow
const featureWorkflow: SequentialWorkflow = {
  id: 'feature-implementation',
  name: 'Complete Feature Implementation',
  steps: [
    {
      name: 'implement',
      agentName: 'Feature Implementation Agent',
      taskType: 'implement-feature',
      inputMapper: (input) => ({ feature: input }),
      stopOnFailure: true,
    },
    {
      name: 'validate',
      agentName: 'Standards Compliance Agent',
      taskType: 'validate-files',
      inputMapper: (prevOutput) => ({
        files: prevOutput.filesCreated,
        options: { autoFix: true },
      }),
      stopOnFailure: false,
    },
    {
      name: 'test',
      agentName: 'Test Generation Agent',
      taskType: 'generate-tests',
      inputMapper: (prevOutput) => ({
        sourceFiles: prevOutput.files,
        testType: 'unit',
      }),
      stopOnFailure: true,
    },
    {
      name: 'document',
      agentName: 'Code Documentation Agent',
      taskType: 'generate-documentation',
      inputMapper: (prevOutput) => ({
        files: prevOutput.testFiles.concat(prevOutput.sourceFiles),
        documentationType: 'inline',
      }),
      stopOnFailure: false,
    },
  ],
  initialInput: { featureId: 'FEA-123' },
};
```

#### 2. Parallel Workflow
Execute multiple agents concurrently for independent tasks.

```typescript
async executeParallel(workflow: ParallelWorkflow): Promise<OrchestrationResult> {
  const tasks = workflow.tasks.map(task => {
    const agent = this.agents.get(task.agentName);
    if (!agent) {
      throw new Error(`Agent not found: ${task.agentName}`);
    }
    
    return agent.execute({
      id: `${workflow.id}-${task.name}`,
      type: task.taskType,
      input: task.input,
    });
  });
  
  // Execute all in parallel
  const results = await Promise.allSettled(tasks);
  
  // Process results
  const agentResults: AgentResult[] = results.map((r, i) => {
    if (r.status === 'fulfilled') {
      return r.value;
    } else {
      return {
        success: false,
        output: null,
        metrics: { duration: 0 },
        errors: [r.reason],
      };
    }
  });
  
  return {
    workflowId: workflow.id,
    success: workflow.requireAll 
      ? agentResults.every(r => r.success)
      : agentResults.some(r => r.success),
    results: agentResults,
    finalOutput: this.mergeOutputs(agentResults),
  };
}

// Example: Code Quality Workflow (run validations in parallel)
const qualityWorkflow: ParallelWorkflow = {
  id: 'code-quality-check',
  name: 'Parallel Code Quality Checks',
  tasks: [
    {
      name: 'compliance',
      agentName: 'Standards Compliance Agent',
      taskType: 'validate-files',
      input: { files: ['src/**/*.ts'], options: {} },
    },
    {
      name: 'documentation',
      agentName: 'Code Documentation Agent',
      taskType: 'check-documentation',
      input: { files: ['src/**/*.ts'] },
    },
    {
      name: 'test-coverage',
      agentName: 'Test Generation Agent',
      taskType: 'analyze-coverage',
      input: { sourceFiles: ['src/**/*.ts'] },
    },
  ],
  requireAll: false, // Continue even if one fails
};
```

#### 3. Conditional Workflow
Execute agents based on conditions or previous results.

```typescript
async executeConditional(workflow: ConditionalWorkflow): Promise<OrchestrationResult> {
  const results: AgentResult[] = [];
  let context = { ...workflow.initialContext };
  
  for (const step of workflow.steps) {
    // Evaluate condition
    const shouldExecute = step.condition 
      ? await step.condition(context, results)
      : true;
    
    if (!shouldExecute) {
      continue;
    }
    
    // Execute agent
    const agent = this.agents.get(step.agentName);
    const result = await agent.execute({
      id: `${workflow.id}-${step.name}`,
      type: step.taskType,
      input: step.inputMapper(context),
    });
    
    results.push(result);
    
    // Update context
    context = {
      ...context,
      [step.name]: result.output,
    };
    
    // Check exit condition
    if (workflow.exitCondition && await workflow.exitCondition(context, results)) {
      break;
    }
  }
  
  return {
    workflowId: workflow.id,
    success: results.every(r => r.success),
    results: results,
    finalOutput: context,
  };
}

// Example: Bug Fix Workflow (conditional based on analysis)
const bugFixWorkflow: ConditionalWorkflow = {
  id: 'bug-fix',
  name: 'Intelligent Bug Fix',
  initialContext: { bugId: 'BUG-456' },
  steps: [
    {
      name: 'analyze',
      agentName: 'Bug Analysis Agent',
      taskType: 'analyze-bug',
      inputMapper: (ctx) => ({ bug: ctx.bug }),
    },
    {
      name: 'auto-fix',
      agentName: 'Feature Implementation Agent',
      taskType: 'apply-fix',
      condition: async (ctx, results) => {
        const analysis = results[0]?.output;
        return analysis?.fixes[0]?.confidence > 80;
      },
      inputMapper: (ctx) => ({
        fix: ctx.analyze.fixes[0],
      }),
    },
    {
      name: 'manual-guidance',
      agentName: 'Bug Analysis Agent',
      taskType: 'generate-guidance',
      condition: async (ctx, results) => {
        return !results[1]?.success; // Only if auto-fix failed
      },
      inputMapper: (ctx) => ({
        analysis: ctx.analyze,
      }),
    },
    {
      name: 'test',
      agentName: 'Test Generation Agent',
      taskType: 'generate-tests',
      condition: async (ctx, results) => {
        return results[1]?.success; // Only if fix was applied
      },
      inputMapper: (ctx) => ({
        sourceFiles: ctx['auto-fix'].filesModified,
        testType: 'unit',
      }),
    },
  ],
};
```

#### 4. Event-Driven Orchestration
React to events and trigger appropriate agent workflows.

```typescript
export class EventDrivenOrchestrator extends AgentOrchestrator {
  private eventBus: EventEmitter;
  private eventHandlers: Map<string, EventHandler[]> = new Map();
  
  constructor(context: AgentContext) {
    super(context);
    this.eventBus = new EventEmitter();
    this.setupDefaultHandlers();
  }
  
  private setupDefaultHandlers(): void {
    // File saved event
    this.on('file:saved', async (event) => {
      await this.executeSequential({
        id: `file-saved-${event.file}`,
        steps: [
          {
            name: 'compliance',
            agentName: 'Standards Compliance Agent',
            taskType: 'validate-files',
            inputMapper: () => ({ files: [event.file], options: { autoFix: true } }),
          },
        ],
        initialInput: event,
      });
    });
    
    // Feature created event
    this.on('feature:created', async (event) => {
      await this.executeSequential({
        id: `feature-created-${event.featureId}`,
        steps: [
          {
            name: 'roadmap-update',
            agentName: 'Project Roadmap Agent',
            taskType: 'estimate-effort',
            inputMapper: () => ({ items: [event.feature] }),
          },
        ],
        initialInput: event,
      });
    });
    
    // Bug reported event
    this.on('bug:reported', async (event) => {
      await this.executeSequential({
        id: `bug-reported-${event.bugId}`,
        steps: [
          {
            name: 'analyze',
            agentName: 'Bug Analysis Agent',
            taskType: 'analyze-bug',
            inputMapper: () => ({ bug: event.bug }),
          },
        ],
        initialInput: event,
      });
    });
    
    // Phase completed event
    this.on('phase:completed', async (event) => {
      await this.executeParallel({
        id: `phase-completed-${event.itemId}`,
        tasks: [
          {
            name: 'generate-report',
            agentName: 'Project Roadmap Agent',
            taskType: 'generate-report',
            input: { type: 'phase-completion', itemId: event.itemId },
          },
          {
            name: 'update-documentation',
            agentName: 'Code Documentation Agent',
            taskType: 'update-readme',
            input: { changes: event.changes },
          },
        ],
      });
    });
  }
  
  on(eventName: string, handler: EventHandler): void {
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, []);
    }
    this.eventHandlers.get(eventName).push(handler);
    this.eventBus.on(eventName, handler);
  }
  
  emit(eventName: string, data: any): void {
    this.eventBus.emit(eventName, data);
  }
}
```

### Workflow Templates

Pre-defined workflows for common scenarios:

```typescript
export const WorkflowTemplates = {
  // Complete feature development
  FEATURE_COMPLETE: {
    id: 'feature-complete',
    type: 'sequential',
    steps: [
      { agent: 'Feature Implementation', task: 'implement-feature' },
      { agent: 'Standards Compliance', task: 'validate-files' },
      { agent: 'Test Generation', task: 'generate-tests' },
      { agent: 'Code Documentation', task: 'generate-documentation' },
      { agent: 'Project Roadmap', task: 'update-progress' },
    ],
  },
  
  // Bug fix cycle
  BUG_FIX: {
    id: 'bug-fix',
    type: 'conditional',
    steps: [
      { agent: 'Bug Analysis', task: 'analyze-bug' },
      { agent: 'Feature Implementation', task: 'apply-fix', condition: 'high-confidence' },
      { agent: 'Test Generation', task: 'generate-reproduction-test' },
      { agent: 'Standards Compliance', task: 'validate-files' },
    ],
  },
  
  // Code review preparation
  REVIEW_PREP: {
    id: 'review-prep',
    type: 'parallel',
    tasks: [
      { agent: 'Standards Compliance', task: 'validate-all' },
      { agent: 'Test Generation', task: 'analyze-coverage' },
      { agent: 'Code Documentation', task: 'generate-api-docs' },
    ],
  },
  
  // Release preparation
  RELEASE_PREP: {
    id: 'release-prep',
    type: 'sequential',
    steps: [
      { agent: 'Standards Compliance', task: 'full-validation' },
      { agent: 'Test Generation', task: 'generate-e2e-tests' },
      { agent: 'Code Documentation', task: 'generate-release-notes' },
      { agent: 'Project Roadmap', task: 'generate-report' },
    ],
  },
};
```

---

## Inter-Agent Communication

### Communication Protocols

#### 1. Direct Communication
Agents communicate directly via method calls.

```typescript
export class AgentCommunicationManager {
  async directCall(
    sourceAgent: Agent,
    targetAgent: Agent,
    message: AgentMessage
  ): Promise<AgentResponse> {
    // Validate communication permission
    if (!this.canCommunicate(sourceAgent, targetAgent)) {
      throw new Error('Communication not allowed');
    }
    
    // Execute target agent
    const result = await targetAgent.execute({
      id: message.id,
      type: message.type,
      input: message.payload,
    });
    
    return {
      success: result.success,
      data: result.output,
      metadata: result.metrics,
    };
  }
}
```

#### 2. Message Queue
Asynchronous communication via message queue.

```typescript
export class MessageQueue {
  private queue: AgentMessage[] = [];
  private subscribers: Map<string, MessageHandler[]> = new Map();
  
  async publish(message: AgentMessage): Promise<void> {
    this.queue.push(message);
    
    // Notify subscribers
    const handlers = this.subscribers.get(message.type) || [];
    for (const handler of handlers) {
      await handler(message);
    }
  }
  
  subscribe(messageType: string, handler: MessageHandler): void {
    if (!this.subscribers.has(messageType)) {
      this.subscribers.set(messageType, []);
    }
    this.subscribers.get(messageType).push(handler);
  }
}

// Example: Test agent subscribes to code changes
testAgent.subscribe('code:changed', async (message) => {
  await testAgent.execute({
    id: 'test-update',
    type: 'update-tests',
    input: { changedFiles: message.payload.files },
  });
});
```

#### 3. Shared Context
Agents share data through a common context.

```typescript
export class SharedContext {
  private data: Map<string, any> = new Map();
  private watchers: Map<string, ContextWatcher[]> = new Map();
  
  set(key: string, value: any, author: string): void {
    const oldValue = this.data.get(key);
    this.data.set(key, value);
    
    // Notify watchers
    const watchers = this.watchers.get(key) || [];
    for (const watcher of watchers) {
      watcher.onUpdate(key, value, oldValue, author);
    }
  }
  
  get(key: string): any {
    return this.data.get(key);
  }
  
  watch(key: string, watcher: ContextWatcher): void {
    if (!this.watchers.has(key)) {
      this.watchers.set(key, []);
    }
    this.watchers.get(key).push(watcher);
  }
}

// Example: Documentation agent watches code changes
sharedContext.watch('source-files', {
  onUpdate: async (key, newValue, oldValue, author) => {
    if (author !== 'Code Documentation Agent') {
      await docAgent.execute({
        id: 'doc-update',
        type: 'update-documentation',
        input: { changedFiles: newValue },
      });
    }
  },
});
```

---

## Error Handling & Recovery

### Error Handling Strategies

#### 1. Retry with Exponential Backoff

```typescript
export class RetryHandler {
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        // Don't retry if not retryable
        if (!this.isRetryable(error, options.retryableErrors)) {
          throw error;
        }
        
        // Don't retry if max attempts reached
        if (attempt === options.maxAttempts) {
          throw error;
        }
        
        // Wait before retry
        const delay = this.calculateDelay(attempt, options);
        await this.sleep(delay);
        
        console.log(`Retry attempt ${attempt}/${options.maxAttempts}`);
      }
    }
    
    throw lastError;
  }
  
  private calculateDelay(attempt: number, options: RetryOptions): number {
    const baseDelay = options.baseDelay || 1000;
    const maxDelay = options.maxDelay || 30000;
    
    // Exponential backoff: baseDelay * 2^(attempt-1)
    const delay = baseDelay * Math.pow(2, attempt - 1);
    
    // Add jitter
    const jitter = Math.random() * 0.3 * delay;
    
    return Math.min(delay + jitter, maxDelay);
  }
  
  private isRetryable(error: Error, retryableErrors?: string[]): boolean {
    if (!retryableErrors) {
      return true; // Retry all by default
    }
    
    return retryableErrors.some(pattern => 
      error.message.includes(pattern) || error.name === pattern
    );
  }
}
```

#### 2. Circuit Breaker

```typescript
export class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  constructor(private options: CircuitBreakerOptions) {}
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    // Check if circuit is open
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime < this.options.resetTimeout) {
        throw new Error('Circuit breaker is OPEN');
      }
      
      // Try to recover
      this.state = 'half-open';
    }
    
    try {
      const result = await operation();
      
      // Success - reset
      if (this.state === 'half-open') {
        this.state = 'closed';
        this.failureCount = 0;
      }
      
      return result;
      
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = Date.now();
      
      // Open circuit if threshold reached
      if (this.failureCount >= this.options.failureThreshold) {
        this.state = 'open';
        console.error('Circuit breaker opened due to failures');
      }
      
      throw error;
    }
  }
  
  getState(): string {
    return this.state;
  }
  
  reset(): void {
    this.state = 'closed';
    this.failureCount = 0;
    this.lastFailureTime = 0;
  }
}

// Example: Protect MCP calls with circuit breaker
const mcpCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 60000, // 1 minute
});

async function callMCPTool(toolName: string, args: any): Promise<any> {
  return await mcpCircuitBreaker.execute(async () => {
    return await mcp.callTool(toolName, args);
  });
}
```

#### 3. Fallback Strategies

```typescript
export class FallbackHandler {
  async executeWithFallback<T>(
    primary: () => Promise<T>,
    fallbacks: (() => Promise<T>)[],
    options?: FallbackOptions
  ): Promise<T> {
    const errors: Error[] = [];
    
    // Try primary
    try {
      return await primary();
    } catch (error) {
      errors.push(error);
      console.warn('Primary operation failed, trying fallbacks');
    }
    
    // Try fallbacks
    for (let i = 0; i < fallbacks.length; i++) {
      try {
        console.log(`Trying fallback ${i + 1}/${fallbacks.length}`);
        return await fallbacks[i]();
      } catch (error) {
        errors.push(error);
      }
    }
    
    // All failed
    throw new AggregateError(
      errors,
      'All operations failed (primary and all fallbacks)'
    );
  }
}

// Example: Code generation with fallback models
async function generateCode(prompt: string): Promise<string> {
  return await fallbackHandler.executeWithFallback(
    // Primary: GPT-4
    () => mcp.callTool('generate-code-gpt4', { prompt }),
    
    // Fallbacks
    [
      // Fallback 1: GPT-3.5
      () => mcp.callTool('generate-code-gpt3', { prompt }),
      
      // Fallback 2: Local template
      () => generateFromTemplate(prompt),
    ]
  );
}
```

#### 4. Compensating Transactions

```typescript
export class CompensatingTransactionManager {
  private compensations: CompensatingAction[] = [];
  
  async execute<T>(
    actions: TransactionalAction<T>[]
  ): Promise<T[]> {
    const results: T[] = [];
    
    try {
      for (const action of actions) {
        const result = await action.execute();
        results.push(result);
        
        // Register compensation
        if (action.compensate) {
          this.compensations.push({
            name: action.name,
            compensate: () => action.compensate(result),
          });
        }
      }
      
      // Success - clear compensations
      this.compensations = [];
      return results;
      
    } catch (error) {
      console.error('Transaction failed, executing compensations');
      await this.compensate();
      throw error;
    }
  }
  
  private async compensate(): Promise<void> {
    // Execute compensations in reverse order
    const reversed = [...this.compensations].reverse();
    
    for (const compensation of reversed) {
      try {
        await compensation.compensate();
        console.log(`Compensated: ${compensation.name}`);
      } catch (error) {
        console.error(`Compensation failed: ${compensation.name}`, error);
      }
    }
    
    this.compensations = [];
  }
}

// Example: Feature implementation with rollback
await transactionManager.execute([
  {
    name: 'create-files',
    execute: async () => {
      const files = await createFiles(feature);
      return files;
    },
    compensate: async (files) => {
      await deleteFiles(files);
    },
  },
  {
    name: 'update-state',
    execute: async () => {
      await stateManager.saveFeature(feature);
      return feature.id;
    },
    compensate: async (featureId) => {
      await stateManager.deleteFeature(featureId);
    },
  },
  {
    name: 'git-commit',
    execute: async () => {
      const commitSha = await gitCommit('Add feature');
      return commitSha;
    },
    compensate: async (commitSha) => {
      await gitReset(commitSha);
    },
  },
]);
```

---

## Performance Optimization

### Optimization Strategies

#### 1. Caching

```typescript
export class AgentCache {
  private cache: Map<string, CacheEntry> = new Map();
  
  async get<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const entry = this.cache.get(key);
    
    // Return cached if valid
    if (entry && !this.isExpired(entry, ttl)) {
      return entry.value as T;
    }
    
    // Generate new value
    const value = await factory();
    
    // Cache it
    this.cache.set(key, {
      value: value,
      timestamp: Date.now(),
    });
    
    return value;
  }
  
  private isExpired(entry: CacheEntry, ttl?: number): boolean {
    if (!ttl) return false;
    return Date.now() - entry.timestamp > ttl;
  }
  
  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

// Example: Cache compliance results
const complianceCache = new AgentCache();

async function checkCompliance(file: string): Promise<ComplianceResult> {
  return await complianceCache.get(
    `compliance:${file}`,
    () => complianceAgent.execute({
      id: 'check',
      type: 'validate-files',
      input: { files: [file] },
    }),
    300000 // 5 minutes TTL
  );
}
```

#### 2. Batch Processing

```typescript
export class BatchProcessor {
  private queue: BatchItem[] = [];
  private timer: NodeJS.Timeout | null = null;
  
  constructor(private options: BatchOptions) {}
  
  async add<T>(item: T, processor: (items: T[]) => Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({ item, processor, resolve, reject });
      
      // Schedule batch execution
      if (!this.timer) {
        this.timer = setTimeout(
          () => this.processBatch(),
          this.options.delay
        );
      }
      
      // Execute immediately if batch size reached
      if (this.queue.length >= this.options.batchSize) {
        this.processBatch();
      }
    });
  }
  
  private async processBatch(): Promise<void> {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    
    if (this.queue.length === 0) return;
    
    const batch = this.queue.splice(0, this.options.batchSize);
    
    try {
      // Group by processor
      const groups = this.groupByProcessor(batch);
      
      // Process each group
      for (const [processor, items] of groups) {
        const results = await processor(items.map(i => i.item));
        
        // Resolve promises
        items.forEach((item, index) => {
          item.resolve(results[index]);
        });
      }
      
    } catch (error) {
      // Reject all in batch
      batch.forEach(item => item.reject(error));
    }
  }
}

// Example: Batch file validation
const batchProcessor = new BatchProcessor({
  batchSize: 10,
  delay: 1000,
});

async function validateFile(file: string): Promise<ComplianceResult> {
  return await batchProcessor.add(file, async (files) => {
    return await complianceAgent.execute({
      id: 'batch-validate',
      type: 'validate-files',
      input: { files },
    });
  });
}
```

#### 3. Parallel Execution

```typescript
export class ParallelExecutor {
  async executeParallel<T>(
    tasks: (() => Promise<T>)[],
    maxConcurrency: number
  ): Promise<T[]> {
    const results: T[] = [];
    const executing: Promise<void>[] = [];
    
    for (const task of tasks) {
      const promise = task().then(result => {
        results.push(result);
      });
      
      executing.push(promise);
      
      // Limit concurrency
      if (executing.length >= maxConcurrency) {
        await Promise.race(executing);
        executing.splice(
          executing.findIndex(p => p === promise),
          1
        );
      }
    }
    
    // Wait for remaining
    await Promise.all(executing);
    
    return results;
  }
}

// Example: Parallel code generation
const executor = new ParallelExecutor();

const files = await executor.executeParallel(
  components.map(component => 
    () => generateCode(component)
  ),
  5 // Max 5 concurrent generations
);
```

---

## Deployment & Configuration

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 ProjectPlanner Application              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │         Agent Orchestrator                     │    │
│  │  • Workflow management                         │    │
│  │  • Agent lifecycle                             │    │
│  └────────────────┬───────────────────────────────┘    │
│                   │                                      │
│  ┌────────────────┴───────────────────────────────┐    │
│  │              Agent Instances                    │    │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │    │
│  │  │Agent1│ │Agent2│ │Agent3│ │Agent4│ ...       │    │
│  │  └───┬──┘ └───┬──┘ └───┬──┘ └───┬──┘          │    │
│  └──────┼────────┼────────┼────────┼──────────────┘    │
│         │        │        │        │                     │
│  ┌──────▼────────▼────────▼────────▼──────────────┐    │
│  │              MCP Connection Pool                │    │
│  │  • Connection management                        │    │
│  │  • Load balancing                               │    │
│  └──────┬──────────────────────────────────────────┘    │
│         │                                                │
└─────────┼────────────────────────────────────────────────┘
          │
┌─────────▼────────────────────────────────────────────────┐
│                   MCP Servers                            │
├──────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Code Doc    │  │ Code Gen    │  │ Analysis    │     │
│  │ MCP Server  │  │ MCP Server  │  │ MCP Server  │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │             │
│  ┌──────▼────────────────▼────────────────▼──────┐     │
│  │              LLM Provider(s)                   │     │
│  │  • GPT-4, Claude, Local models                 │     │
│  └────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────┘
```

### Configuration Management

```typescript
export interface AgentSystemConfig {
  // Agent settings
  agents: {
    enabled: string[];                     // Which agents to load
    configs: Record<string, AgentConfig>;  // Per-agent configuration
  };
  
  // MCP settings
  mcp: {
    servers: MCPServerConfig[];
    connectionPoolSize: number;
    requestTimeout: number;
    retryAttempts: number;
  };
  
  // Orchestration settings
  orchestration: {
    maxConcurrentAgents: number;
    workflowTimeout: number;
    enableEventDriven: boolean;
  };
  
  // Performance settings
  performance: {
    cacheEnabled: boolean;
    cacheTTL: number;
    batchProcessing: boolean;
    batchSize: number;
    batchDelay: number;
  };
  
  // Error handling
  errorHandling: {
    retryEnabled: boolean;
    maxRetries: number;
    circuitBreakerEnabled: boolean;
    fallbacksEnabled: boolean;
  };
}

// Load configuration
export function loadConfig(): AgentSystemConfig {
  const configPath = path.join(process.cwd(), '.projectplanner', 'agent-config.json');
  
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
  
  return getDefaultConfig();
}
```

### Initialization

```typescript
export class AgentSystem {
  private orchestrator: AgentOrchestrator;
  private agents: Map<string, Agent> = new Map();
  private config: AgentSystemConfig;
  
  async initialize(workspaceRoot: string): Promise<void> {
    // Load configuration
    this.config = loadConfig();
    
    // Initialize context
    const context: AgentContext = {
      workspaceRoot: workspaceRoot,
      stateManager: new StateManager(workspaceRoot),
      standardsEngine: new ComplianceEngine(),
      mcpConnection: await this.createMCPConnection(),
      config: this.config,
    };
    
    // Initialize agents
    await this.initializeAgents(context);
    
    // Initialize orchestrator
    this.orchestrator = new EventDrivenOrchestrator(context);
    
    // Register agents with orchestrator
    for (const [name, agent] of this.agents) {
      this.orchestrator.registerAgent(agent);
    }
    
    console.log(`Agent system initialized with ${this.agents.size} agents`);
  }
  
  private async initializeAgents(context: AgentContext): Promise<void> {
    const enabledAgents = this.config.agents.enabled;
    
    const agentFactories: Record<string, () => Agent> = {
      'Feature Implementation Agent': () => new FeatureImplementationAgent(context),
      'Standards Compliance Agent': () => new StandardsComplianceAgent(context),
      'Test Generation Agent': () => new TestGenerationAgent(context),
      'Code Documentation Agent': () => new CodeDocumentationAgent(context),
      'Bug Analysis Agent': () => new BugAnalysisAgent(context),
      'Project Roadmap Agent': () => new ProjectRoadmapAgent(context),
    };
    
    for (const agentName of enabledAgents) {
      if (agentFactories[agentName]) {
        const agent = agentFactories[agentName]();
        await agent.initialize(context);
        this.agents.set(agentName, agent);
        console.log(`Initialized: ${agentName}`);
      }
    }
  }
  
  getOrchestrator(): AgentOrchestrator {
    return this.orchestrator;
  }
  
  getAgent(name: string): Agent | undefined {
    return this.agents.get(name);
  }
  
  async shutdown(): Promise<void> {
    for (const [name, agent] of this.agents) {
      await agent.shutdown();
      console.log(`Shutdown: ${name}`);
    }
  }
}
```

---

## Complete Integration Example

### End-to-End Feature Implementation

```typescript
// Initialize agent system
const agentSystem = new AgentSystem();
await agentSystem.initialize('C:\\Projects\\MyApp');

const orchestrator = agentSystem.getOrchestrator();

// Execute complete feature workflow
const result = await orchestrator.executeSequential({
  id: 'feature-fea-123',
  name: 'Complete Feature Implementation',
  steps: [
    {
      name: 'implement',
      agentName: 'Feature Implementation Agent',
      taskType: 'implement-feature',
      inputMapper: () => ({
        feature: {
          id: 'FEA-123',
          title: 'User Authentication',
          requirements: [
            'Email/password login',
            'JWT token generation',
            'Password reset flow',
          ],
          technicalSpec: {
            language: 'TypeScript',
            framework: 'Express',
          },
        },
      }),
      stopOnFailure: true,
    },
    {
      name: 'validate',
      agentName: 'Standards Compliance Agent',
      taskType: 'validate-files',
      inputMapper: (prevOutput) => ({
        files: prevOutput.filesCreated,
        options: { autoFix: true },
      }),
      stopOnFailure: false,
    },
    {
      name: 'test',
      agentName: 'Test Generation Agent',
      taskType: 'generate-tests',
      inputMapper: (prevOutput) => ({
        sourceFiles: prevOutput.filesCreated,
        testType: 'all',
        options: {
          targetCoverage: 80,
          runAfterGeneration: true,
        },
      }),
      stopOnFailure: true,
    },
    {
      name: 'document',
      agentName: 'Code Documentation Agent',
      taskType: 'generate-documentation',
      inputMapper: (prevOutput) => ({
        files: prevOutput.sourceFiles.concat(prevOutput.testFiles),
        documentationType: 'inline',
        options: { includeExamples: true },
      }),
      stopOnFailure: false,
    },
    {
      name: 'update-roadmap',
      agentName: 'Project Roadmap Agent',
      taskType: 'update-progress',
      inputMapper: () => ({
        featureId: 'FEA-123',
        phase: 'complete',
      }),
      stopOnFailure: false,
    },
  ],
  initialInput: { featureId: 'FEA-123' },
});

if (result.success) {
  console.log('✅ Feature implementation complete!');
  console.log(`Files created: ${result.results[0].output.filesCreated.length}`);
  console.log(`Tests generated: ${result.results[2].output.testsGenerated}`);
  console.log(`Compliance score: ${result.results[1].output.summary.averageScore}%`);
} else {
  console.error('❌ Feature implementation failed');
  console.error('Failed step:', result.results.find(r => !r.success));
}

// Shutdown
await agentSystem.shutdown();
```

---

## Summary

This completes the **Agent Architecture Specification** with:

✅ **6 Agent Specifications**: Complete implementation details for all agents  
✅ **Agent Orchestration**: Sequential, parallel, conditional, and event-driven workflows  
✅ **Inter-Agent Communication**: Direct calls, message queues, shared context  
✅ **Error Handling**: Retry, circuit breaker, fallback, compensating transactions  
✅ **Performance Optimization**: Caching, batching, parallel execution  
✅ **Deployment**: Architecture, configuration, initialization  
✅ **Integration Examples**: End-to-end workflows

**Total Document**: ~2,800 lines covering complete agent system architecture for ProjectPlanner Phase 2.
