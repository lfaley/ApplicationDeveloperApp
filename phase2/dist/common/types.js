"use strict";
/**
 * Common types used throughout ProjectPlanner Phase 2
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = success;
exports.failure = failure;
exports.isSuccess = isSuccess;
exports.isFailure = isFailure;
/**
 * Helper function to create successful result
 */
function success(data) {
    return { success: true, data };
}
/**
 * Helper function to create error result
 */
function failure(error) {
    return { success: false, error };
}
/**
 * Type guard to check if result is successful
 */
function isSuccess(result) {
    return result.success === true;
}
/**
 * Type guard to check if result is failure
 */
function isFailure(result) {
    return result.success === false;
}
//# sourceMappingURL=types.js.map