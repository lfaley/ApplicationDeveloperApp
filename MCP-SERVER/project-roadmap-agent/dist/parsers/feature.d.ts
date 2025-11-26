/**
 * Feature Parser - Extracts feature details from markdown
 */
import { RoadmapFeature } from '../types';
export declare class FeatureParser {
    /**
     * Parse feature markdown into structured data
     */
    parseFeature(markdown: string): RoadmapFeature | null;
    /**
     * Extract feature data from title and body
     */
    private extractFeatureData;
    /**
     * Extract field value by name
     */
    private extractField;
    /**
     * Extract comma-separated list
     */
    private extractList;
    /**
     * Clean title (remove ID marker)
     */
    private cleanTitle;
    /**
     * Extract description text
     */
    private extractDescription;
    /**
     * Extract status
     */
    private extractStatus;
    /**
     * Extract progress percentage
     */
    private extractProgress;
    /**
     * Extract priority
     */
    private extractPriority;
    /**
     * Extract complexity
     */
    private extractComplexity;
}
