import type { OrchestrationRequest } from './types.js';

/**
 * Existing Project Review & Documentation Orchestration Workflow
 *
 * Defines the agent sequence and data flow for reviewing an existing project,
 * collecting user goals, and generating documentation to standards.
 */
export const existingProjectReviewWorkflow: OrchestrationRequest = {
  pattern: 'sequential',
  agents: [
    // 1. Automated project assessment (lint, test, audit, doc scan)
    {
      agentId: 'code-review',
      toolName: 'review_code',
      args: {
        code: '__WORKSPACE__', // Special marker for full workspace scan
        mode: 'full',
        includeLint: true,
        includeTestCoverage: true,
        includeSecurity: true,
        includeDocs: true,
      },
    },
    // 2. Guided user prompt (clarify goals)
    {
      agentId: 'context-agent',
      toolName: 'guided_prompt',
      args: {
        promptType: 'existing_project_goals',
        contextFromPrevious: true,
      },
    },
    // 3. Documentation generation (standards-based)
    {
      agentId: 'code-documentation',
      toolName: 'batch_process',
      args: {
        files: '__WORKSPACE__',
        format: 'markdown',
        standards: 'project',
        contextFromPrevious: true,
      },
    },
  ],
  config: {
    passResults: true,
    continueOnError: false,
    aggregateResults: true,
  },
  description: 'Existing project review, user-guided goals, and documentation generation.'
};
