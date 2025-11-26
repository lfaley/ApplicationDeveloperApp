# RACI Matrix Template
## Roles and Responsibilities Framework

**Version:** 1.0  
**Created:** November 16, 2025  
**Purpose:** Clarify who does what to avoid confusion and ensure accountability

---

## What is a RACI Matrix?

**RACI** stands for:
- **R**esponsible: Who does the work
- **A**ccountable: Who makes final decisions and signs off
- **C**onsulted: Who provides input/expertise
- **I**nformed: Who needs to be kept updated

A RACI Matrix maps tasks/decisions to people, preventing:
- ❌ "I thought you were doing that!"
- ❌ "Who's responsible for this?"
- ❌ "Too many cooks in the kitchen"
- ❌ "Nobody signed off on this"

---

## RACI Role Definitions

### R - Responsible (The Doer)
**Who does the actual work**

- Executes the task
- Multiple people can be Responsible
- Must have skills/time to complete work
- Reports progress to Accountable person

**Example:** Developer writes code, QA tests features

---

### A - Accountable (The Buck Stops Here)
**Who makes final decisions and owns the outcome**

- ONE person only (never multiple)
- Has authority to say "yes/no"
- Signs off on completion
- Takes blame if things go wrong
- Gets credit when things go right

**Example:** Project lead approves features, CTO approves architecture

---

### C - Consulted (The Expert)
**Who provides input before decisions/actions**

- Two-way communication
- Asked for opinions/expertise
- Provides feedback that's considered
- Not necessarily followed (A decides)

**Example:** Senior dev reviews code, security expert reviews auth design

---

### I - Informed (The Stakeholder)
**Who needs to know what's happening**

- One-way communication
- Kept in the loop
- No input required
- Updated on progress/decisions

**Example:** Stakeholders get status reports, marketing informed of launch date

---

## RACI Rules

### Golden Rules
1. **Every task MUST have exactly ONE "A"** (decision-maker)
2. **Every task MUST have at least one "R"** (doer)
3. **Too many C's = paralysis** (limit consultations)
4. **Too many I's = spam** (inform only who needs to know)

### Common Mistakes
❌ **Multiple A's** → Who really decides?  
❌ **No A** → Nobody accountable, task drifts  
❌ **No R** → Great plan, no execution  
❌ **Everyone is C** → Meeting hell, no progress  
❌ **R but no A** → Work done but nobody approves it  

---

## RACI Matrix Template

### Basic Structure

|  | Person A | Person B | Person C | Person D |
|--|----------|----------|----------|----------|
| **Task/Decision 1** | R | A | C | I |
| **Task/Decision 2** | A, R | C | C | I |
| **Task/Decision 3** | C | R | A | - |

**Key:**
- **R** = Responsible (does the work)
- **A** = Accountable (approves/decides)
- **C** = Consulted (gives input)
- **I** = Informed (kept updated)
- **-** = Not involved

---

## Complete Project Example

