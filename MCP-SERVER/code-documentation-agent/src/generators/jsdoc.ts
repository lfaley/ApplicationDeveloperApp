/**
 * JSDoc/TSDoc Generator
 * 
 * Generates JavaScript/TypeScript documentation in JSDoc or TSDoc format
 */

import type { FunctionInfo, ClassInfo, InterfaceInfo, GenerateOptions } from '../types.js';

/**
 * Generate JSDoc comment for a function
 */
export function generateJSDocForFunction(func: FunctionInfo, options: GenerateOptions): string {
  const lines: string[] = ['/**'];

  // Description
  if (options.includeDescription) {
    const description = inferFunctionDescription(func);
    lines.push(` * ${description}`);
    
    if (func.params.length > 0 || func.returnType || func.throws?.length) {
      lines.push(' *');
    }
  }

  // Parameters
  if (options.includeParams && func.params.length > 0) {
    func.params.forEach(param => {
      const type = param.type || 'any';
      const optional = param.optional ? ' (optional)' : '';
      const defaultVal = param.defaultValue ? ` (default: ${param.defaultValue})` : '';
      const paramDesc = inferParameterDescription(param.name, func.name);
      lines.push(` * @param {${type}} ${param.name}${optional}${defaultVal} - ${paramDesc}`);
    });
    
    if (func.returnType || func.throws?.length) {
      lines.push(' *');
    }
  }

  // Return type
  if (options.includeReturns && func.returnType && func.returnType !== 'void') {
    const returnDesc = inferReturnDescription(func);
    lines.push(` * @returns {${func.returnType}} ${returnDesc}`);
    
    if (func.throws?.length) {
      lines.push(' *');
    }
  }

  // Async indicator
  if (func.isAsync) {
    lines.push(' * @async');
  }

  // Throws/Exceptions
  if (options.includeThrows && func.throws && func.throws.length > 0) {
    lines.push(' *');
    func.throws.forEach(ex => {
      lines.push(` * @throws {${ex}} When ${inferThrowCondition(ex, func)}`);
    });
  }

  // Example
  if (options.includeExamples) {
    lines.push(' *');
    lines.push(' * @example');
    const example = generateFunctionExample(func);
    example.split('\n').forEach(line => {
      lines.push(` * ${line}`);
    });
  }

  lines.push(' */');
  return lines.join('\n');
}

/**
 * Generate JSDoc comment for a class
 */
export function generateJSDocForClass(cls: ClassInfo, options: GenerateOptions): string {
  const lines: string[] = ['/**'];

  // Description
  if (options.includeDescription) {
    const description = inferClassDescription(cls);
    lines.push(` * ${description}`);
    lines.push(' *');
  }

  // Properties summary
  if (cls.properties.length > 0) {
    lines.push(' * @class');
    lines.push(' *');
  }

  // Example
  if (options.includeExamples) {
    lines.push(' * @example');
    const example = generateClassExample(cls);
    example.split('\n').forEach(line => {
      lines.push(` * ${line}`);
    });
  }

  lines.push(' */');
  return lines.join('\n');
}

/**
 * Generate JSDoc comment for an interface
 */
export function generateJSDocForInterface(iface: InterfaceInfo, options: GenerateOptions): string {
  const lines: string[] = ['/**'];

  // Description
  if (options.includeDescription) {
    const description = inferInterfaceDescription(iface);
    lines.push(` * ${description}`);
    lines.push(' *');
  }

  // Interface tag
  lines.push(' * @interface');

  // Properties
  if (iface.properties.length > 0) {
    lines.push(' *');
    iface.properties.forEach(prop => {
      const type = prop.type || 'any';
      const propDesc = inferPropertyDescription(prop.name);
      lines.push(` * @property {${type}} ${prop.name} - ${propDesc}`);
    });
  }

  lines.push(' */');
  return lines.join('\n');
}

/**
 * Infer function description from name and context
 */
