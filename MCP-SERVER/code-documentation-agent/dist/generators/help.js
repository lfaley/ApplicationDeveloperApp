/**
 * PowerShell Help Generator
 *
 * Generates PowerShell comment-based help
 */
/**
 * Generate PowerShell help comment for a function
 */
export function generateHelpForFunction(funcInfo, options) {
    const lines = ['<#'];
    // .SYNOPSIS
    lines.push('.SYNOPSIS');
    if (options.includeDescription) {
        const synopsis = options.inferDescriptions
            ? inferSynopsis(funcInfo)
            : options.descriptionTemplate || 'Function synopsis';
        lines.push(`    ${synopsis}`);
    }
    lines.push('');
    // .DESCRIPTION
    if (options.includeDescription) {
        const description = options.inferDescriptions
            ? inferDescription(funcInfo)
            : options.descriptionTemplate || 'Function description';
        lines.push('.DESCRIPTION');
        lines.push(`    ${description}`);
        lines.push('');
    }
    // .PARAMETER
    if (options.includeParams && funcInfo.params.length > 0) {
        funcInfo.params.forEach(param => {
            const paramDesc = inferParameterDescription(param.name);
            lines.push(`.PARAMETER ${param.name}`);
            lines.push(`    ${paramDesc}`);
            if (param.type) {
                lines.push(`    Type: ${param.type}`);
            }
            if (param.optional) {
                lines.push('    Required: False');
                if (param.defaultValue) {
                    lines.push(`    Default value: ${param.defaultValue}`);
                }
            }
            else {
                lines.push('    Required: True');
            }
            lines.push('');
        });
    }
    // .OUTPUTS
    if (options.includeReturns && funcInfo.returnType && funcInfo.returnType !== 'void') {
        lines.push('.OUTPUTS');
        lines.push(`    ${funcInfo.returnType}`);
        const outputDesc = inferOutputDescription(funcInfo);
        lines.push(`    ${outputDesc}`);
        lines.push('');
    }
    // .EXAMPLE
    if (options.includeExamples) {
        const examples = generateExamples(funcInfo);
        examples.forEach((example, index) => {
            lines.push('.EXAMPLE');
            lines.push(`    ${example.code}`);
            if (example.description) {
                lines.push(`    ${example.description}`);
            }
            if (index < examples.length - 1) {
                lines.push('');
            }
        });
        lines.push('');
    }
    // .NOTES
    lines.push('.NOTES');
    if (funcInfo.isAsync) {
        lines.push('    This function supports asynchronous execution.');
    }
    if (funcInfo.complexity > 10) {
        lines.push('    This function has high complexity.');
    }
    lines.push(`    Complexity: ${funcInfo.complexity}`);
    lines.push('');
    // .LINK
    lines.push('.LINK');
    lines.push('    https://docs.microsoft.com/powershell');
    lines.push('#>');
    return lines.join('\n');
}
/**
 * Infer synopsis (brief description)
 */
