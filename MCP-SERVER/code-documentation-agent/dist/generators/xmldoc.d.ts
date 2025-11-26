/**
 * C# XML Documentation Generator
 *
 * Generates C# XML documentation comments (/// style)
 */
import type { FunctionInfo, ClassInfo, InterfaceInfo, PropertyInfo, GenerateOptions } from '../types.js';
/**
 * Generate XML documentation for a function/method
 */
export declare function generateXmlDocForFunction(funcInfo: FunctionInfo, options: GenerateOptions): string;
/**
 * Generate XML documentation for a class
 */
export declare function generateXmlDocForClass(classInfo: ClassInfo, options: GenerateOptions): string;
/**
 * Generate XML documentation for an interface
 */
export declare function generateXmlDocForInterface(interfaceInfo: InterfaceInfo, options: GenerateOptions): string;
/**
 * Generate XML documentation for a property
 */
export declare function generateXmlDocForProperty(propertyInfo: PropertyInfo, options: GenerateOptions): string;
//# sourceMappingURL=xmldoc.d.ts.map