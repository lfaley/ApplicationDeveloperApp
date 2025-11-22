/**
 * Type definitions for Project Roadmap Agent
 */

export interface RoadmapFeature {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  progress: number; // 0-100
  priority: 'critical' | 'high' | 'medium' | 'low';
  complexity: 'xl' | 'l' | 'm' | 's' | 'xs';
  sprint?: string;
  assignee?: string;
  startDate?: string;
  targetDate?: string;
  completedDate?: string;
  dependencies?: string[];
  blockers?: string[];
}

export type FeatureStatus = 
  | 'draft'
  | 'planned'
  | 'in-progress'
  | 'review'
  | 'completed'
  | 'blocked'
  | 'cancelled';

export interface Sprint {
  name: string;
  startDate: string;
  endDate: string;
  capacity: number; // story points
  completed: number; // story points
  features: string[]; // feature IDs
}

export interface VelocityMetrics {
  average: number; // average story points per sprint
  current: number; // current sprint velocity
  trend: 'increasing' | 'decreasing' | 'stable';
  lastSprints: number[]; // last 3-5 sprints
  forecastAccuracy: number; // 0-100%
}

export interface RoadmapAnalysis {
  totalFeatures: number;
  completedFeatures: number;
  inProgressFeatures: number;
  blockedFeatures: number;
  overallProgress: number; // 0-100
  velocity: VelocityMetrics;
  blockers: Blocker[];
  forecast: Forecast;
  risks: Risk[];
}

export interface Blocker {
  featureId: string;
  featureTitle: string;
  blockerType: 'dependency' | 'technical' | 'resource' | 'external';
  description: string;
  impact: 'high' | 'medium' | 'low';
  since: string; // ISO date
}

export interface Forecast {
  completionDate: string; // estimated
  confidence: 'high' | 'medium' | 'low';
  remainingWork: number; // story points
  sprintsRemaining: number;
  method: 'velocity-based' | 'monte-carlo' | 'expert-judgment';
}

export interface Risk {
  type: 'schedule' | 'scope' | 'quality' | 'resource';
  severity: 'high' | 'medium' | 'low';
  description: string;
  mitigation?: string;
}

export interface GanttChart {
  diagram: string; // Mermaid code
  format: 'mermaid';
  features: RoadmapFeature[];
}

export interface BurndownData {
  sprintName: string;
  days: Array<{
    date: string;
    ideal: number;
    actual: number;
  }>;
  totalWork: number;
  completedWork: number;
}

export interface RoadmapUpdate {
  featureId: string;
  updates: {
    status?: FeatureStatus;
    progress?: number;
    assignee?: string;
    completedDate?: string;
  };
}
