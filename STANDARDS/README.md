# 📐 Development Standards

**Comprehensive standards, best practices, and guidelines for all aspects of project development**

---

## 🚨 CRITICAL: Start Here Before ANY Code Changes

**BEFORE making ANY code changes, read this:**

### 📖 Quick Reference (5-minute read)
**`QUICK_REFERENCE_CHANGE_CONTROL.md`** - Essential rules for code changes

### 🔒 The Golden Rule
**NEVER remove or modify approved functionality without:**
1. Explicit written approval from user
2. The release word: **"remove it"**

### ✅ The Testing Mandate
**ALL tests must pass at 100% before AND after EVERY change**

**Current Status**: 323/323 tests passing (100% ✅)

---

## 📚 Mandatory Protocols

### 1. Change Control Protocol ⭐ REQUIRED
**File**: `CODING/CHANGE_CONTROL_PROTOCOL.md`

**What it covers:**
- Pre-change checklist (must follow before ANY modification)
- Approval requirements for different types of changes
- "remove it" release word protocol for functionality removal
- Prohibited actions without approval
- Test-driven development mandate
- Refactoring safely without breaking functionality

**When to read:** Before making ANY code change

### 2. Regression Testing Guide ⭐ REQUIRED  
**File**: `TESTING/REGRESSION_TESTING_GUIDE.md`

**What it covers:**
- Current test coverage (323 tests, 100% passing)
- When and how to run tests
- Analyzing test failures
- Maintaining test suites
- Automation recommendations

**When to read:** Before running tests or analyzing failures

---

## 🎯 Quick Start Workflow

```bash
# 1. Before starting work - Verify baseline
cd MCP-SERVER/code-documentation-agent && npm test  # Must be 100%
cd ../code-review-agent && npm test                 # Must be 100%
cd ../test-generator-agent && npm test              # Must be 100%

# 2. Make ONE small change

# 3. Test immediately
npm test  # Must still be 100%

# 4. Repeat for each change

# 5. Before committing
npm run build  # Must succeed
npm test       # Must be 100%
```

---

## Overview

This folder contains all development standards used across ProjectPlanner and any projects created with it. Each standard is based on industry best practices from Microsoft, OpenAI, Anthropic, and other leading organizations.

---

## Standards Categories

### 🧪 [TESTING/](./TESTING/)
**Comprehensive testing standards and strategies**

- **REGRESSION_TESTING_GUIDE.md** ⭐ MANDATORY - Test workflow and regression protection
- **TESTING_STANDARDS.md** (15,000+ lines) - Complete testing reference
- **FRAMEWORK_SPECIFIC_EXAMPLES.md** (4,000+ lines) - React, Vue, Angular, Node.js examples
- **AI_TEST_GENERATION_GUIDE.md** (1,800+ lines) - Using AI to generate tests
- **TESTING_STRATEGY_TEMPLATE.md** - Template for project-specific strategies
- **VISUAL_EXAMPLES.md** - Visual diagrams and examples

**Use when:** Setting up testing infrastructure, writing tests, or establishing QA processes

**Current Test Status**: 323/323 tests passing (100% ✅)

---

### 🎨 [GUI_DESIGN/](./GUI_DESIGN/)
**User interface and experience design standards**

- **GUI_DESIGN_STANDARDS.md** (20,000+ lines) - Complete UI/UX reference
- **GUI_DESIGN_CHECKLIST.md** (6,000+ lines) - Step-by-step design checklist
- **GUI_DESIGN_QUICK_START.md** (13,000+ lines) - Quick start for new projects
- **GUI_DESIGN_IMPROVEMENT_GUIDE.md** (13,000+ lines) - Improving existing UIs

**Use when:** Designing interfaces, improving UX, or creating GUI applications

---

### 🤖 [MCP_AGENTS/](./MCP_AGENTS/)
**Model Context Protocol and AI agent development standards**

- **MCP_AGENT_DEVELOPMENT_STANDARDS.md** (39,000+ lines) - Complete agent development reference
- **DOCUMENTATION_AGENT_PLAN.md** - Technical design for documentation automation agent

**Use when:** Building MCP servers, creating AI agents, or implementing autonomous tools

**Key topics:**
- Security best practices (input validation, authentication, session management)
- Responsible AI principles (transparency, expectations, overreliance prevention)
- Testing & validation (unit, integration, security, red team tests)
- Conversation management (structured summaries, session tracking)
- Implementation checklists (7-phase development plan)

---

### 💻 [CODING/](./CODING/)
**General coding standards and practices**

- **CHANGE_CONTROL_PROTOCOL.md** ⭐ MANDATORY - Change approval and protection protocol
- **CODING_STANDARDS.md** (31,000+ lines) - Complete coding best practices reference

**Use when:** Writing code, conducting code reviews, or establishing development guidelines

