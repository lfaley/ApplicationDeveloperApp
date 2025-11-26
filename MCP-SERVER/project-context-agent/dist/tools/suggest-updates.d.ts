/**
 * MCP Tool: suggest_updates
 * ------------------------
 * Generates actionable recommendations for fixing drift.
 */
import { DriftItem, SyncRecommendation } from '../types';
export declare function suggestUpdatesTool(driftItems: DriftItem[]): {
    recommendations: SyncRecommendation[];
    estimatedEffort: string;
    priority: 'high' | 'medium' | 'low';
};
//# sourceMappingURL=suggest-updates.d.ts.map