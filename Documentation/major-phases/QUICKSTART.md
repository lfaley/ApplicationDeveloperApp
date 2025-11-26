# ProjectPlanner Phase 2 - Quick Start Guide

## Document Information
- **Version**: 1.0.0
- **Last Updated**: 2025-11-17
- **Audience**: Developers new to ProjectPlanner Phase 2
- **Time to Complete**: 30 minutes

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Your First Feature](#your-first-feature)
4. [Using AI Agents](#using-ai-agents)
5. [Working with Workflows](#working-with-workflows)
6. [VS Code Extension](#vs-code-extension)
7. [CLI Commands](#cli-commands)
8. [Next Steps](#next-steps)

---

## Prerequisites

### Required Software
```bash
# Node.js 18+ and npm 9+
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0

# Git 2.30+
git --version   # Should be >= 2.30.0

# PowerShell 7+ (Windows)
pwsh --version  # Should be >= 7.0.0

# VS Code 1.80+ (recommended)
code --version  # Should be >= 1.80.0
```

### System Requirements
- **OS**: Windows 10+, macOS 11+, or Linux
- **RAM**: 8GB minimum, 16GB recommended
- **Disk**: 2GB free space
- **Internet**: Required for AI agent LLM calls

---

## Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/lfaley/ProjectPlanner.git
cd ProjectPlanner
```

### Step 2: Install Dependencies
```bash
# Install core dependencies
npm install

# Install CLI globally (optional)
npm install -g @projectplanner/cli

# Install VS Code extension (optional)
code --install-extension projectplanner.vscode-extension
```

### Step 3: Initialize ProjectPlanner
```bash
# Initialize .projectplanner/ directory
planner init

# Configure settings (interactive)
planner config setup
```

**Expected Output:**
```
✓ Created .projectplanner/ directory
✓ Initialized state management
✓ Loaded workflow templates
✓ Loaded coding standards
✓ ProjectPlanner is ready!
```

### Step 4: Verify Installation
```bash
# Check system status
planner status

# List available workflows
planner workflow list

# List available agents
planner agent list
```

---

## Your First Feature

### Create a Feature
```bash
# Interactive mode (recommended for first time)
planner feature create

# Or with flags
planner feature create \
  --title "Add user authentication" \
  --priority high \
  --complexity m \
  --category security
```

**Interactive Prompts:**
```
? Feature title: Add user authentication
? Description: Implement JWT-based authentication system
? Priority: (Use arrow keys)
  ❯ high
    medium
    low
? Complexity: (Use arrow keys)
  ❯ m (medium)
    s (small)
    l (large)
? Category: security
? Tags (comma-separated): auth, jwt, security

✓ Created feature FEA-001
```

### View Feature Details
```bash
planner feature show FEA-001
```

**Output:**
```
╔═══════════════════════════════════════════════════════════╗
║                     Feature: FEA-001                      ║
╚═══════════════════════════════════════════════════════════╝

Title:       Add user authentication
Status:      draft
Phase:       planning
Priority:    high
Complexity:  medium

Description:
  Implement JWT-based authentication system

Progress:
  Planning:        [░░░░░░░░░░] 0/5 checklist items
  Design:          [░░░░░░░░░░] Not started
  Implementation:  [░░░░░░░░░░] Not started

Quality Gates:
  ⏳ Compliance Check     (not run)
  ⏳ Testing              (not run)
  ⏳ Code Review          (not run)
  ⏳ Documentation        (not run)

Commands:
  Start work:    planner work start FEA-001
  Show checklist: planner workflow checklist
```

### Start Working on Feature
```bash
# Start the feature (transitions to 'active' status)
planner work start FEA-001

# Create feature branch automatically
# Branch name: feature/FEA-001-add-user-authentication
```

**Output:**
```
✓ Set FEA-001 as active work item
✓ Created branch: feature/FEA-001-add-user-authentication
✓ Switched to feature branch

Current Phase: Planning
Next Steps:
  1. Complete planning checklist (5 items)
  2. Run compliance check
  3. Transition to Design phase

View checklist: planner workflow checklist
```

### Work Through Checklist
```bash
# View current phase checklist
planner workflow checklist
```

**Output:**
```
Planning Phase Checklist:
  [ ] 1. Define requirements and acceptance criteria
  [ ] 2. Identify dependencies and affected systems
  [ ] 3. Estimate effort and timeline
  [ ] 4. Review with team lead
  [ ] 5. Get stakeholder approval

Complete item: planner workflow checklist complete <number>
```

```bash
# Mark items as complete
planner workflow checklist complete 1
planner workflow checklist complete 2
# ... etc
```

### Transition to Next Phase
```bash
# Check if ready to transition
planner workflow next --dry-run

# Transition to Design phase
planner workflow next
```

**Output:**
```
Checking transition requirements...
  ✓ All required checklist items complete
  ⚠ Quality gate not run: Compliance Check
  
Would you like to:
  1. Run quality gates now
  2. Skip gates (requires justification)
  3. Cancel

? Choose option: 1

Running quality gates...
  ✓ Compliance Check: PASSED (100/100)

Transitioning FEA-001 to Design phase...
  ✓ Phase transition complete
  ✓ Design checklist loaded (6 items)
```

---

## Using AI Agents

### List Available Agents
```bash
planner agent list
```

**Output:**
```
Available Agents:
  1. feature-implementation  - Generate code from requirements
  2. standards-compliance    - Check and fix coding standards
  3. test-generation        - Generate unit/integration tests
  4. code-documentation     - Generate inline/API docs
  5. bug-analysis           - Analyze bugs and suggest fixes
  6. project-roadmap        - Generate project roadmaps

Run agent: planner agent run <agent-name>
```

### Generate Code with Implementation Agent
```bash
# Run feature implementation agent
planner agent run feature-implementation \
  --feature FEA-001 \
  --interactive
```

**Interactive Session:**
```
🤖 Feature Implementation Agent

Analyzing feature: FEA-001 - Add user authentication

Step 1/4: Requirements Analysis
  ✓ Parsed requirements
  ✓ Identified 3 components needed
  ✓ Detected dependencies: express, jsonwebtoken

Step 2/4: Architecture Design
  Components:
    - AuthController (handles login/register)
    - AuthMiddleware (validates JWT tokens)
    - TokenService (generates/verifies tokens)
  
  ? Approve architecture? Yes

Step 3/4: Code Generation
  ✓ Generated src/controllers/AuthController.ts
  ✓ Generated src/middleware/AuthMiddleware.ts
  ✓ Generated src/services/TokenService.ts
  ✓ Generated src/types/Auth.ts

Step 4/4: Validation
  ✓ Code passes TypeScript compilation
  ✓ Code passes standards compliance (98/100)
  ⚠ 2 warnings found (auto-fixable)
  
  ? Auto-fix warnings? Yes
  ✓ Fixed 2 warnings
  ✓ Final compliance score: 100/100

Agent completed successfully!
  Files created: 4
  Lines of code: 287
  Estimated coverage: 75%

Next steps:
  1. Review generated code
  2. Run tests: planner agent run test-generation
  3. Generate docs: planner agent run code-documentation
```

### Generate Tests
```bash
planner agent run test-generation \
  --files "src/controllers/AuthController.ts,src/services/TokenService.ts"
```

**Output:**
```
🤖 Test Generation Agent

Analyzing files...
  ✓ Found 12 functions to test
  ✓ Found 3 classes to test

Generating tests...
  ✓ Created tests/controllers/AuthController.test.ts
  ✓ Created tests/services/TokenService.test.ts
  ✓ Generated 24 test cases
  ✓ Generated mock data

Test summary:
  Unit tests: 18
  Integration tests: 6
  Estimated coverage: 85%

Run tests: npm test
```

### Generate Documentation
```bash
planner agent run code-documentation \
  --feature FEA-001 \
  --include-readme
```

**Output:**
```
🤖 Code Documentation Agent

Processing feature FEA-001...
  ✓ Generated JSDoc for 12 functions
  ✓ Generated class documentation
  ✓ Generated API documentation
  ✓ Generated README section

Documentation created:
  - Inline docs: 100% coverage
  - API docs: docs/api/authentication.md
  - README: Updated with authentication section

Documentation quality: 9.2/10
```

---

## Working with Workflows

### Understanding Phases
Each feature follows a workflow with phases:

```
Planning → Design → Implementation → Testing → Review → Documentation → Deployment → Complete
```

### Phase Checklist Example
**Implementation Phase:**
```bash
planner workflow checklist
```

```
Implementation Phase Checklist:
  [✓] 1. Create feature branch
  [✓] 2. Implement core functionality
  [ ] 3. Add error handling
  [ ] 4. Add logging
  [ ] 5. Write unit tests
  [ ] 6. Pass compliance check
  [✓] 7. Commit changes with proper message

Progress: 3/7 (43%)
```

### Quality Gates
Each phase has quality gates that must pass:

```bash
# Check all quality gates
planner workflow gates
```

**Output:**
```
Quality Gates for FEA-001:

Compliance Gate:
  Status: ✓ PASSED
  Score: 98/100
  Last checked: 2025-11-17 10:30:00
  Details: 2 warnings (non-blocking)

Testing Gate:
  Status: ✓ PASSED
  Coverage: 87%
  Tests passing: 24/24
  Last checked: 2025-11-17 10:35:00

Review Gate:
  Status: ⏳ PENDING
  Reviewers: 0/2 approved
  PR: #123 (open)

Documentation Gate:
  Status: ✓ PASSED
  Inline docs: 100%
  API docs: Complete
  README: Updated
```

### Bypass Quality Gate (with justification)
```bash
planner workflow gate bypass review-gate \
  --reason "Urgent security fix, will get review post-deployment"
```

---

## VS Code Extension

### Installation
```bash
# Install from marketplace
code --install-extension projectplanner.vscode-extension

# Or from VSIX
code --install-extension projectplanner-1.0.0.vsix
```

### Activity Bar View
After installation, click the ProjectPlanner icon in the Activity Bar:

```
╔═══════════════════════════════════════╗
║        PROJECTPLANNER                 ║
╠═══════════════════════════════════════╣
║ CURRENT WORK                          ║
║   🔵 FEA-001: Add user auth          ║
║      Phase: Implementation (60%)      ║
║      Compliance: 98/100              ║
║                                       ║
║ QUICK ACTIONS                         ║
║   ▶  Complete checklist item         ║
║   🤖 Run agent                        ║
║   ✓  Check compliance                ║
║   🔄 Next phase                       ║
║                                       ║
║ CHECKLIST (3/7)                       ║
║   ✓ Create feature branch            ║
║   ✓ Implement core functionality     ║
║   ☐ Add error handling               ║
║   ☐ Add logging                       ║
║   ☐ Write unit tests                 ║
║                                       ║
║ RECENT WORK                           ║
║   FEA-002: Update dashboard           ║
║   BUG-015: Fix login redirect         ║
╚═══════════════════════════════════════╝
```

### Status Bar
Bottom of VS Code window shows:

```
🔵 FEA-001 | Implementation | ✓ 98% | 3/7 tasks
```

Click to open quick actions menu.

### Code Actions
Right-click in code to see:
- 📝 Generate documentation
- 🧪 Generate tests
- ✓ Fix compliance issues
- 🔄 Refactor code

### Command Palette
Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS):
```
> ProjectPlanner: Create Feature
> ProjectPlanner: Start Work
> ProjectPlanner: Next Phase
> ProjectPlanner: Run Agent
> ProjectPlanner: Check Compliance
```

---

## CLI Commands

### Quick Reference

```bash
# Features
planner feature create              # Create new feature
planner feature list                # List all features
planner feature show <id>           # Show feature details
planner feature update <id>         # Update feature

# Bugs
planner bug create                  # Create new bug
planner bug list                    # List all bugs
planner bug show <id>               # Show bug details
planner bug fix <id>                # Start fixing bug

# Work Management
planner work current                # Show current work item
planner work start <id>             # Start working on item
planner work pause                  # Pause current work
planner work switch <id>            # Switch to different item
planner work history                # Show work history

# Workflow
planner workflow next               # Move to next phase
planner workflow status             # Show phase status
planner workflow checklist          # Show checklist
planner workflow gates              # Check quality gates

# Agents
planner agent list                  # List available agents
planner agent run <name>            # Run specific agent
planner agent status <name>         # Get agent status

# Compliance
planner compliance check [files]    # Check compliance
planner compliance fix [files]      # Auto-fix violations
planner compliance report           # Generate report
planner compliance score            # Get overall score

# Roadmap
planner roadmap generate            # Generate project roadmap
planner roadmap show                # Display roadmap
planner roadmap estimate <id>       # Estimate feature effort
```

### Common Workflows

**Complete Feature Flow:**
```bash
# 1. Create feature
planner feature create --title "Feature name" --priority high

# 2. Start work
planner work start FEA-001

# 3. Generate code
planner agent run feature-implementation --feature FEA-001

# 4. Generate tests
planner agent run test-generation

# 5. Generate docs
planner agent run code-documentation

# 6. Check compliance
planner compliance check

# 7. Move through phases
planner workflow next  # Repeat as needed

# 8. Complete
planner feature complete FEA-001
```

**Bug Fix Flow:**
```bash
# 1. Create bug
planner bug create --title "Bug description" --severity high

# 2. Analyze bug
planner agent run bug-analysis --bug BUG-001

# 3. Start fix
planner work start BUG-001

# 4. Fix code (manual)
# ... make code changes ...

# 5. Generate tests
planner agent run test-generation

# 6. Verify fix
npm test

# 7. Complete
planner bug fix BUG-001
```

---

## Next Steps

### Learn More
- 📖 [Full Documentation](OVERVIEW.md)
- 🏗️ [Technical Architecture](architecture/TECHNICAL_ARCHITECTURE.md)
- 🤖 [Agent System](agents/AGENT_ARCHITECTURE.md)
- 🔄 [Workflow System](specifications/WORKFLOW_SYSTEM.md)
- 📡 [API Reference](API_SPECIFICATIONS.md)

### Advanced Topics
- Custom workflows
- Plugin development
- MCP server integration
- Team collaboration
- CI/CD integration

### Get Help
- 💬 Discord: https://discord.gg/projectplanner
- 🐛 Issues: https://github.com/lfaley/ProjectPlanner/issues
- 📧 Email: support@projectplanner.dev
- 📚 Docs: https://docs.projectplanner.dev

### Contribute
- 🌟 Star the repo
- 🐛 Report bugs
- 💡 Request features
- 🔧 Submit PRs
- 📖 Improve docs

---

## Troubleshooting

### Common Issues

**Issue: `planner: command not found`**
```bash
# Solution: Install CLI globally
npm install -g @projectplanner/cli

# Or use npx
npx @projectplanner/cli feature list
```

**Issue: `.projectplanner/ directory not found`**
```bash
# Solution: Initialize ProjectPlanner
planner init
```

**Issue: Agent fails with API error**
```bash
# Solution: Check LLM API configuration
planner config show

# Set API key
planner config set llm.apiKey "your-api-key"
planner config set llm.provider "openai"  # or "anthropic"
```

**Issue: Compliance check fails**
```bash
# Solution: View detailed violations
planner compliance check --verbose

# Auto-fix if possible
planner compliance fix

# Or fix manually and recheck
planner compliance check
```

**Issue: VS Code extension not working**
```bash
# Solution: Reload window
# Press Ctrl+Shift+P, type "Reload Window"

# Or reinstall extension
code --uninstall-extension projectplanner.vscode-extension
code --install-extension projectplanner.vscode-extension
```

---

## Configuration

### Default Configuration
Located at `.projectplanner/config.json`:

```json
{
  "workflow": {
    "defaultWorkflow": "standard-feature",
    "autoTransition": false
  },
  "agents": {
    "llmProvider": "openai",
    "llmModel": "gpt-4",
    "temperature": 0.7,
    "maxTokens": 4000,
    "timeout": 30000
  },
  "compliance": {
    "autoFix": true,
    "scoreThreshold": 90
  },
  "git": {
    "autoCreateBranch": true,
    "branchPrefix": "feature/",
    "commitMessageFormat": "[{workItemId}] {title}"
  }
}
```

### Customize Settings
```bash
# Interactive config editor
planner config edit

# Set individual values
planner config set workflow.autoTransition true
planner config set agents.llmModel "gpt-4-turbo"
planner config set compliance.scoreThreshold 95
```

---

**You're ready to start using ProjectPlanner Phase 2!** 🚀

Start with `planner feature create` and let the AI agents guide you through building better software faster.
