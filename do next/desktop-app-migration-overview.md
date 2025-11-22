# ProjectPlanner Desktop App Migration Overview

## 1. Desktop App Technology Choices

- **Electron** (recommended): Cross-platform, reuses web UI, access to native OS features.
- **Tauri**: Lightweight, Rust backend, web frontend.
- **.NET (WPF/WinForms)**: Windows only, requires full UI rewrite.

## 2. Key Migration Steps

### A. Project Setup
- Scaffold Electron app.
- Move existing HTML/CSS/JS UI into Electron’s directory.

### B. Backend Integration
- Move Node.js backend logic into Electron’s main process or preload scripts.
- Use Electron APIs for filesystem, Git, and process management.

### C. Native Features
- Replace manual path entry with native dialogs.
- Enable direct filesystem access.

### D. Security & Packaging
- Harden Electron app.
- Package for Windows, macOS, Linux.

### E. Testing & Distribution
- Test all workflows in desktop environment.
- Create installer packages.

## 3. Code Changes Required
- Minor UI changes for Electron APIs.
- Move backend logic to Electron main process.
- Use IPC for UI/backend communication.
- Add Electron dependencies.

## 4. Benefits
- Native folder/file browsing.
- Full local filesystem access.
- No browser security restrictions.
- Easy install and launch.

## 5. Risks & Considerations
- Larger app size.
- Desktop packaging/updates required.
- Node.js modules may need adaptation.

## 6. Example Electron Features
- `dialog.showOpenDialog` for folder selection.
- `fs` for file operations.
- `child_process` for Git commands.
- `ipcMain`/`ipcRenderer` for communication.

## 7. Migration Effort Estimate
- Setup: 1-2 days
- Backend refactor: 2-4 days
- UI integration/testing: 2-3 days
- Packaging: 1-2 days

---

Migrating ProjectPlanner to a desktop app (Electron) is straightforward and allows reuse of your web UI, while gaining native OS features and removing browser limitations. Main work: refactor backend logic and integrate native dialogs/filesystem access.
