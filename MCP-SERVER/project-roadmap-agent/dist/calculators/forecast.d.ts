/**
 * Forecast Calculator - Project completion forecasting
 */
import { RoadmapFeature, Forecast, VelocityMetrics } from '../types';
export declare class ForecastCalculator {
    /**
     * Generate project completion forecast
     */
    generateForecast(features: RoadmapFeature[], velocity: VelocityMetrics, remainingWork: number): Forecast;
    /**
     * Estimate completion date from sprints remaining
     */
    private estimateDate;
    /**
     * Assess forecast confidence
     */
    private assessConfidence;
    /**
     * Monte Carlo simulation for forecast range
     */
    monteCarloForecast(remainingWork: number, velocityHistory: number[], simulations?: number): {
        optimistic: string;
        likely: string;
        pessimistic: string;
    };
    /**
     * Sample velocity from history with randomness
     */
    private sampleVelocity;
}
