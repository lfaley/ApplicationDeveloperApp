# PowerShell script to start all major services for local development
# Ensures SystemRoot is set for all child processes
$env:SystemRoot = "C:\WINDOWS"

# Always start in the project root directory
Set-Location -Path "C:\Users\faley\Desktop\Code\Repos\ApplicationDeveloperApp"

function Start-ServiceWithCheck {
    param(
        [string]$Path,
        [string]$Args,
        [string]$Header
    )
    if (Test-Path $Path) {
        Start-Process powershell -ArgumentList "echo '$Header'; cd $Path; $Args; Read-Host -Prompt 'Press Enter to exit'" -WindowStyle Minimized
    } else {
        Start-Process powershell -ArgumentList "echo '=== ERROR: Directory $Path does not exist! ==='; Start-Sleep -Seconds 30" -WindowStyle Minimized
    }
}

# Start dashboard (React/Vite)
Start-ServiceWithCheck -Path "dashboard" -Args "npm install; npm run dev" -Header "=== DASHBOARD ==="

# Start GUI (Node/Express)
# Start-ServiceWithCheck -Path "GUI" -Args "npm install; npm run dev" -Header "=== GUI (commented out) ==="

# Start Electron App (Desktop UI)
Start-ServiceWithCheck -Path "electron-app" -Args "echo '=== ELECTRON APP ==='; npm install; npm run dev" -Header "=== ELECTRON APP ==="

# Start MCP-SERVER agents
$agents = @(
    'MCP-SERVER/code-documentation-agent',
    'MCP-SERVER/orchestration-agent',
    'MCP-SERVER/project-context-agent',
    'MCP-SERVER/project-roadmap-agent'
)
foreach ($agent in $agents) {
    $agentName = $agent.Split('/')[-1]
    Start-ServiceWithCheck -Path $agent -Args "npm install; npm run build; npm start" -Header "=== AGENT: $agentName ==="
}

Write-Host "All services are starting in separate windows."
Write-Host "Dashboard:     http://localhost:5173/"
Write-Host "GUI:           (commented out)"
Write-Host "Electron App:  Desktop application (see new window)"
Write-Host "Agents:        See console output for each agent."
