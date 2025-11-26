/**
 * MCP Tool: detect_drift
 * ---------------------
 * Scans workspace for drift between code and documentation.
 */
import { GitIntegration } from '../git-integration';
import { DriftDetector } from '../drift-detection';
export async function detectDriftTool(request) {
    const git = new GitIntegration(request.workspacePath);
    const detector = new DriftDetector(git);
    return await detector.detectDrift({
        includePatterns: request.includePatterns,
        excludePatterns: request.excludePatterns,
        severityThreshold: request.severityThreshold,
    });
}
// End of detect_drift tool
//# sourceMappingURL=detect-drift.js.map