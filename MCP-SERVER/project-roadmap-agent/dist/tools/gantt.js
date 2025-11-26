"use strict";
/**
 * Generate Gantt Chart Tool - Create Mermaid Gantt diagrams
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGantt = generateGantt;
exports.generateGanttBySprint = generateGanttBySprint;
async function generateGantt(features) {
    const sortedFeatures = features
        .filter(f => f.startDate || f.targetDate)
        .sort((a, b) => {
        const dateA = new Date(a.startDate || a.targetDate);
        const dateB = new Date(b.startDate || b.targetDate);
        return dateA.getTime() - dateB.getTime();
    });
    const diagram = generateMermaidCode(sortedFeatures);
    return {
        diagram,
        format: 'mermaid',
        features: sortedFeatures,
    };
}
/**
 * Generate Mermaid Gantt chart code
 */
function generateMermaidCode(features) {
    const lines = [
        'gantt',
        '    title Project Roadmap',
        '    dateFormat YYYY-MM-DD',
        '    section Features',
    ];
    for (const feature of features) {
        const title = sanitizeTitle(feature.title);
        const status = mapStatus(feature.status);
        const startDate = feature.startDate || feature.targetDate;
        const endDate = feature.targetDate || feature.completedDate || calculateEndDate(startDate, feature.complexity);
        lines.push(`    ${title} :${status}, ${feature.id}, ${startDate}, ${endDate}`);
    }
    return lines.join('\n');
}
/**
 * Sanitize feature title for Mermaid
 */
function sanitizeTitle(title) {
    return title
        .replace(/[:\[\]]/g, '')
        .substring(0, 50)
        .trim();
}
/**
 * Map feature status to Mermaid status
 */
function mapStatus(status) {
    const statusMap = {
        'completed': 'done',
        'in-progress': 'active',
        'blocked': 'crit',
        'cancelled': 'crit',
        'draft': '',
        'planned': '',
        'review': 'active',
    };
    return statusMap[status] || '';
}
/**
 * Calculate end date from start date and complexity
 */
function calculateEndDate(startDate, complexity) {
    const daysMap = {
        'xl': 42, // 6 weeks
        'l': 28, // 4 weeks
        'm': 14, // 2 weeks
        's': 7, // 1 week
        'xs': 3, // 3 days
    };
    const days = daysMap[complexity] || 14;
    const date = new Date(startDate);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}
/**
 * Generate Gantt by sprint
 */
async function generateGanttBySprint(features, sprints) {
    const lines = [
        'gantt',
        '    title Project Roadmap by Sprint',
        '    dateFormat YYYY-MM-DD',
    ];
    for (const sprint of sprints) {
        lines.push(`    section ${sprint}`);
        const sprintFeatures = features
            .filter(f => f.sprint === sprint)
            .sort((a, b) => {
            const dateA = new Date(a.startDate || a.targetDate || '2099-12-31');
            const dateB = new Date(b.startDate || b.targetDate || '2099-12-31');
            return dateA.getTime() - dateB.getTime();
        });
        for (const feature of sprintFeatures) {
            const title = sanitizeTitle(feature.title);
            const status = mapStatus(feature.status);
            const startDate = feature.startDate || feature.targetDate || new Date().toISOString().split('T')[0];
            const endDate = feature.targetDate || feature.completedDate || calculateEndDate(startDate, feature.complexity);
            lines.push(`    ${title} :${status}, ${feature.id}, ${startDate}, ${endDate}`);
        }
    }
    return {
        diagram: lines.join('\n'),
        format: 'mermaid',
        features,
    };
}
