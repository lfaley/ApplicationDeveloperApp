# Project Context Agent

## CI/CD & Deployment

This project uses GitHub Actions for continuous integration and deployment.

- **Development:** Work in feature branches (e.g., `feature/new-project-agent`)
- **Integration:** Merge to `main` for validation
- **Production:** Merge `main` to `prod` for production build

On push/PR to `main` or `prod`, GitHub Actions will:
- Install dependencies
- Build the project
- Run tests and lint
- Upload coverage report
- (Optional) Deploy static files to GitHub Pages

## Future Cloud Deployment

For future releases, the MCP agent will be deployed as a Node.js API on Vercel, Netlify, or Azure.

- Supports live API endpoint
- Public URL for agent
- Scalable and flexible
- Free tier available (usage limits may apply)

See [deployment guide](DEPLOYMENT.md) for migration steps.

---

## Overview
The Project Context Agent is an MCP agent for intelligent drift detection between code and documentation, automated sync recommendations, and project health monitoring. It helps teams keep documentation up-to-date, reduce technical debt, and maintain project health.

## Features
- Drift detection: outdated, missing, orphaned, inconsistent docs
- Sync recommendations: actionable fixes for drift
- Auto-sync engine: executes updates with approval
- Health check: scores project context health
- Git integration: uses git history for accuracy
- MCP tools: `detect_drift`, `suggest_updates`, `auto_sync`, `health_check`

## Architecture
- TypeScript strict types, Zod validation
- GitIntegration: repo analysis
- DriftDetector: drift algorithm
- ContentAnalyzer: code/doc comparison
- SyncEngine: sync operations
- MCP tools: exposed for automation

## Getting Started
### Prerequisites
- Node.js 18+
- Git repository workspace

### Installation
```bash
cd MCP-SERVER/project-context-agent
npm install
```

### Build
```bash
npm run build
```

### Run Tests
```bash
npm run test
npm run test:coverage
```

### Lint
```bash
npx eslint src
```

## Usage
### CLI
```bash
node dist/index.js --tool detect_drift --workspacePath /path/to/repo
```

### MCP Tools
- detect_drift: scan for code-doc drift
- suggest_updates: get recommendations
- auto_sync: execute sync with approval
- health_check: get health score

#### Example: Detect Drift
```js
const result = await detectDriftTool({ workspacePath: '/repo', includePatterns: ['src/**/*.ts'] });
console.log(result);
```

#### Example: Suggest Updates
```js
const recs = suggestUpdatesTool(result.driftItems);
console.log(recs);
```

#### Example: Auto Sync
```js
const syncResult = await autoSyncTool({ recommendations: recs.recommendations, requireApproval: true });
console.log(syncResult);
```

#### Example: Health Check
```js
const health = await healthCheckTool({ workspacePath: '/repo' });
console.log(health);
```

## API Reference
### Classes
- GitIntegration: file/commit info, changed files, repo status
- DriftDetector: drift detection, severity, recommendations
- ContentAnalyzer: code/doc signature matching
- SyncEngine: sync recommendations, approval, execution
- HealthChecker: health scoring and analysis

### MCP Tools
- detect_drift(workspacePath, includePatterns?, excludePatterns?)
- suggest_updates(driftItems)
- auto_sync(recommendations, requireApproval?)
- health_check(workspacePath)

## Troubleshooting
- Tests not running: ensure you are in the project directory and have all dev dependencies installed
- Lint errors: run `npx eslint src` and fix warnings
- Git issues: make sure your workspace is a valid git repo
- Type errors: check your TypeScript version and config

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on development, testing, and submitting PRs.

## License
MIT

## Maintainers
- ProjectPlanner Team
- Contact: lfaley

---
