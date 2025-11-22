# Context Agent - Modern Web UI - Quick Reference

## 🚀 Quick Start (30 seconds)

### Step 1: Open PowerShell
```powershell
# Navigate to GUI directory
cd C:\Users\faley\Desktop\Code\Repos\ProjectPlanner\GUI
```

### Step 2: Launch the UI
```powershell
# Run the launcher
.\Launch-ContextAgent-Server.ps1
```

### Step 3: Use the Interface
- Enter your repository path
- Select a tool (Detect Drift, Health Check, etc.)
- Click "Run Tool"
- View results

**That's it!** The UI opens automatically in your default browser.

---

## 📋 Commands Reference

### PowerShell Command (Recommended)
```powershell
.\Launch-ContextAgent-Server.ps1
```
- Auto-starts server
- Opens browser automatically
- Shows instructions
- ✅ Easiest method

### Manual Node.js Start
```powershell
node ui-server.js 3000
# Then open: http://localhost:3000
```

### Alternative Port
```powershell
# If port 3000 is taken
node ui-server.js 3001
# Then open: http://localhost:3001
```

### Open HTML Directly
```powershell
# Direct browser open (limited functionality)
start GUI\context-agent-ui.html
```
- ⚠️ Some features won't work without server
- Not recommended

---

## 🛠 4 Core Tools

### 1. Detect Drift
**Purpose**: Find documentation out of sync with code

**Use When**: 
- You want to identify sync issues
- No changes needed yet, just assessment
- Planning updates

**Time**: ~1-2 minutes

**Output**: List of drift items with severity

---

### 2. Health Check
**Purpose**: Score documentation quality (0-100)

**Use When**:
- You want overall quality assessment
- Tracking progress over time
- Quick health assessment

**Time**: ~30 seconds

**Output**: Score, grade (A-F), and factor breakdown

---

### 3. Suggest Updates
**Purpose**: Get recommendations for improvements

**Use When**:
- You need guidance on what to fix
- Prioritizing updates
- Understanding issues

**Time**: ~2-3 minutes

**Output**: Prioritized recommendations with guidance

---

### 4. Auto Sync
**Purpose**: Automatically synchronize documentation

**Use When**:
- Ready to make changes
- Need to bulk fix issues
- Confident in recommendations

**Time**: ~2-5 minutes

**Options**:
- ☑ Create Backup (recommended)
- ☐ Auto-Approve (skip confirmation)

**Output**: Changes made and summary

---

## 📖 Common Workflows

### Workflow A: Quick Assessment
```
1. Launch: .\Launch-ContextAgent-Server.ps1
2. Enter: Your repository path
3. Click: "Health Check" tool
4. Click: "Run Tool"
5. View: Score and quality factors
Time: ~30 seconds
```

### Workflow B: Find All Issues
```
1. Enter: Your repository path
2. Click: "Detect Drift" tool
3. Click: "Run Tool"
4. View: All drift items
5. Read: Descriptions and severity
Time: ~2 minutes
```

### Workflow C: Get Recommendations
```
1. Enter: Your repository path
2. Click: "Suggest Updates" tool
3. Click: "Run Tool"
4. View: Prioritized recommendations
5. Read: Guidance for each
Time: ~3 minutes
```

### Workflow D: Auto Fix Everything
```
1. Enter: Your repository path
2. (Optional) Check: "Auto-Approve"
3. Click: "Auto Sync" tool
4. Click: "Run Tool"
5. View: All changes applied
6. (Undo in git if needed: git reset --hard)
Time: ~5 minutes
```

---

## 🎯 Input Guide

### Repository Path
- **Required**: Yes
- **Format**: Absolute path to git repository
- **Examples**:
  - `C:\Users\YourName\Desktop\MyProject`
  - `C:\workspace\my-app`
  - `\\network\share\repo`
- **Must contain**: `.git` folder

### Options (for Auto Sync)

**Auto-Approve**
- Default: OFF ☐
- When ON: Skip confirmation, apply changes immediately
- Use: CI/CD, trusted environments
- When OFF: Requires approval before changes

**Create Backup**
- Default: ON ☑
- When ON: Backup created before changes
- Use: Always recommended (safety)
- When OFF: No backup (only for large repos)

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Move between fields |
| `Enter` | Run tool (from Run button) |
| `Escape` | Clear results |
| `Ctrl+A` | Select all in results |
| `Ctrl+C` | Copy selected results |

---

## 🌐 Browser Support

| Browser | Works | Notes |
|---------|-------|-------|
| Chrome 90+ | ✅ Yes | Best experience |
| Edge 90+ | ✅ Yes | Best experience |
| Firefox 88+ | ✅ Yes | Good experience |
| Safari 14+ | ✅ Yes | Good experience |
| IE 11 | ❌ No | Not supported |

**Recommendation**: Use Chrome or Edge for best experience

---

## 🔍 Troubleshooting

### Problem: "Port 3000 already in use"
```powershell
# Solution: Use different port
node ui-server.js 3001
# Then open: http://localhost:3001
```

### Problem: "Node.js not found"
```powershell
# Solution: Install Node.js from https://nodejs.org
# Then restart PowerShell and try again
```

