# Documentation Agent - MCP Server Plan

## Executive Summary

A Model Context Protocol (MCP) server that automatically maintains documentation for ProjectPlanner and other codebases. This agent will generate context summaries, update structure overviews, and keep all documentation synchronized with code changes.

## Problem Statement

**Current Pain Points:**
- Manually asking Copilot for context summaries repeatedly
- Documentation (STRUCTURE_OVERVIEW.md, folder READMEs) becomes outdated
- Time spent maintaining documentation consistency
- No automated way to track file changes and their impact on docs

**Solution:**
An MCP server that integrates with VS Code/GitHub Copilot to provide automatic documentation tools that can be invoked on-demand or triggered by file changes.

---

## Architecture Overview

### MCP Server Type: **TypeScript/Node.js with SSE Transport**

**Why TypeScript:**
- Native VS Code integration
- Strong type safety for tool schemas
- Rich ecosystem for file system operations
- Easy to package and distribute

**Communication Protocol:**
- **Server-Sent Events (SSE)** over HTTP for remote access
- **stdio** transport for local development/testing
- JSON-RPC 2.0 protocol per MCP specification

### Core Components

```
ProjectPlanner-Documentation-Agent/
├── src/
│   ├── index.ts                 # Main server entry point
│   ├── tools/
│   │   ├── analyze.ts           # Workspace analysis tools
│   │   ├── generate.ts          # Documentation generation tools
│   │   ├── update.ts            # Documentation update tools
│   │   └── statistics.ts        # File/line count statistics
│   ├── services/
│   │   ├── fileScanner.ts       # File system scanning
│   │   ├── contextBuilder.ts    # Context summary builder
│   │   ├── structureAnalyzer.ts # Folder structure analysis
│   │   └── changeDetector.ts    # Git diff detection
│   └── utils/
│       ├── fileUtils.ts         # File operations
│       ├── gitUtils.ts          # Git integration
│       └── templateEngine.ts    # Documentation templates
├── package.json
├── tsconfig.json
├── README.md
└── .vscode/
    └── mcp-config.json          # VS Code MCP configuration
```

---

## Tool Definitions (6 Core Tools)

### 1. **analyze_workspace**
**Purpose:** Scan workspace and provide detailed structure analysis

**Input Schema:**
```json
{
  "workspacePath": "string (required)",
  "includeHidden": "boolean (default: false)",
  "maxDepth": "number (default: 5)"
}
```

**Output:**
- Folder structure tree
- File count by extension
- Total lines of code
- Documentation file inventory
- Last modified timestamps

**Use Case:** "Analyze this workspace to understand its structure"

---

### 2. **generate_context_summary**
**Purpose:** Create comprehensive context summary for AI conversations

**Input Schema:**
```json
{
  "workspacePath": "string (required)",
  "includeGitHistory": "boolean (default: false)",
  "focusAreas": "string[] (optional)"
}
```

**Output:**
- Markdown formatted context summary
- Recent changes analysis
- Key files and their purposes
- Technology stack identification
- Recommended focus areas

**Use Case:** "Generate a context summary for this project"

---

### 3. **update_structure_overview**
**Purpose:** Update STRUCTURE_OVERVIEW.md with current state

**Input Schema:**
```json
{
  "workspacePath": "string (required)",
  "includeLineCount": "boolean (default: true)",
  "includeFileSize": "boolean (default: true)"
}
```

**Output:**
- Updated STRUCTURE_OVERVIEW.md file
- Summary of changes made
- Statistics comparison (before/after)

**Use Case:** "Update the structure overview file"

---

### 4. **update_folder_readmes**
**Purpose:** Update all folder README files with current contents

**Input Schema:**
```json
{
  "workspacePath": "string (required)",
  "folders": "string[] (optional, default: all folders)",
  "autoDescribe": "boolean (default: true)"
}
```

**Output:**
- List of updated README files
- New files added to each folder
- Removed files detected

**Use Case:** "Update all folder READMEs with current file lists"

---

### 5. **detect_documentation_drift**
**Purpose:** Compare documentation against actual codebase

**Input Schema:**
```json
{
  "workspacePath": "string (required)",
  "strictMode": "boolean (default: false)"
}
```

**Output:**
- Files mentioned in docs but missing
- Files existing but not documented
- Outdated descriptions
- Recommended updates

**Use Case:** "Check if documentation is out of sync with the code"

---

### 6. **generate_change_summary**
**Purpose:** Summarize recent changes for documentation updates

**Input Schema:**
```json
{
  "workspacePath": "string (required)",
  "sinceCommit": "string (optional)",
  "sinceDays": "number (default: 7)"
}
```

**Output:**
- Files added/modified/deleted
- Line count changes
- Suggested documentation updates
- Impact analysis

**Use Case:** "What changed this week that needs documentation?"

---

## Implementation Plan

