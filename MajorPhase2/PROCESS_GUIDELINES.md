# Process Guidelines for AI/LLM Interactions

## Document Information
- **Version**: 1.0.0
- **Last Updated**: 2025-11-17
- **Purpose**: Prevent response limit errors in AI-driven workflows
- **Audience**: Developers, AI agents, automation scripts

---

## Problem Statement

When creating large documentation or code files with AI assistance (Copilot, LLMs), we encounter:
- **Error**: "Sorry, the response hit the length limit. Please rephrase your prompt."
- **Cause**: Single response exceeds token/length limits (typically 4000-8000 tokens)
- **Impact**: Incomplete files, wasted time, disrupted workflows

---

## Solution: Chunked Generation Strategy

### Core Principle
**Never request a complete large document in a single prompt. Always break into logical chunks.**

### Chunk Size Guidelines

| Document Type | Target Size Per Chunk | Max Lines Per Chunk |
|---------------|----------------------|---------------------|
| Technical Specs | 300-500 lines | 500 |
| Architecture Docs | 400-600 lines | 600 |
| API Documentation | 200-400 lines | 400 |
| Code Files | 150-300 lines | 300 |
| Implementation Guides | 300-500 lines | 500 |

### Chunking Strategies

#### 1. Section-Based Chunking (Preferred)
Break documents by major sections:

```markdown
# Agent Architecture Document

## Request Pattern:
1. "Create AGENT_ARCHITECTURE.md Part 1: Overview and Agent 1-2"
2. "Continue with Part 2: Agents 3-4"  
3. "Continue with Part 3: Agents 5-6"
4. "Complete with Part 4: Integration and Summary"
```

#### 2. Feature-Based Chunking
For multi-feature documents:

```markdown
# Integration Layer

## Request Pattern:
1. "Create INTEGRATION_LAYER.md with VS Code extension section only"
2. "Add CLI tool section to INTEGRATION_LAYER.md"
3. "Add Git hooks section to INTEGRATION_LAYER.md"
4. "Complete with API contracts and examples"
```

#### 3. Progressive Enhancement
Start minimal, then enhance:

```markdown
## Request Pattern:
1. "Create STATE_MANAGEMENT.md with overview and core schemas"
2. "Add CRUD operations section"
3. "Add transactions and caching section"
4. "Add performance and migration sections"
```

---

## Prompt Design Patterns

### ❌ BAD: Single Large Request
```
"Create AGENT_ARCHITECTURE.md with complete specifications for all 6 agents 
including interfaces, implementations, examples, integration patterns, and 
error handling for each agent."
```
**Why Bad**: Will hit 4000+ line limit, fail mid-generation

### ✅ GOOD: Chunked Request with Clear Boundaries
```
"Create AGENT_ARCHITECTURE.md Part 1 of 3:
- Document header and overview
- Agent 1: Feature Implementation Agent (complete spec)
- Agent 2: Standards Compliance Agent (complete spec)
Stop after Agent 2. I'll request Part 2 next."
```
**Why Good**: Clear scope, ~500 lines, won't hit limit

### ✅ BETTER: Continuation Pattern
```
First Request: "Create AGENT_ARCHITECTURE.md with Overview and Agents 1-2"
Second Request: "Continue AGENT_ARCHITECTURE.md with Agents 3-4"
Third Request: "Complete AGENT_ARCHITECTURE.md with Agents 5-6 and summary"
```
**Why Better**: Natural progression, manageable chunks

---

## File Creation Patterns

### Pattern 1: Create + Append
```typescript
// Step 1: Create with foundation
create_file({
  path: "AGENT_ARCHITECTURE.md",
  content: `# Agent Architecture
  
## Overview
[Overview content]

## Agent 1: Feature Implementation Agent
[Complete Agent 1 spec]

## Agent 2: Standards Compliance Agent
[Complete Agent 2 spec]
`
});

// Step 2: Append remaining sections
replace_string_in_file({
  oldString: "## Agent 2: Standards Compliance Agent\n[Complete Agent 2 spec]",
  newString: `## Agent 2: Standards Compliance Agent
[Complete Agent 2 spec]

## Agent 3: Test Generation Agent
[Complete Agent 3 spec]

## Agent 4: Code Documentation Agent
[Complete Agent 4 spec]`
});

// Step 3: Final sections
// ... continue pattern
```

### Pattern 2: Multi-File Approach
For extremely large specifications, split into multiple files:

