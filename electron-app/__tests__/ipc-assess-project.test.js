import { ipcMain } from 'electron';
import { exec } from 'child_process';
import path from 'path';
import logger from '../logger';

describe('IPC: assess-project', () => {
  it('should aggregate results and return markdown for all actions', async () => {
    // Mock exec to simulate CLI output
    jest.spyOn(require('child_process'), 'exec').mockImplementation((cmd, opts, cb) => {
      cb(null, 'output', '');
    });
    const event = {};
    const repoPath = '/fake/path';
    const actions = [
      { name: 'detect-drift', label: 'Detect Drift' },
      { name: 'health-check', label: 'Health Check' },
      { name: 'suggest-updates', label: 'Suggest Updates' },
      { name: 'auto-sync', label: 'Auto Sync', options: { autoApprove: true, noBackup: true } }
    ];
    const handler = ipcMain._events['assess-project'];
    const result = await handler(event, { repoPath, actions });
    expect(result.markdown).toContain('Detect Drift');
    expect(result.markdown).toContain('Health Check');
    expect(result.markdown).toContain('Suggest Updates');
    expect(result.markdown).toContain('Auto Sync');
  });

  it('should log errors at correct log level', async () => {
    const logSpy = jest.spyOn(logger, 'log');
    jest.spyOn(require('child_process'), 'exec').mockImplementation((cmd, opts, cb) => {
      cb(new Error('fail'), '', 'fail');
    });
    const event = {};
    const repoPath = '/fake/path';
    const actions = [{ name: 'detect-drift', label: 'Detect Drift' }];
    const handler = ipcMain._events['assess-project'];
    await handler(event, { repoPath, actions });
    expect(logSpy).toHaveBeenCalledWith(expect.any(Number), expect.stringContaining('fail'), expect.any(Object));
  });
});
