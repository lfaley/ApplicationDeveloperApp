# PowerShell script to start all major services for local development
# Ensures SystemRoot is set for all child processes
$env:SystemRoot = "C:\WINDOWS"

# Start dashboard (React/Vite)
Start-Process powershell -ArgumentList 'cd dashboard; npm install; npm run dev' -WindowStyle Minimized

# Start GUI (Node/Express)
Start-Process powershell -ArgumentList 'cd GUI; npm install; npm run dev' -WindowStyle Minimized

# Start MCP-SERVER agents
$agents = @(
    'MCP-SERVER/code-documentation-agent',
    'MCP-SERVER/orchestration-agent',
    'MCP-SERVER/project-context-agent',
    'MCP-SERVER/project-roadmap-agent'
)
foreach ($agent in $agents) {
    Start-Process powershell -ArgumentList "cd $agent; npm install; npm run build; npm start" -WindowStyle Minimized
}

Write-Host "All services are starting in separate windows."
Write-Host "Dashboard:     http://localhost:5173/"
Write-Host "GUI:           http://localhost:3000/ (or configured port)"
Write-Host "Agents:        See console output for each agent."
