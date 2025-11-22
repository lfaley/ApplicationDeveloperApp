#!/usr/bin/env node

/**
 * Context Agent - Web UI Server
 * Serves the modern HTML/CSS web interface for the Context Agent
 * 
 * Usage: node ui-server.js [PORT]
 * Example: node ui-server.js 3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const Busboy = require('busboy');
const AdmZip = require('adm-zip');

const execAsync = promisify(exec);
const PORT = process.argv[2] || 3000;

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API endpoint: Run CLI command
  if (req.method === 'POST' && req.url === '/api/run-tool') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const { tool, repoPath, options } = data;

        // Validate inputs
        if (!tool || !repoPath) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing tool or repoPath' }));
          return;
        }

        // Build command
        let command = `node dist/cli.js ${tool} "${repoPath}"`;
        
        if (options?.autoApprove) command += ' --approve';
        if (options?.noBackup) command += ' --no-backup';

        console.log(`Executing: ${command}`);

        // Execute CLI command
        // Remove any explicit shell or cmd.exe usage
        const { stdout, stderr } = await execAsync(command, {
          cwd: path.join(__dirname, '..', 'project-context-agent'),
          maxBuffer: 1024 * 1024 * 10, // 10MB buffer
          // Do NOT specify shell or cmd.exe
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          output: stdout,
          error: stderr || null,
        }));
      } catch (error) {
        console.error('Error executing tool:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: error.message,
          output: error.stdout || '',
        }));
      }
    });
    return;
  }

  // API endpoint: New Project Creation
  if (req.method === 'POST' && req.url === '/api/create-project') {
    // Check for multipart form (file upload)
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
      const busboy = new Busboy({ headers: req.headers });
      let fields = {};
      let customTemplateBuffer = null;
      let customTemplateFilename = '';
      let setupLog = [];
      busboy.on('field', (fieldname, val) => {
        fields[fieldname] = val;
      });
      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (fieldname === 'customTemplate' && mimetype === 'application/zip') {
          customTemplateFilename = filename;
          const buffers = [];
          file.on('data', data => buffers.push(data));
          file.on('end', () => {
            customTemplateBuffer = Buffer.concat(buffers);
          });
        } else {
          file.resume(); // Ignore other files
        }
      });
      busboy.on('finish', async () => {
        try {
          const { projectName, projectPath, framework, includeDocs, initGit, createGitHub } = fields;
          if (!projectName || !projectPath || !framework) {
            setupLog.push('Validation failed: Missing required fields.');
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing required fields', setupLog }));
            return;
          }
          setupLog.push(`Creating project directory at ${projectPath}...`);
          const fullPath = path.resolve(projectPath, projectName);
          if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
            setupLog.push('Project directory created.');
          } else {
            setupLog.push('Project directory already exists.');
          }
          // If custom template uploaded, extract it
          if (customTemplateBuffer) {
            setupLog.push('Extracting custom template zip...');
            const zip = new AdmZip(customTemplateBuffer);
            zip.extractAllTo(fullPath, true);
            setupLog.push('Custom template extracted.');
          } else {
            // Copy template files for selected framework
            const templateDir = path.join(__dirname, 'templates', framework.toLowerCase());
            setupLog.push(`Copying template files from ${templateDir}...`);
            copyDirectory(templateDir, fullPath);
            setupLog.push('Template files copied.');
          }
          // Optionally add docs
          if (includeDocs === 'true' || includeDocs === true) {
            fs.writeFileSync(path.join(fullPath, 'docs.md'), `# Documentation for ${projectName}`);
            setupLog.push('Documentation file created.');
          }
          // Optionally initialize Git
          if (initGit === 'true' || initGit === true) {
            await execAsync('git init', { cwd: fullPath });
            setupLog.push('Git repository initialized.');
          }
          // Optionally create GitHub repo
          let githubResult = null;
          if (createGitHub === 'true' || createGitHub === true) {
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
              githubResult = `GitHub repo creation failed: ${err.message}`;
              setupLog.push(`GitHub repo creation failed: ${err.message}`);
            }
          }
          setupLog.push('Project setup complete.');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            projectPath: fullPath,
            githubResult,
            setupLog
          }));
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: error.message }));
        }
      });
      req.pipe(busboy);
      return;
    }
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const { projectName, projectPath, framework, includeDocs, initGit, createGitHub, envVars, license } = data;
        let setupLog = [];
        if (!projectName || !projectPath || !framework) {
          setupLog.push('Validation failed: Missing required fields.');
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing required fields', setupLog }));
          return;
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
          await execAsync('git init', { cwd: fullPath });
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
            githubResult = `GitHub repo creation failed: ${err.message}`;
            setupLog.push(`GitHub repo creation failed: ${err.message}`);
          }
        }
        setupLog.push('Project setup complete.');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          projectPath: fullPath,
          githubResult,
          setupLog
        }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
    return;
  }

  // Serve static files
  let filePath = req.url === '/' ? '/context-agent-ui.html' : req.url;
  filePath = path.join(__dirname, filePath);

  // Security: prevent directory traversal
  const realPath = fs.realpathSync(path.join(__dirname, '.'));
  if (!filePath.startsWith(realPath)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access denied');
    return;
  }

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`<h1>404 Not Found</h1><p>File not found: ${req.url}</p>`);
    return;
  }

  // Read and serve file
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal server error');
      return;
    }

    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });
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

// Start server if run directly
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║        Context Agent - Web UI Server Started                 ║
╚══════════════════════════════════════════════════════════════╝

🌐 Open your browser and navigate to:
   http://localhost:${PORT}

📝 Features:
   ✓ Modern dark-themed interface
   ✓ Real-time tool execution
   ✓ Beautiful gradient UI
   ✓ Responsive design

🛠 Tools Available:
   • Detect Drift - Scan for documentation out of sync
   • Health Check - Calculate documentation quality
   • Suggest Updates - Get recommendations
   • Auto Sync - Automatically synchronize

📍 Server running at: http://localhost:${PORT}
Press Ctrl+C to stop the server
    `);
  });
}

// Export server for testing
module.exports = server;

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down server...');
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});

// Error handling
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.log(`Try a different port: node ui-server.js 3001`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});
