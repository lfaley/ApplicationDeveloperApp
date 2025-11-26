# 🚀 GitHub Setup Guide for Beginners

**Complete step-by-step instructions for creating a GitHub repository and connecting your project**

---

## Table of Contents
1. [Create a GitHub Account](#step-1-create-a-github-account)
2. [Create a Personal Access Token (PAT)](#step-2-create-a-personal-access-token-pat)
3. [Create a New Repository](#step-3-create-a-new-repository)
4. [Connect Your Project to GitHub](#step-4-connect-your-project-to-github)
5. [Troubleshooting](#troubleshooting)

---

## Step 1: Create a GitHub Account

**If you already have a GitHub account, skip to [Step 2](#step-2-create-a-personal-access-token-pat)**

### 1.1 Visit GitHub
- Go to: **https://github.com**
- Click the **"Sign up"** button in the top-right corner

### 1.2 Create Your Account
1. **Enter your email address** and click **Continue**
2. **Create a password** (must be at least 15 characters OR 8+ characters with a number and lowercase letter)
3. **Choose a username** (this will be your GitHub identity)
4. **Complete verification** (solve the puzzle)
5. Click **"Create account"**

### 1.3 Verify Your Email
1. Check your email inbox for a message from GitHub
2. Click the verification link or enter the code provided
3. Complete the welcome survey (optional)

✅ **Account Created!** You now have a GitHub account.

---

## Step 2: Create a Personal Access Token (PAT)

**Why do I need this?** A Personal Access Token (PAT) allows ProjectPlanner to securely create and manage repositories on your behalf without storing your password.

### 2.1 Access Token Settings
1. **Log in to GitHub**: https://github.com
2. Click your **profile picture** in the top-right corner
3. Click **"Settings"**
4. Scroll down in the left sidebar and click **"Developer settings"** (near the bottom)
5. Click **"Personal access tokens"** → **"Tokens (classic)"**

**Direct Link:** https://github.com/settings/tokens

### 2.2 Generate New Token
1. Click **"Generate new token"** → **"Generate new token (classic)"**
2. You may be asked to confirm your password

### 2.3 Configure Token
Fill out the token form:

| Field | Value |
|-------|-------|
| **Note** | `ProjectPlanner GUI` (or any name to remember this token) |
| **Expiration** | Choose: `90 days` (recommended) or `No expiration` (less secure but convenient) |
| **Select scopes** | ✅ Check **`repo`** (this gives full control of private repositories) |

### 2.4 Generate and Copy
1. Click **"Generate token"** at the bottom
2. **⚠️ IMPORTANT:** You'll see your new token (starts with `ghp_`)
3. **Copy it immediately** - you won't be able to see it again!
4. **Save it securely** (in a password manager or safe document)

**Example token:** `ghp_1234567890abcdefghijklmnopqrstuvwxyz`

✅ **Token Created!** You can now use this in ProjectPlanner GUI.

---

## Step 3: Create a New Repository

**Choose ONE of these methods:**

### Method A: Let ProjectPlanner Create It (Recommended)

If you're using the ProjectPlanner GUI with a valid PAT token:

1. Check the box **"Create GitHub Repository"**
2. Enter your **GitHub username**
3. Paste your **Personal Access Token**
4. Click **"Create Project"**
5. ProjectPlanner will automatically create the repository and push your code!

✅ **That's it!** ProjectPlanner handles everything automatically.

---

### Method B: Manually Create Repository

If you prefer to create the repository yourself:

#### 3.1 Create Repository on GitHub
1. Go to: https://github.com
2. Click the **"+"** icon in the top-right corner
3. Select **"New repository"**

**Direct Link:** https://github.com/new

#### 3.2 Configure Repository
Fill out the form:

| Field | Value |
|-------|-------|
| **Owner** | Your username (should be pre-selected) |
| **Repository name** | Enter your project name (e.g., `my-awesome-project`) |
| **Description** | Brief description of your project (optional) |
| **Public/Private** | Choose **Public** (free) or **Private** (requires paid plan for unlimited) |
| **Initialize this repository with:** | ❌ **LEAVE ALL UNCHECKED** (ProjectPlanner already created these files) |

⚠️ **Important:** Do NOT check "Add a README file", "Add .gitignore", or "Choose a license" - your project already has these!

#### 3.3 Create Repository
1. Click **"Create repository"**
2. You'll see a page with instructions - **copy the HTTPS URL** (looks like `https://github.com/username/repo-name.git`)

✅ **Repository Created!** Now let's connect your code.

---

## Step 4: Connect Your Project to GitHub

### Option A: Using ProjectPlanner GUI

**If you created the project with ProjectPlanner GUI but didn't set up GitHub initially:**

1. Open **PowerShell** or **Command Prompt**
2. Navigate to your project folder:
   ```powershell
   cd "C:\Path\To\Your\Project"
   ```
3. Run these commands (replace `YOUR_USERNAME` and `YOUR_REPO_NAME`):
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```
4. When prompted for credentials:
   - **Username:** Your GitHub username
   - **Password:** Your Personal Access Token (NOT your GitHub password!)

✅ **Code Pushed!** Your project is now on GitHub.

---

### Option B: Manual Git Setup (If Starting from Scratch)

**If you have an existing project without git:**

1. Open **PowerShell** in your project directory
2. Initialize Git:
   ```powershell
   git init
   ```
3. Add all files:
   ```powershell
   git add -A
   ```
4. Create first commit:
   ```powershell
   git commit -m "Initial commit"
   ```
5. Add GitHub remote (replace URL with your repository):
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```
6. Push to GitHub:
   ```powershell
   git branch -M main
   git push -u origin main
   ```
7. Enter credentials when prompted:
   - **Username:** Your GitHub username
   - **Password:** Your Personal Access Token

✅ **Repository Connected!** Future pushes only need `git push`.

---

## Troubleshooting

### ❌ "remote: Support for password authentication was removed"

**Problem:** You tried to use your GitHub password instead of a Personal Access Token.

**Solution:** Use your PAT (starts with `ghp_`) as the password, not your GitHub account password.

---

### ❌ "fatal: remote origin already exists"

**Problem:** Your project already has a remote configured.

**Solution:** 
```powershell
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

---

### ❌ "refusing to merge unrelated histories"

**Problem:** You initialized the GitHub repo with README/license and your local project has different history.

**Solution:**
```powershell
git pull origin main --allow-unrelated-histories
git push -u origin main
```

**Better Solution:** When creating repository, DON'T check "Initialize this repository with" options.

---

### ❌ "Repository not found" or "403 Forbidden"

**Problem:** Token doesn't have correct permissions or repository name is wrong.

**Solutions:**
1. **Check repository URL:** Make sure you spelled the username and repo name correctly
2. **Check token permissions:** Token must have `repo` scope checked
3. **Regenerate token:** Create a new token with `repo` scope and try again

---

### ❌ "Token has expired"

**Problem:** Your Personal Access Token expired.

**Solution:** 
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"**
3. Follow [Step 2](#step-2-create-a-personal-access-token-pat) again
4. Update the token in ProjectPlanner GUI

---

### ❌ "git: command not found"

**Problem:** Git is not installed on your computer.

**Solution:**
1. Download Git: https://git-scm.com/downloads
2. Run the installer (use default settings)
3. Restart PowerShell/Command Prompt
4. Verify installation: `git --version`

---

## Quick Reference

### Essential Git Commands

```powershell
# Check git status
git status

# Add files to staging
git add -A                    # Add all files
git add filename.txt          # Add specific file

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push                      # Push to current branch
git push -u origin main       # First push (set upstream)

# Pull from GitHub
git pull                      # Get latest changes

# View commit history
git log --oneline

# Check configured remotes
git remote -v
```

---

## Additional Resources

### Official Documentation
- **GitHub Docs:** https://docs.github.com
- **Git Documentation:** https://git-scm.com/doc
- **GitHub Quickstart:** https://docs.github.com/en/get-started/quickstart

### Video Tutorials
- **Git & GitHub for Beginners:** https://www.youtube.com/watch?v=RGOj5yH7evk
- **GitHub Official YouTube:** https://www.youtube.com/c/GitHub

### Interactive Learning
- **GitHub Skills:** https://skills.github.com (free interactive courses)
- **Learn Git Branching:** https://learngitbranching.js.org (visual game)

### GitHub Support
- **GitHub Community:** https://github.community
- **GitHub Support:** https://support.github.com

---

## Security Best Practices

### ✅ DO:
- Store tokens in a password manager (1Password, LastPass, Bitwarden)
- Use token expiration (30-90 days recommended)
- Create tokens with minimum required permissions
- Delete tokens you no longer use
- Use different tokens for different applications

### ❌ DON'T:
- Share your tokens publicly (Slack, Discord, GitHub issues)
- Commit tokens to git repositories
- Use the same token for everything
- Give tokens more permissions than needed
- Store tokens in plain text files

---

## Success Checklist

After following this guide, you should have:

- ✅ A GitHub account created and verified
- ✅ A Personal Access Token generated and saved securely
- ✅ A repository created on GitHub
- ✅ Your project code pushed to GitHub
- ✅ Ability to push future changes with `git push`

---

## Need More Help?

**Still stuck?** Contact options:

1. **GitHub Support:** https://support.github.com/contact
2. **ProjectPlanner Issues:** https://github.com/lfaley/ProjectPlanner/issues
3. **Stack Overflow:** https://stackoverflow.com (tag: `git` or `github`)

---

**Last Updated:** November 16, 2025  
**Version:** 1.0  
**License:** MIT
