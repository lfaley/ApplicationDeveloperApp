/**
 * Tests for Drift Detection Engine
 */

import { GitIntegration } from '../src/git-integration.js';
import { DriftDetector } from '../src/drift-detection.js';
import * as path from 'path';

const REPO_PATH = path.resolve(process.cwd(), '../..');

describe('DriftDetector', () => {
  let git: GitIntegration;
  let detector: DriftDetector;

  beforeAll(() => {
    git = new GitIntegration(REPO_PATH);
    detector = new DriftDetector(git);
  });

  describe('Drift Detection', () => {
    test('should detect drift in workspace', async () => {
      const result = await detector.detectDrift();

      expect(result).toBeDefined();
      expect(result.hasDrift).toBeDefined();
      expect(Array.isArray(result.driftItems)).toBe(true);
      expect(result.overallSeverity).toMatch(/^(critical|high|medium|low)$/);
      expect(result.summary).toBeDefined();
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(typeof result.scannedFiles).toBe('number');
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    test('should provide summary statistics', async () => {
      const result = await detector.detectDrift();

      expect(result.summary.totalDrifts).toBeDefined();
      expect(result.summary.critical).toBeGreaterThanOrEqual(0);
      expect(result.summary.high).toBeGreaterThanOrEqual(0);
      expect(result.summary.medium).toBeGreaterThanOrEqual(0);
      expect(result.summary.low).toBeGreaterThanOrEqual(0);

      // Total should equal sum of severities
      const sum = result.summary.critical + result.summary.high + 
                  result.summary.medium + result.summary.low;
      expect(result.summary.totalDrifts).toBe(sum);
    });

    test('should generate recommendations', async () => {
      const result = await detector.detectDrift();

      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.recommendations.length).toBeGreaterThan(0);
      
      // Each recommendation should be a string
      result.recommendations.forEach(rec => {
        expect(typeof rec).toBe('string');
        expect(rec.length).toBeGreaterThan(0);
      });
    });

    test('should categorize drift items', async () => {
      const result = await detector.detectDrift();

      result.driftItems.forEach(item => {
        expect(item.type).toMatch(/^(outdated|missing|orphaned|inconsistent)$/);
        expect(item.severity).toMatch(/^(critical|high|medium|low)$/);
        expect(item.filePath).toBeDefined();
        expect(item.description).toBeDefined();
        expect(item.lastCodeChange).toBeInstanceOf(Date);
        expect(Array.isArray(item.affectedElements)).toBe(true);
        expect(Array.isArray(item.recommendations)).toBe(true);
      });
    });
  });

  describe('Severity Calculation', () => {
    test('should calculate overall severity correctly', async () => {
      const result = await detector.detectDrift();

      const hasCritical = result.driftItems.some(d => d.severity === 'critical');
      const hasHigh = result.driftItems.some(d => d.severity === 'high');
      const hasMedium = result.driftItems.some(d => d.severity === 'medium');

      if (hasCritical) {
        expect(result.overallSeverity).toBe('critical');
      } else if (hasHigh) {
        expect(result.overallSeverity).toBe('high');
      } else if (hasMedium) {
        expect(result.overallSeverity).toBe('medium');
      } else {
        expect(result.overallSeverity).toBe('low');
      }
    });
  });

  describe('Drift Types', () => {
    test('should identify different drift types', async () => {
      const result = await detector.detectDrift();

      const outdated = result.driftItems.filter(d => d.type === 'outdated');
      const missing = result.driftItems.filter(d => d.type === 'missing');
      const orphaned = result.driftItems.filter(d => d.type === 'orphaned');

      // At least one type should be present (or none if perfect docs)
      expect(outdated.length + missing.length + orphaned.length).toBe(result.driftItems.length);
    });

    test('outdated drift should have both code and doc dates', async () => {
      const result = await detector.detectDrift();
      const outdated = result.driftItems.filter(d => d.type === 'outdated');

      outdated.forEach(item => {
        expect(item.lastCodeChange).toBeInstanceOf(Date);
        expect(item.lastDocChange).toBeInstanceOf(Date);
        expect(item.relatedDocPath).toBeDefined();
      });
    });

    test('missing drift should identify files without docs', async () => {
      const result = await detector.detectDrift();
      const missing = result.driftItems.filter(d => d.type === 'missing');

      missing.forEach(item => {
        expect(item.filePath).toBeDefined();
        expect(item.recommendations.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Recommendations', () => {
    test('should provide actionable recommendations per drift item', async () => {
      const result = await detector.detectDrift();

      result.driftItems.forEach(item => {
        expect(item.recommendations.length).toBeGreaterThan(0);
        
        item.recommendations.forEach(rec => {
          expect(typeof rec).toBe('string');
          expect(rec.length).toBeGreaterThan(10); // Substantial recommendation
        });
      });
    });

    test('should provide overall recommendations', async () => {
      const result = await detector.detectDrift();

      expect(result.recommendations.length).toBeGreaterThan(0);
      
      if (result.driftItems.length === 0) {
        expect(result.recommendations.some(r => r.includes('up to date'))).toBe(true);
      }
    });
  });

  describe('File Scanning', () => {
    test('should report number of scanned files', async () => {
      const result = await detector.detectDrift();

      expect(result.scannedFiles).toBeGreaterThanOrEqual(0);
    });

    test('should handle empty workspace gracefully', async () => {
      // This should not crash even if no files match patterns
      const result = await detector.detectDrift({
        includePatterns: ['nonexistent/**/*.xyz'],
      });

      expect(result).toBeDefined();
      expect(result.hasDrift).toBe(false);
      expect(result.driftItems.length).toBe(0);
    });
  });

  describe('Options Support', () => {
    test('should support include patterns', async () => {
      const result = await detector.detectDrift({
        includePatterns: ['**/*.md'],
      });

      expect(result).toBeDefined();
    });

    test('should support exclude patterns', async () => {
      const result = await detector.detectDrift({
        excludePatterns: ['node_modules/**'],
      });

      expect(result).toBeDefined();
    });

    test('should support severity threshold', async () => {
      const result = await detector.detectDrift({
        severityThreshold: 'high',
      });

      expect(result).toBeDefined();
    });
  });
});
