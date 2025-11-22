# ProjectPlanner GUI Launcher
# Quick launcher script

$scriptPath = Join-Path $PSScriptRoot "ProjectPlanner-GUI.ps1"

if (Test-Path $scriptPath) {
    Write-Host "Launching ProjectPlanner GUI..." -ForegroundColor Green
    Write-Host "Location: $PSScriptRoot" -ForegroundColor Cyan
    & $scriptPath
}
else {
    Write-Host "Error: ProjectPlanner-GUI.ps1 not found!" -ForegroundColor Red
    Write-Host "Expected location: $scriptPath" -ForegroundColor Yellow
    Write-Host "Current directory: $PSScriptRoot" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
}
