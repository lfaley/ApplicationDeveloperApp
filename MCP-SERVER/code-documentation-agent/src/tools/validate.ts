/**
 * Validate Documentation Tool
 * 
 * Validates that code has proper documentation coverage and quality
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import { parseTypeScript } from '../parsers/typescript.js';
import { parsePython } from '../parsers/python.js';
import type { ValidationResult, ValidationIssue, FunctionInfo, ClassInfo } from '../types.js';

const ValidateSchema = z.object({
  code: z.string().optional(),
  filePath: z.string().optional(),
  language: z.enum(['typescript', 'javascript', 'python', 'csharp', 'powershell']),
  rules: z.object({
    requireParams: z.boolean().default(true),
    requireReturns: z.boolean().default(true),
    requireExamples: z.boolean().default(false),
    requireThrows: z.boolean().default(true),
    minCoveragePercent: z.number().min(0).max(100).default(80),
  }).optional(),
});

/**
 * Tool handler
 */
export async function validateDocumentationTool(args: unknown) {
  try {
    const validated = ValidateSchema.parse(args);
    
    // Get code content
    let code: string;
    if (validated.code) {
      code = validated.code;
    } else if (validated.filePath) {
      code = await fs.readFile(validated.filePath, 'utf-8');
    } else {
      return {
        isError: true,
        content: [{ type: 'text', text: 'Either code or filePath must be provided' }],
      };
    }
    
    const result = await validateDocumentation(
      code,
      validated.language,
      validated.filePath || '<input>',
      validated.rules
    );
    
    // Format output
    const output: string[] = [];
    output.push(`Documentation Validation Report`);
    output.push(`================================`);
    output.push(`File: ${validated.filePath || '<input>'}`);
    output.push(`Coverage: ${result.coverage}%`);
    output.push(`Documented: ${result.documentedItems}/${result.totalItems}`);
    output.push('');
    
    const totalIssues = result.errors.length + result.warnings.length + result.info.length;
    if (totalIssues > 0) {
      output.push(`Issues Found: ${totalIssues}`);
      output.push('');
      
      if (result.errors.length > 0) {
        output.push(`Errors (${result.errors.length}):`);
        result.errors.forEach((issue: ValidationIssue) => {
          output.push(`  ❌ [${issue.elementName}] ${issue.issue}`);
        });
        output.push('');
      }
      
      if (result.warnings.length > 0) {
        output.push(`Warnings (${result.warnings.length}):`);
        result.warnings.forEach((issue: ValidationIssue) => {
          output.push(`  ⚠️  [${issue.elementName}] ${issue.issue}`);
        });
        output.push('');
      }
      
      if (result.info.length > 0) {
        output.push(`Info (${result.info.length}):`);
        result.info.forEach((issue: ValidationIssue) => {
          output.push(`  ℹ️  [${issue.elementName}] ${issue.issue}`);
        });
        output.push('');
      }
    } else {
      output.push('✅ No issues found - documentation is complete!');
    }
    
    if (result.missingDocs.length > 0) {
      output.push('');
      output.push(`Missing Documentation:`);
      result.missingDocs.forEach((item: string) => {
        output.push(`  • ${item}`);
      });
    }
    
    return {
      content: [
        {
          type: 'text',
          text: output.join('\n'),
        },
      ],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Validation error: ${JSON.stringify((error as z.ZodError).errors)}` }],
      };
    }
    throw error;
  }
}

/**
 * Validate documentation in code
 */
async function validateDocumentation(
  code: string,
  language: string,
  filePath: string,
  rules?: {
    requireParams?: boolean;
    requireReturns?: boolean;
    requireExamples?: boolean;
    requireThrows?: boolean;
    minCoveragePercent?: number;
  }
): Promise<ValidationResult> {
  const defaultRules = {
    requireParams: true,
    requireReturns: true,
    requireExamples: false,
    requireThrows: true,
    minCoveragePercent: 80,
  };
  
  const activeRules = { ...defaultRules, ...rules };
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const info: ValidationIssue[] = [];
  const missingDocs: string[] = [];
  
  // Parse the code
  let analysisResult;
  if (language === 'typescript' || language === 'javascript') {
    analysisResult = await parseTypeScript(code, filePath);
  } else if (language === 'python') {
    analysisResult = await parsePython(code, filePath);
  } else {
    // For unsupported languages, return empty validation
    return {
      isValid: false,
      errors: [{
        line: 0,
        elementName: language,
        elementType: 'function',
        issue: `Validation not yet implemented for ${language}`,
        severity: 'error',
        fixable: false,
      }],
      warnings: [],
      info: [{
        line: 0,
        elementName: language,
        elementType: 'function',
        issue: 'Add parser support for this language',
        severity: 'info',
        fixable: false,
      }],
      coverage: 0,
      totalItems: 0,
      documentedItems: 0,
      missingDocs: [],
    };
  }
  
  // Validate functions
  for (const func of analysisResult.functions) {
    validateFunction(func, activeRules, errors, warnings, info);
    if (!func.hasDocumentation) {
      missingDocs.push(`Function: ${func.name}`);
    }
  }
  
  // Validate classes
  for (const cls of analysisResult.classes) {
    validateClass(cls, activeRules, errors, warnings, info);
    if (!cls.hasDocumentation) {
      missingDocs.push(`Class: ${cls.name}`);
    }
  }
  
  // Check overall coverage
  const totalItems = analysisResult.functions.length + analysisResult.classes.length;
  const coverage = totalItems > 0 ? Math.round((analysisResult.documentedItems / totalItems) * 100) : 0;
  
  if (coverage < activeRules.minCoveragePercent) {
    errors.push({
      line: 1,
      elementName: filePath,
      elementType: 'function',
      issue: `Documentation coverage ${coverage}% is below minimum ${activeRules.minCoveragePercent}%`,
      severity: 'error',
      fixable: true,
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    info,
    coverage,
    totalItems,
    documentedItems: analysisResult.documentedItems,
    missingDocs,
  };
}

/**
 * Validate a single function
 */
function validateFunction(
  func: FunctionInfo,
  rules: {
    requireParams: boolean;
    requireReturns: boolean;
    requireExamples: boolean;
    requireThrows: boolean;
  },
  errors: ValidationIssue[],
  warnings: ValidationIssue[],
  info: ValidationIssue[]
): void {
  // Check if function has documentation
  if (!func.hasDocumentation) {
    errors.push({
      line: func.startLine,
      elementName: func.name,
      elementType: 'function',
      issue: 'Function is missing documentation',
      severity: 'error',
      fixable: true,
    });
    return; // Don't check detailed requirements if no docs at all
  }
  
  // Check parameters documentation
  if (rules.requireParams && func.params.length > 0) {
    // This is a simplified check - in reality, we'd parse the existing docs
    info.push({
      line: func.startLine,
      elementName: func.name,
      elementType: 'function',
      issue: `Function has ${func.params.length} parameters - ensure all are documented`,
      severity: 'info',
      fixable: true,
    });
  }
  
  // Check return documentation
  if (rules.requireReturns && func.returnType && func.returnType !== 'void' && func.returnType !== 'None') {
    info.push({
      line: func.startLine,
      elementName: func.name,
      elementType: 'function',
      issue: 'Ensure return value is documented',
      severity: 'info',
      fixable: true,
    });
  }
  
  // Check exceptions documentation
  if (rules.requireThrows && func.throws && func.throws.length > 0) {
    info.push({
      line: func.startLine,
      elementName: func.name,
      elementType: 'function',
      issue: `Function throws ${func.throws.length} exception(s) - ensure all are documented`,
      severity: 'info',
      fixable: true,
    });
  }
  
  // Check complexity
  if (func.complexity > 10) {
    warnings.push({
      line: func.startLine,
      elementName: func.name,
      elementType: 'function',
      issue: `High complexity (${func.complexity}) - consider adding more detailed documentation or examples`,
      severity: 'warning',
      fixable: false,
    });
  }
  
  // Check examples
  if (rules.requireExamples) {
    info.push({
      line: func.startLine,
      elementName: func.name,
      elementType: 'function',
      issue: 'Consider adding usage examples',
      severity: 'info',
      fixable: true,
    });
  }
}

/**
 * Validate a single class
 */
function validateClass(
  cls: ClassInfo,
  rules: {
    requireParams: boolean;
    requireReturns: boolean;
    requireExamples: boolean;
    requireThrows: boolean;
  },
  errors: ValidationIssue[],
  warnings: ValidationIssue[],
  info: ValidationIssue[]
): void {
  // Check if class has documentation
  if (!cls.hasDocumentation) {
    errors.push({
      line: cls.startLine,
      elementName: cls.name,
      elementType: 'class',
      issue: 'Class is missing documentation',
      severity: 'error',
      fixable: true,
    });
  }
  
  // Check if public methods are documented
  const publicMethods = cls.methods.filter((m: FunctionInfo) => m.isExported);
  const undocumentedPublicMethods = publicMethods.filter((m: FunctionInfo) => !m.hasDocumentation);
  
  if (undocumentedPublicMethods.length > 0) {
    warnings.push({
      line: cls.startLine,
      elementName: cls.name,
      elementType: 'class',
      issue: `${undocumentedPublicMethods.length} public method(s) are undocumented`,
      severity: 'warning',
      fixable: true,
    });
  }
}