function inferSynopsis(funcInfo) {
    const name = funcInfo.name;
    // Remove common prefixes
    let cleanName = name;
    if (cleanName.startsWith('Get-')) {
        return `Gets ${formatName(cleanName.slice(4))}`;
    }
    if (cleanName.startsWith('Set-')) {
        return `Sets ${formatName(cleanName.slice(4))}`;
    }
    if (cleanName.startsWith('New-')) {
        return `Creates a new ${formatName(cleanName.slice(4))}`;
    }
    if (cleanName.startsWith('Remove-')) {
        return `Removes ${formatName(cleanName.slice(7))}`;
    }
    if (cleanName.startsWith('Test-')) {
        return `Tests ${formatName(cleanName.slice(5))}`;
    }
    if (cleanName.startsWith('Start-')) {
        return `Starts ${formatName(cleanName.slice(6))}`;
    }
    if (cleanName.startsWith('Stop-')) {
        return `Stops ${formatName(cleanName.slice(5))}`;
    }
    if (cleanName.startsWith('Restart-')) {
        return `Restarts ${formatName(cleanName.slice(8))}`;
    }
    if (cleanName.startsWith('Enable-')) {
        return `Enables ${formatName(cleanName.slice(7))}`;
    }
    if (cleanName.startsWith('Disable-')) {
        return `Disables ${formatName(cleanName.slice(8))}`;
    }
    if (cleanName.startsWith('Install-')) {
        return `Installs ${formatName(cleanName.slice(8))}`;
    }
    if (cleanName.startsWith('Uninstall-')) {
        return `Uninstalls ${formatName(cleanName.slice(10))}`;
    }
    if (cleanName.startsWith('Update-')) {
        return `Updates ${formatName(cleanName.slice(7))}`;
    }
    if (cleanName.startsWith('Add-')) {
        return `Adds ${formatName(cleanName.slice(4))}`;
    }
    if (cleanName.startsWith('Clear-')) {
        return `Clears ${formatName(cleanName.slice(6))}`;
    }
    if (cleanName.startsWith('Copy-')) {
        return `Copies ${formatName(cleanName.slice(5))}`;
    }
    if (cleanName.startsWith('Move-')) {
        return `Moves ${formatName(cleanName.slice(5))}`;
    }
    if (cleanName.startsWith('Find-')) {
        return `Finds ${formatName(cleanName.slice(5))}`;
    }
    if (cleanName.startsWith('Search-')) {
        return `Searches for ${formatName(cleanName.slice(7))}`;
    }
    if (cleanName.startsWith('Read-')) {
        return `Reads ${formatName(cleanName.slice(5))}`;
    }
    if (cleanName.startsWith('Write-')) {
        return `Writes ${formatName(cleanName.slice(6))}`;
    }
    if (cleanName.startsWith('Import-')) {
        return `Imports ${formatName(cleanName.slice(7))}`;
    }
    if (cleanName.startsWith('Export-')) {
        return `Exports ${formatName(cleanName.slice(7))}`;
    }
    if (cleanName.startsWith('Convert-')) {
        return `Converts ${formatName(cleanName.slice(8))}`;
    }
    if (cleanName.startsWith('Select-')) {
        return `Selects ${formatName(cleanName.slice(7))}`;
    }
    if (cleanName.startsWith('Invoke-')) {
        return `Invokes ${formatName(cleanName.slice(7))}`;
    }
    if (cleanName.startsWith('Show-')) {
        return `Shows ${formatName(cleanName.slice(5))}`;
    }
    if (cleanName.startsWith('Hide-')) {
        return `Hides ${formatName(cleanName.slice(5))}`;
    }
    if (cleanName.startsWith('Wait-')) {
        return `Waits for ${formatName(cleanName.slice(5))}`;
    }
    if (cleanName.startsWith('Watch-')) {
        return `Watches ${formatName(cleanName.slice(6))}`;
    }
    if (cleanName.startsWith('Measure-')) {
        return `Measures ${formatName(cleanName.slice(8))}`;
    }
    if (cleanName.startsWith('Compare-')) {
        return `Compares ${formatName(cleanName.slice(8))}`;
    }
    if (cleanName.startsWith('Join-')) {
        return `Joins ${formatName(cleanName.slice(5))}`;
    }
    if (cleanName.startsWith('Split-')) {
        return `Splits ${formatName(cleanName.slice(6))}`;
    }
    if (cleanName.startsWith('Group-')) {
        return `Groups ${formatName(cleanName.slice(6))}`;
    }
    if (cleanName.startsWith('Sort-')) {
        return `Sorts ${formatName(cleanName.slice(5))}`;
    }
    if (cleanName.startsWith('Format-')) {
        return `Formats ${formatName(cleanName.slice(7))}`;
    }
    if (cleanName.startsWith('Out-')) {
        return `Outputs to ${formatName(cleanName.slice(4))}`;
    }
    return formatName(name);
}
/**
 * Infer detailed description
 */
