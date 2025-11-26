/**
 * Transaction Manager
 * Provides atomic operations for state changes
 */
import { Result } from '../../types/common';
export type TransactionOperation = {
    type: 'create';
    path: string;
    data: any;
} | {
    type: 'update';
    path: string;
    data: any;
    backup: any;
} | {
    type: 'delete';
    path: string;
    backup: any;
};
export interface Transaction {
    id: string;
    operations: TransactionOperation[];
    startedAt: string;
    committedAt?: string;
    rolledBackAt?: string;
    status: 'pending' | 'committed' | 'rolled-back' | 'failed';
}
/**
 * Transaction Manager - ensures atomic state changes
 */
export declare class TransactionManager {
    private storage;
    private currentTransaction;
    private transactionCounter;
    constructor(baseDir: string);
    /**
     * Begin a new transaction
     */
    begin(): Result<string>;
    /**
     * Add a create operation to the transaction
     */
    create(path: string, data: any): Promise<Result<void>>;
    /**
     * Add an update operation to the transaction
     */
    update(path: string, data: any): Promise<Result<void>>;
    /**
     * Add a delete operation to the transaction
     */
    delete(path: string): Promise<Result<void>>;
    /**
     * Commit the transaction - apply all operations
     */
    commit(): Promise<Result<void>>;
    /**
     * Rollback the transaction - discard all operations
     */
    rollback(): Promise<Result<void>>;
    /**
     * Check if a transaction is in progress
     */
    isActive(): boolean;
    /**
     * Get current transaction info
     */
    getCurrentTransaction(): Transaction | null;
    /**
     * Execute a function within a transaction
     * Automatically commits on success, rolls back on error
     */
    execute<T>(fn: (txn: TransactionManager) => Promise<T>): Promise<Result<T>>;
    /**
     * Rollback applied operations in reverse order
     */
    private rollbackOperations;
}
/**
 * Batch operation helper
 * Executes multiple operations atomically
 */
export declare class BatchOperations {
    private txnManager;
    constructor(baseDir: string);
    /**
     * Create multiple items atomically
     */
    createMany(items: Array<{
        path: string;
        data: any;
    }>): Promise<Result<void>>;
    /**
     * Update multiple items atomically
     */
    updateMany(items: Array<{
        path: string;
        data: any;
    }>): Promise<Result<void>>;
    /**
     * Delete multiple items atomically
     */
    deleteMany(paths: string[]): Promise<Result<void>>;
    /**
     * Move an item (delete from source, create at destination)
     */
    move(sourcePath: string, destPath: string): Promise<Result<void>>;
}
//# sourceMappingURL=TransactionManager.d.ts.map