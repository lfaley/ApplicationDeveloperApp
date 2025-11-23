# Context Summary Templates

## Overview
This folder contains all the templates and rules needed to implement a high-quality Context Summary system in any project. The Context Summary system provides Copilot with comprehensive project context, enabling intelligent assistance across multiple sessions and days.

## What's Included

### Core Files (Required)
1. **`ContextSummaryRules.md`** - Rules for creating and maintaining context summaries
2. **`CopilotConversationStarter.md`** - Instructions for Copilot to follow at conversation start
3. **`Context_Summary_Template.md`** - Template for daily context summary files

### Optional Files
4. **`Project_Structure_Template.md`** - Template for documenting project architecture
5. **`Decision_Log_Template.md`** - Template for tracking technical decisions

## Quick Start

### For New Projects

1. **Copy this entire TEMPLATES folder** to your new project root:
   ```
   YourProject/
   ├── Context-Summaries/
   │   ├── ContextSummaryRules.md
   │   ├── CopilotConversationStarter.md
   │   └── Context_Summary_YYYY-MM-DD.md  (create from template)
   └── ProjectPlanning/  (optional)
   ```

2. **Customize the template files:**
   - Update project name in all files
   - Adjust timezone in ContextSummaryRules.md (default: Central Time)
   - Modify section headings to match your project needs

3. **Start your first conversation with Copilot:**
   ```
   "Hello friend. Please review the CopilotConversationStarter.md file and 
   perform every action and sub-action it refers to."
   ```

### For Existing Projects

1. **Create Context-Summaries folder** in your project root
2. **Copy template files** from this folder
3. **Create your first Context_Summary file** using today's date
4. **Have Copilot document** your current project state in the new file

## File Descriptions

### ContextSummaryRules.md
**Purpose:** Defines how context summaries are created, structured, and maintained.

**Key Features:**
- File naming conventions (`Context_Summary_YYYY-MM-DD.md`)
- Update frequency (per conversation, timestamped entries)
- Required sections (Overview, Previous Context, Current Work, etc.)
- Timezone standards (Central Time by default)
- When to create new files (new day = new file)