```
agents/
├── AGENT_ARCHITECTURE.md (overview + index)
├── FEATURE_IMPLEMENTATION_AGENT.md
├── STANDARDS_COMPLIANCE_AGENT.md
├── TEST_GENERATION_AGENT.md
├── CODE_DOCUMENTATION_AGENT.md
├── BUG_ANALYSIS_AGENT.md
└── PROJECT_ROADMAP_AGENT.md
```

**When to use**: 
- Each agent spec > 500 lines
- Total document would exceed 3000 lines
- Individual specs need frequent updates

---

## Token Estimation Guidelines

### Quick Token Estimation
```
1 token ≈ 4 characters (English text)
1 token ≈ 0.75 words (average)
1 line of code ≈ 10-20 tokens
1 line of markdown ≈ 15-25 tokens
```

### Document Size Estimates

| Lines | Est. Tokens | Safe for Single Response? |
|-------|-------------|---------------------------|
| 100 | ~1,500 | ✅ Yes |
| 300 | ~4,500 | ✅ Yes |
| 500 | ~7,500 | ⚠️ Risky - may hit limit |
| 800 | ~12,000 | ❌ No - will fail |
| 1000+ | ~15,000+ | ❌ No - must chunk |

### Response Limit Thresholds

| AI Service | Typical Limit | Safe Target |
|------------|---------------|-------------|
| GitHub Copilot | ~8,000 tokens | 5,000 tokens (300-400 lines) |
| GPT-4 | ~8,000 tokens | 5,000 tokens |
| Claude | ~4,000 tokens | 3,000 tokens (200-300 lines) |
| Generic | ~4,000 tokens | 2,500 tokens (150-250 lines) |

---

## Workflow Integration

### For Documentation Generation

#### Step 1: Plan Document Structure
```markdown
Document: AGENT_ARCHITECTURE.md
Total Estimated Size: 2,000 lines

Chunking Plan:
- Part 1: Overview + Agents 1-2 (~500 lines)
- Part 2: Agents 3-4 (~500 lines)
- Part 3: Agents 5-6 (~500 lines)
- Part 4: Integration + Summary (~500 lines)
```

#### Step 2: Create Progress Tracking
```typescript
const documentPlan = {
  name: "AGENT_ARCHITECTURE.md",
  totalParts: 4,
  parts: [
    { id: 1, status: "not-started", content: "Overview + Agents 1-2" },
    { id: 2, status: "not-started", content: "Agents 3-4" },
    { id: 3, status: "not-started", content: "Agents 5-6" },
    { id: 4, status: "not-started", content: "Integration + Summary" },
  ]
};
```

#### Step 3: Execute with Checkpoints
```
Request 1: "Create part 1..."
✓ Complete → Update user
User: "continue"

Request 2: "Add part 2..."
✓ Complete → Update user
User: "continue"

... continue until complete
```

### For Code Generation

#### Multi-Class Files
```typescript
// Request 1: Create file with first 2 classes
create_file("StateManager.ts", `
export class StateManager {
  // Complete implementation
}

export class WorkflowEngine {
  // Complete implementation
}
`);

// Request 2: Add remaining classes
replace_string_in_file({
  oldString: "export class WorkflowEngine {\n  // Complete implementation\n}",
  newString: `export class WorkflowEngine {
  // Complete implementation
}

export class ComplianceEngine {
  // Complete implementation
}

export class AgentOrchestrator {
  // Complete implementation
}`
});
```

#### Large Classes
For classes > 300 lines, split by sections:

```typescript
// Request 1: Class skeleton + core methods
export class ProjectPlanner {
  // Properties
  // Constructor
  // Core public methods (3-5 methods)
}

// Request 2: Add data management methods
// Request 3: Add utility methods
// Request 4: Add event handlers
```

---

## Best Practices Summary

### ✅ DO

1. **Estimate before requesting**
   - Count expected sections/features
   - Estimate lines per section
   - If total > 500 lines, chunk it

2. **Use clear chunk boundaries**
   - "Part 1 of 3"
   - "Stop after section X"
   - "Continue from section Y"

3. **Provide continuation context**
   - "Add to existing file..."
   - "Continue after Agent 2..."
   - "Complete the document with..."

4. **Track progress visibly**
   - Show "Part X of Y complete"
   - Update todo lists
   - Confirm with user between chunks

5. **Test incrementally**
   - Verify each chunk compiles/renders
   - Fix issues before next chunk
   - Don't accumulate errors

### ❌ DON'T

