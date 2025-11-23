# ProjectPlanner Push Issue Context Summary

## Problem Statement
- Unable to push to GitHub due to repeated errors: "broken pipe", "unexpected disconnect", "Permission denied (publickey)", etc.
- BFG and SSH setup completed, but push still fails.
- Suspected causes: large repo size, leftover large files, network issues, uncleaned git history, or GitHub limits.

---

## Canonical Working Directory
- **All commands and file operations should be run from:**

  ```
  C:\Users\faley\Desktop\Code\Repos\ProjectPlanner
  ```

---

## Plan of Attack (Based on Research)

### 1. Root Cause Analysis
- Large repo size or large files in history
- Unnecessary files/folders (node_modules, logs, binaries, etc.)
- Old refs, tags, or packfiles
- Network or GitHub server-side limits

### 2. Aggressive Cleanup Steps

#### A. Clean Up the Repo Locally

- [ ] Remove all unnecessary files/folders (node_modules, dist, *.log, *.exe, *.dll, *.zip, *.tar, .DS_Store, Thumbs.db, .env, etc.)
- [ ] Ensure .gitignore is up to date
- [ ] Remove all old git refs and packfiles:
  ```powershell
  $refs = git for-each-ref --format="%(refname)" refs/original/
  foreach ($ref in $refs) { git update-ref -d $ref }
  git reflog expire --expire=now --all
  git gc --prune=now --aggressive
  ```
- [ ] Run BFG for folders and file types:
  ```powershell
  java -jar bfg-1.15.0.jar --delete-folders node_modules --delete-files '*.log,*.exe,*.dll,*.zip,*.tar,*.env,Thumbs.db,.DS_Store'
  git reflog expire --expire=now --all
  git gc --prune=now --aggressive
  ```
- [ ] Remove all tags (if not needed):
  ```powershell
  git tag -l | ForEach-Object { git tag -d $_ }
  git tag -l | ForEach-Object { git push --delete origin $_ }
  ```

#### B. Create a Fresh Clone (if above fails)
- [ ] Clone the cleaned repo to a new directory:
  ```powershell
  git clone --bare <path-to-cleaned-repo> ../ProjectPlanner-clean.git
  cd ../ProjectPlanner-clean.git
  git push --mirror git@github.com:lfaley/ProjectPlannerApp.git
  ```

#### C. Push in Smaller Chunks (if still failing)
- [ ] Try pushing one branch at a time:
  ```powershell
  git push --force origin main
  git push --force origin agentsPart2
  # ...repeat for other branches
  ```

#### D. If All Else Fails
- [ ] Create a new GitHub repo, push only the latest clean code (no history), and start fresh.

---

## Progress Tracker
- [ ] Step 1: Remove unnecessary files/folders
- [ ] Step 2: Clean refs and run BFG
- [ ] Step 3: Prune and garbage collect
- [ ] Step 4: Try push (document result)
- [ ] Step 5: If failed, try fresh clone and mirror push
- [ ] Step 6: If failed, try new repo with clean code only

---

## Errors/Results Log
- Log each error or result here for future reference.

---

## Lessons Learned
- Document what worked, what didn’t, and best practices for future repo management.

---

**Update this file as you progress through each step.**
