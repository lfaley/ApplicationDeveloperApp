import { ipcMain } from 'electron';
import logger from '../logger';

describe('IPC: assess-project error details', () => {
  it('should log error with all context fields', async () => {
    const logSpy = jest.spyOn(logger, 'log');
    jest.spyOn(require('child_process'), 'exec').mockImplementation((cmd, opts, cb) => {
      cb(new Error('fail'), '', 'fail');
    });
    const event = {};
    const repoPath = '/fake/path';
    const actions = [{ name: 'detect-drift', label: 'Detect Drift' }];
    const handler = ipcMain._events['assess-project'];
    await handler(event, { repoPath, actions });
    const lastCall = logSpy.mock.calls[logSpy.mock.calls.length - 1];
    expect(lastCall[2]).toMatchObject({
      action: expect.any(String),
      repoPath: expect.any(String),
      error: expect.any(String),
      stack: expect.any(String),
      timestamp: expect.any(String)
    });
  });
});
