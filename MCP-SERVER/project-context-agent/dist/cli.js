#!/usr/bin/env node
/**
 * Project Context Agent - Standalone CLI
 *
 * Standalone command-line interface for drift detection, health checking,
 * and documentation synchronization without requiring Claude Desktop.
 *
 * Usage:
 *   project-context detect-drift <path>
 *   project-context health-check <path>
 *   project-context suggest-updates <path>
 *   project-context auto-sync <path> [--approve] [--backup]
 */
import * as fs from 'fs';
import * as path from 'path';
import { GitIntegration } from './git-integration.js';
import { DriftDetector } from './drift-detection.js';
import { HealthChecker } from './health-check.js';
import { SyncEngine } from './sync-engine.js';
// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};
/**
 * Print colored output
 */
function print(color, message) {
    console.log(`${color}${message}${colors.reset}`);
}
/**
 * Print header
 */
function printHeader(title) {
    console.log('\n' + colors.bright + colors.blue + '═'.repeat(60) + colors.reset);
    print(colors.bright + colors.cyan, `  ${title}`);
    console.log(colors.bright + colors.blue + '═'.repeat(60) + colors.reset + '\n');
}
/**
 * Validate repository path
 */
function validatePath(repoPath) {
    if (!fs.existsSync(repoPath)) {
        print(colors.red, `❌ Error: Path does not exist: ${repoPath}`);
        return false;
    }
    if (!fs.existsSync(path.join(repoPath, '.git'))) {
        print(colors.red, `❌ Error: Not a git repository: ${repoPath}`);
        return false;
    }
    return true;
}
/**
 * Handle detect-drift command
 */
async function handleDetectDrift(repoPath) {
    printHeader('Detecting Documentation Drift');
    try {
        const git = new GitIntegration(repoPath);
        const detector = new DriftDetector(git);
        const result = await detector.detectDrift();
        if (result.hasDrift) {
            print(colors.yellow, `⚠️  Found ${result.summary.totalDrifts} drift items:\n`);
            result.driftItems.forEach(item => {
                const severityColor = item.severity === 'critical' ? colors.red :
                    item.severity === 'high' ? colors.yellow :
                        colors.blue;
                print(severityColor, `  [${item.severity.toUpperCase()}] ${item.type}`);
                print(colors.cyan, `    File: ${item.filePath}`);
                if (item.recommendations.length > 0) {
                    print(colors.cyan, `    Recommendations:`);
                    item.recommendations.forEach(rec => {
                        print(colors.cyan, `      • ${rec}`);
                    });
                }
            });
            print(colors.yellow, `\nSummary:`);
            print(colors.yellow, `  Critical: ${result.summary.critical}`);
            print(colors.yellow, `  High: ${result.summary.high}`);
            print(colors.yellow, `  Medium: ${result.summary.medium}`);
            print(colors.yellow, `  Low: ${result.summary.low}`);
        }
        else {
            print(colors.green, '✅ No drift detected! Documentation is in sync.');
        }
        print(colors.cyan, `\nScanned ${result.scannedFiles} files`);
    }
    catch (error) {
        const err = error;
        print(colors.red, `❌ Error: ${err.message}`);
        process.exit(1);
    }
}
/**
 * Handle health-check command
 */
async function handleHealthCheck(repoPath) {
    printHeader('Calculating Documentation Health Score');
    try {
        const git = new GitIntegration(repoPath);
        const detector = new DriftDetector(git);
        const healthChecker = new HealthChecker(git, detector);
        const result = await healthChecker.calculateHealth();
        // Display score and grade
        const scoreColor = result.score >= 90 ? colors.green :
            result.score >= 80 ? colors.green :
                result.score >= 70 ? colors.yellow :
                    colors.red;
        print(colors.bright + scoreColor, `Score: ${result.score}/100 (Grade ${result.grade})`);
        // Display factors
        print(colors.cyan, '\nFactors:');
        print(colors.cyan, `  Coverage:     ${result.factors.documentationCoverage}%`);
        print(colors.cyan, `  Freshness:    ${result.factors.documentationFreshness}%`);
        print(colors.cyan, `  Consistency:  ${result.factors.consistencyScore}%`);
        print(colors.cyan, `  Completeness: ${result.factors.completenessScore}%`);
        // Display strengths
        if (result.strengths.length > 0) {
            print(colors.green, '\nStrengths:');
            result.strengths.forEach(s => print(colors.green, `  ✓ ${s}`));
        }
        // Display issues
        if (result.issues.length > 0 && !result.issues[0].includes('No significant')) {
            print(colors.yellow, '\nIssues to Address:');
            result.issues.forEach(i => print(colors.yellow, `  ⚠ ${i}`));
        }
    }
    catch (error) {
        const err = error;
        print(colors.red, `❌ Error: ${err.message}`);
        process.exit(1);
    }
}
/**
 * Handle suggest-updates command
 */
