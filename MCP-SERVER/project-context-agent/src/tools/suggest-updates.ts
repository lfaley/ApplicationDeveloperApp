/**
 * MCP Tool: suggest_updates
 * ------------------------
 * Generates actionable recommendations for fixing drift.
 */
import { DriftItem, SyncRecommendation } from '../types';

function getActionForDriftType(type: DriftItem['type']): 'update' | 'create' | 'delete' | 'verify' {
  switch (type) {
    case 'outdated': return 'update';
    case 'missing': return 'create';
    case 'orphaned': return 'delete';
    case 'inconsistent': return 'verify';
    default: return 'verify';
  }
}

function getEffortForSeverity(severity: DriftItem['severity']): 'high' | 'medium' | 'low' {
  switch (severity) {
    case 'critical':
    case 'high':
      return 'high';
    case 'medium':
      return 'medium';
    case 'low':
    default:
      return 'low';
  }
}

export function suggestUpdatesTool(driftItems: DriftItem[]): {
  recommendations: SyncRecommendation[];
  estimatedEffort: string;
  priority: 'high' | 'medium' | 'low';
} {
  const recs = driftItems.map((item, idx) => ({
    driftItemId: `${item.type}-${item.filePath}-${idx}`,
    action: getActionForDriftType(item.type),
    targetFile: item.filePath,
    suggestedContent: undefined,
    priority: item.severity === 'critical' ? 100 : item.severity === 'high' ? 75 : item.severity === 'medium' ? 50 : 25,
    estimatedEffort: getEffortForSeverity(item.severity),
    autoSyncable: item.severity !== 'critical',
  }));
  const totalEffort = recs.length * 15; // Example: 15 min per item
  return {
    recommendations: recs,
    estimatedEffort: `~${totalEffort} min`,
    priority: recs.some(r => r.priority === 100 || r.priority === 75) ? 'high' : recs.some(r => r.priority === 50) ? 'medium' : 'low',
  };
}

// End of suggest_updates tool
