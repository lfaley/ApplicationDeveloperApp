// assessProject.js
// Core logic for running all assessment actions, aggregating results, and formatting as Markdown.
// This is separated from the Electron IPC handler for easier testing and reuse.

const path = require('path');
const { exec } = require('child_process');
const logger = require('./logger');

/**
 * Runs the selected assessment actions on the given repoPath, aggregates results, and returns a Markdown report.
 * @param {string} repoPath - Absolute path to the repository to assess.
 * @param {Array} actions - List of actions to run (name, label, options).
 * @returns {Promise<{markdown: string, results: Array}>} Markdown report and per-action results.
 */
async function assessProject(repoPath, actions) {
  logger.log(4, 'assessProject called', { repoPath, actions });
  const cliPath = path.resolve(__dirname, '..', 'MCP-SERVER', 'project-context-agent', 'dist', 'cli.js');
  const actionList = actions && actions.length ? actions : [
    { name: 'detect-drift', label: 'Detect Drift' },
    { name: 'health-check', label: 'Health Check' },
    { name: 'suggest-updates', label: 'Suggest Updates' },
    { name: 'auto-sync', label: 'Auto Sync', options: { autoApprove: true, noBackup: true } }
  ];
  let markdown = `# Project Assessment Report\n\n_Assessed at: ${new Date().toLocaleString()}_\n\n`;
  let summary = [];
  let results = [];
  for (const action of actionList) {
    const start = Date.now();
    let command = `node \"${cliPath}\" ${action.name} \"${repoPath}\"`;
    if (action.options?.autoApprove) command += ' --approve';
    if (action.options?.noBackup) command += ' --no-backup';
    try {
      // Run the CLI command for this action
      const { stdout, stderr } = await new Promise((resolve, reject) => {
        exec(command, { cwd: path.resolve(__dirname, '..', 'MCP-SERVER', 'project-context-agent'), shell: true, maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
          if (err) return resolve({ stdout, stderr: stderr || err.message });
          resolve({ stdout, stderr });
        });
      });
      const duration = ((Date.now() - start) / 1000).toFixed(2);
      summary.push(`- **${action.label || action.name}**: Success (\`${duration}s\`)`);
      results.push({
        name: action.name,
        label: action.label || action.name,
        success: true,
        duration,
        output: stdout,
        error: stderr
      });
      // Add section to Markdown report
      markdown += `## ${action.label || action.name}\n\n`;
      markdown += `**Duration:** ${duration}s\n\n`;
      markdown += '```\n' + (stdout || 'No output') + '\n``' + '`\n';
      if (stderr) {
        markdown += `\n**Warnings/Errors:**\n\n\`\`\`\n${stderr}\n\`\`\`\n`;
      }
    } catch (error) {
      // Log and record error for this action
      const duration = ((Date.now() - start) / 1000).toFixed(2);
      logger.log(1, `Assessment action failed: ${error.message}`, {
        action: action.name,
        repoPath,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      summary.push(`- **${action.label || action.name}**: Failed (\`${duration}s\`)`);
      results.push({
        name: action.name,
        label: action.label || action.name,
        success: false,
        duration,
        output: '',
        error: error.message
      });
      markdown += `## ${action.label || action.name}\n\n`;
      markdown += `**Duration:** ${duration}s\n\n`;
      markdown += `**Error:** ${error.message}\n`;
    }
  }
  // Add summary section to the top of the Markdown report
  markdown = `# Project Assessment Report\n\n` +
    `**Assessed at:** ${new Date().toLocaleString()}\n\n` +
    `## Summary\n\n` + summary.join('\n') + '\n\n' + markdown;
  return { markdown, results };
}

module.exports = assessProject;
