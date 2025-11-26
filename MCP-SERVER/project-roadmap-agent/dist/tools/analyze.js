"use strict";
/**
 * Analyze Roadmap Tool - Parse and analyze ROADMAP.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeRoadmap = analyzeRoadmap;
const parsers_1 = require("../parsers");
const calculators_1 = require("../calculators");
async function analyzeRoadmap(roadmapContent) {
    const parser = new parsers_1.RoadmapParser();
    const velocityCalc = new calculators_1.VelocityCalculator();
    const forecastCalc = new calculators_1.ForecastCalculator();
    // Parse roadmap
    const { features, sprints } = parser.parseRoadmap(roadmapContent);
    // Calculate metrics
    const totalFeatures = features.length;
    const completedFeatures = features.filter(f => f.status === 'completed').length;
    const inProgressFeatures = features.filter(f => f.status === 'in-progress').length;
    const blockedFeatures = features.filter(f => f.status === 'blocked').length;
    const overallProgress = totalFeatures > 0
        ? (completedFeatures / totalFeatures) * 100
        : 0;
    // Calculate velocity
    const velocity = velocityCalc.calculateVelocity(sprints);
    // Calculate remaining work
    const remainingWork = velocityCalc.calculateRemainingWork(features);
    // Generate forecast
    const forecast = forecastCalc.generateForecast(features, velocity, remainingWork);
    // Identify blockers
    const blockers = identifyBlockers(features);
    // Assess risks
    const risks = assessRisks(features, velocity, sprints);
    return {
        totalFeatures,
        completedFeatures,
        inProgressFeatures,
        blockedFeatures,
        overallProgress,
        velocity,
        blockers,
        forecast,
        risks,
    };
}
/**
 * Identify blocked features and their blockers
 */
function identifyBlockers(features) {
    const blockers = [];
    for (const feature of features) {
        if (feature.status === 'blocked' && feature.blockers) {
            for (const blocker of feature.blockers) {
                blockers.push({
                    featureId: feature.id,
                    featureTitle: feature.title,
                    blockerType: categorizeBlocker(blocker),
                    description: blocker,
                    impact: feature.priority === 'critical' ? 'high' :
                        feature.priority === 'high' ? 'medium' : 'low',
                    since: feature.startDate || new Date().toISOString().split('T')[0],
                });
            }
        }
    }
    return blockers;
}
/**
 * Categorize blocker type
 */
function categorizeBlocker(blocker) {
    const lower = blocker.toLowerCase();
    if (lower.includes('depend'))
        return 'dependency';
    if (lower.includes('resource') || lower.includes('team'))
        return 'resource';
    if (lower.includes('external') || lower.includes('vendor'))
        return 'external';
    return 'technical';
}
/**
 * Assess project risks
 */
function assessRisks(features, velocity, sprints) {
    const risks = [];
    // Schedule risk: declining velocity
    if (velocity.trend === 'decreasing') {
        risks.push({
            type: 'schedule',
            severity: 'high',
            description: 'Team velocity is declining, which may delay project completion.',
            mitigation: 'Review team capacity and remove impediments.',
        });
    }
    // Scope risk: too many in-progress features
    const inProgressCount = features.filter(f => f.status === 'in-progress').length;
    if (inProgressCount > 5) {
        risks.push({
            type: 'scope',
            severity: 'medium',
            description: `${inProgressCount} features are in progress. This may indicate scope creep.`,
            mitigation: 'Focus on completing existing features before starting new ones.',
        });
    }
    // Quality risk: low forecast accuracy
    if (velocity.forecastAccuracy < 70) {
        risks.push({
            type: 'quality',
            severity: 'medium',
            description: 'Forecast accuracy is low, indicating estimation challenges.',
            mitigation: 'Improve estimation process and refine story pointing.',
        });
    }
    // Resource risk: overcommitted sprints
    const overcommittedSprints = sprints.filter(s => s.completed > s.capacity * 1.2);
    if (overcommittedSprints.length > 0) {
        risks.push({
            type: 'resource',
            severity: 'medium',
            description: `${overcommittedSprints.length} sprints were overcommitted.`,
            mitigation: 'Adjust sprint capacity planning to match team capabilities.',
        });
    }
    return risks;
}
