/**
 * MCP Tool: health_check
 * ---------------------
 * Gets overall project context health score.
 */
import { GitIntegration } from '../git-integration';
import { DriftDetector } from '../drift-detection';
import { HealthChecker } from '../health-check';
export async function healthCheckTool(params) {
    const git = new GitIntegration(params.workspacePath);
    const detector = new DriftDetector(git);
    const checker = new HealthChecker(git, detector);
    return await checker.calculateHealth();
}
// End of health_check tool
//# sourceMappingURL=health-check.js.map