1. **Don't request complete large documents**
   - Never ask for 1000+ line files
   - Don't combine multiple large sections
   - Don't assume "it will fit"

2. **Don't ignore size warnings**
   - If response feels truncated, it is
   - Don't hope it completed
   - Check file size immediately

3. **Don't batch unrelated large items**
   - Don't create multiple 500+ line files in one request
   - Don't append 3 large sections simultaneously
   - One chunk at a time

4. **Don't lose context**
   - Always reference what was just created
   - Maintain document structure awareness
   - Know where to continue from

---

## Error Recovery

### If Response Limit Hit

1. **Identify truncation point**
   ```bash
   # Check where file ends
   tail -20 AGENT_ARCHITECTURE.md
   ```

2. **Determine what's missing**
   - Compare against planned structure
   - Note incomplete sections

3. **Request continuation**
   ```
   "The previous response was truncated. Continue AGENT_ARCHITECTURE.md 
   starting from [specific section/heading]. Include [remaining sections]."
   ```

4. **Verify completion**
   - Check file has proper closing
   - Verify all planned sections present
   - Test rendering/compilation

### Prevention Checklist

Before making a generation request:

- [ ] Estimated lines < 500?
- [ ] Single logical chunk?
- [ ] Clear stopping point defined?
- [ ] Continuation strategy planned?
- [ ] Progress tracking in place?

If ANY answer is "No", re-chunk the request.

---

## Examples: Common Scenarios

### Scenario 1: Large Technical Specification

**Task**: Create AGENT_ARCHITECTURE.md (estimated 2,000 lines, 6 major sections)

**Bad Approach**:
```
"Create complete AGENT_ARCHITECTURE.md with all 6 agents fully specified"
→ FAILS at ~500-600 lines
```

**Good Approach**:
```
Request 1: "Create AGENT_ARCHITECTURE.md with:
- Document header and table of contents
- Overview section
- Agent 1: Feature Implementation Agent (complete)
- Agent 2: Standards Compliance Agent (complete)
Stop after Agent 2."

Request 2: "Continue AGENT_ARCHITECTURE.md. Add:
- Agent 3: Test Generation Agent (complete)
- Agent 4: Code Documentation Agent (complete)
Stop after Agent 4."

Request 3: "Complete AGENT_ARCHITECTURE.md. Add:
- Agent 5: Bug Analysis Agent (complete)
- Agent 6: Project Roadmap Agent (complete)
- Integration section
- Summary"
```

### Scenario 2: Complex Implementation File

**Task**: Create StateManager.ts (estimated 800 lines, multiple classes)

**Bad Approach**:
```
"Create StateManager.ts with StateManager, WorkflowEngine, ComplianceEngine, 
and AgentOrchestrator classes all fully implemented"
→ FAILS at class 2-3
```

**Good Approach**:
```
Request 1: "Create StateManager.ts with StateManager class fully implemented 
(~300 lines)"

Request 2: "Add WorkflowEngine class to StateManager.ts (~250 lines)"

Request 3: "Add ComplianceEngine class to StateManager.ts (~250 lines)"

Request 4: "Add AgentOrchestrator class and exports to StateManager.ts"
```

### Scenario 3: Multi-Section Documentation

**Task**: Create IMPLEMENTATION_ROADMAP.md (estimated 1,500 lines, 4 phases)

**Good Approach - Option A (Section-based)**:
```
Request 1: "Create IMPLEMENTATION_ROADMAP.md Part 1:
- Overview
- Phase 2A: Workflow Foundation (complete details)"

Request 2: "Continue with Part 2:
- Phase 2B: Development Tools (complete details)"

Request 3: "Continue with Part 3:
- Phase 2C: Agent Integration (complete details)"

Request 4: "Complete with Part 4:
- Phase 2D: Advanced Features
- Timeline and dependencies
- Risk mitigation"
```

**Good Approach - Option B (Progressive enhancement)**:
```
Request 1: "Create IMPLEMENTATION_ROADMAP.md with:
- Overview
- All 4 phase summaries (50 lines each)"

Request 2: "Expand Phase 2A with complete task breakdown"

Request 3: "Expand Phase 2B with complete task breakdown"

Request 4: "Expand Phases 2C and 2D, add timeline and dependencies"
```

---

## Integration with ProjectPlanner Phase 2

### Updated Workflow for Document Generation

When generating Phase 2 documentation:

