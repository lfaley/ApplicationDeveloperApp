/**
 * Analyze Code Tool
 *
 * Parses source code and extracts structural information including functions,
 * classes, interfaces, and their documentation status.
 */
import { z } from 'zod';
import { parseTypeScript } from '../parsers/typescript.js';
import { parsePython } from '../parsers/python.js';
/**
 * Input schema for analyze_code tool
 */
const AnalyzeCodeSchema = z.object({
    code: z.string().min(1, 'Code cannot be empty'),
    language: z.enum(['typescript', 'javascript', 'python', 'csharp', 'powershell']),
    filePath: z.string().optional(),
});
/**
 * Analyzes TypeScript/JavaScript code using enhanced parser
 */
function analyzeTypeScript(code, filePath) {
    return parseTypeScript(code, filePath || 'unknown');
}
/**
 * Analyzes Python code using regex-based parser
 */
async function analyzePython(code, filePath) {
    return await parsePython(code, filePath || 'unknown');
}
function analyzeCSharp(code, filePath) {
    // TODO: Implement C# parsing
    return {
        functions: [],
        classes: [],
        interfaces: [],
        language: 'csharp',
        filePath: filePath || 'unknown',
        totalLines: code.split('\n').length,
        documentedItems: 0,
        undocumentedItems: 0,
        coveragePercent: 0,
    };
}
function analyzePowerShell(code, filePath) {
    // TODO: Implement PowerShell parsing
    return {
        functions: [],
        classes: [],
        interfaces: [],
        language: 'powershell',
        filePath: filePath || 'unknown',
        totalLines: code.split('\n').length,
        documentedItems: 0,
        undocumentedItems: 0,
        coveragePercent: 0,
    };
}
/**
 * Main tool handler
 */
export async function analyzeCodeTool(args) {
    try {
        const validated = AnalyzeCodeSchema.parse(args);
        let result;
        switch (validated.language) {
            case 'typescript':
            case 'javascript':
                result = analyzeTypeScript(validated.code, validated.filePath);
                break;
            case 'python':
                result = await analyzePython(validated.code, validated.filePath);
                break;
            case 'csharp':
                result = analyzeCSharp(validated.code, validated.filePath);
                break;
            case 'powershell':
                result = analyzePowerShell(validated.code, validated.filePath);
                break;
            default:
                throw new Error(`Unsupported language: ${validated.language}`);
        }
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return {
                isError: true,
                content: [
                    {
                        type: 'text',
                        text: `Validation error: ${error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
                    },
                ],
            };
        }
        throw error;
    }
}
//# sourceMappingURL=analyze.js.map