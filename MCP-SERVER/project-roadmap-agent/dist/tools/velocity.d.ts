/**
 * Calculate Velocity Tool - Team velocity and metrics
 */
import { Sprint, RoadmapFeature, VelocityMetrics, BurndownData } from '../types';
export declare function calculateVelocity(sprints: Sprint[], features: RoadmapFeature[]): Promise<VelocityMetrics>;
/**
 * Generate burndown chart for specific sprint
 */
export declare function generateBurndown(sprint: Sprint, features: RoadmapFeature[]): Promise<BurndownData>;
/**
 * Calculate team metrics summary
 */
export declare function calculateTeamMetrics(sprints: Sprint[], features: RoadmapFeature[]): Promise<{
    velocity: VelocityMetrics;
    remainingWork: number;
    estimatedCompletion: string;
    confidence: 'high' | 'medium' | 'low';
}>;
/**
 * Calculate sprint health metrics
 */
export declare function calculateSprintHealth(sprint: Sprint, features: RoadmapFeature[]): Promise<{
    name: string;
    capacity: number;
    committed: number;
    completed: number;
    utilization: number;
    health: 'healthy' | 'at-risk' | 'over-capacity';
}>;
