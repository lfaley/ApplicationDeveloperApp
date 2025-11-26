import { orchestrateWorkflow } from '../src/tools.js';
import { existingProjectReviewWorkflow } from '../src/existingProjectReviewWorkflow.js';
import fs from 'fs';
import path from 'path';
function logDebug(message, ...args) {
    // Simple debug logger, can be enhanced or redirected as needed
    // eslint-disable-next-line no-console
    console.debug('[DEBUG]', message, ...args);
}
function ensureContextSummaryDir() {
    const dir = path.join(process.cwd(), 'CONTEXT-SUMMARY');
    if (!fs.existsSync(dir)) {
        logDebug('Creating CONTEXT-SUMMARY directory at', dir);
        fs.mkdirSync(dir, { recursive: true });
    }
}
describe('Existing Project Review Workflow', () => {
    it('should run the workflow and generate user goals and prompt results files', async () => {
        try {
            ensureContextSummaryDir();
            // Clean up output files before test
            const userGoalsPath = path.join(process.cwd(), 'CONTEXT-SUMMARY', 'user_goals.json');
            const promptResultsPath = path.join(process.cwd(), 'CONTEXT-SUMMARY', 'prompt_results.md');
            if (fs.existsSync(userGoalsPath))
                fs.unlinkSync(userGoalsPath);
            if (fs.existsSync(promptResultsPath))
                fs.unlinkSync(promptResultsPath);
            logDebug('Running orchestrateWorkflow with existingProjectReviewWorkflow');
            const result = await orchestrateWorkflow(existingProjectReviewWorkflow);
            logDebug('Workflow result:', result);
            // Check that output files are created
            const userGoalsExists = fs.existsSync(userGoalsPath);
            const promptResultsExists = fs.existsSync(promptResultsPath);
            logDebug('userGoals.json exists:', userGoalsExists);
            logDebug('prompt_results.md exists:', promptResultsExists);
            expect(userGoalsExists).toBe(true);
            expect(promptResultsExists).toBe(true);
            // Check that result contains expected structure
            expect(result).toHaveProperty('status');
            expect(result).toHaveProperty('agentResults');
            expect(Array.isArray(result.agentResults)).toBe(true);
        }
        catch (err) {
            logDebug('Test failed with error:', err);
            throw err;
        }
    });
});
//# sourceMappingURL=existingProjectReview.integration.test.js.map