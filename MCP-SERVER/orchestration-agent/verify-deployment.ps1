#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Quick verification script for orchestration agent deployment

.DESCRIPTION
    Checks that the orchestration agent is properly built, configured,
    and ready to use in Claude Desktop

.EXAMPLE
    .\verify-deployment.ps1
#>

$ErrorActionPreference = "Continue"
$TestResults = @()

Write-Host "`n🔍 Orchestration Agent Deployment Verification" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

# Test 1: Check if dist folder exists
Write-Host "`n✓ Test 1: Checking build output..." -ForegroundColor Yellow
$distPath = "C:\Users\faley\Desktop\Code\Repos\ProjectPlanner\MCP-SERVER\orchestration-agent\dist\index.js"
if (Test-Path $distPath) {
    Write-Host "  ✅ PASS: Build output exists" -ForegroundColor Green
    $TestResults += @{Test="Build Output"; Status="PASS"}
} else {
    Write-Host "  ❌ FAIL: Build output not found at $distPath" -ForegroundColor Red
    Write-Host "  💡 Run: npm run build" -ForegroundColor Yellow
    $TestResults += @{Test="Build Output"; Status="FAIL"}
}

# Test 2: Check if config file exists
Write-Host "`n✓ Test 2: Checking Claude Desktop config..." -ForegroundColor Yellow
$configPath = "$env:APPDATA\Claude\claude_desktop_config.json"
if (Test-Path $configPath) {
    Write-Host "  ✅ PASS: Config file exists" -ForegroundColor Green
    $TestResults += @{Test="Config File"; Status="PASS"}
} else {
    Write-Host "  ❌ FAIL: Config file not found" -ForegroundColor Red
    $TestResults += @{Test="Config File"; Status="FAIL"}
}

# Test 3: Check if orchestration agent is in config
Write-Host "`n✓ Test 3: Checking orchestration agent in config..." -ForegroundColor Yellow
if (Test-Path $configPath) {
    try {
        $config = Get-Content $configPath -Raw | ConvertFrom-Json
        if ($config.mcpServers.orchestration) {
            Write-Host "  ✅ PASS: Orchestration agent configured" -ForegroundColor Green
            Write-Host "    Command: $($config.mcpServers.orchestration.command)" -ForegroundColor Gray
            Write-Host "    Args: $($config.mcpServers.orchestration.args -join ' ')" -ForegroundColor Gray
            $TestResults += @{Test="Agent Configuration"; Status="PASS"}
        } else {
            Write-Host "  ❌ FAIL: Orchestration agent not found in config" -ForegroundColor Red
            $TestResults += @{Test="Agent Configuration"; Status="FAIL"}
        }
    } catch {
        Write-Host "  ❌ FAIL: Invalid JSON in config file" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        $TestResults += @{Test="Agent Configuration"; Status="FAIL"}
    }
}

# Test 4: Check if backup exists
Write-Host "`n✓ Test 4: Checking config backup..." -ForegroundColor Yellow
$backupPath = "$env:APPDATA\Claude\claude_desktop_config.json.backup"
if (Test-Path $backupPath) {
    Write-Host "  ✅ PASS: Backup exists at $backupPath" -ForegroundColor Green
    $TestResults += @{Test="Config Backup"; Status="PASS"}
} else {
    Write-Host "  ⚠️  WARN: No backup found (not critical)" -ForegroundColor Yellow
    $TestResults += @{Test="Config Backup"; Status="WARN"}
}

# Test 5: Verify package.json exists
Write-Host "`n✓ Test 5: Checking package.json..." -ForegroundColor Yellow
$packagePath = "C:\Users\faley\Desktop\Code\Repos\ProjectPlanner\MCP-SERVER\orchestration-agent\package.json"
if (Test-Path $packagePath) {
    $package = Get-Content $packagePath -Raw | ConvertFrom-Json
    Write-Host "  ✅ PASS: Package info found" -ForegroundColor Green
    Write-Host "    Name: $($package.name)" -ForegroundColor Gray
    Write-Host "    Version: $($package.version)" -ForegroundColor Gray
    $TestResults += @{Test="Package Info"; Status="PASS"}
} else {
    Write-Host "  ❌ FAIL: package.json not found" -ForegroundColor Red
    $TestResults += @{Test="Package Info"; Status="FAIL"}
}

