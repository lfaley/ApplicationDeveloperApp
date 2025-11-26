/**
 * C# XML Documentation Generator
 *
 * Generates C# XML documentation comments (/// style)
 */
/**
 * Generate XML documentation for a function/method
 */
export function generateXmlDocForFunction(funcInfo, options) {
    const lines = [];
    // Summary
    if (options.includeDescription) {
        const description = options.inferDescriptions
            ? inferFunctionDescription(funcInfo)
            : options.descriptionTemplate || 'Method description';
        lines.push('/// <summary>');
        lines.push(`/// ${description}`);
        lines.push('/// </summary>');
    }
    // Parameters
    if (options.includeParams && funcInfo.params.length > 0) {
        funcInfo.params.forEach(param => {
            const paramDesc = inferParameterDescription(param.name);
            lines.push(`/// <param name="${param.name}">${paramDesc}</param>`);
        });
    }
    // Return value
    if (options.includeReturns && funcInfo.returnType && funcInfo.returnType !== 'void') {
        const returnDesc = inferReturnDescription(funcInfo);
        lines.push(`/// <returns>${returnDesc}</returns>`);
    }
    // Exceptions
    if (options.includeThrows && funcInfo.throws && funcInfo.throws.length > 0) {
        funcInfo.throws.forEach(ex => {
            const condition = inferThrowCondition(ex);
            lines.push(`/// <exception cref="${ex}">${condition}</exception>`);
        });
    }
    // Example
    if (options.includeExamples) {
        lines.push('/// <example>');
        lines.push('/// <code>');
        const example = generateFunctionExample(funcInfo);
        lines.push(`/// ${example}`);
        lines.push('/// </code>');
        lines.push('/// </example>');
    }
    // Remarks (for complex methods)
    if (funcInfo.complexity > 10) {
        lines.push('/// <remarks>');
        lines.push('/// This method has high complexity and may benefit from refactoring.');
        lines.push('/// </remarks>');
    }
    return lines.join('\n');
}
/**
 * Generate XML documentation for a class
 */
export function generateXmlDocForClass(classInfo, options) {
    const lines = [];
    // Summary
    if (options.includeDescription) {
        const description = options.inferDescriptions
            ? inferClassDescription(classInfo)
            : options.descriptionTemplate || 'Class description';
        lines.push('/// <summary>');
        lines.push(`/// ${description}`);
        lines.push('/// </summary>');
    }
    return lines.join('\n');
}
/**
 * Generate XML documentation for an interface
 */
export function generateXmlDocForInterface(interfaceInfo, options) {
    const lines = [];
    // Summary
    if (options.includeDescription) {
        const description = options.inferDescriptions
            ? inferInterfaceDescription(interfaceInfo)
            : options.descriptionTemplate || 'Interface description';
        lines.push('/// <summary>');
        lines.push(`/// ${description}`);
        lines.push('/// </summary>');
    }
    return lines.join('\n');
}
/**
 * Generate XML documentation for a property
 */
export function generateXmlDocForProperty(propertyInfo, options) {
    const lines = [];
    // Summary
    if (options.includeDescription) {
        const description = options.inferDescriptions
            ? inferPropertyDescription(propertyInfo.name)
            : options.descriptionTemplate || 'Property description';
        lines.push('/// <summary>');
        lines.push(`/// ${description}`);
        lines.push('/// </summary>');
    }
    // Value (for properties)
    const valueDesc = inferPropertyValueDescription(propertyInfo.name);
    lines.push(`/// <value>${valueDesc}</value>`);
    return lines.join('\n');
}
/**
 * Infer function description from name
 */
