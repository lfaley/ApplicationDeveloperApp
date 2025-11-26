# Integration Layer Specification

## Document Information
- **Version**: 1.0.0
- **Last Updated**: 2025-06-15
- **Status**: Draft
- **Related Documents**: 
  - [Technical Architecture](../architecture/TECHNICAL_ARCHITECTURE.md)
  - [State Management](STATE_MANAGEMENT.md)
  - [Workflow System](WORKFLOW_SYSTEM.md)

## Table of Contents
1. [Integration Overview](#integration-overview)
2. [VS Code Extension](#vs-code-extension)
3. [CLI Tool](#cli-tool)
4. [Git Hooks](#git-hooks)
5. [API Contracts](#api-contracts)
6. [Implementation Examples](#implementation-examples)

---

## Integration Overview

### Purpose
The Integration Layer provides multiple interfaces for developers to interact with ProjectPlanner's workflow system, enabling seamless integration into existing development workflows without disrupting productivity.

### Integration Points
```
┌─────────────────────────────────────────────────────────────┐
│                    Developer Workspace                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  VS Code     │  │  Terminal    │  │  Git Client  │      │
│  │  Extension   │  │  (CLI)       │  │  (Hooks)     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │               │
│         └──────────────────┼──────────────────┘              │
│                            │                                  │
│         ┌──────────────────▼──────────────────┐              │
│         │   ProjectPlanner Core Library       │              │
│         │   (TypeScript/Node.js)              │              │
│         └──────────────────┬──────────────────┘              │
│                            │                                  │
│         ┌──────────────────▼──────────────────┐              │
│         │   State Management Layer            │              │
│         │   (.projectplanner/)                │              │
│         └─────────────────────────────────────┘              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Design Principles
1. **Non-Intrusive**: Integration should enhance, not interrupt, existing workflows
2. **Real-Time**: Provide immediate feedback without requiring context switches
3. **Context-Aware**: Understand current file, branch, and work item context
4. **Consistent**: Same functionality across all integration points
5. **Offline-First**: Work without network connectivity

---

## VS Code Extension

### Extension Overview
The VS Code extension provides real-time workflow awareness, inline compliance guidance, and one-click actions directly in the editor.

### Features

#### 1. Activity Bar View
**Purpose**: Primary interface for workflow management

**Features**:
- Current feature/bug status display
- Quick action buttons (Start, Pause, Complete phase)
- Standards checklist (inline checkboxes)
- Compliance status indicators
- Recent items list

**UI Structure**:
```typescript
interface ActivityBarView {
  sections: {
    currentWork: CurrentWorkSection;      // Active feature/bug
    quickActions: QuickActionsSection;    // Common operations
    standards: StandardsSection;          // Compliance checklist
    recentItems: RecentItemsSection;      // History
  };
}

interface CurrentWorkSection {
  itemId: string;
  itemType: 'feature' | 'bug';
  title: string;
  phase: string;
  progress: number;                        // 0-100
  timeInPhase: string;                     // "2h 15m"
  blockers: Blocker[];
  actions: Action[];                       // Context-specific
}

interface StandardsSection {
  categories: StandardCategory[];
  
  display: {
    showOnlyApplicable: boolean;           // Filter by file type
    showOnlyIncomplete: boolean;
    groupBy: 'category' | 'priority' | 'file';
  };
  
  interactions: {
    onCheckItem: (item: StandardItem) => void;
    onExpandCategory: (category: string) => void;
    onGetGuidance: (item: StandardItem) => void;  // Opens guidance panel
  };
}
```

#### 2. Status Bar Integration
**Purpose**: At-a-glance workflow awareness

**Display Elements**:
```typescript
interface StatusBarItem {
  // Left side
  currentWork: {
    icon: '$(checklist)' | '$(bug)';
    text: string;                          // "FEA-123: Add Login"
    tooltip: string;                       // Full details
    command: 'projectplanner.showCurrentWork';
  };
  
  // Right side
  complianceIndicator: {
    icon: '$(check)' | '$(warning)' | '$(error)';
    text: string;                          // "85% Compliant"
    color: ThemeColor;
    command: 'projectplanner.showCompliance';
  };
}
```

#### 3. Inline Decorations
**Purpose**: Real-time code quality feedback

**Decoration Types**:
```typescript
interface InlineDecoration {
  type: 'hint' | 'suggestion' | 'warning';
  
  triggers: {
    missingDocumentation: boolean;         // Function lacks JSDoc
    missingTests: boolean;                 // No test coverage
    longFunction: boolean;                 // >50 lines
    complexFunction: boolean;              // Cyclomatic complexity >10
    missingErrorHandling: boolean;         // No try/catch or error check
  };
  
  actions: {
    generateDocumentation: () => void;     // AI agent
    generateTests: () => void;             // AI agent
    extractFunction: () => void;           // Refactor
    addErrorHandling: () => void;          // Snippet
  };
}
```

**Example Decoration**:
```typescript
// User sees this in editor:
function processPayment(amount: number, userId: string) {  // ⚠️ Missing documentation
  // Implementation...
}

// Hover tooltip:
// "⚠️ Standards Compliance: Missing function documentation
//  📖 Click to generate JSDoc comment
//  📋 Required by: SDLC-DOC-001"
```

#### 4. Code Actions (Quick Fixes)
**Purpose**: One-click compliance improvements

```typescript
interface CodeActionProvider {
  provideCodeActions(
    document: TextDocument,
    range: Range,
    context: CodeActionContext
  ): CodeAction[];
}

// Available code actions:
const codeActions = {
  documentation: {
    'projectplanner.generateJSDoc': 'Generate JSDoc comment',
    'projectplanner.generateTypeDoc': 'Generate TypeDoc comment',
    'projectplanner.addInlineComment': 'Add explanatory comment',
  },
  
  testing: {
    'projectplanner.generateUnitTest': 'Generate unit test',
    'projectplanner.generateIntegrationTest': 'Generate integration test',
    'projectplanner.addTestCase': 'Add test case to existing suite',
  },
  
  errorHandling: {
    'projectplanner.wrapTryCatch': 'Wrap in try/catch',
    'projectplanner.addNullCheck': 'Add null/undefined check',
    'projectplanner.addValidation': 'Add input validation',
  },
  
  refactoring: {
    'projectplanner.extractFunction': 'Extract to function',
    'projectplanner.extractVariable': 'Extract to variable',
    'projectplanner.simplifyCondition': 'Simplify conditional',
  }
};
```

#### 5. Command Palette Integration
**Purpose**: Keyboard-driven workflow management

```typescript
interface ExtensionCommands {
  // Workflow management
  'projectplanner.createFeature': () => Promise<void>;
  'projectplanner.createBug': () => Promise<void>;
  'projectplanner.switchContext': () => Promise<void>;          // Switch active item
  'projectplanner.completePhase': () => Promise<void>;
  
  // Standards compliance
  'projectplanner.runCompliance': () => Promise<void>;          // Full scan
  'projectplanner.runComplianceFile': (uri: Uri) => Promise<void>;
  'projectplanner.showStandards': () => Promise<void>;
  'projectplanner.getGuidance': (standardId: string) => Promise<void>;
  
  // AI agents
  'projectplanner.generateDocumentation': () => Promise<void>;
  'projectplanner.generateTests': () => Promise<void>;
  'projectplanner.analyzeCode': () => Promise<void>;
  
  // Reporting
  'projectplanner.showDashboard': () => Promise<void>;
  'projectplanner.exportReport': () => Promise<void>;
  'projectplanner.showHistory': () => Promise<void>;
}
```

#### 6. Settings & Configuration
**Purpose**: Customizable behavior

```typescript
interface ExtensionConfiguration {
  // Display preferences
  'projectplanner.statusBar.enabled': boolean;
  'projectplanner.statusBar.showCompliance': boolean;
  'projectplanner.statusBar.showTimeInPhase': boolean;
  
  // Inline decorations
  'projectplanner.decorations.enabled': boolean;
  'projectplanner.decorations.types': ('hint' | 'suggestion' | 'warning')[];
  'projectplanner.decorations.updateDelay': number;              // ms
  
  // Standards compliance
  'projectplanner.compliance.autoCheck': boolean;
  'projectplanner.compliance.checkOnSave': boolean;
  'projectplanner.compliance.checkOnOpen': boolean;
  'projectplanner.compliance.severity': 'error' | 'warning' | 'info';
  
  // AI agents
  'projectplanner.agents.enabled': boolean;
  'projectplanner.agents.autoGenerate': {
    documentation: boolean;
    tests: boolean;
  };
  
  // Performance
  'projectplanner.performance.debounceDelay': number;            // ms
  'projectplanner.performance.maxFileSize': number;              // KB
  'projectplanner.performance.excludePatterns': string[];
}
```

### Extension Architecture

```typescript
// Extension entry point
export class ProjectPlannerExtension {
  private stateManager: StateManager;
  private workflowEngine: WorkflowEngine;
  private complianceEngine: ComplianceEngine;
  private uiManager: UIManager;
  
  async activate(context: vscode.ExtensionContext): Promise<void> {
    // Initialize core services
    this.stateManager = new StateManager(workspaceRoot);
    this.workflowEngine = new WorkflowEngine(this.stateManager);
    this.complianceEngine = new ComplianceEngine(this.stateManager);
    
    // Initialize UI components
    this.uiManager = new UIManager(context, {
      stateManager: this.stateManager,
      workflowEngine: this.workflowEngine,
      complianceEngine: this.complianceEngine,
    });
    
    // Register providers
    this.registerProviders(context);
    
    // Register commands
    this.registerCommands(context);
    
    // Start file watchers
    this.startWatchers(context);
    
    // Initial state load
    await this.loadInitialState();
  }
  
  private registerProviders(context: vscode.ExtensionContext): void {
    // Code action provider
    context.subscriptions.push(
      vscode.languages.registerCodeActionsProvider(
        { scheme: 'file', language: 'typescript' },
        new ComplianceCodeActionProvider(this.complianceEngine)
      )
    );
    
    // Hover provider
    context.subscriptions.push(
      vscode.languages.registerHoverProvider(
        { scheme: 'file' },
        new ComplianceHoverProvider(this.complianceEngine)
      )
    );
    
    // Diagnostic provider
    context.subscriptions.push(
      vscode.languages.registerDocumentDiagnosticProvider(
        { scheme: 'file' },
        new ComplianceDiagnosticProvider(this.complianceEngine)
      )
    );
  }
  
  private registerCommands(context: vscode.ExtensionContext): void {
    const commands: [string, (...args: any[]) => any][] = [
      ['projectplanner.createFeature', () => this.createFeature()],
      ['projectplanner.createBug', () => this.createBug()],
      ['projectplanner.completePhase', () => this.completePhase()],
      ['projectplanner.runCompliance', () => this.runCompliance()],
      ['projectplanner.showDashboard', () => this.showDashboard()],
    ];
    
    commands.forEach(([id, handler]) => {
      context.subscriptions.push(
        vscode.commands.registerCommand(id, handler)
      );
    });
  }
  
  private startWatchers(context: vscode.ExtensionContext): void {
    // Watch for file changes
    const fileWatcher = vscode.workspace.createFileSystemWatcher(
      '**/*.{ts,js,tsx,jsx,py,cs}',
      false, // ignoreCreateEvents
      false, // ignoreChangeEvents
      false  // ignoreDeleteEvents
    );
    
    fileWatcher.onDidChange((uri) => this.onFileChanged(uri));
    fileWatcher.onDidCreate((uri) => this.onFileCreated(uri));
    fileWatcher.onDidDelete((uri) => this.onFileDeleted(uri));
    
    context.subscriptions.push(fileWatcher);
    
    // Watch for active editor changes
    context.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
          this.onEditorChanged(editor);
        }
      })
    );
    
    // Watch for document saves
    context.subscriptions.push(
      vscode.workspace.onDidSaveTextDocument((document) => {
        this.onDocumentSaved(document);
      })
    );
  }
  
  private async onFileChanged(uri: vscode.Uri): Promise<void> {
    // Check compliance if enabled
    if (this.getConfig('compliance.checkOnSave')) {
      await this.complianceEngine.checkFile(uri.fsPath);
    }
    
    // Update UI
    this.uiManager.refresh();
  }
  
  private async onDocumentSaved(document: vscode.TextDocument): Promise<void> {
    // Track file modifications for current work item
    const currentItem = await this.stateManager.getCurrentItem();
    if (currentItem) {
      await this.stateManager.trackFileModification(
        currentItem.id,
        document.uri.fsPath
      );
    }
    
    // Run compliance check
    await this.onFileChanged(document.uri);
  }
}
```

### UI Components

#### Activity Bar Tree View
```typescript
export class WorkflowTreeProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<TreeItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  
  constructor(
    private stateManager: StateManager,
    private workflowEngine: WorkflowEngine
  ) {}
  
  getTreeItem(element: TreeItem): vscode.TreeItem {
    return element;
  }
  
  async getChildren(element?: TreeItem): Promise<TreeItem[]> {
    if (!element) {
      // Root level
      return [
        new CurrentWorkItem(await this.stateManager.getCurrentItem()),
        new QuickActionsItem(),
        new StandardsItem(await this.stateManager.getStandards()),
        new RecentItemsItem(await this.stateManager.getRecentItems()),
      ];
    }
    
    // Child items
    return element.getChildren();
  }
  
  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }
}

