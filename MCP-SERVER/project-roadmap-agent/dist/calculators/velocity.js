"use strict";
/**
 * Velocity Calculator - Team velocity metrics and forecasting
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VelocityCalculator = void 0;
class VelocityCalculator {
    /**
     * Calculate team velocity metrics from sprint history
     */
    calculateVelocity(sprints) {
        const completedSprints = sprints.filter(s => this.isSprintCompleted(s));
        const recentSprints = completedSprints.slice(-5); // Last 5 sprints
        const velocities = recentSprints.map(s => s.completed);
        const average = velocities.length > 0
            ? velocities.reduce((sum, v) => sum + v, 0) / velocities.length
            : 0;
        const current = completedSprints.length > 0
            ? completedSprints[completedSprints.length - 1].completed
            : 0;
        const trend = this.calculateTrend(velocities);
        const forecastAccuracy = this.calculateForecastAccuracy(recentSprints);
        return {
            average,
            current,
            trend,
            lastSprints: velocities,
            forecastAccuracy,
        };
    }
    /**
     * Check if sprint is completed
     */
    isSprintCompleted(sprint) {
        const endDate = new Date(sprint.endDate);
        return endDate < new Date();
    }
    /**
     * Calculate velocity trend
     */
    calculateTrend(velocities) {
        if (velocities.length < 2)
            return 'stable';
        const recent = velocities.slice(-3);
        const older = velocities.slice(0, -3);
        if (older.length === 0)
            return 'stable';
        const recentAvg = recent.reduce((sum, v) => sum + v, 0) / recent.length;
        const olderAvg = older.reduce((sum, v) => sum + v, 0) / older.length;
        const diff = recentAvg - olderAvg;
        const threshold = olderAvg * 0.1; // 10% threshold
        if (diff > threshold)
            return 'increasing';
        if (diff < -threshold)
            return 'decreasing';
        return 'stable';
    }
    /**
     * Calculate forecast accuracy
     */
    calculateForecastAccuracy(sprints) {
        if (sprints.length === 0)
            return 0;
        const accuracies = sprints.map(sprint => {
            if (sprint.capacity === 0)
                return 0;
            return Math.min(100, (sprint.completed / sprint.capacity) * 100);
        });
        return accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
    }
    /**
     * Calculate story points from complexity
     */
    storyPoints(complexity) {
        const points = {
            'xl': 13,
            'l': 8,
            'm': 5,
            's': 3,
            'xs': 1,
        };
        return points[complexity] || 5;
    }
    /**
     * Calculate remaining work in story points
     */
    calculateRemainingWork(features) {
        return features
            .filter(f => f.status !== 'completed' && f.status !== 'cancelled')
            .reduce((sum, f) => sum + this.storyPoints(f.complexity), 0);
    }
    /**
     * Estimate sprints remaining
     */
    estimateSprintsRemaining(remainingWork, velocity) {
        if (velocity === 0)
            return Infinity;
        return Math.ceil(remainingWork / velocity);
    }
    /**
     * Estimate completion date
     */
    estimateCompletionDate(remainingWork, velocity, sprintLength = 14 // days
    ) {
        const sprints = this.estimateSprintsRemaining(remainingWork, velocity);
        const days = sprints * sprintLength;
        const completionDate = new Date();
        completionDate.setDate(completionDate.getDate() + days);
        return completionDate.toISOString().split('T')[0];
    }
}
exports.VelocityCalculator = VelocityCalculator;
