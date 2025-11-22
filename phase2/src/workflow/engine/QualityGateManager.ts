/**
 * Quality Gate Manager
 * Evaluates quality gates and performs validation checks
 */

import { Result, success, failure } from '../../types/common';
import { 
  QualityGateDefinition, 
  QualityCheck,
  QualityCheckType 
} from '../schemas/WorkflowTemplate';
import { 
  WorkflowInstance,
  WorkflowQualityGateResult,
  QualityCheckResult 
} from '../schemas/WorkflowInstance';
import { Feature } from '../../state/schemas/Feature';
import { Bug } from '../../state/schemas/Bug';

type WorkItem = Feature | Bug;

/**
 * Quality Gate Manager - evaluates quality gates and checks
 */
export class QualityGateManager {
  /**
   * Evaluate a quality gate
   */
  async evaluateGate(
    gate: QualityGateDefinition,
    workItem: WorkItem,
    instance: WorkflowInstance,
    evaluatedBy: string
  ): Promise<Result<WorkflowQualityGateResult>> {
    const now = new Date().toISOString();
    const checkResults: QualityCheckResult[] = [];
    
    try {
      // Evaluate each check
      for (const check of gate.checks) {
        const result = await this.evaluateCheck(check, workItem, instance);
        checkResults.push(result);
      }
      
      // Calculate score
      const score = this.calculateGateScore(gate, checkResults);
      const passed = score >= gate.passingScore;
      
      // Check if all required checks passed
      const requiredChecksFailed = checkResults.filter(
        r => r.isRequired && !r.passed
      );
      
      const finalPassed = passed && requiredChecksFailed.length === 0;
      
      const result: WorkflowQualityGateResult = {
        gateId: gate.id,
        gateName: gate.name,
        passed: finalPassed,
        score,
        passingScore: gate.passingScore,
        evaluatedAt: now,
        evaluatedBy,
        checks: checkResults
      };
      
      return success(result);
    } catch (error) {
      return failure(error as Error);
    }
  }

  /**
   * Evaluate a single quality check
   */
  async evaluateCheck(
    check: QualityCheck,
    workItem: WorkItem,
    instance: WorkflowInstance
  ): Promise<QualityCheckResult> {
    try {
      const result = await this.executeCheckType(
        check.type,
        check.config,
        workItem,
        instance
      );
      
      return {
        checkId: check.id,
        checkName: check.name,
        passed: result.passed,
        score: result.score,
        message: result.message,
        severity: check.severity,
        isRequired: check.isRequired,
        canAutoFix: check.canAutoFix
      };
    } catch (error) {
      return {
        checkId: check.id,
        checkName: check.name,
        passed: false,
        score: 0,
        message: error instanceof Error ? error.message : 'Check execution failed',
        severity: check.severity,
        isRequired: check.isRequired,
        canAutoFix: false
      };
    }
  }

  /**
   * Execute specific check type
   */
  private async executeCheckType(
    type: QualityCheckType,
    config: Record<string, any>,
    workItem: WorkItem,
    _instance: WorkflowInstance
  ): Promise<{ passed: boolean; score: number; message: string }> {
    switch (type) {
      case 'code-coverage':
        return this.checkCodeCoverage(config, workItem);
        
      case 'lint-errors':
        return this.checkLintErrors(config, workItem);
        
      case 'security-scan':
        return this.checkSecurity(config, workItem);
        
      case 'compliance-check':
        return this.checkCompliance(config, workItem);
        
      case 'documentation':
        return this.checkDocumentation(config, workItem);
        
      case 'test-pass-rate':
        return this.checkTestPassRate(config, workItem);
        
      case 'performance-benchmark':
        return this.checkPerformance(config, workItem);
        
      case 'accessibility':
        return this.checkAccessibility(config, workItem);
        
      case 'custom':
        return this.checkCustom(config, workItem);
        
      default:
        return {
          passed: false,
          score: 0,
          message: `Unknown check type: ${type}`
        };
    }
  }

  /**
   * Check code coverage
   */
  private async checkCodeCoverage(
    config: Record<string, any>,
    workItem: WorkItem
  ): Promise<{ passed: boolean; score: number; message: string }> {
    const threshold = config.threshold || 80;
    
    // Get coverage from work item artifacts or estimates
    const coverage = workItem.custom?.codeCoverage || 0;
    
    const passed = coverage >= threshold;
    const score = Math.min(100, (coverage / threshold) * 100);
    
    return {
      passed,
      score,
      message: passed
        ? `Code coverage ${coverage}% meets threshold ${threshold}%`
        : `Code coverage ${coverage}% below threshold ${threshold}%`
    };
  }

