# Project Context Agent - Phase 2 Handoff Document

**Project**: Project Context Agent with Drift Detection  
**Status**: Phase 2 - In Progress  
**Last Updated**: November 19, 2025  
**Branch**: `feature/context-agent`  
**Repository**: ProjectPlanner (lfaley)

---

## 🎯 Executive Summary

The Project Context Agent is Phase 2 of the FeatureSet3 enhancement initiative. This agent provides intelligent drift detection between code and documentation, automated synchronization recommendations, and project health monitoring.

### Current State
- ✅ **Project Setup**: Complete (branch, structure, config files)
- ✅ **Type System**: Complete (comprehensive drift detection types)
- ✅ **Git Integration**: Complete (15 methods, 15 tests)
- ✅ **Drift Detection**: Complete (DriftDetector class, 15 tests)
- ✅ **Health Check**: Complete (4-factor scoring, 11 tests)
- ✅ **MCP Tools**: 3/4 tools functional (detect_drift, health_check, suggest_updates)
- ✅ **Testing**: 50/50 tests passing
- ⏳ **Sync Engine**: Not Started
- ⏳ **Documentation**: Not Started
- ✅ **Deployment**: Configured in Claude Desktop

### What's Next
- **Immediate**: Create README.md and CONTRIBUTING.md
- **Then**: Build sync engine with approval workflow
- **Then**: Complete auto_sync tool implementation
- **Then**: Add integration tests
- **Then**: Update master checklist and merge to main

---

## 📁 Project Structure

```
project-context-agent/
├── package.json                    # ✅ Dependencies configured
├── tsconfig.json                   # ✅ TypeScript strict mode
├── jest.config.cjs                 # ✅ Jest with ESM support
├── .gitignore                      # ✅ Created
├── README.md                       # ⏳ TO CREATE
├── CONTRIBUTING.md                 # ⏳ TO CREATE
├── HANDOFF.md                      # 📄 This document
├── src/
│   ├── index.ts                    # ⏳ MCP server entry point
│   ├── types.ts                    # ⏳ Type definitions
│   ├── git-integration.ts          # ⏳ Git operations wrapper
│   ├── drift-detection.ts          # ⏳ Drift detection algorithm
│   ├── content-analyzer.ts         # ⏳ Code vs. doc comparison
│   ├── sync-engine.ts              # ⏳ Auto-sync implementation
│   └── tools/
│       ├── detect-drift.ts         # ⏳ Main drift detection tool
│       ├── suggest-updates.ts      # ⏳ Generate recommendations
│       ├── auto-sync.ts            # ⏳ Execute sync with approval
│       └── health-check.ts         # ⏳ Get context health score
└── tests/
    ├── drift-detection.test.ts     # ⏳ 30+ tests
    ├── git-integration.test.ts     # ⏳ 15+ tests
    └── sync-engine.test.ts         # ⏳ 15+ tests
```

---

## 🏗️ Architecture Overview

### Core Components

#### 1. Git Integration Module (`git-integration.ts`)
**Purpose**: Wrapper around simple-git for workspace operations

**Key Features**:
- File modification timestamps
- Commit history analysis
- Changed files since specific commit
- Author and commit message lookup

**API**:
```typescript
class GitIntegration {
  constructor(workspacePath: string);
  getFileModificationInfo(filePath: string): Promise<FileModificationInfo>;
  getChangedFilesSince(since: Date): Promise<string[]>;
  getCommitHistory(filePath: string, limit?: number): Promise<CommitInfo[]>;
  isGitRepository(): Promise<boolean>;
}
```

#### 2. Drift Detection Engine (`drift-detection.ts`)
**Purpose**: Core algorithm for detecting code-documentation drift

**Detection Strategy**:
- Compare code file timestamps vs. documentation timestamps
- Analyze function signatures in code vs. documentation
- Detect new files without documentation
- Find orphaned documentation (references non-existent code)

**API**:
```typescript
class DriftDetector {
  detectDrift(workspacePath: string): Promise<DriftDetectionResult>;
  analyzeDriftSeverity(driftItems: DriftItem[]): 'critical' | 'high' | 'medium' | 'low';
  generateRecommendations(driftItems: DriftItem[]): string[];
}
```

