"use strict";
/**
 * Bug schema - represents a defect or issue
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBug = validateBug;
exports.generateBugId = generateBugId;
/**
 * Validate bug data
 */
function validateBug(bug) {
    const errors = [];
    if (!bug.id || !bug.id.match(/^BUG-\d{3,}$/)) {
        errors.push('Invalid bug ID format. Expected: BUG-XXX');
    }
    if (!bug.title || bug.title.trim().length === 0) {
        errors.push('Bug title is required');
    }
    if (!bug.description || bug.description.trim().length === 0) {
        errors.push('Bug description is required');
    }
    if (!bug.createdAt) {
        errors.push('createdAt timestamp is required');
    }
    if (!bug.createdBy) {
        errors.push('createdBy is required');
    }
    if (!bug.environment || !bug.environment.os) {
        errors.push('Environment information is required');
    }
    if (!['open', 'in-progress', 'fixed', 'verified', 'closed', 'wont-fix', 'duplicate'].includes(bug.status)) {
        errors.push('Invalid bug status');
    }
    if (!['triage', 'analysis', 'fix-implementation', 'testing', 'verification', 'complete'].includes(bug.currentPhase)) {
        errors.push('Invalid bug phase');
    }
    return errors;
}
/**
 * Generate next bug ID
 */
function generateBugId(existingIds) {
    const numbers = existingIds
        .map(id => parseInt(id.replace('BUG-', ''), 10))
        .filter(n => !isNaN(n));
    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNumber = maxNumber + 1;
    return `BUG-${String(nextNumber).padStart(3, '0')}`;
}
//# sourceMappingURL=Bug.js.map