function inferFunctionDescription(func: FunctionInfo): string {
  const name = func.name;
  
  // Convert camelCase/PascalCase to words
  const words = name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
    .toLowerCase();

  // Pattern-based inference
  if (name.startsWith('get')) {
    const subject = words.slice(4);
    return `Retrieves ${subject || 'the requested data'}`;
  }
  
  if (name.startsWith('set')) {
    const subject = words.slice(4);
    return `Sets ${subject || 'the specified value'}`;
  }
  
  if (name.startsWith('is') || name.startsWith('has') || name.startsWith('can')) {
    return `Checks if ${words.slice(name.startsWith('is') ? 3 : 4)}`;
  }
  
  if (name.startsWith('create')) {
    const subject = words.slice(7);
    return `Creates a new ${subject || 'instance'}`;
  }
  
  if (name.startsWith('delete') || name.startsWith('remove')) {
    const subject = words.slice(name.startsWith('delete') ? 7 : 7);
    return `Deletes ${subject || 'the specified item'}`;
  }
  
  if (name.startsWith('update')) {
    const subject = words.slice(7);
    return `Updates ${subject || 'the specified item'}`;
  }
  
  if (name.startsWith('calculate') || name.startsWith('compute')) {
    const subject = words.slice(10);
    return `Calculates ${subject || 'the result'}`;
  }
  
  if (name.startsWith('validate')) {
    const subject = words.slice(9);
    return `Validates ${subject || 'the input'}`;
  }
  
  if (name.startsWith('parse')) {
    const subject = words.slice(6);
    return `Parses ${subject || 'the input'}`;
  }
  
  if (name.startsWith('format')) {
    const subject = words.slice(7);
    return `Formats ${subject || 'the data'}`;
  }
  
  if (name.startsWith('find')) {
    const subject = words.slice(5);
    return `Finds ${subject || 'matching items'}`;
  }
  
  if (name.startsWith('filter')) {
    const subject = words.slice(7);
    return `Filters ${subject || 'the collection'}`;
  }
  
  if (name.startsWith('map')) {
    return `Maps ${words.slice(4) || 'items to a new form'}`;
  }
  
  if (name.startsWith('reduce')) {
    return `Reduces ${words.slice(7) || 'the collection to a single value'}`;
  }
  
  if (name === 'constructor') {
    return 'Creates an instance of the class';
  }
  
  // Default
  return `${name.charAt(0).toUpperCase() + name.slice(1)} function`;
}

/**
 * Infer parameter description
 */
function inferParameterDescription(paramName: string, funcName: string): string {
  // Common parameter patterns
  const name = paramName.toLowerCase();
  
  if (name === 'id') return 'The unique identifier';
  if (name === 'name') return 'The name';
  if (name === 'email') return 'The email address';
  if (name === 'password') return 'The password';
  if (name === 'username') return 'The username';
  if (name === 'token') return 'The authentication token';
  if (name === 'callback') return 'The callback function';
  if (name === 'options') return 'Configuration options';
  if (name === 'config') return 'Configuration object';
  if (name === 'data') return 'The data to process';
  if (name === 'value') return 'The value';
  if (name === 'index') return 'The index position';
  if (name === 'key') return 'The key';
  if (name === 'file') return 'The file path or object';
  if (name === 'path') return 'The file or directory path';
  if (name === 'url') return 'The URL';
  if (name === 'code') return 'The code to process';
  if (name === 'message') return 'The message';
  if (name === 'error') return 'The error object';
  
  // Pattern-based
  if (name.endsWith('id')) return `The ${name.slice(0, -2)} identifier`;
  if (name.endsWith('name')) return `The ${name.slice(0, -4)} name`;
  if (name.endsWith('path')) return `The ${name.slice(0, -4)} path`;
  if (name.endsWith('count')) return `The number of ${name.slice(0, -5)}`;
  if (name.endsWith('list') || name.endsWith('array')) return `Array of ${name.slice(0, -4)}`;
  
  // Convert camelCase to readable
  const readable = paramName
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .trim();
  
  return `The ${readable}`;
}

/**
 * Infer return description
 */
function inferReturnDescription(func: FunctionInfo): string {
  const name = func.name.toLowerCase();
  const returnType = func.returnType || 'any';
  
  if (name.startsWith('get')) return `The retrieved ${name.slice(3) || 'data'}`;
  if (name.startsWith('is') || name.startsWith('has') || name.startsWith('can')) {
    return `True if condition is met, false otherwise`;
  }
  if (name.startsWith('create')) return `The newly created ${name.slice(6) || 'object'}`;
  if (name.startsWith('calculate') || name.startsWith('compute')) {
    return `The calculated ${name.slice(9) || 'result'}`;
  }
  if (name.startsWith('find')) return `The found ${name.slice(4) || 'item'} or null`;
  if (name.startsWith('filter')) return `Filtered array of items`;
  if (name.startsWith('map')) return `Mapped array of items`;
  
  if (returnType === 'boolean') return 'True if successful, false otherwise';
  if (returnType === 'Promise') return 'Promise that resolves with the result';
  if (returnType.endsWith('[]')) return `Array of ${returnType.slice(0, -2)}`;
  
  return `The ${returnType} result`;
}

