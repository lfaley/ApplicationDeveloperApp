/**
 * Update Comments Tool
 *
 * Updates source code files by inserting or replacing documentation comments
 */
import { z } from 'zod';
import * as fs from 'fs/promises';
const UpdateCommentsSchema = z.object({
    filePath: z.string().min(1, 'File path is required'),
    documentation: z.string().min(1, 'Documentation is required'),
    targetName: z.string().min(1, 'Target function/class name is required'),
    language: z.enum(['typescript', 'javascript', 'python', 'csharp', 'powershell']),
    dryRun: z.boolean().default(false),
    replaceExisting: z.boolean().default(true),
});
/**
 * Tool handler
 */
export async function updateCommentsTool(args) {
    try {
        const validated = UpdateCommentsSchema.parse(args);
        const result = await updateDocumentation(validated.filePath, validated.documentation, validated.targetName, validated.language, validated.dryRun, validated.replaceExisting);
        if (result.success) {
            const message = validated.dryRun
                ? `Dry run: Would update ${result.linesModified} lines in ${result.filePath}`
                : `Successfully updated ${result.linesModified} lines in ${result.filePath}`;
            return {
                content: [
                    {
                        type: 'text',
                        text: `${message}\n\n${result.diff || ''}`,
                    },
                ],
            };
        }
        else {
            return {
                isError: true,
                content: [
                    {
                        type: 'text',
                        text: `Failed to update file: ${result.error}`,
                    },
                ],
            };
        }
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
/**
 * Update documentation in a source file
 */
async function updateDocumentation(filePath, documentation, targetName, language, dryRun, replaceExisting) {
    try {
        // Read the file
        const content = await fs.readFile(filePath, 'utf-8');
        const lines = content.split('\n');
        // Find the target function/class
        const targetInfo = findTarget(lines, targetName, language);
        if (!targetInfo) {
            return {
                success: false,
                filePath,
                linesModified: 0,
                error: `Could not find ${targetName} in ${filePath}`,
            };
        }
        // Check if documentation already exists
        const existingDocInfo = findExistingDocumentation(lines, targetInfo.line, language);
        if (existingDocInfo && !replaceExisting) {
            return {
                success: false,
                filePath,
                linesModified: 0,
                error: `Documentation already exists for ${targetName}. Use replaceExisting: true to replace it.`,
            };
        }
        // Prepare the new documentation with correct indentation
        const indentation = getIndentation(lines[targetInfo.line]);
        const docLines = documentation.split('\n').map(line => indentation + line);
        // Calculate the update
        let newLines;
        let linesModified;
        if (existingDocInfo) {
            // Replace existing documentation
            newLines = [
                ...lines.slice(0, existingDocInfo.startLine),
                ...docLines,
                ...lines.slice(existingDocInfo.endLine + 1),
            ];
            linesModified = existingDocInfo.endLine - existingDocInfo.startLine + 1 + docLines.length;
        }
        else {
            // Insert new documentation
            newLines = [
                ...lines.slice(0, targetInfo.line),
                ...docLines,
                ...lines.slice(targetInfo.line),
            ];
            linesModified = docLines.length;
        }
        // Generate diff
        const diff = generateDiff(lines, newLines, existingDocInfo?.startLine || targetInfo.line, docLines.length);
        // Write the file (unless dry run)
        if (!dryRun) {
            await fs.writeFile(filePath, newLines.join('\n'), 'utf-8');
        }
        return {
            success: true,
            filePath,
            linesModified,
            diff,
        };
    }
    catch (error) {
        return {
            success: false,
            filePath,
            linesModified: 0,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}
/**
 * Find the target function/class in the code
 */
function findTarget(lines, targetName, language) {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (language === 'typescript' || language === 'javascript') {
            // Match function declarations
            if (line.match(new RegExp(`function\\s+${targetName}\\s*\\(`))) {
                return { line: i, type: 'function' };
            }
            // Match arrow functions
            if (line.match(new RegExp(`(const|let|var)\\s+${targetName}\\s*=\\s*\\(`))) {
                return { line: i, type: 'function' };
            }
            // Match class methods
            if (line.match(new RegExp(`${targetName}\\s*\\([^)]*\\)\\s*[:{]`))) {
                return { line: i, type: 'function' };
            }
            // Match class declarations
            if (line.match(new RegExp(`class\\s+${targetName}\\s*[{<]`))) {
                return { line: i, type: 'class' };
            }
        }
        if (language === 'python') {
            // Match function definitions
            if (line.match(new RegExp(`def\\s+${targetName}\\s*\\(`))) {
                return { line: i, type: 'function' };
            }
            // Match class definitions
            if (line.match(new RegExp(`class\\s+${targetName}\\s*[:(]`))) {
                return { line: i, type: 'class' };
            }
        }
        if (language === 'csharp') {
            // Match method declarations (simplified)
            if (line.includes(targetName) && line.includes('(')) {
                return { line: i, type: 'function' };
            }
            // Match class declarations
            if (line.match(new RegExp(`class\\s+${targetName}\\s*[:{<]`))) {
                return { line: i, type: 'class' };
            }
        }
        if (language === 'powershell') {
            // Match function declarations
            if (line.match(new RegExp(`function\\s+${targetName}\\s*[{(]`, 'i'))) {
                return { line: i, type: 'function' };
            }
        }
    }
    return null;
}
/**
 * Find existing documentation before a target line
 */
function findExistingDocumentation(lines, targetLine, language) {
    if (language === 'typescript' || language === 'javascript') {
        // Look for JSDoc/TSDoc (/** ... */)
        let endLine = targetLine - 1;
        while (endLine >= 0 && lines[endLine].trim() === '') {
            endLine--;
        }
        if (endLine >= 0 && lines[endLine].trim().endsWith('*/')) {
            let startLine = endLine;
            while (startLine > 0 && !lines[startLine].trim().startsWith('/**')) {
                startLine--;
            }
            if (lines[startLine].trim().startsWith('/**')) {
                return { startLine, endLine };
            }
        }
    }
    if (language === 'python') {
        // Look for docstrings (""" or ''')
        let checkLine = targetLine + 1;
        while (checkLine < lines.length && lines[checkLine].trim() === '') {
            checkLine++;
        }
        if (checkLine < lines.length) {
            const line = lines[checkLine].trim();
            if (line.startsWith('"""') || line.startsWith("'''")) {
                const quote = line.startsWith('"""') ? '"""' : "'''";
                // Single-line docstring
                if (line.endsWith(quote) && line.length > 6) {
                    return { startLine: checkLine, endLine: checkLine };
                }
                // Multi-line docstring
                let endLine = checkLine + 1;
                while (endLine < lines.length && !lines[endLine].trim().endsWith(quote)) {
                    endLine++;
                }
                if (endLine < lines.length) {
                    return { startLine: checkLine, endLine };
                }
            }
        }
    }
    if (language === 'csharp') {
        // Look for XML doc comments (///)
        let startLine = targetLine - 1;
        while (startLine >= 0 && lines[startLine].trim().startsWith('///')) {
            startLine--;
        }
        startLine++;
        if (startLine < targetLine && lines[startLine].trim().startsWith('///')) {
            let endLine = startLine;
            while (endLine < targetLine && lines[endLine].trim().startsWith('///')) {
                endLine++;
            }
            return { startLine, endLine: endLine - 1 };
        }
    }
    if (language === 'powershell') {
        // Look for comment-based help (<# ... #>)
        let endLine = targetLine - 1;
        while (endLine >= 0 && lines[endLine].trim() === '') {
            endLine--;
        }
        if (endLine >= 0 && lines[endLine].trim() === '#>') {
            let startLine = endLine;
            while (startLine > 0 && lines[startLine].trim() !== '<#') {
                startLine--;
            }
            if (lines[startLine].trim() === '<#') {
                return { startLine, endLine };
            }
        }
    }
    return null;
}
/**
 * Get the indentation of a line
 */
function getIndentation(line) {
    const match = line.match(/^(\s*)/);
    return match ? match[1] : '';
}
/**
 * Generate a diff showing what changed
 */
function generateDiff(oldLines, newLines, startLine, numNewLines) {
    const contextLines = 3;
    const start = Math.max(0, startLine - contextLines);
    const end = Math.min(newLines.length, startLine + numNewLines + contextLines);
    const diff = ['--- Original', '+++ Modified', `@@ -${start + 1} +${start + 1} @@`];
    for (let i = start; i < end; i++) {
        if (i < startLine || i >= startLine + numNewLines) {
            // Context line
            diff.push(` ${newLines[i]}`);
        }
        else {
            // Changed line
            if (i < oldLines.length) {
                diff.push(`-${oldLines[i]}`);
            }
            diff.push(`+${newLines[i]}`);
        }
    }
    return diff.join('\n');
}
//# sourceMappingURL=update.js.map