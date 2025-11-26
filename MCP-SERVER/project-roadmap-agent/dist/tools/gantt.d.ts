/**
 * Generate Gantt Chart Tool - Create Mermaid Gantt diagrams
 */
import { RoadmapFeature, GanttChart } from '../types';
export declare function generateGantt(features: RoadmapFeature[]): Promise<GanttChart>;
/**
 * Generate Gantt by sprint
 */
export declare function generateGanttBySprint(features: RoadmapFeature[], sprints: string[]): Promise<GanttChart>;