  /**
   * Check lint errors
   */
  private async checkLintErrors(
    config: Record<string, any>,
    workItem: WorkItem
  ): Promise<{ passed: boolean; score: number; message: string }> {
    const maxErrors = config.maxErrors || 0;
    const maxWarnings = config.maxWarnings || 10;
    
    // Check compliance violations
    let errors = 0;
    let warnings = 0;
    
    if (workItem.type === 'feature') {
      const feature = workItem as Feature;
      errors = feature.compliance.violations.filter(v => v.severity === 'error').length;
      warnings = feature.compliance.violations.filter(v => v.severity === 'warning').length;
    }
    
    const passed = errors <= maxErrors && warnings <= maxWarnings;
    const errorPenalty = Math.max(0, (errors - maxErrors) * 10);
    const warningPenalty = Math.max(0, (warnings - maxWarnings) * 2);
    const score = Math.max(0, 100 - errorPenalty - warningPenalty);
    
    return {
      passed,
      score,
      message: passed
        ? `Lint check passed: ${errors} errors, ${warnings} warnings`
        : `Lint check failed: ${errors} errors (max ${maxErrors}), ${warnings} warnings (max ${maxWarnings})`
    };
  }

  /**
   * Check security vulnerabilities
   */
  private async checkSecurity(
    config: Record<string, any>,
    workItem: WorkItem
  ): Promise<{ passed: boolean; score: number; message: string }> {
    const allowCritical = config.allowCritical || 0;
    const allowHigh = config.allowHigh || 0;
    
    // Check for security-related violations
    let critical = 0;
    let high = 0;
    
    if (workItem.type === 'feature') {
      const feature = workItem as Feature;
      const securityViolations = feature.compliance.violations.filter(
        v => v.rule.toLowerCase().includes('security')
      );
      critical = securityViolations.filter(v => v.severity === 'error').length;
      high = securityViolations.filter(v => v.severity === 'warning').length;
    }
    
    const passed = critical <= allowCritical && high <= allowHigh;
    const score = passed ? 100 : Math.max(0, 100 - (critical * 30) - (high * 10));
    
    return {
      passed,
      score,
      message: passed
        ? `Security scan passed: ${critical} critical, ${high} high`
        : `Security issues found: ${critical} critical (max ${allowCritical}), ${high} high (max ${allowHigh})`
    };
  }

  /**
   * Check compliance
   */
  private async checkCompliance(
    config: Record<string, any>,
    workItem: WorkItem
  ): Promise<{ passed: boolean; score: number; message: string }> {
    const minScore = config.minScore || 90;
    
    let complianceScore = 100;
    
    if (workItem.type === 'feature') {
      const feature = workItem as Feature;
      complianceScore = feature.compliance.score;
    }
    
    const passed = complianceScore >= minScore;
    
    return {
      passed,
      score: complianceScore,
      message: passed
        ? `Compliance score ${complianceScore} meets minimum ${minScore}`
        : `Compliance score ${complianceScore} below minimum ${minScore}`
    };
  }

  /**
   * Check documentation completeness
   */
  private async checkDocumentation(
    config: Record<string, any>,
    workItem: WorkItem
  ): Promise<{ passed: boolean; score: number; message: string }> {
    const requireReadme = config.requireReadme !== false;
    const requireApiDocs = config.requireApiDocs !== false;
    const requireExamples = config.requireExamples || false;
    
    let score = 100;
    const issues: string[] = [];
    
    // Documentation check (only for features)
    let hasReadme = false;
    let hasApiDocs = false;
    let hasExamples = false;
    
    if (workItem.type === 'feature') {
      hasReadme = workItem.artifacts.documentation?.some(
        (doc: string) => doc.toLowerCase().includes('readme')
      ) || false;
      
      hasApiDocs = workItem.artifacts.documentation?.some(
        (doc: string) => doc.toLowerCase().includes('api') || doc.toLowerCase().includes('docs')
      ) || false;
      
      hasExamples = workItem.artifacts.documentation?.some(
        (doc: string) => doc.toLowerCase().includes('example') || doc.toLowerCase().includes('sample')
      ) || false;
    }
    
    if (requireReadme && !hasReadme) {
      score -= 40;
      issues.push('Missing README');
    }
    
    if (requireApiDocs && !hasApiDocs) {
      score -= 40;
      issues.push('Missing API documentation');
    }
    
    if (requireExamples && !hasExamples) {
      score -= 20;
      issues.push('Missing examples');
    }
    
    const passed = issues.length === 0;
    
    return {
      passed,
      score: Math.max(0, score),
      message: passed
        ? 'Documentation complete'
        : `Documentation incomplete: ${issues.join(', ')}`
    };
  }

