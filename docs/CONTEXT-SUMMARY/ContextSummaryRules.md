# Context Summary Rules

## 📋 How to Use This File

### For Continuing Work Today
- This file defines the rules for creating and maintaining Context Summary files
- Context Summary files are automatically updated with each conversation
- New timestamped entries are added to the timeline section
- All decisions, changes, and progress are documented

### For Starting New Conversations
1. **Open the most recent Context Summary file** in VS Code before starting
2. **Say**: "Review the context summary file" or "Read the latest context summary"
3. Copilot will read it and understand where you left off

### For Tomorrow (Next Day)
1. **Say**: "Create today's context summary file based on yesterday's session" OR "Review the CopilotConversationStarter.md file"
2. Copilot will:
   - Read the most recent Context Summary file
   - Create new file for current date
   - Add "Previous Session Summary" section at the top
   - Continue with new timestamped entries for the new day

### File Naming Convention
- **Format:** `Context_Summary_YYYY-MM-DD.md`
- **One file per day** (primary)
- **Most recent file** is always the current day's date
- **For multi-session days:** Create subfolder `YYYY-MM-DD/` with numbered files:
  - `Context_Summary_YYYY-MM-DD_01.md` (morning)
  - `Context_Summary_YYYY-MM-DD_02.md` (afternoon)
  - `Context_Summary_YYYY-MM-DD_03.md` (evening)

### What Gets Documented
- ✅ User requests and questions
- ✅ Code changes and file creations
- ✅ Decisions and rationale (WHY things were done)
- ✅ Feature implementations
- ✅ Bug fixes and troubleshooting steps
- ✅ Documentation updates
- ✅ Technical trade-offs and comparisons
- ✅ Blockers and their resolutions
- ✅ Next steps and recommendations
- ✅ Timestamps in [YOUR TIMEZONE] (default: Central Time CT)

---

## 📝 Context Summary Structure

Every Context Summary file MUST include these sections:

### 1. Session Overview (Required)
**Purpose:** High-level summary of the session's goals and outcomes

**Contents:**
- **Goal:** What is the primary objective of this session?
- **Context:** Why is this work being done? What led to this?
- **Status:** Where are we now? What's complete/in-progress/blocked?

**Example:**
```markdown
## Session Overview
**Goal:** Implement PWA version of EmailMonitor for free iPhone testing without Apple Developer account.

**Context:** User wanted to test app on iPhone but couldn't afford $99/year Apple Developer account. Decided to create PWA as free testing alternative, similar to user's Meal Planner PWA.

**Status:** Completed Phases 1-7 of PWA implementation. Build successful. Ready for deployment testing.
```

### 2. Previous Context (Required)
**Purpose:** Link to previous session(s) and summarize key decisions

**Contents:**
- Link to previous day's Context Summary
- Summary of major decisions from previous sessions
- Ongoing blockers or issues carried forward

**Example:**
```markdown
## Previous Context
- **November 15, 2025:** Attempted iOS development build
  - Successfully configured EAS Build
  - **BLOCKED:** iOS development requires Apple Developer account ($99/year)
  - **DECISION:** Pivot to PWA implementation for free testing
```

### 3. Current Work (Required)
**Purpose:** Document what's being worked on right now

**Contents:**
- Current phase or feature being implemented
- Implementation approach and architecture decisions
- Technical details and code snippets
- Progress checklist with status indicators (✅ 🔄 ⏳ ❌)

**Example:**
```markdown
## Current Work: PWA Implementation

### Implementation Plan
- [x] Phase 1: Web Configuration ✅
- [x] Phase 2: PWA Assets ✅
- [x] Phase 3: Storage Abstraction ✅
- [ ] Phase 4: Deployment 🔄
- [ ] Phase 5: iPhone Testing ⏳
```

### 4. File Changes (Required)
**Purpose:** Track all file modifications for future reference

**Contents:**
- **Modified Files:** List with brief description of changes
- **Created Files:** New files with purpose
- **Deleted Files:** Removed files with reason

**Example:**
```markdown
## File Changes

### Modified Files
1. **src/App.tsx**
   - Added platform detection for storage initialization
   - Updated imports to use PlatformStorage

### Created Files
1. **src/storage/IndexedDBAdapter.ts**
   - IndexedDB implementation for web platform
   - Translates SQL-like operations to IndexedDB API

### Deleted Files
None
```

### 5. Important Notes (Required)
**Purpose:** Document critical information, decisions, and next steps

**Contents:**
- **Technical Decisions:** Major architecture/implementation choices with WHY
- **Trade-offs:** Pros/cons of chosen approach
- **Blockers:** Current issues preventing progress
- **Workarounds:** Temporary solutions and why they were needed
- **Next Steps:** What needs to happen next