**Key topics:**
- **Change Control** (pre-change checklist, approval process, "remove it" protocol)
- Development methodology (Documentation → Test → Code workflow)
- Object-Oriented Design (abstraction, encapsulation, inheritance, polymorphism)
- SOLID Principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion)
- Code Reusability (DRY, composition over inheritance, utility libraries)
- Logging Standards (Levels 0-5 mapped to Microsoft standard, structured logging)
- Error Handling & Resilience (try-catch-finally, retry patterns, circuit breaker)
- Code Comments (explain WHY not WHAT, documentation comments)
- Language-Specific Guidelines (C#, TypeScript, Python, PowerShell)
- Quality Metrics (90%+ coverage, <5% duplication, code review checklist)

---

## How to Use These Standards

### For New Projects

1. **Review relevant standards** before starting development
2. **Include standards in project setup** using ProjectPlanner GUI checkboxes
3. **Reference during development** as authoritative guidelines
4. **Use checklists** to ensure completeness

### For Existing Projects

1. **Assess current state** against standards
2. **Identify gaps** in testing, design, security, etc.
3. **Create improvement roadmap** to address gaps
4. **Implement incrementally** over time

### For Team Collaboration

1. **Share standards** with all team members
2. **Reference in code reviews** and design discussions
3. **Update standards** as industry best practices evolve
4. **Document deviations** with clear justification

---

## Standards Philosophy

### Industry-Backed
All standards are based on authoritative sources:
- **Microsoft Responsible AI Standard**
- **MCP Security Specification**
- **OpenAI/Anthropic Best Practices**
- **W3C Accessibility Guidelines**
- **OWASP Security Standards**

### Comprehensive Yet Practical
- ✅ Detailed explanations with rationale
- ✅ Code examples in multiple languages
- ✅ Checklists for practical application
- ✅ Templates for quick starts
- ❌ Not just theoretical - actionable guidance

### Living Documents
- **Versioned** - Track changes over time
- **Updated** - Incorporate new best practices
- **Extensible** - Add organization-specific standards
- **Referenced** - Cite authoritative sources

---

## Quick Reference

| Need | Standard | File |
|------|----------|------|
| **🚨 Before ANY code change** | **Change Control** | **`QUICK_REFERENCE_CHANGE_CONTROL.md`** ⭐ |
| **🚨 Before modifying code** | **Change Protocol** | **`CODING/CHANGE_CONTROL_PROTOCOL.md`** ⭐ |
| **🚨 Before/during testing** | **Regression Tests** | **`TESTING/REGRESSION_TESTING_GUIDE.md`** ⭐ |
| Write tests | Testing Standards | `TESTING/TESTING_STANDARDS.md` |
| Design UI | GUI Design Standards | `GUI_DESIGN/GUI_DESIGN_STANDARDS.md` |
| Build AI agent | MCP Agent Standards | `MCP_AGENTS/MCP_AGENT_DEVELOPMENT_STANDARDS.md` |
| Improve UX | GUI Improvement Guide | `GUI_DESIGN/GUI_DESIGN_IMPROVEMENT_GUIDE.md` |
| Security review | MCP Security | `MCP_AGENTS/MCP_AGENT_DEVELOPMENT_STANDARDS.md` (Section 3) |
| Test AI tool | Agent Testing | `MCP_AGENTS/MCP_AGENT_DEVELOPMENT_STANDARDS.md` (Section 5) |

---

## Contributing to Standards

### When to Update Standards

- **New industry best practices** emerge
- **Security vulnerabilities** discovered
- **Framework updates** require changes
- **User feedback** identifies gaps
- **Real-world experience** suggests improvements

### How to Propose Changes

1. **Document rationale** - Why is the change needed?
2. **Cite sources** - What industry standard supports this?
3. **Provide examples** - Show practical application
4. **Test thoroughly** - Validate with real projects
5. **Update version** - Increment version number

### Standards Review Process

- **Quarterly review** of all standards
- **Version control** in git with clear commit messages
- **Peer review** for major changes
- **Backward compatibility** - note breaking changes
- **Migration guides** when standards change significantly

---

## Standards Metrics

### Coverage Statistics

| Category | Files | Total Lines | Status |
|----------|-------|-------------|--------|
| Testing | 5 | ~21,000 | ✅ Complete |
| GUI Design | 4 | ~52,000 | ✅ Complete |
| MCP/Agents | 2 | ~40,000 | ✅ Complete |
| Coding | 0 | 0 | 🚧 Planned |
| **Total** | **11** | **~113,000** | **91% Complete** |

### Adoption Tracking

Track which standards are most valuable:
- Number of projects using each standard
- User ratings and feedback
- Issues/questions about standards
- Success stories and case studies

---

## Additional Resources

### Official Documentation
- **Microsoft Learn**: https://learn.microsoft.com
- **MCP Specification**: https://modelcontextprotocol.io
- **W3C Standards**: https://www.w3.org/standards/
- **OWASP**: https://owasp.org

### Community
- **ProjectPlanner Issues**: https://github.com/lfaley/ProjectPlanner/issues
- **Discussions**: https://github.com/lfaley/ProjectPlanner/discussions

### Related Folders
- **../PLANNING/**: Project planning templates
- **../CONTEXT-SUMMARY/**: AI context management
- **../DOCS-NEW-PROJECTS/**: New project guides
- **../DOCS-EXISTING-PROJECTS/**: Legacy improvement guides

---

**Last Updated:** November 16, 2025  
**Version:** 5.0  
**Maintainer:** ProjectPlanner Team  
**License:** MIT