function inferFunctionDescription(funcInfo) {
    const name = funcInfo.name;
    // Convert PascalCase to words
    const words = name.replace(/([A-Z])/g, ' $1').trim();
    // Common C# patterns
    if (name.startsWith('Get')) {
        return `Gets ${words.slice(4).toLowerCase()}`;
    }
    if (name.startsWith('Set')) {
        return `Sets ${words.slice(4).toLowerCase()}`;
    }
    if (name.startsWith('Is') || name.startsWith('Has') || name.startsWith('Can')) {
        return `Determines whether ${words.slice(name.indexOf(' ')).toLowerCase()}`;
    }
    if (name.startsWith('Calculate') || name.startsWith('Compute')) {
        return `Calculates ${words.slice(name.indexOf(' ')).toLowerCase()}`;
    }
    if (name.startsWith('Validate')) {
        return `Validates ${words.slice(9).toLowerCase()}`;
    }
    if (name.startsWith('Parse')) {
        return `Parses ${words.slice(6).toLowerCase()}`;
    }
    if (name.startsWith('Format')) {
        return `Formats ${words.slice(7).toLowerCase()}`;
    }
    if (name.startsWith('Build') || name.startsWith('Create')) {
        return `Creates ${words.slice(name.indexOf(' ')).toLowerCase()}`;
    }
    if (name.startsWith('Delete') || name.startsWith('Remove')) {
        return `Deletes ${words.slice(name.indexOf(' ')).toLowerCase()}`;
    }
    if (name.startsWith('Update')) {
        return `Updates ${words.slice(7).toLowerCase()}`;
    }
    if (name.startsWith('Find') || name.startsWith('Search')) {
        return `Finds ${words.slice(name.indexOf(' ')).toLowerCase()}`;
    }
    if (name.startsWith('Load')) {
        return `Loads ${words.slice(5).toLowerCase()}`;
    }
    if (name.startsWith('Save')) {
        return `Saves ${words.slice(5).toLowerCase()}`;
    }
    if (name.startsWith('Process') || name.startsWith('Handle')) {
        return `Processes ${words.slice(name.indexOf(' ')).toLowerCase()}`;
    }
    if (name.startsWith('Generate')) {
        return `Generates ${words.slice(9).toLowerCase()}`;
    }
    if (name.startsWith('Initialize')) {
        return 'Initializes a new instance';
    }
    if (name.startsWith('Dispose')) {
        return 'Releases unmanaged resources';
    }
    if (name.startsWith('ToString')) {
        return 'Returns a string representation of this instance';
    }
    if (name.startsWith('Equals')) {
        return 'Determines whether the specified object is equal to this instance';
    }
    if (name.startsWith('GetHashCode')) {
        return 'Returns a hash code for this instance';
    }
    if (name.startsWith('Clone')) {
        return 'Creates a copy of this instance';
    }
    if (name.startsWith('CompareTo')) {
        return 'Compares this instance to another object';
    }
    if (name.endsWith('Async')) {
        return `Asynchronously ${words.slice(0, -6).toLowerCase()}`;
    }
    return `${words}`;
}
/**
 * Infer parameter description from name
 */
