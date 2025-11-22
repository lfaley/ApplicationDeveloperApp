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
export function generateDocstringForFunction(
  funcInfo: FunctionInfo,
  options: GenerateOptions,
  style: DocstringStyle = 'google'
): string {
  if (style === 'google') {
    return generateGoogleDocstring(funcInfo, options);
  } else if (style === 'numpy') {
    return generateNumpyDocstring(funcInfo, options);
  } else {
    return generateSphinxDocstring(funcInfo, options);
  }
}

/**
 * Generate Google-style docstring
 * Example:
 * """
 * Brief description.
 * 
 * Longer description.
 * 
 * Args:
 *     param1 (str): Description
 *     param2 (int, optional): Description. Defaults to 0.
 * 
 * Returns:
 *     bool: Description
 * 
 * Raises:
 *     ValueError: Description
 * """
 */
function generateGoogleDocstring(funcInfo: FunctionInfo, options: GenerateOptions): string {
  const lines: string[] = ['"""'];
  
  // Description
  if (options.includeDescription) {
    const description = options.inferDescriptions
      ? inferFunctionDescription(funcInfo)
      : options.descriptionTemplate || 'Function description';
    lines.push(description);
  }
  
  // Parameters
  if (options.includeParams && funcInfo.params.length > 0) {
    lines.push('');
    lines.push('Args:');
    funcInfo.params.forEach(param => {
      const typeStr = param.type || 'Any';
      const optional = param.optional ? ', optional' : '';
      const defaultStr = param.defaultValue ? `. Defaults to ${param.defaultValue}` : '';
      const paramDesc = inferParameterDescription(param.name);
      lines.push(`    ${param.name} (${typeStr}${optional}): ${paramDesc}${defaultStr}`);
    });
  }
  
  // Return type
  if (options.includeReturns && funcInfo.returnType && funcInfo.returnType !== 'void' && funcInfo.returnType !== 'None') {
    lines.push('');
    lines.push('Returns:');
    const returnDesc = inferReturnDescription(funcInfo);
    lines.push(`    ${funcInfo.returnType}: ${returnDesc}`);
  }
  
  // Exceptions
  if (options.includeThrows && funcInfo.throws && funcInfo.throws.length > 0) {
    lines.push('');
    lines.push('Raises:');
    funcInfo.throws.forEach(ex => {
      const condition = inferThrowCondition(ex);
      lines.push(`    ${ex}: ${condition}`);
    });
  }
  
  // Example
  if (options.includeExamples) {
    lines.push('');
    lines.push('Example:');
    const example = generateFunctionExample(funcInfo);
    lines.push(`    ${example}`);
  }
  
  lines.push('"""');
  return lines.join('\n');
}

/**
 * Generate NumPy-style docstring
 * Example:
 * """
 * Brief description.
 * 
 * Longer description.
 * 
 * Parameters
 * ----------
 * param1 : str
 *     Description
 * param2 : int, optional
 *     Description (default is 0)
 * 
 * Returns
 * -------
 * bool
 *     Description
 * 
 * Raises
 * ------
 * ValueError
 *     Description
 * """
 */
function generateNumpyDocstring(funcInfo: FunctionInfo, options: GenerateOptions): string {
  const lines: string[] = ['"""'];
  
  // Description
  if (options.includeDescription) {
    const description = options.inferDescriptions
      ? inferFunctionDescription(funcInfo)
      : options.descriptionTemplate || 'Function description';
    lines.push(description);
  }
  
  // Parameters
  if (options.includeParams && funcInfo.params.length > 0) {
    lines.push('');
    lines.push('Parameters');
    lines.push('----------');
    funcInfo.params.forEach(param => {
      const typeStr = param.type || 'Any';
      const optional = param.optional ? ', optional' : '';
      const defaultStr = param.defaultValue ? ` (default is ${param.defaultValue})` : '';
      const paramDesc = inferParameterDescription(param.name);
      lines.push(`${param.name} : ${typeStr}${optional}`);
      lines.push(`    ${paramDesc}${defaultStr}`);
    });
  }
  
  // Return type
  if (options.includeReturns && funcInfo.returnType && funcInfo.returnType !== 'void' && funcInfo.returnType !== 'None') {
    lines.push('');
    lines.push('Returns');
    lines.push('-------');
    const returnDesc = inferReturnDescription(funcInfo);
    lines.push(`${funcInfo.returnType}`);
    lines.push(`    ${returnDesc}`);
  }
  
  // Exceptions
  if (options.includeThrows && funcInfo.throws && funcInfo.throws.length > 0) {
    lines.push('');
    lines.push('Raises');
    lines.push('------');
    funcInfo.throws.forEach(ex => {
      const condition = inferThrowCondition(ex);
      lines.push(`${ex}`);
      lines.push(`    ${condition}`);
    });
  }
  
  // Example
  if (options.includeExamples) {
    lines.push('');
    lines.push('Examples');
    lines.push('--------');
    const example = generateFunctionExample(funcInfo);
    lines.push(`>>> ${example}`);
  }
  
  lines.push('"""');
  return lines.join('\n');
}

