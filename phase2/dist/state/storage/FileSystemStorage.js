"use strict";
/**
 * File system storage implementation
 * Provides low-level file operations for JSON data
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemStorage = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs/promises"));
const path = tslib_1.__importStar(require("path"));
const common_1 = require("../../types/common");
/**
 * File system storage implementation
 */
class FileSystemStorage {
    baseDir;
    locks = new Map();
    constructor(baseDir) {
        this.baseDir = baseDir;
    }
    /**
     * Read a JSON file
     */
    async read(filePath) {
        try {
            const fullPath = path.join(this.baseDir, filePath);
            const content = await fs.readFile(fullPath, 'utf-8');
            const data = JSON.parse(content);
            return (0, common_1.success)(data);
        }
        catch (error) {
            if (error instanceof Error) {
                return (0, common_1.failure)(new Error(`Failed to read file ${filePath}: ${error.message}`));
            }
            return (0, common_1.failure)(new Error(`Failed to read file ${filePath}: Unknown error`));
        }
    }
    /**
     * Write a JSON file
     */
    async write(filePath, data) {
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
            return (0, common_1.success)(undefined);
        }
        catch (error) {
            if (error instanceof Error) {
                return (0, common_1.failure)(new Error(`Failed to write file ${filePath}: ${error.message}`));
            }
            return (0, common_1.failure)(new Error(`Failed to write file ${filePath}: Unknown error`));
        }
    }
    /**
     * Check if a file exists
     */
    async exists(filePath) {
        try {
            const fullPath = path.join(this.baseDir, filePath);
            await fs.access(fullPath);
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Delete a file
     */
    async delete(filePath) {
        try {
            const fullPath = path.join(this.baseDir, filePath);
            await fs.unlink(fullPath);
            return (0, common_1.success)(undefined);
        }
        catch (error) {
            if (error instanceof Error) {
                return (0, common_1.failure)(new Error(`Failed to delete file ${filePath}: ${error.message}`));
            }
            return (0, common_1.failure)(new Error(`Failed to delete file ${filePath}: Unknown error`));
        }
    }
    /**
     * List files in a directory
     */
    async list(dirPath) {
        try {
            const fullPath = path.join(this.baseDir, dirPath);
            const entries = await fs.readdir(fullPath, { withFileTypes: true });
            const files = entries
                .filter((entry) => entry.isFile())
                .map((entry) => entry.name);
            return (0, common_1.success)(files);
        }
        catch (error) {
            if (error instanceof Error) {
                return (0, common_1.failure)(new Error(`Failed to list directory ${dirPath}: ${error.message}`));
            }
            return (0, common_1.failure)(new Error(`Failed to list directory ${dirPath}: Unknown error`));
        }
    }
    /**
     * Acquire a file lock
     */
    async lock(filePath, timeout = 5000) {
        const lockKey = path.join(this.baseDir, filePath);
        // If lock exists, wait for it
        const existingLock = this.locks.get(lockKey);
        if (existingLock) {
            try {
                await Promise.race([
                    existingLock,
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Lock timeout')), timeout))
                ]);
            }
            catch (error) {
                if (error instanceof Error) {
                    return (0, common_1.failure)(error);
                }
                return (0, common_1.failure)(new Error('Unknown lock error'));
            }
        }
        // Create new lock
        let releaseLock;
        const lockPromise = new Promise((resolve) => {
            releaseLock = resolve;
        });
        this.locks.set(lockKey, lockPromise);
        const lock = {
            release: async () => {
                if (releaseLock) {
                    releaseLock();
                    this.locks.delete(lockKey);
                }
            }
        };
        return (0, common_1.success)(lock);
    }
}
exports.FileSystemStorage = FileSystemStorage;
//# sourceMappingURL=FileSystemStorage.js.map