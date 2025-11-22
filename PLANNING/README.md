# Planning Templates

**Comprehensive project planning and strategy templates**

## 📁 What's in This Folder

| Document | Lines | Purpose |
|----------|-------|---------|
| **[TOKEN_EFFICIENT_KICKOFF.md](./TOKEN_EFFICIENT_KICKOFF.md)** | 1,075 | 3-minute project kickoff (52% token savings) |
| **[PLAN_OF_ATTACK_TEMPLATE.md](./PLAN_OF_ATTACK_TEMPLATE.md)** | 900+ | Multi-step task breakdown system |
| **[PROJECT_PLANNING_TEMPLATE.md](./PROJECT_PLANNING_TEMPLATE.md)** | 800+ | Comprehensive project planning framework |
| **[INTERACTIVE_PROJECT_KICKOFF.md](./INTERACTIVE_PROJECT_KICKOFF.md)** | 700+ | Interactive planning questionnaire |
| **[ARCHITECTURE_DECISION_RECORD_TEMPLATE.md](./ARCHITECTURE_DECISION_RECORD_TEMPLATE.md)** | 500+ | Document technical decisions (ADRs) |
| **[RACI_MATRIX_TEMPLATE.md](./RACI_MATRIX_TEMPLATE.md)** | 400+ | Responsibility assignment matrix |
| **[RISK_REGISTER_TEMPLATE.md](./RISK_REGISTER_TEMPLATE.md)** | 400+ | Risk identification and management |
| **[SUPPLEMENTAL_TEMPLATES.md](./SUPPLEMENTAL_TEMPLATES.md)** | 300+ | Additional planning templates |
| **[ANALYSIS_SUMMARY.md](./ANALYSIS_SUMMARY.md)** | 200+ | Project analysis documentation |
| **[RESEARCH_SUMMARY.md](./RESEARCH_SUMMARY.md)** | 200+ | Research findings documentation |

**Total:** 5,000+ lines of planning documentation

## 🎯 Use Cases

### New Projects
- Kickstart planning with token-efficient questionnaire
- Break down features into tasks
- Document architecture decisions
- Plan sprints and milestones

### Existing Projects
- Create improvement roadmaps
- Document technical debt
- Plan refactorings
- Track ongoing work

### Team Collaboration
- Assign responsibilities with RACI matrix
- Track risks and mitigation strategies
- Document decisions for future reference
- Align on project goals

## 🚀 Quick Start

### Option 1: Token-Efficient Kickoff (Recommended)
**Perfect for AI-assisted planning with 52% fewer tokens**

1. Open `TOKEN_EFFICIENT_KICKOFF.md`
2. Copy questionnaire to AI chat (Copilot, ChatGPT, etc.)
3. Answer 10 quick questions (3 minutes)
4. AI generates complete project plan

**Time:** 3 minutes  
**Tokens:** ~5,500 (vs 11,500+ for traditional)  
**Output:** Complete project plan with features, tech stack, timeline

### Option 2: Comprehensive Planning
**For complex projects needing detailed planning**

1. Use `PROJECT_PLANNING_TEMPLATE.md`
2. Fill in all sections thoroughly
3. Reference other templates as needed
4. Create living document that evolves

**Time:** 30-60 minutes  
**Depth:** Comprehensive coverage  
**Output:** Detailed project blueprint

### Option 3: Interactive Kickoff
**For collaborative team planning**

1. Open `INTERACTIVE_PROJECT_KICKOFF.md`
2. Run through questionnaire with team
3. Document answers in real-time
4. Use outputs to guide development

**Time:** 15-30 minutes  
**Participants:** Whole team  
**Output:** Aligned understanding across team

## 📖 How to Use Each Template

### TOKEN_EFFICIENT_KICKOFF.md ⭐ (Start Here!)
**Purpose:** Lightning-fast project kickoff with AI assistance.

