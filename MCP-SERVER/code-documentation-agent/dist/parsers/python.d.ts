/**
 * Python Parser
 *
 * Parses Python code to extract functions, classes, and documentation
 * Uses regex-based parsing since we don't have a Python AST parser in Node.js
 */
import type { AnalysisResult } from '../types.js';
/**
 * Parse Python code and extract documentation information
 */
export declare function parsePython(code: string, filePath?: string): Promise<AnalysisResult>;
//# sourceMappingURL=python.d.ts.map