/**
 * Assessment Module Interface
 *
 * Provides a unified interface for running project assessments: lint, test, audit, doc scan.
 * This module can be expanded to invoke the appropriate agent/tool or run custom logic.
 */

import { orchestrateWorkflow } from './tools.js';
import type { OrchestrationRequest, OrchestrationResult } from './types.js';

export interface AssessmentOptions {
  workspacePath: string;
  includeLint?: boolean;
  includeTestCoverage?: boolean;
  includeSecurity?: boolean;
  includeDocs?: boolean;
}

export interface AssessmentResult {
  lint?: unknown;
  testCoverage?: unknown;
  security?: unknown;
  docs?: unknown;
  summary: string;
}

/**
 * Run project assessment using orchestration workflow
 * @param options Assessment options
 * @returns AssessmentResult
 */
export async function runAssessment(options: AssessmentOptions): Promise<AssessmentResult> {
  // Build agent configs based on options
  const agents = [];
  const keyMap: Record<string, string> = {};
  if (options.includeLint) {
    agents.push({
      agentId: 'code-review',
      toolName: 'review_code',
      args: {
        code: options.workspacePath,
        mode: 'lint',
      },
    });
    keyMap['lint'] = 'lint';
  }
  if (options.includeTestCoverage) {
    agents.push({
      agentId: 'code-review',
      toolName: 'review_code',
      args: {
        code: options.workspacePath,
        mode: 'test',
      },
    });
    keyMap['testCoverage'] = 'test';
  }
  if (options.includeSecurity) {
    agents.push({
      agentId: 'code-review',
      toolName: 'review_code',
      args: {
        code: options.workspacePath,
        mode: 'security',
      },
    });
    keyMap['security'] = 'security';
  }
  if (options.includeDocs) {
    agents.push({
      agentId: 'code-review',
      toolName: 'review_code',
      args: {
        code: options.workspacePath,
        mode: 'docs',
      },
    });
    keyMap['docs'] = 'docs';
  }

  if (agents.length === 0) {
    return { summary: 'No assessment options enabled.' };
  }

  const request: OrchestrationRequest = {
    pattern: 'concurrent',
    agents,
    config: {
      aggregateResults: true,
      continueOnError: true,
    },
    description: 'Automated project assessment (lint, test, audit, doc scan)',
  };

  const result: OrchestrationResult = await orchestrateWorkflow(request);

  // Map results to assessment fields, always set keys if requested
  const assessment: AssessmentResult = {
    summary: result.summary,
  };
  for (const key in keyMap) {
    assessment[key as keyof AssessmentResult] = undefined;
  }
  result.agentResults.forEach((r) => {
    if (r.args?.mode) {
      for (const key in keyMap) {
        if (r.args.mode === keyMap[key]) {
          assessment[key as keyof AssessmentResult] = r.output;
        }
      }
    }
  });
  return assessment;
}
