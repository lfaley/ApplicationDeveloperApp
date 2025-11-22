/**
 * File system storage implementation
 * Provides low-level file operations for JSON data
 */

import * as fs from 'fs/promises';
import {Dirent} from 'fs';
import * as path from 'path';
import { Result, success, failure } from '../../types/common';

export interface IFileSystemStorage {
  /**
   * Read a JSON file
   */
  read<T>(filePath: string): Promise<Result<T>>;
  
  /**
   * Write a JSON file
   */
  write<T>(filePath: string, data: T): Promise<Result<void>>;
  
  /**
   * Check if a file exists
   */
  exists(filePath: string): Promise<boolean>;
  
  /**
   * Delete a file
   */
  delete(filePath: string): Promise<Result<void>>;
  
  /**
   * List files in a directory
   */
  list(dirPath: string): Promise<Result<string[]>>;
  
  /**
   * Acquire a file lock
   */
  lock(filePath: string, timeout?: number): Promise<Result<FileLock>>;
}

export interface FileLock {
  release(): Promise<void>;
}

/**
 * File system storage implementation
 */
export class FileSystemStorage implements IFileSystemStorage {
  private locks: Map<string, Promise<void>> = new Map();

  constructor(private readonly baseDir: string) {}

  /**
   * Read a JSON file
   */
  async read<T>(filePath: string): Promise<Result<T>> {
    try {
      const fullPath = path.join(this.baseDir, filePath);
      const content = await fs.readFile(fullPath, 'utf-8');
      const data = JSON.parse(content) as T;
      return success(data);
    } catch (error) {
      if (error instanceof Error) {
        return failure(new Error(`Failed to read file ${filePath}: ${error.message}`));
      }
      return failure(new Error(`Failed to read file ${filePath}: Unknown error`));
    }
  }

  /**
   * Write a JSON file
   */
  async write<T>(filePath: string, data: T): Promise<Result<void>> {
    try {
      const fullPath = path.join(this.baseDir, filePath);
      const dir = path.dirname(fullPath);

      // Ensure directory exists
      await fs.mkdir(dir, { recursive: true });

      // Write atomically using temp file + rename
      const tempPath = `${fullPath}.tmp`;
      const content = JSON.stringify(data, null, 2);
      await fs.writeFile(tempPath, content, 'utf-8');
      await fs.rename(tempPath, fullPath);

      return success(undefined);
    } catch (error) {
      if (error instanceof Error) {
        return failure(new Error(`Failed to write file ${filePath}: ${error.message}`));
      }
      return failure(new Error(`Failed to write file ${filePath}: Unknown error`));
    }
  }

  /**
   * Check if a file exists
   */
  async exists(filePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(this.baseDir, filePath);
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Delete a file
   */
  async delete(filePath: string): Promise<Result<void>> {
    try {
      const fullPath = path.join(this.baseDir, filePath);
      await fs.unlink(fullPath);
      return success(undefined);
    } catch (error) {
      if (error instanceof Error) {
        return failure(new Error(`Failed to delete file ${filePath}: ${error.message}`));
      }
      return failure(new Error(`Failed to delete file ${filePath}: Unknown error`));
    }
  }

  /**
   * List files in a directory
   */
  async list(dirPath: string): Promise<Result<string[]>> {
    try {
      const fullPath = path.join(this.baseDir, dirPath);
      const entries = await fs.readdir(fullPath, { withFileTypes: true });
      const files = entries
        .filter((entry): entry is Dirent => entry.isFile())
        .map((entry): string => entry.name);
      return success(files);
    } catch (error) {
      if (error instanceof Error) {
        return failure(new Error(`Failed to list directory ${dirPath}: ${error.message}`));
      }
      return failure(new Error(`Failed to list directory ${dirPath}: Unknown error`));
    }
  }

  /**
   * Acquire a file lock
   */
  async lock(filePath: string, timeout: number = 5000): Promise<Result<FileLock>> {
    const lockKey = path.join(this.baseDir, filePath);

    // If lock exists, wait for it
    const existingLock = this.locks.get(lockKey);
    if (existingLock) {
      try {
        await Promise.race([
          existingLock,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Lock timeout')), timeout)
          )
        ]);
      } catch (error) {
        if (error instanceof Error) {
          return failure(error);
        }
        return failure(new Error('Unknown lock error'));
      }
    }

    // Create new lock
    let releaseLock: (() => void) | undefined;
    const lockPromise = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });

    this.locks.set(lockKey, lockPromise);

    const lock: FileLock = {
      release: async () => {
        if (releaseLock) {
          releaseLock();
          this.locks.delete(lockKey);
        }
      }
    };

    return success(lock);
  }
}