**Example:**
```markdown
## Important Notes

### Technical Decisions
1. **Storage Strategy:** Created abstraction layer
   - **WHY:** SQLite doesn't work on web, need IndexedDB
   - **BENEFIT:** Same API for native and web platforms
   - **TRADE-OFF:** More code complexity vs platform flexibility

### Blockers
- None currently

### Next Steps
1. Deploy to Vercel for testing
2. Update Google OAuth redirect URIs
3. Test on iPhone Safari
```

### 6. Timeline Entries (Required)
**Purpose:** Chronological log of all conversation interactions

**Format:**
```markdown
## [YYYY-MM-DD | HH:MM TIMEZONE] Title of Entry

**User Request:** What the user asked for

**Actions Taken:**
- Bullet list of what was done
- Include file changes
- Include command executions
- Include technical decisions

**Outcome:** Result of the actions

**Status:** ✅ Complete / 🔄 In Progress / ⏳ Pending / ❌ Blocked
```

**Example:**
```markdown
## [2025-11-16 | 14:30 CT] PWA Service Worker Implementation

**User Request:** Create service worker for offline support

**Actions Taken:**
- Created `web/service-worker.js` with caching strategies
- Implemented app shell caching
- Added runtime caching for API responses
- Registered service worker in `web/index.html`

**Outcome:** Service worker successfully caches app for offline use. Tested in Chrome DevTools.

**Status:** ✅ Complete
```

---

## 🎯 Documentation Standards