class CurrentWorkItem extends vscode.TreeItem {
  constructor(private item: Feature | Bug | null) {
    super(
      item ? `${item.id}: ${item.title}` : 'No active work',
      vscode.TreeItemCollapsibleState.Expanded
    );
    
    if (item) {
      this.description = item.phase.current;
      this.tooltip = this.buildTooltip(item);
      this.contextValue = 'currentWork';
      this.iconPath = new vscode.ThemeIcon(
        item.type === 'feature' ? 'checklist' : 'bug'
      );
    }
  }
  
  async getChildren(): Promise<vscode.TreeItem[]> {
    if (!this.item) return [];
    
    return [
      new TreeItem(`Phase: ${this.item.phase.current}`, 'phase'),
      new TreeItem(`Progress: ${this.item.phase.progress}%`, 'progress'),
      new TreeItem(`Time: ${this.formatTime(this.item.phase.timeInPhase)}`, 'time'),
      new ActionItem('Complete Phase', 'projectplanner.completePhase'),
      new ActionItem('View Details', 'projectplanner.showDetails'),
    ];
  }
  
  private buildTooltip(item: Feature | Bug): vscode.MarkdownString {
    const md = new vscode.MarkdownString();
    md.appendMarkdown(`## ${item.id}: ${item.title}\n\n`);
    md.appendMarkdown(`**Phase**: ${item.phase.current}\n\n`);
    md.appendMarkdown(`**Progress**: ${item.phase.progress}%\n\n`);
    md.appendMarkdown(`**Time in Phase**: ${this.formatTime(item.phase.timeInPhase)}\n\n`);
    
    if (item.blockers.length > 0) {
      md.appendMarkdown(`\n### ⚠️ Blockers\n`);
      item.blockers.forEach(b => {
        md.appendMarkdown(`- ${b.description}\n`);
      });
    }
    
    md.isTrusted = true;
    return md;
  }
}
```

---

## CLI Tool

### CLI Overview
The CLI provides terminal-based access to ProjectPlanner functionality, ideal for scripting, automation, and developers who prefer command-line workflows.

### Command Structure
```bash
planner <command> [subcommand] [options]
```

### Core Commands

#### 1. Feature Management
```bash
# Create a new feature
planner feature create [options]
  --title <string>           # Feature title (required)
  --description <string>     # Feature description
  --priority <1-5>           # Priority level (default: 3)
  --complexity <1-5>         # Complexity estimate (default: 3)
  --assignee <string>        # Assignee name
  --labels <string[]>        # Comma-separated labels
  --interactive, -i          # Launch interactive prompt
  --template <name>          # Use predefined template

