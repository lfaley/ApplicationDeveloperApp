/**
 * Shared TypeScript types for Code Documentation Agent
 */
/**
 * Supported programming languages
 */
export type Language = 'typescript' | 'javascript' | 'python' | 'csharp' | 'powershell';
/**
 * Documentation styles per language
 */
export type DocumentationStyle = 'jsdoc' | 'tsdoc' | 'google' | 'numpy' | 'sphinx' | 'xmldoc' | 'help';
/**
 * Parameter information extracted from code
 */
export interface Parameter {
    name: string;
    type: string | null;
    optional: boolean;
    defaultValue?: string;
    description?: string;
}
/**
 * Function/method metadata
 */
export interface FunctionInfo {
    name: string;
    params: Parameter[];
    returnType: string | null;
    startLine: number;
    endLine: number;
    complexity: number;
    isAsync: boolean;
    isExported: boolean;
    hasDocumentation: boolean;
    existingDocs?: string;
    throws?: string[];
}
/**
 * Class metadata
 */
export interface ClassInfo {
    name: string;
    methods: FunctionInfo[];
    properties: PropertyInfo[];
    isExported: boolean;
    startLine: number;
    endLine: number;
    hasDocumentation: boolean;
    existingDocs?: string;
}
/**
 * Property/field information
 */
export interface PropertyInfo {
    name: string;
    type: string | null;
    isReadonly: boolean;
    isStatic: boolean;
    visibility: 'public' | 'private' | 'protected';
    hasDocumentation: boolean;
}
/**
 * Interface metadata
 */
export interface InterfaceInfo {
    name: string;
    properties: PropertyInfo[];
    methods: FunctionInfo[];
    isExported: boolean;
    startLine: number;
    endLine: number;
}
/**
 * Code analysis result
 */
export interface AnalysisResult {
    functions: FunctionInfo[];
    classes: ClassInfo[];
    interfaces: InterfaceInfo[];
    language: Language;
    filePath: string;
    totalLines: number;
    documentedItems: number;
    undocumentedItems: number;
    coveragePercent: number;
}
/**
 * Generated documentation
 */
export interface GeneratedDocs {
    documentation: string;
    style: DocumentationStyle;
    includes: {
        description: boolean;
        params: boolean;
        returns: boolean;
        throws: boolean;
        examples: boolean;
    };
}
/**
 * Validation error/warning
 */
export interface ValidationIssue {
    line: number;
    column?: number;
    elementName: string;
    elementType: 'function' | 'class' | 'interface' | 'parameter';
    issue: string;
    severity: 'error' | 'warning' | 'info';
    fixable: boolean;
}
/**
 * Validation result
 */
export interface ValidationResult {
    isValid: boolean;
    errors: ValidationIssue[];
    warnings: ValidationIssue[];
    info: ValidationIssue[];
    coverage: number;
    totalItems: number;
    documentedItems: number;
    missingDocs: string[];
}
/**
 * Validation rules configuration
 */
export interface ValidationRules {
    requireParamDocs: boolean;
    requireReturnDocs: boolean;
    requireThrowsDocs: boolean;
    requireExamples: boolean;
    requireDescriptions: boolean;
    maxComplexityWithoutDocs: number;
    enforceStyle: DocumentationStyle | null;
}
/**
 * File update instruction
 */
export interface DocumentationUpdate {
    elementName: string;
    elementType: 'function' | 'class' | 'interface';
    documentation: string;
    line: number;
    action: 'add' | 'replace' | 'remove';
}
/**
 * Batch processing options
 */
export interface BatchOptions {
    files: string[];
    language: Language;
    style: DocumentationStyle;
    mode: 'add-missing' | 'update-all' | 'validate-only';
    parallel: boolean;
    maxConcurrency: number;
}
/**
 * Batch processing result
 */
export interface BatchResult {
    totalFiles: number;
    processedFiles: number;
    failedFiles: string[];
    totalUpdates: number;
    errors: Array<{
        file: string;
        error: string;
    }>;
    duration: number;
}
/**
 * Parser interface
 */
export interface CodeParser {
    parse(code: string, filePath: string): Promise<AnalysisResult>;
    extractFunctions(code: string): Promise<FunctionInfo[]>;
    extractClasses(code: string): Promise<ClassInfo[]>;
    extractInterfaces(code: string): Promise<InterfaceInfo[]>;
}
/**
 * Documentation generator interface
 */
export interface DocumentationGenerator {
    generate(element: FunctionInfo | ClassInfo | InterfaceInfo, options: GenerateOptions): GeneratedDocs;
    generateForFunction(func: FunctionInfo, options: GenerateOptions): string;
    generateForClass(cls: ClassInfo, options: GenerateOptions): string;
    generateForInterface(iface: InterfaceInfo, options: GenerateOptions): string;
}
/**
 * Generation options
 */
export interface GenerateOptions {
    includeDescription: boolean;
    includeParams: boolean;
    includeReturns: boolean;
    includeThrows: boolean;
    includeExamples: boolean;
    inferDescriptions: boolean;
    descriptionTemplate?: string;
}
//# sourceMappingURL=types.d.ts.map