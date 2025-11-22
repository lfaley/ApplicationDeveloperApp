# Static Dashboard Setup & Process Flow (React + Vite)

This folder contains detailed documentation and step-by-step instructions for building, deploying, and using a static dashboard for the MCP Project Context Agent using React + Vite and GitHub Pages.

---

## Step 1: GitHub Actions Workflow for Dashboard Deploy

### 1. Create `/dashboard` Directory
- This will contain your React + Vite dashboard source code.

### 2. Add GitHub Actions Workflow
- Create `.github/workflows/deploy-dashboard.yml` with the following steps:
  - Trigger on push to `main` or `prod`
  - Install Node.js and dependencies
  - Build the dashboard
  - Deploy to GitHub Pages using `peaceiris/actions-gh-pages`

#### Example Workflow:
```yaml
name: Deploy Dashboard
on:
  push:
    branches:
      - main
      - prod
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
        working-directory: dashboard
      - name: Build dashboard
        run: npm run build
        working-directory: dashboard
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: dashboard/dist
```

---

## Step 2: Documentation for Dashboard Usage & Deployment

### 1. Dashboard Directory Structure
```
dashboard/
??? src/
?   ??? components/
?   ??? App.tsx
?   ??? main.tsx
??? public/
??? package.json
??? tsconfig.json
??? vite.config.ts
```

### 2. How to Build & Deploy
- **Local build:**
  ```bash
  cd dashboard
  npm install
  npm run build
  ```
- **Deploy:**
  - Push to `main` or `prod` branch
  - GitHub Actions will build and deploy automatically
- **Access dashboard:**
  - Visit `https://<your-username>.github.io/<repo-name>/` after deploy

### 3. How to Add/Update Components
- Add new components in `dashboard/src/components/`
- Update `App.tsx` to include new visualizations
- Commit and push changes to trigger deploy

---

## Step 3: Example Components for Dashboard

### 1. Drift Results Component
- Displays list of drift items (outdated, missing, orphaned, inconsistent)
- Example: Table or cards with file names, drift type, severity

### 2. Health Score Component
- Shows overall project health score (0-100)
- Example: Gauge chart or progress bar

### 3. Recommendations Component
- Lists actionable recommendations for fixing drift
- Example: Checklist or action cards

### 4. Sync Status Component
- Shows status of auto sync operations
- Example: Status indicator, updated files list

---

## Additional Resources
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [GitHub Pages Guide](https://pages.github.com/)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)

---

## Next Steps
- Scaffold the dashboard using Vite + React
- Add example components
- Push to `main` or `prod` to trigger deploy
- Update documentation as features are added

---
