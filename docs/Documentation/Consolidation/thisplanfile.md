# Project Consolidation and Structure Optimization Plan

**Date:** 2025-11-26

## Objective
Consolidate all redundant folders (e.g., `node_modules`, `dist`, etc.), remove unnecessary duplicates, and reorganize the project structure to follow industry standards for maintainability and clarity.

---

## Step 1: Inventory Redundant and Dependency Folders
- Identify all `node_modules`, `dist`, `build`, and similar folders across the project.
- List all `package.json` and lock files.
- Identify other duplicate or unnecessary folders (e.g., multiple `public`, `assets`, etc.).

## Step 2: Consolidation Proposal (2025-11-26)

### node_modules & Dependencies
- Consolidate all `node_modules` and lock files to the project root where possible.
- Remove `node_modules` and lock files from:
  - `dashboard/`
  - `electron-app/`
  - `MCP-SERVER/code-documentation-agent/`
  - `phase2/`
- Retain only one `package.json` and `package-lock.json` at the root. Move all dependencies to the root file, merging as needed.
- If any subproject requires strict isolation (e.g., Electron native modules), document and justify exceptions.

### dist & Build Folders
- Remove all `dist/` folders from subprojects. Use a single `dist/` or `build/` at the root, or configure output paths in build scripts.

### Project Structure (Industry Standard)
- Top-level folders:
  - `apps/` (for main applications: Electron app, dashboard, etc.)
  - `packages/` or `libs/` (for shared code/utilities)
  - `docs/` (for documentation)
  - `scripts/` (for automation/build scripts)
- Move:
  - `dashboard/` → `apps/dashboard/`
  - `electron-app/` → `apps/electron-app/`
  - `MCP-SERVER/` → `apps/mcp-server/` (or `packages/` if used as a library)
  - Shared code/utilities to `packages/` or `libs/` if needed
- Place all documentation in `docs/` or keep `Documentation/` as the canonical docs folder.

### Remove Duplicates & Clean Up
- Delete any duplicate or placeholder folders (e.g., empty `public/`, `assets/`, etc.).
- Remove any remaining empty folders after restructuring.

### Update Scripts & Documentation
- Update all build, test, and run scripts to use the new structure and root-level dependencies.
- Update all documentation to reflect the new structure and dependency management.

---

## Step 3: Remove Unneeded Folders
- Delete unnecessary folders (old builds, placeholder folders, duplicate code, etc.).
- Ensure only one copy of each dependency and build artifact exists.

## Step 4: Restructure for Industry Standards
- Organize into clear top-level folders:
  - `apps/` for main applications (Electron app, dashboard, etc.)
  - `packages/` or `libs/` for shared code/utilities
  - `docs/` for documentation
  - `scripts/` for automation/build scripts
- Group related code and move shared utilities as needed.
- Ensure documentation, tests, and configs are logically placed.

## Step 5: Update Documentation and Configs
- Update all documentation to reflect the new structure.
- Update build, test, and run scripts to use new paths.

## Step 6: Validate and Test
- Ensure all apps/scripts run correctly with the new structure.
- Run tests to confirm nothing is broken.

---

## Next Actions

## Progress Log (2025-11-26)

### Folder Moves Completed
- Moved `dashboard/` to `apps/dashboard/`
- Moved `electron-app/` to `apps/electron-app/`
- Moved `GUI/` to `apps/GUI/`
- Moved `MCP-SERVER/` to `packages/MCP-SERVER/`
- Moved `phase2/` to `archive/phase2/`
- Moved `agentsPart2/` to `archive/agentsPart2/`
- Moved `CONTEXT-SUMMARY/` to `docs/CONTEXT-SUMMARY/`
- Moved `Documentation/` to `docs/Documentation/`
- Moved `STANDARDS/` to `docs/STANDARDS/`
- Moved `STRUCTURE_OVERVIEW.md` to `docs/STRUCTURE_OVERVIEW.md`
- Moved `PLAN_OF_ATTACK_LATEST_UI_AND_SERVICES.md` to `docs/PLAN_OF_ATTACK_LATEST_UI_AND_SERVICES.md`
- Moved root `README.md` to `docs/README.md`
- Moved `start-all.ps1` to `docs/start-all.ps1`

### Next Steps
1. Update all build, test, and run scripts to use the new structure and root-level dependencies.
2. Update all documentation to reflect the new structure and dependency management.
3. Remove any remaining empty or duplicate folders.
4. Validate all builds and tests.

---

*See [inventory-2025-11-26.md](./inventory-2025-11-26.md) for the full inventory. This plan will be updated as each step is completed and decisions are made.*

---

*See [inventory-2025-11-26.md](./inventory-2025-11-26.md) for the full inventory. This plan will be updated as each step is completed and decisions are made.*
