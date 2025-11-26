"use strict";
/**
 * Workflow schemas index
 * Exports all workflow-related schemas and types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateWorkflowStatistics = exports.validateWorkflowInstance = exports.createWorkflowInstance = exports.validateWorkflowTemplate = exports.STANDARD_BUG_WORKFLOW = exports.STANDARD_FEATURE_WORKFLOW = void 0;
var WorkflowTemplate_1 = require("./WorkflowTemplate");
Object.defineProperty(exports, "STANDARD_FEATURE_WORKFLOW", { enumerable: true, get: function () { return WorkflowTemplate_1.STANDARD_FEATURE_WORKFLOW; } });
Object.defineProperty(exports, "STANDARD_BUG_WORKFLOW", { enumerable: true, get: function () { return WorkflowTemplate_1.STANDARD_BUG_WORKFLOW; } });
Object.defineProperty(exports, "validateWorkflowTemplate", { enumerable: true, get: function () { return WorkflowTemplate_1.validateWorkflowTemplate; } });
var WorkflowInstance_1 = require("./WorkflowInstance");
Object.defineProperty(exports, "createWorkflowInstance", { enumerable: true, get: function () { return WorkflowInstance_1.createWorkflowInstance; } });
Object.defineProperty(exports, "validateWorkflowInstance", { enumerable: true, get: function () { return WorkflowInstance_1.validateWorkflowInstance; } });
Object.defineProperty(exports, "calculateWorkflowStatistics", { enumerable: true, get: function () { return WorkflowInstance_1.calculateWorkflowStatistics; } });
//# sourceMappingURL=index.js.map