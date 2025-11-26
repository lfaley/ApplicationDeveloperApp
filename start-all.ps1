# PowerShell script to start all major services for local development
# Always start in the project root directory
$root = "C:\Users\faley\Desktop\Code\Repos\ApplicationDeveloperApp"

# Change to project root directory
Set-Location $root

Write-Host "==> Ensuring root dependencies (if any)..."
if (Test-Path "$root/package.json") {
    Push-Location $root
    npm install
    Pop-Location
}

# Helper function to run a command and check for errors
function Run-Step($desc, $cmd) {
    Write-Host "==> $desc"
    try {
        Invoke-Expression $cmd
    } catch {
        Write-Host "ERROR: $desc failed"
        exit 1
    }
}

# Build dashboard (React/Vite) before starting services
Run-Step "Building Dashboard (React/Vite)" "cd '$root/dashboard'; npm install; npm run build"

# Start dashboard (React/Vite) in dev mode
Run-Step "Starting Dashboard (React/Vite)" "Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd ''$root/dashboard''; npm run dev' -WindowStyle Normal"

# Start Electron App (Desktop UI)
Run-Step "Starting Electron App" "Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd ''$root/electron-app''; npm install; npm run dev' -WindowStyle Normal"

# Start MCP-SERVER agents
$agents = @(
    @{ Name = 'code-documentation-agent'; Dir = 'MCP-SERVER/code-documentation-agent' },
    @{ Name = 'orchestration-agent'; Dir = 'MCP-SERVER/orchestration-agent' },
    @{ Name = 'project-context-agent'; Dir = 'MCP-SERVER/project-context-agent' },
    @{ Name = 'project-roadmap-agent'; Dir = 'MCP-SERVER/project-roadmap-agent' }
)
foreach ($agent in $agents) {
    $agentPath = Join-Path $root $agent.Dir
    Run-Step "Starting $($agent.Name)" "Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd ''$agentPath''; npm install; npm run build; npm start' -WindowStyle Normal"
}

Write-Host "All services are starting in separate PowerShell windows."
Write-Host "Dashboard:     http://localhost:5173/"
Write-Host "Electron App:  Desktop application (see new window)"
Write-Host "Agents:        See console output for each agent."
