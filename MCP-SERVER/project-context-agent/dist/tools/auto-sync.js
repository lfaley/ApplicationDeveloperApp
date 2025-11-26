/**
 * MCP Tool: auto_sync
 * -------------------
 * Executes synchronization with user approval.
 */
import { SyncEngine } from '../sync-engine';
export async function autoSyncTool(params) {
    const engine = new SyncEngine(undefined, undefined); // Should be injected in real use
    let approved = true;
    if (params.requireApproval !== false) {
        approved = params.approvalCallback ? await params.approvalCallback(params.recommendations) : false;
    }
    if (!approved) {
        return {
            status: 'pending_approval',
            updatedFiles: [],
            errors: ['Sync not approved'],
        };
    }
    const result = await engine.sync({ driftItemIds: [], createBackup: true }); // Use correct method
    return {
        status: result.success ? 'completed' : 'failed',
        updatedFiles: result.filesModified,
        errors: result.errors,
    };
}
// End of auto_sync tool
//# sourceMappingURL=auto-sync.js.map