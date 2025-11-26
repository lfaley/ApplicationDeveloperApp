# Supplemental Templates

Quick-reference templates extracted from the main planning document.

---

## PRD Template

```markdown
# Product Requirements Document

**Product Name:** [Name]  
**Version:** 1.0  
**Date:** [Date]  
**Author:** [Name]

## Problem Statement

**Problem:** [What problem are we solving?]

**Impact:** [Who is affected and how?]

**Current Solution:** [What do people do now?]

**Limitations:** [Why doesn't the current solution work?]

## Proposed Solution

**Overview:** [High-level description]

**Key Features:**
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]

**Benefits:**
- [Benefit 1]
- [Benefit 2]

## User Stories

| ID | Priority | User Story | Acceptance Criteria |
|----|----------|------------|-------------------|
| US-001 | 🔴 | As a [role], I want [action], so that [benefit] | - [ ] Criteria 1<br>- [ ] Criteria 2 |
| US-002 | 🟡 | As a [role], I want [action], so that [benefit] | - [ ] Criteria 1<br>- [ ] Criteria 2 |

## Success Criteria

**Metrics:**
- [Metric 1]: [Target]
- [Metric 2]: [Target]

**Launch Criteria:**
- [ ] All MVP features complete
- [ ] Test coverage >= 80%
- [ ] Performance benchmarks met
- [ ] Security review passed

## Constraints

**Technical:** [Constraints]  
**Business:** [Constraints]  
**Timeline:** [Constraints]

## Out of Scope

- [Feature explicitly not included]
- [Future enhancement]
```

---

## Database Schema Template

```markdown
# Database Schema - [Table Name]

## Purpose
[What this table stores and why it exists]

## Schema

\`\`\`sql
CREATE TABLE table_name (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  parent_id INTEGER NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (parent_id) REFERENCES table_name(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_parent (parent_id)
);
\`\`\`

## Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| name | VARCHAR(255) | NOT NULL | Name of the record |
| description | TEXT | NULL | Optional description |
| status | VARCHAR(50) | DEFAULT 'active' | Record status |
| parent_id | INTEGER | NULL, FOREIGN KEY | Reference to parent record |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | AUTO UPDATE | Last modified timestamp |

## Relationships

**Foreign Keys:**
- `parent_id` → `table_name.id` (CASCADE DELETE)

**Referenced By:**
- `other_table.table_id` → `table_name.id`

## Indexes

| Index Name | Fields | Purpose |
|------------|--------|---------|
| idx_status | status | Filter by status |
| idx_parent | parent_id | Lookup parent relationships |

## CRUD Operations

### Create
\`\`\`typescript
interface CreateInput {
  name: string;
  description?: string;
  parent_id?: number;
}

async function create(data: CreateInput): Promise<Record>
\`\`\`

### Read
\`\`\`typescript
async function getById(id: number): Promise<Record | null>
async function getAll(): Promise<Record[]>
async function getByStatus(status: string): Promise<Record[]>
\`\`\`

### Update
\`\`\`typescript
async function update(id: number, data: Partial<Record>): Promise<Record>
\`\`\`

### Delete
\`\`\`typescript
async function deleteById(id: number): Promise<boolean>
\`\`\`

## Sample Data

\`\`\`sql
INSERT INTO table_name (name, description, status) VALUES 
  ('Item 1', 'Description 1', 'active'),
  ('Item 2', 'Description 2', 'active');
\`\`\`

## Validation Rules

- `name`: Required, 1-255 characters
- `description`: Optional, max 1000 characters
- `status`: Must be one of: 'active', 'inactive', 'archived'
- `parent_id`: Must reference existing record or NULL

## Business Rules

- Cannot delete record with children (CASCADE handles this)
- Status transitions: active ↔ inactive, any → archived
- Archived records cannot be modified
```

---

## Testing Phase Template

```markdown
# Testing Phase: [Phase Name]

## Overview
[Brief description of what this phase tests]

## Prerequisites
- [ ] [Prerequisite 1]
- [ ] [Prerequisite 2]

## Test Cases

### Test 1: [Test Name]

**Objective:** [What we're testing]

**Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:**
- [Expected outcome 1]
- [Expected outcome 2]

**Actual Result:** _[To be filled during testing]_

**Status:** ⏳ Not Started / 🔄 In Progress / ✅ Passed / ❌ Failed

**Notes:** [Any observations]

---

### Test 2: [Test Name]

[Repeat structure]

## Error Scenarios

### Error 1: [Error Description]

**Trigger:** [How to cause this error]

**Expected Behavior:** [What should happen]

**Test Steps:**
1. [Step 1]
2. [Step 2]

**Result:** ⏳ / ✅ / ❌

---

## Performance Benchmarks

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Response Time | < 200ms | - | ⏳ |
| Query Time | < 100ms | - | ⏳ |
| Memory Usage | < 200MB | - | ⏳ |

## Issues Found

| ID | Description | Severity | Status |
|----|-------------|----------|--------|
| 1 | [Issue description] | High/Med/Low | Open/Fixed |

## Sign-Off

- [ ] All test cases passed
- [ ] Performance benchmarks met
- [ ] Error scenarios handled
- [ ] Issues documented

**Tested By:** [Name]  
**Date:** [Date]  
**Result:** ✅ Passed / ❌ Failed
```

