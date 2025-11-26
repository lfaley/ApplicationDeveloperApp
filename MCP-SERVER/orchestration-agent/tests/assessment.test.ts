import { runAssessment } from '../src/assessment.js';

describe('Assessment Module', () => {
  it('returns results for all enabled options', async () => {
    const result = await runAssessment({
      workspacePath: '/tmp/project',
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
});
