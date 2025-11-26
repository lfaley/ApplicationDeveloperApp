# Project Redundant Folders & Dependency Inventory

**Date:** 2025-11-26

This file inventories all redundant, dependency, and potentially consolidatable folders/files in the project as part of the [Consolidation and Structure Optimization Plan](./thisplanfile.md).

---

## Inventory Scope
- All `node_modules` folders
- All `dist`, `build`, and similar output folders
- All `package.json`, `package-lock.json`, and similar lock/config files
- Other duplicate or unnecessary folders (e.g., multiple `public`, `assets`, etc.)

---

## Inventory Results

### node_modules Folders
- `dashboard/node_modules`
- `electron-app/node_modules`
- `MCP-SERVER/code-documentation-agent/node_modules`
- `phase2/node_modules`

### dist Folders
- `dashboard/dist`
- `electron-app/dist`

### package.json & Lock Files
- `dashboard/package.json`, `dashboard/package-lock.json`
- `electron-app/package.json`, `electron-app/electron-app/package-lock.json`
- `MCP-SERVER/orchestration-agent/package.json`, `MCP-SERVER/orchestration-agent/package-lock.json`
- `MCP-SERVER/project-roadmap-agent/package.json`
- `MCP-SERVER/code-documentation-agent/package.json`
- `phase2/package.json`
- Root: `package.json`, `package-lock.json`

### Other Duplicates
- Multiple `dist/` folders in app and package subfolders
- Multiple `package.json` and lock files in subprojects

---

## Next Steps
- Review which `node_modules` and lock files can be consolidated (see [Consolidation Plan](./thisplanfile.md))
- Propose a single root-level dependency structure unless isolation is required
- Remove unnecessary duplicates and update scripts/configs

---

*This file is linked from the main consolidation plan and will be updated as the inventory progresses. See [Consolidation and Structure Optimization Plan](./thisplanfile.md) for next actions.*