/**
 * Infer throw condition
 */
function inferThrowCondition(exceptionType: string, func: FunctionInfo): string {
  if (exceptionType === 'ValidationError') return 'input validation fails';
  if (exceptionType === 'NotFoundError') return 'the requested resource is not found';
  if (exceptionType === 'UnauthorizedError') return 'authentication fails';
  if (exceptionType === 'ForbiddenError') return 'user lacks required permissions';
  if (exceptionType === 'TypeError') return 'invalid type is provided';
  if (exceptionType === 'RangeError') return 'value is out of range';
  
  return 'an error condition occurs';
}

/**
 * Infer class description
 */
function inferClassDescription(cls: ClassInfo): string {
  const name = cls.name;
  const words = name.replace(/([A-Z])/g, ' $1').trim();
  
  if (name.endsWith('Service')) return `Service for managing ${words.slice(0, -7).toLowerCase()}`;
  if (name.endsWith('Controller')) return `Controller for handling ${words.slice(0, -10).toLowerCase()} requests`;
  if (name.endsWith('Repository')) return `Repository for ${words.slice(0, -10).toLowerCase()} data access`;
  if (name.endsWith('Manager')) return `Manager for ${words.slice(0, -7).toLowerCase()} operations`;
  if (name.endsWith('Helper')) return `Helper class for ${words.slice(0, -6).toLowerCase()} utilities`;
  if (name.endsWith('Validator')) return `Validator for ${words.slice(0, -9).toLowerCase()}`;
  if (name.endsWith('Builder')) return `Builder for constructing ${words.slice(0, -7).toLowerCase()}`;
  if (name.endsWith('Factory')) return `Factory for creating ${words.slice(0, -7).toLowerCase()} instances`;
  
  return `${name} class`;
}

/**
 * Infer interface description
 */
function inferInterfaceDescription(iface: InterfaceInfo): string {
  const name = iface.name;
  const words = name.replace(/([A-Z])/g, ' $1').trim();
  
  if (name.endsWith('Config')) return `Configuration for ${words.slice(0, -6).toLowerCase()}`;
  if (name.endsWith('Options')) return `Options for ${words.slice(0, -7).toLowerCase()}`;
  if (name.endsWith('Props')) return `Props for ${words.slice(0, -5).toLowerCase()} component`;
  if (name.endsWith('State')) return `State for ${words.slice(0, -5).toLowerCase()}`;
  if (name.endsWith('Response')) return `Response from ${words.slice(0, -8).toLowerCase()}`;
  if (name.endsWith('Request')) return `Request for ${words.slice(0, -7).toLowerCase()}`;
  
  return `${name} interface`;
}

/**
 * Infer property description
 */
function inferPropertyDescription(propName: string): string {
  const name = propName.toLowerCase();
  
  if (name === 'id') return 'Unique identifier';
  if (name === 'name') return 'Name';
  if (name === 'email') return 'Email address';
  if (name === 'createdAt') return 'Creation timestamp';
  if (name === 'updatedAt') return 'Last update timestamp';
  if (name === 'isActive') return 'Active status';
  if (name === 'isDeleted') return 'Deletion status';
  
  const readable = propName
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .trim();
  
  return `The ${readable}`;
}

/**
 * Generate function usage example
 */
function generateFunctionExample(func: FunctionInfo): string {
  const args = func.params.map(p => {
    if (p.type === 'string') return `'${p.name}'`;
    if (p.type === 'number') return '42';
    if (p.type === 'boolean') return 'true';
    if (p.type?.endsWith('[]')) return '[]';
    if (p.defaultValue) return p.defaultValue;
    return p.name;
  }).join(', ');
  
  if (func.isAsync) {
    return `const result = await ${func.name}(${args});\nconsole.log(result);`;
  }
  
  if (func.returnType && func.returnType !== 'void') {
    return `const result = ${func.name}(${args});\nconsole.log(result);`;
  }
  
  return `${func.name}(${args});`;
}

/**
 * Generate class usage example
 */
function generateClassExample(cls: ClassInfo): string {
  const ctorParams = cls.methods
    .find(m => m.name === 'constructor')
    ?.params.map(p => p.name)
    .join(', ') || '';
  
  return `const instance = new ${cls.name}(${ctorParams});\n// Use instance methods and properties`;
}