1. **Planning Phase**
   ```typescript
   interface DocumentPlan {
     name: string;
     estimatedLines: number;
     sections: Section[];
     chunkingStrategy: 'section' | 'progressive' | 'multi-file';
     chunks: Chunk[];
   }
   
   interface Chunk {
     id: number;
     sections: string[];
     estimatedLines: number;
     status: 'pending' | 'in-progress' | 'complete';
   }
   ```

2. **Execution Phase**
   - Generate chunk 1
   - User confirms quality
   - Generate chunk 2
   - Repeat until complete

3. **Validation Phase**
   - Verify total document coherence
   - Check all sections present
   - Validate cross-references
   - Test rendering

### Agent-Driven Document Generation

Future agents should implement:

```typescript
export class DocumentationAgent {
  async generateLargeDocument(spec: DocumentSpec): Promise<void> {
    // Automatic chunking
    const chunks = this.planChunks(spec);
    
    // Progressive generation
    for (const chunk of chunks) {
      await this.generateChunk(chunk);
      await this.validateChunk(chunk);
      
      // Checkpoint
      if (!chunk.isLast) {
        await this.requestUserConfirmation();
      }
    }
    
    // Final validation
    await this.validateComplete(spec);
  }
  
  private planChunks(spec: DocumentSpec): Chunk[] {
    const targetLinesPerChunk = 400;
    const chunks: Chunk[] = [];
    
    let currentChunk: Chunk = { sections: [], estimatedLines: 0 };
    
    for (const section of spec.sections) {
      if (currentChunk.estimatedLines + section.estimatedLines > targetLinesPerChunk) {
        chunks.push(currentChunk);
        currentChunk = { sections: [], estimatedLines: 0 };
      }
      
      currentChunk.sections.push(section);
      currentChunk.estimatedLines += section.estimatedLines;
    }
    
    if (currentChunk.sections.length > 0) {
      chunks.push(currentChunk);
    }
    
    return chunks;
  }
}
```

---

## Metrics and Monitoring

### Track Response Size Issues

```typescript
interface GenerationMetrics {
  requestId: string;
  documentName: string;
  requestedLines: number;
  actualLines: number;
  hitLimit: boolean;
  tokensEstimated: number;
  timeMs: number;
}

// Log all generations
const metrics: GenerationMetrics[] = [];

// Analysis
function analyzeGenerationPatterns() {
  const failures = metrics.filter(m => m.hitLimit);
  const avgFailureSize = failures.reduce((sum, m) => sum + m.requestedLines, 0) / failures.length;
  
  console.log(`Failure rate: ${(failures.length / metrics.length * 100).toFixed(1)}%`);
  console.log(`Average failure size: ${avgFailureSize} lines`);
  console.log(`Recommended max chunk size: ${Math.floor(avgFailureSize * 0.7)} lines`);
}
```

### Success Criteria

- **Zero response limit errors** in production workflows
- **< 5% chunk rework** (needing to regenerate chunks)
- **Smooth user experience** (predictable chunk boundaries)
- **Complete documents** (no missing sections)

---

## Quick Reference Card

### Safe Chunk Sizes by Content Type

| Content Type | Max Lines | Max Tokens |
|--------------|-----------|------------|
| Markdown overview | 300 | ~4,500 |
| Technical spec section | 400 | ~6,000 |
| TypeScript class | 250 | ~4,000 |
| API documentation | 300 | ~4,500 |
| Implementation guide | 350 | ~5,000 |
| Complete multi-agent spec | 500 | ~7,500 |

### Red Flags (Will Hit Limit)

- ⛔ "Create complete [X] with all..." (if X > 500 lines)
- ⛔ "Generate full implementation of..." (if > 300 lines)
- ⛔ Requesting 3+ major sections simultaneously
- ⛔ "Include all examples and edge cases"
- ⛔ Combining multiple agents/classes/features

### Safe Patterns

- ✅ "Create [X] Part 1 of 3: [specific sections]"
- ✅ "Add [single section] to existing file"
- ✅ "Continue from [specific point]"
- ✅ "Generate [single class/agent/feature]"
- ✅ Request 300-400 lines at a time

---

## Conclusion

**Golden Rule**: If you think a request might be too big, it probably is. Chunk it.

**Success Formula**: 
```
Estimated Lines > 500 → Split into chunks
Estimated Lines > 300 → Consider chunking
Estimated Lines < 300 → Safe for single request
```

**Recovery**: If hit limit anyway, immediately request continuation with specific context.

**Future**: Implement automated chunking in ProjectPlanner agents to eliminate manual planning.

