# Phase 2: Intelligence - Plan of Attack

**Phase**: 2 of 5  
**Name**: Intelligence  
**Duration**: ~12 hours  
**Priority**: HIGH  
**Status**: ⚪ Blocked (Waiting for Phase 1)  
**Dependencies**: Phase 1 Complete

---

## 🎯 Phase Overview

Phase 2 adds intelligence and context-awareness to the MCP agent ecosystem. This phase focuses on keeping documentation synchronized with code automatically and providing users with confidence scoring to build trust in AI outputs.

### Primary Objectives
1. **Project Context Agent**: Automated documentation drift detection and synchronization
2. **Confidence Scoring**: Provide reliability indicators for all agent outputs
3. **Validation Guidance**: Help users understand when to review AI-generated content

### Strategic Importance
- **Solves "Stale Documentation" Problem**: Saves 30-45 min/week per developer
- **Builds User Trust**: Confidence scores reduce blind reliance on AI
- **Proactive Maintenance**: Detects issues before they become problems

### Success Criteria
- [ ] Drift detection working with git integration
- [ ] Auto-sync recommendations actionable and accurate
- [ ] Confidence scores added to all 4 agents (including orchestration)
- [ ] 50+ new tests, all passing (100%)
- [ ] No regressions in existing functionality

---

## 📋 Feature 1: Project Context Agent with Drift Detection

### Overview
Extend the existing `project-roadmap-agent` or create new `project-context-agent` that monitors workspace changes and automatically detects when documentation is out of sync with code.

### Business Value
- **Time Savings**: 30-45 minutes/week per developer
- **Documentation Quality**: Always up-to-date documentation
- **Reduced Technical Debt**: Proactive maintenance

---

### Task 1.1: Planning & Design (1 hour)

#### Pre-Implementation Checklist
- [ ] Review Phase 2 plan completely
- [ ] Read `DRIFT_DETECTION_SPEC.md` (to be created)
- [ ] Study existing `project-roadmap-agent` structure
- [ ] Review git integration patterns
- [ ] Verify Phase 1 complete (all tests passing)
- [ ] Create feature branch: `git checkout -b feature/context-agent`

#### Design Decisions

**1. Drift Detection Algorithm**

```typescript
/**
 * Drift Detection Strategy
 * 
 * Compare timestamps and content between:
 * - Source code files (via git history)
 * - Documentation files (markdown, READMEs, etc.)
 * 
 * Detect drift when:
 * 1. Code modified but docs not updated (timestamp mismatch)
 * 2. Function signatures changed but docs unchanged (content analysis)
 * 3. New files added but no documentation created
 * 4. Documentation references non-existent code
 */

interface DriftDetectionResult {
  hasDrift: boolean;
  driftItems: DriftItem[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  recommendations: string[];
}

interface DriftItem {
  type: 'outdated' | 'missing' | 'orphaned' | 'inconsistent';
  filePath: string;
  relatedDocPath?: string;
  description: string;
  lastCodeChange: Date;
  lastDocChange: Date;
  affectedElements: string[];  // Function/class names
}
```

**2. Git Integration Strategy**

- Use `simple-git` npm package for git operations
- Track file modification timestamps via git log
- Compare code commits vs. documentation commits
- Identify files changed since last doc update

**3. Auto-Sync Workflow**

```
User Request → Detect Drift → Generate Recommendations → [Require Approval] → Auto-Sync
```

**4. Architecture**

```typescript
project-context-agent/
├── src/
│   ├── types.ts              // Type definitions
│   ├── git-integration.ts    // Git operations wrapper
│   ├── drift-detection.ts    // Core drift detection algorithm
│   ├── content-analyzer.ts   // Code vs. doc content comparison
│   ├── sync-engine.ts        // Auto-sync implementation
│   ├── tools/
│   │   ├── detect-drift.ts   // Main drift detection tool
│   │   ├── suggest-updates.ts // Generate recommendations
│   │   ├── auto-sync.ts      // Execute sync with approval
│   │   └── health-check.ts   // Get context health score
│   └── index.ts              // MCP server entry
├── tests/
│   ├── drift-detection.test.ts  (30+ tests)
│   ├── git-integration.test.ts  (15+ tests)
│   └── sync-engine.test.ts      (15+ tests)
├── package.json
├── tsconfig.json
├── jest.config.cjs
├── README.md
└── CONTRIBUTING.md
```

#### Deliverables
- [ ] `DRIFT_DETECTION_SPEC.md` complete with algorithm details
- [ ] Architecture diagram created
- [ ] API contracts defined
- [ ] Design review checklist completed

---

### Task 1.2: Git Integration Module (1.5 hours)

#### Implementation

Create **src/git-integration.ts**:

