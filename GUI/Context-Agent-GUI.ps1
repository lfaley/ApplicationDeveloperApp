#!/usr/bin/env pwsh
# Always start in the project root directory
Set-Location -Path "C:\Users\faley\Desktop\Code\Repos\ApplicationDeveloperApp"
# Context Agent GUI - Simple standalone tool
# Documentation analysis without emojis

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Configuration
$script:CLIPath = Join-Path (Split-Path $PSScriptRoot) "MCP-SERVER\project-context-agent\dist\cli.js"

# Colors
$colors = @{
    Primary     = [System.Drawing.Color]::FromArgb(41, 128, 185)
    Success     = [System.Drawing.Color]::FromArgb(46, 204, 113)
    Warning     = [System.Drawing.Color]::FromArgb(241, 196, 15)
    Background  = [System.Drawing.Color]::FromArgb(44, 47, 51)
    Surface     = [System.Drawing.Color]::FromArgb(52, 73, 94)
    Text        = [System.Drawing.Color]::FromArgb(236, 240, 241)
}

# Main Form
$form = New-Object System.Windows.Forms.Form
$form.Text = "Context Agent - Documentation Analysis"
$form.Size = New-Object System.Drawing.Size(700, 500)
$form.StartPosition = "CenterScreen"
$form.BackColor = $colors.Background
$form.ForeColor = $colors.Text
$form.Font = New-Object System.Drawing.Font("Segoe UI", 10)

# Title
$titleLabel = New-Object System.Windows.Forms.Label
$titleLabel.Location = New-Object System.Drawing.Point(20, 20)
$titleLabel.Size = New-Object System.Drawing.Size(660, 30)
$titleLabel.Text = "Context Agent - Documentation Analysis Tool"
$titleLabel.Font = New-Object System.Drawing.Font("Segoe UI", 14, [System.Drawing.FontStyle]::Bold)
$titleLabel.ForeColor = $colors.Primary
$form.Controls.Add($titleLabel)

# Tool Selection
$labelTool = New-Object System.Windows.Forms.Label
$labelTool.Location = New-Object System.Drawing.Point(20, 70)
$labelTool.Size = New-Object System.Drawing.Size(150, 25)
$labelTool.Text = "Select Tool:"
$labelTool.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$form.Controls.Add($labelTool)

$comboTool = New-Object System.Windows.Forms.ComboBox
$comboTool.Location = New-Object System.Drawing.Point(20, 100)
$comboTool.Size = New-Object System.Drawing.Size(660, 30)
$comboTool.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$comboTool.BackColor = $colors.Surface
$comboTool.ForeColor = $colors.Text
$comboTool.Items.AddRange(@(
    "detect-drift - Scan for documentation drift",
    "health-check - Calculate documentation health score",
    "suggest-updates - Get update recommendations",
    "auto-sync - Synchronize documentation"
))
$comboTool.SelectedIndex = 0
$comboTool.DropDownStyle = "DropDownList"
$form.Controls.Add($comboTool)

# Repository Path
$labelPath = New-Object System.Windows.Forms.Label
$labelPath.Location = New-Object System.Drawing.Point(20, 145)
$labelPath.Size = New-Object System.Drawing.Size(150, 25)
$labelPath.Text = "Repository Path:"
$labelPath.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$form.Controls.Add($labelPath)

$textPath = New-Object System.Windows.Forms.TextBox
$textPath.Location = New-Object System.Drawing.Point(20, 175)
$textPath.Size = New-Object System.Drawing.Size(560, 30)
$textPath.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$textPath.BackColor = $colors.Surface
$textPath.ForeColor = $colors.Text
$form.Controls.Add($textPath)

# Browse Button
$btnBrowse = New-Object System.Windows.Forms.Button
$btnBrowse.Location = New-Object System.Drawing.Point(590, 175)
$btnBrowse.Size = New-Object System.Drawing.Size(90, 30)
$btnBrowse.Text = "Browse"
$btnBrowse.BackColor = $colors.Primary
$btnBrowse.ForeColor = [System.Drawing.Color]::White
$btnBrowse.FlatStyle = "Flat"
$btnBrowse.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$btnBrowse.Add_Click({
    $folderDialog = New-Object System.Windows.Forms.FolderBrowserDialog
    $folderDialog.Description = "Select Repository Folder"
    $folderDialog.ShowNewFolderButton = $false
    if ($folderDialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
        $textPath.Text = $folderDialog.SelectedPath
    }
})
$form.Controls.Add($btnBrowse)