function inferParameterDescription(paramName) {
    const lower = paramName.toLowerCase();
    // Common parameter patterns
    if (lower === 'id') {
        return 'The unique identifier';
    }
    if (lower.endsWith('id')) {
        return 'The identifier';
    }
    if (lower === 'name') {
        return 'The name';
    }
    if (lower.endsWith('name')) {
        return 'The name value';
    }
    if (lower === 'value') {
        return 'The value';
    }
    if (lower === 'data') {
        return 'The data to process';
    }
    if (lower === 'config' || lower === 'configuration') {
        return 'The configuration settings';
    }
    if (lower === 'options') {
        return 'The options';
    }
    if (lower === 'settings') {
        return 'The settings';
    }
    if (lower === 'parameters' || lower === 'params') {
        return 'The parameters';
    }
    if (lower === 'callback') {
        return 'The callback function';
    }
    if (lower === 'action') {
        return 'The action to execute';
    }
    if (lower === 'func' || lower === 'function') {
        return 'The function to execute';
    }
    if (lower === 'predicate') {
        return 'The predicate condition';
    }
    if (lower === 'file' || lower === 'filepath') {
        return 'The file path';
    }
    if (lower === 'path') {
        return 'The path';
    }
    if (lower === 'url' || lower === 'uri') {
        return 'The URL';
    }
    if (lower === 'connection' || lower === 'connectionstring') {
        return 'The connection string';
    }
    if (lower === 'message') {
        return 'The message';
    }
    if (lower === 'error' || lower === 'exception') {
        return 'The error or exception';
    }
    if (lower === 'index') {
        return 'The zero-based index';
    }
    if (lower === 'count') {
        return 'The count';
    }
    if (lower === 'length' || lower === 'size') {
        return 'The length';
    }
    if (lower === 'capacity') {
        return 'The capacity';
    }
    if (lower === 'timeout') {
        return 'The timeout duration';
    }
    if (lower === 'delay') {
        return 'The delay duration';
    }
    if (lower === 'retries' || lower === 'retrycount') {
        return 'The number of retry attempts';
    }
    if (lower === 'cancellationtoken' || lower === 'token') {
        return 'The cancellation token';
    }
    if (lower.startsWith('is') || lower.startsWith('has') || lower.startsWith('can') || lower.startsWith('should')) {
        return 'A value indicating whether the operation should proceed';
    }
    if (lower.endsWith('list') || lower.endsWith('collection') || lower.endsWith('array')) {
        return 'The collection of items';
    }
    if (lower.endsWith('dictionary') || lower.endsWith('map')) {
        return 'The dictionary mapping';
    }
    if (lower === 'source') {
        return 'The source';
    }
    if (lower === 'destination' || lower === 'target') {
        return 'The destination';
    }
    if (lower === 'key') {
        return 'The key';
    }
    if (lower === 'type') {
        return 'The type';
    }
    if (lower === 'format') {
        return 'The format string';
    }
    if (lower === 'provider') {
        return 'The format provider';
    }
    if (lower === 'culture' || lower === 'cultureinfo') {
        return 'The culture information';
    }
    if (lower === 'encoding') {
        return 'The character encoding';
    }
    if (lower === 'comparer') {
        return 'The comparer';
    }
    if (lower === 'selector') {
        return 'The selector function';
    }
    return `The ${paramName} parameter`;
}
/**
 * Infer return description from function name and type
 */
function inferReturnDescription(funcInfo) {
    const name = funcInfo.name;
    const returnType = funcInfo.returnType || 'object';
    if (name.startsWith('Get')) {
        return `The ${name.slice(3).replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`;
    }
    if (name.startsWith('Is') || name.startsWith('Has') || name.startsWith('Can')) {
        return 'true if the condition is met; otherwise, false';
    }
    if (name.startsWith('Calculate') || name.startsWith('Compute')) {
        return `The calculated ${returnType.toLowerCase()}`;
    }
    if (name.startsWith('Parse')) {
        return `The parsed ${returnType}`;
    }
    if (name.startsWith('Format')) {
        return 'The formatted string';
    }
    if (name.startsWith('Build') || name.startsWith('Create')) {
        return `The created ${returnType}`;
    }
    if (name.startsWith('Find') || name.startsWith('Search')) {
        return `The found ${returnType} or null`;
    }
    if (name.startsWith('Load')) {
        return `The loaded ${returnType}`;
    }
    if (name.startsWith('ToString')) {
        return 'A string representation';
    }
    if (name.startsWith('GetHashCode')) {
        return 'A hash code for this instance';
    }
    if (name.startsWith('Clone')) {
        return 'A copy of this instance';
    }
    if (name.startsWith('CompareTo')) {
        return 'A value indicating the relative order';
    }
    if (name.endsWith('Async')) {
        return `A task representing the asynchronous operation`;
    }
    if (returnType.toLowerCase().includes('task')) {
        return 'A task representing the asynchronous operation';
    }
    return `The ${returnType}`;
}
/**
 * Infer exception condition
 */