/**
 * Generate Sphinx-style docstring
 * Example:
 * """
 * Brief description.
 * 
 * Longer description.
 * 
 * :param param1: Description
 * :type param1: str
 * :param param2: Description
 * :type param2: int, optional
 * :return: Description
 * :rtype: bool
 * :raises ValueError: Description
 * """
 */
function generateSphinxDocstring(funcInfo: FunctionInfo, options: GenerateOptions): string {
  const lines: string[] = ['"""'];
  
  // Description
  if (options.includeDescription) {
    const description = options.inferDescriptions
      ? inferFunctionDescription(funcInfo)
      : options.descriptionTemplate || 'Function description';
    lines.push(description);
  }
  
  // Parameters
  if (options.includeParams && funcInfo.params.length > 0) {
    lines.push('');
    funcInfo.params.forEach(param => {
      const typeStr = param.type || 'Any';
      const optional = param.optional ? ', optional' : '';
      const paramDesc = inferParameterDescription(param.name);
      lines.push(`:param ${param.name}: ${paramDesc}`);
      lines.push(`:type ${param.name}: ${typeStr}${optional}`);
    });
  }
  
  // Return type
  if (options.includeReturns && funcInfo.returnType && funcInfo.returnType !== 'void' && funcInfo.returnType !== 'None') {
    lines.push('');
    const returnDesc = inferReturnDescription(funcInfo);
    lines.push(`:return: ${returnDesc}`);
    lines.push(`:rtype: ${funcInfo.returnType}`);
  }
  
  // Exceptions
  if (options.includeThrows && funcInfo.throws && funcInfo.throws.length > 0) {
    lines.push('');
    funcInfo.throws.forEach(ex => {
      const condition = inferThrowCondition(ex);
      lines.push(`:raises ${ex}: ${condition}`);
    });
  }
  
  // Example
  if (options.includeExamples) {
    lines.push('');
    lines.push('.. code-block:: python');
    lines.push('');
    const example = generateFunctionExample(funcInfo);
    lines.push(`    ${example}`);
  }
  
  lines.push('"""');
  return lines.join('\n');
}

/**
 * Infer function description from name and parameters
 */
