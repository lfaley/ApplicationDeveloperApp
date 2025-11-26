/**
 * Assessment Module Interface
 *
 * Provides a unified interface for running project assessments: lint, test, audit, doc scan.
 * This module can be expanded to invoke the appropriate agent/tool or run custom logic.
 */
import { orchestrateWorkflow } from './tools.js';
/**
 * Run project assessment using orchestration workflow
 * @param options Assessment options
 * @returns AssessmentResult
 */
export async function runAssessment(options) {
    // Build agent configs based on options
    const agents = [];
    const keyMap = {};
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
    const request = {
        pattern: 'concurrent',
        agents,
        config: {
            aggregateResults: true,
            continueOnError: true,
        },
        description: 'Automated project assessment (lint, test, audit, doc scan)',
    };
    const result = await orchestrateWorkflow(request);
    // Map results to assessment fields, always set keys if requested
    const assessment = {
        summary: result.summary,
    };
    for (const key in keyMap) {
        assessment[key] = '';
    }
    result.agentResults.forEach((r) => {
        // Use r.args if present, otherwise skip
        const args = r.args;
        if (args?.mode) {
            for (const key in keyMap) {
                if (args.mode === keyMap[key]) {
                    assessment[key] = typeof r.output === 'string' ? r.output : JSON.stringify(r.output ?? '');
                }
            }
        }
    });
    return assessment;
}
//# sourceMappingURL=assessment.js.map