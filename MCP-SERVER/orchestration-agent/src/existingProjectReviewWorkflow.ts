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
    // 2. Guided user prompt (clarify goals, follow-ups, context passing)
    {
      agentId: 'context-agent',
      toolName: 'guided_prompt',
      args: {
        promptType: 'existing_project_goals',
        contextFromPrevious: true,
        followUps: [
          'Which modules or areas do you want to focus on?',
          'What documentation style or standards do you prefer?',
          'What is your top priority for improvement?',
        ],
        outputFiles: {
          userGoals: 'CONTEXT-SUMMARY/user_goals.json',
          promptResults: 'CONTEXT-SUMMARY/prompt_results.md',
        },
        errorHandling: {
          onUnclearInput: 'reprompt_or_suggest',
          onFailure: 'log_and_skip_to_default',
        },
      },
    },
    // 3. Documentation generation (standards-based, uses user goals)
    {
      agentId: 'code-documentation',
      toolName: 'batch_process',
      args: {
        files: '__WORKSPACE__',
        format: 'markdown',
        standards: 'project',
        contextFromPrevious: true, // Receives user goals and prompt results
      },
    },
  ],
  config: {
    passResults: true,
    continueOnError: false,
    aggregateResults: true,
  },
  description:
    'Existing project review, guided user goals, and standards-based documentation generation.',
};