function inferThrowCondition(exceptionName) {
    const lower = exceptionName.toLowerCase();
    if (lower.includes('argumentnull')) {
        return 'Thrown when a required argument is null';
    }
    if (lower.includes('argumentoutofrange')) {
        return 'Thrown when an argument is outside the valid range';
    }
    if (lower.includes('argument')) {
        return 'Thrown when an argument is invalid';
    }
    if (lower.includes('invalidoperation')) {
        return 'Thrown when the operation is invalid for the current state';
    }
    if (lower.includes('notimplemented')) {
        return 'Thrown when the method is not implemented';
    }
    if (lower.includes('notsupported')) {
        return 'Thrown when the operation is not supported';
    }
    if (lower.includes('objectdisposed')) {
        return 'Thrown when the object has been disposed';
    }
    if (lower.includes('nullreference')) {
        return 'Thrown when a null reference is encountered';
    }
    if (lower.includes('indexoutofrange')) {
        return 'Thrown when an index is outside the bounds of the array';
    }
    if (lower.includes('keynotfound')) {
        return 'Thrown when the key is not found in the collection';
    }
    if (lower.includes('filenotfound')) {
        return 'Thrown when the file cannot be found';
    }
    if (lower.includes('directorynotfound')) {
        return 'Thrown when the directory cannot be found';
    }
    if (lower.includes('io')) {
        return 'Thrown when an I/O error occurs';
    }
    if (lower.includes('unauthorized')) {
        return 'Thrown when access is denied';
    }
    if (lower.includes('timeout')) {
        return 'Thrown when the operation times out';
    }
    if (lower.includes('format')) {
        return 'Thrown when the format is invalid';
    }
    if (lower.includes('overflow')) {
        return 'Thrown when an arithmetic overflow occurs';
    }
    if (lower.includes('dividebyzero')) {
        return 'Thrown when division by zero is attempted';
    }
    if (lower.includes('sql')) {
        return 'Thrown when a database error occurs';
    }
    if (lower.includes('http')) {
        return 'Thrown when an HTTP error occurs';
    }
    if (lower.includes('serialization')) {
        return 'Thrown when serialization fails';
    }
    return `Thrown when ${exceptionName.replace(/Exception$/, '').replace(/([A-Z])/g, ' $1').trim().toLowerCase()} occurs`;
}
/**
 * Generate example usage
 */
function generateFunctionExample(funcInfo) {
    const args = funcInfo.params.map(p => {
        if (p.type?.toLowerCase().includes('string'))
            return '"example"';
        if (p.type?.toLowerCase().includes('int') || p.type?.toLowerCase().includes('long'))
            return '42';
        if (p.type?.toLowerCase().includes('double') || p.type?.toLowerCase().includes('decimal'))
            return '3.14';
        if (p.type?.toLowerCase().includes('bool'))
            return 'true';
        if (p.type?.toLowerCase().includes('list') || p.type?.toLowerCase().includes('array'))
            return 'new[]{}';
        if (p.type?.toLowerCase().includes('dictionary'))
            return 'new Dictionary<,>()';
        return 'value';
    }).join(', ');
    const hasReturn = funcInfo.returnType && funcInfo.returnType !== 'void';
    const prefix = hasReturn ? 'var result = ' : '';
    const asyncPrefix = funcInfo.isAsync ? 'await ' : '';
    return `${prefix}${asyncPrefix}${funcInfo.name}(${args});`;
}
/**
 * Infer class description
 */
