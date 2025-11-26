# Copilot Conversation Starter

## 🎯 Purpose
This file contains instructions for GitHub Copilot to follow at the START of EVERY conversation. By following these rules, Copilot will have full context of the project and can provide intelligent, context-aware assistance.

---

## 👋 Suggested User Prompts

When starting a new conversation with Copilot, use one of these prompts:

### Option 1: Full Context Review (Recommended)
```
Hello friend. Please review the CopilotConversationStarter.md file and perform 
every action and sub-action it refers to. Once you have reviewed all files in 
the Context-Summaries folder and the ProjectPlanning folder, create the new 
iteration of the context_summary file for today and prompt me.
```

### Option 2: Quick Resume
```
Review the context summary file and tell me where we left off.
```

### Option 3: New Day Start
```
Create today's context summary file based on yesterday's session.
```

### Option 4: Specific Focus
```
Review the context summary and focus on [specific feature/bug/area].
```

---

## 🤖 Instructions for Copilot

### STEP 1: Review Context-Summaries Folder

**Action:** Read ALL files in the `Context-Summaries/` folder

**Priority Order:**
1. **ContextSummaryRules.md** - Read FIRST to understand documentation standards
2. **Most recent Context_Summary_YYYY-MM-DD.md** - Read SECOND to understand current state
3. **All other Context_Summary files** - Read to understand project history (newest to oldest)
4. **Archived sessions** (if any) - Read subfolder files for detailed history

