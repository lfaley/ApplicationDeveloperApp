/**
 * Python Parser
 *
 * Parses Python code to extract functions, classes, and documentation
 * Uses regex-based parsing since we don't have a Python AST parser in Node.js
 */
/**
 * Parse Python code and extract documentation information
 */
export async function parsePython(code, filePath = '<input>') {
    const functions = [];
    const classes = [];
    const lines = code.split('\n');
    // Extract functions (only top-level, not class methods)
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Match function definition: [async] def function_name(params) -> return_type:
        // Only match top-level functions (no leading whitespace except for decorators)
        const funcMatch = line.match(/^(async\s+)?def\s+(\w+)\s*\((.*?)\)(?:\s*->\s*([^:]+))?:/);
        if (funcMatch) {
            const [, asyncKeyword, name, paramsStr, returnType] = funcMatch;
            const isAsyncFunc = asyncKeyword !== undefined;
            const startLine = i + 1;
            // Parse parameters
            const params = parseParameters(paramsStr);
            // Find end of function (next top-level def/class, or end of file)
            let endLine = lines.length;
            for (let j = i + 1; j < lines.length; j++) {
                const nextLine = lines[j];
                // Check if this is a top-level definition (no leading whitespace)
                if (nextLine.match(/^(async\s+def\s+|def\s+|class\s+|@\w+)/)) {
                    endLine = j;
                    break;
                }
            }
            // Extract docstring
            const docstring = extractDocstring(lines, i + 1);
            const hasDocumentation = docstring !== null;
            // Find decorators
            const decorators = extractDecorators(lines, i);
            const isAsync = isAsyncFunc || decorators.some(d => d.includes('async'));
            const isStatic = decorators.some(d => d.includes('staticmethod'));
            const isClassMethod = decorators.some(d => d.includes('classmethod'));
            // Extract exceptions
            const throws = extractThrows(lines, i + 1, endLine);
            // Calculate complexity (count if/elif/else/for/while/try/except)
            const complexity = calculateComplexity(lines, i + 1, endLine);
            functions.push({
                name,
                params,
                returnType: returnType?.trim() || 'None',
                startLine,
                endLine,
                complexity,
                isAsync,
                isExported: !name.startsWith('_') || name.startsWith('__') && name.endsWith('__'), // Public unless single underscore
                hasDocumentation,
                throws,
                existingDocs: docstring || undefined,
            });
        }
        // Match class definition: class ClassName:
        const classMatch = line.match(/^(\s*)class\s+(\w+)(?:\((.*?)\))?:/);
        if (classMatch) {
            const [, indent, name, bases] = classMatch;
            const startLine = i + 1;
            // Find end of class
            let endLine = lines.length;
            const indentLevel = indent.length;
            for (let j = i + 1; j < lines.length; j++) {
                const nextLine = lines[j].trim();
                if (nextLine.length === 0)
                    continue;
                const nextIndent = lines[j].match(/^(\s*)/)?.[1].length || 0;
                if (nextIndent <= indentLevel && (nextLine.startsWith('def ') || nextLine.startsWith('class ') || nextLine.startsWith('@'))) {
                    endLine = j;
                    break;
                }
            }
            // Extract docstring
            const docstring = extractDocstring(lines, i + 1);
            const hasDocumentation = docstring !== null;
            // Extract methods (functions within the class)
            const methods = [];
            for (let j = i + 1; j < endLine; j++) {
                const methodLine = lines[j];
                const methodMatch = methodLine.match(/^(\s+)(async\s+)?def\s+(\w+)\s*\((.*?)\)(?:\s*->\s*([^:]+))?:/);
                if (methodMatch) {
                    const [, methodIndent, asyncKeyword, methodName, methodParamsStr, methodReturnType] = methodMatch;
                    const isAsyncMethod = asyncKeyword !== undefined;
                    const methodStartLine = j + 1;
                    // Find end of method
                    let methodEndLine = endLine;
                    const methodIndentLevel = methodIndent.length;
                    for (let k = j + 1; k < endLine; k++) {
                        const nextMethodLine = lines[k].trim();
                        if (nextMethodLine.length === 0)
                            continue;
                        const nextMethodIndent = lines[k].match(/^(\s*)/)?.[1].length || 0;
                        if (nextMethodIndent <= methodIndentLevel && (nextMethodLine.startsWith('async def ') || nextMethodLine.startsWith('def ') || nextMethodLine.startsWith('@'))) {
                            methodEndLine = k;
                            break;
                        }
                    }
                    const methodParams = parseParameters(methodParamsStr);
                    const methodDocstring = extractDocstring(lines, j + 1);
                    const methodDecorators = extractDecorators(lines, j);
                    const methodThrows = extractThrows(lines, j + 1, methodEndLine);
                    const methodComplexity = calculateComplexity(lines, j + 1, methodEndLine);
                    methods.push({
                        name: methodName,
                        params: methodParams,
                        returnType: methodReturnType?.trim() || 'None',
                        startLine: methodStartLine,
                        endLine: methodEndLine,
                        complexity: methodComplexity,
                        isAsync: isAsyncMethod || methodDecorators.some(d => d.includes('async')),
                        isExported: !methodName.startsWith('_') || (methodName.startsWith('__') && methodName.endsWith('__')),
                        hasDocumentation: methodDocstring !== null,
                        throws: methodThrows,
                        existingDocs: methodDocstring || undefined,
                    });
                }
            }
            // Extract class attributes (self.attribute = value)
            const rawProperties = extractClassAttributes(lines, i + 1, endLine);
            const properties = rawProperties.map(p => ({
                name: p.name,
                type: p.type || null,
                isReadonly: false,
                isStatic: p.isStatic,
                visibility: p.visibility,
                hasDocumentation: false,
            }));
            classes.push({
                name,
                methods,
                properties,
                startLine,
                endLine,
                isExported: !name.startsWith('_'),
                hasDocumentation,
                existingDocs: docstring || undefined,
            });
        }
    }
    const totalItems = functions.length + classes.length;
    const documentedItems = functions.filter(f => f.hasDocumentation).length + classes.filter(c => c.hasDocumentation).length;
    const undocumentedItems = totalItems - documentedItems;
    const coveragePercent = totalItems > 0 ? Math.round((documentedItems / totalItems) * 100) : 0;
    return {
        language: 'python',
        functions,
        classes,
        interfaces: [], // Python doesn't have explicit interfaces
        filePath,
        totalLines: lines.length,
        documentedItems,
        undocumentedItems,
        coveragePercent,
    };
}
/**
 * Parse function parameters from parameter string
 */
