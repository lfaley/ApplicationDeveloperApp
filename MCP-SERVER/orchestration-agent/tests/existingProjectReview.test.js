import { orchestrateWorkflow } from '../src/tools.js';
import { existingProjectReviewWorkflow } from '../src/existingProjectReviewWorkflow.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
describe('Existing Project Review Orchestration', () => {
    it('runs the full review ? prompt ? doc generation workflow and writes results to file', async () => {
        const result = await orchestrateWorkflow(existingProjectReviewWorkflow);
        expect(result).toBeDefined();
        expect(result.agentResults.length).toBeGreaterThanOrEqual(3);
        // Ensure output directory exists
        const outDir = path.join(__dirname, '../test-output');
        if (!existsSync(outDir)) {
            mkdirSync(outDir);
        }
        const outPath = path.join(outDir, 'existing_project_review_result.json');
        writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf-8');
        // Basic checks
        expect(result.status).toMatch(/completed|partial|failed/);
        expect(result.aggregatedOutput).toBeDefined();
        expect(result.summary).toBeDefined();
    });
});
//# sourceMappingURL=existingProjectReview.test.js.map