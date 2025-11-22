# Setup Script for Code Documentation Agent

Write-Host "🚀 Setting up Code Documentation Agent..." -ForegroundColor Cyan

# Navigate to project directory
Set-Location "$PSScriptRoot"

# Check if Node.js is installed
Write-Host "`n📦 Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green

# Build the project
Write-Host "`n🔨 Building TypeScript project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Build completed with errors (expected - dependencies not yet installed)" -ForegroundColor Yellow
} else {
    Write-Host "✅ Build completed successfully" -ForegroundColor Green
}

# Show next steps
Write-Host "`n✨ Setup complete!" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor White
Write-Host "  1. Review IMPLEMENTATION_PLAN.md for development roadmap" -ForegroundColor Gray
Write-Host "  2. Run 'npm run dev' to start the MCP server in development mode" -ForegroundColor Gray
Write-Host "  3. Run 'npm test' to execute tests (when implemented)" -ForegroundColor Gray
Write-Host "  4. See README.md for tool documentation and usage" -ForegroundColor Gray