# List features
planner feature list [options]
  --status <status>          # Filter by status
  --phase <phase>            # Filter by phase
  --assignee <name>          # Filter by assignee
  --priority <1-5>           # Filter by priority
  --format <table|json|csv>  # Output format (default: table)
  --sort <field>             # Sort by field
  --limit <number>           # Limit results

# Show feature details
planner feature show <feature-id>
  --format <text|json>       # Output format (default: text)
  --include-history          # Include change history
  --include-checklist        # Include standards checklist

# Update feature
planner feature update <feature-id> [options]
  --phase <phase>            # Move to phase
  --status <status>          # Update status
  --progress <0-100>         # Update progress percentage
  --notes <string>           # Add notes
  --add-label <string>       # Add label
  --remove-label <string>    # Remove label

# Complete feature phase
planner feature complete-phase <feature-id> [options]
  --notes <string>           # Completion notes
  --skip-validation          # Skip quality gate validation (not recommended)
  --force                    # Force completion even with blockers
```

#### 2. Bug Management
```bash
# Create a bug
planner bug create [options]
  --title <string>           # Bug title (required)
  --description <string>     # Bug description
  --severity <1-5>           # Severity level (required)
  --priority <1-5>           # Priority level
  --environment <string>     # Environment where bug occurs
  --steps <string>           # Steps to reproduce
  --expected <string>        # Expected behavior
  --actual <string>          # Actual behavior
  --interactive, -i          # Launch interactive prompt

