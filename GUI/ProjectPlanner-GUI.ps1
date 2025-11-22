# ProjectPlanner GUI Application
# Version 1.0
# Purpose: Interactive GUI for creating projects with comprehensive testing & planning documentation

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# ============================================================================
# CONFIGURATION & HELPERS
# ============================================================================

$script:ProjectPlannerPath = $PSScriptRoot
$script:GitHubToken = $null
$script:ProjectData = @{
    ProjectName = ""
    ProjectPath = ""
    ProjectType = "new"  # "new" or "existing"
    Language = "JavaScript"
    Framework = ""
    Description = ""
    GitHubUsername = ""
    CreateGitHub = $false
    IncludeContextSummary = $true
    IncludeTesting = $true
    IncludeGUIDesign = $false
    IncludeCodingStandards = $false
}

function Write-Log {
    param([string]$Message, [string]$Type = "Info")
    $timestamp = Get-Date -Format "HH:mm:ss"
    $color = switch ($Type) {
        "Success" { "Green" }
        "Error" { "Red" }
        "Warning" { "Yellow" }
        default { "White" }
    }
    
    $logMessage = "[$timestamp] $Message"
    $script:LogTextBox.AppendText("$logMessage`r`n")
    $script:LogTextBox.SelectionStart = $script:LogTextBox.Text.Length
    $script:LogTextBox.ScrollToCaret()
    
    Write-Host $logMessage -ForegroundColor $color
}

