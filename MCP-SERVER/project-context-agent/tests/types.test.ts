/**
 * Tests for Project Context Agent Types
 */

import {
  DriftDetectionRequestSchema,
  AutoSyncRequestSchema,
  HealthCheckRequestSchema,
  type DriftItem,
  type ContextHealthScore,
} from '../src/types.js';

describe('Type Validation', () => {
  describe('DriftDetectionRequestSchema', () => {
    test('should validate valid request', () => {
      const request = {
        workspacePath: '/path/to/workspace',
      };

      const result = DriftDetectionRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
    });

    test('should validate request with optional fields', () => {
      const request = {
        workspacePath: '/path/to/workspace',
        includePatterns: ['src/**/*.ts'],
        excludePatterns: ['node_modules/**'],
        severityThreshold: 'high' as const,
      };

      const result = DriftDetectionRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
    });

    test('should fail validation without workspacePath', () => {
      const request = {};

      const result = DriftDetectionRequestSchema.safeParse(request);
      expect(result.success).toBe(false);
    });
  });

  describe('AutoSyncRequestSchema', () => {
    test('should validate valid request', () => {
      const request = {
        workspacePath: '/path/to/workspace',
      };

      const result = AutoSyncRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.requireApproval).toBe(true);
        expect(result.data.createBackup).toBe(true);
      }
    });

    test('should accept optional overrides', () => {
      const request = {
        workspacePath: '/path/to/workspace',
        requireApproval: false,
        createBackup: false,
        driftItemIds: ['item1', 'item2'],
      };

      const result = AutoSyncRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.requireApproval).toBe(false);
        expect(result.data.createBackup).toBe(false);
        expect(result.data.driftItemIds).toHaveLength(2);
      }
    });
  });

  describe('HealthCheckRequestSchema', () => {
    test('should validate valid request', () => {
      const request = {
        workspacePath: '/path/to/workspace',
      };

      const result = HealthCheckRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
    });

    test('should accept includePatterns', () => {
      const request = {
        workspacePath: '/path/to/workspace',
        includePatterns: ['src/**/*.ts', 'docs/**/*.md'],
      };

      const result = HealthCheckRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
    });
  });
});

describe('Type Structure', () => {
  test('DriftItem should have correct structure', () => {
    const driftItem: DriftItem = {
      type: 'outdated',
      severity: 'high',
      filePath: '/src/example.ts',
      relatedFiles: ['/docs/example.md'],
      relatedDocPath: '/docs/example.md',
      description: 'Documentation is outdated',
      lastCodeChange: new Date(),
      lastDocChange: new Date(),
      affectedElements: ['functionName'],
      recommendations: ['Update documentation'],
    };

    expect(driftItem.type).toBe('outdated');
    expect(driftItem.severity).toBe('high');
    expect(driftItem.affectedElements).toHaveLength(1);
  });

  test('ContextHealthScore should have correct structure', () => {
    const healthScore: ContextHealthScore = {
      score: 85,
      grade: 'B',
      factors: {
        documentationCoverage: 90,
        documentationFreshness: 80,
        consistencyScore: 85,
        completenessScore: 85,
      },
      issues: ['Minor outdated docs'],
      strengths: ['Good coverage'],
    };

    expect(healthScore.score).toBe(85);
    expect(healthScore.grade).toBe('B');
    expect(healthScore.factors.documentationCoverage).toBe(90);
  });
});
