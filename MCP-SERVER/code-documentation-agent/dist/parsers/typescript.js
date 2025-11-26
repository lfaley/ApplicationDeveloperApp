/**
 * TypeScript/JavaScript Parser
 *
 * Enhanced AST-based parser with full support for:
 * - Functions, arrow functions, methods
 * - Classes with properties and decorators
 * - Interfaces with properties and methods
 * - Type annotations and generics
 * - Existing documentation detection
 */
import { parse } from '@typescript-eslint/typescript-estree';
/**
 * Parse TypeScript/JavaScript code and extract all structural elements
 */
export function parseTypeScript(code, filePath = 'unknown') {
    const functions = [];
    const classes = [];
    const interfaces = [];
    try {
        const ast = parse(code, {
            loc: true,
            range: true,
            comment: true,
            tokens: true,
            jsx: true,
        });
        // Walk the AST
        visit(ast);
        const totalItems = functions.length + classes.length + interfaces.length;
        const documentedItems = [
            ...functions.filter(f => f.hasDocumentation),
            ...classes.filter(c => c.hasDocumentation),
        ].length;
        return {
            functions,
            classes,
            interfaces,
            language: 'typescript',
            filePath,
            totalLines: code.split('\n').length,
            documentedItems,
            undocumentedItems: totalItems - documentedItems,
            coveragePercent: totalItems > 0 ? Math.round((documentedItems / totalItems) * 100) : 0,
        };
    }
    catch (error) {
        throw new Error(`Failed to parse TypeScript: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    /**
     * Recursively visit AST nodes
     */
    function visit(node) {
        if (!node || typeof node !== 'object')
            return;
        switch (node.type) {
            case 'FunctionDeclaration':
                if (node.id) {
                    functions.push(extractFunction(node, code));
                }
                break;
            case 'VariableDeclarator':
                if (node.init &&
                    (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression')) {
                    const name = node.id.type === 'Identifier' ? node.id.name : 'anonymous';
                    functions.push(extractFunction(node.init, code, name));
                }
                break;
            case 'ClassDeclaration':
                if (node.id) {
                    classes.push(extractClass(node, code));
                }
                break;
            case 'TSInterfaceDeclaration':
                interfaces.push(extractInterface(node, code));
                break;
        }
        // Recursively visit children
        for (const key in node) {
            const child = node[key];
            if (child && typeof child === 'object') {
                if (Array.isArray(child)) {
                    child.forEach(visit);
                }
                else if (child.type) {
                    visit(child);
                }
            }
        }
    }
}
/**
 * Extract function information from AST node
 */
function extractFunction(node, code, name) {
    const funcName = name || (node.id?.name ?? 'anonymous');
    return {
        name: funcName,
        params: extractParameters(node.params, code),
        returnType: extractReturnType(node),
        startLine: node.loc.start.line,
        endLine: node.loc.end.line,
        complexity: calculateComplexity(node),
        isAsync: node.async || false,
        isExported: isExported(node),
        hasDocumentation: hasLeadingComment(node, code),
        existingDocs: extractExistingDocs(node, code),
        throws: extractThrows(node, code),
    };
}
/**
 * Extract class information from AST node
 */
function extractClass(node, code) {
    const methods = [];
    const properties = [];
    // Extract methods and properties
    node.body.body.forEach((member) => {
        if (member.type === 'MethodDefinition') {
            const method = extractFunction(member.value, code, member.key.name);
            methods.push(method);
        }
        else if (member.type === 'PropertyDefinition') {
            properties.push({
                name: member.key.name,
                type: extractTypeAnnotation(member.typeAnnotation),
                isReadonly: member.readonly || false,
                isStatic: member.static || false,
                visibility: extractVisibility(member),
                hasDocumentation: hasLeadingComment(member, code),
            });
        }
    });
    return {
        name: node.id.name,
        methods,
        properties,
        isExported: isExported(node),
        startLine: node.loc.start.line,
        endLine: node.loc.end.line,
        hasDocumentation: hasLeadingComment(node, code),
        existingDocs: extractExistingDocs(node, code),
    };
}
/**
 * Extract interface information from AST node
 */
function extractInterface(node, code) {
    const properties = [];
    const methods = [];
    node.body.body.forEach((member) => {
        if (member.type === 'TSPropertySignature') {
            properties.push({
                name: member.key.name,
                type: extractTypeAnnotation(member.typeAnnotation),
                isReadonly: member.readonly || false,
                isStatic: false,
                visibility: 'public',
                hasDocumentation: hasLeadingComment(member, code),
            });
        }
        else if (member.type === 'TSMethodSignature') {
            methods.push({
                name: member.key.name,
                params: extractParameters(member.params, code),
                returnType: extractTypeAnnotation(member.typeAnnotation),
                startLine: member.loc.start.line,
                endLine: member.loc.end.line,
                complexity: 1,
                isAsync: false,
                isExported: false,
                hasDocumentation: hasLeadingComment(member, code),
            });
        }
    });
    return {
        name: node.id.name,
        properties,
        methods,
        isExported: isExported(node),
        startLine: node.loc.start.line,
        endLine: node.loc.end.line,
    };
}
/**
 * Extract function parameters
 */
function extractParameters(params, code) {
    return params.map((param) => {
        let name = 'param';
        let optional = false;
        let defaultValue;
        if (param.type === 'Identifier') {
            name = param.name;
            optional = param.optional || false;
        }
        else if (param.type === 'AssignmentPattern') {
            name = param.left.name;
            optional = true;
            if (param.right.range) {
                defaultValue = code.substring(param.right.range[0], param.right.range[1]);
            }
        }
        else if (param.type === 'RestElement') {
            name = `...${param.argument.name}`;
        }
        return {
            name,
            type: extractTypeAnnotation(param.typeAnnotation),
            optional,
            defaultValue,
        };
    });
}
/**
 * Extract type annotation as string
 */
function extractTypeAnnotation(typeAnnotation) {
    if (!typeAnnotation)
        return null;
    const typeNode = typeAnnotation.typeAnnotation || typeAnnotation;
    if (!typeNode)
        return null;
    switch (typeNode.type) {
        case 'TSStringKeyword':
            return 'string';
        case 'TSNumberKeyword':
            return 'number';
        case 'TSBooleanKeyword':
            return 'boolean';
        case 'TSVoidKeyword':
            return 'void';
        case 'TSAnyKeyword':
            return 'any';
        case 'TSArrayType':
            const elementType = extractTypeAnnotation(typeNode.elementType);
            return elementType ? `${elementType}[]` : 'any[]';
        case 'TSTypeReference':
            return typeNode.typeName.name || 'unknown';
        case 'TSUnionType':
            return typeNode.types
                .map((t) => extractTypeAnnotation(t))
                .filter((t) => t)
                .join(' | ');
        default:
            return 'any';
    }
}
/**
 * Extract return type
 */
function extractReturnType(node) {
    return extractTypeAnnotation(node.returnType);
}
/**
 * Calculate cyclomatic complexity
 */
function calculateComplexity(node) {
    let complexity = 1;
    function countPaths(n) {
        if (!n || typeof n !== 'object')
            return;
        // Increment for control flow statements
        const complexityNodes = [
            'IfStatement',
            'WhileStatement',
            'ForStatement',
            'ForInStatement',
            'ForOfStatement',
            'ConditionalExpression',
            'SwitchCase',
            'CatchClause',
        ];
        if (complexityNodes.includes(n.type)) {
            complexity++;
        }
        if (n.type === 'LogicalExpression' && (n.operator === '&&' || n.operator === '||')) {
            complexity++;
        }
        // Recursively count
        for (const key in n) {
            const child = n[key];
            if (child && typeof child === 'object') {
                if (Array.isArray(child)) {
                    child.forEach(countPaths);
                }
                else if (child.type) {
                    countPaths(child);
                }
            }
        }
    }
    countPaths(node);
    return complexity;
}
/**
 * Check if node has JSDoc/TSDoc comment
 */
function hasLeadingComment(node, code) {
    if (!node.loc || !node.range)
        return false;
    const startPos = node.range[0];
    const precedingText = code.substring(Math.max(0, startPos - 300), startPos);
    // Check for JSDoc/TSDoc comment (/** ... */)
    return /\/\*\*[\s\S]*?\*\/\s*$/.test(precedingText);
}
/**
 * Extract existing documentation
 */
function extractExistingDocs(node, code) {
    if (!hasLeadingComment(node, code))
        return undefined;
    const startPos = node.range[0];
    const precedingText = code.substring(Math.max(0, startPos - 500), startPos);
    const match = precedingText.match(/\/\*\*([\s\S]*?)\*\/\s*$/);
    return match ? match[0] : undefined;
}
/**
 * Extract thrown exceptions from function body
 */
function extractThrows(node, code) {
    const throws = [];
    function findThrows(n) {
        if (!n || typeof n !== 'object')
            return;
        if (n.type === 'ThrowStatement' && n.argument) {
            if (n.argument.type === 'NewExpression' && n.argument.callee) {
                throws.push(n.argument.callee.name || 'Error');
            }
            else {
                throws.push('Error');
            }
        }
        for (const key in n) {
            const child = n[key];
            if (child && typeof child === 'object') {
                if (Array.isArray(child)) {
                    child.forEach(findThrows);
                }
                else if (child.type) {
                    findThrows(child);
                }
            }
        }
    }
    findThrows(node);
    return [...new Set(throws)]; // Unique
}
/**
 * Check if node is exported
 */
function isExported(node) {
    // Simple heuristic - would need parent context for accurate detection
    return false; // TODO: Track export declarations
}
/**
 * Extract visibility modifier (public/private/protected)
 */
function extractVisibility(node) {
    if (node.accessibility) {
        return node.accessibility;
    }
    return 'public';
}
//# sourceMappingURL=typescript.js.map