### Timestamps
- **Always use [YOUR TIMEZONE]** (default: Central Time - Lee's Summit, MO 64064)
- **Format:** `[YYYY-MM-DD | HH:MM TIMEZONE]`
- **Examples:**
  - `[2025-11-16 | 09:30 CT]`
  - `[2025-11-16 | 14:45 CT]`
  - `[2025-11-16 | 22:15 CT]`

### Status Indicators
Use these consistently throughout Context Summary files:

| Indicator | Meaning | Use Case |
|-----------|---------|----------|
| ✅ | Complete | Task finished successfully |
| 🔄 | In Progress | Currently working on this |
| ⏳ | Pending | Waiting for something (user input, external dependency) |
| ❌ | Blocked | Cannot proceed due to blocker |
| ⚠️ | Warning | Works but has issues/limitations |
| 💡 | Idea | Suggestion or future consideration |
| 🔥 | Critical | Urgent issue requiring immediate attention |
| 📝 | Note | Important information to remember |

### Code Snippets
When including code, always specify the language and provide context:

````markdown
**File:** `src/storage/PlatformStorage.ts`
```typescript
export function getStorageAdapter(): StorageAdapter {
  if (Platform.OS === 'web') {
    return new IndexedDBAdapter();
  }
  return new SQLiteAdapter();
}
```
````

### Tables for Comparisons
Use tables to compare options, approaches, or features:

```markdown
| Feature | Option A | Option B | Chosen |
|---------|----------|----------|--------|
| Cost | $0 | $99/year | Option A |
| Background Processing | Limited | Full | - |
| Push Notifications | No | Yes | - |
```

### Links
Link to related files, documentation, or previous Context Summaries:

```markdown
- See [PWA Implementation Plan](../ProjectPlanning/PWA_Implementation_Plan.md)
- Previous context: [Context_Summary_2025-11-15.md](./Context_Summary_2025-11-15.md)
- Reference: [Expo Web Docs](https://docs.expo.dev/workflow/web/)
```

---

## 🔄 Update Workflow

### When to Update Context Summary

**ALWAYS update after:**
- Creating or modifying files
- Making technical decisions
- Implementing new features
- Fixing bugs
- Resolving blockers
- Changing approach or architecture
- User asks a question that leads to action
- Completing a task or phase

**HOW to update:**
1. Add new timestamped entry to Timeline section
2. Update Current Work section with progress
3. Update File Changes section with new/modified files
4. Add to Important Notes if decision was made
5. **NEVER delete or overwrite existing entries**

### New Day Workflow

**When to create new Context Summary file:**
- First conversation of a new calendar day (local timezone)

**How to create new file:**
1. **Copy template** or previous day's file structure
2. **Name file:** `Context_Summary_YYYY-MM-DD.md` (use TODAY'S date)
3. **Add "Previous Context" section** at top:
   ```markdown
   ## Previous Context
   - **[Previous Date]:** Summary of previous session
     - Key accomplishment 1
     - Key accomplishment 2
     - **DECISION:** Major decision made
     - **BLOCKER:** Any ongoing blockers
   ```
4. **Start new "Session Overview"** with today's goals
5. **Begin new Timeline** with first entry

### Multi-Session Day Workflow

**When you have multiple long sessions in one day:**

1. **Create subfolder:** `Context-Summaries/YYYY-MM-DD/`
2. **Create session files:**
   - `Context_Summary_YYYY-MM-DD_01.md` (morning)
   - `Context_Summary_YYYY-MM-DD_02.md` (afternoon)
   - `Context_Summary_YYYY-MM-DD_03.md` (evening)
3. **Keep main file:** `Context_Summary_YYYY-MM-DD.md` with links to session files
4. **Main file contains:** High-level summary + links to detailed sessions

**Example main file:**
```markdown
# Context Summary - November 16, 2025

## Session Overview
Multiple sessions today: PWA implementation, deployment, and testing.

## Sessions
- [Morning Session](./2025-11-16/Context_Summary_2025-11-16_01.md) - PWA setup
- [Afternoon Session](./2025-11-16/Context_Summary_2025-11-16_02.md) - Deployment
- [Evening Session](./2025-11-16/Context_Summary_2025-11-16_03.md) - iPhone testing

## Daily Summary
- Completed: PWA implementation and deployment
- Blockers: None
- Next: Update OAuth and test notifications
```

---

## 🚫 Common Mistakes to Avoid

### ❌ DON'T: Delete or Overwrite Entries
**Wrong:**
```markdown
## Timeline
- [14:30] Did something
(later, delete above and replace with:)
- [16:45] Did something else
```

**Right:**
```markdown
## Timeline
- [14:30] Did something
- [16:45] Did something else  ← ADD, don't replace
```

### ❌ DON'T: Use Vague Descriptions
**Wrong:**
```markdown
- Fixed bug
- Updated code
- Made changes to file
```

**Right:**
```markdown
- Fixed OAuth redirect bug by updating URI scheme in authConfig.ts
- Updated storage initialization to use IndexedDBAdapter on web platform
- Modified metro.config.js to exclude expo-sqlite from web builds
```

### ❌ DON'T: Skip "Why" Context
**Wrong:**
```markdown
Created IndexedDBAdapter.ts
```

**Right:**
```markdown
Created IndexedDBAdapter.ts to provide web-compatible storage.
**WHY:** SQLite doesn't work on web platform, needed IndexedDB implementation to maintain same storage API across platforms.
```

### ❌ DON'T: Forget Timestamps
**Wrong:**
```markdown
## PWA Implementation

Created service worker...
```

**Right:**
```markdown
## [2025-11-16 | 14:30 CT] PWA Service Worker Implementation

**User Request:** Create service worker for offline support
```

### ❌ DON'T: Mix Multiple Days in One File
**Wrong:**
```markdown
# Context Summary - November 15, 2025

## [2025-11-15 | 10:00 CT] OAuth Fix
...

## [2025-11-16 | 09:00 CT] PWA Start  ← WRONG! New day = new file
```

**Right:**
- `Context_Summary_2025-11-15.md` (November 15 work)
- `Context_Summary_2025-11-16.md` (November 16 work - NEW FILE)

---

## 📊 Quality Checklist

Use this checklist to verify Context Summary quality:

### Structure
- [ ] File named correctly: `Context_Summary_YYYY-MM-DD.md`
- [ ] Session Overview section present and complete
- [ ] Previous Context section links to previous session
- [ ] Current Work section describes active work
- [ ] File Changes section lists all modifications
- [ ] Important Notes section documents decisions
- [ ] Timeline section has timestamped entries

### Content Quality
- [ ] All timestamps use correct timezone
- [ ] Every change includes "WHY" context
- [ ] Technical decisions explained with trade-offs
- [ ] Code snippets have file paths and language specified
- [ ] Status indicators used consistently (✅ 🔄 ⏳ ❌)
- [ ] No vague descriptions ("fixed bug" → specific bug description)
- [ ] Links to related files and documentation included

### Workflow
- [ ] New entries added, nothing deleted
- [ ] Updated after each significant action
- [ ] New file created for new day
- [ ] Previous context summarized at day start
- [ ] All blockers and resolutions documented

---

## 🎓 Best Practices

### 1. Be Specific
Instead of: "Fixed the issue"
Write: "Fixed OAuth redirect issue by adding correct URI scheme (com.lfaley.emailmonitor) to Google Cloud Console"

### 2. Document Decisions
Always explain WHY you chose a particular approach:
```markdown
**DECISION:** Use IndexedDB instead of localStorage for web storage
**WHY:** 
- IndexedDB has larger storage limits (50MB+ vs 5MB)
- Supports structured data (no JSON serialization needed)
- Async API won't block UI thread
**TRADE-OFF:** More complex API than localStorage, but worth it for performance
```

### 3. Link Everything
Connect Context Summary to other documentation:
```markdown
- Implementation details: [PWA_Implementation_Plan.md](../ProjectPlanning/PWA_Implementation_Plan.md)
- Code changes: See `src/storage/IndexedDBAdapter.ts` (created this session)
- Related issue: GitHub #42
- Previous attempt: [Context_Summary_2025-11-10.md](./2025-11-10/Context_Summary_2025-11-10_02.md)
```

### 4. Use Visual Hierarchy
Break up long sections with subheadings, lists, and tables:

```markdown
### Implementation Approach

**Phase 1: Setup**
- Configure Expo web platform
- Install dependencies
- Create manifest.json

**Phase 2: Storage**
- Create adapter interface
- Implement IndexedDB adapter
- Test on web platform

**Results:**
| Phase | Status | Duration | Outcome |
|-------|--------|----------|---------|
| Phase 1 | ✅ | 30 min | Success |
| Phase 2 | 🔄 | TBD | In progress |
```

### 5. Track Technical Debt
Document shortcuts and future improvements:
```markdown
**Technical Debt:**
- TODO: Add error handling to IndexedDB transactions
- TODO: Implement retry logic for failed email fetches
- FUTURE: Consider adding WebSocket for real-time updates instead of polling
```

---

## 🔧 Customization

### Change Timezone
Update this section in YOUR copy of ContextSummaryRules.md:

**Default (Central Time):**
```markdown
- ✅ Timestamps in Central Time (Lee's Summit, MO 64064)
```

**Change to your timezone:**
```markdown
- ✅ Timestamps in Pacific Time (Los Angeles, CA)
or
- ✅ Timestamps in Eastern Time (New York, NY)
or
- ✅ Timestamps in UTC
```

Then update CopilotConversationStarter.md accordingly.

### Add Custom Sections
You can add project-specific sections to the template:

```markdown
## Performance Metrics
- Build time: 8.4 seconds
- Bundle size: 2.6 MB
- Lighthouse score: 95/100

## Security Considerations
- OAuth tokens stored in secure storage
- API keys not exposed in client code
- HTTPS required for all API calls

## API Changes
- Added: `GET /api/emails/:id`
- Deprecated: `POST /api/fetch` (use polling service instead)
- Breaking: `User.settings` now JSON instead of string
```

### Adjust Update Frequency
By default, update Context Summary after every significant action. You can adjust:

**More Frequent (recommended for complex work):**
- Update after EVERY file change
- Update after EVERY command execution
- Update after EVERY decision

**Less Frequent (for simple work):**
- Update at end of each feature
- Update at end of each phase
- Update once per session

---

## 📚 Reference

### File Locations
```
YourProject/
├── Context-Summaries/
│   ├── ContextSummaryRules.md  ← THIS FILE
│   ├── CopilotConversationStarter.md  ← Copilot instructions
│   ├── Context_Summary_YYYY-MM-DD.md  ← Daily summaries
│   └── YYYY-MM-DD/  ← Multi-session archives
│       ├── Context_Summary_YYYY-MM-DD_01.md
│       └── Context_Summary_YYYY-MM-DD_02.md
└── ProjectPlanning/  (optional)
    ├── ProjectOverview.md
    └── Implementation_Plan.md
```

### Related Files
- **CopilotConversationStarter.md** - Instructions for Copilot to execute at conversation start
- **Context_Summary_Template.md** - Empty template for new daily files
- **ProjectPlanning/** - Folder for long-term plans and architecture docs

### Example Context Summary
See the EmailMonitor project's Context_Summary files for real-world examples:
- `Context_Summary_2025-11-16.md` - Excellent example of complete documentation
- `2025-11-15/` - Example of multi-session day structure

---

## ✅ Success Criteria

You'll know the Context Summary system is working when:

1. **Continuity:** You can pick up work after days/weeks away without confusion
2. **Clarity:** Anyone can read Context Summary and understand project state
3. **Completeness:** All decisions, changes, and rationale are documented
4. **Consistency:** Copilot follows rules and updates Context Summary automatically
5. **Utility:** You reference Context Summary regularly to remember past decisions
6. **Onboarding:** New team members understand project by reading Context Summaries
7. **No Repetition:** You never ask "Why did we do it this way?" because it's documented

---

**Last Updated:** 2025-11-16
**Based on:** EmailMonitor project's Context Summary system
**Proven with:** GitHub Copilot in VS Code