function inferDescription(funcInfo) {
    const synopsis = inferSynopsis(funcInfo);
    // Add more context based on parameters
    if (funcInfo.params.length === 0) {
        return `${synopsis}. This function does not require any parameters.`;
    }
    if (funcInfo.params.length === 1) {
        return `${synopsis}. This function requires one parameter.`;
    }
    return `${synopsis}. This function accepts ${funcInfo.params.length} parameters.`;
}
/**
 * Infer parameter description from name
 */
function inferParameterDescription(paramName) {
    const lower = paramName.toLowerCase();
    // Common PowerShell parameter patterns
    if (lower === 'path' || lower === 'filepath') {
        return 'Specifies the path to the file or directory';
    }
    if (lower === 'literalpath') {
        return 'Specifies the literal path (wildcards not interpreted)';
    }
    if (lower === 'name') {
        return 'Specifies the name';
    }
    if (lower === 'computername' || lower === 'server') {
        return 'Specifies the computer name';
    }
    if (lower === 'credential') {
        return 'Specifies a user account that has permission to perform this action';
    }
    if (lower === 'filter') {
        return 'Specifies a filter expression';
    }
    if (lower === 'include') {
        return 'Specifies items to include in the operation';
    }
    if (lower === 'exclude') {
        return 'Specifies items to exclude from the operation';
    }
    if (lower === 'recurse') {
        return 'Indicates that this cmdlet operates recursively on subdirectories';
    }
    if (lower === 'force') {
        return 'Forces the command to run without asking for user confirmation';
    }
    if (lower === 'whatif') {
        return 'Shows what would happen if the cmdlet runs';
    }
    if (lower === 'confirm') {
        return 'Prompts you for confirmation before running the cmdlet';
    }
    if (lower === 'verbose') {
        return 'Provides verbose output';
    }
    if (lower === 'debug') {
        return 'Provides debugging information';
    }
    if (lower === 'erroraction') {
        return 'Determines how the cmdlet responds to a non-terminating error';
    }
    if (lower === 'errorvariable') {
        return 'Specifies a variable to store error information';
    }
    if (lower === 'outvariable') {
        return 'Specifies a variable to store output';
    }
    if (lower === 'outbuffer') {
        return 'Determines the number of objects to accumulate before calling the next cmdlet';
    }
    if (lower === 'pipelinevariable') {
        return 'Stores the value of the current pipeline element as a variable';
    }
    if (lower === 'value') {
        return 'Specifies the value';
    }
    if (lower === 'property') {
        return 'Specifies the property';
    }
    if (lower === 'object') {
        return 'Specifies the object';
    }
    if (lower === 'inputobject') {
        return 'Specifies the input object';
    }
    if (lower === 'id') {
        return 'Specifies the identifier';
    }
    if (lower === 'type') {
        return 'Specifies the type';
    }
    if (lower === 'count') {
        return 'Specifies the number of items';
    }
    if (lower === 'first') {
        return 'Gets only the specified number of first items';
    }
    if (lower === 'last') {
        return 'Gets only the specified number of last items';
    }
    if (lower === 'skip') {
        return 'Ignores the specified number of items';
    }
    if (lower === 'unique') {
        return 'Returns only unique items';
    }
    if (lower === 'wait') {
        return 'Waits for the specified amount of time';
    }
    if (lower === 'timeout') {
        return 'Specifies the timeout duration in seconds';
    }
    if (lower === 'retry') {
        return 'Specifies the number of retry attempts';
    }
    if (lower === 'encoding') {
        return 'Specifies the file encoding';
    }
    if (lower === 'append') {
        return 'Appends output to the end of a file';
    }
    if (lower === 'noclobber') {
        return 'Prevents overwriting of an existing file';
    }
    if (lower === 'passthru') {
        return 'Returns an object representing the item';
    }
    if (lower === 'stream') {
        return 'Gets the content of the specified stream';
    }
    if (lower === 'raw') {
        return 'Returns the content as a single string';
    }
    if (lower === 'delimiter') {
        return 'Specifies the delimiter';
    }
    if (lower === 'separator') {
        return 'Specifies the separator';
    }
    if (lower === 'culture') {
        return 'Specifies the culture';
    }
    if (lower === 'uiculture') {
        return 'Specifies the UI culture';
    }
    return `Specifies the ${paramName}`;
}
/**
 * Infer output description
 */
