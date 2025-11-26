/**
 * Python Docstring Generator
 *
 * Generates Python docstrings in various styles (Google, NumPy, Sphinx)
 */
import type { FunctionInfo, ClassInfo, GenerateOptions } from '../types.js';
export type DocstringStyle = 'google' | 'numpy' | 'sphinx';
/**
 * Generate Python docstring for a function
 */
export declare function generateDocstringForFunction(funcInfo: FunctionInfo, options: GenerateOptions, style?: DocstringStyle): string;
/**
 * Generate docstring for a class
 */
export declare function generateDocstringForClass(classInfo: ClassInfo, options: GenerateOptions, style?: DocstringStyle): string;
//# sourceMappingURL=docstring.d.ts.map