```markdown
# RACI Matrix: Task Management App

**Project:** Task Management Application  
**Created:** 2025-11-16  
**Team:**
- **John Smith** - Project Lead
- **Jane Doe** - Backend Developer
- **Bob Wilson** - Frontend Developer
- **Alice Chen** - QA Engineer
- **Mike Brown** - DevOps
- **Sarah Johnson** - Stakeholder

---

## Development Phase

|  | John (Lead) | Jane (Backend) | Bob (Frontend) | Alice (QA) | Mike (DevOps) | Sarah (Stakeholder) |
|--|-------------|----------------|----------------|------------|---------------|---------------------|
| **Requirements gathering** | A | C | C | C | - | C |
| **Database schema design** | A | R | - | - | C | I |
| **API development** | C | A, R | C | - | - | I |
| **Frontend development** | C | C | A, R | - | - | I |
| **Authentication system** | A | R | C | C | C | I |
| **Testing** | A | C | C | R | - | I |
| **Code reviews** | A | C | C | C | - | - |
| **Deployment** | A | C | C | C | R | I |

---

## Architecture Decisions

|  | John (Lead) | Jane (Backend) | Bob (Frontend) | Alice (QA) | Mike (DevOps) | Sarah (Stakeholder) |
|--|-------------|----------------|----------------|------------|---------------|---------------------|
| **Choose database** | A | C | - | - | C | I |
| **Select framework** | A | C | C | - | C | I |
| **API design** | A | R | C | - | - | I |
| **Security approach** | A | C | C | C | C | I |
| **Hosting platform** | C | C | - | - | A | I |
| **CI/CD pipeline** | C | C | C | C | A | I |

---

## Documentation

|  | John (Lead) | Jane (Backend) | Bob (Frontend) | Alice (QA) | Mike (DevOps) | Sarah (Stakeholder) |
|--|-------------|----------------|----------------|------------|---------------|---------------------|
| **API documentation** | A | R | C | C | - | I |
| **User guide** | A | C | R | C | - | C |
| **Technical docs** | A | R | R | R | R | I |
| **PRD updates** | A | C | C | - | - | C |
| **ADR creation** | A | R | R | C | C | I |

---

## Release Management

|  | John (Lead) | Jane (Backend) | Bob (Frontend) | Alice (QA) | Mike (DevOps) | Sarah (Stakeholder) |
|--|-------------|----------------|----------------|------------|---------------|---------------------|
| **Release approval** | A | I | I | C | C | I |
| **Production deploy** | C | C | C | C | A, R | I |
| **Rollback decision** | A | C | C | C | C | I |
| **Launch announcement** | C | I | I | I | I | A, R |
| **Post-launch monitoring** | A | C | C | C | R | I |

---

## Incident Response

|  | John (Lead) | Jane (Backend) | Bob (Frontend) | Alice (QA) | Mike (DevOps) | Sarah (Stakeholder) |
|--|-------------|----------------|----------------|------------|---------------|---------------------|
| **Bug triage** | A | C | C | R | C | I |
| **Critical bug fix** | A | R | R | C | C | I |
| **Emergency deploy** | A | C | C | C | R | I |
| **Incident report** | A, R | C | C | C | C | I |
| **Post-mortem** | A | C | C | C | C | I |

---

## Analysis Notes

### Workload Distribution
- **John (Lead):** 16 Accountable, 11 Consulted → Decision-maker, high coordination
- **Jane (Backend):** 2 Accountable, 7 Responsible → Technical lead for backend
- **Bob (Frontend):** 2 Accountable, 4 Responsible → Technical lead for frontend
- **Alice (QA):** 0 Accountable, 3 Responsible → Execution role, needs more authority?
- **Mike (DevOps):** 3 Accountable, 4 Responsible → Infrastructure owner
- **Sarah (Stakeholder):** 1 Accountable, 17 Informed → Business owner, mostly updated

### Observations
✅ Every task has exactly one Accountable  
✅ No tasks without Responsible person  
⚠️ Alice (QA) only Responsible, never Accountable - consider promoting  
⚠️ Sarah consulted on requirements but not on PRD updates - should align  

### Recommendations
1. Make Alice accountable for "Test strategy"
2. Make Sarah accountable for "Feature prioritization"
3. Reduce John's Accountable count - delegate more
```

---

## RACI for Solo Developers

**Even working alone, RACI helps with:**
- Wearing multiple hats clearly
- Managing stakeholder expectations
- Knowing when to consult experts
- Deciding what to delegate vs. DIY

### Solo Developer RACI

|  | Me (Dev) | Client | Freelancer | Community |
|--|----------|--------|------------|-----------|
| **Requirements** | R | A, C | - | - |
| **Design** | A, R | C | - | C |
| **Development** | A, R | I | - | - |
| **Complex graphics** | C | C | A, R | - |
| **Testing** | A, R | C | - | - |
| **Deployment** | A, R | I | - | C |
| **Launch decision** | C | A | - | - |

---

## RACI Templates by Project Type

### Web Application

|  | Dev | Designer | QA | DevOps | PM | Stakeholder |
|--|-----|----------|----|----|----|----|
| **UI/UX design** | C | A, R | - | - | C | C |
| **Frontend dev** | A, R | C | - | - | C | I |
| **Backend dev** | A, R | - | - | C | C | I |
| **API integration** | A, R | - | C | C | C | I |
| **Testing** | C | - | A, R | - | C | I |
| **Deployment** | C | - | C | A, R | C | I |
| **Release approval** | C | - | C | C | A | C |

---

### Mobile App

|  | iOS Dev | Android Dev | Backend | QA | PM | Stakeholder |
|--|---------|-------------|---------|----|----|------------|
| **Feature spec** | C | C | C | C | A, R | C |
| **iOS development** | A, R | - | C | - | C | I |
| **Android development** | - | A, R | C | - | C | I |
| **API development** | C | C | A, R | - | C | I |
| **Cross-platform testing** | C | C | C | A, R | C | I |
| **App store submission** | A | A | - | C | C | I |

---

### Data Science Project

|  | Data Scientist | Engineer | Analyst | PM | Stakeholder |
|--|----------------|----------|---------|----|----|
| **Problem definition** | C | C | C | A | R |
| **Data collection** | R | A | C | C | I |
| **Model development** | A, R | C | C | C | I |
| **Pipeline implementation** | C | A, R | - | C | I |
| **Results analysis** | R | - | A, C | C | C |
| **Production deployment** | C | A, R | - | C | I |

---

## Creating Your RACI Matrix

### Step 1: List All Tasks/Decisions
- Break down project into activities
- Include both doing (development) and deciding (approvals)
- Don't forget documentation, testing, deployment

### Step 2: List All People/Roles
- Include team members
- Include stakeholders
- Include external consultants/vendors

### Step 3: Assign RACI
- Start with A (one per task!)
- Add R (who does the work)
- Add C (who needs to weigh in)
- Add I (who needs updates)

