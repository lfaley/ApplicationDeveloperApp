# New Project Creation Agent - Implementation Guide

## Overview
This document outlines the step-by-step plan for implementing the New Project Creation Agent in ProjectPlanner. The agent will guide users through project setup, create files/folders, copy templates, and handle Git/GitHub integration via a modern web UI and Node.js backend.

---

## Tasks Breakdown

### Task 1: Define Requirements & Architecture

#### 1.1 User Inputs (from UI)
- Project Name (string, required)
- Destination Path (string, required)
- Framework (enum: React, Next.js, Node.js, Python, C#, required)
- Include Documentation Templates (boolean)
- Initialize Git Repository (boolean)
- Create GitHub Repository (boolean)

#### 1.2 Backend API Contract
- Endpoint: POST `/api/create-project`
- Payload:
  ```json
  {
    "projectName": "string",
    "projectPath": "string",
    "framework": "string",
    "includeDocs": "boolean",
    "initGit": "boolean",
    "createGitHub": "boolean"
  }
  ```
- Response:
  - Success: `{ success: true, projectPath, githubResult }`
  - Error: `{ success: false, error }`

#### 1.3 Template Directory Structure
- Location: `GUI/templates/`
- Subfolders: `react/`, `next.js/`, `node.js/`, `python/`, `c#/`
- Each subfolder contains starter files (e.g., `README.md`, `.gitignore`, main source file)

#### 1.4 Security & Validation
- Validate all required fields on backend
- Prevent directory traversal (sanitize paths)
- Ensure destination path is writable
- Return clear error messages

#### 1.5 Extensibility
- Utility functions for template copying, git init, docs
- Future: Integrate GitHub API (Octokit)

### Task 2: Implement Backend API Endpoint

#### 2.1 Add POST /api/create-project Endpoint
- Location: `ui-server.js`
- Accepts JSON payload with project details
- Validates required fields

#### 2.2 Directory Creation
- Uses `fs.mkdirSync(fullPath, { recursive: true })` to create project directory
- Checks if directory already exists

#### 2.3 Template Copying (Stub)
- Prepares for copying files from `templates/<framework>/` to new project directory
- Uses utility function (to be implemented in Task 3)

#### 2.4 Documentation File
- If `includeDocs` is true, creates a basic `docs.md` file in project directory

#### 2.5 Git Initialization
- If `initGit` is true, runs `git init` in project directory using `execAsync`

#### 2.6 GitHub Integration (Stub)
- If `createGitHub` is true, returns placeholder message (to be implemented later)

#### 2.7 Error Handling & Logging
- Catches and logs errors
- Returns clear error messages to frontend

#### 2.8 Example Code Block
```javascript
// POST /api/create-project
if (req.method === 'POST' && req.url === '/api/create-project') {
  // ...see implementation in ui-server.js...
}
```

### Task 3: Create Template Directory Structure

#### 3.1 Add templates/ Folder
- Location: `GUI/templates/`
- Contains starter files for each supported framework

#### 3.2 Subfolders and Sample Files
- react/: README.md, .gitignore, App.js
- next.js/: README.md, .gitignore, pages/index.js
- node.js/: README.md, .gitignore, index.js
- python/: README.md, .gitignore, main.py
- c#/: README.md, .gitignore, Program.cs

#### 3.3 Documentation
- Each README.md describes the starter project
- .gitignore files tailored for each framework
- Main source file included for each language/framework

### Task 4: Frontend Integration

#### 4.1 Form Connection
- The New Project Creation form in `projectplanner-ui.html` is already connected to the backend via JavaScript.
- On submit, form data is serialized and sent to `/api/create-project` using `fetch`.

#### 4.2 Result Display
- Results (success or error) are displayed in the `#results` panel.
- Success: Shows project path and GitHub result (if any).
- Error: Shows error message from backend.

#### 4.3 Improvements & Best Practices
- Ensure user feedback is clear and actionable.
- Consider adding loading indicators for long operations.
- Validate form fields before submission (future enhancement).

#### 4.4 Example Code Block
```javascript
// Already implemented in <script> of projectplanner-ui.html
```

### Task 5: Error Handling, Validation, Security

#### 5.1 Input Validation
- Check all required fields (`projectName`, `projectPath`, `framework`) are present and non-empty
- Validate `framework` against allowed values
- Sanitize `projectName` and `projectPath` to prevent directory traversal (e.g., no `..`, no absolute paths outside allowed root)

#### 5.2 Security
- Ensure project is only created within allowed directories
- Prevent overwriting existing directories unless explicitly allowed (future enhancement)
- Use try/catch for all file operations

#### 5.3 Error Handling
- Return clear, actionable error messages to frontend
- Log errors for debugging

#### 5.4 Example Code Block
```javascript
// Example validation in /api/create-project endpoint
if (!projectName || !projectPath || !framework) {
  res.writeHead(400, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Missing required fields' }));
  return;
}
const allowedFrameworks = ['React', 'Next.js', 'Node.js', 'Python', 'C#'];
if (!allowedFrameworks.includes(framework)) {
  res.writeHead(400, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Invalid framework' }));
  return;
}
if (projectName.includes('..') || projectPath.includes('..')) {
  res.writeHead(400, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Invalid path' }));
  return;
}
```
---

### Task 6: Documentation & Code Comments

#### 6.1 Code Comments
- Add descriptive comments to all major logic blocks in `ui-server.js`:
  - API endpoint handlers
  - Input validation
  - Directory and file operations
  - Error handling
  - Utility functions (e.g., template copying)

#### 6.2 Implementation Guide Updates
- Include code snippets with comments for each major step
- Explain the purpose and usage of each function and logic block

#### 6.3 Example Code Block
```javascript
// API endpoint for new project creation
// Handles validation, directory creation, template copying, docs, git init
if (req.method === 'POST' && req.url === '/api/create-project') {
  // Parse request body and validate input
  // ...
  // Create project directory
  // ...
  // Copy template files
  // ...
  // Create documentation file if requested
  // ...
  // Initialize git if requested
  // ...
  // Return result or error
  // ...
}
```

---

## Task 7: Testing

### 7.1 Unit Tests
- Write tests for backend logic:
  - Input validation
  - Directory and file creation
  - Template copying utility
  - Error handling

### 7.2 Integration Tests
- Test end-to-end project creation via API
- Simulate form submission and verify results

### 7.3 Tools
- Use a Node.js testing framework (e.g., Jest, Mocha)
- Mock filesystem and external dependencies as needed

### 7.4 Example Test Case
```javascript
// Example: Test input validation
it('should return error for missing projectName', async () => {
  // ...test code...
});
```

---

## Task 8: GitHub Integration

### 8.1 Add Octokit Dependency
- Use the official Octokit library for GitHub API integration
- Add to package.json: `npm install @octokit/rest`

### 8.2 Backend Implementation
- Update `/api/create-project` endpoint to create a GitHub repo if `createGitHub` is true
- Use a secure GitHub token (environment variable, not hard-coded)
- Create repo under authenticated user/org
- Return repo URL or error to frontend

### 8.3 Security
- Never log or expose secrets
- Validate repo name and handle errors gracefully

### 8.4 Example Code Block
```javascript
const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
// ...
const response = await octokit.repos.createForAuthenticatedUser({
  name: projectName,
  private: true // or false
});
```

---

## Task 9: Project Setup Logs & Summaries

### 9.1 Backend Logging
- Collect key steps and results during project creation (directory, template, docs, git, GitHub)
- Store log messages in an array during API execution
- Return log summary to frontend in API response

### 9.2 Frontend Display
- Show setup log/summary in the results panel after project creation
- Use readable formatting (bulleted list or preformatted text)

### 9.3 Example Backend Code
```javascript
let setupLog = [];
setupLog.push('Creating project directory...');
// ...
setupLog.push('Copying template files...');
// ...
res.end(JSON.stringify({ success: true, projectPath, githubResult, setupLog }));
```

---

## Task 10: Custom Template Selection & Upload

### 10.1 UI Enhancements
- Add a dropdown to select from available templates (frameworks)
- Add a file input to allow user-uploaded custom template zip
- Show template selection in the New Project Creation form

### 10.2 Backend Enhancements
- Accept uploaded zip file via multipart/form-data
- Extract and copy uploaded template files to new project directory
- If no upload, use selected framework template as before

### 10.3 Security & Validation
- Validate uploaded file type and size
- Sanitize extracted files and paths

### 10.4 Example UI Addition
```html
<select name="template" class="input">
  <option value="default">Default</option>
  <option value="react">React</option>
  <option value="next.js">Next.js</option>
  ...
</select>
<input type="file" name="customTemplate" accept=".zip">
```

---

## Task 11: Backend Support for Custom Template Uploads

### 11.1 Accept File Uploads
- Use a library like `busboy` or `multer` to handle multipart/form-data uploads
- Accept zip file in `/api/create-project` endpoint

### 11.2 Extract Zip File
- Use `adm-zip` or `unzipper` to extract uploaded zip to new project directory
- Validate file type and size
- Sanitize extracted paths

### 11.3 Logic
- If custom template is uploaded, extract and use it
- If not, use selected framework template as before

### 11.4 Example Backend Code
```javascript
const Busboy = require('busboy');
const AdmZip = require('adm-zip');
// ...
// In API endpoint, parse multipart form and handle zip upload
```

---

## Task 12: Advanced Project Configuration

### 12.1 UI Enhancements
- Add fields for environment variables (key-value pairs)
- Add option to include a license file (dropdown: MIT, Apache, GPL, etc.)

### 12.2 Backend Enhancements
- Create `.env` file in project directory from provided key-value pairs
- Add selected license file from templates

### 12.3 Example UI Addition
```html
<div id="env-vars">
  <label>Environment Variables:</label>
  <input class="input" type="text" name="envKey1" placeholder="KEY">
  <input class="input" type="text" name="envVal1" placeholder="VALUE">
  <!-- Add dynamic add/remove for more pairs -->
</div>
<select name="license" class="input">
  <option value="">No License</option>
  <option value="MIT">MIT</option>
  <option value="Apache">Apache</option>
  <option value="GPL">GPL</option>
</select>
```

---

## Next: Implement UI and backend support for advanced project configuration
