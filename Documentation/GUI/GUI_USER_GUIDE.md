# ProjectPlanner GUI - User Guide

## 🚀 Quick Start

### Running the GUI

**Option 1: Double-click launcher (Easiest)**
```
Double-click: Launch-ProjectPlanner.ps1
```

**Option 2: PowerShell**
```powershell
cd C:\Users\faley\Desktop\Code\Repos\ProjectPlanner
.\ProjectPlanner-GUI.ps1
```

**Option 3: Right-click context menu**
```
Right-click ProjectPlanner-GUI.ps1 → Run with PowerShell
```

---

## 📋 What the GUI Does

The ProjectPlanner GUI automates **ALL** of the following:

✅ **Project Setup**
- Create project directory
- Copy all documentation templates
- Initialize framework (React, Next.js, Node.js, etc.)
- Set up folder structure

✅ **Documentation**
- Copy testing standards (15,000+ lines)
- Copy Context Summary system
- Copy assessment templates (for existing projects)
- Customize README with your project name

✅ **Git & GitHub**
- Initialize Git repository
- Create GitHub repository (via API)
- Add remote origin
- Initial commit and push

✅ **Complete Automation**
- No manual file copying
- No manual git commands
- No manual GitHub setup
- Everything done through GUI

---

## 🎯 Step-by-Step Usage

### Tab 1: Project Setup

#### 1. Project Type
- **New Project**: Start from scratch with framework setup
- **Existing Project**: Add documentation to existing codebase

#### 2. Project Name
```
Example: my-ecommerce-app
```
This will be:
- The folder name
- The GitHub repository name
- Used in README customization

#### 3. Project Path
```
Default: C:\Users\faley\Desktop\Code\Repos\
```
Click "Browse..." to change location.

**Final path will be:** `[Project Path]\[Project Name]`

#### 4. Project Description
```
Example: E-commerce platform built with React and TypeScript
```
Used in:
- GitHub repository description
- README customization

#### 5. Primary Language
Choose from:
- JavaScript
- TypeScript ⭐ (Recommended)
- Python
- C#
- Java
- Go
- Ruby

#### 6. Framework
Choose from:
- **None** - Just documentation
- **React (Vite)** - Modern React with Vite
- **Next.js** - React with SSR
- **Vue 3** - Progressive framework
- **Angular** - Full framework
- **Svelte** - Compiled framework
- **Node.js (Express)** - Backend API
- **React Native (Expo)** - Mobile apps
- **Django** - Python web framework
- **Flask** - Python microframework
- **ASP.NET Core** - .NET framework
- **Spring Boot** - Java framework

**Note:** Selecting a framework will automatically run the initialization command (e.g., `npm create vite@latest`)

#### 7. Documentation Options

**Include Testing Documentation** ✅ (Recommended)
- TESTING_STANDARDS.md (15,000+ lines)
- TESTING_STRATEGY_TEMPLATE.md
- FRAMEWORK_SPECIFIC_EXAMPLES.md
- AI_TEST_GENERATION_GUIDE.md
- VISUAL_EXAMPLES.md

**Include Context Summary System** ✅ (Recommended)
- Tracks your work with AI (Copilot)
- Maintains context across sessions
- Automatic documentation
- Decision tracking (ADRs)

**Include Existing Project Assessment**
- EXISTING_PROJECT_ASSESSMENT.md
- IMPROVEMENT_ROADMAP_TEMPLATE.md
- Use if analyzing legacy code

---

### Tab 2: GitHub Setup

#### 1. Enable GitHub Integration
Check "Create GitHub Repository" to automatically create and push to GitHub.

#### 2. Get GitHub Personal Access Token (PAT)

**Step-by-step:**

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Give it a name: "ProjectPlanner GUI"
4. Select expiration: 90 days (or custom)
5. Select scopes:
   - ✅ **repo** (Full control of private repositories)
     - repo:status
     - repo_deployment
     - public_repo
     - repo:invite
     - security_events