### Step 4: Validate
- Every row has one A? ✓
- Every row has at least one R? ✓
- Not too many C's? ✓
- I's are truly necessary? ✓

### Step 5: Review with Team
- Get agreement on assignments
- Adjust based on feedback
- Document and share

---

## RACI Conversations

### When Someone is Doing Work Without Approval
❌ "Why didn't you check with me first?!"  
✅ "Let's look at the RACI - I'm Accountable here, so please consult me before starting next time."

### When Too Many People are Involved
❌ "This meeting is a waste of time!"  
✅ "Based on RACI, only C's need to be consulted. Let's move others to Informed and send updates instead."

### When Nobody Owns a Task
❌ "I thought someone else was doing that!"  
✅ "This task has no Accountable person. Let's assign one now."

### When Someone is Overloaded
❌ "I can't do everything!"  
✅ "Your RACI shows 15 R's and 10 A's. Let's redistribute some to balance workload."

---

## RACI Maintenance

### When to Update RACI
- New team member joins
- Role responsibilities change
- Project phase changes
- After lessons learned (what worked/didn't)

### Review Cadence
- **Weekly:** Spot check problem areas
- **Sprint/milestone:** Full review
- **New phase:** Complete revision

---

## RACI Alternatives

### RAPID (Bain & Company)
- **R**ecommend: Propose action
- **A**gree: Must approve
- **P**erform: Do the work
- **I**nput: Provide information
- **D**ecide: Final say

Good for: Complex organizations with many approvers

### DACI (Intuit)
- **D**river: Leads the work
- **A**pprover: Makes decision
- **C**ontributor: Does work
- **I**nformed: Kept updated

Good for: Tech companies, agile teams

### RASCI (Add "S" for Support)
- **S**upport: Provides resources/assistance

Good for: Projects with support roles (HR, IT, etc.)

---

## Integration with Project Planning

**PRD.md** → List stakeholders and roles  
**IMPLEMENTATION_CHECKLIST.md** → Mark R (who does task)  
**ADRs** → Document A (who decided), C (who was consulted)  
**Risk Register** → Assign risk owners (A for mitigation)  
**Context Summaries** → Track who's responsible for blockers

---

## Best Practices

### DO ✅
- Keep it simple - one page if possible
- Review with team before finalizing
- Update when roles change
- Use RACI in planning meetings
- Reference RACI when confused
- Make RACI visible (wiki, docs)

### DON'T ❌
- Create RACI alone (it's a team tool)
- Make it too detailed (every tiny task)
- Set and forget (review regularly)
- Use as a weapon ("But RACI says!")
- Ignore team feedback on assignments
- Create without defining R/A/C/I clearly

---

## Quick RACI Reference

### Decision Tree

```
Is there work to do?
├─ YES → Assign at least one R
└─ NO → Informational only (all I)

Is there a decision to make?
├─ YES → Assign exactly one A
└─ NO → Skip A

Does anyone need to provide input?
├─ YES → Assign C's (limit to 2-3)
└─ NO → Skip C

Does anyone need to know the outcome?
├─ YES → Assign I's (only essential people)
└─ NO → Skip I
```

### Common Patterns

| Pattern | Meaning |
|---------|---------|
| **A, R** | Person decides AND does work (solo ownership) |
| **A only** | Person approves but doesn't do work |
| **R only** | Person does work but someone else approves |
| **C only** | Person gives input but doesn't do/approve |
| **I only** | Person just needs to know what happened |
| **-** | Person not involved at all |

---

## Blank RACI Template

```markdown
# RACI Matrix: [Project Name]

**Project:** [Project name]  
**Created:** [Date]  
**Team:**
- **[Name]** - [Role]
- **[Name]** - [Role]

---

## [Phase/Category Name]

|  | [Person 1] | [Person 2] | [Person 3] | [Person 4] |
|--|------------|------------|------------|------------|
| **[Task 1]** |  |  |  |  |
| **[Task 2]** |  |  |  |  |
| **[Task 3]** |  |  |  |  |

---

## Validation Checklist

- [ ] Every task has exactly one A
- [ ] Every task has at least one R
- [ ] No more than 3 C's per task
- [ ] I's are limited to essential people
- [ ] Workload appears balanced
- [ ] Team has reviewed and agreed

---

## Notes

[Any special considerations, exceptions, or clarifications]
```

---

## Conclusion

A RACI Matrix is a simple tool that prevents confusion and ensures accountability. It answers:

- "Who's doing this?" → **R**
- "Who approves it?" → **A**
- "Who should I ask?" → **C**
- "Who needs to know?" → **I**

**5 minutes to create, hours of confusion avoided.**

When someone asks "Who's responsible?" → Point to RACI.

---

**Version:** 1.0  
**Created:** November 16, 2025  
**License:** Free to use and adapt  
**Based on:** Industry standard RACI methodology
