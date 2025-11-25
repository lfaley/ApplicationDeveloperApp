const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const AdmZip = require('adm-zip');
const logger = require('./logger');
const assessProject = require('./assessProject');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  win.loadFile('projectplanner-ui.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handler: Run CLI tool
ipcMain.handle('run-tool', async (event, { tool, repoPath, options }) => {
  logger.log(4, `IPC run-tool invoked`, {
    stage: 'IPC',
    plainEnglish: `Assessing project at ${repoPath} with tool '${tool}'`,
    context: { tool, repoPath, options }
  });
  try {
    // Use absolute path for CLI tool
    const cliPath = path.resolve(__dirname, '..', 'MCP-SERVER', 'project-context-agent', 'dist', 'cli.js');
    let command = `node "${cliPath}" ${tool} "${repoPath}"`;
    if (options?.autoApprove) command += ' --approve';
    if (options?.noBackup) command += ' --no-backup';
    logger.log(5, `Executing command: ${command}`, {
      stage: 'CLI',
      plainEnglish: `Running assessment tool for project.`,
      context: { command }
    });
    return await new Promise((resolve, reject) => {
      exec(command, { cwd: path.resolve(__dirname, '..', 'MCP-SERVER', 'project-context-agent'), shell: true, maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
        if (err) {
          logger.log(2, `Assessment failed: ${err.message}`, {
            stage: 'CLI',
            plainEnglish: `Assessment failed.`,
            stack: err.stack,
            context: { stderr }
          });
          return reject({
            success: false,
            logLevel: 2,
            plainEnglish: 'Assessment failed.',
            technical: err.message,
            stack: err.stack,
            context: stderr,
            output: stderr
          });
        }
        logger.log(4, `Assessment succeeded`, {
          stage: 'CLI',
          plainEnglish: `Assessment completed successfully.`,
          context: { stdout }
        });
        resolve({ success: true, output: stdout, error: stderr });
      });
    });
  } catch (error) {
    logger.log(1, `Fatal error in run-tool: ${error.message}`, {
      stage: 'IPC',
      plainEnglish: `A fatal error occurred during assessment.`,
      stack: error.stack
    });
    return {
      success: false,
      logLevel: 1,
      plainEnglish: 'A fatal error occurred during assessment.',
      technical: error.message,
      stack: error.stack,
      context: error.stdout || ''
    };
  }
});

// IPC handler: Create new project
ipcMain.handle('create-project', async (event, data) => {
  logger.log(4, `IPC create-project invoked`, {
    stage: 'IPC',
    plainEnglish: `Creating new project '${data.projectName}' at ${data.projectPath}`,
    context: data
  });
  const { projectName, projectPath, framework, includeDocs, initGit, createGitHub, envVars, license } = data;
  let setupLog = [];
  try {
    if (!projectName || !projectPath || !framework) {
      logger.log(2, `Validation failed: Missing required fields.`, {
        stage: 'Validation',
        plainEnglish: `Project creation failed due to missing required fields.`
      });
      setupLog.push('Validation failed: Missing required fields.');
      return { success: false, error: 'Missing required fields', setupLog };
    }
    setupLog.push(`Creating project directory at ${projectPath}...`);
    const fullPath = path.resolve(projectPath, projectName);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      setupLog.push('Project directory created.');
    } else {
      setupLog.push('Project directory already exists.');
    }
    // Copy template files for selected framework
    const templateDir = path.join(__dirname, 'templates', framework.toLowerCase());
    setupLog.push(`Copying template files from ${templateDir}...`);
    copyDirectory(templateDir, fullPath);
    setupLog.push('Template files copied.');
    // Optionally add docs
    if (includeDocs) {
      fs.writeFileSync(path.join(fullPath, 'docs.md'), `# Documentation for ${projectName}`);
      setupLog.push('Documentation file created.');
    }
    // Add .env file if envVars provided
    if (Array.isArray(envVars) && envVars.length > 0 && envVars[0].key) {
      const envContent = envVars.map(ev => `${ev.key}=${ev.value}`).join('\n');
      fs.writeFileSync(path.join(fullPath, '.env'), envContent);
      setupLog.push('.env file created.');
    }
    // Add license file if selected
    if (license && license !== '') {
      const licenseTemplates = {
        MIT: `MIT License\n\nCopyright (c) ${new Date().getFullYear()}\nPermission is hereby granted...`,
        Apache: `Apache License\nVersion 2.0, January 2004\n...`,
        GPL: `GNU GENERAL PUBLIC LICENSE\nVersion 3, 29 June 2007\n...`
      };
      fs.writeFileSync(path.join(fullPath, 'LICENSE'), licenseTemplates[license] || '');
      setupLog.push(`License file (${license}) created.`);
    }
    // Optionally initialize Git
    if (initGit) {
      await new Promise((resolve, reject) => {
        exec('git init', { cwd: fullPath, shell: true }, (err) => {
          if (err) {
            logger.log(2, `Git init failed: ${err.message}`, {
              stage: 'Git',
              plainEnglish: `Failed to initialize Git repository.`,
              stack: err.stack
            });
            reject(err);
          }
          else resolve();
        });
      });
      setupLog.push('Git repository initialized.');
    }
    // Optionally create GitHub repo
    let githubResult = null;
    if (createGitHub) {
      try {
        const { Octokit } = require('@octokit/rest');
        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        const response = await octokit.repos.createForAuthenticatedUser({
          name: projectName,
          private: true
        });
        githubResult = `GitHub repo created: <a href='${response.data.html_url}' target='_blank'>${response.data.html_url}</a>`;
        setupLog.push('GitHub repository created.');
      } catch (err) {
        logger.log(2, `GitHub repo creation failed: ${err.message}`, {
          stage: 'GitHub',
          plainEnglish: `Failed to create GitHub repository.`,
          stack: err.stack
        });
        githubResult = `GitHub repo creation failed: ${err.message}`;
        setupLog.push(`GitHub repo creation failed: ${err.message}`);
      }
    }
    setupLog.push('Project setup complete.');
    logger.log(4, `Project creation succeeded`, {
      stage: 'Project Creation',
      plainEnglish: `Project created successfully at ${fullPath}.`,
      context: { setupLog }
    });
    return { success: true, projectPath: fullPath, githubResult, setupLog };
  } catch (error) {
    logger.log(1, `Fatal error in create-project: ${error.message}`, {
      stage: 'Project Creation',
      plainEnglish: `A fatal error occurred during project creation.`,
      stack: error.stack
    });
    return { success: false, error: error.message, setupLog };
  }
});

// IPC handler: Select folder dialog
ipcMain.handle('select-folder', async () => {
  logger.log(4, `IPC select-folder invoked`, {
    stage: 'IPC',
    plainEnglish: `Opening folder selection dialog.`
  });
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  if (result.canceled || !result.filePaths.length) {
    logger.log(3, `Folder selection canceled or no folder chosen.`, {
      stage: 'Dialog',
      plainEnglish: `No folder was selected.`
    });
    return '';
  }
  logger.log(4, `Folder selected: ${result.filePaths[0]}`, {
    stage: 'Dialog',
    plainEnglish: `Folder selected: ${result.filePaths[0]}`
  });
  return result.filePaths[0];
});

// IPC handler: Assess Project (runs all actions, aggregates results, returns markdown)
ipcMain.handle('assess-project', async (event, { repoPath, actions }) => {
  // Just call the core function for assessment
  return await assessProject(repoPath, actions);
});

// Utility: Recursively copy directory and files
function copyDirectory(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
