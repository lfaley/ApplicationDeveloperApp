/**
 * Forecast Calculator - Project completion forecasting
 */

import { RoadmapFeature, Forecast, VelocityMetrics } from '../types';

export class ForecastCalculator {
  /**
   * Generate project completion forecast
   */
  generateForecast(
    features: RoadmapFeature[],
    velocity: VelocityMetrics,
    remainingWork: number
  ): Forecast {
    if (velocity.average === 0) {
      return {
        completionDate: 'Unknown',
        confidence: 'low',
        remainingWork,
        sprintsRemaining: Infinity,
        method: 'velocity-based',
      };
    }

    const sprintsRemaining = Math.ceil(remainingWork / velocity.average);
    const completionDate = this.estimateDate(sprintsRemaining);
    const confidence = this.assessConfidence(velocity, features);

    return {
      completionDate,
      confidence,
      remainingWork,
      sprintsRemaining,
      method: 'velocity-based',
    };
  }

  /**
   * Estimate completion date from sprints remaining
   */
  private estimateDate(sprintsRemaining: number, sprintLength: number = 14): string {
    const days = sprintsRemaining * sprintLength;
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + days);

    return completionDate.toISOString().split('T')[0];
  }

  /**
   * Assess forecast confidence
   */
  private assessConfidence(
    velocity: VelocityMetrics,
    features: RoadmapFeature[]
  ): 'high' | 'medium' | 'low' {
    let score = 0;

    // Velocity consistency
    if (velocity.trend === 'stable') score += 2;
    else if (velocity.trend === 'increasing') score += 1;

    // Forecast accuracy
    if (velocity.forecastAccuracy > 85) score += 2;
    else if (velocity.forecastAccuracy > 70) score += 1;

    // Sprint history
    if (velocity.lastSprints.length >= 5) score += 1;
    else if (velocity.lastSprints.length >= 3) score += 0.5;

    // Blocked features
    const blockedCount = features.filter(f => f.status === 'blocked').length;
    const blockedRatio = blockedCount / features.length;
    if (blockedRatio < 0.1) score += 1;
    else if (blockedRatio < 0.2) score += 0.5;

    // Assess confidence
    if (score >= 5) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  }

  /**
   * Monte Carlo simulation for forecast range
   */
  monteCarloForecast(
    remainingWork: number,
    velocityHistory: number[],
    simulations: number = 1000
  ): {
    optimistic: string; // 10th percentile
    likely: string; // 50th percentile
    pessimistic: string; // 90th percentile
  } {
    if (velocityHistory.length === 0) {
      return {
        optimistic: 'Unknown',
        likely: 'Unknown',
        pessimistic: 'Unknown',
      };
    }

    const sprintCounts: number[] = [];

    for (let i = 0; i < simulations; i++) {
      let work = remainingWork;
      let sprints = 0;

      while (work > 0) {
        const velocity = this.sampleVelocity(velocityHistory);
        work -= velocity;
        sprints++;
      }

      sprintCounts.push(sprints);
    }

    sprintCounts.sort((a, b) => a - b);

    return {
      optimistic: this.estimateDate(sprintCounts[Math.floor(simulations * 0.1)]),
      likely: this.estimateDate(sprintCounts[Math.floor(simulations * 0.5)]),
      pessimistic: this.estimateDate(sprintCounts[Math.floor(simulations * 0.9)]),
    };
  }

  /**
   * Sample velocity from history with randomness
   */
  private sampleVelocity(velocityHistory: number[]): number {
    const mean = velocityHistory.reduce((sum, v) => sum + v, 0) / velocityHistory.length;
    const variance = velocityHistory.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / velocityHistory.length;
    const stdDev = Math.sqrt(variance);

    // Simple random sampling with normal distribution approximation
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    
    return Math.max(0, mean + z * stdDev);
  }
}