# Options
$chkApprove = New-Object System.Windows.Forms.CheckBox
$chkApprove.Location = New-Object System.Drawing.Point(20, 220)
$chkApprove.Size = New-Object System.Drawing.Size(300, 25)
$chkApprove.Text = "Auto-approve changes (for auto-sync)"
$chkApprove.ForeColor = $colors.Text
$form.Controls.Add($chkApprove)

$chkBackup = New-Object System.Windows.Forms.CheckBox
$chkBackup.Location = New-Object System.Drawing.Point(20, 250)
$chkBackup.Size = New-Object System.Drawing.Size(300, 25)
$chkBackup.Text = "Create backup before sync"
$chkBackup.ForeColor = $colors.Text
$chkBackup.Checked = $true
$form.Controls.Add($chkBackup)

# Run Button
$btnRun = New-Object System.Windows.Forms.Button
$btnRun.Location = New-Object System.Drawing.Point(20, 300)
$btnRun.Size = New-Object System.Drawing.Size(660, 40)
$btnRun.Text = "RUN ANALYSIS"
$btnRun.BackColor = $colors.Success
$btnRun.ForeColor = [System.Drawing.Color]::White
$btnRun.FlatStyle = "Flat"
$btnRun.Font = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
$btnRun.Add_Click({
    if ([string]::IsNullOrWhiteSpace($textPath.Text)) {
        [System.Windows.Forms.MessageBox]::Show("Please select a repository path", "Input Error", "OK", "Warning") | Out-Null
        return
    }

    if (-not (Test-Path $textPath.Text)) {
        [System.Windows.Forms.MessageBox]::Show("Path does not exist", "Error", "OK", "Error") | Out-Null
        return
    }

    if (-not (Test-Path (Join-Path $textPath.Text ".git"))) {
        [System.Windows.Forms.MessageBox]::Show("Not a git repository", "Error", "OK", "Error") | Out-Null
        return
    }

    if (-not (Test-Path $script:CLIPath)) {
        [System.Windows.Forms.MessageBox]::Show("CLI tool not found", "Error", "OK", "Error") | Out-Null
        return
    }

    # Extract tool name
    $selectedText = $comboTool.SelectedItem
    $toolName = $selectedText.Split(" ")[0]

    # Show results window
    $resultForm = New-Object System.Windows.Forms.Form
    $resultForm.Text = "Context Agent - Results"
    $resultForm.Size = New-Object System.Drawing.Size(1000, 700)
    $resultForm.StartPosition = "CenterParent"
    $resultForm.BackColor = $colors.Background

    $resultText = New-Object System.Windows.Forms.RichTextBox
    $resultText.Location = New-Object System.Drawing.Point(10, 10)
    $resultText.Size = New-Object System.Drawing.Size(970, 620)
    $resultText.Multiline = $true
    $resultText.ScrollBars = "Vertical"
    $resultText.ReadOnly = $true
    $resultText.Font = New-Object System.Drawing.Font("Consolas", 10)
    $resultText.BackColor = [System.Drawing.Color]::FromArgb(30, 30, 30)
    $resultText.ForeColor = [System.Drawing.Color]::FromArgb(0, 200, 100)
    $resultForm.Controls.Add($resultText)

    $closeBtn = New-Object System.Windows.Forms.Button
    $closeBtn.Location = New-Object System.Drawing.Point(860, 640)
    $closeBtn.Size = New-Object System.Drawing.Size(110, 30)
    $closeBtn.Text = "Close"
    $closeBtn.BackColor = $colors.Primary
    $closeBtn.ForeColor = [System.Drawing.Color]::White
    $closeBtn.FlatStyle = "Flat"
    $closeBtn.Add_Click({ $resultForm.Close() })
    $resultForm.Controls.Add($closeBtn)

    # Run command
    try {
        $resultText.Text = "Running: $toolName on $($textPath.Text)`r`n`r`n"
        $resultText.AppendText(("=" * 60) + "`r`n`r`n")

        $output = & node $script:CLIPath $toolName $textPath.Text 2>&1
        $resultText.AppendText(($output | Out-String))
        
        $resultText.AppendText("`r`n`r`n" + ("=" * 60) + "`r`nCompleted`r`n")
    }
    catch {
        $resultText.AppendText("`r`nError: $_`r`n")
    }

    $resultForm.ShowDialog() | Out-Null
})
$form.Controls.Add($btnRun)

# Show form
$form.ShowDialog() | Out-Null