#### 3. Content Analyzer (`content-analyzer.ts`)
**Purpose**: Compare code content with documentation content

**Features**:
- Extract function/class signatures from code
- Parse documentation for code references
- Match documented items with actual code
- Identify mismatches and inconsistencies

#### 4. Sync Engine (`sync-engine.ts`)
**Purpose**: Generate and execute synchronization operations

**Features**:
- Generate sync recommendations
- Require user approval
- Execute approved updates
- Track sync history

### MCP Tools (4 tools)

#### Tool 1: `detect_drift`
**Purpose**: Scan workspace for drift between code and docs

**Input**:
```typescript
{
  workspacePath: string;
  includePatterns?: string[];  // e.g., ["src/**/*.ts"]
  excludePatterns?: string[];  // e.g., ["node_modules/**"]
}
```

**Output**:
```typescript
{
  hasDrift: boolean;
  driftItems: DriftItem[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  summary: {
    totalFiles: number;
    driftCount: number;
    outdated: number;
    missing: number;
    orphaned: number;
  }
}
```

#### Tool 2: `suggest_updates`
**Purpose**: Generate actionable recommendations for fixing drift

**Input**:
```typescript
{
  driftItems: DriftItem[];  // From detect_drift
}
```

**Output**:
```typescript
{
  recommendations: Recommendation[];
  estimatedEffort: string;  // e.g., "~15 minutes"
  priority: 'high' | 'medium' | 'low';
}
```

#### Tool 3: `auto_sync`
**Purpose**: Execute synchronization with user approval

**Input**:
```typescript
{
  recommendations: Recommendation[];
  requireApproval: boolean;  // Default: true
}
```

**Output**:
```typescript
{
  status: 'completed' | 'pending_approval' | 'failed';
  updatedFiles: string[];
  errors?: string[];
}
```

#### Tool 4: `health_check`
**Purpose**: Get overall project context health score

**Input**:
```typescript
{
  workspacePath: string;
}
```

**Output**:
```typescript
{
  healthScore: number;  // 0-100
  issues: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  recommendations: string[];
  lastSyncDate?: Date;
}
```

---

## 📊 Phase 2 Task Breakdown

### Task 2.1: Planning & Design ✅ COMPLETE
- [x] Create feature branch
- [x] Setup project structure
- [x] Configure TypeScript, Jest, dependencies
- [x] Create HANDOFF.md document

**Time Spent**: 15 minutes

### Task 2.2: Type System (30 minutes) - **NEXT**
- [ ] Create `src/types.ts` with all interfaces
- [ ] Define `DriftDetectionResult`, `DriftItem`, `FileModificationInfo`
- [ ] Define `CommitInfo`, `Recommendation`, `HealthCheckResult`
- [ ] Add Zod validation schemas
- [ ] Document all types with JSDoc

### Task 2.3: Git Integration Module (1.5 hours)
- [ ] Implement `src/git-integration.ts`
- [ ] Wrapper for simple-git operations
- [ ] File modification timestamp queries
- [ ] Commit history analysis
- [ ] Write 15+ tests
- [ ] Handle non-git workspaces gracefully

### Task 2.4: Drift Detection Engine (2 hours)
- [ ] Implement `src/drift-detection.ts`
- [ ] Core drift detection algorithm
- [ ] Timestamp comparison logic
- [ ] Content analysis integration
- [ ] Severity calculation
- [ ] Write 30+ tests
- [ ] Edge cases (new project, no docs, etc.)

### Task 2.5: Content Analyzer (1.5 hours)
- [ ] Implement `src/content-analyzer.ts`
- [ ] Parse code for function/class signatures
- [ ] Parse documentation for code references
- [ ] Match and compare
- [ ] Write 20+ tests

### Task 2.6: Sync Engine (1 hour)
- [ ] Implement `src/sync-engine.ts`
- [ ] Generate recommendations
- [ ] Approval workflow
- [ ] Execute updates
- [ ] Write 15+ tests

