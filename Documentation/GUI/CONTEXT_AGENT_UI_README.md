# Context Agent - Modern Web UI

A beautiful, modern web-based interface for the Context Agent documentation drift detection and synchronization tool.

## 🎨 Features

### Modern Design
- **Dark Theme**: Professional dark interface with cyan/blue accents
- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Responsive Layout**: Adapts to different screen sizes
- **Smooth Animations**: Elegant transitions and loading states
- **Gradient Effects**: Modern gradient backgrounds and text

### Functionality
- **4 Core Tools**: Detect Drift, Health Check, Suggest Updates, Auto Sync
- **Real-time Execution**: Live command output in results panel
- **Path Selection**: Browse and select repository paths
- **Advanced Options**: Auto-approve, backup creation, and more
- **Status Feedback**: Real-time status badges (Running, Success, Error)

### User Experience
- **Intuitive Layout**: Tool selection on left, results on right
- **Context Information**: About panel with feature list
- **Visual Feedback**: Loading spinners, status badges, color coding
- **Scrollable Results**: Monospace font for code/output display
- **Error Handling**: Clear error messages and guidance

## 🚀 Quick Start

### Launch via PowerShell

```powershell
# Navigate to GUI directory
cd C:\Users\faley\Desktop\Code\Repos\ProjectPlanner\GUI

# Launch the UI
.\Launch-ContextAgent.ps1 -RepositoryPath "C:\path\to\your\repo"
```

### Direct Browser Access

Simply open `context-agent-ui.html` in any modern browser:
- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Brave
- Opera

## 🛠 Tools Overview

### 1. Detect Drift
Scans your repository to identify documentation that's out of sync with code.

**Detects:**
- Outdated documentation
- Missing documentation
- Orphaned documentation
- Inconsistent documentation

**Use when:** You want to identify sync issues without making changes

### 2. Health Check
Calculates a documentation health score (0-100, A-F grade system).

**Scoring Factors:**
- Coverage (0-25 points)
- Freshness (0-25 points)
- Consistency (0-25 points)
- Completeness (0-25 points)

**Use when:** You want overall assessment of documentation quality

### 3. Suggest Updates
Gets AI-powered recommendations for documentation improvements.

**Suggests:**
- What to update
- Why it needs updating
- How to improve it
- Priority level

**Use when:** You need guidance on which docs to fix first

### 4. Auto Sync
Automatically synchronizes documentation with code changes.

**Features:**
- Creates automatic backups
- Optional approval workflow
- Batch operations
- Rollback capability

**Use when:** You're ready to automatically fix issues

## 📋 Input Options

### Repository Path (Required)
The path to your git repository. Can be:
- Absolute path: `C:\Users\user\Desktop\Projects\MyApp`
- Network path: `\\server\share\repo`
- Local path: `.` (current directory)

### Advanced Options (for Auto Sync)

**Auto-Approve**
- Skips confirmation for automatic changes
- Useful for CI/CD pipelines
- Default: Unchecked (requires approval)

**Create Backup**
- Creates backup before making changes
- Can be disabled for large repos
- Default: Checked (recommended)

## 📊 Results Display

The results panel shows:

```
Tool Name: [Tool execution results]
Status: [Running/Success/Error]
Output: [Real-time command output]
```

### Example Output (Health Check)
```
✓ Documentation Health Check Complete

Score: 100/100 (Grade A)

Factors:
  Coverage:     100%
  Freshness:    100%
  Consistency:  100%
  Completeness: 100%

Strengths:
  ✓ Excellent documentation coverage
  ✓ Documentation is well-maintained and up-to-date
  ✓ High consistency between code and documentation
```

## 🎯 Common Workflows

### Workflow 1: Quick Health Assessment
1. Enter repository path
2. Click "Health Check" tool
3. Click "Run Tool"
4. View overall documentation score

**Time:** ~30 seconds

### Workflow 2: Identify All Issues
1. Enter repository path
2. Click "Detect Drift" tool
3. Click "Run Tool"
4. Review all drift items found

**Time:** ~1-2 minutes

### Workflow 3: Get Fix Recommendations
1. Enter repository path
2. Click "Suggest Updates" tool
3. Click "Run Tool"
4. Review prioritized recommendations

**Time:** ~2-3 minutes

### Workflow 4: Automated Synchronization
1. Enter repository path
2. Check "Create Backup" option
3. (Optional) Check "Auto-Approve" to skip confirmation
4. Click "Auto Sync" tool
5. Click "Run Tool"
6. View sync results

**Time:** ~1-5 minutes

## 🔧 Technical Details

### Browser Compatibility
- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

### Requirements
- Modern browser with ES6 support
- Context Agent CLI installed
- Node.js runtime for CLI execution
- Git repository

### Performance
- UI loads: ~500ms
- Tool execution: 1-30 seconds (depends on repo size)
- Results display: Real-time streaming
- Memory usage: ~50-100MB

## 🎨 Design Elements

### Color Scheme
- **Primary**: Cyan (#00d9ff)
- **Secondary**: Blue (#0099ff)
- **Background**: Dark slate (#0f172a)
- **Text**: Light gray (#e2e8f0)
- **Accent**: Semi-transparent overlays

### Typography
- **Headers**: Segoe UI, Roboto, system fonts
- **Code**: Monaco, Courier New, monospace
- **Size**: Responsive 0.85em - 2.5em

### Layout
- **Grid**: 2-column on desktop, 1-column on mobile
- **Max-width**: 1200px
- **Padding**: 20-30px
- **Gap**: 15-30px

## 📱 Responsive Design

### Desktop (1024px+)
- 2-column layout (tools + about on left, results on right)
- Full-size results panel
- All features visible

### Tablet (768px - 1023px)
- Single column layout
- Stacked panels
- Optimized touch targets

### Mobile (< 768px)
- Vertical layout
- Full-width input fields
- Collapsible sections
- Touch-friendly buttons

## 🔐 Security

- ✓ No data sent to external servers
- ✓ All operations local to your machine
- ✓ Git operations read repository metadata only
- ✓ Backups created before any modifications
- ✓ Requires explicit approval for auto-sync

## 🐛 Troubleshooting

### UI Not Loading
1. Check browser is modern (Chrome, Edge, Firefox)
2. Verify file path: `GUI\context-agent-ui.html`
3. Try another browser

### Tools Not Running
1. Verify Context Agent CLI is installed
2. Check Node.js is in PATH
3. Ensure repository path is valid git repo
4. Check `.git` folder exists in repository

### Slow Performance
1. Close other applications
2. Try in different browser
3. Ensure repository path uses SSD (not network drive)
4. Check system resources

### Path Not Found
1. Verify full absolute path (not relative)
2. Check path contains no special characters
3. Ensure folder exists and is readable
4. Try with quotes: `"C:\Path With Spaces\Repo"`

## 💡 Tips & Tricks

### Batch Processing
- Run multiple repos by changing path and running again
- Results are persistent in UI

### Keyboard Shortcuts
- `Tab` - Navigate between controls
- `Enter` - Run tool (when focused on Run button)
- `Escape` - Clear results

### Performance Tips
- Start with "Detect Drift" for quick overview
- Use "Health Check" to track progress
- Run "Auto Sync" during off-hours for large repos
- Create backup before auto-sync on production repos

## 📞 Support

For issues or questions:
1. Check README in Context Agent directory
2. Review CLI tool documentation
3. Check repository `.git` folder permissions
4. Ensure sufficient disk space for backups

## 📄 License

Same as ProjectPlanner main project.

---

**Context Agent v1.0.0** | Modern Web UI  
Built with ❤️ for better documentation
