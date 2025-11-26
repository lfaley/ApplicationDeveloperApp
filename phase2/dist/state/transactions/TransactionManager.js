"use strict";
/**
 * Transaction Manager
 * Provides atomic operations for state changes
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchOperations = exports.TransactionManager = void 0;
const common_1 = require("../../types/common");
const FileSystemStorage_1 = require("../storage/FileSystemStorage");
/**
 * Transaction Manager - ensures atomic state changes
 */
class TransactionManager {
    storage;
    currentTransaction = null;
    transactionCounter = 0;
    constructor(baseDir) {
        this.storage = new FileSystemStorage_1.FileSystemStorage(baseDir);
    }
    /**
     * Begin a new transaction
     */
    begin() {
        if (this.currentTransaction) {
            return (0, common_1.failure)(new Error('Transaction already in progress'));
        }
        const transactionId = `TXN-${Date.now()}-${++this.transactionCounter}`;
        this.currentTransaction = {
            id: transactionId,
            operations: [],
            startedAt: new Date().toISOString(),
            status: 'pending',
        };
        return (0, common_1.success)(transactionId);
    }
    /**
     * Add a create operation to the transaction
     */
    async create(path, data) {
        if (!this.currentTransaction) {
            return (0, common_1.failure)(new Error('No transaction in progress'));
        }
        // Check if file already exists
        const exists = await this.storage.exists(path);
        if (exists) {
            return (0, common_1.failure)(new Error(`File already exists: ${path}`));
        }
        this.currentTransaction.operations.push({
            type: 'create',
            path,
            data,
        });
        return (0, common_1.success)(undefined);
    }
    /**
     * Add an update operation to the transaction
     */
    async update(path, data) {
        if (!this.currentTransaction) {
            return (0, common_1.failure)(new Error('No transaction in progress'));
        }
        // Read current data for backup
        const readResult = await this.storage.read(path);
        if (!readResult.success) {
            return (0, common_1.failure)(new Error(`Cannot update non-existent file: ${path}`));
        }
        this.currentTransaction.operations.push({
            type: 'update',
            path,
            data,
            backup: readResult.data,
        });
        return (0, common_1.success)(undefined);
    }
    /**
     * Add a delete operation to the transaction
     */
    async delete(path) {
        if (!this.currentTransaction) {
            return (0, common_1.failure)(new Error('No transaction in progress'));
        }
        // Read current data for backup
        const readResult = await this.storage.read(path);
        if (!readResult.success) {
            return (0, common_1.failure)(new Error(`Cannot delete non-existent file: ${path}`));
        }
        this.currentTransaction.operations.push({
            type: 'delete',
            path,
            backup: readResult.data,
        });
        return (0, common_1.success)(undefined);
    }
    /**
     * Commit the transaction - apply all operations
     */
    async commit() {
        if (!this.currentTransaction) {
            return (0, common_1.failure)(new Error('No transaction in progress'));
        }
        const transaction = this.currentTransaction;
        const appliedOperations = [];
        try {
            // Apply all operations
            for (const operation of transaction.operations) {
                switch (operation.type) {
                    case 'create':
                        const createResult = await this.storage.write(operation.path, operation.data);
                        if (!createResult.success) {
                            throw new Error(`Create failed for ${operation.path}: ${createResult.error.message}`);
                        }
                        break;
                    case 'update':
                        const updateResult = await this.storage.write(operation.path, operation.data);
                        if (!updateResult.success) {
                            throw new Error(`Update failed for ${operation.path}: ${updateResult.error.message}`);
                        }
                        break;
                    case 'delete':
                        const deleteResult = await this.storage.delete(operation.path);
                        if (!deleteResult.success) {
                            throw new Error(`Delete failed for ${operation.path}: ${deleteResult.error.message}`);
                        }
                        break;
                }
                appliedOperations.push(operation);
            }
            // Success - mark transaction as committed
            transaction.status = 'committed';
            transaction.committedAt = new Date().toISOString();
            this.currentTransaction = null;
            return (0, common_1.success)(undefined);
        }
        catch (error) {
            // Failure - rollback applied operations
            transaction.status = 'failed';
            await this.rollbackOperations(appliedOperations);
            this.currentTransaction = null;
            return (0, common_1.failure)(error);
        }
    }
    /**
     * Rollback the transaction - discard all operations
     */
    async rollback() {
        if (!this.currentTransaction) {
            return (0, common_1.failure)(new Error('No transaction in progress'));
        }
        const transaction = this.currentTransaction;
        transaction.status = 'rolled-back';
        transaction.rolledBackAt = new Date().toISOString();
        this.currentTransaction = null;
        return (0, common_1.success)(undefined);
    }
    /**
     * Check if a transaction is in progress
     */
    isActive() {
        return this.currentTransaction !== null;
    }
    /**
     * Get current transaction info
     */
    getCurrentTransaction() {
        return this.currentTransaction;
    }
    /**
     * Execute a function within a transaction
     * Automatically commits on success, rolls back on error
     */
    async execute(fn) {
        const beginResult = this.begin();
        if (!beginResult.success) {
            return (0, common_1.failure)(beginResult.error);
        }
        try {
            const result = await fn(this);
            const commitResult = await this.commit();
            if (!commitResult.success) {
                return (0, common_1.failure)(commitResult.error);
            }
            return (0, common_1.success)(result);
        }
        catch (error) {
            await this.rollback();
            return (0, common_1.failure)(error);
        }
    }
    // Private helper methods
    /**
     * Rollback applied operations in reverse order
     */
    async rollbackOperations(operations) {
        // Reverse the operations to undo them in correct order
        const reversed = [...operations].reverse();
        for (const operation of reversed) {
            try {
                switch (operation.type) {
                    case 'create':
                        // Remove created file
                        await this.storage.delete(operation.path);
                        break;
                    case 'update':
                        // Restore backup
                        await this.storage.write(operation.path, operation.backup);
                        break;
                    case 'delete':
                        // Restore deleted file
                        await this.storage.write(operation.path, operation.backup);
                        break;
                }
            }
            catch (error) {
                // Log error but continue rollback
                console.error(`Rollback failed for operation on ${operation.path}:`, error);
            }
        }
    }
}
exports.TransactionManager = TransactionManager;
/**
 * Batch operation helper
 * Executes multiple operations atomically
 */