6. Click **"Generate token"**
7. **COPY THE TOKEN** (you won't see it again!)
8. Paste into GUI

#### 3. Enter GitHub Username
```
Example: lfaley
```

#### 4. Test Token
Click **"Test Token"** to verify it works before proceeding.

#### 5. Repository Visibility
- **Public**: Anyone can see it
- **Private**: Only you (and collaborators)

---

### Tab 3: Progress

This tab shows real-time progress:
- ✓ Green = Success
- ✗ Red = Error
- ⊙ Yellow = Skipped/Info

**Example output:**
```
[12:34:56] ========================================
[12:34:56] ProjectPlanner - Starting Project Setup
[12:34:56] ========================================
[12:34:56] 
[12:34:57] [1/7] Creating project directory...
[12:34:57]   ✓ Created: C:\Users\faley\Desktop\Code\Repos\my-app
[12:34:57] 
[12:34:58] [2/7] Copying documentation files...
[12:34:58]   ✓ Copied README.md
[12:34:58]   ✓ Copied HOW_TO_USE_THIS_TEMPLATE.md
[12:34:59]   ✓ Copied TESTING_STANDARDS.md
[12:34:59]   ✓ Copied Context Summary templates
[12:34:59] 
[12:35:00] [3/7] Initializing project structure...
[12:35:02]   ✓ Vite + React initialized
[12:35:02] 
[12:35:03] [4/7] Customizing README...
[12:35:03]   ✓ Customized README.md
[12:35:03] 
[12:35:04] [5/7] Creating GitHub repository...
[12:35:06]   ✓ GitHub repository created
[12:35:06]   → URL: https://github.com/lfaley/my-app
[12:35:06] 
[12:35:07] [6/7] Initializing Git repository...
[12:35:08]   ✓ Git repository initialized
[12:35:10]   ✓ Pushed to GitHub
[12:35:10] 
[12:35:10] ========================================
[12:35:10] ✓ PROJECT SETUP COMPLETE!
[12:35:10] ========================================
```

---

## 🎬 Complete Example Workflow

### Example: Creating "TaskMaster" Todo App

#### Step 1: Fill in Tab 1
- Project Type: **New Project**
- Project Name: **TaskMaster**
- Project Path: **C:\Users\faley\Desktop\Code\Repos\**
- Description: **Modern todo app with AI-powered task suggestions**
- Language: **TypeScript**
- Framework: **React (Vite)**
- ✅ Include Testing Documentation
- ✅ Include Context Summary System
- ⬜ Include Existing Project Assessment

#### Step 2: Fill in Tab 2
- ✅ Create GitHub Repository
- GitHub Username: **lfaley**
- GitHub Token: **ghp_xxxxxxxxxxxxxxxxxxxx** (paste your token)
- Click **Test Token** → ✓ Valid
- Repository: **Public**

#### Step 3: Create Project
1. Click **"Create Project"** (green button)
2. Switch to "Progress" tab (automatic)
3. Watch the magic happen! ✨

#### Step 4: After Creation
- Dialog: "Project created successfully!"
- Click "Yes" to open in VS Code
- Or manually open: `code C:\Users\faley\Desktop\Code\Repos\TaskMaster`

#### Step 5: Start Coding
```powershell
cd C:\Users\faley\Desktop\Code\Repos\TaskMaster
npm install
npm run dev
```

#### Step 6: Start Using Context Summary
In VS Code, say to Copilot:
```
Hello friend. Please review the CopilotConversationStarter.md file and perform every action it refers to.
```

---

## 🛠️ What Gets Created

### Directory Structure (React Example)

```
TaskMaster/
├── .git/                                # Git repository
├── Context-Summaries/                   # Context Summary system
│   ├── ContextSummaryRules.md
│   ├── CopilotConversationStarter.md
│   ├── Context_Summary_Template.md
│   ├── Decision_Log_Template.md
│   ├── Project_Structure_Template.md
│   ├── QUICK_START.md
│   └── README.md
├── src/                                  # Source code (if framework selected)
├── tests/                                # Test directory
├── docs/                                 # Additional docs
├── README.md                             # Customized README
├── HOW_TO_USE_THIS_TEMPLATE.md          # Setup guide
├── TOKEN_EFFICIENT_KICKOFF.md           # Quick planning
├── PLAN_OF_ATTACK_TEMPLATE.md           # Task breakdown
├── TESTING_STANDARDS.md                 # Testing standards (15k+ lines)
├── TESTING_STRATEGY_TEMPLATE.md         # Testing strategy
├── FRAMEWORK_SPECIFIC_EXAMPLES.md       # Test examples
├── AI_TEST_GENERATION_GUIDE.md          # AI prompts
├── VISUAL_EXAMPLES.md                   # Diagrams
├── package.json                          # Dependencies (if Node.js)
├── vite.config.ts                        # Vite config (if Vite)
└── tsconfig.json                         # TypeScript config (if TS)
```

### GitHub Repository
- ✅ Created at: `https://github.com/[username]/[project-name]`
- ✅ Initial commit pushed
- ✅ All documentation included
- ✅ README with badges and description

---

## 🔧 Troubleshooting

### "Execution Policy" Error

If you see:
```
Cannot be loaded because running scripts is disabled on this system
```

**Fix:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### GitHub Token Invalid

**Symptoms:**
- "Token is invalid or expired" message
- 401 Unauthorized error

**Fix:**
1. Generate new token: https://github.com/settings/tokens
2. Make sure **repo** scope is selected
3. Copy and paste new token
4. Click "Test Token" again

### Framework Initialization Fails

**Symptoms:**
- "npm: command not found"
- Framework setup fails

**Fix:**
1. Install Node.js: https://nodejs.org/
2. Restart PowerShell
3. Verify: `npm --version`
4. Try again

### "Directory already exists"

**Symptoms:**
- Warning dialog about existing directory

**Options:**
1. Click "Yes" to continue (will add files to existing folder)
2. Click "No" to cancel and choose different name/path

---

## 💡 Pro Tips

### 1. Save Your GitHub Token Securely

**Don't hardcode it in scripts!** Instead:

```powershell
# Save to Windows Credential Manager
$token = "ghp_xxxxxxxxxxxxxxxxxxxx"
cmdkey /generic:GitHub /user:token /pass:$token

# Retrieve later
$cred = Get-StoredCredential -Target "GitHub"
```

### 2. Create Multiple Projects Quickly

The GUI remembers your settings, so you can:
1. Fill in GitHub username and token once
2. Create multiple projects without re-entering

### 3. Use Context Summary from Day 1

After project creation:
1. Open in VS Code
2. Start Copilot session
3. Say: "Review CopilotConversationStarter.md"
4. Copilot will create today's context summary
5. All your work is automatically documented!

### 4. Customize the GUI

The GUI is a PowerShell script, so you can:
- Add more frameworks
- Change default paths
- Add custom documentation templates
- Modify the workflow

Edit: `ProjectPlanner-GUI.ps1`

---

## 📊 Time Savings

### Manual Process (Traditional)
1. Create directory (1 min)
2. Copy documentation files (5 min)
3. Customize README (2 min)
4. Initialize framework (3 min)
5. Create GitHub repo (2 min)
6. Initialize git (2 min)
7. First commit and push (2 min)

**Total: 17 minutes**

### With ProjectPlanner GUI
1. Fill in form (2 min)
2. Click "Create Project" (1 click)
3. Wait for automation (1-2 min)

**Total: 3-4 minutes**

### Savings: **13 minutes per project** ⚡

**If you create 10 projects per year:** Save **2+ hours**

---

## 🔮 Future Enhancements

Planned features:
- [ ] Custom template profiles (save favorite configurations)
- [ ] Batch project creation
- [ ] Project templates library (e-commerce, blog, API, etc.)
- [ ] Integration with Azure DevOps
- [ ] Integration with GitLab
- [ ] Docker setup automation
- [ ] CI/CD pipeline generation
- [ ] Database setup (PostgreSQL, MongoDB, etc.)
- [ ] Environment variable management
- [ ] Team member invitation (GitHub collaborators)

---

## 📝 FAQ

**Q: Can I use this for existing projects?**
A: Yes! Select "Existing Project" and uncheck framework initialization. It will add documentation without changing your code.

**Q: What if I don't want GitHub integration?**
A: Uncheck "Create GitHub Repository" - it will still initialize a local git repo.

**Q: Can I customize which files get copied?**
A: Yes! Edit the `Copy-TemplateFiles` function in `ProjectPlanner-GUI.ps1`.

**Q: Does this work on Mac/Linux?**
A: Currently Windows-only (PowerShell Forms). Cross-platform version planned.

**Q: Can I run this from the command line?**
A: Yes! Use the CLI version: `ProjectPlanner-CLI.ps1` (coming soon).

**Q: Is my GitHub token stored?**
A: No, it's only held in memory during the session. You need to enter it each time (or store in Windows Credential Manager).

---

## 🆘 Support

**Issues or Questions?**
- GitHub Issues: https://github.com/lfaley/ProjectPlanner/issues
- Email: [your-email]
- Documentation: See README.md files in each template

**Want to Contribute?**
- Fork the repository
- Make improvements
- Submit pull request
- Share your experience!

---

## 📜 License

MIT License - Free to use and modify.

---

**Created by:** Lane Faley  
**Repository:** https://github.com/lfaley/ProjectPlanner  
**Version:** 1.0  
**Last Updated:** November 2025

---

🚀 **Happy Coding!**
