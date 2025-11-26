"use strict";
/**
 * Roadmap Parser - Extracts features and structure from ROADMAP.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadmapParser = void 0;
class RoadmapParser {
    /**
     * Parse ROADMAP.md content into structured data
     */
    parseRoadmap(content) {
        const features = this.extractFeatures(content);
        const sprints = this.extractSprints(content);
        return { features, sprints };
    }
    /**
     * Extract feature definitions from markdown
     */
    extractFeatures(content) {
        const features = [];
        const featureRegex = /###\s+(.+?)\n([\s\S]*?)(?=###|$)/g;
        let match;
        while ((match = featureRegex.exec(content)) !== null) {
            const title = match[1].trim();
            const body = match[2];
            const feature = this.parseFeatureBlock(title, body);
            if (feature) {
                features.push(feature);
            }
        }
        return features;
    }
    /**
     * Parse individual feature block
     */
    parseFeatureBlock(title, body) {
        const id = this.extractId(title, body);
        if (!id)
            return null;
        return {
            id,
            title: this.cleanTitle(title),
            description: this.extractDescription(body),
            status: this.extractStatus(body),
            progress: this.extractProgress(body),
            priority: this.extractPriority(body),
            complexity: this.extractComplexity(body),
            sprint: this.extractSprint(body),
            assignee: this.extractAssignee(body),
            startDate: this.extractDate(body, 'start'),
            targetDate: this.extractDate(body, 'target'),
            completedDate: this.extractDate(body, 'completed'),
            dependencies: this.extractDependencies(body),
            blockers: this.extractBlockers(body),
        };
    }
    /**
     * Extract feature ID from title or body
     */
    extractId(title, body) {
        // Try title first: "Feature Name [#123]"
        const titleMatch = title.match(/\[#([^\]]+)\]/);
        if (titleMatch)
            return titleMatch[1];
        // Try body: "ID: 123" or "id: 123"
        const bodyMatch = body.match(/\*\*ID[:\s]+([^\s\*]+)/i);
        if (bodyMatch)
            return bodyMatch[1];
        return undefined;
    }
    /**
     * Clean feature title (remove ID marker)
     */
    cleanTitle(title) {
        return title.replace(/\[#[^\]]+\]/, '').trim();
    }
    /**
     * Extract description text
     */
    extractDescription(body) {
        const lines = body.split('\n');
        const descLines = [];
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed)
                continue;
            if (trimmed.startsWith('**') || trimmed.startsWith('-'))
                break;
            descLines.push(trimmed);
        }
        return descLines.join(' ');
    }
    /**
     * Extract status value
     */
    extractStatus(body) {
        const match = body.match(/\*\*Status[:\s]+([^\*\n]+)/i);
        if (!match)
            return 'draft';
        const status = match[1].trim().toLowerCase();
        const validStatuses = [
            'draft', 'planned', 'in-progress', 'review', 'completed', 'blocked', 'cancelled'
        ];
        return validStatuses.find(s => s === status) || 'draft';
    }
    /**
     * Extract progress percentage
     */
    extractProgress(body) {
        const match = body.match(/\*\*Progress[:\s]+(\d+)%/i);
        return match ? parseInt(match[1], 10) : 0;
    }
    /**
     * Extract priority level
     */
    extractPriority(body) {
        const match = body.match(/\*\*Priority[:\s]+([^\*\n]+)/i);
        if (!match)
            return 'medium';
        const priority = match[1].trim().toLowerCase();
        if (priority.includes('critical'))
            return 'critical';
        if (priority.includes('high'))
            return 'high';
        if (priority.includes('low'))
            return 'low';
        return 'medium';
    }
    /**
     * Extract complexity estimate
     */
    extractComplexity(body) {
        const match = body.match(/\*\*Complexity[:\s]+([^\*\n]+)/i);
        if (!match)
            return 'm';
        const complexity = match[1].trim().toLowerCase();
        if (complexity.includes('xl') || complexity.includes('extra large'))
            return 'xl';
        if (complexity.includes('large') || complexity === 'l')
            return 'l';
        if (complexity.includes('small') || complexity === 's')
            return 's';
        if (complexity.includes('xs') || complexity.includes('extra small'))
            return 'xs';
        return 'm';
    }
    /**
     * Extract sprint assignment
     */
    extractSprint(body) {
        const match = body.match(/\*\*Sprint[:\s]+([^\*\n]+)/i);
        return match ? match[1].trim() : undefined;
    }
    /**
     * Extract assignee
     */
    extractAssignee(body) {
        const match = body.match(/\*\*Assignee[:\s]+([^\*\n]+)/i);
        return match ? match[1].trim() : undefined;
    }
    /**
     * Extract date (start, target, or completed)
     */
    extractDate(body, type) {
        const patterns = {
            start: /\*\*Start Date[:\s]+([^\*\n]+)/i,
            target: /\*\*Target Date[:\s]+([^\*\n]+)/i,
            completed: /\*\*Completed Date[:\s]+([^\*\n]+)/i,
        };
        const match = body.match(patterns[type]);
        return match ? match[1].trim() : undefined;
    }
    /**
     * Extract dependency IDs
     */
    extractDependencies(body) {
        const match = body.match(/\*\*Dependencies[:\s]+([^\*\n]+)/i);
        if (!match)
            return undefined;
        const deps = match[1].split(',').map(d => d.trim()).filter(Boolean);
        return deps.length > 0 ? deps : undefined;
    }
    /**
     * Extract blocker descriptions
     */
    extractBlockers(body) {
        const match = body.match(/\*\*Blockers[:\s]+([^\*\n]+)/i);
        if (!match)
            return undefined;
        const blockers = match[1].split(',').map(b => b.trim()).filter(Boolean);
        return blockers.length > 0 ? blockers : undefined;
    }
    /**
     * Extract sprint definitions
     */
    extractSprints(content) {
        const sprints = [];
        const sprintRegex = /##\s+Sprint\s+(.+?)\n([\s\S]*?)(?=##|$)/gi;
        let match;
        while ((match = sprintRegex.exec(content)) !== null) {
            const name = match[1].trim();
            const body = match[2];
            const sprint = this.parseSprintBlock(name, body);
            if (sprint) {
                sprints.push(sprint);
            }
        }
        return sprints;
    }
    /**
     * Parse sprint block
     */
    parseSprintBlock(name, body) {
        const startMatch = body.match(/\*\*Start[:\s]+([^\*\n]+)/i);
        const endMatch = body.match(/\*\*End[:\s]+([^\*\n]+)/i);
        const capacityMatch = body.match(/\*\*Capacity[:\s]+(\d+)/i);
        if (!startMatch || !endMatch)
            return null;
        return {
            name,
            startDate: startMatch[1].trim(),
            endDate: endMatch[1].trim(),
            capacity: capacityMatch ? parseInt(capacityMatch[1], 10) : 0,
            completed: 0, // Calculated later
            features: [], // Populated later
        };
    }
}
exports.RoadmapParser = RoadmapParser;
