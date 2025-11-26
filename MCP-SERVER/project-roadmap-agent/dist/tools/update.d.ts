/**
 * Update Roadmap Tool - Update feature progress and status
 */
import { RoadmapUpdate } from '../types';
export declare function updateRoadmap(roadmapContent: string, updates: RoadmapUpdate[]): Promise<string>;
/**
 * Bulk update features by status
 */
export declare function bulkUpdateByStatus(roadmapContent: string, fromStatus: string, toStatus: string): Promise<string>;
/**
 * Update sprint assignment
 */
export declare function updateSprintAssignment(roadmapContent: string, featureId: string, sprintName: string): Promise<string>;