**How to use:**
```
# Copy questionnaire to Copilot/ChatGPT
1. What are you building? (One sentence)
2. Who is it for? (Primary users)
3. What's the main problem it solves?
4. What are the top 3 must-have features?
5. What tech stack are you considering?
6. Any constraints? (budget, timeline, team size)
7. Success looks like...
8. What's your biggest concern?
9. Who will use it first? (beta users)
10. When do you want to launch?
```

**AI Output:**
- Project overview
- Feature breakdown
- Tech stack recommendations
- Development phases
- Timeline estimate
- Risk assessment

**Benefit:** Get comprehensive plan in 3 minutes vs 15+ minutes traditional approach.

### PLAN_OF_ATTACK_TEMPLATE.md
**Purpose:** Break down features into actionable tasks.

**When to use:**
- Starting a new feature
- Planning a sprint
- Breaking down complex work
- Estimating effort

**Structure:**
```markdown
# Feature: User Authentication

## Goal
Enable users to securely log in and manage sessions.

## Tasks
1. [ ] Design login UI
2. [ ] Implement JWT authentication
3. [ ] Add password hashing
4. [ ] Create login endpoint
5. [ ] Add session management
6. [ ] Write tests

## Dependencies
- Database setup complete
- User model defined

## Estimates
- UI: 4 hours
- Backend: 8 hours
- Tests: 4 hours
Total: 16 hours (2 days)
```

### ARCHITECTURE_DECISION_RECORD_TEMPLATE.md
**Purpose:** Document important technical decisions (why, not just what).

**When to use:**
- Choosing technologies
- Architectural patterns
- Major refactorings
- Third-party integrations

**Format:**
```markdown
# ADR-001: Use PostgreSQL for Database

## Status
Accepted

## Context
Need to choose database for e-commerce application with complex relational data.

## Decision
Use PostgreSQL as primary database.

## Consequences
**Positive:**
- ACID compliance
- Complex queries support
- JSON support for flexibility

**Negative:**
- Need to manage scaling
- Team needs SQL knowledge
```

### RACI_MATRIX_TEMPLATE.md
**Purpose:** Clarify roles and responsibilities.

**When to use:**
- Team projects
- Cross-functional work
- Delegating tasks
- Avoiding confusion

**Example:**
| Task | Alice | Bob | Carol | Dave |
|------|-------|-----|-------|------|
| API Design | R | A | C | I |
| Frontend | I | R | A | C |
| Database | C | I | R | A |

**Legend:**
- **R** = Responsible (does the work)
- **A** = Accountable (final approval)
- **C** = Consulted (provides input)
- **I** = Informed (kept updated)

### RISK_REGISTER_TEMPLATE.md
**Purpose:** Identify and manage project risks.

**When to use:**
- Project planning phase
- Before major milestones
- When scope changes
- Regular risk reviews

**Example:**
| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| API rate limits | High | Medium | Implement caching, use fallbacks | Bob |
| Team member leaves | Low | High | Document knowledge, pair programming | Alice |

### PROJECT_PLANNING_TEMPLATE.md
**Purpose:** Comprehensive project blueprint.

**Sections:**
- Executive summary
- Goals and success criteria
- User personas
- Feature list with priorities
- Technical architecture
- Timeline and milestones
- Budget and resources
- Risks and mitigation

**Best for:** Large projects, formal planning, stakeholder communication.

### INTERACTIVE_PROJECT_KICKOFF.md
**Purpose:** Collaborative planning session guide.

**How to run:**
1. Schedule 30-minute kickoff meeting
2. Go through questions together
3. Document answers in real-time
4. Use outputs to create project plan

**Best for:** Team alignment, brainstorming, getting buy-in.

## 💡 Pro Tips

### 1. Start with Token-Efficient Kickoff
```
# In Copilot/ChatGPT:
Use TOKEN_EFFICIENT_KICKOFF.md to plan my project:

[Paste questionnaire]
[Answer questions]
```

AI generates comprehensive plan in minutes.

### 2. Create Living Documents
```
# Don't treat these as one-time exercises
- Update PLAN_OF_ATTACK as you learn
- Add ADRs when making decisions
- Review RISK_REGISTER weekly
- Evolve PROJECT_PLANNING as scope changes
```