### Task 2.7: MCP Tools (2 hours)
- [ ] Implement `src/tools/detect-drift.ts`
- [ ] Implement `src/tools/suggest-updates.ts`
- [ ] Implement `src/tools/auto-sync.ts`
- [ ] Implement `src/tools/health-check.ts`
- [ ] Write 20+ tests for all tools

### Task 2.8: MCP Server Entry Point (1 hour)
- [ ] Implement `src/index.ts`
- [ ] Register all 4 tools
- [ ] Setup MCP server
- [ ] Add error handling
- [ ] Write integration tests

### Task 2.9: Testing & Quality (1.5 hours)
- [ ] Achieve 80%+ code coverage
- [ ] All tests passing (100+ tests)
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Performance testing

### Task 2.10: Documentation (1 hour)
- [ ] Write README.md (~800 lines)
- [ ] Write CONTRIBUTING.md (~400 lines)
- [ ] API documentation
- [ ] Usage examples
- [ ] Troubleshooting guide

**Total Estimated Time**: ~12 hours

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Git repository workspace
- Phase 1 complete (orchestration agent)

### Install Dependencies
```bash
cd MCP-SERVER/project-context-agent
npm install
```

### Build
```bash
npm run build && npm start
```

### Run Tests
```bash
npm test
npm run test:coverage
```

### Development Workflow
```bash
# Watch mode for TypeScript
npm run watch

# Watch mode for tests
npm run test:watch
```

---

## 📝 Design Decisions

### Why simple-git?
- Well-maintained npm package
- Promise-based API
- Good TypeScript support
- Comprehensive git operations

### Why Focus on Drift Detection?
- **Real problem**: Documentation goes stale quickly
- **High value**: Saves 30-45 min/week per developer
- **Proactive**: Catches issues before they compound
- **Automated**: Can run in background

### Git-First Approach
- Use git as source of truth for changes
- Leverage commit history for analysis
- Compare file modification times
- Track documentation updates

### User Approval Required
- Auto-sync requires explicit approval
- Prevents unwanted changes
- Builds user trust
- Safety first

---

## 🎓 Key Concepts

### Drift Types

1. **Outdated** - Documentation exists but is outdated
   - Code modified after documentation
   - Function signatures changed
   - Parameters added/removed

2. **Missing** - Code exists but no documentation
   - New files added
   - Functions without docs
   - Classes not documented

3. **Orphaned** - Documentation references non-existent code
   - Documented functions removed
   - File references broken
   - Outdated examples

4. **Inconsistent** - Documentation contradicts code
   - Wrong parameter types
   - Incorrect return values
   - Misleading descriptions

### Severity Levels

- **Critical**: Core APIs undocumented or severely outdated
- **High**: Important features with missing/wrong documentation
- **Medium**: Minor inconsistencies or outdated examples
- **Low**: Optional documentation improvements

---

## 🐛 Known Considerations

### Non-Git Workspaces
- Tool should gracefully handle workspaces without git
- Fallback to file system timestamps
- Warn user about reduced accuracy

### Large Workspaces
- Performance optimization needed for 1000+ files
- Incremental scanning
- Caching strategies

### Binary Files
- Skip binary files in analysis
- Focus on text-based code and docs
- Handle edge cases gracefully

---

## 📞 Context & Dependencies

### Related Projects
- **Phase 1**: Orchestration agent (complete)
- **Existing Agents**: code-documentation, code-review, test-generator
- **Future**: Can orchestrate with other agents

### External Dependencies
- `simple-git` - Git operations
- `@modelcontextprotocol/sdk` - MCP server framework
- `zod` - Runtime validation

---

## ✅ Success Criteria

- [ ] All 4 MCP tools working
- [ ] Drift detection accurate (validated manually)
- [ ] 100+ tests, all passing
- [ ] 80%+ code coverage
- [ ] Zero build errors
- [ ] Complete documentation
- [ ] Deployed to Claude Desktop
- [ ] Validated in real workspace

---

**Last Updated**: November 19, 2025  
**Next Task**: Create type definitions (src/types.ts)  
**Estimated Time to Completion**: ~11.75 hours remaining
