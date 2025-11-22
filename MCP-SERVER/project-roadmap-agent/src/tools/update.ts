/**
 * Update Roadmap Tool - Update feature progress and status
 */

import { RoadmapUpdate } from '../types';

export async function updateRoadmap(
  roadmapContent: string,
  updates: RoadmapUpdate[]
): Promise<string> {
  let updatedContent = roadmapContent;

  for (const update of updates) {
    updatedContent = applyUpdate(updatedContent, update);
  }

  return updatedContent;
}

/**
 * Apply a single update to roadmap content
 */
function applyUpdate(content: string, update: RoadmapUpdate): string {
  const featureRegex = new RegExp(
    `(###\\s+[^\\n]*\\[#${escapeRegex(update.featureId)}\\][^\\n]*\\n[\\s\\S]*?)(?=###|$)`,
    'g'
  );

  return content.replace(featureRegex, (match) => {
    let updated = match;

    // Update status
    if (update.updates.status) {
      updated = updateField(updated, 'Status', update.updates.status);
    }

    // Update progress
    if (update.updates.progress !== undefined) {
      updated = updateField(updated, 'Progress', `${update.updates.progress}%`);
    }

    // Update assignee
    if (update.updates.assignee) {
      updated = updateField(updated, 'Assignee', update.updates.assignee);
    }

    // Update completed date
    if (update.updates.completedDate) {
      updated = updateField(updated, 'Completed Date', update.updates.completedDate);
    }

    return updated;
  });
}

/**
 * Update a specific field in feature block
 */
function updateField(featureBlock: string, fieldName: string, value: string): string {
  const fieldRegex = new RegExp(`(\\*\\*${fieldName}[:\\s]+)([^\\*\\n]+)`, 'i');
  
  if (fieldRegex.test(featureBlock)) {
    // Update existing field
    return featureBlock.replace(fieldRegex, `$1${value}`);
  } else {
    // Add new field after description
    const lines = featureBlock.split('\n');
    let insertIndex = 1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('**')) {
        insertIndex = i;
        break;
      }
    }

    lines.splice(insertIndex, 0, `**${fieldName}:** ${value}`);
    return lines.join('\n');
  }
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Bulk update features by status
 */
export async function bulkUpdateByStatus(
  roadmapContent: string,
  fromStatus: string,
  toStatus: string
): Promise<string> {
  const statusRegex = new RegExp(
    `(\\*\\*Status[:\\s]+)${escapeRegex(fromStatus)}`,
    'gi'
  );

  return roadmapContent.replace(statusRegex, `$1${toStatus}`);
}

/**
 * Update sprint assignment
 */
export async function updateSprintAssignment(
  roadmapContent: string,
  featureId: string,
  sprintName: string
): Promise<string> {
  const update: RoadmapUpdate = {
    featureId,
    updates: {},
  };

  const featureRegex = new RegExp(
    `(###\\s+[^\\n]*\\[#${escapeRegex(featureId)}\\][^\\n]*\\n[\\s\\S]*?)(?=###|$)`,
    'g'
  );

  return roadmapContent.replace(featureRegex, (match) => {
    return updateField(match, 'Sprint', sprintName);
  });
}
