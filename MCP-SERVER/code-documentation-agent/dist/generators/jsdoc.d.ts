/**
 * JSDoc/TSDoc Generator
 *
 * Generates JavaScript/TypeScript documentation in JSDoc or TSDoc format
 */
import type { FunctionInfo, ClassInfo, InterfaceInfo, GenerateOptions } from '../types.js';
/**
 * Generate JSDoc comment for a function
 */
export declare function generateJSDocForFunction(func: FunctionInfo, options: GenerateOptions): string;
/**
 * Generate JSDoc comment for a class
 */
export declare function generateJSDocForClass(cls: ClassInfo, options: GenerateOptions): string;
/**
 * Generate JSDoc comment for an interface
 */
export declare function generateJSDocForInterface(iface: InterfaceInfo, options: GenerateOptions): string;
//# sourceMappingURL=jsdoc.d.ts.map