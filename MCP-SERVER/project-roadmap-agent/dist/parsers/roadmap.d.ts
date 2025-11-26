/**
 * Roadmap Parser - Extracts features and structure from ROADMAP.md
 */
import { RoadmapFeature, Sprint } from '../types';
export declare class RoadmapParser {
    /**
     * Parse ROADMAP.md content into structured data
     */
    parseRoadmap(content: string): {
        features: RoadmapFeature[];
        sprints: Sprint[];
    };
    /**
     * Extract feature definitions from markdown
     */
    private extractFeatures;
    /**
     * Parse individual feature block
     */
    private parseFeatureBlock;
    /**
     * Extract feature ID from title or body
     */
    private extractId;
    /**
     * Clean feature title (remove ID marker)
     */
    private cleanTitle;
    /**
     * Extract description text
     */
    private extractDescription;
    /**
     * Extract status value
     */
    private extractStatus;
    /**
     * Extract progress percentage
     */
    private extractProgress;
    /**
     * Extract priority level
     */
    private extractPriority;
    /**
     * Extract complexity estimate
     */
    private extractComplexity;
    /**
     * Extract sprint assignment
     */
    private extractSprint;
    /**
     * Extract assignee
     */
    private extractAssignee;
    /**
     * Extract date (start, target, or completed)
     */
    private extractDate;
    /**
     * Extract dependency IDs
     */
    private extractDependencies;
    /**
     * Extract blocker descriptions
     */
    private extractBlockers;
    /**
     * Extract sprint definitions
     */
    private extractSprints;
    /**
     * Parse sprint block
     */
    private parseSprintBlock;
}