class BatchOperations {
    txnManager;
    constructor(baseDir) {
        this.txnManager = new TransactionManager(baseDir);
    }
    /**
     * Create multiple items atomically
     */
    async createMany(items) {
        return this.txnManager.execute(async (txn) => {
            for (const item of items) {
                const result = await txn.create(item.path, item.data);
                if (!result.success) {
                    throw result.error;
                }
            }
        });
    }
    /**
     * Update multiple items atomically
     */
    async updateMany(items) {
        return this.txnManager.execute(async (txn) => {
            for (const item of items) {
                const result = await txn.update(item.path, item.data);
                if (!result.success) {
                    throw result.error;
                }
            }
        });
    }
    /**
     * Delete multiple items atomically
     */
    async deleteMany(paths) {
        return this.txnManager.execute(async (txn) => {
            for (const path of paths) {
                const result = await txn.delete(path);
                if (!result.success) {
                    throw result.error;
                }
            }
        });
    }
    /**
     * Move an item (delete from source, create at destination)
     */
    async move(sourcePath, destPath) {
        return this.txnManager.execute(async (txn) => {
            // Read source data
            const readResult = await txn['storage'].read(sourcePath);
            if (!readResult.success) {
                throw new Error(`Cannot read source: ${sourcePath}`);
            }
            // Delete source and create destination
            const deleteResult = await txn.delete(sourcePath);
            if (!deleteResult.success) {
                throw deleteResult.error;
            }
            const createResult = await txn.create(destPath, readResult.data);
            if (!createResult.success) {
                throw createResult.error;
            }
        });
    }
}
exports.BatchOperations = BatchOperations;
//# sourceMappingURL=TransactionManager.js.map