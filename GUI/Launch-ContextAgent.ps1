# Context Agent - Modern Web UI Launcher
# This script launches the Context Agent in a modern HTML/CSS web interface

param(
    [string]$RepositoryPath,
    [switch]$HelpFlag
)

# Display help if requested
if ($HelpFlag -or $null -eq $RepositoryPath) {
    Write-Host @"
╔══════════════════════════════════════════════════════════════════════════╗
║                    Context Agent - Modern Web UI                        ║
╚══════════════════════════════════════════════════════════════════════════╝

USAGE:
    .\Launch-ContextAgent.ps1 -RepositoryPath "C:\path\to\repo" [-HelpFlag]

EXAMPLES:
    # Launch UI for specific repository
    .\Launch-ContextAgent.ps1 -RepositoryPath "C:\Users\user\Desktop\Code\MyProject"

    # Get help
    .\Launch-ContextAgent.ps1 -HelpFlag

FEATURES:
    ✓ Modern dark-themed interface
    ✓ Real-time command execution
    ✓ 4 tools: Detect Drift, Health Check, Suggest Updates, Auto Sync
    ✓ Beautiful gradient UI
    ✓ Responsive design
    ✓ Live status updates

SUPPORTED TOOLS:
    1. Detect Drift      - Scan for documentation out of sync
    2. Health Check      - Calculate documentation health score
    3. Suggest Updates   - Get actionable recommendations
    4. Auto Sync         - Automatically sync documentation

REQUIREMENTS:
    - Node.js (for CLI execution)
    - Context Agent CLI tool installed
    - Web browser (Edge, Chrome, Firefox)

"@
    exit 0
}

function Show-Loading {
    param([string]$Message = "Processing...")
    Write-Host "`n[*] $Message" -ForegroundColor Cyan
}

function Show-Success {
    param([string]$Message)
    Write-Host "[✓] $Message" -ForegroundColor Green
}

function Show-Error {
    param([string]$Message)
    Write-Host "[✗] $Message" -ForegroundColor Red
}

# Check if HTML file exists
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$htmlPath = Join-Path $scriptDir "context-agent-ui.html"

if (-not (Test-Path $htmlPath)) {
    Show-Error "Context Agent UI file not found: $htmlPath"
    exit 1
}

# Validate repository path
if (-not (Test-Path $RepositoryPath)) {
    Show-Error "Repository path does not exist: $RepositoryPath"
    exit 1
}

if (-not (Test-Path "$RepositoryPath\.git")) {
    Show-Error "Not a valid git repository: $RepositoryPath"
    exit 1
}

Show-Loading "Launching Context Agent UI..."
Show-Success "Repository: $RepositoryPath"

# Launch the HTML file in default browser
& cmd /c "start $htmlPath"

Show-Success "Context Agent UI launched in your default browser"
Write-Host "`nThe web interface provides access to all Context Agent tools:`n" -ForegroundColor Cyan
Write-Host "  • Detect Drift        - Identify documentation sync issues"
Write-Host "  • Health Check        - Score documentation quality (0-100)"
Write-Host "  • Suggest Updates     - Get recommendations"
Write-Host "  • Auto Sync           - Automatically update documentation`n"

Write-Host "To use the CLI directly, run:`n" -ForegroundColor Yellow
Write-Host "  node dist/cli.js <command> '$RepositoryPath'`n" -ForegroundColor White

# Keep PowerShell window open for user to see messages
Read-Host "Press Enter to close this window"
