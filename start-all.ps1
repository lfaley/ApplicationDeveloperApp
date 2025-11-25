1`# PowerShell script to start all major services for local development
# Always start in the project root directory
$root = "C:\Users\faley\Desktop\Code\Repos\ApplicationDeveloperApp"

# Start dashboard (React/Vite)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root/dashboard'; npm install; npm run dev" -WindowStyle Normal

# Start Electron App (Desktop UI)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root/electron-app'; npm install; npm run dev" -WindowStyle Normal

# Start MCP-SERVER agents
$agents = @(
    @{ Name = 'code-documentation-agent'; Dir = 'MCP-SERVER/code-documentation-agent' },
    @{ Name = 'orchestration-agent'; Dir = 'MCP-SERVER/orchestration-agent' },
    @{ Name = 'project-context-agent'; Dir = 'MCP-SERVER/project-context-agent' },
    @{ Name = 'project-roadmap-agent'; Dir = 'MCP-SERVER/project-roadmap-agent' }
)
foreach ($agent in $agents) {
    $agentPath = Join-Path $root $agent.Dir
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$agentPath'; npm install; npm run build; npm start" -WindowStyle Normal
}

Write-Host "All services are starting in separate PowerShell windows."
Write-Host "Dashboard:     http://localhost:5173/"
Write-Host "Electron App:  Desktop application (see new window)"
Write-Host "Agents:        See console output for each agent."