**What to extract:**
- Current project status (what's complete, in-progress, blocked)
- Recent decisions and their rationale
- Active blockers or issues
- Next planned steps
- Technology stack and architecture
- Recent file changes
- Important patterns or conventions established

### STEP 2: Review ProjectPlanning Folder (if exists)

**Action:** Read ALL files in the `ProjectPlanning/` folder (if it exists)

**Common files to look for:**
- `ProjectOverview.md` - High-level technical specification
- `PROJECT_COMPLETE.md` or similar - Milestone documentation
- `*_Implementation_Plan.md` - Phase-by-phase implementation plans
- `*_Guide.md` - Setup, deployment, or troubleshooting guides
- `Technical_Spec.md` - Detailed technical specifications
- Architecture diagrams or decision logs

**What to extract:**
- Overall project goals and scope
- Technical architecture and design patterns
- Implementation phases and current phase
- Technology choices and rationale
- Known limitations or constraints
- Deployment strategies

### STEP 3: Ask User What to Focus On

**Action:** After reviewing all documentation, present user with focused options

**Prompt Template:**
```markdown
I've reviewed your Context Summaries and ProjectPlanning docs. Here's what I understand:

**Current Status:**
- [Summary of current state from most recent CS]
- [Last completed work]
- [Any blockers or pending items]

**What would you like to focus on today?**

**Option 1: Review Project Code**
- Scan all source files for errors or inconsistencies
- Validate implementation against documentation
- Check for best practices and improvements

**Option 2: Review Specific Folder**
- Deep dive into a particular area (e.g., `src/services/`)
- Check for issues in specific component

**Option 3: Review Specific File**
- Detailed analysis of a particular file
- Code quality assessment and suggestions

**Option 4: Continue Current Work**
- [Continue with specific feature/task from CS]
- Pick up where we left off

**Option 5: Fix Errors**
- If you're experiencing issues, let me know
- I'll diagnose and fix using full project context

**Option 6: Something Else**
- Tell me what you'd like to work on
```

### STEP 4: Context Summary Management

**Rules for Context Summary (CS) Files:**

#### Abbreviations
- "Context_Summary" can be abbreviated as "CS" or "cs"
- Use full name in file names: `Context_Summary_YYYY-MM-DD.md`

#### File Location
- Most recent file = most recent date in `Context-Summaries/` folder
- If today's date file doesn't exist, create it
- Never modify files from previous dates (append to current day only)

#### Creating New CS File (New Day)
**When:** First conversation of a new calendar day

**Steps:**
1. Check if `Context_Summary_[TODAY].md` exists
2. If NO, create new file:
   - Copy structure from Context_Summary_Template.md
   - Name: `Context_Summary_YYYY-MM-DD.md` (use TODAY'S date)
   - Add "Previous Context" section summarizing previous day
   - Start new "Session Overview" with today's goals
3. If YES, use existing file for today

**New File Template:**
```markdown
# Context Summary - [Month Day, Year]

## Session Overview
**Goal:** [What we're trying to accomplish today]

**Context:** [Why we're doing this work]

## Previous Context
- **[Previous Date]:** [Summary of previous session]
  - [Key accomplishment 1]
  - [Key accomplishment 2]
  - **DECISION:** [Any major decisions]
  - **BLOCKER:** [Any ongoing blockers]

## Current Work
[What we're working on now]

## File Changes
### Modified Files
### Created Files
### Deleted Files

## Important Notes

---

[Start timeline entries here]
```

#### Updating Existing CS File
**When:** Throughout the conversation, after ANY significant action

**What counts as "significant action":**
- Creating or modifying files
- Executing commands
- Making technical decisions
- Fixing bugs
- Answering user questions that lead to changes
- Completing tasks or phases
- Encountering/resolving blockers

**How to update:**
1. **NEVER delete or overwrite existing entries**
2. **ALWAYS add new content** to appropriate sections
3. Add timestamped entry to Timeline section:
   ```markdown
   ## [YYYY-MM-DD | HH:MM TIMEZONE] Title
   
   **User Request:** What user asked for
   
   **Actions Taken:**
   - List what was done
   - Include file changes
   - Include decisions made
   
   **Outcome:** Result of actions
   
   **Status:** ✅ Complete / 🔄 In Progress / ⏳ Pending / ❌ Blocked
   ```
4. Update "Current Work" section with progress
5. Update "File Changes" section with any new/modified files
6. Add to "Important Notes" if decision was made

### STEP 5: Timezone Standards

**Always use:** The timezone specified in ContextSummaryRules.md

**Default (if not customized):** Central Time (Lee's Summit, MO 64064)

**Timestamp Format:** `[YYYY-MM-DD | HH:MM TIMEZONE]`

**Examples:**
- `[2025-11-16 | 09:30 CT]`
- `[2025-11-16 | 14:45 CT]`
- `[2025-11-16 | 22:15 CT]`

**Get current time in timezone:**
- Use system time and convert to specified timezone
- If uncertain, ask user for current time

### STEP 6: Project Structure Standards

**Code Quality Guidelines:**
1. **Always add helpful comments** to code:
   - Function purpose and parameters
   - Complex logic explanations
   - WHY something is done (not just WHAT)
   - TODO comments for future improvements

2. **Ensure good project structure:**
   - Follow existing folder organization
   - Keep related files together
   - Use clear, descriptive file names
   - Maintain consistent naming conventions

3. **Document architectural decisions:**
   - Why a particular approach was chosen
   - What alternatives were considered
   - Trade-offs of the decision

### STEP 7: Error Detection and Correction

**If user mentions errors:**

1. **Gather context:**
   - What is the error message?
   - When does it occur?
   - What was user trying to do?

2. **Use full project context:**
   - Review relevant files
   - Check Context Summary for similar past issues
   - Review ProjectPlanning docs for architecture

3. **Diagnose systematically:**
   - Identify root cause (don't just fix symptoms)
   - Check for related issues
   - Consider impact on other components

4. **Fix and document:**
   - Implement fix
   - Test if possible
   - Document in Context Summary:
     - What the error was
     - Why it occurred
     - How it was fixed
     - How to prevent in future

5. **Update Context Summary** with:
   - Error description and reproduction steps
   - Root cause analysis
   - Solution implemented
   - Files modified
   - Testing results

---

## 📋 Conversation Flow Checklist

Use this checklist at the START of every conversation:

- [ ] Read `ContextSummaryRules.md` to understand standards
- [ ] Read most recent `Context_Summary_YYYY-MM-DD.md` file
- [ ] Read other Context_Summary files (newest to oldest) for history
- [ ] Read all files in `ProjectPlanning/` folder (if exists)
- [ ] Extract current status, blockers, next steps
- [ ] Check if new CS file needed for today (new day = new file)
- [ ] If new day, create new CS file with Previous Context section
- [ ] Present user with focused options based on current state
- [ ] After user chooses, begin work
- [ ] Update CS file after EVERY significant action
- [ ] Use correct timezone for all timestamps
- [ ] Never delete existing CS entries, only add new ones

---

## 🎨 Customization Guide

### Change Timezone
Find this line in YOUR copy and update:
```markdown
**Always use:** Central Time (Lee's Summit, MO 64064)
```

Change to:
```markdown
**Always use:** [Your Timezone] ([Your City, State/Country])
```

### Add Custom Review Steps
Add project-specific review steps to STEP 2:

```markdown
### STEP 2.5: Review [Custom Folder]

**Action:** Read all files in `[YourCustomFolder]/`

**What to extract:**
- [Custom information relevant to your project]
```

### Add Custom Workflow
Add project-specific workflow steps:

```markdown
### STEP 7: [Custom Workflow Name]

**Action:** [What Copilot should do]

**How:** [Step-by-step instructions]

**Document in CS:**
- [What to document]
```

---

## ⚠️ Critical Rules - Never Break These

### 1. NEVER Delete Existing Context Summary Entries
❌ **WRONG:**
```markdown
[Delete old content and replace with new]
```

✅ **RIGHT:**
```markdown
[Keep old content, add new entries below]
```

### 2. ALWAYS Update CS After Significant Actions
Don't wait until end of conversation - update as you go!

### 3. ALWAYS Use Specified Timezone
Check ContextSummaryRules.md for correct timezone.

### 4. NEW Day = NEW File
If date changed, create new `Context_Summary_YYYY-MM-DD.md` file.

### 5. ALWAYS Add "Why" Context
Never just say "did X" - explain "did X because Y"

### 6. ALWAYS Follow ContextSummaryRules.md
That file is the source of truth for documentation standards.

---

## 📝 Templates for Common Scenarios

### Template: New Feature Implementation
```markdown
## [YYYY-MM-DD | HH:MM TZ] [Feature Name] Implementation

**User Request:** Implement [feature name] to [accomplish goal]

**Implementation Approach:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Technical Decisions:**
- **DECISION:** [Decision made]
- **WHY:** [Rationale]
- **ALTERNATIVES CONSIDERED:** [Other options]
- **TRADE-OFFS:** [Pros and cons]

**Files Created:**
- `[file path]` - [Purpose]

**Files Modified:**
- `[file path]` - [Changes made]

**Testing:**
- [How it was tested]
- [Test results]

**Outcome:** [Result]

**Status:** ✅ Complete
```

### Template: Bug Fix
```markdown
## [YYYY-MM-DD | HH:MM TZ] Fix [Bug Description]

**User Report:** [What user experienced]

**Reproduction Steps:**
1. [Step 1]
2. [Step 2]
3. [Error occurs]

**Root Cause Analysis:**
- **Issue:** [What was wrong]
- **Why it happened:** [Root cause]
- **Impact:** [What was affected]

**Solution:**
- [What was changed]
- [Why this fix works]

**Files Modified:**
- `[file path]` - [Specific changes]

**Testing:**
- [How fix was verified]
- [Edge cases checked]

**Prevention:**
- [How to prevent in future]
- [Any related issues to check]

**Status:** ✅ Fixed
```

### Template: Decision Making
```markdown
## [YYYY-MM-DD | HH:MM TZ] Decision: [Decision Title]

**Context:** [What prompted this decision]

**Options Considered:**

| Option | Pros | Cons | Cost |
|--------|------|------|------|
| Option A | [Pros] | [Cons] | [Cost/Effort] |
| Option B | [Pros] | [Cons] | [Cost/Effort] |
| Option C | [Pros] | [Cons] | [Cost/Effort] |

**Decision:** [Chosen option]

**Rationale:**
- [Why this option]
- [Key factors in decision]
- [Trade-offs accepted]

**Implementation Plan:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Impact:**
- [What this affects]
- [Who needs to know]
- [Follow-up required]

**Status:** 🔄 In Progress
```

---

## 🔍 Debugging Guide for Copilot

**If Copilot isn't following these rules:**

1. **User should say:**
   ```
   "Review the CopilotConversationStarter.md file and follow all instructions"
   ```

2. **Copilot should:**
   - Re-read this file completely
   - Re-read ContextSummaryRules.md
   - Re-read most recent Context_Summary file
   - Ask user what went wrong
   - Correct behavior going forward

**If Context_Summary updates are missing:**

1. Check that Copilot read ContextSummaryRules.md
2. Remind Copilot: "Update the Context Summary with this conversation"
3. Verify timezone is correct
4. Verify file naming is correct (Context_Summary_YYYY-MM-DD.md)

**If Copilot deleted existing entries:**

1. User should say: "NEVER delete existing Context Summary entries, only add new ones"
2. If possible, restore from git history
3. Add reminder to Important Notes section

---

## ✅ Success Indicators

You'll know this system is working when:

1. ✅ Copilot reviews all docs at conversation start
2. ✅ Copilot understands project context immediately
3. ✅ Copilot updates Context Summary automatically
4. ✅ No existing entries are deleted
5. ✅ All timestamps use correct timezone
6. ✅ Decisions are documented with rationale
7. ✅ You can resume work after days/weeks away seamlessly

---

## 📚 Related Files

- **ContextSummaryRules.md** - Documentation standards and structure
- **Context_Summary_Template.md** - Empty template for new daily files
- **Context_Summary_YYYY-MM-DD.md** - Daily context summaries
- **ProjectPlanning/** - Long-term plans and architecture docs

---

**Last Updated:** 2025-11-16  
**Version:** 2.0  
**Based on:** EmailMonitor project's proven workflow  
**Compatible with:** GitHub Copilot in VS Code
