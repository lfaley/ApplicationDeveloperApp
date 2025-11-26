import { SyncRecommendation } from '../types';
export declare function autoSyncTool(params: {
    recommendations: SyncRecommendation[];
    requireApproval?: boolean;
    approvalCallback?: (items: SyncRecommendation[]) => Promise<boolean>;
}): Promise<{
    status: string;
    updatedFiles: string[];
    errors?: string[];
}>;
//# sourceMappingURL=auto-sync.d.ts.map