**Critical Rules:**
- Never overwrite existing content
- Always add new timestamped entries
- One folder per day
- New file every 20 promts
- Use Central Time (Lee's Summit, MO) for timestamps

### CopilotConversationStarter.md
**Purpose:** Instructions for Copilot to execute at the start of every conversation.

**Key Features:**
- Automatic file review workflow
- Context-Summaries folder scanning
- ProjectPlanning folder review
- Error detection and correction protocols
- Context Summary update triggers

**Critical Instructions:**
- Review all Context-Summaries files
- Review all ProjectPlanning files (if exists)
- Ask user what to focus on
- Update Context_Summary after each interaction
- Never delete existing CS entries, only add new ones

### Context_Summary_Template.md
**Purpose:** Structured template for daily context summary files.

**Key Sections:**
1. **Session Overview** - High-level goals and context
2. **Previous Context** - Link to previous day, major decisions
3. **Current Work** - What's being worked on now
4. **File Changes** - Modified/created/deleted files
5. **Important Notes** - Key decisions, blockers, next steps
6. **Timeline Entries** - Timestamped conversation log

**Usage:**
- Copy this template for each new day
- Fill in Session Overview at start of day
- Add timestamped entries as work progresses
- Update regularly throughout the day

## Benefits

### For Developers
- **Session Continuity:** Pick up exactly where you left off
- **Knowledge Base:** Search past decisions and implementations
- **Onboarding:** New team members understand project history
- **Documentation:** Automatic documentation as you work
- **Decision Tracking:** Never forget why something was done

### For Copilot
- **Deep Context:** Understands full project history
- **Better Suggestions:** Makes informed recommendations
- **Consistency:** Follows established patterns and decisions
- **Error Prevention:** Knows what's been tried before
- **Proactive Help:** Anticipates needs based on history

## Best Practices

### Daily Workflow

**Morning (Start of Session):**
1. Open previous day's Context_Summary file
2. Start conversation: "Review the context summary file"
3. Copilot reads it and understands where you left off
4. Create new Context_Summary file for today (if new day)

**Throughout the Day:**
- Copilot automatically updates Context_Summary after each change
- Timestamped entries added for each action
- Decisions documented in real-time
- File changes tracked automatically

**Evening (End of Session):**
- Review the day's Context_Summary
- Ensure all major decisions are documented
- Note any blockers or next steps for tomorrow

### File Organization

**Recommended Structure:**
```
YourProject/
├── Context-Summaries/
│   ├── ContextSummaryRules.md
│   ├── CopilotConversationStarter.md
│   ├── Context_Summary_2025-01-15.md
│   ├── Context_Summary_2025-01-16.md
│   ├── Context_Summary_2025-01-17.md
│   └── YYYY-MM-DD/  (optional: archive by date)
│       ├── Context_Summary_2025-01-15_01.md
│       └── Context_Summary_2025-01-15_02.md
└── ProjectPlanning/  (optional but recommended)
    ├── ProjectOverview.md
    ├── TechnicalSpec.md
    └── Implementation_Plan.md
```

### Writing Guidelines

**DO:**
- ✅ Use timestamps in Central Time (or your timezone)
- ✅ Document WHY decisions were made, not just WHAT
- ✅ Include code snippets for important changes
- ✅ Note blockers and their resolutions
- ✅ Link to related files and documentation
- ✅ Use clear section headers
- ✅ Add tables for complex comparisons
- ✅ Mark completed tasks with ✅
- ✅ Mark in-progress tasks with 🔄
- ✅ Mark blocked/pending tasks with ⏳

**DON'T:**
- ❌ Delete or overwrite existing entries
- ❌ Create multiple files for the same day (unless archiving)
- ❌ Skip timestamps on entries
- ❌ Use vague descriptions ("fixed bug" → "Fixed OAuth redirect bug by...")
- ❌ Forget to document decisions
- ❌ Let files grow beyond 1000 lines without archiving

## Customization

### Timezone
Edit `ContextSummaryRules.md` and `CopilotConversationStarter.md`:
```markdown
# Change from:
Always use the time that it is in Lee's Summit, Mo 64064 for all records.

# To:
Always use the time that it is in [Your City, Your State/Country] for all records.
```

### Section Headings
Edit `Context_Summary_Template.md` to match your project needs:
- Add "Performance Metrics" section
- Add "Security Considerations" section
- Add "API Changes" section
- Customize to your workflow

### Review Triggers
Edit `CopilotConversationStarter.md` to change what Copilot reviews:
- Add specific folders to review
- Add specific file patterns to check
- Add custom validation steps
- Add project-specific rules

## Examples from EmailMonitor Project

### Excellent Context Summary Entries
See `../Context_Summary_2025-11-16.md` for examples of:
- ✅ Clear session overview with goals and context
- ✅ Previous context linking to prior sessions
- ✅ Detailed implementation documentation
- ✅ Technical decision explanations with trade-offs
- ✅ Comparison tables (PWA vs Native)
- ✅ Timestamped timeline entries
- ✅ File changes documentation
- ✅ Next steps and recommendations

### Project Organization
See `../../ProjectPlanning/` folder for examples of:
- `ProjectOverview.md` - Complete technical specification
- `PROJECT_COMPLETE.md` - Milestone documentation
- `PWA_Implementation_Plan.md` - Phase-by-phase plans
- Various troubleshooting guides

## Advanced Features

### Multi-Session Archiving
For very active days, create subfolders:
```
Context-Summaries/
└── 2025-01-15/
    ├── Context_Summary_2025-01-15_01.md  (morning session)
    ├── Context_Summary_2025-01-15_02.md  (afternoon session)
    └── Context_Summary_2025-01-15_03.md  (evening session)
```

Update the main `Context_Summary_2025-01-15.md` to link to these subsessions.

### Integration with Other Tools
- **Git Commits:** Reference commit hashes in Context_Summary
- **Issue Trackers:** Link to GitHub/Jira issues
- **Documentation:** Link to Wiki pages or API docs
- **CI/CD:** Note deployment statuses and build results

### Search and Discovery
Use VS Code search to find:
- Previous implementations: Search for function/class names
- Past decisions: Search for keywords like "DECISION:" or "WHY:"
- Blockers: Search for "BLOCKED" or "⏳"
- Completed features: Search for "✅"

## Maintenance

### Weekly
- Review week's Context_Summary files
- Consolidate major decisions into ProjectPlanning docs
- Archive old Context_Summary files if needed
- Update ProjectOverview.md with new features

### Monthly
- Create monthly summary of major changes
- Review and update templates if workflow changed
- Clean up archived Context_Summary files
- Update README with new learnings

### Project Milestones
- Document major releases in Context_Summary
- Create dedicated milestone documents
- Link Context_Summary entries to milestone docs
- Archive pre-milestone Context_Summary files

## Troubleshooting

### Copilot not following rules?
- Verify `CopilotConversationStarter.md` is in Context-Summaries folder
- Start conversation with: "Review the CopilotConversationStarter.md file"
- Ensure ContextSummaryRules.md has clear instructions

### Context_Summary getting too large?
- Archive into subfolder by date
- Create new file for new session
- Link to archived files in new Context_Summary

### Missing information in Context_Summary?
- Be explicit with Copilot: "Document this decision in Context_Summary"
- Review ContextSummaryRules.md for required sections
- Add more detail to template sections

### Copilot creating duplicate files?
- Check file naming matches template: `Context_Summary_YYYY-MM-DD.md`
- Verify only one file per date exists
- If multiple sessions, use subfolder structure

## Success Metrics

You'll know the system is working when:
- ✅ You can resume work instantly after days/weeks away
- ✅ New team members understand the project quickly
- ✅ Copilot makes better suggestions
- ✅ You never ask "Why did we do it this way?"
- ✅ Onboarding takes hours instead of days
- ✅ Documentation stays up-to-date automatically
- ✅ Fewer repeated mistakes
- ✅ Better long-term decision making

## Support

For questions or improvements to these templates:
1. Create an issue in your project repo
2. Document the issue in your Context_Summary
3. Update templates based on learnings
4. Share improvements back to this template folder

## License

These templates are free to use and modify for any project. Attribution appreciated but not required.

---

**Created from the EmailMonitor project's Context Summary system**
**Based on real-world usage from November 2025**
**Proven to work with GitHub Copilot in VS Code**