### Problem: Tool doesn't execute
```powershell
# Ensure CLI is built in project-context-agent directory
cd MCP-SERVER/project-context-agent
npm run build
# Should create dist/ folder
```

### Problem: "Connection Error"
```powershell
# Check server is running
curl http://localhost:3000

# If not, restart server:
.\Launch-ContextAgent-Server.ps1
```

### Problem: Browser won't open automatically
```powershell
# Manual method: Open browser and go to
http://localhost:3000
```

---

## 📊 Output Interpretation

### Health Check Output

```
Score: 100/100 (Grade A)

Factors:
  Coverage:     100%     ← % of code documented
  Freshness:    100%     ← How recent documentation is
  Consistency:  100%     ← Code & docs alignment
  Completeness: 100%     ← Detail level of docs

Grade Interpretation:
A (90-100)  - Excellent
B (80-89)   - Good
C (70-79)   - Fair
D (60-69)   - Poor
F (< 60)    - Critical
```

### Detect Drift Output

```
Type: OUTDATED
  Last Updated: 30 days ago
  Severity: MEDIUM
  Action: Should update

Type: MISSING
  Status: Not found but referenced
  Severity: HIGH
  Action: Create documentation

Type: INCONSISTENT
  Issue: Mismatch detected
  Severity: MEDIUM
  Action: Fix inconsistencies
```

---

## 💡 Pro Tips

1. **Start with Health Check**
   - Quick 30-second overview
   - Shows if docs need attention

2. **Then Detect Drift**
   - See specific issues
   - Understand what needs fixing

3. **Use Suggest Updates**
   - Get prioritized recommendations
   - Plan your work

4. **Finally Auto Sync**
   - Apply all fixes at once
   - Backup created automatically

5. **Backup is Your Safety Net**
   - Always keep it ON
   - Can undo with: `git reset --hard`

---

## 🎨 Interface Tour

### Top Section
- **Header**: App name and tagline
- **Navigation**: Tool selection buttons

### Left Panel
- **Tools**: 4 buttons to choose from
- **Path Input**: Where your repo is
- **Options**: Advanced settings (for Auto Sync)
- **Buttons**: Run & Clear

### Right Panel
- **About**: Feature overview
- **Info**: What it supports

### Results Section
- **Status**: Running/Success/Error badge
- **Output**: Results in monospace font
- **Scrollable**: Can scroll through long output

---

## 🔐 Security Notes

✅ **Safe**:
- All commands run on your machine
- No data sent to internet
- Backups created before changes
- Can undo all changes with git

⚠️ **Be Careful**:
- Don't run on critical production repos without backup
- Test on non-critical repos first
- Auto-Approve requires careful review
- Always commit before running Auto Sync

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `CONTEXT_AGENT_UI_README.md` | Full user guide |
| `MODERN_UI_IMPLEMENTATION_GUIDE.md` | Technical details |
| `MODERN_UI_SUMMARY.md` | Quick overview |
| `VISUAL_DESIGN_PREVIEW.md` | Design documentation |
| `context-agent-ui.html` | UI code (600+ lines) |
| `ui-server.js` | Server code (200+ lines) |
| `Launch-ContextAgent-Server.ps1` | Launcher script |

---

## 🎓 Learning Path

### For New Users
1. Read this file (Quick Reference)
2. Run: `.\Launch-ContextAgent-Server.ps1`
3. Try Health Check on a test repo
4. Try Detect Drift to see issues
5. Read suggestions from Suggest Updates

### For Developers
1. Review `MODERN_UI_IMPLEMENTATION_GUIDE.md`
2. Look at HTML: `context-agent-ui.html`
3. Look at Server: `ui-server.js`
4. Understand API: `/api/run-tool` endpoint
5. Modify CSS for customization

---

## 🆘 Support Resources

### Quick Fixes
- Check browser console: `F12`
- Verify Node.js: `node --version`
- Test server: `curl http://localhost:3000`
- Check CLI built: `ls MCP-SERVER/project-context-agent/dist`

### Full Documentation
- See `CONTEXT_AGENT_UI_README.md` for features
- See `MODERN_UI_IMPLEMENTATION_GUIDE.md` for technical
- See `MCP-SERVER/project-context-agent/README.md` for CLI

### Debug Terminal
```powershell
# See detailed server output
node ui-server.js 3000
# Watch console for errors while running tools
```

---

## 🚀 Next Steps

1. ✅ **Launch the UI**
   ```powershell
   .\Launch-ContextAgent-Server.ps1
   ```

2. ✅ **Try Health Check**
   - Quick assessment of your docs

3. ✅ **Explore Detect Drift**
   - See what needs attention

4. ✅ **Review Suggestions**
   - Understand recommendations

5. ✅ **Auto Sync when ready**
   - Apply all fixes at once

---

**Ready to improve your documentation? Launch now!**

```powershell
cd C:\Users\faley\Desktop\Code\Repos\ProjectPlanner\GUI
.\Launch-ContextAgent-Server.ps1
```

**Questions?** Check the full documentation files or run with `--help` flag.
