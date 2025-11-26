# ProjectPlanner GUI

**Automated project setup with one-click GitHub integration**

## 🚀 Quick Start

### Running the GUI

**Easiest Method:**
```powershell
.\Launch-ProjectPlanner.ps1
```

Or double-click `Launch-ProjectPlanner.ps1` in File Explorer.

## 📁 Files in This Folder

| File | Purpose |
|------|---------|
| **ProjectPlanner-GUI.ps1** | Main GUI application (650+ lines) |
| **Launch-ProjectPlanner.ps1** | Simple launcher script |
| **GUI_USER_GUIDE.md** | Complete user guide with examples |

## ✨ What the GUI Does

The ProjectPlanner GUI automates your entire project setup workflow:

✅ **Project Creation**
- Creates project directory
- Copies all documentation templates
- Initializes frameworks (React, Next.js, Node.js, etc.)
- Sets up folder structure

✅ **Documentation**
- Testing standards (15,000+ lines)
- Context Summary system for AI-assisted development
- Assessment templates for existing projects
- Customizes README with your project details

✅ **Git & GitHub**
- Initializes Git repository
- Creates GitHub repository via API
- Connects local repo to GitHub
- Pushes initial commit

✅ **Framework Support**
- React (Vite)
- Next.js
- Vue 3
- Angular
- Svelte
- Node.js (Express)
- React Native (Expo)
- Django
- Flask
- ASP.NET Core
- Spring Boot

## 📖 Documentation

See **[GUI_USER_GUIDE.md](./GUI_USER_GUIDE.md)** for:
- Complete step-by-step instructions
- GitHub Personal Access Token setup
- All framework options explained
- Troubleshooting guide
- Example workflows

## 🔧 Requirements

- **Windows** (PowerShell with .NET Forms)
- **Git** (for repository operations)
- **GitHub Account** (optional, for GitHub integration)
- **Node.js** (optional, for JavaScript frameworks)
- **Python** (optional, for Python frameworks)

## 💡 Quick Example

1. Run `.\Launch-ProjectPlanner.ps1`
2. Fill in:
   - Project Name: `my-awesome-app`
   - Framework: `React (Vite)`
   - Check: `Include Testing Documentation`
   - Check: `Include Context Summary System`
3. Optionally add GitHub credentials
4. Click **"Create Project"**
5. Done! Project created and pushed to GitHub

## 🎯 Time Savings

- **Manual Setup:** 15-20 minutes per project
- **With GUI:** 2-3 minutes per project
- **Savings:** ~15 minutes per project

**For 10 projects per year:** Save 2.5+ hours!

## 🔗 Related Folders

- **[../TESTING/](../TESTING/)** - Testing documentation templates
- **[../CONTEXT-SUMMARY/](../CONTEXT-SUMMARY/)** - Context Summary system
- **[../PLANNING/](../PLANNING/)** - Planning templates
- **[../DOCS-NEW-PROJECTS/](../DOCS-NEW-PROJECTS/)** - New project guides
- **[../DOCS-EXISTING-PROJECTS/](../DOCS-EXISTING-PROJECTS/)** - Existing project assessment

---

**Ready to automate your workflow?** Run `.\Launch-ProjectPlanner.ps1` now!