# List bugs
planner bug list [options]
  --status <status>          # Filter by status
  --severity <1-5>           # Filter by severity
  --priority <1-5>           # Filter by priority
  --format <table|json|csv>  # Output format

# Show bug details
planner bug show <bug-id>
  --format <text|json>

# Update bug
planner bug update <bug-id> [options]
  --status <status>
  --severity <1-5>
  --root-cause <string>      # Document root cause
  --fix-description <string> # Describe fix
  --add-related <id>         # Link related issue

# Close bug
planner bug close <bug-id> [options]
  --verified                 # Mark as verified
  --notes <string>
```

#### 3. Workflow Management
```bash
# Start working on an item
planner work start <item-id>
  --branch <name>            # Create/switch to branch

# Switch context
planner work switch <item-id>
  --save-state               # Save current work state

# Show current work
planner work current
  --format <text|json>

# Pause work
planner work pause [item-id]
  --notes <string>

# Complete current phase
planner work complete-phase [options]
  --notes <string>
  --skip-validation
```

#### 4. Standards Compliance
```bash
# Run compliance check
planner compliance check [options]
  --file <path>              # Check specific file
  --directory <path>         # Check directory
  --item <id>                # Check specific work item
  --severity <level>         # Minimum severity to report
  --format <table|json>
  --fix                      # Auto-fix issues where possible

# Show standards
planner compliance standards [options]
  --category <name>          # Filter by category
  --search <term>            # Search standards
  --format <table|json>

# Get standard guidance
planner compliance guidance <standard-id>
  --format <text|markdown>

# Export compliance report
planner compliance report [options]
  --item <id>                # Report for specific item
  --format <html|pdf|json>
  --output <path>
```

#### 5. AI Agent Commands
```bash
# Generate documentation
planner agent docs [options]
  --file <path>              # Generate for specific file
  --item <id>                # Generate for work item
  --style <jsdoc|typedoc>    # Documentation style

# Generate tests
planner agent tests [options]
  --file <path>              # Generate tests for file
  --framework <jest|mocha>   # Test framework
  --coverage-target <0-100>  # Coverage target

# Analyze code
planner agent analyze [options]
  --file <path>
  --type <complexity|quality|security>

# Interactive agent
planner agent chat
  --agent <name>             # Specific agent (docs, test, bug, etc.)
```

#### 6. Reporting & Analytics
```bash
# Show dashboard
planner dashboard
  --format <text|json>
  --metrics <metric[]>       # Specific metrics to show

# Export report
planner report export [options]
  --type <sprint|release|custom>
  --format <html|pdf|json>
  --output <path>
  --date-range <start..end>

# Show metrics
planner metrics [options]
  --type <velocity|quality|compliance>
  --period <week|month|quarter>

# Show history
planner history <item-id> [options]
  --format <text|json>
  --limit <number>
```

#### 7. Configuration
```bash
# Initialize project
planner init [options]
  --template <name>          # Use template (web, api, lib)
  --interactive, -i          # Interactive setup

# Configure settings
planner config get <key>
planner config set <key> <value>
planner config list

# Manage templates
planner template list
planner template show <name>
planner template create <name>

# Manage standards
planner standards import <file>
planner standards export <file>
```

### CLI Architecture

```typescript
// CLI entry point
export class ProjectPlannerCLI {
  private program: Command;
  private stateManager: StateManager;
  private workflowEngine: WorkflowEngine;
  private complianceEngine: ComplianceEngine;
  
  constructor() {
    this.program = new Command();
    this.setupCommands();
  }
  
  private setupCommands(): void {
    this.program
      .name('planner')
      .description('ProjectPlanner CLI - Standards-driven development workflow')
      .version('2.0.0');
    
    // Feature commands
    const featureCmd = this.program
      .command('feature')
      .description('Feature management commands');
    
    featureCmd
      .command('create')
      .description('Create a new feature')
      .option('-t, --title <string>', 'Feature title')
      .option('-d, --description <string>', 'Feature description')
      .option('-p, --priority <1-5>', 'Priority level', '3')
      .option('-i, --interactive', 'Interactive mode')
      .action(async (options) => {
        await this.handleFeatureCreate(options);
      });
    
    featureCmd
      .command('list')
      .description('List features')
      .option('--status <status>', 'Filter by status')
      .option('--phase <phase>', 'Filter by phase')
      .option('--format <format>', 'Output format', 'table')
      .action(async (options) => {
        await this.handleFeatureList(options);
      });
    
    // Additional commands...
  }
  
