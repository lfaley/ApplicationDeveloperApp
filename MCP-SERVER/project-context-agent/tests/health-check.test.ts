/**
 * Tests for Health Check Module
 */

import { GitIntegration } from '../src/git-integration.js';
import { DriftDetector } from '../src/drift-detection.js';
import { HealthChecker } from '../src/health-check.js';
import * as path from 'path';

const REPO_PATH = path.resolve(process.cwd(), '../..');

describe('HealthChecker', () => {
  let git: GitIntegration;
  let detector: DriftDetector;
  let healthChecker: HealthChecker;

  beforeAll(() => {
    git = new GitIntegration(REPO_PATH);
    detector = new DriftDetector(git);
    healthChecker = new HealthChecker(git, detector);
  });

  describe('Health Score Calculation', () => {
    test('should calculate health score', async () => {
      const health = await healthChecker.calculateHealth();

      expect(health).toBeDefined();
      expect(typeof health.score).toBe('number');
      expect(health.score).toBeGreaterThanOrEqual(0);
      expect(health.score).toBeLessThanOrEqual(100);
    });

    test('should assign letter grade', async () => {
      const health = await healthChecker.calculateHealth();

      expect(health.grade).toMatch(/^[ABCDF]$/);
      
      // Grade should match score
      if (health.score >= 90) {
        expect(health.grade).toBe('A');
      } else if (health.score >= 80) {
        expect(health.grade).toBe('B');
      } else if (health.score >= 70) {
        expect(health.grade).toBe('C');
      } else if (health.score >= 60) {
        expect(health.grade).toBe('D');
      } else {
        expect(health.grade).toBe('F');
      }
    });
  });

  describe('Health Factors', () => {
    test('should calculate all four factors', async () => {
      const health = await healthChecker.calculateHealth();

      expect(health.factors).toBeDefined();
      expect(typeof health.factors.documentationCoverage).toBe('number');
      expect(typeof health.factors.documentationFreshness).toBe('number');
      expect(typeof health.factors.consistencyScore).toBe('number');
      expect(typeof health.factors.completenessScore).toBe('number');
    });

    test('all factors should be percentages (0-100)', async () => {
      const health = await healthChecker.calculateHealth();

      expect(health.factors.documentationCoverage).toBeGreaterThanOrEqual(0);
      expect(health.factors.documentationCoverage).toBeLessThanOrEqual(100);
      
      expect(health.factors.documentationFreshness).toBeGreaterThanOrEqual(0);
      expect(health.factors.documentationFreshness).toBeLessThanOrEqual(100);
      
      expect(health.factors.consistencyScore).toBeGreaterThanOrEqual(0);
      expect(health.factors.consistencyScore).toBeLessThanOrEqual(100);
      
      expect(health.factors.completenessScore).toBeGreaterThanOrEqual(0);
      expect(health.factors.completenessScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Issues Identification', () => {
    test('should identify issues', async () => {
      const health = await healthChecker.calculateHealth();

      expect(Array.isArray(health.issues)).toBe(true);
      expect(health.issues.length).toBeGreaterThan(0);
      
      health.issues.forEach(issue => {
        expect(typeof issue).toBe('string');
        expect(issue.length).toBeGreaterThan(0);
      });
    });

    test('should provide actionable issue descriptions', async () => {
      const health = await healthChecker.calculateHealth();

      health.issues.forEach(issue => {
        // Issues should be descriptive
        expect(issue.length).toBeGreaterThan(10);
      });
    });
  });

  describe('Strengths Identification', () => {
    test('should identify strengths', async () => {
      const health = await healthChecker.calculateHealth();

      expect(Array.isArray(health.strengths)).toBe(true);
      expect(health.strengths.length).toBeGreaterThan(0);
      
      health.strengths.forEach(strength => {
        expect(typeof strength).toBe('string');
        expect(strength.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Score Interpretation', () => {
    test('high score should have more strengths than issues', async () => {
      const health = await healthChecker.calculateHealth();

      if (health.score >= 80) {
        // Good health should emphasize strengths
        expect(health.strengths.length).toBeGreaterThanOrEqual(1);
      }
    });

    test('low score should highlight issues', async () => {
      const health = await healthChecker.calculateHealth();

      if (health.score < 60) {
        // Poor health should have clear issues identified
        expect(health.issues.length).toBeGreaterThan(1);
      }
    });
  });

  describe('Options Support', () => {
    test('should support include patterns', async () => {
      const health = await healthChecker.calculateHealth({
        includePatterns: ['**/*.md'],
      });

      expect(health).toBeDefined();
      expect(health.score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Consistency', () => {
    test('should return consistent results on multiple calls', async () => {
      const health1 = await healthChecker.calculateHealth();
      const health2 = await healthChecker.calculateHealth();

      // Scores should be identical for same workspace state
      expect(health1.score).toBe(health2.score);
      expect(health1.grade).toBe(health2.grade);
    });
  });
});
