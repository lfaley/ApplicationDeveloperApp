"use strict";
/**
 * Calculate Velocity Tool - Team velocity and metrics
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateVelocity = calculateVelocity;
exports.generateBurndown = generateBurndown;
exports.calculateTeamMetrics = calculateTeamMetrics;
exports.calculateSprintHealth = calculateSprintHealth;
const calculators_1 = require("../calculators");
async function calculateVelocity(sprints, features) {
    const velocityCalc = new calculators_1.VelocityCalculator();
    // Update sprint completed points
    for (const sprint of sprints) {
        sprint.completed = velocityCalc.calculateRemainingWork(features.filter(f => f.sprint === sprint.name && f.status === 'completed'));
    }
    return velocityCalc.calculateVelocity(sprints);
}
/**
 * Generate burndown chart for specific sprint
 */
async function generateBurndown(sprint, features) {
    const burndownCalc = new calculators_1.BurndownCalculator();
    return burndownCalc.generateBurndown(sprint, features);
}
/**
 * Calculate team metrics summary
 */
async function calculateTeamMetrics(sprints, features) {
    const velocityCalc = new calculators_1.VelocityCalculator();
    const forecastCalc = new calculators_1.ForecastCalculator();
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
async function calculateSprintHealth(sprint, features) {
    const velocityCalc = new calculators_1.VelocityCalculator();
    const sprintFeatures = features.filter(f => f.sprint === sprint.name);
    const committed = sprintFeatures.reduce((sum, f) => sum + velocityCalc.storyPoints(f.complexity), 0);
    const completedFeatures = sprintFeatures.filter(f => f.status === 'completed');
    const completed = completedFeatures.reduce((sum, f) => sum + velocityCalc.storyPoints(f.complexity), 0);
    const utilization = sprint.capacity > 0 ? (committed / sprint.capacity) * 100 : 0;
    let health;
    if (utilization > 100)
        health = 'over-capacity';
    else if (utilization > 85)
        health = 'at-risk';
    else
        health = 'healthy';
    return {
        name: sprint.name,
        capacity: sprint.capacity,
        committed,
        completed,
        utilization,
        health,
    };
}
