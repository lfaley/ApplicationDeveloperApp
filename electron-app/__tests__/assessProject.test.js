import assessProject from '../assessProject.js';
import logger from '../logger.js';
import { describe, it, expect, vi } from 'vitest';

describe('assessProject (core logic)', () => {
  it('should aggregate results and return markdown for all actions', async () => {
    vi.spyOn(await import('child_process'), 'exec').mockImplementation((cmd, opts, cb) => {
      cb(null, 'output', '');
    });
    const repoPath = '/fake/path';
    const actions = [
      { name: 'detect-drift', label: 'Detect Drift' },
      { name: 'health-check', label: 'Health Check' },
      { name: 'suggest-updates', label: 'Suggest Updates' },
      { name: 'auto-sync', label: 'Auto Sync', options: { autoApprove: true, noBackup: true } }
    ];
    const result = await assessProject(repoPath, actions);
    expect(result.markdown).toContain('Detect Drift');
    expect(result.markdown).toContain('Health Check');
    expect(result.markdown).toContain('Suggest Updates');
    expect(result.markdown).toContain('Auto Sync');
  });

  it('should log errors with all context fields', async () => {
    const logSpy = vi.spyOn(logger, 'log');
    vi.spyOn(await import('child_process'), 'exec').mockImplementation((cmd, opts, cb) => {
      cb(new Error('fail'), '', 'fail');
    });
    const repoPath = '/fake/path';
    const actions = [{ name: 'detect-drift', label: 'Detect Drift' }];
    await assessProject(repoPath, actions);
    // Find the last call with an object as the third argument
    const lastCall = logSpy.mock.calls.reverse().find(call => typeof call[2] === 'object');
    expect(lastCall[2]).toMatchObject({
      action: expect.any(String),
      repoPath: expect.any(String),
      error: expect.any(String),
      stack: expect.any(String),
      timestamp: expect.any(String)
    });
  });
});