```typescript
/**
 * Git Integration Module
 * 
 * Provides git operations for drift detection:
 * - File modification timestamps
 * - Commit history analysis
 * - Changed files since specific commit
 * - Author and commit message lookup
 * 
 * Uses simple-git library for git operations
 * 
 * @module git-integration
 */

import simpleGit, { SimpleGit, LogResult } from 'simple-git';
import * as path from 'path';
import * as fs from 'fs/promises';

/**
 * File modification information from git
 */
export interface FileModificationInfo {
  filePath: string;
  lastModified: Date;
  lastCommit: string;
  author: string;
  commitMessage: string;
}

/**
 * Git Integration Manager
 * 
 * Wraps simple-git with workspace-specific operations
 */
export class GitIntegration {
  private git: SimpleGit;
  private workspacePath: string;

  /**
   * Initialize git integration for workspace
   * 
   * @param workspacePath - Absolute path to git repository root
   * @throws Error if not a git repository
   */
  constructor(workspacePath: string) {
    this.workspacePath = workspacePath;
    this.git = simpleGit(workspacePath);
  }

  /**
   * Verify workspace is a git repository
   * 
   * @returns True if valid git repo
   */
  async isGitRepository(): Promise<boolean> {
    try {
      await this.git.rev

Parse();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file modification info from git history
   * 
   * @param filePath - Relative path to file within workspace
   * @returns Modification info or undefined if file not tracked
   */
  async getFileModificationInfo(filePath: string): Promise<FileModificationInfo | undefined> {
    try {
      const log: LogResult = await this.git.log({ file: filePath, maxCount: 1 });
      
      if (!log.latest) {
        return undefined;
      }

      return {
        filePath,
        lastModified: new Date(log.latest.date),
        lastCommit: log.latest.hash,
        author: log.latest.author_name,
        commitMessage: log.latest.message,
      };
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Get all files changed since specific commit
   * 
   * @param since - Commit hash or ref (e.g., 'HEAD~5', 'main')
   * @param filePattern - Optional glob pattern to filter files
   * @returns Array of changed file paths
   */
  async getChangedFilesSince(since: string, filePattern?: string): Promise<string[]> {
    try {
      const diff = await this.git.diff(['--name-only', since, 'HEAD']);
      let files = diff.split('\n').filter(f => f.length > 0);

      // Apply file pattern filter if provided
      if (filePattern) {
        const minimatch = await import('minimatch');
        files = files.filter(f => minimatch.minimatch(f, filePattern));
      }

      return files;
    } catch (error) {
      throw new Error(`Failed to get changed files: ${error}`);
    }
  }

  /**
   * Compare modification times between two files
   * 
   * @param file1 - First file path
   * @param file2 - Second file path
   * @returns Positive if file1 newer, negative if file2 newer, 0 if equal
   */
  async compareModificationTimes(file1: string, file2: string): Promise<number> {
    const info1 = await this.getFileModificationInfo(file1);
    const info2 = await this.getFileModificationInfo(file2);

    if (!info1 || !info2) {
      throw new Error('One or both files not found in git history');
    }

    return info1.lastModified.getTime() - info2.lastModified.getTime();
  }

  /**
   * Get commit count between two refs
   * 
   * @param from - Start ref
   * @param to - End ref (default: 'HEAD')
   * @returns Number of commits
   */
  async getCommitCount(from: string, to: string = 'HEAD'): Promise<number> {
    try {
      const log = await this.git.log([`${from}..${to}`]);
      return log.total;
    } catch {
      return 0;
    }
  }
}
```

**Code Comments**:
- ✅ All methods have comprehensive JSDoc
- ✅ Error handling documented
- ✅ Usage examples in comments

#### Testing

Create **tests/git-integration.test.ts**:
- Test repository validation (5 tests)
- Test file modification info (5 tests)
- Test changed files detection (5 tests)
- Test comparison operations (5 tests)

#### Deliverables
- [ ] `src/git-integration.ts` complete
- [ ] 15+ tests passing
- [ ] Error handling comprehensive
- [ ] Code compiles with 0 errors

---

### Task 1.3: Drift Detection Engine (2 hours)

#### Implementation

Create **src/drift-detection.ts** with:

```typescript
/**
 * Drift Detection Engine
 * 
 * Core algorithm for detecting documentation drift:
 * 1. Timestamp-based detection (code changed, docs didn't)
 * 2. Content-based detection (function signatures changed)
 * 3. Structural detection (new files without docs)
 * 4. Orphan detection (docs reference deleted code)
 * 
 * @module drift-detection
 */

export class DriftDetectionEngine {
  // ... implementation
}
```

**Key Features**:
- Configurable detection rules
- Severity scoring (critical/high/medium/low)
- Detailed recommendations
- Support for multiple languages

#### Testing

Create **tests/drift-detection.test.ts** (30+ tests)

#### Deliverables
- [ ] Drift detection algorithm implemented
- [ ] 30+ tests passing
- [ ] Performance acceptable (<2s for 100 files)

---

### Task 1.4: Sync Engine (1.5 hours)

#### Implementation

Create **src/sync-engine.ts**:
- Generate sync recommendations
- Require user approval before changes
- Execute updates safely
- Rollback on failure

#### Deliverables
- [ ] Sync engine implemented
- [ ] Approval workflow tested
- [ ] 15+ tests passing

---

### Task 1.5: MCP Tools (1 hour)

#### Tools to Implement

1. **detect_drift** - Identify drift in workspace
2. **suggest_updates** - Generate recommendations
3. **auto_sync** - Execute sync (with approval)
4. **get_context_health** - Health score (0-100)

