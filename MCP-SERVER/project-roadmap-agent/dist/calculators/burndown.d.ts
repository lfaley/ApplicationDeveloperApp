/**
 * Burndown Calculator - Sprint burndown chart data
 */
import { Sprint, RoadmapFeature, BurndownData } from '../types';
export declare class BurndownCalculator {
    private velocityCalc;
    /**
     * Generate burndown chart data for a sprint
     */
    generateBurndown(sprint: Sprint, features: RoadmapFeature[]): BurndownData;
    /**
     * Calculate actual remaining work at a specific date
     */
    private calculateActualRemaining;
    /**
     * Calculate days between two dates
     */
    private getDaysBetween;
    /**
     * Calculate sprint velocity (completed story points)
     */
    calculateSprintVelocity(sprint: Sprint, features: RoadmapFeature[]): number;
}