function inferOutputDescription(funcInfo) {
    const name = funcInfo.name;
    const returnType = funcInfo.returnType || 'Object';
    if (name.startsWith('Get-')) {
        return `Returns ${returnType} representing the retrieved items`;
    }
    if (name.startsWith('New-')) {
        return `Returns ${returnType} representing the created item`;
    }
    if (name.startsWith('Test-')) {
        return 'Returns Boolean indicating whether the test passed';
    }
    if (name.startsWith('Find-') || name.startsWith('Search-')) {
        return `Returns ${returnType} representing the found items`;
    }
    if (name.startsWith('Convert-')) {
        return `Returns ${returnType} representing the converted value`;
    }
    if (name.startsWith('Measure-')) {
        return `Returns ${returnType} with measurement information`;
    }
    if (name.startsWith('Compare-')) {
        return `Returns ${returnType} with comparison results`;
    }
    if (name.startsWith('Select-')) {
        return `Returns ${returnType} with selected items`;
    }
    if (name.startsWith('Import-')) {
        return `Returns ${returnType} representing imported data`;
    }
    if (name.startsWith('Export-')) {
        return `Returns ${returnType} representing export status`;
    }
    return `Returns ${returnType}`;
}
/**
 * Generate usage examples
 */
function generateExamples(funcInfo) {
    const examples = [];
    // Example 1: Basic usage
    const basicArgs = funcInfo.params
        .filter(p => !p.optional)
        .map(p => {
        if (p.type?.toLowerCase().includes('string'))
            return '-' + p.name + ' "value"';
        if (p.type?.toLowerCase().includes('int'))
            return '-' + p.name + ' 42';
        if (p.type?.toLowerCase().includes('switch') || p.type?.toLowerCase().includes('bool'))
            return '-' + p.name;
        return '-' + p.name + ' $value';
    })
        .join(' ');
    if (basicArgs) {
        examples.push({
            code: `${funcInfo.name} ${basicArgs}`,
            description: 'Basic usage with required parameters',
        });
    }
    else {
        examples.push({
            code: `${funcInfo.name}`,
            description: 'Basic usage',
        });
    }
    // Example 2: With optional parameters
    if (funcInfo.params.some(p => p.optional)) {
        const allArgs = funcInfo.params
            .map(p => {
            if (p.type?.toLowerCase().includes('string'))
                return '-' + p.name + ' "value"';
            if (p.type?.toLowerCase().includes('int'))
                return '-' + p.name + ' 42';
            if (p.type?.toLowerCase().includes('switch') || p.type?.toLowerCase().includes('bool'))
                return '-' + p.name;
            return '-' + p.name + ' $value';
        })
            .join(' ');
        examples.push({
            code: `${funcInfo.name} ${allArgs}`,
            description: 'Usage with all parameters',
        });
    }
    // Example 3: With pipeline
    if (funcInfo.params.some(p => p.name.toLowerCase() === 'inputobject')) {
        examples.push({
            code: `Get-Item "C:\\path\\*" | ${funcInfo.name}`,
            description: 'Usage with pipeline input',
        });
    }
    return examples;
}
/**
 * Format name by adding spaces before capitals
 */
function formatName(name) {
    return name
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .toLowerCase();
}
//# sourceMappingURL=help.js.map