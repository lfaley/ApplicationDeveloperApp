// New Project Creation Agent - Backend Tests
// Uses Jest for unit and integration testing

const fs = require('fs');
const path = require('path');
const request = require('supertest');
const server = require('../ui-server'); // Corrected path for Node.js CommonJS

describe('New Project Creation Agent', () => {
  const testDir = path.join(__dirname, 'test-output');
  const apiUrl = '/api/create-project';

  beforeAll(() => {
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);
  });
  afterAll(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should return error for missing required fields', async () => {
    const res = await request(server)
      .post(apiUrl)
      .send({ projectName: '', projectPath: '', framework: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Missing required fields/);
  });

  it('should create a new project directory with template files', async () => {
    const res = await request(server)
      .post(apiUrl)
      .send({
        projectName: 'TestProject',
        projectPath: testDir,
        framework: 'Node.js',
        includeDocs: true,
        initGit: false,
        createGitHub: false
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    const projectPath = path.join(testDir, 'TestProject');
    expect(fs.existsSync(projectPath)).toBe(true);
    expect(fs.existsSync(path.join(projectPath, 'README.md'))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, 'index.js'))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, 'docs.md'))).toBe(true);
  });

  // Add more tests for validation, error handling, git init, etc.
});