### 3. Link to Context Summaries
```markdown
# In context summary:
See PLAN_OF_ATTACK_TEMPLATE.md for feature breakdown.
See ADR-005 for database decision (ARCHITECTURE_DECISION_RECORD_TEMPLATE.md).
```

### 4. Use for Sprint Planning
```
# Each sprint:
1. Review PLAN_OF_ATTACK
2. Pick top priority tasks
3. Update RACI_MATRIX for assignments
4. Check RISK_REGISTER for blockers
```

### 5. Share with Stakeholders
```
# Communicate progress:
- Executive summary from PROJECT_PLANNING_TEMPLATE
- Feature status from PLAN_OF_ATTACK
- Decisions from ADRs
- Risks from RISK_REGISTER
```

## 🎯 Common Workflows

### Workflow 1: New Project
```
Day 1:
1. TOKEN_EFFICIENT_KICKOFF.md with AI (3 min)
2. PROJECT_PLANNING_TEMPLATE.md (30 min)
3. RISK_REGISTER_TEMPLATE.md (15 min)

Week 1:
4. PLAN_OF_ATTACK for first feature (20 min)
5. RACI_MATRIX for team (10 min)

Ongoing:
6. Add ADRs for major decisions (5 min each)
```

### Workflow 2: Sprint Planning
```
Pre-Sprint:
1. Review PLAN_OF_ATTACK
2. Identify top priorities
3. Update RISK_REGISTER

Sprint Start:
4. Assign tasks (RACI_MATRIX)
5. Break down stories (PLAN_OF_ATTACK)
6. Estimate effort

Sprint End:
7. Update progress
8. Document decisions (ADRs)
9. Identify new risks
```

### Workflow 3: Major Decision
```
1. Identify decision needed
2. Research options (RESEARCH_SUMMARY.md)
3. Analyze trade-offs (ANALYSIS_SUMMARY.md)
4. Document decision (ADR)
5. Update plan if needed
```

## 📊 Template Comparison

| Template | Time | Depth | Best For |
|----------|------|-------|----------|
| **TOKEN_EFFICIENT_KICKOFF** | 3 min | Quick | Initial planning with AI |
| **INTERACTIVE_PROJECT_KICKOFF** | 15 min | Medium | Team kickoff meetings |
| **PROJECT_PLANNING_TEMPLATE** | 60 min | Deep | Comprehensive planning |
| **PLAN_OF_ATTACK** | 20 min | Medium | Feature breakdown |
| **ADR** | 5 min | Focused | Technical decisions |
| **RACI_MATRIX** | 10 min | Simple | Role clarity |
| **RISK_REGISTER** | 15 min | Medium | Risk management |

## 🔗 Related Folders

- **[../CONTEXT-SUMMARY/](../CONTEXT-SUMMARY/)** - Document planning decisions
- **[../TESTING/](../TESTING/)** - Plan testing strategy
- **[../DOCS-NEW-PROJECTS/](../DOCS-NEW-PROJECTS/)** - New project setup guides
- **[../DOCS-EXISTING-PROJECTS/](../DOCS-EXISTING-PROJECTS/)** - Improvement planning
- **[../GUI/](../GUI/)** - Automate copying templates to projects

## 🎓 Learning Path

### Week 1: Quick Planning
- Use TOKEN_EFFICIENT_KICKOFF for rapid planning
- Create simple PLAN_OF_ATTACK documents
- Start documenting decisions with ADRs

### Week 2: Comprehensive Planning
- Fill out PROJECT_PLANNING_TEMPLATE
- Create RISK_REGISTER
- Set up RACI_MATRIX for team

### Week 3: Advanced Planning
- Run INTERACTIVE_PROJECT_KICKOFF with team
- Use RESEARCH_SUMMARY for analysis
- Link planning docs to Context Summaries

### Week 4: Mastery
- Planning becomes habit (5-10 min per feature)
- ADRs automatic for major decisions
- Risk management integrated into workflow

---

**Ready to plan smarter?** Start with `TOKEN_EFFICIENT_KICKOFF.md` for instant results!
