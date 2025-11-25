# Plan of Attack: Guided Prompt Integration for Existing Project Review Workflow

## Goal
**What:** Fully implement and test the guided prompt step in the existing project review orchestration workflow, ensuring user goals are collected and drive subsequent improvements/documentation.
**Why:** Enables targeted, user-driven improvements after automated assessment, increasing workflow value and flexibility.
**Done When:** Guided prompt step is fully integrated, user goals are passed to next steps, outputs are written to files, and automated tests validate the flow.

## Context
- **Priority:** High
- **Deadline:** [Set by project lead]
- **Estimated Time:** 6-10 hours
- **Owner:** [Assigned developer]
- **Dependencies:** Orchestration agent, context-agent, documentation agent

## Phase Breakdown

### Phase 1: Analysis & Design (1-2 hours)
- [x] Review current orchestration workflow and guided prompt implementation
- [x] Design detailed guided prompt flow (user goals, follow-ups, context passing)

### Phase 2: Implementation (2-4 hours)
- [ ] Update orchestration workflow to ensure guided prompt step is fully integrated
- [ ] Implement or enhance guided prompt agent/tool logic
- [ ] Ensure user goals are passed to documentation/code generation step
- [ ] Update file outputs to include user goals and prompt results

### Phase 3: Testing & Validation (2-3 hours)
- [ ] Write automated tests for guided prompt step and integration
- [ ] Validate end-to-end workflow with sample project

### Phase 4: Documentation (1 hour)
- [ ] Update documentation to reflect guided prompt flow

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| User goals not captured clearly | High | Use follow-up prompts, validate input |
| Workflow breaks if prompt fails | Medium | Add error handling, fallback logic |
| Output files missing user goals | Medium | Add output validation in tests |

## Progress Tracking
- [x] Phase 1: Analysis & Design
- [ ] Phase 2: Implementation
- [ ] Phase 3: Testing & Validation
- [ ] Phase 4: Documentation
- [ ] Final Review
- [ ] Done ?

## Notes
- Start with workflow and agent review
- Focus on user experience and output traceability
- Prioritize test coverage for prompt logic and integration