---

## Implementation Phase Template

```markdown
# Implementation Phase: [Phase Name]

**Duration:** [X weeks]  
**Status:** ⏳ Not Started / 🔄 In Progress / ✅ Complete  
**Progress:** [X%]

## Objectives

Primary goal: [Main objective]

Success criteria:
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

## Tasks

### Task 1: [Task Name]
**Status:** ⏳ / 🔄 / ✅  
**Estimate:** [X hours]  
**Actual:** [X hours]

**Steps:**
- [ ] Subtask 1
- [ ] Subtask 2
- [ ] Subtask 3

**Deliverables:**
- [ ] Files created: [list]
- [ ] Tests written: [list]
- [ ] Documentation updated: [list]

---

### Task 2: [Task Name]

[Repeat structure]

## Dependencies

**Blocked By:**
- [ ] [Dependency 1]
- [ ] [Dependency 2]

**Blocks:**
- [ ] [Future task 1]

## Technical Decisions

### Decision 1: [Decision Title]

**Context:** [Why this decision was needed]

**Options Considered:**
1. **Option A:** [Description]
   - Pros: [List]
   - Cons: [List]
2. **Option B:** [Description]
   - Pros: [List]
   - Cons: [List]

**Decision:** [Chosen option]

**Rationale:** [Why this was chosen]

**Trade-offs:** [What we're accepting]

**Impact:** [Effect on project]

---

## File Changes

### Created
- `path/to/file.ts` - [Purpose]
- `path/to/file.test.ts` - [Tests for above]

### Modified
- `path/to/existing.ts` - [Changes made]

### Deleted
- `path/to/old.ts` - [Reason for deletion]

## Testing

- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Manual testing complete
- [ ] Performance validated
- [ ] Security reviewed

**Test Coverage:** [X%]

## Documentation

- [ ] Code comments added
- [ ] API docs updated
- [ ] README updated
- [ ] User guide updated

## Issues & Blockers

### Active Blockers
- [Blocker 1] - [Status]

### Resolved Issues
- [Issue 1] - [Solution]

## Next Steps

After this phase:
1. [Next action 1]
2. [Next action 2]

## Sign-Off

**Completed By:** [Name]  
**Reviewed By:** [Name]  
**Date:** [Date]  
**Status:** ✅ Complete / ⏳ Pending
```

---

## Context Summary Template

```markdown
# Context Summary - [Month Day, Year]

**Project:** [Project Name]  
**Session:** [Morning/Afternoon/Evening]  
**Duration:** [X hours]  
**Timezone:** [Your Timezone]

---

## Session Overview

**Goal:** [Primary objective of this session]

**Context:** [Why this work is being done]

**Status:** [Current state - what's complete/in-progress/blocked]

---

## Previous Context

**Previous Session:** [Link to previous Context_Summary file]

**Key Points from Previous Work:**
- [Major decision 1]
- [Major decision 2]
- [Ongoing blocker]

---

## Current Work

### [Feature/Task Name]

**Objective:** [What we're trying to accomplish]

**Approach:** [How we're implementing it]

**Technical Details:**
- [Key technical decision 1]
- [Key technical decision 2]

**Progress Checklist:**
- [x] Step 1 completed ✅
- [ ] Step 2 in progress 🔄
- [ ] Step 3 pending ⏳

---

## File Changes

### Created Files
1. **`path/to/new/file.ts`**
   - Purpose: [What this file does]
   - Key features: [List]

2. **`path/to/test.test.ts`**
   - Tests for above file

### Modified Files
1. **`path/to/existing.ts`**
   - Changes: [What was modified]
   - Reason: [Why it was needed]

### Deleted Files
- None

---

## Important Notes

### Technical Decisions

**DECISION:** [Decision made]
- **WHY:** [Rationale]
- **ALTERNATIVES CONSIDERED:** [Other options]
- **TRADE-OFFS:** 
  - PRO: [Benefits]
  - CON: [Drawbacks]
- **IMPACT:** [Effect on project]

### Blockers

**BLOCKER:** [Issue description]
- **STATUS:** Active / Resolved
- **WORKAROUND:** [Temporary solution if any]
- **RESOLUTION:** [How it was fixed, if resolved]

### Next Steps

1. **[Next Action Item]**
   - Details: [Context]
   - Depends on: [Dependencies]
   - Timeline: [When]

2. **[Next Action Item]**
   - [Details]

---

## Timeline

### [YYYY-MM-DD | HH:MM TZ] [Action Title]

**User Request:** [What was asked for]

**Actions Taken:**
1. [Action 1]
2. [Action 2]
3. [Action 3]

**Technical Details:**
- [Detail 1]
- [Detail 2]

**Code Snippet:**
\`\`\`typescript
// Example code
function example() {
  // Implementation
}
\`\`\`

**Outcome:** [Result]

**Status:** ✅ Complete

---

### [YYYY-MM-DD | HH:MM TZ] [Another Action]

[Repeat structure for each significant action]

---

## Session Summary

**Accomplishments:**
- ✅ [Completed 1]
- ✅ [Completed 2]
- ✅ [Completed 3]

**In Progress:**
- 🔄 [Task 1]
- 🔄 [Task 2]

**Blockers:**
- ⏳ [Blocker 1]

**Next Session Goals:**
- [ ] [Goal 1]
- [ ] [Goal 2]

---

**Session End:** [HH:MM TZ]  
**Total Duration:** [X hours]  
**Overall Status:** [Brief status update]
```

