# Technical Architecture: ProjectPlanner Phase 2

**Version:** 1.0  
**Date:** November 17, 2025  
**Status:** Design Phase

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Layers](#architecture-layers)
3. [Component Specifications](#component-specifications)
4. [Data Flow Architecture](#data-flow-architecture)
5. [Integration Patterns](#integration-patterns)
6. [Security Architecture](#security-architecture)
7. [Scalability & Performance](#scalability--performance)
8. [Technology Decisions](#technology-decisions)
9. [Deployment Model](#deployment-model)

---

## System Overview

Phase 2 transforms ProjectPlanner into a **3-layer distributed system** that operates both as a standalone application and as an integrated development environment companion.

### Architectural Principles

1. **Separation of Concerns** - Clear boundaries between GUI, state management, and integration layers
2. **Data Locality** - Project state lives with the code repository (`.projectplanner/`)
3. **Offline-First** - All operations work without network connectivity
4. **Event-Driven** - Components communicate via events for loose coupling
5. **Extensibility** - Plugin architecture for custom standards and workflows
6. **Developer-Centric** - APIs and CLIs as first-class interfaces alongside GUI

### System Context Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          External Systems                               │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │
│  │  Git/GitHub  │  │  Azure OpenAI│  │  VS Code API │                 │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                 │
└─────────┼──────────────────┼──────────────────┼──────────────────────────┘
          │                  │                  │
          ↓                  ↓                  ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                     ProjectPlanner System Boundary                      │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │                    Presentation Layer                           │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │   │
│  │  │ PowerShell  │  │  VS Code    │  │  CLI Tool   │            │   │
│  │  │ WPF GUI     │  │  Extension  │  │  (Node.js)  │            │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘            │   │
│  └────────────────────────┬───────────────────────────────────────┘   │
│                            │                                            │
│  ┌────────────────────────┴───────────────────────────────────────┐   │
│  │                    Business Logic Layer                         │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │   │
│  │  │  Workflow   │  │  Standards  │  │    Agent    │            │   │
│  │  │   Engine    │  │  Compliance │  │  Orchestra- │            │   │
│  │  │             │  │   Engine    │  │    tor      │            │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘            │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │   │
│  │  │  Feature    │  │     Bug     │  │  Validation │            │   │
│  │  │  Manager    │  │   Manager   │  │   Service   │            │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘            │   │
│  └────────────────────────┬───────────────────────────────────────┘   │
│                            │                                            │
│  ┌────────────────────────┴───────────────────────────────────────┐   │
│  │                    Data Access Layer                            │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │   │
│  │  │  State      │  │     Git     │  │   Config    │            │   │
│  │  │  Repository │  │  Integration│  │  Manager    │            │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘            │   │
│  └────────────────────────┬───────────────────────────────────────┘   │
│                            │                                            │
│  ┌────────────────────────┴───────────────────────────────────────┐   │
│  │              Persistent Storage (.projectplanner/)              │   │
│  │                                                                  │   │
│  │  features/ │ bugs/ │ workflows/ │ standards/ │ config.json     │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Architecture Layers

### Layer 1: Presentation Layer

#### PowerShell WPF GUI
**Purpose:** Primary interface for project initialization and management

**Responsibilities:**
- Create new projects with templates
- Add/edit features and bugs
- View project dashboards and reports
- Configure standards and workflows
- Manage team settings

**Technology:**
- PowerShell 7.x
- WPF (Windows Presentation Foundation)
- XAML for UI definition
- MVVM pattern for data binding

**Key Components:**
```powershell
GUI/
├── MainWindow.xaml          # Main application window
├── Views/
│   ├── ProjectSetup.xaml    # Initial project creation
│   ├── FeatureManager.xaml  # Feature CRUD operations
│   ├── BugTracker.xaml      # Bug management
│   ├── Dashboard.xaml       # Status overview
│   └── Settings.xaml        # Configuration
├── ViewModels/
│   ├── ProjectSetupViewModel.ps1
│   ├── FeatureManagerViewModel.ps1
│   └── DashboardViewModel.ps1
└── Services/
    ├── ProjectService.ps1   # Business logic interface
    └── StateService.ps1     # State management interface
```

#### VS Code Extension
**Purpose:** Real-time development guidance and integration

**Responsibilities:**
- Display current feature/bug context in status bar
- Show standards compliance inline
- Provide quick actions (create feature, run validation)
- Navigate between related artifacts
- Trigger agent assistance

**Technology:**
- TypeScript
- VS Code Extension API
- Webview API for complex UI
- Language Server Protocol for validation

**Key Components:**
```typescript
vscode-extension/
├── src/
│   ├── extension.ts              # Extension entry point
│   ├── statusBar.ts              # Feature status display
│   ├── commands/
│   │   ├── createFeature.ts
│   │   ├── runValidation.ts
│   │   └── viewCompliance.ts
│   ├── providers/
│   │   ├── hoverProvider.ts      # Standards tooltips
│   │   ├── diagnosticProvider.ts # Inline validation
│   │   └── codeActionProvider.ts # Quick fixes
│   ├── views/
│   │   ├── featureTreeView.ts    # Feature explorer
│   │   └── complianceWebview.ts  # Compliance dashboard
│   └── services/
│       ├── stateService.ts       # Read .projectplanner/
│       └── gitService.ts         # Git integration
└── package.json                  # Extension manifest
```

#### CLI Tool
**Purpose:** Command-line interface for scripting and automation

**Responsibilities:**
- Create/update features and bugs
- Check project status
- Run validation and compliance reports
- Execute workflow transitions
- Generate documentation

**Technology:**
- Node.js + TypeScript
- Commander.js for CLI framework
- Inquirer.js for interactive prompts
- Chalk for colored output

**Key Components:**
```typescript
cli-tool/
├── src/
│   ├── index.ts                 # CLI entry point
│   ├── commands/
│   │   ├── feature.ts           # Feature commands
│   │   ├── bug.ts               # Bug commands
│   │   ├── status.ts            # Status reporting
│   │   ├── validate.ts          # Validation commands
│   │   └── workflow.ts          # Workflow transitions
│   ├── prompts/
│   │   ├── featurePrompt.ts
│   │   └── bugPrompt.ts
│   └── formatters/
│       ├── tableFormatter.ts
│       └── jsonFormatter.ts
└── bin/
    └── projectplanner           # Executable wrapper
```

**CLI Usage Examples:**
```bash
# Create a new feature
projectplanner feature create --title "Add user authentication" --type feature

# Check status of current feature
projectplanner status

# Run standards validation
projectplanner validate --fix

# Transition workflow phase
projectplanner workflow advance FEAT-001

# Generate compliance report
projectplanner report compliance --format html
```

---

### Layer 2: Business Logic Layer

#### Workflow Engine
**Purpose:** Manage feature/bug lifecycle through standardized phases

**Responsibilities:**
- Load workflow templates based on item type
- Track progress through workflow phases
- Enforce phase transition rules
- Execute phase entry/exit hooks
- Maintain workflow history

**Core Interfaces:**
```typescript
interface Workflow {
  id: string;
  name: string;
  type: 'feature' | 'bug' | 'refactor' | 'spike';
  phases: WorkflowPhase[];
  currentPhase: string;
  metadata: Record<string, any>;
}

interface WorkflowPhase {
  id: string;
  name: string;
  description: string;
  checklists: Checklist[];
  validations: ValidationRule[];
  canAdvance: () => boolean;
  onEnter?: () => Promise<void>;
  onExit?: () => Promise<void>;
}

interface Checklist {
  id: string;
  items: ChecklistItem[];
  requiredForAdvance: boolean;
}

interface ChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  standardsRef?: string;  // Reference to standards document
}
```

**Workflow State Machine:**
```
┌─────────┐     ┌─────────┐     ┌──────────────┐     ┌─────────┐     ┌──────────┐
│ Design  │────→│ Develop │────→│   Testing    │────→│ Review  │────→│ Complete │
└─────────┘     └─────────┘     └──────────────┘     └─────────┘     └──────────┘
     ↑                                                                       │
     │                                                                       │
     └───────────────────────────── Reopen ─────────────────────────────────┘

Each transition validates:
- All required checklists completed
- Standards compliance threshold met
- No blocking validation errors
- Required artifacts exist (design docs, tests, etc.)
```

#### Standards Compliance Engine
**Purpose:** Automated validation against project standards

**Responsibilities:**
- Parse and interpret standards documents
- Execute validation rules against code/artifacts
- Calculate compliance scores
- Identify violations and suggest fixes
- Track compliance trends over time

**Core Interfaces:**
```typescript
interface ComplianceEngine {
  validateFile(filePath: string, standardsType: StandardsType): Promise<ComplianceResult>;
  validateProject(): Promise<ProjectComplianceReport>;
  suggestFixes(violations: Violation[]): Fix[];
  calculateScore(results: ComplianceResult[]): number;
}

interface ComplianceResult {
  filePath: string;
  standardsType: StandardsType;
  score: number;  // 0-100
  violations: Violation[];
  passed: boolean;
  timestamp: Date;
}

interface Violation {
  rule: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
  column?: number;
  autoFixable: boolean;
}

type StandardsType = 
  | 'design'
  | 'architecture'
  | 'coding'
  | 'testing'
  | 'documentation';
```

**Validation Pipeline:**
```
┌─────────────┐
│  Code File  │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────────────┐
│         Compliance Engine                   │
│                                              │
│  1. Parse File                              │
│  2. Load Applicable Standards               │
│  3. Execute Validation Rules                │
│  4. Calculate Score                         │
│  5. Generate Fix Suggestions                │
└──────┬──────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────┐
│         Compliance Result                   │
│                                              │
│  • Score: 85%                               │
│  • Violations: 3 warnings                   │
│  • Auto-fixes: 2 available                  │
│  • Manual fixes: 1 required                 │
└─────────────────────────────────────────────┘
```

#### Agent Orchestrator
**Purpose:** Coordinate AI agents and manage agent lifecycle

**Responsibilities:**
- Initialize and configure agents
- Route requests to appropriate agents
- Manage agent context and memory
- Aggregate agent responses
- Handle agent failures and retries

**Core Interfaces:**
```typescript
interface AgentOrchestrator {
  registerAgent(agent: Agent): void;
  executeAgent(agentId: string, task: AgentTask): Promise<AgentResult>;
  executeAgentPipeline(tasks: AgentTask[]): Promise<AgentResult[]>;
  getAgentStatus(agentId: string): AgentStatus;
}

interface Agent {
  id: string;
  name: string;
  capabilities: string[];
  canHandle(task: AgentTask): boolean;
  execute(task: AgentTask, context: AgentContext): Promise<AgentResult>;
}

interface AgentTask {
  id: string;
  type: string;
  description: string;
  input: any;
  context: AgentContext;
}

interface AgentContext {
  projectPath: string;
  featureId?: string;
  standards: StandardsConfig;
  history: AgentTask[];
}
```

#### Feature Manager
**Purpose:** CRUD operations and lifecycle management for features

**Responsibilities:**
- Create new features with templates
- Update feature metadata and status
- Link features to git branches/commits
- Track feature dependencies
- Generate feature reports

**Core Interfaces:**
```typescript
interface FeatureManager {
  createFeature(spec: FeatureSpec): Promise<Feature>;
  updateFeature(id: string, updates: Partial<Feature>): Promise<Feature>;
  getFeature(id: string): Promise<Feature>;
  listFeatures(filter?: FeatureFilter): Promise<Feature[]>;
  deleteFeature(id: string): Promise<void>;
  linkToGit(featureId: string, branch: string): Promise<void>;
}

interface Feature {
  id: string;  // e.g., "FEAT-001"
  title: string;
  description: string;
  type: 'feature' | 'enhancement' | 'epic';
  status: FeatureStatus;
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignee?: string;
  created: Date;
  updated: Date;
  workflow: Workflow;
  compliance: ComplianceSnapshot;
  artifacts: FeatureArtifacts;
  metadata: Record<string, any>;
}

interface FeatureArtifacts {
  designDocs: string[];      // Paths to design documents
  codeFiles: string[];       // Implementation files
  testFiles: string[];       // Test files
  documentation: string[];   // Documentation files
  gitBranch?: string;
  commits: string[];         // Commit SHAs
}

type FeatureStatus = 
  | 'draft'
  | 'design'
  | 'in-progress'
  | 'testing'
  | 'review'
  | 'complete'
  | 'blocked';
```

#### Bug Manager
**Purpose:** Bug tracking and resolution workflow

**Responsibilities:**
- Create bug reports with metadata
- Track bug reproduction and analysis
- Manage fix workflow
- Link bugs to root causes and fixes
- Generate bug metrics

**Core Interfaces:**
```typescript
interface BugManager {
  createBug(report: BugReport): Promise<Bug>;
  updateBug(id: string, updates: Partial<Bug>): Promise<Bug>;
  getBug(id: string): Promise<Bug>;
  listBugs(filter?: BugFilter): Promise<Bug[]>;
  linkToRootCause(bugId: string, analysis: RootCauseAnalysis): Promise<void>;
}

interface Bug {
  id: string;  // e.g., "BUG-001"
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: BugStatus;
  reproducible: boolean;
  environment: string;
  stepsToReproduce: string[];
  expectedBehavior: string;
  actualBehavior: string;
  created: Date;
  updated: Date;
  workflow: Workflow;
  rootCause?: RootCauseAnalysis;
  fix?: BugFix;
  metadata: Record<string, any>;
}

interface RootCauseAnalysis {
  category: 'logic-error' | 'race-condition' | 'integration-issue' | 'configuration' | 'other';
  description: string;
  affectedComponents: string[];
  suggestedFix: string;
  analyzedBy: 'human' | 'agent';
  confidence: number;  // 0-1
}

interface BugFix {
  approach: string;
  codeChanges: string[];  // File paths
  testsAdded: string[];
  regressionTests: string[];
  validated: boolean;
  deployedTo?: string[];
}

type BugStatus = 
  | 'open'
  | 'investigating'
  | 'in-progress'
  | 'testing'
  | 'fixed'
  | 'verified'
  | 'closed'
  | 'wont-fix';
```

#### Validation Service
**Purpose:** Centralized validation and quality gate enforcement

**Responsibilities:**
- Execute validation rules
- Block operations based on quality gates
- Cache validation results
- Provide validation APIs for all layers
- Generate validation reports

**Core Interfaces:**
```typescript
interface ValidationService {
  validate(target: ValidationTarget, rules: ValidationRule[]): Promise<ValidationResult>;
  canAdvanceWorkflow(itemId: string, targetPhase: string): Promise<boolean>;
  getBlockingIssues(itemId: string): Promise<ValidationIssue[]>;
  clearCache(itemId?: string): void;
}

interface ValidationTarget {
  type: 'feature' | 'bug' | 'file' | 'project';
  id: string;
  context: any;
}

interface ValidationRule {
  id: string;
  name: string;
  severity: 'error' | 'warning' | 'info';
  blocking: boolean;  // Blocks workflow advancement?
  validate: (target: ValidationTarget) => Promise<ValidationResult>;
}

interface ValidationResult {
  passed: boolean;
  issues: ValidationIssue[];
  score?: number;
  timestamp: Date;
}
```

---

### Layer 3: Data Access Layer

#### State Repository
**Purpose:** Abstract access to `.projectplanner/` filesystem storage

**Responsibilities:**
- Read/write JSON state files
- Manage file locking and concurrency
- Provide transactional updates
- Handle migration between schema versions
- Maintain audit log

**Core Interfaces:**
```typescript
interface StateRepository {
  // Features
  getFeature(id: string): Promise<Feature | null>;
  saveFeature(feature: Feature): Promise<void>;
  listFeatures(): Promise<Feature[]>;
  deleteFeature(id: string): Promise<void>;
  
  // Bugs
  getBug(id: string): Promise<Bug | null>;
  saveBug(bug: Bug): Promise<void>;
  listBugs(): Promise<Bug[]>;
  deleteBug(id: string): Promise<void>;
  
  // Workflows
  getWorkflow(id: string): Promise<Workflow | null>;
  saveWorkflow(workflow: Workflow): Promise<void>;
  
  // Config
  getConfig(): Promise<ProjectConfig>;
  updateConfig(updates: Partial<ProjectConfig>): Promise<void>;
  
  // Transactions
  beginTransaction(): Transaction;
  commit(transaction: Transaction): Promise<void>;
  rollback(transaction: Transaction): Promise<void>;
}

interface Transaction {
  id: string;
  operations: Operation[];
  timestamp: Date;
}
```

**Storage Structure:**
```
.projectplanner/
├── config.json                    # Project configuration
├── features/
│   ├── FEAT-001.json
│   ├── FEAT-002.json
│   └── index.json                 # Feature index for fast lookup
├── bugs/
│   ├── BUG-001.json
│   ├── BUG-002.json
│   └── index.json
├── workflows/
│   ├── feature-workflow.json      # Default feature workflow
│   ├── bug-workflow.json          # Default bug workflow
│   └── custom/                    # Custom workflow templates
│       └── spike-workflow.json
├── standards/
│   ├── compliance-cache.json      # Cached compliance results
│   └── history/
│       ├── 2025-11-17.json       # Daily snapshots
│       └── 2025-11-16.json
├── history/
│   └── audit.log                  # Append-only audit log
└── .lock                          # Lock file for concurrency
```

#### Git Integration
**Purpose:** Bi-directional synchronization with git repository

**Responsibilities:**
- Read git history and branch info
- Link commits to features/bugs
- Detect uncommitted changes
- Provide git metadata for validation
- Trigger hooks on git operations

**Core Interfaces:**
```typescript
interface GitIntegration {
  getCurrentBranch(): Promise<string>;
  getBranchCommits(branch: string): Promise<GitCommit[]>;
  getUncommittedFiles(): Promise<string[]>;
  linkCommitToFeature(commitSha: string, featureId: string): Promise<void>;
  createFeatureBranch(featureId: string, baseBranch: string): Promise<string>;
  getFileHistory(filePath: string): Promise<GitCommit[]>;
}

interface GitCommit {
  sha: string;
  message: string;
  author: string;
  date: Date;
  files: string[];
}
```

#### Config Manager
**Purpose:** Centralized configuration management

**Responsibilities:**
- Load project configuration
- Validate configuration schema
- Provide default values
- Support environment overrides
- Merge team and local settings

**Core Interfaces:**
```typescript
interface ConfigManager {
  load(): Promise<ProjectConfig>;
  save(config: ProjectConfig): Promise<void>;
  get<T>(key: string): T;
  set(key: string, value: any): Promise<void>;
  merge(updates: Partial<ProjectConfig>): Promise<void>;
}

interface ProjectConfig {
  project: {
    name: string;
    version: string;
    createdDate: Date;
  };
  standards: {
    design: StandardsConfig;
    architecture: StandardsConfig;
    coding: StandardsConfig;
    testing: StandardsConfig;
    documentation: StandardsConfig;
  };
  workflows: {
    defaultFeatureWorkflow: string;
    defaultBugWorkflow: string;
    customWorkflows: Record<string, string>;
  };
  compliance: {
    minimumScore: number;  // 0-100
    blockOnFailure: boolean;
    autoFix: boolean;
  };
  agents: {
    enabled: boolean;
    mcpEndpoint?: string;
    availableAgents: string[];
  };
  git: {
    branchPrefix: string;  // e.g., "feature/"
    commitTemplate?: string;
  };
}

interface StandardsConfig {
  enabled: boolean;
  documentPath: string;
  strictMode: boolean;
  customRules: ValidationRule[];
}
```

---

## Data Flow Architecture

### Feature Creation Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Create feature (GUI/CLI)
     ↓
┌─────────────────────────┐
│   Presentation Layer    │
│   (GUI/CLI)             │
└────┬────────────────────┘
     │ 2. Call FeatureManager.createFeature()
     ↓
┌─────────────────────────┐
│   Business Logic Layer  │
│   (FeatureManager)      │
│   • Generate ID         │
│   • Load workflow       │
│   • Initialize state    │
└────┬────────────────────┘
     │ 3. Save feature state
     ↓
┌─────────────────────────┐
│   Data Access Layer     │
│   (StateRepository)     │
│   • Write JSON          │
│   • Update index        │
│   • Log audit           │
└────┬────────────────────┘
     │ 4. Create git branch
     ↓
┌─────────────────────────┐
│   Git Integration       │
│   • Create branch       │
│   • Commit initial      │
└────┬────────────────────┘
     │ 5. Return success
     ↓
┌─────────┐
│  User   │
│ (FEAT-  │
│  001)   │
└─────────┘
```

### Standards Validation Flow

```
┌─────────┐
│  Dev    │
│ commits │
│  code   │
└────┬────┘
     │ 1. Pre-commit hook triggered
     ↓
┌─────────────────────────┐
│   Git Hook              │
│   (Husky)               │
└────┬────────────────────┘
     │ 2. Call ValidationService
     ↓
┌─────────────────────────┐
│   Validation Service    │
│   • Get changed files   │
│   • Load standards      │
└────┬────────────────────┘
     │ 3. Execute compliance checks
     ↓
┌─────────────────────────┐
│   Compliance Engine     │
│   • Parse code          │
│   • Apply rules         │
│   • Calculate score     │
└────┬────────────────────┘
     │ 4. Save results
     ↓
┌─────────────────────────┐
│   State Repository      │
│   • Update compliance   │
│   • Log violations      │
└────┬────────────────────┘
     │ 5. Return pass/fail
     ↓
┌─────────────────────────┐
│   Git Hook              │
│   • Allow/block commit  │
│   • Show violations     │
└────┬────────────────────┘
     │ 6. Result to developer
     ↓
┌─────────┐
│  Dev    │
│ (fix or │
│ commit) │
└─────────┘
```

### Agent Execution Flow

```
┌─────────┐
│  User   │
│ requests│
│  agent  │
└────┬────┘
     │ 1. "Generate docs for FEAT-001"
     ↓
┌─────────────────────────┐
│   CLI/VS Code Ext       │
└────┬────────────────────┘
     │ 2. Call AgentOrchestrator
     ↓
┌─────────────────────────┐
│   Agent Orchestrator    │
│   • Parse request       │
│   • Select agent        │
│   • Build context       │
└────┬────────────────────┘
     │ 3. Execute CodeDocAgent
     ↓
┌─────────────────────────┐
│   Code Doc Agent        │
│   (MCP Server)          │
│   • Analyze code        │
│   • Generate docs       │
└────┬────────────────────┘
     │ 4. Get feature context
     ↓
┌─────────────────────────┐
│   State Repository      │
│   • Load FEAT-001       │
│   • Get code files      │
└────┬────────────────────┘
     │ 5. Return context
     ↓
┌─────────────────────────┐
│   Code Doc Agent        │
│   • Process files       │
│   • Generate output     │
└────┬────────────────────┘
     │ 6. Update files
     ↓
┌─────────────────────────┐
│   File System           │
│   • Write docs          │
│   • Update feature      │
└────┬────────────────────┘
     │ 7. Return result
     ↓
┌─────────┐
│  User   │
│ (docs   │
│ updated)│
└─────────┘
```

---

## Integration Patterns

### Event-Driven Communication

**Event Bus Architecture:**
```typescript
interface EventBus {
  publish(event: SystemEvent): void;
  subscribe(eventType: string, handler: EventHandler): void;
  unsubscribe(eventType: string, handler: EventHandler): void;
}

interface SystemEvent {
  id: string;
  type: string;
  timestamp: Date;
  source: string;
  data: any;
}

// Event Types
type SystemEventType = 
  | 'feature.created'
  | 'feature.updated'
  | 'feature.deleted'
  | 'workflow.advanced'
  | 'validation.completed'
  | 'compliance.scored'
  | 'git.committed'
  | 'agent.executed';
```

**Example Event Flow:**
```typescript
// Feature Manager publishes event
eventBus.publish({
  id: 'evt-001',
  type: 'feature.created',
  timestamp: new Date(),
  source: 'FeatureManager',
  data: { featureId: 'FEAT-001', title: 'Add auth' }
});

// VS Code Extension subscribes
eventBus.subscribe('feature.created', (event) => {
  // Update status bar
  statusBar.update(event.data.featureId);
});

// Workflow Engine subscribes
eventBus.subscribe('feature.created', (event) => {
  // Initialize workflow
  workflowEngine.initializeWorkflow(event.data.featureId);
});
```

### Plugin Architecture

**Plugin System:**
```typescript
interface Plugin {
  id: string;
  name: string;
  version: string;
  initialize(context: PluginContext): Promise<void>;
  destroy(): Promise<void>;
}

interface PluginContext {
  config: ProjectConfig;
  eventBus: EventBus;
  services: {
    featureManager: FeatureManager;
    bugManager: BugManager;
    workflowEngine: WorkflowEngine;
    complianceEngine: ComplianceEngine;
  };
}

// Example: Custom Standards Plugin
class CustomCodingStandardsPlugin implements Plugin {
  id = 'custom-coding-standards';
  name = 'Custom Coding Standards';
  version = '1.0.0';
  
  async initialize(context: PluginContext) {
    // Register custom validation rules
    context.services.complianceEngine.registerRules([
      {
        id: 'custom-naming-convention',
        name: 'Enforce custom naming',
        severity: 'error',
        validate: async (target) => {
          // Custom validation logic
        }
      }
    ]);
  }
  
  async destroy() {
    // Cleanup
  }
}
```

---

## Security Architecture

### Threat Model

**Trust Boundaries:**
1. **User Input** - GUI/CLI commands from developers
2. **File System** - `.projectplanner/` directory access
3. **Git Repository** - Code and commit data
4. **External APIs** - Azure OpenAI, GitHub API
5. **Extension Host** - VS Code extension sandbox

**Key Threats:**
- Malicious input in feature/bug descriptions (XSS in reports)
- Unauthorized modification of `.projectplanner/` files
- Code injection via custom validation rules
- API key exposure in configuration
- Man-in-the-middle attacks on agent communication

### Security Controls

**Input Validation:**
```typescript
// Sanitize all user input
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')  // Remove HTML tags
    .replace(/[`$]/g, '')  // Remove shell metacharacters
    .trim()
    .substring(0, 1000);   // Limit length
}

// Validate file paths
function validatePath(path: string): boolean {
  const normalized = path.normalize(path);
  return !normalized.includes('..') &&
         normalized.startsWith(projectRoot);
}
```

**File Access Control:**
```typescript
// Only allow access within project boundaries
class SecureStateRepository implements StateRepository {
  private readonly projectRoot: string;
  
  async getFeature(id: string): Promise<Feature | null> {
    const filePath = path.join(this.projectRoot, '.projectplanner', 'features', `${id}.json`);
    
    // Validate path is within project
    if (!this.isPathSafe(filePath)) {
      throw new Error('Invalid file path');
    }
    
    // Read with proper error handling
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      if (err.code === 'ENOENT') return null;
      throw err;
    }
  }
  
  private isPathSafe(filePath: string): boolean {
    const normalized = path.normalize(filePath);
    return normalized.startsWith(this.projectRoot);
  }
}
```

**Secret Management:**
```typescript
// Never store secrets in .projectplanner/
// Use environment variables or secure storage

interface SecretManager {
  getSecret(key: string): Promise<string>;
  setSecret(key: string, value: string): Promise<void>;
}

// Windows: Credential Manager
// macOS: Keychain
// Linux: libsecret
class PlatformSecretManager implements SecretManager {
  async getSecret(key: string): Promise<string> {
    // Platform-specific secure storage
    return keytar.getPassword('ProjectPlanner', key);
  }
  
  async setSecret(key: string, value: string): Promise<void> {
    await keytar.setPassword('ProjectPlanner', key, value);
  }
}
```

**Agent Communication Security:**
```typescript
// Validate agent responses
function validateAgentResponse(response: any): boolean {
  // Ensure response doesn't contain executable code
  if (typeof response === 'string' && 
      (response.includes('eval(') || response.includes('Function('))) {
    return false;
  }
  
  // Validate structure
  return isValidResponseSchema(response);
}
```

---

## Scalability & Performance

### Performance Requirements

| Operation | Target | Measurement |
|-----------|--------|-------------|
| Feature creation | < 500ms | GUI to saved state |
| Standards validation (single file) | < 2s | Pre-commit hook |
| Project-wide compliance scan | < 30s | 1000 files |
| Agent response | < 10s | Average turnaround |
| Dashboard load | < 1s | GUI startup |
| CLI command execution | < 200ms | Status/list commands |

### Caching Strategy

**Compliance Result Cache:**
```typescript
interface ComplianceCache {
  get(fileHash: string, standardsVersion: string): ComplianceResult | null;
  set(fileHash: string, standardsVersion: string, result: ComplianceResult): void;
  invalidate(fileHash: string): void;
  clear(): void;
}

// Cache structure in .projectplanner/standards/compliance-cache.json
{
  "version": "1.0",
  "entries": {
    "abc123...": {  // File hash
      "v1": {       // Standards version
        "result": { /* ComplianceResult */ },
        "timestamp": "2025-11-17T10:00:00Z",
        "ttl": 3600000  // 1 hour
      }
    }
  }
}
```

**Git Metadata Cache:**
```typescript
// Cache git operations to avoid repeated calls
class CachedGitIntegration implements GitIntegration {
  private cache = new Map<string, any>();
  private cacheTTL = 60000; // 1 minute
  
  async getCurrentBranch(): Promise<string> {
    const cached = this.cache.get('currentBranch');
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.value;
    }
    
    const branch = await this.git.getCurrentBranch();
    this.cache.set('currentBranch', { value: branch, timestamp: Date.now() });
    return branch;
  }
}
```

### Concurrency Management

**File Locking:**
```typescript
// Prevent concurrent modifications to .projectplanner/
class LockManager {
  private lockFile = '.projectplanner/.lock';
  
  async acquireLock(timeout = 5000): Promise<Lock> {
    const start = Date.now();
    
    while (Date.now() - start < timeout) {
      try {
        await fs.writeFile(this.lockFile, process.pid.toString(), { flag: 'wx' });
        return new Lock(this.lockFile);
      } catch (err) {
        if (err.code !== 'EEXIST') throw err;
        await sleep(100);
      }
    }
    
    throw new Error('Failed to acquire lock');
  }
}

class Lock {
  constructor(private lockFile: string) {}
  
  async release(): Promise<void> {
    await fs.unlink(this.lockFile);
  }
}
```

---

## Technology Decisions

### Language Choices

**TypeScript/Node.js:**
- ✅ Cross-platform compatibility
- ✅ Rich ecosystem (npm packages)
- ✅ Strong typing for maintainability
- ✅ VS Code extension compatibility
- ✅ Existing MCP agent infrastructure

**PowerShell:**
- ✅ Native Windows GUI (WPF)
- ✅ Existing ProjectPlanner GUI code
- ✅ Easy process spawning
- ⚠️ Windows-only (acceptable for GUI)

### Storage Format: JSON vs Database

**Decision: JSON Files**

**Rationale:**
- ✅ Human-readable and git-friendly
- ✅ No database installation required
- ✅ Easy backup and version control
- ✅ Simple migration between projects
- ✅ Sufficient performance for typical project sizes (< 1000 features)

**Trade-offs:**
- ⚠️ No complex queries (acceptable - simple filtering needed)
- ⚠️ File locking complexity (mitigated with lock manager)
- ⚠️ Limited to single-machine access (acceptable - developer tool)

### MCP vs REST API for Agents

**Decision: Model Context Protocol (MCP)**

**Rationale:**
- ✅ Designed for AI agent communication
- ✅ Standardized protocol
- ✅ Context persistence across requests
- ✅ Streaming support for long operations
- ✅ Already used by Code Documentation Agent

---

## Deployment Model

### Installation

**Developer Machine:**
```powershell
# Install CLI tool globally
npm install -g @projectplanner/cli

# Install VS Code extension
code --install-extension projectplanner.vscode-projectplanner

# Clone repository and initialize
git clone <repo-url>
cd <project>
projectplanner init  # Creates .projectplanner/
```

**Repository Setup:**
```
project-root/
├── .projectplanner/        # Created by CLI tool
│   ├── config.json
│   ├── features/
│   ├── bugs/
│   └── workflows/
├── .gitignore              # Should include .projectplanner/.lock
├── package.json
└── src/
```

### Update Strategy

**CLI Tool Updates:**
```bash
# Automatic update check on startup
projectplanner --version
# New version available: 2.1.0 (current: 2.0.5)
# Run: npm install -g @projectplanner/cli@latest

# Automatic schema migration
projectplanner migrate
# Migrating .projectplanner/ from v1.0 to v2.0...
# ✅ Migration complete
```

**VS Code Extension Updates:**
- Automatic via VS Code marketplace
- Backward compatible with older CLI versions

---

## Next Steps

1. ✅ Technical architecture documented
2. ⏳ Create workflow system specification
3. ⏳ Create state management schemas
4. ⏳ Create integration layer specifications
5. ⏳ Create agent architecture document

---

**Document Status:** ✅ Ready for Review  
**Next Document:** `../specifications/WORKFLOW_SYSTEM.md`
