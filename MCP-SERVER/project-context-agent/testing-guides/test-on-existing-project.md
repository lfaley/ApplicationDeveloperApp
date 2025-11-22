# Testing Project Context Agent on an Existing Project

This guide walks you through testing the MCP Project Context Agent on an existing codebase. Follow these steps to validate drift detection, health check, and recommendations in a real-world scenario.

---

## 1. Prerequisites
- Node.js 18+
- Git installed
- Existing project (preferably a git repository)
- MCP Project Context Agent cloned and built

---

## 2. Setup
1. **Clone the MCP Project Context Agent:**
   ```bash
   git clone https://github.com/lfaley/ProjectPlanner.git
   cd MCP-SERVER/project-context-agent
   npm install
   npm run build
   ```
2. **Identify your target project:**
   - Make sure it is a git repository (run `git status` in its root)
   - Note the absolute path to the project directory

---

## 3. Run MCP Agent Tools

### a. **Drift Detection**
```bash
node dist/index.js --tool detect_drift --workspacePath /absolute/path/to/your/project
```
- Review the output for drift items (outdated, missing, orphaned, inconsistent docs)

### b. **Health Check**
```bash
node dist/index.js --tool health_check --workspacePath /absolute/path/to/your/project
```
- Review the health score and recommendations

### c. **Suggest Updates**
```bash
node dist/index.js --tool suggest_updates --workspacePath /absolute/path/to/your/project
```
- Review actionable recommendations for fixing drift

### d. **Auto Sync (if enabled)**
```bash
node dist/index.js --tool auto_sync --workspacePath /absolute/path/to/your/project --requireApproval true
```
- Review updated files and status

---

## 4. Review Results
- Check the console output for each tool
- Validate that drift detection and recommendations match your expectations
- If auto sync is used, verify documentation/code changes in your project

---

## 5. Troubleshooting
- If you see errors, check:
  - Node.js version
  - Project path is correct
  - Target project is a git repo
  - MCP agent is built (`npm run build`)
- For more help, see the MCP agent README and CONTRIBUTING docs

---

## 6. Next Steps
- Share results with your team
- Use recommendations to update documentation
- Integrate MCP agent into your workflow

---

## 7. Feedback
- Open issues or suggestions in the MCP agent repository
- Contact maintainers for support

---
