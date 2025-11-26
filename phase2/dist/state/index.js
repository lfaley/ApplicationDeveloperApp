"use strict";
/**
 * State Management System
 * Main entry point for state management functionality
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemStorage = exports.generateBugId = exports.validateBug = exports.generateFeatureId = exports.validateFeature = void 0;
const tslib_1 = require("tslib");
var Feature_1 = require("./schemas/Feature");
Object.defineProperty(exports, "validateFeature", { enumerable: true, get: function () { return Feature_1.validateFeature; } });
Object.defineProperty(exports, "generateFeatureId", { enumerable: true, get: function () { return Feature_1.generateFeatureId; } });
var Bug_1 = require("./schemas/Bug");
Object.defineProperty(exports, "validateBug", { enumerable: true, get: function () { return Bug_1.validateBug; } });
Object.defineProperty(exports, "generateBugId", { enumerable: true, get: function () { return Bug_1.generateBugId; } });
// Storage
var FileSystemStorage_1 = require("./storage/FileSystemStorage");
Object.defineProperty(exports, "FileSystemStorage", { enumerable: true, get: function () { return FileSystemStorage_1.FileSystemStorage; } });
// Repositories
tslib_1.__exportStar(require("./repositories"), exports);
// Indexes
tslib_1.__exportStar(require("./indexes"), exports);
// Transactions
tslib_1.__exportStar(require("./transactions"), exports);
//# sourceMappingURL=index.js.map