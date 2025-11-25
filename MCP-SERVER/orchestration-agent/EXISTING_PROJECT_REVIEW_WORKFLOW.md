# Existing Project Review Workflow

This workflow automates the review and documentation process for existing projects using the orchestration agent.

## Steps
1. **Automated Project Assessment**
   - Runs code review, lint, test coverage, security, and documentation scan on the full workspace.
2. **Guided User Prompts**
   - Asks the user what they want to improve or accomplish (e.g., add tests, refactor, update docs).
   - Clarifies modules and documentation style as needed.
3. **Documentation Generation**
   - Generates or updates documentation to match project standards, using context from previous steps.

## Usage
- Trigger the workflow using the `existing_project_review_workflow` tool in the orchestration agent.
- All results and generated documentation are written to files for review and handoff.

## Implementation
- See `src/existingProjectReviewWorkflow.ts` for the orchestration definition.
- See `tests/existingProjectReview.test.ts` for an integration test.

---

*This file documents the workflow and how to use it for systematic existing project improvement.*