# Test 6: Check if Claude Desktop is installed
Write-Host "`n✓ Test 6: Checking Claude Desktop installation..." -ForegroundColor Yellow
$claudePath = "$env:LOCALAPPDATA\Programs\claude\Claude.exe"
if (Test-Path $claudePath) {
    Write-Host "  ✅ PASS: Claude Desktop installed" -ForegroundColor Green
    $TestResults += @{Test="Claude Desktop"; Status="PASS"}
} else {
    Write-Host "  ❌ FAIL: Claude Desktop not found" -ForegroundColor Red
    Write-Host "  💡 Run: winget install Anthropic.Claude" -ForegroundColor Yellow
    $TestResults += @{Test="Claude Desktop"; Status="FAIL"}
}

# Test 7: Check if Node.js is available
Write-Host "`n✓ Test 7: Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✅ PASS: Node.js $nodeVersion" -ForegroundColor Green
    $TestResults += @{Test="Node.js"; Status="PASS"}
} catch {
    Write-Host "  ❌ FAIL: Node.js not found in PATH" -ForegroundColor Red
    $TestResults += @{Test="Node.js"; Status="FAIL"}
}

# Test 8: Verify tests pass
Write-Host "`n✓ Test 8: Running unit tests..." -ForegroundColor Yellow
Push-Location "C:\Users\faley\Desktop\Code\Repos\ProjectPlanner\MCP-SERVER\orchestration-agent"
try {
    $testOutput = npm test --silent 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ PASS: All tests passing" -ForegroundColor Green
        $TestResults += @{Test="Unit Tests"; Status="PASS"}
    } else {
        Write-Host "  ❌ FAIL: Some tests failing" -ForegroundColor Red
        $TestResults += @{Test="Unit Tests"; Status="FAIL"}
    }
} catch {
    Write-Host "  ❌ FAIL: Could not run tests" -ForegroundColor Red
    $TestResults += @{Test="Unit Tests"; Status="FAIL"}
}
Pop-Location

# Summary
Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
Write-Host "📊 Test Summary" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan

$passCount = ($TestResults | Where-Object { $_.Status -eq "PASS" }).Count
$failCount = ($TestResults | Where-Object { $_.Status -eq "FAIL" }).Count
$warnCount = ($TestResults | Where-Object { $_.Status -eq "WARN" }).Count
$totalCount = $TestResults.Count

Write-Host "`nResults: $passCount/$totalCount passed" -ForegroundColor $(if ($failCount -eq 0) { "Green" } else { "Yellow" })
if ($failCount -gt 0) {
    Write-Host "Failures: $failCount" -ForegroundColor Red
}
if ($warnCount -gt 0) {
    Write-Host "Warnings: $warnCount" -ForegroundColor Yellow
}

# Detailed results
Write-Host "`nDetailed Results:" -ForegroundColor White
foreach ($result in $TestResults) {
    $color = switch ($result.Status) {
        "PASS" { "Green" }
        "FAIL" { "Red" }
        "WARN" { "Yellow" }
    }
    $icon = switch ($result.Status) {
        "PASS" { "✅" }
        "FAIL" { "❌" }
        "WARN" { "⚠️ " }
    }
    Write-Host "  $icon $($result.Test): $($result.Status)" -ForegroundColor $color
}

# Final recommendations
Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
if ($failCount -eq 0) {
    Write-Host "🎉 All checks passed! Ready to use in Claude Desktop" -ForegroundColor Green
    Write-Host "`nNext Steps:" -ForegroundColor Cyan
    Write-Host "  1. Restart Claude Desktop" -ForegroundColor White
    Write-Host "  2. Ask Claude to list available MCP tools" -ForegroundColor White
    Write-Host "  3. Try: 'Use list_patterns to show orchestration patterns'" -ForegroundColor White
    Write-Host "  4. See test-deployment.md for full test scenarios" -ForegroundColor White
} else {
    Write-Host "⚠️  Some checks failed. Review errors above." -ForegroundColor Yellow
    Write-Host "`nCommon Fixes:" -ForegroundColor Cyan
    Write-Host "  • Build: npm run build" -ForegroundColor White
    Write-Host "  • Install Claude: winget install Anthropic.Claude" -ForegroundColor White
    Write-Host "  • Fix config: Restore from backup if needed" -ForegroundColor White
}

Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
Write-Host ""