  private async handleFeatureCreate(options: any): Promise<void> {
    // Interactive mode
    if (options.interactive) {
      const answers = await this.promptFeatureDetails();
      options = { ...options, ...answers };
    }
    
    // Validate required fields
    if (!options.title) {
      console.error('Error: --title is required');
      process.exit(1);
    }
    
    // Create feature
    const feature = await this.workflowEngine.createFeature({
      title: options.title,
      description: options.description,
      priority: parseInt(options.priority),
      complexity: parseInt(options.complexity || '3'),
      assignee: options.assignee,
      labels: options.labels?.split(',') || [],
    });
    
    // Display result
    console.log(chalk.green('✓ Feature created successfully'));
    console.log(`  ID: ${chalk.bold(feature.id)}`);
    console.log(`  Title: ${feature.title}`);
    console.log(`  Phase: ${feature.phase.current}`);
    console.log(`\nNext steps:`);
    console.log(`  1. Start working: ${chalk.cyan(`planner work start ${feature.id}`)}`);
    console.log(`  2. View details: ${chalk.cyan(`planner feature show ${feature.id}`)}`);
  }
  
  private async promptFeatureDetails(): Promise<any> {
    const inquirer = await import('inquirer');
    
    return inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Feature title:',
        validate: (input) => input.length > 0 || 'Title is required',
      },
      {
        type: 'editor',
        name: 'description',
        message: 'Feature description (opens editor):',
      },
      {
        type: 'list',
        name: 'priority',
        message: 'Priority:',
        choices: [
          { name: '1 - Critical', value: 1 },
          { name: '2 - High', value: 2 },
          { name: '3 - Medium', value: 3 },
          { name: '4 - Low', value: 4 },
          { name: '5 - Very Low', value: 5 },
        ],
        default: 2,
      },
      {
        type: 'list',
        name: 'complexity',
        message: 'Complexity estimate:',
        choices: [
          { name: '1 - Trivial (< 1 hour)', value: 1 },
          { name: '2 - Simple (1-4 hours)', value: 2 },
          { name: '3 - Moderate (1-2 days)', value: 3 },
          { name: '4 - Complex (3-5 days)', value: 4 },
          { name: '5 - Very Complex (> 1 week)', value: 5 },
        ],
        default: 2,
      },
      {
        type: 'input',
        name: 'assignee',
        message: 'Assignee (optional):',
      },
      {
        type: 'input',
        name: 'labels',
        message: 'Labels (comma-separated, optional):',
      },
    ]);
  }
  
  private async handleFeatureList(options: any): Promise<void> {
    // Get features from state
    const features = await this.stateManager.queryFeatures({
      status: options.status,
      phase: options.phase,
    });
    
    // Format output
    if (options.format === 'json') {
      console.log(JSON.stringify(features, null, 2));
      return;
    }
    
    // Table format
    const table = new Table({
      head: ['ID', 'Title', 'Phase', 'Status', 'Priority', 'Progress'],
      colWidths: [12, 40, 15, 12, 10, 10],
    });
    
    features.forEach(f => {
      table.push([
        chalk.cyan(f.id),
        f.title.length > 37 ? f.title.substring(0, 34) + '...' : f.title,
        f.phase.current,
        this.colorizeStatus(f.status),
        this.colorizePriority(f.priority),
        `${f.phase.progress}%`,
      ]);
    });
    
    console.log(table.toString());
    console.log(`\nTotal: ${features.length} features`);
  }
}
```

### Interactive Prompts
```typescript
export class InteractiveCLI {
  async createFeatureInteractive(): Promise<Feature> {
    const inquirer = await import('inquirer');
    
    // Step 1: Basic information
    const basic = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Feature title:',
        validate: (input) => input.length > 0,
      },
      {
        type: 'editor',
        name: 'description',
        message: 'Description (opens editor):',
      },
    ]);
    
    // Step 2: Classification
    const classification = await inquirer.prompt([
      {
        type: 'list',
        name: 'priority',
        message: 'Priority:',
        choices: [
          { name: '⚠️  Critical - Must have', value: 1 },
          { name: '🔴 High - Should have', value: 2 },
          { name: '🟡 Medium - Could have', value: 3 },
          { name: '🟢 Low - Nice to have', value: 4 },
        ],
      },
      {
        type: 'list',
        name: 'complexity',
        message: 'Estimated complexity:',
        choices: [
          { name: '⚡ Trivial (< 1 hour)', value: 1 },
          { name: '✅ Simple (1-4 hours)', value: 2 },
          { name: '📦 Moderate (1-2 days)', value: 3 },
          { name: '🏗️  Complex (3-5 days)', value: 4 },
          { name: '🏔️  Very Complex (> 1 week)', value: 5 },
        ],
      },
    ]);
    
    // Step 3: Additional details
    const details = await inquirer.prompt([
      {
        type: 'input',
        name: 'assignee',
        message: 'Assignee (optional):',
      },
      {
        type: 'checkbox',
        name: 'labels',
        message: 'Labels:',
        choices: [
          'backend',
          'frontend',
          'database',
          'api',
          'ui',
          'performance',
          'security',
        ],
      },
      {
        type: 'confirm',
        name: 'startNow',
        message: 'Start working on this feature now?',
        default: true,
      },
    ]);
    
    // Create feature
    const feature = await this.workflowEngine.createFeature({
      ...basic,
      ...classification,
      ...details,
    });
    
    // Start working if requested
    if (details.startNow) {
      await this.workflowEngine.startWork(feature.id);
      console.log(chalk.green(`\n✓ Started working on ${feature.id}`));
    }
    
    return feature;
  }
}
```

---

## Git Hooks

### Git Hooks Overview
Git hooks provide automated workflow integration at key points in the Git workflow, ensuring compliance and tracking without manual intervention.

### Hook Types

#### 1. Pre-Commit Hook
**Purpose**: Validate code before committing

**Checks**:
```typescript
interface PreCommitChecks {
  // Compliance checks
  runComplianceCheck: boolean;         // Run standards validation
  blockOnFailure: boolean;             // Prevent commit if failures
  
