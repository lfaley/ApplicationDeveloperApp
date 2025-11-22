/**
 * Burndown Calculator - Sprint burndown chart data
 */

import { Sprint, RoadmapFeature, BurndownData } from '../types';
import { VelocityCalculator } from './velocity';

export class BurndownCalculator {
  private velocityCalc = new VelocityCalculator();

  /**
   * Generate burndown chart data for a sprint
   */
  generateBurndown(sprint: Sprint, features: RoadmapFeature[]): BurndownData {
    const sprintFeatures = features.filter(f => f.sprint === sprint.name);
    const totalWork = sprintFeatures.reduce(
      (sum, f) => sum + this.velocityCalc.storyPoints(f.complexity),
      0
    );

    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const days = this.getDaysBetween(startDate, endDate);

    const burndownDays = [];
    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const ideal = totalWork - (totalWork * i / days);
      const actual = this.calculateActualRemaining(date, sprintFeatures);

      burndownDays.push({
        date: date.toISOString().split('T')[0],
        ideal: Math.max(0, ideal),
        actual: Math.max(0, actual),
      });
    }

    const completedWork = totalWork - burndownDays[burndownDays.length - 1].actual;

    return {
      sprintName: sprint.name,
      days: burndownDays,
      totalWork,
      completedWork,
    };
  }

  /**
   * Calculate actual remaining work at a specific date
   */
  private calculateActualRemaining(date: Date, features: RoadmapFeature[]): number {
    let remaining = 0;

    for (const feature of features) {
      const points = this.velocityCalc.storyPoints(feature.complexity);
      
      if (feature.status === 'completed' && feature.completedDate) {
        const completedDate = new Date(feature.completedDate);
        if (completedDate > date) {
          remaining += points;
        }
      } else if (feature.status !== 'completed') {
        remaining += points * (1 - feature.progress / 100);
      }
    }

    return remaining;
  }

  /**
   * Calculate days between two dates
   */
  private getDaysBetween(start: Date, end: Date): number {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Calculate sprint velocity (completed story points)
   */
  calculateSprintVelocity(sprint: Sprint, features: RoadmapFeature[]): number {
    const sprintFeatures = features.filter(
      f => f.sprint === sprint.name && f.status === 'completed'
    );

    return sprintFeatures.reduce(
      (sum, f) => sum + this.velocityCalc.storyPoints(f.complexity),
      0
    );
  }
}