---

## Feature Guide Template

```markdown
# Feature Guide - [Feature Name]

**Feature ID:** #[Number]  
**Status:** ✅ Complete / 🔄 In Progress / ⏳ Planned  
**Version:** [X.Y]  
**Date:** [Date]

---

## Table of Contents
1. [Overview](#overview)
2. [User Guide](#user-guide)
3. [Developer Documentation](#developer-documentation)
4. [API Reference](#api-reference)
5. [Testing Guide](#testing-guide)
6. [Troubleshooting](#troubleshooting)

---

## Overview

### Purpose
[What this feature does and why it exists]

### Key Benefits
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

### User Stories Addressed
- US-XXX: [User story]
- US-XXX: [User story]

---

## User Guide

### How to Use

**Step 1: [Action]**
1. [Detailed step]
2. [Detailed step]

**Step 2: [Action]**
1. [Detailed step]
2. [Detailed step]

### Example Workflows

**Workflow 1: [Common Use Case]**
1. User does [action]
2. System responds with [result]
3. User sees [output]

**Workflow 2: [Another Use Case]**
[Steps]

---

## Developer Documentation

### Architecture

**Components:**
- **[Component 1]**: [Purpose]
- **[Component 2]**: [Purpose]

**Data Flow:**
\`\`\`
User Action → Component A → Service B → Database → Response
\`\`\`

### File Structure
\`\`\`
src/
├── components/
│   └── FeatureName.tsx
├── services/
│   └── featureService.ts
└── types/
    └── feature.types.ts
\`\`\`

### Implementation Details

**Key Classes/Functions:**
\`\`\`typescript
// Example interface
interface FeatureConfig {
  setting1: string;
  setting2: number;
}

// Example function
function processFeature(config: FeatureConfig): Result {
  // Implementation
}
\`\`\`

---

## API Reference

### Functions

#### `functionName(param1, param2)`

**Purpose:** [What it does]

**Parameters:**
- `param1` (Type): [Description]
- `param2` (Type): [Description]

**Returns:** `Type` - [Description]

**Throws:** `ErrorType` - [When]

**Example:**
\`\`\`typescript
const result = functionName('value1', 123);
\`\`\`

---

## Testing Guide

### Test Cases

**Test 1: Happy Path**
\`\`\`typescript
it('should process feature correctly', () => {
  // Test implementation
});
\`\`\`

**Test 2: Error Handling**
\`\`\`typescript
it('should handle invalid input', () => {
  // Test implementation
});
\`\`\`

### Manual Testing Checklist
- [ ] Test case 1
- [ ] Test case 2
- [ ] Edge case 1
- [ ] Performance with large data

---

## Troubleshooting

### Common Issues

**Issue 1: [Problem Description]**
- **Symptoms:** [What user sees]
- **Cause:** [Root cause]
- **Solution:** [How to fix]

**Issue 2: [Problem Description]**
- [Details]

### Debug Tips
- [Tip 1]
- [Tip 2]

---

## Future Enhancements

- [ ] [Enhancement 1]
- [ ] [Enhancement 2]

---

**Last Updated:** [Date]  
**Maintained By:** [Team/Person]  
**Version:** [X.Y]
```

---

## Use These Templates

Copy and customize these templates for your project needs. They provide a starting point that you can adapt to your specific requirements.

**Remember:**
- Fill in all [placeholders]
- Remove sections that don't apply
- Add sections that are needed
- Keep templates updated as standards evolve