function Show-GitHubSetupGuide {
    # Create a new form for the GitHub setup guide
    $guideForm = New-Object System.Windows.Forms.Form
    $guideForm.Text = "GitHub Setup Guide - Step-by-Step Instructions"
    $guideForm.Size = New-Object System.Drawing.Size(1000, 700)
    $guideForm.StartPosition = "CenterScreen"
    $guideForm.FormBorderStyle = "Sizable"
    $guideForm.MinimizeBox = $true
    $guideForm.MaximizeBox = $true
    
    # Main panel with scrollbar
    $panel = New-Object System.Windows.Forms.Panel
    $panel.Location = New-Object System.Drawing.Point(10, 10)
    $panel.Size = New-Object System.Drawing.Size(960, 590)
    $panel.AutoScroll = $true
    $panel.BorderStyle = "FixedSingle"
    $guideForm.Controls.Add($panel)
    
    # Title
    $titleLabel = New-Object System.Windows.Forms.Label
    $titleLabel.Location = New-Object System.Drawing.Point(10, 10)
    $titleLabel.Size = New-Object System.Drawing.Size(900, 30)
    $titleLabel.Text = "🚀 GitHub Setup Guide for Beginners"
    $titleLabel.Font = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
    $panel.Controls.Add($titleLabel)
    
    # Instructions text box
    $textBox = New-Object System.Windows.Forms.RichTextBox
    $textBox.Location = New-Object System.Drawing.Point(10, 50)
    $textBox.Size = New-Object System.Drawing.Size(920, 1800)
    $textBox.ReadOnly = $true
    $textBox.Font = New-Object System.Drawing.Font("Segoe UI", 10)
    $textBox.BackColor = [System.Drawing.Color]::White
    
    # Load guide content
    $guideContent = @"
COMPLETE STEP-BY-STEP INSTRUCTIONS FOR CREATING A GITHUB REPOSITORY

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TABLE OF CONTENTS:
1. Create a GitHub Account
2. Create a Personal Access Token (PAT)
3. Create a New Repository
4. Connect Your Project to GitHub
5. Troubleshooting

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: CREATE A GITHUB ACCOUNT
(Skip this step if you already have an account)

1.1 Visit GitHub
    • Go to: https://github.com
    • Click "Sign up" in the top-right corner

1.2 Create Your Account
    • Enter your email address → Click Continue
    • Create a password (15+ characters OR 8+ with number and lowercase)
    • Choose a username (this is your GitHub identity)
    • Complete verification puzzle
    • Click "Create account"

1.3 Verify Your Email
    • Check email inbox for message from GitHub
    • Click verification link or enter code
    • Complete welcome survey (optional)

✅ Account Created!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 2: CREATE A PERSONAL ACCESS TOKEN (PAT)

Why? A PAT allows ProjectPlanner to securely create repositories without your password.

2.1 Access Token Settings
    • Log in to GitHub: https://github.com
    • Click your profile picture (top-right)
    • Click "Settings"
    • Scroll down and click "Developer settings" (bottom of sidebar)
    • Click "Personal access tokens" → "Tokens (classic)"
    
    📎 Direct Link: https://github.com/settings/tokens

2.2 Generate New Token
    • Click "Generate new token" → "Generate new token (classic)"
    • Confirm your password if asked

2.3 Configure Token
    • Note: Enter "ProjectPlanner GUI" (or any reminder name)
    • Expiration: Choose "90 days" (recommended) or "No expiration"
    • Select scopes: ✅ Check "repo" (full control of repositories)

2.4 Generate and Copy
    • Click "Generate token" at bottom
    • ⚠️ IMPORTANT: Copy the token immediately (starts with ghp_)
    • You won't be able to see it again!
    • Save it securely (password manager or safe document)

    Example token: ghp_1234567890abcdefghijklmnopqrstuvwxyz

✅ Token Created! Paste this in ProjectPlanner GUI.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 3: LET PROJECTPLANNER CREATE THE REPOSITORY (EASIEST!)

3.1 In ProjectPlanner GUI:
    • Check the box "Create GitHub Repository"
    • Enter your GitHub username
    • Paste your Personal Access Token
    • Click "Create Project"

✅ That's it! ProjectPlanner creates the repository and pushes your code automatically!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTERNATIVE: MANUALLY CREATE REPOSITORY

If you prefer to create the repository yourself:

3.1 Create Repository
    • Go to: https://github.com/new
    • Owner: Your username (pre-selected)
    • Repository name: Enter your project name
    • Description: Brief project description (optional)
    • Public/Private: Choose Public (free)
    • ⚠️ IMPORTANT: LEAVE ALL CHECKBOXES UNCHECKED
      (Don't add README, .gitignore, or license - you already have them!)

3.2 Create and Copy URL
    • Click "Create repository"
    • Copy the HTTPS URL (https://github.com/username/repo-name.git)

3.3 Connect in PowerShell
    Open PowerShell in your project folder and run:

    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git push -u origin main

    When prompted:
    • Username: Your GitHub username
    • Password: Your Personal Access Token (NOT your GitHub password!)

✅ Code Pushed! Your project is now on GitHub.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TROUBLESHOOTING COMMON ISSUES

❌ "remote: Support for password authentication was removed"
   Solution: Use your PAT as password, NOT your GitHub account password

❌ "fatal: remote origin already exists"
   Solution: Run these commands:
   git remote remove origin
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

❌ "refusing to merge unrelated histories"
   Solution: You checked "Initialize repository" on GitHub. Run:
   git pull origin main --allow-unrelated-histories
   git push -u origin main

❌ "Repository not found" or "403 Forbidden"
   Solutions:
   • Check repository URL spelling
   • Verify token has "repo" scope
   • Generate new token and try again

❌ "Token has expired"
   Solution: Generate new token at https://github.com/settings/tokens

❌ "git: command not found"
   Solution: Install Git from https://git-scm.com/downloads

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USEFUL GIT COMMANDS

Check status:           git status
Add files:              git add -A
Commit changes:         git commit -m "message"
Push to GitHub:         git push
Pull from GitHub:       git pull
View history:           git log --oneline
Check remotes:          git remote -v

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECURITY BEST PRACTICES

✅ DO:
  • Store tokens in password manager
  • Use token expiration (30-90 days)
  • Create tokens with minimum permissions
  • Delete unused tokens

❌ DON'T:
  • Share tokens publicly
  • Commit tokens to repositories
  • Use same token for everything
  • Store tokens in plain text

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ADDITIONAL RESOURCES

📚 Documentation:
   • GitHub Docs: https://docs.github.com
   • Git Docs: https://git-scm.com/doc
   • GitHub Quickstart: https://docs.github.com/en/get-started/quickstart

🎥 Video Tutorials:
   • Git & GitHub for Beginners: https://www.youtube.com/watch?v=RGOj5yH7evk
   • GitHub YouTube: https://www.youtube.com/c/GitHub

🎮 Interactive Learning:
   • GitHub Skills: https://skills.github.com
   • Learn Git Branching: https://learngitbranching.js.org

💬 Support:
   • GitHub Community: https://github.community
   • GitHub Support: https://support.github.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Full detailed guide with screenshots available in:
   GUI/GITHUB_SETUP_GUIDE.md

Need more help? Visit: https://github.com/lfaley/ProjectPlanner/issues

"@
    
    $textBox.Text = $guideContent
    $panel.Controls.Add($textBox)
    
    # Button panel at bottom
    $btnPanel = New-Object System.Windows.Forms.Panel
    $btnPanel.Location = New-Object System.Drawing.Point(10, 610)
    $btnPanel.Size = New-Object System.Drawing.Size(960, 40)
    $guideForm.Controls.Add($btnPanel)
    
    # Open Full Guide button
    $btnOpenGuide = New-Object System.Windows.Forms.Button
    $btnOpenGuide.Location = New-Object System.Drawing.Point(10, 5)
    $btnOpenGuide.Size = New-Object System.Drawing.Size(200, 30)
    $btnOpenGuide.Text = "📄 Open Full Guide (MD)"
    $btnOpenGuide.Add_Click({
        $guidePath = Join-Path $script:ProjectPlannerPath "GITHUB_SETUP_GUIDE.md"
        if (Test-Path $guidePath) {
            Start-Process $guidePath
        }
        else {
            [System.Windows.Forms.MessageBox]::Show("Guide file not found: $guidePath", "Error", "OK", "Error")
        }
    })
    $btnPanel.Controls.Add($btnOpenGuide)
    
    # Open GitHub Token Page button
    $btnOpenToken = New-Object System.Windows.Forms.Button
    $btnOpenToken.Location = New-Object System.Drawing.Point(220, 5)
    $btnOpenToken.Size = New-Object System.Drawing.Size(220, 30)
    $btnOpenToken.Text = "🔑 Create GitHub Token"
    $btnOpenToken.Add_Click({
        Start-Process "https://github.com/settings/tokens"
    })
    $btnPanel.Controls.Add($btnOpenToken)
    
    # Open GitHub New Repo button
    $btnOpenNewRepo = New-Object System.Windows.Forms.Button
    $btnOpenNewRepo.Location = New-Object System.Drawing.Point(450, 5)
    $btnOpenNewRepo.Size = New-Object System.Drawing.Size(220, 30)
    $btnOpenNewRepo.Text = "➕ Create GitHub Repo"
    $btnOpenNewRepo.Add_Click({
        Start-Process "https://github.com/new"
    })
    $btnPanel.Controls.Add($btnOpenNewRepo)
    
    # Close button
    $btnClose = New-Object System.Windows.Forms.Button
    $btnClose.Location = New-Object System.Drawing.Point(840, 5)
    $btnClose.Size = New-Object System.Drawing.Size(100, 30)
    $btnClose.Text = "Close"
    $btnClose.Add_Click({
        $guideForm.Close()
    })
    $btnPanel.Controls.Add($btnClose)
    
    # Show the form
    $guideForm.ShowDialog() | Out-Null
}

function Test-GitHubToken {
    param([string]$Token)
    
    try {
        $headers = @{
            Authorization = "token $Token"
            Accept = "application/vnd.github.v3+json"
        }
        $response = Invoke-RestMethod -Uri "https://api.github.com/user" -Headers $headers -Method Get
        return $true
    }
    catch {
        return $false
    }
}

function Create-GitHubRepository {
    param(
        [string]$RepoName,
        [string]$Description,
        [string]$Token
    )
    
    try {
        $headers = @{
            Authorization = "token $Token"
            Accept = "application/vnd.github.v3+json"
        }
        
        $body = @{
            name = $RepoName
            description = $Description
            private = $false
            auto_init = $false
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Headers $headers -Method Post -Body $body -ContentType "application/json"
        
        return $response.clone_url
    }
    catch {
        throw "Failed to create GitHub repository: $_"
    }
}

function Copy-TemplateFiles {
    param(
        [string]$DestinationPath,
        [bool]$IncludeContextSummary,
        [bool]$IncludeTesting,
        [bool]$IncludeGUIDesign,
        [bool]$IncludeCodingStandards
    )
    
    Write-Log "Copying documentation files..." "Info"
    
    # Get ProjectPlanner root directory (parent of GUI folder)
    $projectPlannerRoot = Split-Path $script:ProjectPlannerPath -Parent
    
    # Core documentation files (always include)
    $coreFiles = @(
        @{ Path = "README.md"; Source = $projectPlannerRoot },
        @{ Path = "HOW_TO_USE_THIS_TEMPLATE.md"; Source = Join-Path $projectPlannerRoot "DOCS-NEW-PROJECTS" },
        @{ Path = "TOKEN_EFFICIENT_KICKOFF.md"; Source = Join-Path $projectPlannerRoot "PLANNING" },
        @{ Path = "PLAN_OF_ATTACK_TEMPLATE.md"; Source = Join-Path $projectPlannerRoot "PLANNING" }
    )
    
    foreach ($file in $coreFiles) {
        $sourcePath = Join-Path $file.Source $file.Path
        if (Test-Path $sourcePath) {
            Copy-Item $sourcePath -Destination $DestinationPath -Force
            Write-Log "  ✓ Copied $($file.Path)" "Success"
        }
    }
    
    # Testing documentation
    if ($IncludeTesting) {
        Write-Log "Copying testing documentation..." "Info"
        $testingFolder = Join-Path $projectPlannerRoot "STANDARDS\TESTING"
        $testingFiles = @(
            "TESTING_STANDARDS.md",
            "TESTING_STRATEGY_TEMPLATE.md",
            "FRAMEWORK_SPECIFIC_EXAMPLES.md",
            "AI_TEST_GENERATION_GUIDE.md",
            "VISUAL_EXAMPLES.md"
        )
        
        foreach ($file in $testingFiles) {
            $sourcePath = Join-Path $testingFolder $file
            if (Test-Path $sourcePath) {
                Copy-Item $sourcePath -Destination $DestinationPath -Force
                Write-Log "  ✓ Copied $file" "Success"
            }
        }
    }
    
    # GUI Design documentation
    if ($IncludeGUIDesign) {
        Write-Log "Copying GUI design documentation..." "Info"
        $guiFolder = Join-Path $projectPlannerRoot "STANDARDS\GUI_DESIGN"
        $guiFiles = @(
            "GUI_DESIGN_STANDARDS.md",
            "GUI_DESIGN_CHECKLIST.md"
        )
        
        foreach ($file in $guiFiles) {
            $sourcePath = Join-Path $guiFolder $file
            if (Test-Path $sourcePath) {
                Copy-Item $sourcePath -Destination $DestinationPath -Force
                Write-Log "  ✓ Copied $file" "Success"
            }
        }
    }
    
    # Coding Standards documentation
    if ($IncludeCodingStandards) {
        Write-Log "Copying coding standards documentation..." "Info"
        $codingFolder = Join-Path $projectPlannerRoot "STANDARDS\CODING"
        $codingFiles = @(
            "CODING_STANDARDS.md"
        )
        
        foreach ($file in $codingFiles) {
            $sourcePath = Join-Path $codingFolder $file
            if (Test-Path $sourcePath) {
                Copy-Item $sourcePath -Destination $DestinationPath -Force
                Write-Log "  ✓ Copied $file" "Success"
            }
        }
    }
    
    # Context Summary system
    if ($IncludeContextSummary) {
        Write-Log "Copying Context Summary system..." "Info"
        $contextPath = Join-Path $DestinationPath "Context-Summaries"
        New-Item -ItemType Directory -Path $contextPath -Force | Out-Null
        
        $contextSummaryFolder = Join-Path $projectPlannerRoot "CONTEXT-SUMMARY"
        if (Test-Path $contextSummaryFolder) {
            Copy-Item "$contextSummaryFolder\*" -Destination $contextPath -Recurse -Force
            Write-Log "  ✓ Copied Context Summary templates" "Success"
        }
    }
}

function Initialize-GitRepository {
    param(
        [string]$ProjectPath,
        [string]$RemoteUrl = ""
    )
    
    Push-Location $ProjectPath
    
    try {
        Write-Log "Initializing Git repository..." "Info"
        git init
        git add -A
        git commit -m "Initial commit from ProjectPlanner template"
        
        if ($RemoteUrl) {
            Write-Log "Adding GitHub remote..." "Info"
            git remote add origin $RemoteUrl
            git branch -M main
            git push -u origin main
            Write-Log "  ✓ Pushed to GitHub" "Success"
        }
        
        Write-Log "  ✓ Git repository initialized" "Success"
    }
    catch {
        Write-Log "Error initializing Git: $_" "Error"
        throw
    }
    finally {
        Pop-Location
    }
}

function Create-ProjectStructure {
    param([string]$ProjectPath, [string]$Framework)
    
    Write-Log "Creating project structure..." "Info"
    
    # Create base directories
    $directories = @(
        "src",
        "tests",
        "docs"
    )
    
    foreach ($dir in $directories) {
        $dirPath = Join-Path $ProjectPath $dir
        New-Item -ItemType Directory -Path $dirPath -Force | Out-Null
        Write-Log "  ✓ Created $dir/ directory" "Success"
    }
    
    # Framework-specific setup
    switch ($Framework) {
        "React (Vite)" {
            Write-Log "Initializing Vite + React project..." "Info"
            Push-Location $ProjectPath
            npm create vite@latest . -- --template react-ts
            Pop-Location
        }
        "Next.js" {
            Write-Log "Initializing Next.js project..." "Info"
            Push-Location $ProjectPath
            npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
            Pop-Location
        }
        "Node.js (Express)" {
            Write-Log "Initializing Node.js project..." "Info"
            Push-Location $ProjectPath
            npm init -y
            npm install express
            npm install --save-dev typescript @types/node @types/express ts-node nodemon
            Pop-Location
        }
        "React Native (Expo)" {
            Write-Log "Initializing Expo project..." "Info"
            Push-Location $ProjectPath
            npx create-expo-app@latest . --template blank-typescript
            Pop-Location
        }
    }
}

# ============================================================================
# MODERN UI DESIGN SYSTEM
# ============================================================================

# Color Palette - Modern Professional Design
$colors = @{
    Primary = [System.Drawing.Color]::FromArgb(0, 120, 215)      # Modern Blue
    PrimaryDark = [System.Drawing.Color]::FromArgb(0, 90, 158)   # Darker Blue
    Success = [System.Drawing.Color]::FromArgb(16, 124, 16)      # Green
    Warning = [System.Drawing.Color]::FromArgb(255, 185, 0)      # Amber
    Danger = [System.Drawing.Color]::FromArgb(196, 43, 28)       # Red
    Background = [System.Drawing.Color]::FromArgb(243, 243, 243) # Light Gray
    Surface = [System.Drawing.Color]::White                       # White
    Border = [System.Drawing.Color]::FromArgb(200, 200, 200)     # Gray Border
    TextPrimary = [System.Drawing.Color]::FromArgb(32, 32, 32)   # Dark Gray
    TextSecondary = [System.Drawing.Color]::FromArgb(96, 96, 96) # Medium Gray
}

# Typography
$fonts = @{
    Title = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
    Header = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
    Body = New-Object System.Drawing.Font("Segoe UI", 10)
    BodyBold = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
    Small = New-Object System.Drawing.Font("Segoe UI", 9)
    Button = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
}

# ============================================================================
# GUI COMPONENTS
# ============================================================================

# Main Form - Modern Design
$form = New-Object System.Windows.Forms.Form
$form.Text = "ProjectPlanner v5.0 - Automated Project Setup"
$form.Size = New-Object System.Drawing.Size(1000, 850)
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = "Sizable"
$form.MaximizeBox = $true
$form.MinimumSize = New-Object System.Drawing.Size(1000, 850)
$form.BackColor = $colors.Background
$form.Font = $fonts.Body

# Header Panel with Gradient Effect
$headerPanel = New-Object System.Windows.Forms.Panel
$headerPanel.Location = New-Object System.Drawing.Point(0, 0)
$headerPanel.Size = New-Object System.Drawing.Size(1000, 80)
$headerPanel.BackColor = $colors.Primary
$form.Controls.Add($headerPanel)

# Title Label
$titleLabel = New-Object System.Windows.Forms.Label
$titleLabel.Location = New-Object System.Drawing.Point(20, 15)
$titleLabel.Size = New-Object System.Drawing.Size(600, 30)
$titleLabel.Text = "🚀 ProjectPlanner"
$titleLabel.Font = $fonts.Title
$titleLabel.ForeColor = [System.Drawing.Color]::White
$titleLabel.BackColor = [System.Drawing.Color]::Transparent
$headerPanel.Controls.Add($titleLabel)

# Subtitle Label
$subtitleLabel = New-Object System.Windows.Forms.Label
$subtitleLabel.Location = New-Object System.Drawing.Point(20, 45)
$subtitleLabel.Size = New-Object System.Drawing.Size(600, 25)
$subtitleLabel.Text = "Professional project setup with comprehensive documentation and testing"
$subtitleLabel.Font = $fonts.Body
$subtitleLabel.ForeColor = [System.Drawing.Color]::FromArgb(220, 220, 220)
$subtitleLabel.BackColor = [System.Drawing.Color]::Transparent
$headerPanel.Controls.Add($subtitleLabel)

# Version Badge
$versionLabel = New-Object System.Windows.Forms.Label
$versionLabel.Location = New-Object System.Drawing.Point(880, 30)
$versionLabel.Size = New-Object System.Drawing.Size(100, 25)
$versionLabel.Text = "v5.0"
$versionLabel.Font = $fonts.BodyBold
$versionLabel.ForeColor = [System.Drawing.Color]::White
$versionLabel.BackColor = $colors.PrimaryDark
$versionLabel.TextAlign = "MiddleCenter"
$versionLabel.BorderStyle = "FixedSingle"
$headerPanel.Controls.Add($versionLabel)

# Tab Control - Modern Flat Design
$tabControl = New-Object System.Windows.Forms.TabControl
$tabControl.Location = New-Object System.Drawing.Point(20, 100)
$tabControl.Size = New-Object System.Drawing.Size(945, 650)
$tabControl.Font = $fonts.Body
$tabControl.Appearance = "FlatButtons"
$form.Controls.Add($tabControl)

# ============================================================================
# TAB 1: PROJECT SETUP
# ============================================================================

$tabSetup = New-Object System.Windows.Forms.TabPage
$tabSetup.Text = "  📋 Project Setup  "
$tabSetup.BackColor = $colors.Surface
$tabSetup.Font = $fonts.Body
$tabControl.Controls.Add($tabSetup)

# Section Helper Function
function Add-SectionHeader {
    param($Parent, $Text, $YPosition)
    $label = New-Object System.Windows.Forms.Label
    $label.Location = New-Object System.Drawing.Point(20, $YPosition)
    $label.Size = New-Object System.Drawing.Size(880, 30)
    $label.Text = $Text
    $label.Font = $fonts.Header
    $label.ForeColor = $colors.Primary
    $Parent.Controls.Add($label)
    return $YPosition + 35
}

$yPos = Add-SectionHeader $tabSetup "Project Configuration" 20

# Project Type with Modern Radio Buttons
$labelType = New-Object System.Windows.Forms.Label
$labelType.Location = New-Object System.Drawing.Point(20, $yPos)
$labelType.Size = New-Object System.Drawing.Size(200, 25)
$labelType.Text = "Project Type:"
$labelType.Font = $fonts.BodyBold
$labelType.ForeColor = $colors.TextPrimary
$tabSetup.Controls.Add($labelType)

$radioNew = New-Object System.Windows.Forms.RadioButton
$radioNew.Location = New-Object System.Drawing.Point(220, $yPos)
$radioNew.Size = New-Object System.Drawing.Size(180, 25)
$radioNew.Text = "🆕 New Project"
$radioNew.Checked = $true
$radioNew.Font = $fonts.Body
$radioNew.ForeColor = $colors.TextPrimary
$tabSetup.Controls.Add($radioNew)

$radioExisting = New-Object System.Windows.Forms.RadioButton
$radioExisting.Location = New-Object System.Drawing.Point(420, $yPos)
$radioExisting.Size = New-Object System.Drawing.Size(200, 25)
$radioExisting.Text = "📂 Existing Project"
$radioExisting.Font = $fonts.Body
$radioExisting.ForeColor = $colors.TextPrimary
$tabSetup.Controls.Add($radioExisting)

$yPos += 40

# Project Name / Existing Project Path (changes based on radio selection)
$labelName = New-Object System.Windows.Forms.Label
$labelName.Location = New-Object System.Drawing.Point(20, $yPos)
$labelName.Size = New-Object System.Drawing.Size(200, 20)
$labelName.Text = "Project Name:"
$tabSetup.Controls.Add($labelName)

$textName = New-Object System.Windows.Forms.TextBox
$textName.Location = New-Object System.Drawing.Point(220, $yPos)
$textName.Size = New-Object System.Drawing.Size(400, 28)
$textName.Font = $fonts.Body
$textName.BorderStyle = "FixedSingle"
$tabSetup.Controls.Add($textName)

# Browse button for existing project (hidden by default)
$btnBrowseExisting = New-Object System.Windows.Forms.Button
$btnBrowseExisting.Location = New-Object System.Drawing.Point(630, $yPos)
$btnBrowseExisting.Size = New-Object System.Drawing.Size(180, 30)
$btnBrowseExisting.Text = "📁 Browse Existing..."
$btnBrowseExisting.Font = $fonts.Body
$btnBrowseExisting.BackColor = $colors.Surface
$btnBrowseExisting.FlatStyle = "Flat"
$btnBrowseExisting.FlatAppearance.BorderColor = $colors.Border
$btnBrowseExisting.Cursor = "Hand"
$btnBrowseExisting.Visible = $false
$btnBrowseExisting.Add_Click({
    $folderBrowser = New-Object System.Windows.Forms.FolderBrowserDialog
    $folderBrowser.Description = "Select existing project directory"
    if ($textName.Text -and (Test-Path $textName.Text)) {
        $folderBrowser.SelectedPath = $textName.Text
    }
    if ($folderBrowser.ShowDialog() -eq "OK") {
        $textName.Text = $folderBrowser.SelectedPath
        # Auto-fill project name from folder
        $textPath.Text = Split-Path $folderBrowser.SelectedPath -Parent
    }
})
$tabSetup.Controls.Add($btnBrowseExisting)

$yPos += 30

# Project Path (for new projects)
$labelPath = New-Object System.Windows.Forms.Label
$labelPath.Location = New-Object System.Drawing.Point(20, $yPos)
$labelPath.Size = New-Object System.Drawing.Size(200, 20)
$labelPath.Text = "Project Path:"
$tabSetup.Controls.Add($labelPath)

$textPath = New-Object System.Windows.Forms.TextBox
$textPath.Location = New-Object System.Drawing.Point(220, $yPos)
$textPath.Size = New-Object System.Drawing.Size(320, 28)
$textPath.Text = "C:\Users\faley\Desktop\Code\Repos\"
$textPath.Font = $fonts.Body
$textPath.BorderStyle = "FixedSingle"
$tabSetup.Controls.Add($textPath)

$btnBrowse = New-Object System.Windows.Forms.Button
$btnBrowse.Location = New-Object System.Drawing.Point(550, $yPos)
$btnBrowse.Size = New-Object System.Drawing.Size(100, 30)
$btnBrowse.Text = "📁 Browse"
$btnBrowse.Font = $fonts.Body
$btnBrowse.BackColor = $colors.Surface
$btnBrowse.FlatStyle = "Flat"
$btnBrowse.FlatAppearance.BorderColor = $colors.Border
$btnBrowse.Cursor = "Hand"
$btnBrowse.Add_Click({
    $folderBrowser = New-Object System.Windows.Forms.FolderBrowserDialog
    $folderBrowser.SelectedPath = $textPath.Text
    if ($folderBrowser.ShowDialog() -eq "OK") {
        $textPath.Text = $folderBrowser.SelectedPath
    }
})
$tabSetup.Controls.Add($btnBrowse)

$yPos += 30

# Description
$labelDesc = New-Object System.Windows.Forms.Label
$labelDesc.Location = New-Object System.Drawing.Point(20, $yPos)
$labelDesc.Size = New-Object System.Drawing.Size(200, 20)
$labelDesc.Text = "Project Description:"
$tabSetup.Controls.Add($labelDesc)

$textDesc = New-Object System.Windows.Forms.TextBox
$textDesc.Location = New-Object System.Drawing.Point(220, $yPos)
$textDesc.Size = New-Object System.Drawing.Size(600, 60)
$textDesc.Multiline = $true
$textDesc.Font = $fonts.Body
$textDesc.BorderStyle = "FixedSingle"
$textDesc.ScrollBars = "Vertical"
$tabSetup.Controls.Add($textDesc)

$yPos += 70

# Language
$labelLang = New-Object System.Windows.Forms.Label
$labelLang.Location = New-Object System.Drawing.Point(20, $yPos)
$labelLang.Size = New-Object System.Drawing.Size(200, 20)
$labelLang.Text = "Primary Language:"
$tabSetup.Controls.Add($labelLang)

$comboLang = New-Object System.Windows.Forms.ComboBox
$comboLang.Location = New-Object System.Drawing.Point(220, $yPos)
$comboLang.Size = New-Object System.Drawing.Size(200, 20)
$comboLang.DropDownStyle = "DropDownList"
$comboLang.Items.AddRange(@("JavaScript", "TypeScript", "Python", "C#", "Java", "Go", "Ruby"))
$comboLang.SelectedIndex = 1
$tabSetup.Controls.Add($comboLang)

$yPos += 30

# Framework
$labelFramework = New-Object System.Windows.Forms.Label
$labelFramework.Location = New-Object System.Drawing.Point(20, $yPos)
$labelFramework.Size = New-Object System.Drawing.Size(200, 20)
$labelFramework.Text = "Framework:"
$tabSetup.Controls.Add($labelFramework)

$comboFramework = New-Object System.Windows.Forms.ComboBox
$comboFramework.Location = New-Object System.Drawing.Point(220, $yPos)
$comboFramework.Size = New-Object System.Drawing.Size(200, 20)
$comboFramework.DropDownStyle = "DropDownList"
$comboFramework.Items.AddRange(@(
    "None",
    "React (Vite)",
    "Next.js",
    "Vue 3",
    "Angular",
    "Svelte",
    "Node.js (Express)",
    "React Native (Expo)",
    "Django",
    "Flask",
    "ASP.NET Core",
    "Spring Boot"
))
$comboFramework.SelectedIndex = 0
$tabSetup.Controls.Add($comboFramework)

$yPos += 40

# Options Group
$groupOptions = New-Object System.Windows.Forms.GroupBox
$groupOptions.Location = New-Object System.Drawing.Point(20, $yPos)
$groupOptions.Size = New-Object System.Drawing.Size(600, 170)
$groupOptions.Text = "Documentation Options"
$tabSetup.Controls.Add($groupOptions)

$checkTesting = New-Object System.Windows.Forms.CheckBox
$checkTesting.Location = New-Object System.Drawing.Point(20, 25)
$checkTesting.Size = New-Object System.Drawing.Size(550, 20)
$checkTesting.Text = "Include Testing Documentation (TESTING_STANDARDS.md, 15k+ lines)"
$checkTesting.Checked = $true
$groupOptions.Controls.Add($checkTesting)

$checkContext = New-Object System.Windows.Forms.CheckBox
$checkContext.Location = New-Object System.Drawing.Point(20, 50)
$checkContext.Size = New-Object System.Drawing.Size(550, 20)
$checkContext.Text = "Include Context Summary System (AI-assisted development tracking)"
$checkContext.Checked = $true
$groupOptions.Controls.Add($checkContext)

$checkGUIDesign = New-Object System.Windows.Forms.CheckBox
$checkGUIDesign.Location = New-Object System.Drawing.Point(20, 75)
$checkGUIDesign.Size = New-Object System.Drawing.Size(550, 20)
$checkGUIDesign.Text = "Include GUI Design Standards (UX/UI best practices, WCAG accessibility)"
$checkGUIDesign.Checked = $false
$groupOptions.Controls.Add($checkGUIDesign)

$checkCodingStandards = New-Object System.Windows.Forms.CheckBox
$checkCodingStandards.Location = New-Object System.Drawing.Point(20, 100)
$checkCodingStandards.Size = New-Object System.Drawing.Size(550, 20)
$checkCodingStandards.Text = "Include Coding Standards (SOLID, OOP, DRY, logging levels 0-5, error handling)"
$checkCodingStandards.Checked = $false
$groupOptions.Controls.Add($checkCodingStandards)

$checkAssessment = New-Object System.Windows.Forms.CheckBox
$checkAssessment.Location = New-Object System.Drawing.Point(20, 125)
$checkAssessment.Size = New-Object System.Drawing.Size(550, 20)
$checkAssessment.Text = "Include Existing Project Assessment (for legacy code analysis)"
$checkAssessment.Checked = $false
$groupOptions.Controls.Add($checkAssessment)

# ============================================================================
# EVENT HANDLERS FOR PROJECT TYPE SWITCHING
# ============================================================================

function Update-UIForProjectType {
    param([bool]$IsNewProject)
    
    if ($IsNewProject) {
        # New Project mode
        $labelName.Text = "Project Name:"
        $textName.ReadOnly = $false
        $btnBrowseExisting.Visible = $false
        
        $labelPath.Visible = $true
        $textPath.Visible = $true
        $btnBrowse.Visible = $true
        
        $labelDesc.Visible = $true
        $textDesc.Visible = $true
        $labelLang.Visible = $true
        $comboLang.Visible = $true
        $labelFramework.Visible = $true
        $comboFramework.Visible = $true
        
        $checkTesting.Text = "Include Testing Documentation (TESTING_STANDARDS.md, 15k+ lines)"
        $checkContext.Text = "Include Context Summary System (AI-assisted development tracking)"
        $checkAssessment.Text = "Include Existing Project Assessment (for legacy code analysis)"
        $checkAssessment.Checked = $false
        
        $checkGitHub.Enabled = $true
        $checkGitHub.Text = "Create GitHub Repository"
    }
    else {
        # Existing Project mode
        $labelName.Text = "Existing Project Path:"
        $textName.ReadOnly = $true
        $btnBrowseExisting.Visible = $true
        
        $labelPath.Visible = $false
        $textPath.Visible = $false
        $btnBrowse.Visible = $false
        
        $labelDesc.Visible = $false
        $textDesc.Visible = $false
        $labelLang.Visible = $false
        $comboLang.Visible = $false
        $labelFramework.Visible = $false
        $comboFramework.Visible = $false
        
        $checkTesting.Text = "Copy Testing Documentation (add tests to existing project)"
        $checkContext.Text = "Copy Context Summary System (start tracking with AI)"
        $checkAssessment.Text = "Copy Assessment Templates (REQUIRED for existing projects) ⭐"
        $checkAssessment.Checked = $true
        
        $checkGitHub.Enabled = $false
        $checkGitHub.Checked = $false
        $checkGitHub.Text = "Create GitHub Repository (N/A for existing projects)"
    }
}

$radioNew.Add_CheckedChanged({
    Update-UIForProjectType -IsNewProject $radioNew.Checked
})

$radioExisting.Add_CheckedChanged({
    Update-UIForProjectType -IsNewProject $radioNew.Checked
})

# Initialize UI to New Project mode
Update-UIForProjectType -IsNewProject $true

# ============================================================================
# TAB 2: GITHUB SETUP
# ============================================================================

$tabGitHub = New-Object System.Windows.Forms.TabPage
$tabGitHub.Text = "2. GitHub Setup"
$tabControl.Controls.Add($tabGitHub)

$yPos = 20

# Enable GitHub
$checkGitHub = New-Object System.Windows.Forms.CheckBox
$checkGitHub.Location = New-Object System.Drawing.Point(20, $yPos)
$checkGitHub.Size = New-Object System.Drawing.Size(500, 20)
$checkGitHub.Text = "Create GitHub Repository"
$checkGitHub.Checked = $true
$tabGitHub.Controls.Add($checkGitHub)

$yPos += 30

# Instructions
$labelInstructions = New-Object System.Windows.Forms.Label
$labelInstructions.Location = New-Object System.Drawing.Point(20, $yPos)
$labelInstructions.Size = New-Object System.Drawing.Size(800, 60)
$labelInstructions.Text = @"
To create a GitHub repository, you need a Personal Access Token (PAT):
1. Go to: https://github.com/settings/tokens
2. Click 'Generate new token (classic)'
3. Select scopes: 'repo' (full control of private repositories)
4. Copy the token and paste it below
"@
$tabGitHub.Controls.Add($labelInstructions)

$yPos += 70

# GitHub Username
$labelGitUser = New-Object System.Windows.Forms.Label
$labelGitUser.Location = New-Object System.Drawing.Point(20, $yPos)
$labelGitUser.Size = New-Object System.Drawing.Size(200, 20)
$labelGitUser.Text = "GitHub Username:"
$tabGitHub.Controls.Add($labelGitUser)

$textGitUser = New-Object System.Windows.Forms.TextBox
$textGitUser.Location = New-Object System.Drawing.Point(220, $yPos)
$textGitUser.Size = New-Object System.Drawing.Size(400, 20)
$textGitUser.Text = "lfaley"
$tabGitHub.Controls.Add($textGitUser)

$yPos += 30

# GitHub Token
$labelToken = New-Object System.Windows.Forms.Label
$labelToken.Location = New-Object System.Drawing.Point(20, $yPos)
$labelToken.Size = New-Object System.Drawing.Size(200, 20)
$labelToken.Text = "GitHub Token (PAT):"
$tabGitHub.Controls.Add($labelToken)

$textToken = New-Object System.Windows.Forms.TextBox
$textToken.Location = New-Object System.Drawing.Point(220, $yPos)
$textToken.Size = New-Object System.Drawing.Size(320, 20)
$textToken.UseSystemPasswordChar = $true
$tabGitHub.Controls.Add($textToken)

# Help button for GitHub setup
$btnGitHubHelp = New-Object System.Windows.Forms.Button
$btnGitHubHelp.Location = New-Object System.Drawing.Point(550, $yPos - 2)
$btnGitHubHelp.Size = New-Object System.Drawing.Size(70, 24)
$btnGitHubHelp.Text = "❓ Help"
$btnGitHubHelp.Add_Click({
    Show-GitHubSetupGuide
})
$tabGitHub.Controls.Add($btnGitHubHelp)

$btnTestToken = New-Object System.Windows.Forms.Button
$btnTestToken.Location = New-Object System.Drawing.Point(630, $yPos - 2)
$btnTestToken.Size = New-Object System.Drawing.Size(100, 24)
$btnTestToken.Text = "Test Token"
$btnTestToken.Add_Click({
    if ($textToken.Text) {
        $btnTestToken.Enabled = $false
        $btnTestToken.Text = "Testing..."
        
        if (Test-GitHubToken -Token $textToken.Text) {
            [System.Windows.Forms.MessageBox]::Show("Token is valid! ✅", "Success", "OK", "Information")
            $script:GitHubToken = $textToken.Text
        }
        else {
            $result = [System.Windows.Forms.MessageBox]::Show(
                "Token is invalid or expired.`n`nWould you like to see the GitHub Setup Guide?",
                "Token Invalid",
                "YesNo",
                "Error"
            )
            if ($result -eq "Yes") {
                Show-GitHubSetupGuide
            }
        }
        
        $btnTestToken.Enabled = $true
        $btnTestToken.Text = "Test Token"
    }
    else {
        $result = [System.Windows.Forms.MessageBox]::Show(
            "No GitHub token entered.`n`nWould you like to see step-by-step instructions for creating a GitHub token and repository?",
            "GitHub Setup Required",
            "YesNo",
            "Information"
        )
        if ($result -eq "Yes") {
            Show-GitHubSetupGuide
        }
    }
})
$tabGitHub.Controls.Add($btnTestToken)

$yPos += 40

# Repository Visibility
$labelVisibility = New-Object System.Windows.Forms.Label
$labelVisibility.Location = New-Object System.Drawing.Point(20, $yPos)
$labelVisibility.Size = New-Object System.Drawing.Size(200, 20)
$labelVisibility.Text = "Repository Visibility:"
$tabGitHub.Controls.Add($labelVisibility)

$radioPublic = New-Object System.Windows.Forms.RadioButton
$radioPublic.Location = New-Object System.Drawing.Point(220, $yPos)
$radioPublic.Size = New-Object System.Drawing.Size(100, 20)
$radioPublic.Text = "Public"
$radioPublic.Checked = $true
$tabGitHub.Controls.Add($radioPublic)

$radioPrivate = New-Object System.Windows.Forms.RadioButton
$radioPrivate.Location = New-Object System.Drawing.Point(330, $yPos)
$radioPrivate.Size = New-Object System.Drawing.Size(100, 20)
$radioPrivate.Text = "Private"
$tabGitHub.Controls.Add($radioPrivate)

# ============================================================================
# TAB 3: PROGRESS LOG
# ============================================================================

$tabProgress = New-Object System.Windows.Forms.TabPage
$tabProgress.Text = "  ⚡ Progress  "
$tabProgress.BackColor = $colors.Surface
$tabControl.Controls.Add($tabProgress)

# Modern Log Console with Dark Theme
$script:LogTextBox = New-Object System.Windows.Forms.TextBox
$script:LogTextBox.Location = New-Object System.Drawing.Point(20, 20)
$script:LogTextBox.Size = New-Object System.Drawing.Size(900, 590)
$script:LogTextBox.Multiline = $true
$script:LogTextBox.ScrollBars = "Vertical"
$script:LogTextBox.ReadOnly = $true
$script:LogTextBox.Font = New-Object System.Drawing.Font("Consolas", 10)
$script:LogTextBox.BackColor = [System.Drawing.Color]::FromArgb(30, 30, 30)
$script:LogTextBox.ForeColor = [System.Drawing.Color]::FromArgb(204, 204, 204)
$script:LogTextBox.BorderStyle = "FixedSingle"
$tabProgress.Controls.Add($script:LogTextBox)

# ============================================================================
# BOTTOM BUTTONS & PROGRESS BAR
# ============================================================================

# Modern Progress Bar
$progressBar = New-Object System.Windows.Forms.ProgressBar
$progressBar.Location = New-Object System.Drawing.Point(20, 760)
$progressBar.Size = New-Object System.Drawing.Size(945, 8)
$progressBar.Style = "Continuous"
$progressBar.ForeColor = $colors.Primary
$form.Controls.Add($progressBar)

# Button Panel for better layout
$buttonPanel = New-Object System.Windows.Forms.Panel
$buttonPanel.Location = New-Object System.Drawing.Point(20, 775)
$buttonPanel.Size = New-Object System.Drawing.Size(945, 50)
$buttonPanel.BackColor = $colors.Background
$form.Controls.Add($buttonPanel)

# Modern Create Button with Icon
$btnCreate = New-Object System.Windows.Forms.Button
$btnCreate.Location = New-Object System.Drawing.Point(785, 10)
$btnCreate.Size = New-Object System.Drawing.Size(160, 40)
$btnCreate.Text = "🚀 Create Project"
$btnCreate.BackColor = $colors.Success
$btnCreate.ForeColor = [System.Drawing.Color]::White
$btnCreate.Font = $fonts.Button
$btnCreate.FlatStyle = "Flat"
$btnCreate.FlatAppearance.BorderSize = 0
$btnCreate.Cursor = "Hand"
$buttonPanel.Controls.Add($btnCreate)
$btnCreate.Add_Click({
    # Switch to progress tab
    $tabControl.SelectedIndex = 2
    
    # Disable create button
    $btnCreate.Enabled = $false
    $btnCancel.Text = "Close"
    
    try {
        # Collect data
        $script:ProjectData.ProjectName = $textName.Text
        $script:ProjectData.ProjectPath = Join-Path $textPath.Text $textName.Text
        $script:ProjectData.Description = $textDesc.Text
        $script:ProjectData.Language = $comboLang.SelectedItem
        $script:ProjectData.Framework = $comboFramework.SelectedItem
        $script:ProjectData.ProjectType = if ($radioNew.Checked) { "new" } else { "existing" }
        $script:ProjectData.CreateGitHub = $checkGitHub.Checked
        $script:ProjectData.GitHubUsername = $textGitUser.Text
        $script:ProjectData.IncludeContextSummary = $checkContext.Checked
        $script:ProjectData.IncludeTesting = $checkTesting.Checked
        $script:ProjectData.IncludeGUIDesign = $checkGUIDesign.Checked
        $script:ProjectData.IncludeCodingStandards = $checkCodingStandards.Checked
        
        # Validation
        if (-not $script:ProjectData.ProjectName) {
            throw "Please enter a project name."
        }
        
        if ($script:ProjectData.CreateGitHub -and -not $textToken.Text) {
            $btnCreate.Enabled = $true
            $result = [System.Windows.Forms.MessageBox]::Show(
                "No GitHub token entered, but 'Create GitHub Repository' is checked.`n`n" +
                "Would you like to see step-by-step instructions for:`n" +
                "  • Creating a GitHub account`n" +
                "  • Creating a Personal Access Token (PAT)`n" +
                "  • Creating and pushing to a repository`n`n" +
                "Click YES to see the beginner-friendly guide with links.`n" +
                "Click NO to continue without GitHub integration.",
                "GitHub Setup Required",
                "YesNo",
                "Information"
            )
            if ($result -eq "Yes") {
                Show-GitHubSetupGuide
                throw "Please complete GitHub setup, then try again."
            }
            else {
                throw "Please enter a GitHub token or uncheck 'Create GitHub Repository'."
            }
        }
        
        Write-Log "========================================" "Info"
        Write-Log "ProjectPlanner - Starting Project Setup" "Info"
        Write-Log "========================================" "Info"
        Write-Log ""
        
        # Progress tracking
        $totalSteps = 7
        $currentStep = 0
        
        # Step 1: Create/Verify project directory
        $currentStep++
        $progressBar.Value = ($currentStep / $totalSteps) * 100
        Write-Log "[$currentStep/$totalSteps] $(if ($script:ProjectData.ProjectType -eq 'existing') { 'Verifying existing project directory...' } else { 'Creating project directory...' })" "Info"
        
        if ($script:ProjectData.ProjectType -eq "existing") {
            # Existing project - verify it exists
            if (-not (Test-Path $script:ProjectData.ProjectPath)) {
                throw "Existing project directory not found: $($script:ProjectData.ProjectPath)"
            }
            Write-Log "  ✓ Found existing project: $($script:ProjectData.ProjectPath)" "Success"
            
            # Warn if .git exists
            if (Test-Path (Join-Path $script:ProjectData.ProjectPath ".git")) {
                Write-Log "  ℹ Git repository detected - will skip git initialization" "Info"
            }
        }
        else {
            # New project - create directory
            if (Test-Path $script:ProjectData.ProjectPath) {
                $result = [System.Windows.Forms.MessageBox]::Show(
                    "Directory already exists. Continue anyway?",
                    "Warning",
                    "YesNo",
                    "Warning"
                )
                if ($result -eq "No") {
                    throw "Operation cancelled by user."
                }
            }
            else {
                New-Item -ItemType Directory -Path $script:ProjectData.ProjectPath -Force | Out-Null
            }
            Write-Log "  ✓ Created: $($script:ProjectData.ProjectPath)" "Success"
        }
        
        # Step 2: Copy documentation
        $currentStep++
        $progressBar.Value = ($currentStep / $totalSteps) * 100
        Write-Log ""
        Write-Log "[$currentStep/$totalSteps] Copying documentation files..." "Info"
        
        Copy-TemplateFiles -DestinationPath $script:ProjectData.ProjectPath `
                          -IncludeContextSummary $script:ProjectData.IncludeContextSummary `
                          -IncludeTesting $script:ProjectData.IncludeTesting `
                          -IncludeGUIDesign $script:ProjectData.IncludeGUIDesign `
                          -IncludeCodingStandards $script:ProjectData.IncludeCodingStandards
        
        if ($checkAssessment.Checked) {
            Write-Log "Copying assessment templates..." "Info"
            $projectPlannerRoot = Split-Path $script:ProjectPlannerPath -Parent
            $assessmentFolder = Join-Path $projectPlannerRoot "DOCS-EXISTING-PROJECTS"
            $assessmentFiles = @("EXISTING_PROJECT_ASSESSMENT.md", "IMPROVEMENT_ROADMAP_TEMPLATE.md")
            
            foreach ($file in $assessmentFiles) {
                $sourcePath = Join-Path $assessmentFolder $file
                if (Test-Path $sourcePath) {
                    Copy-Item $sourcePath -Destination $script:ProjectData.ProjectPath -Force
                    Write-Log "  ✓ Copied $file" "Success"
                }
            }
        }
        
        # Step 3: Initialize project structure
        $currentStep++
        $progressBar.Value = ($currentStep / $totalSteps) * 100
        Write-Log ""
        Write-Log "[$currentStep/$totalSteps] Initializing project structure..." "Info"
        
        if ($script:ProjectData.ProjectType -eq "new" -and $script:ProjectData.Framework -ne "None") {
            Create-ProjectStructure -ProjectPath $script:ProjectData.ProjectPath -Framework $script:ProjectData.Framework
        }
        else {
            Write-Log "  ⊙ Skipped (existing project or no framework)" "Info"
        }
        
        # Step 4: Create README
        $currentStep++
        $progressBar.Value = ($currentStep / $totalSteps) * 100
        Write-Log ""
        Write-Log "[$currentStep/$totalSteps] Customizing README..." "Info"
        
        $readmePath = Join-Path $script:ProjectData.ProjectPath "README.md"
        if (Test-Path $readmePath) {
            $readmeContent = Get-Content $readmePath -Raw
            $readmeContent = $readmeContent -replace "ProjectPlanner", $script:ProjectData.ProjectName
            $readmeContent = $readmeContent -replace "Universal Template for Any Software Project", $script:ProjectData.Description
            Set-Content -Path $readmePath -Value $readmeContent
            Write-Log "  ✓ Customized README.md" "Success"
        }
        
        # Step 5: Initialize Git (skip for existing projects with git)
        $currentStep++
        $progressBar.Value = ($currentStep / $totalSteps) * 100
        Write-Log ""
        
        $gitExists = Test-Path (Join-Path $script:ProjectData.ProjectPath ".git")
        if ($script:ProjectData.ProjectType -eq "existing" -and $gitExists) {
            Write-Log "[$currentStep/$totalSteps] Git repository..." "Info"
            Write-Log "  ⊙ Skipped (existing git repository detected)" "Info"
        }
        else {
            Write-Log "[$currentStep/$totalSteps] Initializing Git repository..." "Info"
            
            $remoteUrl = ""
            if ($script:ProjectData.CreateGitHub) {
                # Step 6: Create GitHub repo
                $currentStep++
                $progressBar.Value = ($currentStep / $totalSteps) * 100
                Write-Log ""
                Write-Log "[$currentStep/$totalSteps] Creating GitHub repository..." "Info"
                
                $remoteUrl = Create-GitHubRepository -RepoName $script:ProjectData.ProjectName `
                                                      -Description $script:ProjectData.Description `
                                                      -Token $textToken.Text
                Write-Log "  ✓ GitHub repository created" "Success"
                Write-Log "  → URL: $remoteUrl" "Info"
            }
            
            Initialize-GitRepository -ProjectPath $script:ProjectData.ProjectPath -RemoteUrl $remoteUrl
        }
        
        # Step 7: Complete
        $currentStep++
        $progressBar.Value = 100
        Write-Log ""
        Write-Log "========================================" "Success"
        if ($script:ProjectData.ProjectType -eq "existing") {
            Write-Log "✓ EXISTING PROJECT ASSESSMENT READY!" "Success"
        } else {
            Write-Log "✓ PROJECT SETUP COMPLETE!" "Success"
        }
        Write-Log "========================================" "Success"
        Write-Log ""
        Write-Log "Project Location: $($script:ProjectData.ProjectPath)" "Info"
        if ($remoteUrl) {
            Write-Log "GitHub Repository: $remoteUrl" "Info"
        }
        Write-Log ""
        Write-Log "Next Steps:" "Info"
        Write-Log "1. Open project in VS Code: code '$($script:ProjectData.ProjectPath)'" "Info"
        if ($script:ProjectData.ProjectType -eq "existing") {
            Write-Log "2. Review EXISTING_PROJECT_ASSESSMENT.md to evaluate current state" "Info"
            Write-Log "3. Use IMPROVEMENT_ROADMAP_TEMPLATE.md to plan enhancements" "Info"
        } else {
            Write-Log "2. Review HOW_TO_USE_THIS_TEMPLATE.md" "Info"
            if ($script:ProjectData.IncludeContextSummary) {
                Write-Log "3. Start Copilot: 'Hello friend. Please review the CopilotConversationStarter.md file'" "Info"
            }
        }
        Write-Log ""
        
        $successMessage = if ($script:ProjectData.ProjectType -eq "existing") {
            "Assessment templates copied successfully!`n`nLocation: $($script:ProjectData.ProjectPath)"
        } else {
            "Project created successfully!`n`nLocation: $($script:ProjectData.ProjectPath)"
        }
        
        [System.Windows.Forms.MessageBox]::Show(
            $successMessage,
            "Success",
            "OK",
            "Information"
        )
        
        # Ask to open in VS Code
        $result = [System.Windows.Forms.MessageBox]::Show(
            "Would you like to open the project in VS Code?",
            "Open Project",
            "YesNo",
            "Question"
        )
        
        if ($result -eq "Yes") {
            Start-Process "code" -ArgumentList "`"$($script:ProjectData.ProjectPath)`""
        }
    }
    catch {
        Write-Log ""
        Write-Log "========================================" "Error"
        Write-Log "✗ ERROR: $_" "Error"
        Write-Log "========================================" "Error"
        
        [System.Windows.Forms.MessageBox]::Show(
            "An error occurred:`n`n$_",
            "Error",
            "OK",
            "Error"
        )
    }
    finally {
        $btnCreate.Enabled = $true
    }
})

# Modern Cancel Button
$btnCancel = New-Object System.Windows.Forms.Button
$btnCancel.Location = New-Object System.Drawing.Point(615, 10)
$btnCancel.Size = New-Object System.Drawing.Size(160, 40)
$btnCancel.Text = "❌ Cancel"
$btnCancel.BackColor = $colors.Surface
$btnCancel.ForeColor = $colors.TextPrimary
$btnCancel.Font = $fonts.Button
$btnCancel.FlatStyle = "Flat"
$btnCancel.FlatAppearance.BorderColor = $colors.Border
$btnCancel.Cursor = "Hand"
$btnCancel.Add_Click({
    $form.Close()
})
$buttonPanel.Controls.Add($btnCancel)

# ============================================================================
# SHOW FORM
# ============================================================================

Write-Log "ProjectPlanner GUI v1.0 initialized" "Success"
Write-Log "Ready to create projects!" "Info"
Write-Log ""

[void]$form.ShowDialog()
