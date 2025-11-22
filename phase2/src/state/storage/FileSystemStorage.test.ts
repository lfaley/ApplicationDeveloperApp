/**
 * Tests for FileSystemStorage
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { FileSystemStorage } from './FileSystemStorage';
import { isSuccess, isFailure } from '../../types/common';

describe('FileSystemStorage', () => {
  let storage: FileSystemStorage;
  let testDir: string;

  beforeEach(async () => {
    // Create a temporary test directory
    testDir = path.join(__dirname, '../../../test-data', `test-${Date.now()}`);
    await fs.mkdir(testDir, { recursive: true });
    storage = new FileSystemStorage(testDir);
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('write', () => {
    it('should write JSON data to a file', async () => {
      const data = { name: 'Test', value: 42 };
      const result = await storage.write('test.json', data);

      expect(isSuccess(result)).toBe(true);

      // Verify file was created
      const exists = await storage.exists('test.json');
      expect(exists).toBe(true);
    });

    it('should create directories if they do not exist', async () => {
      const data = { name: 'Test' };
      const result = await storage.write('nested/dir/test.json', data);

      expect(isSuccess(result)).toBe(true);

      const exists = await storage.exists('nested/dir/test.json');
      expect(exists).toBe(true);
    });
  });

  describe('read', () => {
    it('should read JSON data from a file', async () => {
      const data = { name: 'Test', value: 42 };
      await storage.write('test.json', data);

      const result = await storage.read<typeof data>('test.json');

      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.data).toEqual(data);
      }
    });

    it('should return error for non-existent file', async () => {
      const result = await storage.read('nonexistent.json');

      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        expect(result.error.message).toContain('Failed to read file');
      }
    });

    it('should return error for invalid JSON', async () => {
      // Write invalid JSON
      const filePath = path.join(testDir, 'invalid.json');
      await fs.writeFile(filePath, 'not valid json', 'utf-8');

      const result = await storage.read('invalid.json');

      expect(isFailure(result)).toBe(true);
    });
  });

  describe('exists', () => {
    it('should return true for existing file', async () => {
      await storage.write('test.json', { data: 'test' });

      const exists = await storage.exists('test.json');

      expect(exists).toBe(true);
    });

    it('should return false for non-existent file', async () => {
      const exists = await storage.exists('nonexistent.json');

      expect(exists).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete a file', async () => {
      await storage.write('test.json', { data: 'test' });

      const result = await storage.delete('test.json');

      expect(isSuccess(result)).toBe(true);

      const exists = await storage.exists('test.json');
      expect(exists).toBe(false);
    });

    it('should return error when deleting non-existent file', async () => {
      const result = await storage.delete('nonexistent.json');

      expect(isFailure(result)).toBe(true);
    });
  });

  describe('list', () => {
    it('should list files in a directory', async () => {
      await storage.write('file1.json', { data: 1 });
      await storage.write('file2.json', { data: 2 });
      await storage.write('file3.json', { data: 3 });

      const result = await storage.list('');

      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.data).toContain('file1.json');
        expect(result.data).toContain('file2.json');
        expect(result.data).toContain('file3.json');
      }
    });

    it('should return empty array for empty directory', async () => {
      await fs.mkdir(path.join(testDir, 'empty'), { recursive: true });

      const result = await storage.list('empty');

      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.data).toEqual([]);
      }
    });
  });

  describe('lock', () => {
    it('should acquire and release a lock', async () => {
      const result = await storage.lock('test.json');

      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        await result.data.release();
      }
    });

    it('should prevent concurrent access', async () => {
      const lock1Result = await storage.lock('test.json', 1000);
      expect(isSuccess(lock1Result)).toBe(true);

      // Try to acquire second lock
      const lock2Promise = storage.lock('test.json', 100);

      // Should timeout
      await expect(lock2Promise).resolves.toMatchObject({
        success: false
      });

      // Release first lock
      if (isSuccess(lock1Result)) {
        await lock1Result.data.release();
      }
    });

    it('should allow lock after release', async () => {
      const lock1Result = await storage.lock('test.json');
      expect(isSuccess(lock1Result)).toBe(true);

      if (isSuccess(lock1Result)) {
        await lock1Result.data.release();
      }

      // Should be able to acquire lock again
      const lock2Result = await storage.lock('test.json');
      expect(isSuccess(lock2Result)).toBe(true);

      if (isSuccess(lock2Result)) {
        await lock2Result.data.release();
      }
    });
  });
});