function parseParameters(paramsStr) {
    if (!paramsStr.trim())
        return [];
    const params = [];
    const paramParts = paramsStr.split(',');
    for (const part of paramParts) {
        const trimmed = part.trim();
        if (!trimmed)
            continue;
        // Match: name, name: type, name = default, name: type = default
        const match = trimmed.match(/^(\*{0,2})(\w+)(?:\s*:\s*([^=]+))?(?:\s*=\s*(.+))?$/);
        if (match) {
            const [, spread, name, type, defaultValue] = match;
            // Skip self and cls
            if (name === 'self' || name === 'cls')
                continue;
            params.push({
                name,
                type: type?.trim() || null,
                optional: !!defaultValue,
                defaultValue: defaultValue?.trim(),
            });
        }
    }
    return params;
}
/**
 * Extract docstring from function or class
 */
function extractDocstring(lines, startLine) {
    // Docstring must be first non-empty line after definition
    for (let i = startLine; i < Math.min(startLine + 3, lines.length); i++) {
        const line = lines[i].trim();
        // Match triple-quoted strings
        if (line.startsWith('"""') || line.startsWith("'''")) {
            const quote = line.startsWith('"""') ? '"""' : "'''";
            // Single-line docstring
            if (line.endsWith(quote) && line.length > 6) {
                return line.slice(3, -3).trim();
            }
            // Multi-line docstring
            const docLines = [line.slice(3)];
            for (let j = i + 1; j < lines.length; j++) {
                const docLine = lines[j];
                docLines.push(docLine);
                if (docLine.trim().endsWith(quote)) {
                    return docLines.join('\n').slice(0, -3).trim();
                }
            }
        }
    }
    return null;
}
/**
 * Extract decorators before function/class
 */
function extractDecorators(lines, defLine) {
    const decorators = [];
    for (let i = defLine - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (line.startsWith('@')) {
            decorators.unshift(line);
        }
        else if (line.length > 0) {
            break; // Stop at first non-decorator, non-empty line
        }
    }
    return decorators;
}
/**
 * Extract exceptions raised in function
 */
function extractThrows(lines, startLine, endLine) {
    const throws = new Set();
    for (let i = startLine; i < endLine; i++) {
        const line = lines[i];
        // Match: raise ExceptionName or raise ExceptionName()
        const match = line.match(/raise\s+(\w+)/);
        if (match) {
            throws.add(match[1]);
        }
    }
    return Array.from(throws);
}
/**
 * Calculate cyclomatic complexity
 */
function calculateComplexity(lines, startLine, endLine) {
    let complexity = 1; // Base complexity
    for (let i = startLine; i < endLine; i++) {
        const line = lines[i].trim();
        // Count decision points
        if (line.startsWith('if ') || line.startsWith('elif '))
            complexity++;
        if (line.startsWith('for ') || line.startsWith('while '))
            complexity++;
        if (line.startsWith('except '))
            complexity++;
        if (line.includes(' and ') || line.includes(' or '))
            complexity++;
        if (line.includes('if ') && line.includes(' else '))
            complexity++; // Ternary
    }
    return complexity;
}
/**
 * Extract class attributes
 */
function extractClassAttributes(lines, startLine, endLine) {
    const attributes = [];
    const seen = new Set();
    for (let i = startLine; i < endLine; i++) {
        const line = lines[i];
        // Match: self.attribute = value or self.attribute: type = value
        const match = line.match(/self\.(\w+)(?:\s*:\s*([^=]+))?\s*=/);
        if (match) {
            const [, name, type] = match;
            if (!seen.has(name)) {
                seen.add(name);
                attributes.push({
                    name,
                    type: type?.trim(),
                    isStatic: false,
                    visibility: name.startsWith('_') ? 'private' : 'public',
                });
            }
        }
        // Match class variables (at class level, not in methods)
        const classVarMatch = line.match(/^(\s+)(\w+)(?:\s*:\s*([^=]+))?\s*=/);
        if (classVarMatch) {
            const [, indent, name, type] = classVarMatch;
            // Make sure it's at class level (one indentation level)
            if (indent.length === 4 && !line.includes('def ') && !seen.has(name)) {
                seen.add(name);
                attributes.push({
                    name,
                    type: type?.trim(),
                    isStatic: true,
                    visibility: name.startsWith('_') ? 'private' : 'public',
                });
            }
        }
    }
    return attributes;
}
/**
 * Calculate how many lines are documented
 */
function calculateDocumentedLines(functions, classes) {
    let documented = 0;
    for (const func of functions) {
        if (func.hasDocumentation) {
            documented += (func.endLine - func.startLine + 1);
        }
    }
    for (const cls of classes) {
        if (cls.hasDocumentation) {
            documented += (cls.endLine - cls.startLine + 1);
        }
    }
    return documented;
}
//# sourceMappingURL=python.js.map