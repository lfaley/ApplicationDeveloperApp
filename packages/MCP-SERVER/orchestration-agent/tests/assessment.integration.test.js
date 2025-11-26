import { runAssessment } from '../src/assessment.js';
describe('Assessment Module Integration', () => {
    it('should orchestrate lint, test, security, and docs and aggregate results', async () => {
        const result = await runAssessment({
            workspacePath: '/mock/project',
            includeLint: true,
            includeTestCoverage: true,
            includeSecurity: true,
            includeDocs: true,
        });
        expect(result).toBeDefined();
        expect(result).toHaveProperty('summary');
        expect(Object.prototype.hasOwnProperty.call(result, 'lint')).toBe(true);
        expect(Object.prototype.hasOwnProperty.call(result, 'testCoverage')).toBe(true);
        expect(Object.prototype.hasOwnProperty.call(result, 'security')).toBe(true);
        expect(Object.prototype.hasOwnProperty.call(result, 'docs')).toBe(true);
    });
    it('should return only requested assessment results', async () => {
        const result = await runAssessment({
            workspacePath: '/mock/project',
            includeLint: true,
            includeTestCoverage: false,
            includeSecurity: false,
            includeDocs: false,
        });
        expect(result).toBeDefined();
        expect(result).toHaveProperty('summary');
        expect(Object.prototype.hasOwnProperty.call(result, 'lint')).toBe(true);
        expect(Object.prototype.hasOwnProperty.call(result, 'testCoverage')).toBe(false);
        expect(Object.prototype.hasOwnProperty.call(result, 'security')).toBe(false);
        expect(Object.prototype.hasOwnProperty.call(result, 'docs')).toBe(false);
    });
    it('should return a summary even if no options are enabled', async () => {
        const result = await runAssessment({ workspacePath: '/mock/project' });
        expect(result.summary).toMatch(/no assessment options enabled/i);
    });
});
//# sourceMappingURL=assessment.integration.test.js.map