#### Deliverables
- [ ] All 4 tools implemented
- [ ] Zod validation complete
- [ ] Tools tested in MCP Inspector

---

### Task 1.6: Documentation (1 hour)

#### Create Documentation

- **README.md**: Usage guide with examples
- **CONTRIBUTING.md**: Development guidelines
- **DRIFT_DETECTION_SPEC.md**: Algorithm details

#### Deliverables
- [ ] All documentation complete
- [ ] Examples tested and working

---

## 📋 Feature 2: Confidence Scoring System

### Overview
Add confidence scores to all agent outputs, helping users understand when to review AI-generated content carefully.

### Business Value
- **Builds Trust**: Users know when to double-check
- **Reduces Errors**: Flags uncertain outputs
- **User Guidance**: Provides review checklists

---

### Task 2.1: Confidence Scoring Design (1 hour)

#### Scoring Algorithm

```typescript
/**
 * Confidence Scoring Factors
 * 
 * Base score: 100
 * 
 * Deductions:
 * - Complex code patterns: -10 to -30
 * - Ambiguous intent: -10 to -20
 * - Edge cases detected: -5 to -15
 * - Language features (dynamic typing): -5 to -10
 * - Large codebase scope: -5 to -15
 * 
 * Final score: 0-100
 * - 90-100: High confidence
 * - 70-89: Medium confidence
 * - 0-69: Low confidence (review required)
 */

export interface ConfidenceScore {
  score: number;  // 0-100
  level: 'high' | 'medium' | 'low';
  factors: ConfidenceFactor[];
  requiresReview: boolean;
  validationChecklist: string[];
}

export interface ConfidenceFactor {
  factor: string;
  impact: number;  // Points deducted
  explanation: string;
}
```

#### Deliverables
- [ ] `CONFIDENCE_SCORING_SPEC.md` complete
- [ ] Scoring algorithm designed
- [ ] Validation checklist templates created

---

### Task 2.2: Implement Confidence Library (2 hours)

#### Create Shared Library

**Location**: `MCP-SERVER/shared/confidence-scoring/`

```typescript
// shared/confidence-scoring/index.ts
export class ConfidenceScorer {
  calculateScore(context: ScoringContext): ConfidenceScore {
    // ... implementation
  }
  
  generateChecklist(score: ConfidenceScore): string[] {
    // ... implementation
  }
}
```

#### Deliverables
- [ ] Confidence library implemented
- [ ] 20+ tests passing
- [ ] Integrated with all 4 agents

---

### Task 2.3: Integrate with Agents (1.5 hours)

#### Update All Agents

1. **Code Documentation Agent**: Add confidence to all tools
2. **Code Review Agent**: Add confidence to reviews
3. **Test Generator Agent**: Add confidence to generated tests
4. **Orchestration Agent**: Aggregate confidence scores

#### Deliverables
- [ ] All agents return confidence scores
- [ ] Regression tests pass (323+ existing tests)
- [ ] New tests for confidence scoring (20+ tests)

---

### Task 2.4: Documentation Updates (30 minutes)

#### Update Agent READMEs

Add sections on confidence scores:
- What they mean
- When to review outputs
- How scores are calculated

#### Deliverables
- [ ] All 4 agent READMEs updated
- [ ] Examples include confidence scores

---

## ✅ Phase 2 Completion Checklist

### Code Quality
- [ ] All code compiles with 0 errors
- [ ] Comprehensive JSDoc comments
- [ ] TypeScript strict mode enabled
- [ ] Error handling consistent

### Testing
- [ ] 50+ new tests added
- [ ] All new tests passing (100%)
- [ ] All existing tests passing (373+ total)
- [ ] Integration tests pass

### Documentation
- [ ] Context agent README complete
- [ ] Context agent CONTRIBUTING.md complete
- [ ] All agent READMEs updated
- [ ] DRIFT_DETECTION_SPEC.md complete
- [ ] CONFIDENCE_SCORING_SPEC.md complete

### Git & Deployment
- [ ] All code committed
- [ ] Feature branch merged
- [ ] All agents built successfully
- [ ] Claude Desktop config updated

### Master Checklist Update
- [ ] Update `MASTER_CHECKLIST.md` Phase 2 status
- [ ] Record time metrics
- [ ] Document lessons learned

---

## 📊 Success Metrics

### Quantitative
- **Lines of Code**: ~1,500 lines
- **Tests**: 50+ tests
- **Test Pass Rate**: 100%
- **Documentation**: ~800 lines

### Qualitative
- Drift detection accurate and useful
- Confidence scores build user trust
- Documentation always synchronized
- No performance degradation

---

## 🚨 Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Git integration complexity | Use battle-tested simple-git library |
| False positive drift detection | Configurable thresholds, user feedback loop |
| Confidence score accuracy | Iterative refinement based on user feedback |
| Performance with large repos | File count limits, progress tracking |

---

**Last Updated**: November 18, 2025  
**Status**: Ready for Implementation (After Phase 1)  
**Next Step**: Complete Phase 1, then begin Task 1.1
