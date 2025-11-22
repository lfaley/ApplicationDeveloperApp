/**
 * Feature Parser - Extracts feature details from markdown
 */

import { RoadmapFeature } from '../types';

export class FeatureParser {
  /**
   * Parse feature markdown into structured data
   */
  parseFeature(markdown: string): RoadmapFeature | null {
    const lines = markdown.split('\n');
    const titleLine = lines.find(l => l.startsWith('###'));
    
    if (!titleLine) return null;

    const title = titleLine.replace(/^###\s+/, '').trim();
    const body = markdown.substring(markdown.indexOf(titleLine) + titleLine.length);

    return this.extractFeatureData(title, body);
  }

  /**
   * Extract feature data from title and body
   */
  private extractFeatureData(title: string, body: string): RoadmapFeature | null {
    const id = this.extractField(body, 'ID');
    if (!id) return null;

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
  private extractField(body: string, fieldName: string): string | undefined {
    const regex = new RegExp(`\\*\\*${fieldName}[:\\s]+([^\\*\\n]+)`, 'i');
    const match = body.match(regex);
    return match ? match[1].trim() : undefined;
  }

  /**
   * Extract comma-separated list
   */
  private extractList(body: string, fieldName: string): string[] | undefined {
    const value = this.extractField(body, fieldName);
    if (!value) return undefined;

    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    return items.length > 0 ? items : undefined;
  }

  /**
   * Clean title (remove ID marker)
   */
  private cleanTitle(title: string): string {
    return title.replace(/\[#[^\]]+\]/, '').trim();
  }

  /**
   * Extract description text
   */
  private extractDescription(body: string): string {
    const lines = body.split('\n');
    const descLines: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('**') || trimmed.startsWith('-')) break;
      descLines.push(trimmed);
    }

    return descLines.join(' ');
  }

  /**
   * Extract status
   */
  private extractStatus(body: string): RoadmapFeature['status'] {
    const status = this.extractField(body, 'Status')?.toLowerCase();
    
    const validStatuses: RoadmapFeature['status'][] = [
      'draft', 'planned', 'in-progress', 'review', 'completed', 'blocked', 'cancelled'
    ];

    return validStatuses.find(s => s === status) || 'draft';
  }

  /**
   * Extract progress percentage
   */
  private extractProgress(body: string): number {
    const progress = this.extractField(body, 'Progress');
    if (!progress) return 0;

    const match = progress.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Extract priority
   */
  private extractPriority(body: string): 'critical' | 'high' | 'medium' | 'low' {
    const priority = this.extractField(body, 'Priority')?.toLowerCase();
    
    if (priority?.includes('critical')) return 'critical';
    if (priority?.includes('high')) return 'high';
    if (priority?.includes('low')) return 'low';
    return 'medium';
  }

  /**
   * Extract complexity
   */
  private extractComplexity(body: string): 'xl' | 'l' | 'm' | 's' | 'xs' {
    const complexity = this.extractField(body, 'Complexity')?.toLowerCase();
    
    if (complexity?.includes('xl') || complexity?.includes('extra large')) return 'xl';
    if (complexity?.includes('large') || complexity === 'l') return 'l';
    if (complexity?.includes('small') || complexity === 's') return 's';
    if (complexity?.includes('xs') || complexity?.includes('extra small')) return 'xs';
    return 'm';
  }
}
