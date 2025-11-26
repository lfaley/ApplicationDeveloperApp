# State Management Specification

**Version:** 1.0  
**Date:** November 17, 2025  
**Status:** Design Phase

## Table of Contents

1. [Overview](#overview)
2. [Storage Architecture](#storage-architecture)
3. [Database Schemas](#database-schemas)
4. [File System Organization](#file-system-organization)
5. [CRUD Operations](#crud-operations)
6. [Transactions & Concurrency](#transactions--concurrency)
7. [Caching Strategy](#caching-strategy)
8. [Querying & Indexing](#querying--indexing)
9. [Migration & Versioning](#migration--versioning)
10. [Backup & Recovery](#backup--recovery)
11. [Performance Optimization](#performance-optimization)

---

## Overview

ProjectPlanner uses a **JSON-based file system storage** approach where all project state resides in the `.projectplanner/` directory within the repository. This design provides:

- ✅ **Git-friendly** - Text-based storage version-controlled alongside code
- ✅ **Human-readable** - Easy to inspect and debug
- ✅ **No dependencies** - No database installation required
- ✅ **Portable** - Clone repository, get full project state
- ✅ **Simple backup** - Standard file system backup tools work

### Design Principles

1. **Single Source of Truth** - All state in `.projectplanner/`
2. **Explicit Schema** - TypeScript interfaces define structure
3. **Append-Only History** - Never delete, only append history
4. **Atomic Operations** - Use file system locking for consistency
5. **Fast Reads** - Index files for quick lookups
6. **Lazy Writes** - Batch updates where possible

### State Categories

```
┌──────────────────────────────────────────────────────────┐
│                  Project State                           │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Features   │  │     Bugs     │  │  Workflows   │  │
│  │   (Primary)  │  │   (Primary)  │  │ (Templates)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Standards   │  │   History    │  │    Config    │  │
│  │ (Compliance) │  │   (Audit)    │  │  (Settings)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## Storage Architecture

### Directory Structure

```
.projectplanner/
├── config.json                          # Project configuration
├── schema-version.json                  # Schema version for migrations
├── .lock                                # Lock file for concurrency control
│
├── features/                            # Feature storage
│   ├── index.json                       # Fast lookup index
│   ├── FEAT-001.json
│   ├── FEAT-002.json
│   └── ...
│
├── bugs/                                # Bug storage
│   ├── index.json                       # Fast lookup index
│   ├── BUG-001.json
│   ├── BUG-002.json
│   └── ...
│
├── workflows/                           # Workflow templates
│   ├── feature-workflow.json           # Default feature workflow
│   ├── bug-workflow.json               # Default bug workflow
│   ├── refactor-workflow.json          # Default refactor workflow
│   ├── spike-workflow.json             # Default spike workflow
│   └── custom/                          # Custom workflows
│       ├── epic-workflow.json
│       └── hotfix-workflow.json
│
├── standards/                           # Standards compliance data
│   ├── compliance-cache.json           # Cached compliance results
│   ├── validation-rules.json           # Custom validation rules
│   └── history/                         # Compliance history
│       ├── 2025-11-17.json
│       ├── 2025-11-16.json
│       └── ...
│
├── history/                             # Audit trail
│   ├── audit.log                        # Append-only audit log
│   └── snapshots/                       # Daily state snapshots
│       ├── 2025-11-17.json
│       └── 2025-11-16.json
│
└── cache/                               # Performance caches
    ├── git-metadata.json                # Cached git data
    ├── file-hashes.json                 # File content hashes
    └── metrics.json                     # Cached metrics
```

### File Sizes & Limits

| File Type | Typical Size | Max Recommended Size | Reason |
|-----------|--------------|---------------------|---------|
| Feature JSON | 5-50 KB | 1 MB | Keep individual features focused |
| Bug JSON | 3-20 KB | 500 KB | Bug reports should be concise |
| Index JSON | 10-100 KB | 5 MB | Fast parsing, ~1000 items |
| Config JSON | 5-20 KB | 100 KB | Configuration should be minimal |
| Audit Log | 100 KB-10 MB | 50 MB | Rotate when exceeds limit |
| Compliance Cache | 50-500 KB | 10 MB | Clear old entries regularly |

---

## Database Schemas

### Feature Schema

```typescript
interface Feature {
  // Identity
  id: string;                    // Format: "FEAT-001", "FEAT-002", etc.
  version: number;               // Schema version (for migrations)
  
  // Metadata
  title: string;                 // Max 200 chars
  description: string;           // Max 5000 chars
  type: FeatureType;
  priority: Priority;
  status: FeatureStatus;
  
  // Ownership
  assignee?: string;             // User email or ID
  reporter: string;              // User who created feature
  
  // Timestamps
  created: string;               // ISO 8601 date-time
  updated: string;               // ISO 8601 date-time
  started?: string;              // When development started
  completed?: string;            // When feature completed
  
  // Workflow
  workflow: WorkflowState;
  
  // Standards Compliance
  compliance: ComplianceSnapshot;
  
  // Artifacts
  artifacts: FeatureArtifacts;
  
  // Relationships
  dependencies: string[];        // Feature IDs this depends on
  blockedBy: string[];           // Feature IDs blocking this
  relatedBugs: string[];         // Bug IDs related to this feature
  
  // Labels & Tags
  labels: string[];              // Custom labels
  tags: string[];                // Searchable tags
  
  // Custom Fields
  metadata: Record<string, any>; // Extensible metadata
}

type FeatureType = 
  | 'feature'
  | 'enhancement'
  | 'epic'
  | 'technical-debt'
  | 'spike';

type Priority = 
  | 'critical'
  | 'high'
  | 'medium'
  | 'low';

type FeatureStatus = 
  | 'draft'
  | 'design'
  | 'in-progress'
  | 'testing'
  | 'review'
  | 'complete'
  | 'blocked'
  | 'on-hold'
  | 'cancelled';

interface WorkflowState {
  workflowId: string;            // Reference to workflow template
  currentPhase: string;          // Current phase ID
  phases: WorkflowPhase[];       // Phase definitions
  history: WorkflowTransition[]; // Phase transition history
  blockers: WorkflowBlocker[];   // Active blockers
}

interface WorkflowPhase {
  id: string;
  name: string;
  description: string;
  enteredAt?: string;            // ISO 8601 date-time
  exitedAt?: string;             // ISO 8601 date-time
  checklists: Checklist[];
  qualityGates: QualityGate[];
  minimumComplianceScore: number;
}

interface WorkflowTransition {
  id: string;
  fromPhase: string;
  toPhase: string;
  timestamp: string;             // ISO 8601 date-time
  user: string;                  // User who triggered transition
  reason?: string;               // Optional reason for transition
  automatic: boolean;            // Was this an automatic transition?
}

interface WorkflowBlocker {
  id: string;
  type: string;                  // 'dependency', 'validation', 'approval', etc.
  severity: 'error' | 'warning';
  message: string;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

interface Checklist {
  id: string;
  name: string;
  items: ChecklistItem[];
  requiredForAdvance: boolean;
}

interface ChecklistItem {
  id: string;
  description: string;
  required: boolean;
  completed: boolean;
  completedAt?: string;          // ISO 8601 date-time
  completedBy?: string;          // User who completed
  standardsRef?: string;         // Reference to standards document
  validationRule?: string;       // Automated validation rule
  notes?: string;                // Optional notes
}

interface QualityGate {
  id: string;
  name: string;
  type: 'compliance' | 'testing' | 'review' | 'artifact' | 'custom';
  blocking: boolean;
  passed: boolean;
  lastChecked?: string;          // ISO 8601 date-time
  details?: any;
}

interface ComplianceSnapshot {
  overallScore: number;          // 0-100
  lastUpdated: string;           // ISO 8601 date-time
  standards: {
    design: StandardCompliance;
    architecture: StandardCompliance;
    coding: StandardCompliance;
    testing: StandardCompliance;
    documentation: StandardCompliance;
  };
}

interface StandardCompliance {
  score: number;                 // 0-100
  passed: boolean;               // Meets minimum threshold
  violations: Violation[];
  lastValidated: string;         // ISO 8601 date-time
}

interface Violation {
  rule: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  filePath?: string;
  line?: number;
  column?: number;
  autoFixable: boolean;
}

interface FeatureArtifacts {
  // Design artifacts
  designDocs: string[];          // File paths relative to repo root
  architectureDiagrams: string[];
  
  // Implementation artifacts
  codeFiles: string[];           // Implementation file paths
  testFiles: string[];           // Test file paths
  
  // Documentation artifacts
  documentation: string[];       // Documentation file paths
  apiDocs: string[];             // API documentation paths
  
  // Git artifacts
  gitBranch?: string;            // Feature branch name
  commits: GitCommit[];          // Associated commits
  pullRequests: string[];        // PR URLs or IDs
}

interface GitCommit {
  sha: string;
  message: string;
  author: string;
  date: string;                  // ISO 8601 date-time
  filesChanged: string[];
}
```

**Example Feature JSON:**
```json
{
  "id": "FEAT-001",
  "version": 1,
  "title": "Add user authentication",
  "description": "Implement JWT-based authentication with refresh tokens",
  "type": "feature",
  "priority": "high",
  "status": "in-progress",
  "assignee": "developer@example.com",
  "reporter": "pm@example.com",
  "created": "2025-11-15T10:00:00Z",
  "updated": "2025-11-17T14:30:00Z",
  "started": "2025-11-16T09:00:00Z",
  "workflow": {
    "workflowId": "feature-workflow",
    "currentPhase": "develop",
    "phases": [ /* ... */ ],
    "history": [
      {
        "id": "trans-001",
        "fromPhase": "design",
        "toPhase": "develop",
        "timestamp": "2025-11-16T09:00:00Z",
        "user": "developer@example.com",
        "automatic": false
      }
    ],
    "blockers": []
  },
  "compliance": {
    "overallScore": 87,
    "lastUpdated": "2025-11-17T14:30:00Z",
    "standards": {
      "design": {
        "score": 95,
        "passed": true,
        "violations": [],
        "lastValidated": "2025-11-16T08:00:00Z"
      },
      "coding": {
        "score": 83,
        "passed": true,
        "violations": [
          {
            "rule": "function-complexity",
            "severity": "warning",
            "message": "Function 'authenticateUser' has complexity 12 (max 10)",
            "filePath": "src/auth/authenticate.ts",
            "line": 45,
            "autoFixable": false
          }
        ],
        "lastValidated": "2025-11-17T14:30:00Z"
      }
    }
  },
  "artifacts": {
    "designDocs": ["docs/features/FEAT-001/DESIGN.md"],
    "architectureDiagrams": ["docs/features/FEAT-001/architecture.png"],
    "codeFiles": ["src/auth/authenticate.ts", "src/auth/tokens.ts"],
    "testFiles": ["src/auth/authenticate.test.ts"],
    "documentation": ["docs/api/authentication.md"],
    "apiDocs": [],
    "gitBranch": "feature/FEAT-001-user-auth",
    "commits": [
      {
        "sha": "abc123def456",
        "message": "Add JWT token generation",
        "author": "developer@example.com",
        "date": "2025-11-17T10:00:00Z",
        "filesChanged": ["src/auth/tokens.ts"]
      }
    ],
    "pullRequests": []
  },
  "dependencies": [],
  "blockedBy": [],
  "relatedBugs": [],
  "labels": ["authentication", "security"],
  "tags": ["backend", "api"],
  "metadata": {
    "estimatedHours": 40,
    "actualHours": 28,
    "complexity": "high"
  }
}
```

---

### Bug Schema

```typescript
interface Bug {
  // Identity
  id: string;                    // Format: "BUG-001", "BUG-002", etc.
  version: number;               // Schema version
  
  // Metadata
  title: string;                 // Max 200 chars
  description: string;           // Max 5000 chars
  severity: Severity;
  status: BugStatus;
  
  // Reproduction
  reproducible: boolean;
  stepsToReproduce: string[];
  expectedBehavior: string;
  actualBehavior: string;
  environment: EnvironmentInfo;
  
  // Ownership
  assignee?: string;
  reporter: string;
  
  // Timestamps
  created: string;
  updated: string;
  resolved?: string;
  verified?: string;
  
  // Workflow
  workflow: WorkflowState;
  
  // Analysis
  rootCause?: RootCauseAnalysis;
  fix?: BugFix;
  
  // Standards Compliance
  compliance: ComplianceSnapshot;
  
  // Artifacts
  artifacts: BugArtifacts;
  
  // Relationships
  duplicateOf?: string;          // Bug ID if duplicate
  relatedTo: string[];           // Related bug/feature IDs
  blockedBy: string[];           // Bugs blocking this
  
  // Labels & Tags
  labels: string[];
  tags: string[];
  
  // Custom Fields
  metadata: Record<string, any>;
}

type Severity = 
  | 'critical'    // System down, data loss
  | 'high'        // Major functionality broken
  | 'medium'      // Feature degraded
  | 'low';        // Minor issue, workaround exists

type BugStatus = 
  | 'open'
  | 'investigating'
  | 'in-progress'
  | 'testing'
  | 'fixed'
  | 'verified'
  | 'closed'
  | 'wont-fix'
  | 'duplicate'
  | 'cannot-reproduce';

interface EnvironmentInfo {
  os?: string;                   // e.g., "Windows 11", "macOS 14"
  browser?: string;              // e.g., "Chrome 119"
  version?: string;              // Application version
  otherDetails?: Record<string, string>;
}

interface RootCauseAnalysis {
  category: RootCauseCategory;
  description: string;
  affectedComponents: string[];  // File paths or component names
  suggestedFix: string;
  analyzedBy: 'human' | 'agent';
  confidence: number;            // 0-1
  analyzedAt: string;            // ISO 8601 date-time
}

type RootCauseCategory = 
  | 'logic-error'
  | 'race-condition'
  | 'integration-issue'
  | 'configuration'
  | 'data-corruption'
  | 'performance'
  | 'security'
  | 'other';

interface BugFix {
  approach: string;
  codeChanges: string[];         // File paths
  testsAdded: string[];          // Test file paths
  regressionTests: string[];     // Regression test identifiers
  validated: boolean;
  deployedTo: string[];          // Environments deployed to
  fixedIn?: string;              // Version where fixed
}

interface BugArtifacts {
  // Evidence
  screenshots: string[];         // File paths
  logs: string[];                // Log file paths
  traces: string[];              // Stack trace files
  
  // Analysis
  analysisDocs: string[];        // Root cause analysis documents
  
  // Fix artifacts
  codeFiles: string[];           // Fixed code files
  testFiles: string[];           // Test files for fix
  
  // Git artifacts
  gitBranch?: string;
  commits: GitCommit[];
  pullRequests: string[];
}
```

**Example Bug JSON:**
```json
{
  "id": "BUG-001",
  "version": 1,
  "title": "Login fails with special characters in password",
  "description": "Users cannot log in when password contains & or < characters",
  "severity": "high",
  "status": "fixed",
  "reproducible": true,
  "stepsToReproduce": [
    "Create account with password containing &",
    "Log out",
    "Attempt to log in with that password",
    "Observe login failure"
  ],
  "expectedBehavior": "User should be able to log in successfully",
  "actualBehavior": "Login fails with 'Invalid credentials' error",
  "environment": {
    "os": "Windows 11",
    "browser": "Chrome 119",
    "version": "1.2.3"
  },
  "assignee": "developer@example.com",
  "reporter": "qa@example.com",
  "created": "2025-11-16T14:00:00Z",
  "updated": "2025-11-17T16:00:00Z",
  "resolved": "2025-11-17T15:00:00Z",
  "workflow": {
    "workflowId": "bug-workflow",
    "currentPhase": "verified",
    "phases": [ /* ... */ ],
    "history": [ /* ... */ ],
    "blockers": []
  },
  "rootCause": {
    "category": "logic-error",
    "description": "Password input not properly HTML-encoded before validation",
    "affectedComponents": ["src/auth/login.ts"],
    "suggestedFix": "Use proper HTML encoding/decoding for password field",
    "analyzedBy": "human",
    "confidence": 0.95,
    "analyzedAt": "2025-11-17T10:00:00Z"
  },
  "fix": {
    "approach": "Apply HTML encoding to password before comparison",
    "codeChanges": ["src/auth/login.ts", "src/utils/encoding.ts"],
    "testsAdded": ["src/auth/login.test.ts"],
    "regressionTests": ["auth-special-chars"],
    "validated": true,
    "deployedTo": ["staging", "production"],
    "fixedIn": "1.2.4"
  },
  "compliance": {
    "overallScore": 92,
    "lastUpdated": "2025-11-17T16:00:00Z",
    "standards": { /* ... */ }
  },
  "artifacts": {
    "screenshots": ["bugs/BUG-001/screenshot1.png"],
    "logs": ["bugs/BUG-001/error.log"],
    "traces": [],
    "analysisDocs": ["bugs/BUG-001/analysis.md"],
    "codeFiles": ["src/auth/login.ts"],
    "testFiles": ["src/auth/login.test.ts"],
    "gitBranch": "bugfix/BUG-001-login-special-chars",
    "commits": [ /* ... */ ],
    "pullRequests": ["#123"]
  },
  "duplicateOf": null,
  "relatedTo": ["FEAT-001"],
  "blockedBy": [],
  "labels": ["authentication", "security"],
  "tags": ["bug", "high-priority"],
  "metadata": {
    "customerReported": true,
    "affectedUsers": 25
  }
}
```

---

### Index Schema

For fast lookups without reading all files:

```typescript
interface Index {
  version: number;
  lastUpdated: string;           // ISO 8601 date-time
  itemCount: number;
  items: IndexEntry[];
}

interface IndexEntry {
  id: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  assignee?: string;
  created: string;
  updated: string;
  tags: string[];
  filePath: string;              // Relative path to JSON file
  fileHash: string;              // SHA-256 hash for cache invalidation
}
```

**Example features/index.json:**
```json
{
  "version": 1,
  "lastUpdated": "2025-11-17T16:30:00Z",
  "itemCount": 2,
  "items": [
    {
      "id": "FEAT-001",
      "title": "Add user authentication",
      "type": "feature",
      "status": "in-progress",
      "priority": "high",
      "assignee": "developer@example.com",
      "created": "2025-11-15T10:00:00Z",
      "updated": "2025-11-17T14:30:00Z",
      "tags": ["backend", "api"],
      "filePath": "features/FEAT-001.json",
      "fileHash": "abc123def456..."
    },
    {
      "id": "FEAT-002",
      "title": "Add user profile page",
      "type": "feature",
      "status": "design",
      "priority": "medium",
      "assignee": "designer@example.com",
      "created": "2025-11-16T09:00:00Z",
      "updated": "2025-11-16T15:00:00Z",
      "tags": ["frontend", "ui"],
      "filePath": "features/FEAT-002.json",
      "fileHash": "def789ghi012..."
    }
  ]
}
```

---

### Config Schema

```typescript
interface ProjectConfig {
  version: number;
  
  // Project Info
  project: {
    name: string;
    description?: string;
    version: string;
    createdDate: string;         // ISO 8601 date-time
    repository?: string;         // Git repository URL
  };
  
  // Standards Configuration
  standards: {
    design: StandardsConfig;
    architecture: StandardsConfig;
    coding: StandardsConfig;
    testing: StandardsConfig;
    documentation: StandardsConfig;
  };
  
  // Workflow Configuration
  workflows: {
    defaultFeatureWorkflow: string;
    defaultBugWorkflow: string;
    customWorkflows: Record<string, string>;  // type -> workflow file path
    autoTransitions: boolean;
  };
  
  // Compliance Configuration
  compliance: {
    minimumScore: number;        // 0-100
    blockOnFailure: boolean;
    autoFix: boolean;
    validationFrequency: 'commit' | 'push' | 'manual';
  };
  
  // Agent Configuration
  agents: {
    enabled: boolean;
    mcpEndpoint?: string;
    availableAgents: string[];
    agentConfig: Record<string, any>;
  };
  
  // Git Configuration
  git: {
    branchPrefix: string;        // e.g., "feature/", "bugfix/"
    commitTemplate?: string;
    requirePullRequest: boolean;
    minReviewers: number;
  };
  
  // ID Generation
  idGeneration: {
    featurePrefix: string;       // e.g., "FEAT"
    bugPrefix: string;           // e.g., "BUG"
    startNumber: number;
    padding: number;             // e.g., 3 -> "001"
  };
  
  // Team Configuration
  team: {
    members: TeamMember[];
  };
  
  // Custom Fields
  customFields: CustomFieldDefinition[];
}

interface StandardsConfig {
  enabled: boolean;
  documentPath: string;          // Relative path to standards document
  strictMode: boolean;
  minimumScore: number;          // Phase-specific minimum
  customRules: string[];         // Custom validation rule IDs
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

interface CustomFieldDefinition {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'select';
  options?: string[];            // For select type
  required: boolean;
  appliesTo: ('feature' | 'bug')[];
}
```

---

## File System Organization

### File Naming Conventions

1. **Features:** `FEAT-{number}.json` (e.g., `FEAT-001.json`, `FEAT-042.json`)
2. **Bugs:** `BUG-{number}.json` (e.g., `BUG-001.json`, `BUG-123.json`)
3. **Indexes:** `index.json` (one per directory)
4. **Config:** `config.json` (root of `.projectplanner/`)
5. **History:** ISO date format `YYYY-MM-DD.json`

### Directory Access Patterns

```typescript
class FileSystemLayout {
  private readonly root: string;
  
  constructor(projectRoot: string) {
    this.root = path.join(projectRoot, '.projectplanner');
  }
  
  // Feature paths
  getFeaturePath(id: string): string {
    return path.join(this.root, 'features', `${id}.json`);
  }
  
  getFeatureIndexPath(): string {
    return path.join(this.root, 'features', 'index.json');
  }
  
  // Bug paths
  getBugPath(id: string): string {
    return path.join(this.root, 'bugs', `${id}.json`);
  }
  
  getBugIndexPath(): string {
    return path.join(this.root, 'bugs', 'index.json');
  }
  
  // Workflow paths
  getWorkflowPath(type: string): string {
    return path.join(this.root, 'workflows', `${type}-workflow.json`);
  }
  
  getCustomWorkflowPath(name: string): string {
    return path.join(this.root, 'workflows', 'custom', `${name}.json`);
  }
  
  // Config paths
  getConfigPath(): string {
    return path.join(this.root, 'config.json');
  }
  
  // Standards paths
  getComplianceCachePath(): string {
    return path.join(this.root, 'standards', 'compliance-cache.json');
  }
  
  getComplianceHistoryPath(date: string): string {
    return path.join(this.root, 'standards', 'history', `${date}.json`);
  }
  
  // Audit paths
  getAuditLogPath(): string {
    return path.join(this.root, 'history', 'audit.log');
  }
  
  getSnapshotPath(date: string): string {
    return path.join(this.root, 'history', 'snapshots', `${date}.json`);
  }
  
  // Lock file
  getLockPath(): string {
    return path.join(this.root, '.lock');
  }
}
```

---

## CRUD Operations

### Create Operations

```typescript
interface StateRepository {
  // Feature CRUD
  createFeature(feature: Omit<Feature, 'id' | 'created' | 'updated'>): Promise<Feature>;
  
  // Bug CRUD
  createBug(bug: Omit<Bug, 'id' | 'created' | 'updated'>): Promise<Bug>;
}

// Implementation
class JsonStateRepository implements StateRepository {
  async createFeature(data: Omit<Feature, 'id' | 'created' | 'updated'>): Promise<Feature> {
    const lock = await this.lockManager.acquireLock();
    
    try {
      // Generate ID
      const id = await this.generateNextId('feature');
      
      // Create feature object
      const now = new Date().toISOString();
      const feature: Feature = {
        ...data,
        id,
        version: 1,
        created: now,
        updated: now
      };
      
      // Validate schema
      this.validateFeature(feature);
      
      // Write to file
      const filePath = this.layout.getFeaturePath(id);
      await fs.writeFile(filePath, JSON.stringify(feature, null, 2), 'utf-8');
      
      // Update index
      await this.updateIndex('features', {
        id: feature.id,
        title: feature.title,
        type: feature.type,
        status: feature.status,
        priority: feature.priority,
        assignee: feature.assignee,
        created: feature.created,
        updated: feature.updated,
        tags: feature.tags,
        filePath: `features/${id}.json`,
        fileHash: await this.hashFile(filePath)
      });
      
      // Append to audit log
      await this.appendAuditLog({
        timestamp: now,
        action: 'create',
        entityType: 'feature',
        entityId: id,
        user: 'system',  // TODO: Get current user
        changes: { created: feature }
      });
      
      return feature;
      
    } finally {
      await lock.release();
    }
  }
  
  private async generateNextId(type: 'feature' | 'bug'): Promise<string> {
    const config = await this.loadConfig();
    const prefix = type === 'feature' 
      ? config.idGeneration.featurePrefix 
      : config.idGeneration.bugPrefix;
    
    // Read index to find highest ID
    const indexPath = type === 'feature' 
      ? this.layout.getFeatureIndexPath()
      : this.layout.getBugIndexPath();
      
    const index = await this.loadIndex(indexPath);
    const maxNumber = index.items
      .filter(item => item.id.startsWith(prefix))
      .map(item => parseInt(item.id.split('-')[1]))
      .reduce((max, num) => Math.max(max, num), config.idGeneration.startNumber - 1);
    
    const nextNumber = maxNumber + 1;
    const paddedNumber = String(nextNumber).padStart(config.idGeneration.padding, '0');
    
    return `${prefix}-${paddedNumber}`;
  }
}
```

### Read Operations

```typescript
interface StateRepository {
  // Get by ID
  getFeature(id: string): Promise<Feature | null>;
  getBug(id: string): Promise<Bug | null>;
  
  // List with filters
  listFeatures(filter?: FeatureFilter): Promise<Feature[]>;
  listBugs(filter?: BugFilter): Promise<Bug[]>;
  
  // Search
  searchFeatures(query: string): Promise<Feature[]>;
  searchBugs(query: string): Promise<Bug[]>;
}

interface FeatureFilter {
  status?: FeatureStatus[];
  priority?: Priority[];
  assignee?: string;
  tags?: string[];
  createdAfter?: Date;
  createdBefore?: Date;
}

// Implementation
class JsonStateRepository implements StateRepository {
  async getFeature(id: string): Promise<Feature | null> {
    const filePath = this.layout.getFeaturePath(id);
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const feature = JSON.parse(content) as Feature;
      
      // Validate schema version
      if (feature.version !== CURRENT_SCHEMA_VERSION) {
        // Migrate if needed
        return await this.migrateFeature(feature);
      }
      
      return feature;
      
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        return null;  // File not found
      }
      throw err;
    }
  }
  
  async listFeatures(filter?: FeatureFilter): Promise<Feature[]> {
    // Use index for fast filtering
    const index = await this.loadIndex(this.layout.getFeatureIndexPath());
    
    let entries = index.items;
    
    // Apply filters to index entries
    if (filter) {
      if (filter.status) {
        entries = entries.filter(e => filter.status!.includes(e.status as FeatureStatus));
      }
      if (filter.priority) {
        entries = entries.filter(e => filter.priority!.includes(e.priority as Priority));
      }
      if (filter.assignee) {
        entries = entries.filter(e => e.assignee === filter.assignee);
      }
      if (filter.tags) {
        entries = entries.filter(e => 
          filter.tags!.some(tag => e.tags.includes(tag))
        );
      }
      if (filter.createdAfter) {
        entries = entries.filter(e => 
          new Date(e.created) >= filter.createdAfter!
        );
      }
      if (filter.createdBefore) {
        entries = entries.filter(e => 
          new Date(e.created) <= filter.createdBefore!
        );
      }
    }
    
    // Load full features (consider lazy loading for large result sets)
    const features = await Promise.all(
      entries.map(entry => this.getFeature(entry.id))
    );
    
    return features.filter((f): f is Feature => f !== null);
  }
  
  async searchFeatures(query: string): Promise<Feature[]> {
    // Simple search implementation
    // For production, consider using a search index (e.g., lunr.js)
    const allFeatures = await this.listFeatures();
    const lowerQuery = query.toLowerCase();
    
    return allFeatures.filter(feature => 
      feature.title.toLowerCase().includes(lowerQuery) ||
      feature.description.toLowerCase().includes(lowerQuery) ||
      feature.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
}
```

### Update Operations

```typescript
interface StateRepository {
  updateFeature(id: string, updates: Partial<Feature>): Promise<Feature>;
  updateBug(id: string, updates: Partial<Bug>): Promise<Bug>;
}

// Implementation
class JsonStateRepository implements StateRepository {
  async updateFeature(id: string, updates: Partial<Feature>): Promise<Feature> {
    const lock = await this.lockManager.acquireLock();
    
    try {
      // Load existing feature
      const existing = await this.getFeature(id);
      if (!existing) {
        throw new Error(`Feature ${id} not found`);
      }
      
      // Merge updates
      const updated: Feature = {
        ...existing,
        ...updates,
        id: existing.id,  // Prevent ID change
        created: existing.created,  // Prevent created change
        updated: new Date().toISOString()
      };
      
      // Validate schema
      this.validateFeature(updated);
      
      // Write to file
      const filePath = this.layout.getFeaturePath(id);
      await fs.writeFile(filePath, JSON.stringify(updated, null, 2), 'utf-8');
      
      // Update index
      await this.updateIndex('features', {
        id: updated.id,
        title: updated.title,
        type: updated.type,
        status: updated.status,
        priority: updated.priority,
        assignee: updated.assignee,
        created: updated.created,
        updated: updated.updated,
        tags: updated.tags,
        filePath: `features/${id}.json`,
        fileHash: await this.hashFile(filePath)
      });
      
      // Append to audit log
      await this.appendAuditLog({
        timestamp: updated.updated,
        action: 'update',
        entityType: 'feature',
        entityId: id,
        user: 'system',  // TODO: Get current user
        changes: this.diffObjects(existing, updated)
      });
      
      return updated;
      
    } finally {
      await lock.release();
    }
  }
  
  private diffObjects(old: any, updated: any): any {
    const changes: any = {};
    
    for (const key of Object.keys(updated)) {
      if (JSON.stringify(old[key]) !== JSON.stringify(updated[key])) {
        changes[key] = {
          old: old[key],
          new: updated[key]
        };
      }
    }
    
    return changes;
  }
}
```

### Delete Operations

```typescript
interface StateRepository {
  deleteFeature(id: string): Promise<void>;
  deleteBug(id: string): Promise<void>;
}

// Implementation
class JsonStateRepository implements StateRepository {
  async deleteFeature(id: string): Promise<void> {
    const lock = await this.lockManager.acquireLock();
    
    try {
      // Load existing feature for audit
      const existing = await this.getFeature(id);
      if (!existing) {
        throw new Error(`Feature ${id} not found`);
      }
      
      // Delete file
      const filePath = this.layout.getFeaturePath(id);
      await fs.unlink(filePath);
      
      // Remove from index
      await this.removeFromIndex('features', id);
      
      // Append to audit log
      await this.appendAuditLog({
        timestamp: new Date().toISOString(),
        action: 'delete',
        entityType: 'feature',
        entityId: id,
        user: 'system',  // TODO: Get current user
        changes: { deleted: existing }
      });
      
    } finally {
      await lock.release();
    }
  }
}
```

---

## Transactions & Concurrency

### File Locking

```typescript
class LockManager {
  private lockFile: string;
  private lockAcquireTimeout = 5000;  // 5 seconds
  private lockPollInterval = 100;     // 100ms
  
  constructor(projectRoot: string) {
    this.lockFile = path.join(projectRoot, '.projectplanner', '.lock');
  }
  
  async acquireLock(timeout = this.lockAcquireTimeout): Promise<Lock> {
    const start = Date.now();
    const processId = process.pid;
    
    while (Date.now() - start < timeout) {
      try {
        // Try to create lock file exclusively
        await fs.writeFile(
          this.lockFile, 
          JSON.stringify({
            pid: processId,
            acquired: new Date().toISOString(),
            host: os.hostname()
          }), 
          { flag: 'wx' }  // Write exclusive - fails if exists
        );
        
        return new Lock(this.lockFile, processId);
        
      } catch (err: any) {
        if (err.code !== 'EEXIST') {
          throw err;  // Unexpected error
        }
        
        // Lock exists, check if stale
        const isStale = await this.checkStaleLock();
        if (isStale) {
          await this.removeStaleLock();
          continue;  // Try again
        }
        
        // Wait and retry
        await this.sleep(this.lockPollInterval);
      }
    }
    
    throw new Error('Failed to acquire lock: timeout');
  }
  
  private async checkStaleLock(): Promise<boolean> {
    try {
      const content = await fs.readFile(this.lockFile, 'utf-8');
      const lockInfo = JSON.parse(content);
      
      // Lock is stale if process no longer exists
      try {
        process.kill(lockInfo.pid, 0);  // Signal 0 checks existence
        return false;  // Process exists, lock is valid
      } catch {
        return true;  // Process doesn't exist, lock is stale
      }
      
    } catch {
      return true;  // Can't read lock file, assume stale
    }
  }
  
  private async removeStaleLock(): Promise<void> {
    try {
      await fs.unlink(this.lockFile);
    } catch {
      // Ignore errors removing stale lock
    }
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class Lock {
  constructor(
    private lockFile: string,
    private processId: number
  ) {}
  
  async release(): Promise<void> {
    try {
      // Verify we still own the lock
      const content = await fs.readFile(this.lockFile, 'utf-8');
      const lockInfo = JSON.parse(content);
      
      if (lockInfo.pid === this.processId) {
        await fs.unlink(this.lockFile);
      }
    } catch (err) {
      // Lock already released or doesn't exist
      console.warn('Failed to release lock:', err);
    }
  }
}
```

### Transactional Updates

```typescript
interface Transaction {
  id: string;
  operations: Operation[];
  committed: boolean;
  rolledBack: boolean;
}

interface Operation {
  type: 'create' | 'update' | 'delete';
  entityType: 'feature' | 'bug';
  entityId: string;
  data?: any;
}

class TransactionManager {
  private transactions = new Map<string, Transaction>();
  
  beginTransaction(): Transaction {
    const transaction: Transaction = {
      id: generateId(),
      operations: [],
      committed: false,
      rolledBack: false
    };
    
    this.transactions.set(transaction.id, transaction);
    return transaction;
  }
  
  addOperation(transaction: Transaction, operation: Operation): void {
    if (transaction.committed || transaction.rolledBack) {
      throw new Error('Cannot add operation to completed transaction');
    }
    
    transaction.operations.push(operation);
  }
  
  async commit(transaction: Transaction): Promise<void> {
    if (transaction.committed || transaction.rolledBack) {
      throw new Error('Transaction already completed');
    }
    
    const lock = await this.lockManager.acquireLock();
    
    try {
      // Execute all operations
      for (const op of transaction.operations) {
        await this.executeOperation(op);
      }
      
      transaction.committed = true;
      
    } catch (err) {
      // Rollback on error
      await this.rollback(transaction);
      throw err;
      
    } finally {
      await lock.release();
      this.transactions.delete(transaction.id);
    }
  }
  
  async rollback(transaction: Transaction): Promise<void> {
    if (transaction.committed) {
      throw new Error('Cannot rollback committed transaction');
    }
    
    // Undo operations in reverse order
    for (let i = transaction.operations.length - 1; i >= 0; i--) {
      const op = transaction.operations[i];
      await this.undoOperation(op);
    }
    
    transaction.rolledBack = true;
    this.transactions.delete(transaction.id);
  }
  
  private async executeOperation(op: Operation): Promise<void> {
    switch (op.type) {
      case 'create':
        // Actual create implementation
        break;
      case 'update':
        // Actual update implementation
        break;
      case 'delete':
        // Actual delete implementation
        break;
    }
  }
  
  private async undoOperation(op: Operation): Promise<void> {
    // Reverse the operation
    // This requires keeping backup of original state
  }
}
```

---

## Caching Strategy

### Compliance Cache

```typescript
interface ComplianceCache {
  version: number;
  entries: Map<string, CachedComplianceResult>;
}

interface CachedComplianceResult {
  fileHash: string;              // SHA-256 of file content
  standardsVersion: string;      // Version of standards used
  result: ComplianceResult;
  timestamp: string;
  ttl: number;                   // Time-to-live in milliseconds
}

class ComplianceCacheManager {
  private cache: ComplianceCache | null = null;
  private cachePath: string;
  
  async get(
    filePath: string,
    fileHash: string,
    standardsVersion: string
  ): Promise<ComplianceResult | null> {
    await this.ensureLoaded();
    
    const cacheKey = `${filePath}:${standardsVersion}`;
    const cached = this.cache!.entries.get(cacheKey);
    
    if (!cached) {
      return null;  // Cache miss
    }
    
    // Check if cache entry is still valid
    if (cached.fileHash !== fileHash) {
      return null;  // File changed
    }
    
    const age = Date.now() - new Date(cached.timestamp).getTime();
    if (age > cached.ttl) {
      return null;  // Cache expired
    }
    
    return cached.result;
  }
  
  async set(
    filePath: string,
    fileHash: string,
    standardsVersion: string,
    result: ComplianceResult,
    ttl = 3600000  // 1 hour default
  ): Promise<void> {
    await this.ensureLoaded();
    
    const cacheKey = `${filePath}:${standardsVersion}`;
    this.cache!.entries.set(cacheKey, {
      fileHash,
      standardsVersion,
      result,
      timestamp: new Date().toISOString(),
      ttl
    });
    
    await this.save();
  }
  
  async invalidate(filePath: string): Promise<void> {
    await this.ensureLoaded();
    
    // Remove all cache entries for this file
    for (const [key] of this.cache!.entries) {
      if (key.startsWith(`${filePath}:`)) {
        this.cache!.entries.delete(key);
      }
    }
    
    await this.save();
  }
  
  async clear(): Promise<void> {
    this.cache = {
      version: 1,
      entries: new Map()
    };
    
    await this.save();
  }
  
  private async ensureLoaded(): Promise<void> {
    if (this.cache) return;
    
    try {
      const content = await fs.readFile(this.cachePath, 'utf-8');
      const data = JSON.parse(content);
      this.cache = {
        version: data.version,
        entries: new Map(Object.entries(data.entries))
      };
    } catch {
      // Cache file doesn't exist or is invalid
      this.cache = {
        version: 1,
        entries: new Map()
      };
    }
  }
  
  private async save(): Promise<void> {
    const data = {
      version: this.cache!.version,
      entries: Object.fromEntries(this.cache!.entries)
    };
    
    await fs.writeFile(
      this.cachePath,
      JSON.stringify(data, null, 2),
      'utf-8'
    );
  }
}
```

---

## Querying & Indexing

### Index Management

```typescript
class IndexManager {
  async updateIndex(
    indexType: 'features' | 'bugs',
    entry: IndexEntry
  ): Promise<void> {
    const indexPath = indexType === 'features'
      ? this.layout.getFeatureIndexPath()
      : this.layout.getBugIndexPath();
    
    const index = await this.loadIndex(indexPath);
    
    // Find and update or add entry
    const existingIndex = index.items.findIndex(item => item.id === entry.id);
    
    if (existingIndex >= 0) {
      index.items[existingIndex] = entry;
    } else {
      index.items.push(entry);
      index.itemCount++;
    }
    
    index.lastUpdated = new Date().toISOString();
    
    await this.saveIndex(indexPath, index);
  }
  
  async removeFromIndex(
    indexType: 'features' | 'bugs',
    id: string
  ): Promise<void> {
    const indexPath = indexType === 'features'
      ? this.layout.getFeatureIndexPath()
      : this.layout.getBugIndexPath();
    
    const index = await this.loadIndex(indexPath);
    
    index.items = index.items.filter(item => item.id !== id);
    index.itemCount = index.items.length;
    index.lastUpdated = new Date().toISOString();
    
    await this.saveIndex(indexPath, index);
  }
  
  async rebuildIndex(indexType: 'features' | 'bugs'): Promise<void> {
    const dir = indexType === 'features'
      ? this.layout.getFeaturesDir()
      : this.layout.getBugsDir();
    
    const files = await fs.readdir(dir);
    const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'index.json');
    
    const entries: IndexEntry[] = [];
    
    for (const file of jsonFiles) {
      const filePath = path.join(dir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const item = JSON.parse(content);
      
      entries.push({
        id: item.id,
        title: item.title,
        type: item.type,
        status: item.status,
        priority: item.priority,
        assignee: item.assignee,
        created: item.created,
        updated: item.updated,
        tags: item.tags,
        filePath: `${indexType}/${file}`,
        fileHash: await this.hashFile(filePath)
      });
    }
    
    const index: Index = {
      version: 1,
      lastUpdated: new Date().toISOString(),
      itemCount: entries.length,
      items: entries
    };
    
    const indexPath = indexType === 'features'
      ? this.layout.getFeatureIndexPath()
      : this.layout.getBugIndexPath();
    
    await this.saveIndex(indexPath, index);
  }
}
```

---

## Migration & Versioning

### Schema Migration

```typescript
interface SchemaMigration {
  fromVersion: number;
  toVersion: number;
  migrate(data: any): any;
}

class MigrationManager {
  private migrations: SchemaMigration[] = [
    {
      fromVersion: 1,
      toVersion: 2,
      migrate: (data: any) => {
        // Example: Add new field
        return {
          ...data,
          newField: 'default value'
        };
      }
    }
    // Add more migrations as schema evolves
  ];
  
  async migrateFeature(feature: Feature): Promise<Feature> {
    let current = feature;
    
    while (current.version < CURRENT_SCHEMA_VERSION) {
      const migration = this.migrations.find(
        m => m.fromVersion === current.version
      );
      
      if (!migration) {
        throw new Error(`No migration found from version ${current.version}`);
      }
      
      current = migration.migrate(current);
      current.version = migration.toVersion;
    }
    
    return current;
  }
  
  async migrateAll(): Promise<void> {
    console.log('Migrating all features...');
    
    const features = await this.stateRepository.listFeatures();
    
    for (const feature of features) {
      if (feature.version < CURRENT_SCHEMA_VERSION) {
        const migrated = await this.migrateFeature(feature);
        await this.stateRepository.updateFeature(feature.id, migrated);
        console.log(`Migrated ${feature.id} from v${feature.version} to v${migrated.version}`);
      }
    }
    
    console.log('Migration complete!');
  }
}
```

---

## Backup & Recovery

### Automated Snapshots

```typescript
class SnapshotManager {
  async createSnapshot(date: string = new Date().toISOString().split('T')[0]): Promise<void> {
    const snapshot = {
      date,
      created: new Date().toISOString(),
      features: await this.stateRepository.listFeatures(),
      bugs: await this.stateRepository.listBugs(),
      config: await this.configManager.load()
    };
    
    const snapshotPath = this.layout.getSnapshotPath(date);
    await fs.writeFile(
      snapshotPath,
      JSON.stringify(snapshot, null, 2),
      'utf-8'
    );
  }
  
  async restoreSnapshot(date: string): Promise<void> {
    const snapshotPath = this.layout.getSnapshotPath(date);
    const content = await fs.readFile(snapshotPath, 'utf-8');
    const snapshot = JSON.parse(content);
    
    // Restore features
    for (const feature of snapshot.features) {
      await this.stateRepository.createFeature(feature);
    }
    
    // Restore bugs
    for (const bug of snapshot.bugs) {
      await this.stateRepository.createBug(bug);
    }
    
    // Restore config
    await this.configManager.save(snapshot.config);
  }
}
```

---

## Performance Optimization

### Lazy Loading

```typescript
class LazyFeatureLoader {
  private cache = new Map<string, Feature>();
  
  async getFeature(id: string): Promise<Feature> {
    // Check memory cache first
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }
    
    // Load from disk
    const feature = await this.stateRepository.getFeature(id);
    
    if (feature) {
      // Cache with LRU eviction
      this.cache.set(id, feature);
      this.evictIfNeeded();
    }
    
    return feature!;
  }
  
  private evictIfNeeded(): void {
    const MAX_CACHE_SIZE = 100;
    
    if (this.cache.size > MAX_CACHE_SIZE) {
      // Evict oldest entry (first in Map)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}
```

---

**Document Status:** ✅ Ready for Review  
**Next Document:** `INTEGRATION_LAYER.md`
