/**
 * File system storage implementation
 * Provides low-level file operations for JSON data
 */
import { Result } from '../../types/common';
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
export declare class FileSystemStorage implements IFileSystemStorage {
    private readonly baseDir;
    private locks;
    constructor(baseDir: string);
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
//# sourceMappingURL=FileSystemStorage.d.ts.map