  // File checks
  checkFileSize: boolean;              // Warn on large files
  checkBinaryFiles: boolean;           // Warn on binary files
  
  // Code quality
  runLinter: boolean;                  // Run linter (if configured)
  runFormatter: boolean;               // Check formatting
  
  // Documentation
  requireCommitMessage: boolean;       // Validate commit message format
  linkToWorkItem: boolean;             // Require work item reference
}
```

**Implementation**:
```bash
#!/usr/bin/env node
// .git/hooks/pre-commit

const { execSync } = require('child_process');
const path = require('path');

// Check if ProjectPlanner is initialized
const ppDir = path.join(process.cwd(), '.projectplanner');
if (!require('fs').existsSync(ppDir)) {
  console.log('ProjectPlanner not initialized. Skipping hooks.');
  process.exit(0);
}

// Run compliance check on staged files
console.log('Running ProjectPlanner compliance check...');
try {
  const result = execSync('planner compliance check --staged --format json', {
    encoding: 'utf-8',
  });
  
  const compliance = JSON.parse(result);
  
  if (compliance.failures.length > 0) {
    console.error('\n❌ Compliance check failed:\n');
    compliance.failures.forEach(f => {
      console.error(`  ${f.file}:${f.line} - ${f.standard}: ${f.message}`);
    });
    
    console.error('\nFix these issues or use --no-verify to skip this check.');
    process.exit(1);
  }
  
  console.log('✓ Compliance check passed');
  
} catch (error) {
  console.error('Error running compliance check:', error.message);
  process.exit(1);
}

// Check for work item reference in commit message
const commitMsgFile = process.argv[2];
if (commitMsgFile) {
  const fs = require('fs');
  const message = fs.readFileSync(commitMsgFile, 'utf-8');
  
  // Look for FEA-XXX or BUG-XXX pattern
  const workItemPattern = /\b(FEA|BUG)-\d+\b/;
  if (!workItemPattern.test(message)) {
    console.error('\n❌ Commit message must reference a work item (FEA-XXX or BUG-XXX)');
    console.error('Example: "FEA-123: Implement user authentication"');
    process.exit(1);
  }
}

process.exit(0);
```

#### 2. Commit-Msg Hook
**Purpose**: Validate and enhance commit messages

**Validation Rules**:
```typescript
interface CommitMessageRules {
  format: RegExp;                      // Message format pattern
  minLength: number;                   // Minimum message length
  maxLength: number;                   // Maximum message length
  requireWorkItem: boolean;            // Must reference work item
  requireType: boolean;                // Must have type prefix
  blockedPatterns: RegExp[];           // Disallowed patterns
}

const defaultRules: CommitMessageRules = {
  format: /^(FEA|BUG)-\d+: .+$/,
  minLength: 10,
  maxLength: 72,
  requireWorkItem: true,
  requireType: false,
  blockedPatterns: [
    /WIP/i,
    /TODO/i,
    /FIXME/i,
  ],
};
```

**Implementation**:
```bash
#!/usr/bin/env node
// .git/hooks/commit-msg

const fs = require('fs');
const path = require('path');

const commitMsgFile = process.argv[2];
const message = fs.readFileSync(commitMsgFile, 'utf-8').trim();

// Skip merge commits
if (message.startsWith('Merge')) {
  process.exit(0);
}

// Validate format
const pattern = /^(FEA|BUG)-(\d+): (.+)$/;
const match = message.match(pattern);

if (!match) {
  console.error('\n❌ Invalid commit message format');
  console.error('Expected: FEA-XXX: Description or BUG-XXX: Description');
  console.error(`Got: ${message}`);
  process.exit(1);
}

const [, type, id, description] = match;
const workItemId = `${type}-${id}`;

// Validate length
if (description.length < 10) {
  console.error('\n❌ Commit message too short (minimum 10 characters)');
  process.exit(1);
}

if (message.length > 72) {
  console.warn('\n⚠️  Commit message exceeds 72 characters (best practice)');
  // Don't fail, just warn
}

// Verify work item exists
const { execSync } = require('child_process');
try {
  const result = execSync(`planner feature show ${workItemId} --format json`, {
    encoding: 'utf-8',
  });
  
  const workItem = JSON.parse(result);
  console.log(`✓ Linked to ${workItemId}: ${workItem.title}`);
  
} catch (error) {
  console.error(`\n❌ Work item ${workItemId} not found`);
  console.error('Create it first: planner feature create --interactive');
  process.exit(1);
}

// Auto-track commit in work item
try {
  execSync(`planner feature update ${workItemId} --add-commit ${process.env.GIT_COMMIT || 'HEAD'}`, {
    encoding: 'utf-8',
  });
} catch (error) {
  // Non-fatal
  console.warn('Warning: Could not track commit in work item');
}

process.exit(0);
```

#### 3. Pre-Push Hook
**Purpose**: Final validation before pushing to remote

**Checks**:
```typescript
interface PrePushChecks {
  // Work item validation
  requireActiveWorkItem: boolean;      // Must have active work item
  requirePhaseCompletion: boolean;     // Current phase must be complete
  
  // Quality gates
  requireTests: boolean;               // Tests must exist and pass
  requireDocumentation: boolean;       // Documentation must be complete
  requireCompliance: boolean;          // Compliance must pass
  
