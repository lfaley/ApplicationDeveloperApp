# ProjectPlanner Phase 2 - Developer Onboarding

## Welcome! 👋

This guide will help you become productive with ProjectPlanner Phase 2 in your first week. Whether you're a new contributor or setting up for the first time, follow this structured onboarding path.

**Estimated Time**: 3-4 hours spread across 5 days

---

## Table of Contents
1. [Day 1: Setup & Overview](#day-1-setup--overview)
2. [Day 2: Core Concepts](#day-2-core-concepts)
3. [Day 3: Hands-On Practice](#day-3-hands-on-practice)
4. [Day 4: Advanced Features](#day-4-advanced-features)
5. [Day 5: Contributing](#day-5-contributing)
6. [Cheat Sheets](#cheat-sheets)
7. [FAQ](#faq)

---

## Day 1: Setup & Overview
**Time**: 45 minutes

### Goals
- ✅ Install ProjectPlanner
- ✅ Understand the architecture
- ✅ Create your first feature

### Tasks

#### 1. Complete Quick Start (30 min)
Follow the [Quick Start Guide](QUICKSTART.md) to:
- Install dependencies
- Initialize ProjectPlanner
- Create and start your first feature

#### 2. Read Architecture Overview (15 min)
Skim these sections in [OVERVIEW.md](OVERVIEW.md):
- What is Phase 2?
- Key components
- How everything fits together

### Self-Check ✓
- [ ] Can run `planner --version` successfully
- [ ] `.projectplanner/` directory exists in your workspace
- [ ] Created at least one feature (`FEA-001`)
- [ ] Understand the 3 main layers (State, Workflow, Agents)

### Resources
- [Quick Start Guide](QUICKSTART.md)
- [Overview Document](OVERVIEW.md)
- [Installation Troubleshooting](#troubleshooting)

---

## Day 2: Core Concepts
**Time**: 60 minutes

### Goals
- ✅ Master the workflow system
- ✅ Understand state management
- ✅ Learn quality gates

### Tasks

#### 1. Study Workflow System (30 min)
Read [WORKFLOW_SYSTEM.md](specifications/WORKFLOW_SYSTEM.md):
- Phase lifecycle
- Quality gates
- Checklists
- Transitions

**Hands-on Practice:**
```bash
# Create a feature
planner feature create --title "Learn workflows"

# Start it
planner work start FEA-002

# View checklist
planner workflow checklist

# Complete a few items
planner workflow checklist complete 1
planner workflow checklist complete 2

# Try to transition (will show what's blocking)
planner workflow next --dry-run
```

#### 2. Explore State Management (20 min)
Read [STATE_MANAGEMENT.md](specifications/STATE_MANAGEMENT.md):
- File structure (`.projectplanner/` contents)
- Feature schema
- Bug schema
- Indexes

**Hands-on Practice:**
```bash
# Look at your feature's JSON
cat .projectplanner/features/FEA-002.json | jq

# View the index
cat .projectplanner/indexes/by-status.json | jq

# Query features
planner feature list --status active
planner feature list --priority high
```

#### 3. Quality Gates Deep Dive (10 min)
Understand the 4 quality gate types:
1. **Compliance** - Coding standards
2. **Testing** - Test coverage
3. **Review** - Code review
4. **Artifacts** - Documentation, changelog

**Hands-on Practice:**
```bash
# Check quality gates
planner workflow gates

# Run compliance check
planner compliance check

# View compliance report
planner compliance report
```

### Self-Check ✓
- [ ] Can explain the 8 workflow phases
- [ ] Understand what quality gates are
- [ ] Know where feature data is stored
- [ ] Successfully ran a compliance check

### Resources
- [Workflow System](specifications/WORKFLOW_SYSTEM.md)
- [State Management](specifications/STATE_MANAGEMENT.md)
- [Quality Gates Reference](#quality-gates-reference)

---

## Day 3: Hands-On Practice
**Time**: 60 minutes

### Goals
- ✅ Use AI agents
- ✅ Complete a feature end-to-end
- ✅ Fix a bug

### Tasks

#### 1. AI Agent Workshop (30 min)
Read [AGENT_ARCHITECTURE.md](agents/AGENT_ARCHITECTURE.md):
- Agent overview
- Agent orchestration
- When to use each agent

**Hands-on Practice:**
Create a simple authentication feature:

```bash
# 1. Create feature
planner feature create \
  --title "Add login endpoint" \
  --priority medium \
  --complexity s

# 2. Start work
planner work start FEA-003

# 3. Generate code with agent
planner agent run feature-implementation \
  --feature FEA-003 \
  --interactive

# 4. Generate tests
planner agent run test-generation

# 5. Generate documentation
planner agent run code-documentation

# 6. Check compliance
planner compliance check

# 7. Move through workflow
planner workflow next  # Repeat until complete
```

#### 2. Bug Fix Exercise (20 min)
Simulate a bug fix workflow:

```bash
# 1. Create a bug
planner bug create \
  --title "Login endpoint returns 500" \
  --severity high \
  --reproducibility always

# 2. Analyze with agent
planner agent run bug-analysis --bug BUG-001

# 3. Review agent's suggestions
planner bug show BUG-001

# 4. Fix the bug (make some code changes)
echo "// Fixed bug" >> src/auth.ts

# 5. Generate regression test
planner agent run test-generation --regression

# 6. Mark as fixed
planner bug fix BUG-001
```

#### 3. Review Git Integration (10 min)
```bash
# View commits linked to your feature
planner feature show FEA-003 --show-commits

# View branch
git branch | grep FEA-003

# View commit messages (should include FEA-003)
git log --oneline
```

### Self-Check ✓
- [ ] Successfully ran at least 3 different agents
- [ ] Completed one feature from start to finish
- [ ] Created and fixed one bug
- [ ] Commits properly linked to work items

### Resources
- [Agent Architecture](agents/AGENT_ARCHITECTURE.md)
- [Agent Examples](#agent-examples)
- [Git Integration Guide](#git-integration)

---

## Day 4: Advanced Features
**Time**: 45 minutes

### Goals
- ✅ Master CLI advanced features
- ✅ Customize workflows
- ✅ Use VS Code extension effectively

### Tasks

#### 1. CLI Power User (20 min)

**Aliases:**
```bash
# Set up aliases in .projectplanner/config.json
planner config set aliases.fc "feature create"
planner config set aliases.fl "feature list"
planner config set aliases.ws "work start"

# Now use them
planner fc --title "New feature"
planner fl --status active
```

**Output Formats:**
```bash
# Table format (default)
planner feature list

# JSON format (for scripts)
planner feature list --format json | jq '.items[0].title'

# CSV format (for Excel)
planner feature list --format csv > features.csv
```

**Filtering and Sorting:**
```bash
# Complex queries
planner feature list \
  --status active \
  --priority high \
  --sort-by updatedAt \
  --sort-dir desc \
  --limit 10

# Multiple filters
planner bug list \
  --severity critical \
  --status open \
  --created-after "2025-11-01"
```

#### 2. Custom Workflows (15 min)
Read workflow customization in [WORKFLOW_SYSTEM.md](specifications/WORKFLOW_SYSTEM.md).

Create a custom workflow:

```json
// .projectplanner/workflows/hotfix-workflow.json
{
  "id": "hotfix",
  "name": "Hotfix Workflow",
  "workItemType": "bug",
  "phases": [
    {
      "id": "triage",
      "name": "Triage",
      "order": 1,
      "checklist": {
        "items": [
          {
            "id": "1",
            "text": "Verify bug is critical",
            "required": true
          },
          {
            "id": "2",
            "text": "Get approval from tech lead",
            "required": true
          }
        ]
      }
    },
    {
      "id": "fix",
      "name": "Fix",
      "order": 2,
      "checklist": {
        "items": [
          {
            "id": "1",
            "text": "Implement fix",
            "required": true
          },
          {
            "id": "2",
            "text": "Add regression test",
            "required": true
          }
        ]
      }
    }
  ]
}
```

Use it:
```bash
planner bug create --workflow hotfix
```

#### 3. VS Code Extension Mastery (10 min)

**Keyboard Shortcuts:**
- `Ctrl+Shift+P` → "ProjectPlanner: Start Work" (set custom binding)
- `Ctrl+Shift+P` → "ProjectPlanner: Next Phase"
- `Ctrl+Alt+C` → Check compliance (custom binding)

**Webview Dashboard:**
```bash
# Open dashboard
Ctrl+Shift+P → "ProjectPlanner: Show Dashboard"
```

Dashboard shows:
- Current velocity
- Compliance trends
- Recent work
- Quick actions

**Code Actions:**
Right-click on any function:
- Generate documentation
- Generate tests
- Fix compliance

### Self-Check ✓
- [ ] Set up at least 3 CLI aliases
- [ ] Created a custom workflow
- [ ] Used VS Code extension for at least 3 tasks
- [ ] Opened and explored the dashboard

### Resources
- [CLI Reference](API_SPECIFICATIONS.md#cli-api)
- [VS Code Extension Guide](API_SPECIFICATIONS.md#vs-code-extension-api)
- [Custom Workflow Examples](#custom-workflow-examples)

---

## Day 5: Contributing
**Time**: 30 minutes

### Goals
- ✅ Understand codebase structure
- ✅ Know how to contribute
- ✅ Run tests and validate changes

### Tasks

#### 1. Codebase Tour (15 min)

**Directory Structure:**
```
ProjectPlanner/
├── src/
│   ├── state/           # State management (Day 2)
│   ├── workflow/        # Workflow engine (Day 2)
│   ├── agents/          # AI agents (Day 3)
│   ├── integration/     # Git, CI/CD, etc.
│   ├── cli/             # CLI tool
│   └── vscode/          # VS Code extension
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── MajorPhase2/         # Documentation
├── STANDARDS/           # Coding standards
└── MCP-SERVER/          # MCP servers
```

**Key Files:**
- `src/state/FileSystemStorage.ts` - Core storage
- `src/workflow/WorkflowEngine.ts` - Workflow logic
- `src/agents/orchestration/AgentOrchestrator.ts` - Agent coordination
- `src/cli/cli.ts` - CLI entry point

#### 2. Development Workflow (10 min)

**Setup:**
```bash
# Install dev dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Type check
npm run typecheck
```

**Making Changes:**
```bash
# 1. Create feature for your change
planner feature create --title "Your feature"

# 2. Create branch (done automatically)
planner work start FEA-XXX

# 3. Make changes
# ... edit code ...

# 4. Run tests
npm test

# 5. Check compliance
planner compliance check

# 6. Commit (linked to feature automatically)
git add .
git commit -m "[FEA-XXX] Your changes"

# 7. Push
git push origin feature/FEA-XXX-your-feature
```

#### 3. Testing Guidelines (5 min)

**Test Levels:**
1. **Unit Tests**: Test individual functions/classes
2. **Integration Tests**: Test multiple components together
3. **E2E Tests**: Test complete workflows

**Example:**
```typescript
// tests/unit/state/FileSystemStorage.test.ts
import { FileSystemStorage } from '../../../src/state/FileSystemStorage';

describe('FileSystemStorage', () => {
  let storage: FileSystemStorage;

  beforeEach(() => {
    storage = new FileSystemStorage('/tmp/test');
  });

  it('should write and read JSON', async () => {
    const data = { test: 'value' };
    await storage.write('test.json', data);
    const result = await storage.read('test.json');
    expect(result.data).toEqual(data);
  });
});
```

### Self-Check ✓
- [ ] Successfully ran `npm test`
- [ ] Can navigate the codebase
- [ ] Made a small change and validated it
- [ ] Understand the contribution workflow

### Resources
- [Implementation Roadmap](IMPLEMENTATION_ROADMAP.md)
- [Technical Architecture](architecture/TECHNICAL_ARCHITECTURE.md)
- [API Specifications](API_SPECIFICATIONS.md)

---

## Cheat Sheets

### Common Commands
```bash
# Features
planner feature create              # Create feature
planner feature list                # List features
planner work start <id>             # Start feature

# Workflow
planner workflow next               # Next phase
planner workflow checklist          # Show checklist
planner workflow gates              # Check gates

# Agents
planner agent run feature-implementation
planner agent run test-generation
planner agent run code-documentation
planner agent run bug-analysis

# Compliance
planner compliance check            # Check
planner compliance fix              # Fix
planner compliance report           # Report
```

### Quality Gates Reference
| Gate | Purpose | Pass Criteria |
|------|---------|---------------|
| Compliance | Coding standards | Score ≥ 90 |
| Testing | Test coverage | Coverage ≥ 80% |
| Review | Code review | 2+ approvals |
| Artifacts | Documentation | All required docs present |

### Workflow Phases
1. **Planning** - Define requirements
2. **Design** - Architecture and design
3. **Implementation** - Write code
4. **Testing** - Write and run tests
5. **Review** - Code review
6. **Documentation** - Generate docs
7. **Deployment** - Deploy changes
8. **Complete** - Feature complete

### Agent Selection Guide
| Task | Agent | Purpose |
|------|-------|---------|
| Generate code | feature-implementation | Code from requirements |
| Check standards | standards-compliance | Validate/fix compliance |
| Generate tests | test-generation | Unit/integration tests |
| Generate docs | code-documentation | Inline/API docs |
| Analyze bug | bug-analysis | Root cause analysis |
| Plan project | project-roadmap | Roadmap generation |

---

## FAQ

### General

**Q: What's the difference between Phase 1 and Phase 2?**

A: Phase 1 is a one-time project initialization tool (the GUI you see). Phase 2 is a continuous development workflow system that guides you through feature development with AI assistance.

**Q: Can I use ProjectPlanner with existing projects?**

A: Yes! Run `planner init` in any existing git repository. ProjectPlanner works alongside your existing setup.

**Q: Is internet required?**

A: Only for AI agent LLM calls. All other features work offline.

**Q: What LLM providers are supported?**

A: OpenAI (GPT-4), Anthropic (Claude), Azure OpenAI, and local models via Ollama.

### Workflow

**Q: Can I skip phases?**

A: Not recommended, but yes with justification. Use `planner workflow jump <phase> --reason "why"`.

**Q: What if quality gates fail?**

A: Fix the issues and rerun, or bypass with justification (requires approval in team settings).

**Q: Can I customize checklists?**

A: Yes! Edit workflow templates in `.projectplanner/workflows/`.

**Q: How do I create custom workflows?**

A: Copy an existing workflow template, modify it, and save to `.projectplanner/workflows/custom-workflow.json`.

### Agents

**Q: How much do AI agents cost?**

A: Depends on LLM provider. Typical feature costs $0.10-$0.50 with GPT-4. Use GPT-3.5-turbo for lower costs.

**Q: Can agents modify my code without permission?**

A: Only if you run them in non-interactive mode. Interactive mode (default) shows changes and asks for confirmation.

**Q: What if an agent makes a mistake?**

A: All agent actions are tracked. You can review, modify, or reject any agent-generated code.

**Q: Can I fine-tune agents?**

A: Not yet (Phase 3 feature). Currently, you can customize prompts in agent configurations.

### Development

**Q: How do I run ProjectPlanner locally for development?**

```bash
npm install
npm run build
npm link  # Makes 'planner' command use local version
```

**Q: Where are logs stored?**

A: `.projectplanner/logs/projectplanner.log`

**Q: How do I debug?**

```bash
# Enable debug logging
planner config set debug true

# View logs
tail -f .projectplanner/logs/projectplanner.log

# VS Code debugging
# Add breakpoint, press F5
```

**Q: Tests failing, what to do?**

```bash
# Run specific test
npm test -- --testNamePattern="FileSystemStorage"

# Run with verbose output
npm test -- --verbose

# Clear cache
npm test -- --clearCache
```

### Troubleshooting

**Q: "Cannot find module" errors**

```bash
npm install
npm run build
```

**Q: Permission denied on .projectplanner/**

```bash
# Fix permissions
chmod -R 755 .projectplanner/
```

**Q: Agent timeouts**

```bash
# Increase timeout
planner config set agents.timeout 60000  # 60 seconds
```

**Q: VS Code extension not loading**

```bash
# Check extension logs
Ctrl+Shift+P → "Developer: Show Logs" → Extension Host

# Reinstall
code --uninstall-extension projectplanner.vscode-extension
code --install-extension projectplanner.vscode-extension
```

---

## Next Steps After Onboarding

### Week 2 Goals
- [ ] Complete 5 features using full workflow
- [ ] Try all 6 AI agents
- [ ] Customize a workflow template
- [ ] Set up team collaboration (if applicable)

### Advanced Topics to Explore
- **Plugin Development**: Build custom agents
- **MCP Integration**: Connect to external tools
- **CI/CD Integration**: Automate workflows
- **Team Features**: Multi-user collaboration
- **Custom Quality Gates**: Domain-specific validations

### Resources
- 📖 [Complete Documentation](OVERVIEW.md)
- 💬 [Community Discord](https://discord.gg/projectplanner)
- 🎥 [Video Tutorials](https://youtube.com/@projectplanner)
- 📧 [Newsletter](https://projectplanner.dev/newsletter)

---

## Feedback

We want to improve onboarding! After completing this guide:

1. **Take the onboarding survey**: https://forms.projectplanner.dev/onboarding
2. **Rate your experience**: `planner feedback`
3. **Suggest improvements**: Open an issue or PR

---

**Congratulations on completing the onboarding! You're now ready to be productive with ProjectPlanner Phase 2.** 🎉

Keep this guide handy as a reference. Happy coding! 🚀
