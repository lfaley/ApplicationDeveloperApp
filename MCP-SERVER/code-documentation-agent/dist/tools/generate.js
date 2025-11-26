/**
 * Generate Documentation Tool
 *
 * Generates documentation comments in various styles (JSDoc, TSDoc, docstrings, XML docs)
 */
import { z } from 'zod';
import { parseTypeScript } from '../parsers/typescript.js';
import { parsePython } from '../parsers/python.js';
import { generateJSDocForFunction } from '../generators/jsdoc.js';
import { generateDocstringForFunction } from '../generators/docstring.js';
const GenerateDocSchema = z.object({
    code: z.string(),
    language: z.enum(['typescript', 'javascript', 'python', 'csharp', 'powershell']),
    style: z.enum(['jsdoc', 'tsdoc', 'google', 'numpy', 'sphinx', 'xmldoc', 'help']),
    includeExamples: z.boolean().default(false),
    includeDescription: z.boolean().default(true),
});
/**
 * Tool handler
 */
export async function generateDocumentationTool(args) {
    try {
        const validated = GenerateDocSchema.parse(args);
        // Parse code based on language
        if (validated.language === 'typescript' || validated.language === 'javascript') {
            const analysisResult = await parseTypeScript(validated.code, validated.language);
            // Generate documentation for all functions
            const docs = [];
            for (const funcInfo of analysisResult.functions) {
                const doc = generateJSDocForFunction(funcInfo, {
                    includeDescription: validated.includeDescription,
                    includeParams: true,
                    includeReturns: true,
                    includeThrows: true,
                    includeExamples: validated.includeExamples,
                    inferDescriptions: true,
                });
                docs.push(`// Function: ${funcInfo.name}\n${doc}\n`);
            }
            return {
                content: [
                    {
                        type: 'text',
                        text: docs.join('\n') || 'No functions found to document',
                    },
                ],
            };
        }
        if (validated.language === 'python') {
            const analysisResult = await parsePython(validated.code);
            const docstringStyle = (validated.style === 'google' || validated.style === 'numpy' || validated.style === 'sphinx')
                ? validated.style
                : 'google';
            // Generate documentation for all functions
            const docs = [];
            for (const funcInfo of analysisResult.functions) {
                const doc = generateDocstringForFunction(funcInfo, {
                    includeDescription: validated.includeDescription,
                    includeParams: true,
                    includeReturns: true,
                    includeThrows: true,
                    includeExamples: validated.includeExamples,
                    inferDescriptions: true,
                }, docstringStyle);
                docs.push(`# Function: ${funcInfo.name}\n${doc}\n`);
            }
            return {
                content: [
                    {
                        type: 'text',
                        text: docs.join('\n') || 'No functions found to document',
                    },
                ],
            };
        }
        if (validated.language === 'csharp') {
            // For C#, we'll need a basic parser - for now, generate placeholder
            // TODO: Implement C# parser (similar to Python regex-based approach)
            return {
                content: [
                    {
                        type: 'text',
                        text: 'C# parsing not yet implemented. Once implemented, will generate XML documentation comments.',
                    },
                ],
            };
        }
        if (validated.language === 'powershell') {
            // For PowerShell, we'll need a basic parser - for now, generate placeholder
            // TODO: Implement PowerShell parser (similar to Python regex-based approach)
            return {
                content: [
                    {
                        type: 'text',
                        text: 'PowerShell parsing not yet implemented. Once implemented, will generate comment-based help.',
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: 'text',
                    text: `Documentation generation for ${validated.language} is not supported`,
                },
            ],
        };
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return {
                isError: true,
                content: [{ type: 'text', text: `Validation error: ${JSON.stringify(error.errors)}` }],
            };
        }
        throw error;
    }
}
//# sourceMappingURL=generate.js.map