  // Branch protection
  protectedBranches: string[];         // Branches requiring extra validation
  requireReview: boolean;              // Require code review approval
}
```

**Implementation**:
```bash
#!/usr/bin/env node
// .git/hooks/pre-push

const { execSync } = require('child_process');

console.log('Running ProjectPlanner pre-push validation...');

// Get current branch
const branch = execSync('git rev-parse --abbrev-ref HEAD', {
  encoding: 'utf-8',
}).trim();

// Check for active work item
let currentWork;
try {
  const result = execSync('planner work current --format json', {
    encoding: 'utf-8',
  });
  currentWork = JSON.parse(result);
} catch (error) {
  console.error('\n❌ No active work item');
  console.error('Start working on a feature/bug: planner work start <item-id>');
  process.exit(1);
}

console.log(`✓ Active work: ${currentWork.id}`);

// Run full compliance check
console.log('Running full compliance check...');
try {
  execSync('planner compliance check --format json', {
    encoding: 'utf-8',
    stdio: 'inherit',
  });
  console.log('✓ Compliance check passed');
} catch (error) {
  console.error('\n❌ Compliance check failed');
  process.exit(1);
}

// Check if pushing to protected branch
const protectedBranches = ['main', 'master', 'production'];
if (protectedBranches.includes(branch)) {
  console.log(`\n⚠️  Pushing to protected branch: ${branch}`);
  
  // Require phase completion
  if (currentWork.phase.current !== 'Complete') {
    console.error(`❌ Work item must be in Complete phase (currently: ${currentWork.phase.current})`);
    process.exit(1);
  }
  
  // Require review
  if (!currentWork.reviews || currentWork.reviews.length === 0) {
    console.error('❌ Code review required before pushing to protected branch');
    process.exit(1);
  }
}

console.log('✓ Pre-push validation passed');
process.exit(0);
```

#### 4. Post-Merge Hook
**Purpose**: Update state after merge

**Actions**:
```typescript
interface PostMergeActions {
  // State updates
  updateWorkItemStatus: boolean;       // Auto-update status
  archiveCompletedWork: boolean;       // Archive completed items
  
  // Notifications
  notifyTeam: boolean;                 // Send notifications
  updateDashboard: boolean;            // Refresh dashboard
  
  // Cleanup
  deleteMergedBranch: boolean;         // Delete feature branch
  cleanupTempFiles: boolean;           // Remove temp files
}
```

**Implementation**:
```bash
#!/usr/bin/env node
// .git/hooks/post-merge

const { execSync } = require('child_process');

console.log('ProjectPlanner post-merge hook...');

// Get merged branch name (from MERGE_HEAD)
const mergeHead = execSync('git rev-parse MERGE_HEAD', {
  encoding: 'utf-8',
}).trim();

const branchName = execSync(`git name-rev ${mergeHead}`, {
  encoding: 'utf-8',
}).trim();

console.log(`Merged: ${branchName}`);

// Extract work item ID from branch name
const match = branchName.match(/(FEA|BUG)-\d+/);
if (match) {
  const workItemId = match[0];
  console.log(`Detected work item: ${workItemId}`);
  
  // Check if work should be completed
  try {
    const result = execSync(`planner feature show ${workItemId} --format json`, {
      encoding: 'utf-8',
    });
    const workItem = JSON.parse(result);
    
    if (workItem.phase.current === 'Review') {
      // Auto-complete work item
      execSync(`planner feature complete-phase ${workItemId} --notes "Auto-completed after merge"`, {
        stdio: 'inherit',
      });
      console.log(`✓ Completed work item ${workItemId}`);
    }
  } catch (error) {
    console.warn('Could not auto-complete work item');
  }
}

// Refresh compliance cache
try {
  execSync('planner compliance check --cache-refresh', {
    stdio: 'inherit',
  });
} catch (error) {
  // Non-fatal
}

process.exit(0);
```

### Hook Installation
```typescript
export class GitHooksManager {
  async installHooks(projectRoot: string): Promise<void> {
    const gitDir = path.join(projectRoot, '.git');
    if (!fs.existsSync(gitDir)) {
      throw new Error('Not a git repository');
    }
    
    const hooksDir = path.join(gitDir, 'hooks');
    const hooks = [
      'pre-commit',
      'commit-msg',
      'pre-push',
      'post-merge',
    ];
    
    for (const hook of hooks) {
      const hookPath = path.join(hooksDir, hook);
      const templatePath = path.join(__dirname, 'templates', `${hook}.template`);
      
      // Backup existing hook
      if (fs.existsSync(hookPath)) {
        fs.renameSync(hookPath, `${hookPath}.backup`);
        console.log(`Backed up existing ${hook} hook`);
      }
      
      // Copy template
      fs.copyFileSync(templatePath, hookPath);
      fs.chmodSync(hookPath, '755');
      
      console.log(`✓ Installed ${hook} hook`);
    }
  }
  
  async uninstallHooks(projectRoot: string): Promise<void> {
    const gitDir = path.join(projectRoot, '.git', 'hooks');
    const hooks = ['pre-commit', 'commit-msg', 'pre-push', 'post-merge'];
    
    for (const hook of hooks) {
      const hookPath = path.join(gitDir, hook);
      const backupPath = `${hookPath}.backup`;
      
      // Remove ProjectPlanner hook
      if (fs.existsSync(hookPath)) {
        fs.unlinkSync(hookPath);
      }
      
      // Restore backup if exists
      if (fs.existsSync(backupPath)) {
        fs.renameSync(backupPath, hookPath);
        console.log(`✓ Restored ${hook} hook from backup`);
      }
    }
  }
}
```

---

## API Contracts

### Core Library Interface
```typescript
// Main entry point
export class ProjectPlanner {
  constructor(options?: ProjectPlannerOptions);
  
