# ProjectPlanner Unified Dashboard

This is the industry-standard GUI for the ProjectPlanner platform, integrating all agents and workflows. Built with React + Vite for speed, modularity, and modern UX.

## Features
- Home page: "New or Existing Project" prompt
- Navigation for all agent workflows (context, orchestration, code-review, etc.)
- Modular components for each agent
- Responsive, professional UI (color scheme as previously discussed)
- Local development and testing
- CI/CD and GitHub Pages deployment

## Getting Started

### 1. Install dependencies
```bash
cd dashboard
npm install
```

### 2. Run locally
```bash
npm run dev
```
- Visit `http://localhost:5173` (default Vite port)

### 3. Build for production
```bash
npm run build
```

### 4. Deploy (GitHub Actions)
- Push to `main` or `prod` branch
- Dashboard will be built and deployed to GitHub Pages automatically

## Structure
```
dashboard/
??? src/
?   ??? components/
?   ?   ??? Home.tsx
?   ?   ??? ProjectSelector.tsx
?   ?   ??? ContextAgentDashboard.tsx
?   ?   ??? OrchestrationAgentDashboard.tsx
?   ?   ??? CodeReviewAgentDashboard.tsx
?   ?   ??? ...
?   ??? App.tsx
?   ??? main.tsx
??? public/
??? package.json
??? tsconfig.json
??? vite.config.ts
```

## Example Components
- **Home:** Welcome, select new/existing project
- **ProjectSelector:** Choose or create project
- **ContextAgentDashboard:** Run drift detection, view results
- **OrchestrationAgentDashboard:** Manage agent orchestration
- **CodeReviewAgentDashboard:** Review code, see suggestions

## Customization
- Color scheme and branding as previously discussed
- Add/modify components in `src/components/`

## CI/CD
- See `.github/workflows/deploy-dashboard.yml` for automated build/deploy

## Documentation
- See `dashboard-guides/static-dashboard-process.md` for detailed process flow

---