function inferClassDescription(classInfo) {
    const name = classInfo.name;
    if (name.endsWith('Service')) {
        return `Provides services for ${name.slice(0, -7).replace(/([A-Z])/g, ' $1').trim().toLowerCase()} operations`;
    }
    if (name.endsWith('Controller')) {
        return `Handles ${name.slice(0, -10).replace(/([A-Z])/g, ' $1').trim().toLowerCase()} requests`;
    }
    if (name.endsWith('Manager')) {
        return `Manages ${name.slice(0, -7).replace(/([A-Z])/g, ' $1').trim().toLowerCase()} operations`;
    }
    if (name.endsWith('Handler')) {
        return `Handles ${name.slice(0, -7).replace(/([A-Z])/g, ' $1').trim().toLowerCase()} events`;
    }
    if (name.endsWith('Builder')) {
        return `Builds ${name.slice(0, -7).replace(/([A-Z])/g, ' $1').trim().toLowerCase()} objects`;
    }
    if (name.endsWith('Factory')) {
        return `Creates ${name.slice(0, -7).replace(/([A-Z])/g, ' $1').trim().toLowerCase()} instances`;
    }
    if (name.endsWith('Repository')) {
        return `Provides data access for ${name.slice(0, -10).replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`;
    }
    if (name.endsWith('Provider')) {
        return `Provides ${name.slice(0, -8).replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`;
    }
    if (name.endsWith('Validator')) {
        return `Validates ${name.slice(0, -9).replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`;
    }
    if (name.endsWith('Converter') || name.endsWith('Adapter')) {
        return `Converts ${name.slice(0, -9).replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`;
    }
    if (name.endsWith('Exception')) {
        return `Exception thrown when ${name.slice(0, -9).replace(/([A-Z])/g, ' $1').trim().toLowerCase()} occurs`;
    }
    if (name.endsWith('Attribute')) {
        return `Attribute for ${name.slice(0, -9).replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`;
    }
    return `Represents ${name.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`;
}
/**
 * Infer interface description
 */
function inferInterfaceDescription(interfaceInfo) {
    const name = interfaceInfo.name;
    // Remove leading 'I' from interface names
    const baseName = name.startsWith('I') && name.length > 1 && name[1] === name[1].toUpperCase()
        ? name.slice(1)
        : name;
    if (baseName.endsWith('Service')) {
        return `Defines a contract for ${baseName.slice(0, -7).replace(/([A-Z])/g, ' $1').trim().toLowerCase()} services`;
    }
    if (baseName.endsWith('Repository')) {
        return `Defines a contract for ${baseName.slice(0, -10).replace(/([A-Z])/g, ' $1').trim().toLowerCase()} data access`;
    }
    if (baseName.endsWith('Provider')) {
        return `Defines a contract for ${baseName.slice(0, -8).replace(/([A-Z])/g, ' $1').trim().toLowerCase()} providers`;
    }
    if (baseName.endsWith('Factory')) {
        return `Defines a contract for creating ${baseName.slice(0, -7).replace(/([A-Z])/g, ' $1').trim().toLowerCase()} instances`;
    }
    if (baseName.endsWith('Builder')) {
        return `Defines a contract for building ${baseName.slice(0, -7).replace(/([A-Z])/g, ' $1').trim().toLowerCase()} objects`;
    }
    if (baseName.endsWith('Handler')) {
        return `Defines a contract for handling ${baseName.slice(0, -7).replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`;
    }
    if (baseName.endsWith('Validator')) {
        return `Defines a contract for validating ${baseName.slice(0, -9).replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`;
    }
    if (baseName.endsWith('Converter')) {
        return `Defines a contract for converting ${baseName.slice(0, -9).replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`;
    }
    return `Defines a contract for ${baseName.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`;
}
/**
 * Infer property description
 */
function inferPropertyDescription(propName) {
    return inferParameterDescription(propName);
}
/**
 * Infer property value description
 */
function inferPropertyValueDescription(propName) {
    const lower = propName.toLowerCase();
    if (lower.startsWith('is') || lower.startsWith('has') || lower.startsWith('can')) {
        return 'true if the condition is met; otherwise, false';
    }
    if (lower.endsWith('count')) {
        return 'The number of items';
    }
    if (lower.endsWith('length') || lower.endsWith('size')) {
        return 'The length';
    }
    if (lower.endsWith('capacity')) {
        return 'The capacity';
    }
    return `The ${propName.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`;
}
//# sourceMappingURL=xmldoc.js.map