  // State management
  readonly state: StateManager;
  
  // Workflow engine
  readonly workflow: WorkflowEngine;
  
  // Compliance engine
  readonly compliance: ComplianceEngine;
  
  // Agent orchestrator
  readonly agents: AgentOrchestrator;
  
  // Initialize
  async initialize(workspaceRoot: string): Promise<void>;
  
  // Shutdown
  async shutdown(): Promise<void>;
}

export interface ProjectPlannerOptions {
  // Storage options
  storageDir?: string;                   // Default: .projectplanner/
  
  // Compliance options
  complianceConfig?: ComplianceConfig;
  
  // Agent options
  agentConfig?: AgentConfig;
  
  // Performance options
  cacheEnabled?: boolean;
  cacheSize?: number;
}
```

### Event System
```typescript
export interface EventEmitter {
  // Feature events
  on(event: 'feature:created', listener: (feature: Feature) => void): void;
  on(event: 'feature:updated', listener: (feature: Feature) => void): void;
  on(event: 'feature:phaseChanged', listener: (feature: Feature, oldPhase: string) => void): void;
  on(event: 'feature:completed', listener: (feature: Feature) => void): void;
  
  // Bug events
  on(event: 'bug:created', listener: (bug: Bug) => void): void;
  on(event: 'bug:updated', listener: (bug: Bug) => void): void;
  on(event: 'bug:closed', listener: (bug: Bug) => void): void;
  
  // Compliance events
  on(event: 'compliance:checkStarted', listener: (context: CheckContext) => void): void;
  on(event: 'compliance:checkCompleted', listener: (result: ComplianceResult) => void): void;
  on(event: 'compliance:violation', listener: (violation: Violation) => void): void;
  
  // Agent events
  on(event: 'agent:started', listener: (agent: string, task: string) => void): void;
  on(event: 'agent:completed', listener: (agent: string, result: any) => void): void;
  on(event: 'agent:failed', listener: (agent: string, error: Error) => void): void;
  
  // Emit event
  emit(event: string, ...args: any[]): void;
}
```

### Plugin System
```typescript
export interface Plugin {
  name: string;
  version: string;
  
  // Lifecycle hooks
  initialize?(planner: ProjectPlanner): Promise<void>;
  shutdown?(): Promise<void>;
  
  // Extension points
  registerCommands?(): Command[];
  registerProviders?(): Provider[];
  registerAgents?(): Agent[];
}

export interface Command {
  name: string;
  description: string;
  execute(context: CommandContext): Promise<void>;
}

export interface Provider {
  type: 'compliance' | 'workflow' | 'reporting';
  provide(context: ProviderContext): any;
}
```

---

## Implementation Examples

### VS Code Extension - Complete Example
```typescript
// src/extension.ts
import * as vscode from 'vscode';
import { ProjectPlanner } from '@projectplanner/core';

export async function activate(context: vscode.ExtensionContext) {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspaceRoot) {
    vscode.window.showWarningMessage('ProjectPlanner requires an open workspace');
    return;
  }
  
  // Initialize ProjectPlanner
  const planner = new ProjectPlanner({
    storageDir: path.join(workspaceRoot, '.projectplanner'),
    cacheEnabled: true,
  });
  
  await planner.initialize(workspaceRoot);
  
  // Register tree view
  const treeProvider = new WorkflowTreeProvider(planner);
  context.subscriptions.push(
    vscode.window.createTreeView('projectplanner', {
      treeDataProvider: treeProvider,
    })
  );
  
  // Register status bar
  const statusBar = new StatusBarManager(planner);
  context.subscriptions.push(statusBar);
  
  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('projectplanner.createFeature', async () => {
      const result = await planner.workflow.createFeature({
        title: await vscode.window.showInputBox({ prompt: 'Feature title' }),
        priority: 3,
        complexity: 3,
      });
      
      vscode.window.showInformationMessage(`Created ${result.id}`);
      treeProvider.refresh();
    })
  );
  
  // Register code action provider
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      { scheme: 'file' },
      new ComplianceCodeActionProvider(planner.compliance)
    )
  );
  
  // Listen for file changes
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(async (document) => {
      await planner.compliance.checkFile(document.uri.fsPath);
      treeProvider.refresh();
    })
  );
}
```

### CLI Tool - Complete Example
```typescript
// src/cli.ts
import { Command } from 'commander';
import { ProjectPlanner } from '@projectplanner/core';
import chalk from 'chalk';

const program = new Command();
const planner = new ProjectPlanner();

program
  .name('planner')
  .version('2.0.0')
  .description('ProjectPlanner CLI');

program
  .command('feature')
  .command('create')
  .option('-t, --title <string>')
  .option('-p, --priority <number>')
  .action(async (options) => {
    await planner.initialize(process.cwd());
    
    const feature = await planner.workflow.createFeature({
      title: options.title,
      priority: parseInt(options.priority) || 3,
      complexity: 3,
    });
    
    console.log(chalk.green('✓ Feature created:'), feature.id);
  });

program.parse();
```

---

## Summary

The Integration Layer provides three complementary interfaces:

1. **VS Code Extension**: Real-time, context-aware workflow management directly in the editor
2. **CLI Tool**: Terminal-based access for scripting, automation, and CLI-first developers
3. **Git Hooks**: Automated workflow integration at key Git lifecycle points

All three interfaces share the same core library, ensuring consistent behavior and data access across all integration points.

**Next Document**: `agents/AGENT_ARCHITECTURE.md` - Detailed specifications for all 6 AI agents
