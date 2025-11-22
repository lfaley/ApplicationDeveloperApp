/**
 * Calculate Velocity Tool - Team velocity and metrics
 */

import { VelocityCalculator, ForecastCalculator, BurndownCalculator } from '../calculators';
import { Sprint, RoadmapFeature, VelocityMetrics, BurndownData } from '../types';

export async function calculateVelocity(
  sprints: Sprint[],
  features: RoadmapFeature[]
): Promise<VelocityMetrics> {
  const velocityCalc = new VelocityCalculator();

  // Update sprint completed points
  for (const sprint of sprints) {
    sprint.completed = velocityCalc.calculateRemainingWork(
      features.filter(f => f.sprint === sprint.name && f.status === 'completed')
    );
  }

  return velocityCalc.calculateVelocity(sprints);
}

/**
 * Generate burndown chart for specific sprint
 */
export async function generateBurndown(
  sprint: Sprint,
  features: RoadmapFeature[]
): Promise<BurndownData> {
  const burndownCalc = new BurndownCalculator();
  return burndownCalc.generateBurndown(sprint, features);
}

/**
 * Calculate team metrics summary
 */
export async function calculateTeamMetrics(
  sprints: Sprint[],
  features: RoadmapFeature[]
): Promise<{
  velocity: VelocityMetrics;
  remainingWork: number;
  estimatedCompletion: string;
  confidence: 'high' | 'medium' | 'low';
}> {
  const velocityCalc = new VelocityCalculator();
  const forecastCalc = new ForecastCalculator();

  // Calculate velocity
  const velocity = await calculateVelocity(sprints, features);

  // Calculate remaining work
  const remainingWork = velocityCalc.calculateRemainingWork(features);

  // Generate forecast
  const forecast = forecastCalc.generateForecast(features, velocity, remainingWork);

  return {
    velocity,
    remainingWork,
    estimatedCompletion: forecast.completionDate,
    confidence: forecast.confidence,
  };
}

/**
 * Calculate sprint health metrics
 */
export async function calculateSprintHealth(
  sprint: Sprint,
  features: RoadmapFeature[]
): Promise<{
  name: string;
  capacity: number;
  committed: number;
  completed: number;
  utilization: number; // percentage
  health: 'healthy' | 'at-risk' | 'over-capacity';
}> {
  const velocityCalc = new VelocityCalculator();
  
  const sprintFeatures = features.filter(f => f.sprint === sprint.name);
  const committed = sprintFeatures.reduce(
    (sum, f) => sum + velocityCalc.storyPoints(f.complexity),
    0
  );

  const completedFeatures = sprintFeatures.filter(f => f.status === 'completed');
  const completed = completedFeatures.reduce(
    (sum, f) => sum + velocityCalc.storyPoints(f.complexity),
    0
  );

  const utilization = sprint.capacity > 0 ? (committed / sprint.capacity) * 100 : 0;

  let health: 'healthy' | 'at-risk' | 'over-capacity';
  if (utilization > 100) health = 'over-capacity';
  else if (utilization > 85) health = 'at-risk';
  else health = 'healthy';

  return {
    name: sprint.name,
    capacity: sprint.capacity,
    committed,
    completed,
    utilization,
    health,
  };
}
