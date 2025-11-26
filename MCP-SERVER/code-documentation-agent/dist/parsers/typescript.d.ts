/**
 * TypeScript/JavaScript Parser
 *
 * Enhanced AST-based parser with full support for:
 * - Functions, arrow functions, methods
 * - Classes with properties and decorators
 * - Interfaces with properties and methods
 * - Type annotations and generics
 * - Existing documentation detection
 */
import type { AnalysisResult } from '../types.js';
/**
 * Parse TypeScript/JavaScript code and extract all structural elements
 */
export declare function parseTypeScript(code: string, filePath?: string): AnalysisResult;
//# sourceMappingURL=typescript.d.ts.map