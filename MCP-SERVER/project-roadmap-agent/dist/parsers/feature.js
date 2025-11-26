"use strict";
/**
 * Feature Parser - Extracts feature details from markdown
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureParser = void 0;
class FeatureParser {
    /**
     * Parse feature markdown into structured data
     */
    parseFeature(markdown) {
        const lines = markdown.split('\n');
        const titleLine = lines.find(l => l.startsWith('###'));
        if (!titleLine)
            return null;
        const title = titleLine.replace(/^###\s+/, '').trim();
        const body = markdown.substring(markdown.indexOf(titleLine) + titleLine.length);
        return this.extractFeatureData(title, body);
    }
    /**
     * Extract feature data from title and body
     */
    extractFeatureData(title, body) {
        const id = this.extractField(body, 'ID');
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
            sprint: this.extractField(body, 'Sprint'),
            assignee: this.extractField(body, 'Assignee'),
            startDate: this.extractField(body, 'Start Date'),
            targetDate: this.extractField(body, 'Target Date'),
            completedDate: this.extractField(body, 'Completed Date'),
            dependencies: this.extractList(body, 'Dependencies'),
            blockers: this.extractList(body, 'Blockers'),
        };
    }
    /**
     * Extract field value by name
     */
    extractField(body, fieldName) {
        const regex = new RegExp(`\\*\\*${fieldName}[:\\s]+([^\\*\\n]+)`, 'i');
        const match = body.match(regex);
        return match ? match[1].trim() : undefined;
    }
    /**
     * Extract comma-separated list
     */
    extractList(body, fieldName) {
        const value = this.extractField(body, fieldName);
        if (!value)
            return undefined;
        const items = value.split(',').map(item => item.trim()).filter(Boolean);
        return items.length > 0 ? items : undefined;
    }
    /**
     * Clean title (remove ID marker)
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
     * Extract status
     */
    extractStatus(body) {
        const status = this.extractField(body, 'Status')?.toLowerCase();
        const validStatuses = [
            'draft', 'planned', 'in-progress', 'review', 'completed', 'blocked', 'cancelled'
        ];
        return validStatuses.find(s => s === status) || 'draft';
    }
    /**
     * Extract progress percentage
     */
    extractProgress(body) {
        const progress = this.extractField(body, 'Progress');
        if (!progress)
            return 0;
        const match = progress.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    }
    /**
     * Extract priority
     */
    extractPriority(body) {
        const priority = this.extractField(body, 'Priority')?.toLowerCase();
        if (priority?.includes('critical'))
            return 'critical';
        if (priority?.includes('high'))
            return 'high';
        if (priority?.includes('low'))
            return 'low';
        return 'medium';
    }
    /**
     * Extract complexity
     */
    extractComplexity(body) {
        const complexity = this.extractField(body, 'Complexity')?.toLowerCase();
        if (complexity?.includes('xl') || complexity?.includes('extra large'))
            return 'xl';
        if (complexity?.includes('large') || complexity === 'l')
            return 'l';
        if (complexity?.includes('small') || complexity === 's')
            return 's';
        if (complexity?.includes('xs') || complexity?.includes('extra small'))
            return 'xs';
        return 'm';
    }
}
exports.FeatureParser = FeatureParser;
