# Branch and CI/CD Strategy for ProjectPlannerApp

## Branch Management
- `main`: Production-ready code, protected branch
- `develop`: Integration branch for features
- `feature/<name>`: Feature development
- `bugfix/<name>`: Bug fixes
- `hotfix/<name>`: Urgent production fixes

## Branch Protection
- Require PRs, code reviews, and CI checks for `main` and `develop`
- Delete feature/bugfix/hotfix branches after merging

## .gitignore Best Practices
- Ignore `node_modules/`, `dist/`, build artifacts, OS files, and large binaries
- Use language/framework-specific templates

## Large File Prevention
- Pre-commit hooks to block files >100MB
- Recommend Git LFS for necessary large files

## CI/CD Configuration
- Use GitHub Actions for lint, test, build, and large file checks
- Fail builds if large files detected or standards violated

## Commit Hygiene
- Push small, frequent commits
- Avoid large, monolithic changes

## Documentation
- All standards and workflows documented in repo

---
This strategy is enforced and recommended by RepoStandardsAgent for all new and existing projects.