async function handleSuggestUpdates(repoPath) {
    printHeader('Documentation Update Suggestions');
    try {
        const git = new GitIntegration(repoPath);
        const detector = new DriftDetector(git);
        const result = await detector.detectDrift();
        if (result.driftItems.length === 0) {
            print(colors.green, '✅ No updates needed! Documentation is current.');
            return;
        }
        print(colors.yellow, `📋 Found ${result.driftItems.length} files needing updates:\n`);
        result.driftItems.forEach((item, index) => {
            print(colors.bright + colors.blue, `${index + 1}. ${item.filePath}`);
            print(colors.cyan, `   Type: ${item.type} (${item.severity})`);
            if (item.recommendations.length > 0) {
                print(colors.cyan, `   Actions:`);
                item.recommendations.forEach(rec => {
                    print(colors.cyan, `     → ${rec}`);
                });
            }
            console.log();
        });
    }
    catch (error) {
        const err = error;
        print(colors.red, `❌ Error: ${err.message}`);
        process.exit(1);
    }
}
/**
 * Handle auto-sync command
 */
async function handleAutoSync(repoPath, args) {
    printHeader('Auto-Syncing Documentation');
    const approve = args.includes('--approve');
    const backup = !args.includes('--no-backup');
    try {
        const git = new GitIntegration(repoPath);
        const detector = new DriftDetector(git);
        const syncEngine = new SyncEngine(git, detector);
        print(colors.cyan, `Starting sync with:`);
        print(colors.cyan, `  Create backup: ${backup ? 'Yes' : 'No'}`);
        print(colors.cyan, `  Auto-approve: ${approve ? 'Yes' : 'No'}`);
        const result = await syncEngine.sync({
            createBackup: backup,
            approvalCallback: approve
                ? async () => true
                : async (items) => {
                    print(colors.yellow, `\n⚠️  Approval needed for ${items.length} file(s):`);
                    items.forEach(item => {
                        print(colors.cyan, `   • ${item.filePath} (${item.type})`);
                    });
                    print(colors.yellow, '\nTo approve, run with --approve flag');
                    return false;
                },
        });
        print(colors.green, `\n✅ Sync completed!`);
        print(colors.cyan, `  Files modified: ${result.filesModified.length}`);
        print(colors.cyan, `  Items synced: ${result.itemsSynced}`);
        print(colors.cyan, `  Items failed: ${result.itemsFailed}`);
        if (result.filesModified.length > 0) {
            print(colors.green, '\nModified files:');
            result.filesModified.forEach(f => print(colors.green, `  ✓ ${f}`));
        }
        if (result.errors.length > 0) {
            print(colors.red, '\nErrors:');
            result.errors.forEach(e => print(colors.red, `  ✗ ${e}`));
        }
    }
    catch (error) {
        const err = error;
        print(colors.red, `❌ Error: ${err.message}`);
        process.exit(1);
    }
}
/**
 * Print usage information
 */
function printUsage() {
    printHeader('Project Context Agent - CLI');
    console.log(`
${colors.bright}Usage:${colors.reset}
  project-context <command> <path> [options]

${colors.bright}Commands:${colors.reset}
  detect-drift          Scan for documentation drift
  health-check          Calculate documentation health score
  suggest-updates       Get update recommendations
  auto-sync             Automatically synchronize documentation

${colors.bright}Arguments:${colors.reset}
  path                  Path to git repository to scan

${colors.bright}Options:${colors.reset}
  --approve             Auto-approve changes (for auto-sync)
  --no-backup           Skip backup creation (for auto-sync)
  --help                Show this help message

${colors.bright}Examples:${colors.reset}
  project-context detect-drift /path/to/repo
  project-context health-check C:\\Users\\Projects\\MyApp
  project-context suggest-updates ~/myproject
  project-context auto-sync /repos/project --approve --no-backup

${colors.bright}Documentation:${colors.reset}
  https://github.com/lfaley/ProjectPlanner/wiki/Project-Context-Agent
  `);
}
/**
 * Main entry point
 */
async function main() {
    const args = process.argv.slice(2);
    if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
        printUsage();
        process.exit(0);
    }
    const command = args[0];
    const repoPath = args[1];
    if (!repoPath) {
        print(colors.red, `❌ Error: Repository path is required`);
        printUsage();
        process.exit(1);
    }
    // Validate path
    if (!validatePath(repoPath)) {
        process.exit(1);
    }
    // Convert to absolute path
    const absolutePath = path.resolve(repoPath);
    switch (command) {
        case 'detect-drift':
            await handleDetectDrift(absolutePath);
            break;
        case 'health-check':
            await handleHealthCheck(absolutePath);
            break;
        case 'suggest-updates':
            await handleSuggestUpdates(absolutePath);
            break;
        case 'auto-sync':
            await handleAutoSync(absolutePath, args.slice(2));
            break;
        default:
            print(colors.red, `❌ Error: Unknown command: ${command}`);
            printUsage();
            process.exit(1);
    }
}
main().catch(error => {
    print(colors.red, `❌ Fatal error: ${error.message}`);
    process.exit(1);
});
//# sourceMappingURL=cli.js.map