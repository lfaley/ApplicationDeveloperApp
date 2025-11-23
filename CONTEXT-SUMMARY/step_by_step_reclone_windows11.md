# Step-by-Step: Cleaning and Re-Cloning ProjectPlanner (Windows 11)

## 1. Close All Programs
- Close Visual Studio, VS Code, Notepad, terminals, and any other programs that might use files in `ProjectPlanner`.

## 2. Open PowerShell as Administrator
- Right-click the PowerShell icon and select **"Run as administrator"**.

## 3. Navigate to the Correct Directory
```powershell
cd C:\Users\faley\Desktop\Code\Repos\
```

## 4. Rename the Old Folder (Backup)
```powershell
Rename-Item ProjectPlanner ProjectPlanner-backup
```
- If you get an access denied error, proceed to the next step.

## 5. If Rename Fails, Delete the Folder
**Warning:** Only do this if you have a backup or no longer need the files.
```powershell
Remove-Item -Recurse -Force ProjectPlanner
```
- If deletion fails, use Windows Explorer to delete the folder, or use a tool like [LockHunter](https://lockhunter.com/).

## 6. Clone a Fresh Copy from GitHub
```powershell
git clone git@github.com:lfaley/ProjectPlannerApp.git ProjectPlanner
cd ProjectPlanner
```

## 7. Copy Only Source/Config Files from Backup
- Manually copy your source code, config, and documentation files from `ProjectPlanner-backup` to `ProjectPlanner`.
- **Do NOT copy:** `.git`, `node_modules`, `dist`, build artifacts, or files listed in `.gitignore`.

## 8. Stage, Commit, and Push
```powershell
git add .
git commit -m "Clean push from fresh clone"
git push origin main
```
- Replace `main` with your branch name if needed (e.g., `agentsPart2`).

## 9. Log Each Step
- After each major step, add a note to `CONTEXT-SUMMARY/context_summary.md` describing what you did and the result.

---

**If you encounter any errors, document them in the summary file and ask for help with the exact error message.**
