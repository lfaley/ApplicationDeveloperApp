"use strict";
/**
 * Feature schema - represents a new capability or enhancement
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFeature = validateFeature;
exports.generateFeatureId = generateFeatureId;
/**
 * Validate feature data
 */
function validateFeature(feature) {
    const errors = [];
    if (!feature.id || !feature.id.startsWith('FEA-')) {
        errors.push('Invalid feature ID format. Must start with FEA-');
    }
    if (!feature.title || feature.title.length === 0) {
        errors.push('Feature title is required');
    }
    if (!feature.description || feature.description.length === 0) {
        errors.push('Feature description is required');
    }
    if (!['draft', 'active', 'on-hold', 'completed', 'cancelled'].includes(feature.status)) {
        errors.push('Invalid feature status');
    }
    if (!['planning', 'design', 'implementation', 'testing', 'review', 'documentation', 'deployment', 'complete'].includes(feature.currentPhase)) {
        errors.push('Invalid feature phase');
    }
    return errors;
}
/**
 * Generate next feature ID
 */
function generateFeatureId(existingIds) {
    const numbers = existingIds
        .map(id => parseInt(id.replace('FEA-', ''), 10))
        .filter(n => !isNaN(n));
    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNumber = maxNumber + 1;
    return `FEA-${String(nextNumber).padStart(3, '0')}`;
}
//# sourceMappingURL=Feature.js.map