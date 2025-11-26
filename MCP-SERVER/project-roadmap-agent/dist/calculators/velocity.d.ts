/**
 * Velocity Calculator - Team velocity metrics and forecasting
 */
import { Sprint, RoadmapFeature, VelocityMetrics } from '../types';
export declare class VelocityCalculator {
    /**
     * Calculate team velocity metrics from sprint history
     */
    calculateVelocity(sprints: Sprint[]): VelocityMetrics;
    /**
     * Check if sprint is completed
     */
    private isSprintCompleted;
    /**
     * Calculate velocity trend
     */
    private calculateTrend;
    /**
     * Calculate forecast accuracy
     */
    private calculateForecastAccuracy;
    /**
     * Calculate story points from complexity
     */
    storyPoints(complexity: RoadmapFeature['complexity']): number;
    /**
     * Calculate remaining work in story points
     */
    calculateRemainingWork(features: RoadmapFeature[]): number;
    /**
     * Estimate sprints remaining
     */
    estimateSprintsRemaining(remainingWork: number, velocity: number): number;
    /**
     * Estimate completion date
     */
    estimateCompletionDate(remainingWork: number, velocity: number, sprintLength?: number): string;
}