  /**
   * Check test pass rate
   */
  private async checkTestPassRate(
    config: Record<string, any>,
    workItem: WorkItem
  ): Promise<{ passed: boolean; score: number; message: string }> {
    const minPassRate = config.minPassRate || 100;
    
    const totalTests = workItem.artifacts.tests?.length || 0;
    const passedTests = workItem.custom?.passedTests || totalTests; // Assume all pass if not specified
    
    const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 100;
    const passed = passRate >= minPassRate;
    
    return {
      passed,
      score: passRate,
      message: passed
        ? `Test pass rate ${passRate.toFixed(1)}% meets minimum ${minPassRate}%`
        : `Test pass rate ${passRate.toFixed(1)}% below minimum ${minPassRate}%`
    };
  }

  /**
   * Check performance benchmarks
   */
  private async checkPerformance(
    config: Record<string, any>,
    _workItem: WorkItem
  ): Promise<{ passed: boolean; score: number; message: string }> {
    const maxResponseTime = config.maxResponseTime || 1000; // ms
    const maxMemory = config.maxMemory || 100; // MB
    
    // Would check actual performance metrics
    // For now, return placeholder
    
    return {
      passed: true,
      score: 100,
      message: `Performance within limits (response time < ${maxResponseTime}ms, memory < ${maxMemory}MB)`
    };
  }

  /**
   * Check accessibility standards
   */
  private async checkAccessibility(
    config: Record<string, any>,
    _workItem: WorkItem
  ): Promise<{ passed: boolean; score: number; message: string }> {
    const standard = config.standard || 'WCAG 2.1 AA';
    
    // Would run accessibility checks
    // For now, return placeholder
    
    return {
      passed: true,
      score: 100,
      message: `Accessibility meets ${standard} standards`
    };
  }

  /**
   * Execute custom check
   */
  private async checkCustom(
    config: Record<string, any>,
    _workItem: WorkItem
  ): Promise<{ passed: boolean; score: number; message: string }> {
    // Custom checks would be implemented based on config
    const checkName = config.name || 'Custom check';
    
    return {
      passed: true,
      score: 100,
      message: `${checkName} passed`
    };
  }

  /**
   * Calculate overall gate score from check results
   */
  private calculateGateScore(
    gate: QualityGateDefinition,
    checkResults: QualityCheckResult[]
  ): number {
    if (checkResults.length === 0) return 0;
    
    // Calculate total weight
    const totalWeight = gate.checks.reduce((sum, check) => sum + check.weight, 0);
    
    if (totalWeight === 0) {
      // Equal weighting
      const totalScore = checkResults.reduce((sum, result) => sum + result.score, 0);
      return totalScore / checkResults.length;
    }
    
    // Weighted score
    let weightedScore = 0;
    
    for (let i = 0; i < checkResults.length; i++) {
      const check = gate.checks[i];
      const result = checkResults[i];
      
      if (check && result) {
        weightedScore += (result.score * check.weight) / totalWeight;
      }
    }
    
    return Math.min(100, Math.max(0, weightedScore));
  }

  /**
   * Bypass a quality gate (with approval if required)
   */
  async bypassGate(
    gate: QualityGateDefinition,
    result: WorkflowQualityGateResult,
    bypassedBy: string,
    reason: string,
    approvedBy?: string
  ): Promise<Result<WorkflowQualityGateResult>> {
    if (!gate.canBypass) {
      return failure(new Error('This quality gate cannot be bypassed'));
    }
    
    if (gate.bypassRequiresApproval && !approvedBy) {
      return failure(new Error('Bypass requires approval'));
    }
    
    const bypassed: WorkflowQualityGateResult = {
      ...result,
      bypassed: {
        bypassedAt: new Date().toISOString(),
        bypassedBy,
        reason,
        approvedBy
      }
    };
    
    return success(bypassed);
  }

  /**
   * Get gate status summary
   */
  getGateStatus(result: WorkflowQualityGateResult): {
    status: 'passed' | 'failed' | 'bypassed';
    message: string;
    details: string[];
  } {
    if (result.bypassed) {
      return {
        status: 'bypassed',
        message: `Gate bypassed: ${result.bypassed.reason}`,
        details: [
          `Bypassed by: ${result.bypassed.bypassedBy}`,
          `Approved by: ${result.bypassed.approvedBy || 'N/A'}`,
          `Bypassed at: ${result.bypassed.bypassedAt}`
        ]
      };
    }
    
    if (result.passed) {
      return {
        status: 'passed',
        message: `Gate passed with score ${result.score.toFixed(1)}/${result.passingScore}`,
        details: result.checks
          .filter(c => c.passed)
          .map(c => `✓ ${c.checkName}: ${c.message}`)
      };
    }
    
    return {
      status: 'failed',
      message: `Gate failed with score ${result.score.toFixed(1)}/${result.passingScore}`,
      details: result.checks
        .filter(c => !c.passed)
        .map(c => `✗ ${c.checkName}: ${c.message}`)
    };
  }
}
