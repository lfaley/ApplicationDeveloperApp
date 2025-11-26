# Plan of Attack: Guarantee Latest UI and Features Are Running with start-all.ps1

## Goal
Ensure that running `start-all.ps1` always launches the latest, correct version of the Electron app and all backend services, with all new features (such as "Existing Project Review") visible and functional.

## Steps

1. **Verify Codebase State**
   - Ensure you are on the correct branch (usually `main` or the feature branch).
   - Pull the latest changes from the remote repository.
   - Confirm that the code for new features (e.g., "Existing Project Review" button) is present in `electron-app/App.jsx`.

2. **Clean and Reinstall Dependencies**
   - Delete `node_modules` and any build output directories (e.g., `dist`) in `electron-app` and all agent directories.
   - Run `npm install` in each directory to ensure all dependencies are up to date.

3. **Rebuild All Projects**
   - Run `npm run build` in all TypeScript or build-required directories (Electron app, agents, etc.).
   - Ensure no build errors are present.

4. **Update and Fix start-all.ps1**
   - Use correct PowerShell quoting and command structure to avoid command errors.
   - Ensure the script installs root dependencies, then starts dashboard, Electron app, and all agents in the correct order.
   - Add error handling and clear output for each step.

5. **Run start-all.ps1**
   - From the project root, run `powershell -ExecutionPolicy Bypass -File .\start-all.ps1`.
   - Confirm that all services start in separate PowerShell windows without errors.

6. **Verify Electron App UI**
   - Check that the Electron app window opens and displays the latest UI, including the "+ Create New Project" and "Existing Project Review" buttons.
   - If not, check for errors in the Electron app console and terminal output.

7. **Troubleshoot if Features Are Missing**
   - If the UI is not updated, repeat steps 1-3 to ensure code and builds are current.
   - If the code is present but not showing, check for build or runtime errors.
   - If needed, manually add the required UI code to `App.jsx` and rebuild.

8. **Document and Automate**
   - Document these steps in the repository for all developers.
   - Optionally, add a script to automate cleaning, installing, and building all directories before running `start-all.ps1`.

## Checklist
- [ ] On correct branch and up to date
- [ ] Code for new features present in `App.jsx`
- [ ] All dependencies reinstalled
- [ ] All projects rebuilt
- [ ] start-all.ps1 launches all services without errors
- [ ] Electron app shows latest UI and features
- [ ] Troubleshooting steps followed if issues arise
- [ ] Steps documented for team

---

*Follow this plan to guarantee that running start-all.ps1 always launches the latest, correct version of your application and services.*
