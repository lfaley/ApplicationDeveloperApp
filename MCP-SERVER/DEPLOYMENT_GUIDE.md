# MCP Server Deployment Guide

This guide explains how to deploy the Code Documentation Agent, Code Review Agent, and Test Generator Agent MCP servers to Claude Desktop or VS Code.

## Prerequisites

1. **Claude Desktop** (for desktop deployment) or **VS Code with Cline extension** (for VS Code deployment)
2. **Node.js** installed (v18 or higher recommended)
3. Built MCP servers (run `npm run build` in each server directory)

## Deployment Options

### Option 1: Claude Desktop (Recommended)

Claude Desktop config location:
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

#### Configuration

Edit or create `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "code-documentation": {
      "command": "node",
      "args": [
        "c:\\Users\\faley\\Desktop\\Code\\Repos\\ProjectPlanner\\MCP-SERVER\\code-documentation-agent\\dist\\index.js"
      ]
    },
    "code-review": {
      "command": "node",
      "args": [
        "c:\\Users\\faley\\Desktop\\Code\\Repos\\ProjectPlanner\\MCP-SERVER\\code-review-agent\\dist\\index.js"
      ]
    },
    "test-generator": {
      "command": "node",
      "args": [
        "c:\\Users\\faley\\Desktop\\Code\\Repos\\ProjectPlanner\\MCP-SERVER\\test-generator-agent\\dist\\index.js"
      ]
    }
  }
}
```

**Important**: 
- Use absolute paths
- On Windows, use double backslashes (`\\`) or forward slashes (`/`)
- Restart Claude Desktop after config changes

### Option 2: VS Code with Cline Extension

VS Code settings location:
- Open Command Palette (`Ctrl+Shift+P`)
- Search for "Preferences: Open User Settings (JSON)"
- Add MCP configuration

#### Configuration

Add to VS Code `settings.json`:

```json
{
  "cline.mcpServers": {
    "code-documentation": {
      "command": "node",
      "args": [
        "c:\\Users\\faley\\Desktop\\Code\\Repos\\ProjectPlanner\\MCP-SERVER\\code-documentation-agent\\dist\\index.js"
      ]
    },
    "code-review": {
      "command": "node",
      "args": [
        "c:\\Users\\faley\\Desktop\\Code\\Repos\\ProjectPlanner\\MCP-SERVER\\code-review-agent\\dist\\index.js"
      ]
    }
  }
}
```

## Available Tools

### Code Documentation Agent (6 tools)

1. **analyze_code** - Analyze code to extract functions, classes, and documentation
2. **generate_documentation** - Generate JSDoc/docstrings for code elements
3. **analyze_and_generate** - Complete workflow: analyze → generate docs
4. **calculate_coverage** - Calculate documentation coverage percentage
5. **batch_process** - Process multiple code snippets in one request
6. **suggest_improvements** - Suggest documentation improvements

**Usage Example:**
```
Analyze this TypeScript code and generate JSDoc comments:
[paste code here]
```

### Code Review Agent (3 tools)

1. **review_code** - Comprehensive code review (quality, security, performance)
2. **quick_review** - Fast review focusing on critical/high severity issues
3. **security_review** - Security-only analysis

**Usage Example:**
```
Review this code for security issues:
[paste code here]
```

### Test Generator Agent (3 tools)

1. **generate_tests** - Comprehensive test generation with full customization
2. **analyze_testability** - Analyze code to identify testable units
3. **quick_generate** - Rapid test generation with defaults

**Usage Example:**
```
Generate Jest tests for this TypeScript function:
export function add(a: number, b: number): number {
  return a + b;
}
```

## Testing the Deployment

### Test Code Documentation Agent

1. Open Claude Desktop or VS Code with Cline
2. Send prompt:
   ```
   Use analyze_code tool to analyze this TypeScript function:
   
   function calculateTotal(items) {
     return items.reduce((sum, item) => sum + item.price, 0);
   }
   ```

3. Expected: Tool execution showing function analysis with params, return type, complexity

### Test Code Review Agent

1. Send prompt:
   ```
   Use review_code tool to review this JavaScript code:
   
   function getUser(id) {
     const query = "SELECT * FROM users WHERE id = " + id;
     return db.execute(query);
   }
   ```

2. Expected: Critical SQL injection vulnerability detected with fix suggestions

### Test Test Generator Agent

1. Send prompt:
   ```
   Use generate_tests tool to create Jest tests for this function:
   
   export function divide(a: number, b: number): number {
     if (b === 0) throw new Error('Cannot divide by zero');
     return a / b;
   }
   ```

2. Expected: Complete Jest test suite with happy path, edge cases, and error handling tests

## Troubleshooting

### Server Not Appearing

**Issue**: MCP server doesn't show in Claude Desktop tools

**Solutions**:
1. Verify config file syntax (valid JSON)
2. Check absolute paths are correct
3. Ensure `dist/index.js` exists (run `npm run build`)
4. Restart Claude Desktop completely
5. Check Claude Desktop logs:
   - Windows: `%APPDATA%\Claude\logs\`
   - macOS: `~/Library/Logs/Claude/`

### Tool Execution Errors

**Issue**: Tool executes but returns errors

**Solutions**:
1. Verify Node.js is in PATH
2. Check dependencies installed (`npm install`)
3. Rebuild servers (`npm run build`)
4. Test server manually:
   ```bash
   cd code-documentation-agent
   node dist/index.js
   # Should output: "Code Documentation Agent MCP Server running on stdio"
   ```

### Permission Errors (Windows)

**Issue**: Access denied or permission errors

**Solutions**:
1. Run as Administrator (first time only)
2. Check antivirus isn't blocking Node.js
3. Verify file paths don't contain special characters

## MCP Inspector (Development Tool)

Test servers in isolation using MCP Inspector:

```bash
# Code Documentation Agent
cd code-documentation-agent
npm run inspector

# Code Review Agent  
cd code-review-agent
npm run inspector
```

Opens web interface to test tools interactively.

## Updating Servers

After code changes:

```bash
# 1. Rebuild
npm run build

# 2. Restart Claude Desktop or VS Code

# 3. Test with simple prompt
```

## Configuration Tips

### Multiple Environments

Use different config files for dev/prod:

```json
{
  "mcpServers": {
    "code-docs-dev": {
      "command": "node",
      "args": ["path/to/dev/dist/index.js"]
    },
    "code-docs-prod": {
      "command": "node", 
      "args": ["path/to/prod/dist/index.js"]
    }
  }
}
```

### Environment Variables

Pass environment variables to servers:

```json
{
  "mcpServers": {
    "code-documentation": {
      "command": "node",
      "args": ["path/to/dist/index.js"],
      "env": {
        "LOG_LEVEL": "debug",
        "MAX_FILE_SIZE": "10485760"
      }
    }
  }
}
```

## Production Considerations

1. **Error Handling**: Servers include comprehensive error handling
2. **Validation**: Zod schemas validate all inputs
3. **Performance**: Code is optimized for quick analysis (<1s typical)
4. **Security**: No external API calls, all processing local
5. **Logging**: Errors logged to stderr for debugging

## Next Steps

1. ✅ Deploy servers using config above
2. ✅ Test with sample code
3. ✅ Integrate into daily workflow
4. 🔄 Provide feedback for improvements
5. 🔄 Expand language support as needed

## Support

For issues:
1. Check logs in Claude Desktop logs directory
2. Test with MCP Inspector
3. Verify build output exists
4. Review troubleshooting section above