function inferFunctionDescription(funcInfo: FunctionInfo): string {
  const name = funcInfo.name;
  
  // Convert snake_case to words
  const words = name.replace(/_/g, ' ');
  
  // Common Python patterns
  if (name.startsWith('get_')) {
    return `Get ${words.slice(4)}`;
  }
  if (name.startsWith('set_')) {
    return `Set ${words.slice(4)}`;
  }
  if (name.startsWith('is_') || name.startsWith('has_')) {
    return `Check if ${words.slice(3)}`;
  }
  if (name.startsWith('calculate_')) {
    return `Calculate ${words.slice(10)}`;
  }
  if (name.startsWith('compute_')) {
    return `Compute ${words.slice(8)}`;
  }
  if (name.startsWith('validate_')) {
    return `Validate ${words.slice(9)}`;
  }
  if (name.startsWith('parse_')) {
    return `Parse ${words.slice(6)}`;
  }
  if (name.startsWith('format_')) {
    return `Format ${words.slice(7)}`;
  }
  if (name.startsWith('build_')) {
    return `Build ${words.slice(6)}`;
  }
  if (name.startsWith('create_')) {
    return `Create ${words.slice(7)}`;
  }
  if (name.startsWith('delete_') || name.startsWith('remove_')) {
    return `Delete ${words.slice(7)}`;
  }
  if (name.startsWith('update_')) {
    return `Update ${words.slice(7)}`;
  }
  if (name.startsWith('fetch_')) {
    return `Fetch ${words.slice(6)}`;
  }
  if (name.startsWith('load_')) {
    return `Load ${words.slice(5)}`;
  }
  if (name.startsWith('save_')) {
    return `Save ${words.slice(5)}`;
  }
  if (name.startsWith('process_')) {
    return `Process ${words.slice(8)}`;
  }
  if (name.startsWith('handle_')) {
    return `Handle ${words.slice(7)}`;
  }
  if (name.startsWith('render_')) {
    return `Render ${words.slice(7)}`;
  }
  if (name.startsWith('generate_')) {
    return `Generate ${words.slice(9)}`;
  }
  if (name === '__init__') {
    return 'Initialize a new instance';
  }
  if (name === '__str__') {
    return 'Return string representation';
  }
  if (name === '__repr__') {
    return 'Return detailed representation for debugging';
  }
  if (name === '__len__') {
    return 'Return the length';
  }
  if (name === '__getitem__') {
    return 'Get item by key or index';
  }
  if (name === '__setitem__') {
    return 'Set item by key or index';
  }
  if (name === '__delitem__') {
    return 'Delete item by key or index';
  }
  if (name === '__iter__') {
    return 'Return an iterator';
  }
  if (name === '__next__') {
    return 'Get next item';
  }
  if (name === '__enter__') {
    return 'Enter the context manager';
  }
  if (name === '__exit__') {
    return 'Exit the context manager';
  }
  if (name === '__call__') {
    return 'Make instance callable';
  }
  
  // Capitalize first letter
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * Infer parameter description from name
 */
function inferParameterDescription(paramName: string): string {
  const name = paramName.toLowerCase().replace(/_/g, '');
  
  // Common parameter patterns
  if (name === 'self' || name === 'cls') {
    return 'Instance reference';
  }
  if (name === 'id' || name.endsWith('id')) {
    return 'Unique identifier';
  }
  if (name === 'name' || name.endsWith('name')) {
    return 'Name value';
  }
  if (name === 'email' || name.endsWith('email')) {
    return 'Email address';
  }
  if (name === 'password' || name.endsWith('password')) {
    return 'Password value';
  }
  if (name === 'username' || name.endsWith('username')) {
    return 'Username value';
  }
  if (name === 'token' || name.endsWith('token')) {
    return 'Authentication token';
  }
  if (name === 'key' || name.endsWith('key')) {
    return 'Key value';
  }
  if (name === 'value' || name.endsWith('value')) {
    return 'Value to process';
  }
  if (name === 'data' || name.endsWith('data')) {
    return 'Data to process';
  }
  if (name === 'config' || name.endsWith('config')) {
    return 'Configuration object';
  }
  if (name === 'options' || name.endsWith('options')) {
    return 'Options object';
  }
  if (name === 'callback' || name.endsWith('callback')) {
    return 'Callback function';
  }
  if (name === 'func' || name === 'function' || name.endsWith('fn')) {
    return 'Function to execute';
  }
  if (name === 'file' || name.endsWith('file')) {
    return 'File path or object';
  }
  if (name === 'path' || name.endsWith('path')) {
    return 'File system path';
  }
  if (name === 'url' || name.endsWith('url')) {
    return 'URL string';
  }
  if (name === 'code' || name.endsWith('code')) {
    return 'Code string';
  }
  if (name === 'message' || name.endsWith('message')) {
    return 'Message string';
  }
  if (name === 'error' || name.endsWith('error')) {
    return 'Error object';
  }
  if (name === 'index' || name.endsWith('index')) {
    return 'Index position';
  }
  if (name === 'count' || name.endsWith('count')) {
    return 'Count value';
  }
  if (name === 'size' || name.endsWith('size')) {
    return 'Size value';
  }
  if (name === 'length' || name.endsWith('length')) {
    return 'Length value';
  }
  if (name === 'timeout' || name.endsWith('timeout')) {
    return 'Timeout duration in seconds';
  }
  if (name === 'retries' || name.endsWith('retries')) {
    return 'Number of retry attempts';
  }
  if (name === 'verbose' || name.endsWith('verbose')) {
    return 'Enable verbose output';
  }
  if (name === 'debug' || name.endsWith('debug')) {
    return 'Enable debug mode';
  }
  if (name === 'force' || name.endsWith('force')) {
    return 'Force operation';
  }
  if (name.startsWith('is') || name.startsWith('has') || name.startsWith('should')) {
    return 'Boolean flag';
  }
  if (name.endsWith('s') || name.endsWith('list') || name.endsWith('array')) {
    return 'List of items';
  }
  if (name.endsWith('dict') || name.endsWith('map')) {
    return 'Dictionary mapping';
  }
  
  return `${paramName} parameter`;
}

/**
 * Infer return description from function name and type
 */
function inferReturnDescription(funcInfo: FunctionInfo): string {
  const name = funcInfo.name;
  const returnType = funcInfo.returnType || 'Any';
  
  if (name.startsWith('get_')) {
    return `The requested ${name.slice(4).replace(/_/g, ' ')}`;
  }
  if (name.startsWith('is_') || name.startsWith('has_')) {
    return 'True if condition is met, False otherwise';
  }
  if (name.startsWith('calculate_') || name.startsWith('compute_')) {
    return `Calculated ${name.slice(name.indexOf('_') + 1).replace(/_/g, ' ')}`;
  }
  if (name.startsWith('validate_')) {
    return 'True if validation passes, False otherwise';
  }
  if (name.startsWith('parse_')) {
    return `Parsed ${returnType}`;
  }
  if (name.startsWith('format_')) {
    return 'Formatted string';
  }
  if (name.startsWith('build_') || name.startsWith('create_')) {
    return `Created ${returnType}`;
  }
  if (name.startsWith('fetch_') || name.startsWith('load_')) {
    return `Loaded ${returnType}`;
  }
  if (name.startsWith('save_')) {
    return 'True if save successful, False otherwise';
  }
  if (name.startsWith('delete_') || name.startsWith('remove_')) {
    return 'True if deletion successful, False otherwise';
  }
  if (name.startsWith('update_')) {
    return 'Updated object';
  }
  if (name.startsWith('find_') || name.startsWith('search_')) {
    return 'Found items or None';
  }
  if (name.startsWith('filter_')) {
    return 'Filtered results';
  }
  if (name.startsWith('generate_')) {
    return `Generated ${returnType}`;
  }
  if (name === '__str__') {
    return 'String representation';
  }
  if (name === '__repr__') {
    return 'Detailed string representation';
  }
  if (name === '__len__') {
    return 'Number of items';
  }
  if (name === '__iter__') {
    return 'Iterator object';
  }
  
  return `${returnType} value`;
}

/**
 * Infer exception condition
 */
function inferThrowCondition(exceptionName: string): string {
  const lower = exceptionName.toLowerCase();
  
  if (lower.includes('value')) {
    return 'If the value is invalid or out of range';
  }
  if (lower.includes('type')) {
    return 'If the argument type is incorrect';
  }
  if (lower.includes('key') || lower.includes('attribute')) {
    return 'If the key does not exist';
  }
  if (lower.includes('index')) {
    return 'If the index is out of range';
  }
  if (lower.includes('notfound') || lower.includes('not_found')) {
    return 'If the resource is not found';
  }
  if (lower.includes('permission') || lower.includes('auth')) {
    return 'If permission is denied or authentication fails';
  }
  if (lower.includes('io') || lower.includes('file')) {
    return 'If an I/O operation fails';
  }
  if (lower.includes('connection') || lower.includes('network')) {
    return 'If a network or connection error occurs';
  }
  if (lower.includes('timeout')) {
    return 'If the operation times out';
  }
  if (lower.includes('runtime')) {
    return 'If a runtime error occurs';
  }
  if (lower.includes('overflow')) {
    return 'If a numeric overflow occurs';
  }
  if (lower.includes('zerodivision')) {
    return 'If division by zero is attempted';
  }
  if (lower.includes('memory')) {
    return 'If memory allocation fails';
  }
  if (lower.includes('assertion')) {
    return 'If an assertion fails';
  }
  
  return 'If an error condition occurs';
}

/**
 * Generate example usage
 */
function generateFunctionExample(funcInfo: FunctionInfo): string {
  const args = funcInfo.params
    .filter(p => p.name !== 'self' && p.name !== 'cls')
    .map(p => {
      if (p.type === 'str' || p.type === 'string') return `"example"`;
      if (p.type === 'int' || p.type === 'number') return '42';
      if (p.type === 'float') return '3.14';
      if (p.type === 'bool' || p.type === 'boolean') return 'True';
      if (p.type === 'list' || p.type?.includes('List')) return '[]';
      if (p.type === 'dict' || p.type?.includes('Dict')) return '{}';
      return 'value';
    })
    .join(', ');
  
  const hasReturn = funcInfo.returnType && funcInfo.returnType !== 'void' && funcInfo.returnType !== 'None';
  const prefix = hasReturn ? 'result = ' : '';
  
  return `${prefix}${funcInfo.name}(${args})`;
}

/**
 * Generate docstring for a class
 */
export function generateDocstringForClass(
  classInfo: ClassInfo,
  options: GenerateOptions,
  style: DocstringStyle = 'google'
): string {
  const lines: string[] = ['"""'];
  
  // Description
  if (options.includeDescription) {
    const description = options.inferDescriptions
      ? inferClassDescription(classInfo)
      : options.descriptionTemplate || 'Class description';
    lines.push(description);
  }
  
  // Attributes
  if (classInfo.properties && classInfo.properties.length > 0) {
    lines.push('');
    if (style === 'google') {
      lines.push('Attributes:');
      classInfo.properties.forEach(prop => {
        const typeStr = prop.type || 'Any';
        const propDesc = inferPropertyDescription(prop.name);
        lines.push(`    ${prop.name} (${typeStr}): ${propDesc}`);
      });
    } else if (style === 'numpy') {
      lines.push('Attributes');
      lines.push('----------');
      classInfo.properties.forEach(prop => {
        const typeStr = prop.type || 'Any';
        const propDesc = inferPropertyDescription(prop.name);
        lines.push(`${prop.name} : ${typeStr}`);
        lines.push(`    ${propDesc}`);
      });
    } else {
      classInfo.properties.forEach(prop => {
        const typeStr = prop.type || 'Any';
        const propDesc = inferPropertyDescription(prop.name);
        lines.push(`:ivar ${prop.name}: ${propDesc}`);
        lines.push(`:vartype ${prop.name}: ${typeStr}`);
      });
    }
  }
  
  lines.push('"""');
  return lines.join('\n');
}

/**
 * Infer class description
 */
function inferClassDescription(classInfo: ClassInfo): string {
  const name = classInfo.name;
  
  if (name.endsWith('Service')) {
    return `Service for ${name.slice(0, -7).replace(/_/g, ' ').toLowerCase()} operations`;
  }
  if (name.endsWith('Controller')) {
    return `Controller for handling ${name.slice(0, -10).replace(/_/g, ' ').toLowerCase()} requests`;
  }
  if (name.endsWith('Manager')) {
    return `Manager for ${name.slice(0, -7).replace(/_/g, ' ').toLowerCase()} operations`;
  }
  if (name.endsWith('Handler')) {
    return `Handler for ${name.slice(0, -7).replace(/_/g, ' ').toLowerCase()} events`;
  }
  if (name.endsWith('Builder')) {
    return `Builder for constructing ${name.slice(0, -7).replace(/_/g, ' ').toLowerCase()} objects`;
  }
  if (name.endsWith('Factory')) {
    return `Factory for creating ${name.slice(0, -7).replace(/_/g, ' ').toLowerCase()} instances`;
  }
  if (name.endsWith('Repository')) {
    return `Repository for ${name.slice(0, -10).replace(/_/g, ' ').toLowerCase()} data access`;
  }
  if (name.endsWith('Model')) {
    return `Data model for ${name.slice(0, -5).replace(/_/g, ' ').toLowerCase()}`;
  }
  if (name.endsWith('Exception') || name.endsWith('Error')) {
    return `Exception raised when ${name.replace(/Exception|Error/, '').replace(/_/g, ' ').toLowerCase()} occurs`;
  }
  
  return `${name.replace(/_/g, ' ')} class`;
}

/**
 * Infer property description
 */
function inferPropertyDescription(propName: string): string {
  return inferParameterDescription(propName);
}