### Phase 1: Core Infrastructure (2-3 hours)
**Task 1.1:** Set up TypeScript project structure
- Initialize npm project with MCP dependencies
- Configure TypeScript with strict mode
- Set up build process (tsc + bundling)

**Task 1.2:** Implement base MCP server
- Create server class with SSE transport
- Register capability declarations
- Implement ping/health check
- Add logging infrastructure

**Task 1.3:** Create file scanning service
- Recursive directory traversal
- File extension filtering
- .gitignore respect
- Line counting utilities

### Phase 2: Analysis Tools (3-4 hours)
**Task 2.1:** Implement `analyze_workspace` tool
- Build folder structure tree
- Count files by type
- Calculate total lines of code
- Identify documentation files

**Task 2.2:** Implement `detect_documentation_drift` tool
- Parse existing documentation
- Compare against actual files
- Generate drift report
- Suggest corrections

**Task 2.3:** Implement `generate_change_summary` tool
- Git integration for diffs
- Categorize changes (added/modified/deleted)
- Calculate impact metrics
- Format summary output

### Phase 3: Generation Tools (3-4 hours)
**Task 3.1:** Implement `generate_context_summary` tool
- Template-based summary generation
- Technology stack detection
- Recent changes integration
- Markdown formatting

**Task 3.2:** Implement `update_structure_overview` tool
- Read existing STRUCTURE_OVERVIEW.md
- Generate updated content
- Preserve manual sections
- Write back to file

**Task 3.3:** Implement `update_folder_readmes` tool
- Scan each folder for README.md
- Generate/update file listings
- Auto-describe file purposes (optional AI integration)
- Maintain custom sections

### Phase 4: VS Code Integration (1-2 hours)
**Task 4.1:** Create VS Code MCP configuration
- Define server connection settings
- Configure authentication (if needed)
- Set up tool permissions

**Task 4.2:** Test with GitHub Copilot Agent Mode
- Verify tool discovery
- Test each tool invocation
- Validate output formats
- Check error handling

**Task 4.3:** Create usage documentation
- Installation instructions
- Configuration guide
- Example prompts for each tool
- Troubleshooting section

### Phase 5: Optional Enhancements (2-3 hours)
**Task 5.1:** File watcher integration
- Monitor workspace for changes
- Auto-trigger relevant tools
- Debounce frequent changes
- Send notifications to client

**Task 5.2:** PowerShell GUI integration
- Add "Update Documentation" button
- Call MCP server tools
- Display results in GUI
- Option to auto-update on project creation

**Task 5.3:** Advanced AI integration
- Use LLM to describe file purposes
- Generate natural language summaries
- Suggest documentation improvements
- Create commit message templates

---

## Technology Stack

### Dependencies
```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.6.0",
    "zod": "^3.23.0",
    "simple-git": "^3.25.0",
    "glob": "^10.3.0",
    "markdown-it": "^14.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0",
    "tsx": "^4.7.0",
    "esbuild": "^0.19.0"
  }
}
```

### Key Libraries
- **@modelcontextprotocol/sdk**: Official MCP TypeScript SDK
- **zod**: Input validation and schema definition
- **simple-git**: Git integration for change detection
- **glob**: File pattern matching
- **markdown-it**: Markdown parsing/generation

---

## VS Code Configuration

### Location: `%APPDATA%\Code\User\globalStorage\github.copilot\mcp_config.json`

```json
{
  "mcpServers": {
    "projectplanner-docs": {
      "type": "local",
      "command": "node",
      "args": [
        "C:\\Users\\faley\\Desktop\\Code\\Repos\\ProjectPlanner\\MCP-Server\\dist\\index.js",
        "start"
      ],
      "tools": ["*"],
      "description": "Documentation automation for ProjectPlanner"
    }
  }
}
```

### Alternative: HTTP/SSE Remote Server
```json
{
  "mcpServers": {
    "projectplanner-docs": {
      "type": "http",
      "url": "http://localhost:3000/mcp",
      "tools": ["*"],
      "description": "Documentation automation (remote)"
    }
  }
}
```

---

## Usage Examples

### Example 1: Quick Context Summary
**User Prompt:**
> "Generate a context summary for this workspace"

**Agent Action:**
1. Calls `analyze_workspace` tool
2. Calls `generate_context_summary` tool
3. Returns formatted markdown summary

**Output:**
```markdown
# ProjectPlanner Context Summary
**Generated:** 2025-11-16T10:30:00Z

## Overview
ProjectPlanner v4.1 - Automated project setup and documentation system

## Structure
- 8 folders, 45 files
- 70,000+ lines of documentation
- Primary language: PowerShell

## Recent Changes
- Added GUI design documentation (39,000+ lines)
- Updated README.md
- 3 commits in last 24 hours
...
```

---

### Example 2: Check Documentation Drift
**User Prompt:**
> "Are my docs out of sync with the code?"

