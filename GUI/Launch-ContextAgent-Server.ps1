# Context Agent - Web UI Launcher with Server
# This script starts the web server and opens the UI in your default browser

param(
    [int]$Port = 3000,
    [switch]$HelpFlag
)

if ($HelpFlag) {
    Write-Host @"
╔══════════════════════════════════════════════════════════════════════════╗
║              Context Agent - Modern Web UI Server Launcher              ║
╚══════════════════════════════════════════════════════════════════════════╝

USAGE:
    .\Launch-ContextAgent-Server.ps1 [-Port 3000] [-HelpFlag]

EXAMPLES:
    # Launch server on default port 3000
    .\Launch-ContextAgent-Server.ps1

    # Launch server on custom port
    .\Launch-ContextAgent-Server.ps1 -Port 3001

    # Show this help
    .\Launch-ContextAgent-Server.ps1 -HelpFlag

FEATURES:
    ✓ Modern dark-themed web interface
    ✓ Real-time tool execution
    ✓ Beautiful gradient UI with animations
    ✓ Responsive design (desktop, tablet, mobile)
    ✓ Built-in Node.js server

REQUIREMENTS:
    - Node.js v14 or higher
    - Context Agent CLI tool
    - Modern web browser (Chrome, Edge, Firefox)

WHAT HAPPENS:
    1. Node.js server starts on http://localhost:PORT
    2. Web UI opens automatically in your default browser
    3. You can run all 4 tools from the web interface
    4. Press Ctrl+C in PowerShell to stop the server

TOOLS AVAILABLE:
    • Detect Drift       - Find documentation sync issues
    • Health Check       - Score documentation quality (0-100)
    • Suggest Updates    - Get improvement recommendations
    • Auto Sync          - Automatically sync documentation

"@
    exit 0
}

function Show-Banner {
    Write-Host @"
╔═══════════════════════════════════════════════════════════════════════╗
║            Context Agent - Web UI Server                             ║
║          Modern Interface for Documentation Drift                     ║
╚═══════════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan
}

function Show-Info {
    param([string]$Message)
    Write-Host "[i] $Message" -ForegroundColor Blue
}

function Show-Success {
    param([string]$Message)
    Write-Host "[✓] $Message" -ForegroundColor Green
}

function Show-Warning {
    param([string]$Message)
    Write-Host "[!] $Message" -ForegroundColor Yellow
}

function Show-Error {
    param([string]$Message)
    Write-Host "[✗] $Message" -ForegroundColor Red
}

# Display banner
Show-Banner

# Check if Node.js is installed
Write-Host ""
Show-Info "Checking prerequisites..."
$nodeCheck = node --version 2>$null
if ($null -eq $nodeCheck) {
    Show-Error "Node.js is not installed or not in PATH"
    Write-Host "`nTo fix this:" -ForegroundColor Yellow
    Write-Host "1. Install Node.js from https://nodejs.org"
    Write-Host "2. Restart PowerShell"
    Write-Host "3. Run this script again`n"
    exit 1
}
Show-Success "Node.js found: $nodeCheck"

# Check if port is available
$portCheck = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
if ($portCheck) {
    Show-Warning "Port $Port is already in use"
    $Port = $Port + 1
    Show-Info "Using alternate port: $Port"
}

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$serverScript = Join-Path $scriptDir "ui-server.js"

# Check if server script exists
if (-not (Test-Path $serverScript)) {
    Show-Error "Server script not found: $serverScript"
    exit 1
}

Write-Host ""
Show-Success "Starting Context Agent Web Server..."
Show-Info "Server will run on: http://localhost:$Port"
Show-Info "Press Ctrl+C to stop the server"
Write-Host ""

# Start the server
& node $serverScript $Port

# If we get here, server stopped
Write-Host ""
Show-Info "Server stopped"