**Agent Action:**
1. Calls `detect_documentation_drift` tool
2. Analyzes discrepancies
3. Suggests updates

**Output:**
```
⚠️ Documentation Drift Detected:
- STRUCTURE_OVERVIEW.md: Missing 4 new files
- DOCS-NEW-PROJECTS/README.md: Outdated file count
- GUI/README.md: Does not exist (recommended)

✅ Suggested Fix:
Run `update_structure_overview` and `update_folder_readmes` tools
```

---

### Example 3: Weekly Documentation Update
**User Prompt:**
> "Update all documentation with changes from this week"

**Agent Action:**
1. Calls `generate_change_summary` (sinceDays: 7)
2. Calls `update_structure_overview`
3. Calls `update_folder_readmes`
4. Returns summary of updates

---

## Security & Best Practices

### Security Considerations

1. **File System Access:**
   - Only access workspace directories explicitly provided
   - Respect .gitignore and permission boundaries
   - No write access outside workspace

2. **Git Integration:**
   - Read-only git operations
   - No automatic commits
   - User approval for file modifications

3. **Input Validation:**
   - Validate all paths (prevent traversal attacks)
   - Sanitize user inputs with zod schemas
   - Rate limit tool invocations

### Error Handling

1. **Protocol Errors:**
   - Unknown tool names
   - Invalid input parameters
   - Server unavailable

2. **Tool Execution Errors:**
   - File system access denied
   - Git repository not found
   - Parsing errors (return `isError: true`)

### Logging & Monitoring

- Log all tool invocations
- Track execution times
- Monitor for errors
- Provide debug mode for troubleshooting

---

## Benefits & Value Proposition

### Time Savings
- **Context Summary Generation:** 5 minutes → 30 seconds
- **Structure Overview Update:** 10 minutes → 1 minute
- **Folder README Updates:** 15 minutes → 2 minutes
- **Documentation Drift Check:** Manual (prone to errors) → Automated

### Quality Improvements
- **Consistency:** All documentation follows same format
- **Accuracy:** No manual copy-paste errors
- **Completeness:** Automated detection of missing files
- **Freshness:** Documentation stays synchronized

### Developer Experience
- **Natural Language Interface:** "Update docs" instead of manual editing
- **Copilot Integration:** Works seamlessly in existing workflow
- **Extensible:** Easy to add new tools as needs evolve

---

## Rollout Plan

### Phase 1: Local Development (Week 1)
- Build and test MCP server locally
- Validate all 6 core tools
- Create comprehensive tests

### Phase 2: ProjectPlanner Integration (Week 2)
- Add MCP server to ProjectPlanner repository
- Create installation guide
- Add optional GUI button for updates

### Phase 3: Documentation & Training (Week 3)
- Write user documentation
- Create video walkthrough
- Share example prompts

### Phase 4: Expansion (Future)
- Add to other projects
- Publish as npm package
- Community feedback integration

---

## Success Metrics

### Quantitative
- Reduce documentation update time by 80%
- Eliminate documentation drift within 24 hours
- Generate context summaries in <30 seconds
- Support workspaces up to 10,000 files

### Qualitative
- Developers prefer using agent over manual updates
- Documentation quality improves (fewer errors)
- Easier onboarding for new team members
- Positive feedback from Copilot users

---

## Next Steps

### Immediate Actions
1. **Approve Architecture:** Review and approve this plan
2. **Create Project Structure:** Set up MCP server scaffolding
3. **Implement Core Tools:** Start with `analyze_workspace`
4. **Test Locally:** Validate with ProjectPlanner workspace
5. **Integrate with GUI:** Add to ProjectPlanner-GUI.ps1

### Decision Points
- **Local vs Remote Server:** Start with local (stdio), optionally add HTTP later
- **Auto-Update vs On-Demand:** Begin on-demand, add auto-update in Phase 5
- **AI Integration:** Optional enhancement for file descriptions

---

## Estimated Total Effort

| Phase | Effort | Status |
|-------|--------|--------|
| Research & Planning | 2 hours | ✅ Complete |
| Core Infrastructure | 3 hours | 🔜 Next |
| Analysis Tools | 4 hours | 📋 Planned |
| Generation Tools | 4 hours | 📋 Planned |
| VS Code Integration | 2 hours | 📋 Planned |
| Testing & Documentation | 2 hours | 📋 Planned |
| **Total** | **17 hours** | |

**Timeline:** 1-2 weeks for full implementation (assuming 2-3 hours/day)

---

## Conclusion

The Documentation Agent MCP server will transform how ProjectPlanner (and other projects) maintain documentation. By automating repetitive tasks and providing natural language interfaces, it saves time, improves quality, and ensures documentation stays synchronized with code.

**Ready to proceed?** Let's start with Phase 1: Core Infrastructure setup!
