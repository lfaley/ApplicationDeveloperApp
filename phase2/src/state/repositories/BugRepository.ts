/**
 * Bug Repository
 * High-level API for managing bug work items
 */

import { FileSystemStorage } from '../storage/FileSystemStorage';
import { Bug, BugStatus, BugPhase, CreateBugData, validateBug, generateBugId } from '../schemas/Bug';
import { Result, success, failure, BugId, FeatureId, Severity } from '../../types/common';

export interface BugFilter {
  status?: BugStatus | BugStatus[];
  phase?: BugPhase | BugPhase[];
  severity?: Severity | Severity[];
  priority?: string | string[];
  tags?: string | string[];
  featureId?: FeatureId;
  hasRootCause?: boolean;
  hasResolution?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  updatedAfter?: Date;
  updatedBefore?: Date;
  searchText?: string;
}

export interface BugSortOptions {
  field: 'createdAt' | 'updatedAt' | 'severity' | 'priority' | 'status' | 'title';
  direction: 'asc' | 'desc';
}

export interface BugPaginationOptions {
  page: number;
  pageSize: number;
}

export interface BugPaginatedResult {
  items: Bug[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Repository for Bug work items
 */
export class BugRepository {
  private storage: FileSystemStorage;
  private readonly BUGS_DIR = 'bugs';
  private cache: Map<BugId, Bug>;
  private cacheExpiry: Map<BugId, number>;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(baseDir: string) {
    this.storage = new FileSystemStorage(baseDir);
    this.cache = new Map();
    this.cacheExpiry = new Map();
  }

  /**
   * Create a new bug
   */
  async create(data: CreateBugData, createdBy: string): Promise<Result<Bug>> {
    try {
      // Generate ID
      const listResult = await this.storage.list(this.BUGS_DIR);
      const existingIds = listResult.success ? 
        listResult.data.map(f => f.replace('.json', '') as BugId) : [];
      const id = generateBugId(existingIds);

      // Create bug object
      const now = new Date().toISOString();
      const bug: Bug = {
        id,
        type: 'bug',
        title: data.title,
        description: data.description,
        createdAt: now,
        updatedAt: now,
        createdBy,
        status: 'open',
        currentPhase: 'triage',
        workflow: 'standard-bug',
        severity: data.severity,
        priority: data.priority,
        category: data.category,
        tags: data.tags || [],
        environment: data.environment,
        reproducibility: data.reproducibility,
        stepsToReproduce: data.stepsToReproduce,
        affectedFeatures: [],
        relatedBugs: [],
        progress: {
          phasesCompleted: [],
          checklistProgress: {
            total: 0,
            completed: 0,
            percentage: 0,
            items: []
          },
          qualityGateResults: []
        },
        artifacts: {
          commits: [],
          pullRequests: [],
          tests: [],
          logs: []
        },
        estimates: {},
        custom: data.custom || {}
      };

      const errors = validateBug(bug);
      if (errors.length > 0) {
        return failure(new Error(`Validation failed: ${errors.join(', ')}`));
      }

      const filePath = `${this.BUGS_DIR}/${bug.id}.json`;
      const saveResult = await this.storage.write(filePath, bug);

      if (!saveResult.success) {
        return failure(saveResult.error);
      }

      this.setCache(bug.id, bug);
      return success(bug);
    } catch (error) {
      return failure(error as Error);
    }
  }

  /**
   * Get a bug by ID
   */
  async getById(id: BugId): Promise<Result<Bug | null>> {
    try {
      // Check cache first
      const cached = this.getCache(id);
      if (cached) {
        return success(cached);
      }

      const filePath = `${this.BUGS_DIR}/${id}.json`;
      const readResult = await this.storage.read<Bug>(filePath);

      if (!readResult.success) {
        if (readResult.error.message.includes('ENOENT')) {
          return success(null);
        }
        return failure(readResult.error);
      }

      const bug = readResult.data;
      this.setCache(id, bug);
      return success(bug);
    } catch (error) {
      return failure(error as Error);
    }
  }

  /**
   * Update an existing bug
   */
  async update(id: BugId, updates: Partial<Omit<Bug, 'id' | 'createdAt' | 'type' | 'createdBy'>>): Promise<Result<Bug>> {
    try {
      const existingResult = await this.getById(id);
      if (!existingResult.success) {
        return failure(existingResult.error);
      }

      if (!existingResult.data) {
        return failure(new Error(`Bug ${id} not found`));
      }

      const updated: Bug = {
        ...existingResult.data,
        ...updates,
        id,
        type: 'bug',
        createdAt: existingResult.data.createdAt,
        createdBy: existingResult.data.createdBy,
        updatedAt: new Date().toISOString(),
      };

      const errors = validateBug(updated);
      if (errors.length > 0) {
        return failure(new Error(`Validation failed: ${errors.join(', ')}`));
      }

      const filePath = `${this.BUGS_DIR}/${id}.json`;
      const saveResult = await this.storage.write(filePath, updated);

      if (!saveResult.success) {
        return failure(saveResult.error);
      }

      this.setCache(id, updated);
      return success(updated);
    } catch (error) {
      return failure(error as Error);
    }
  }

  /**
   * Delete a bug
   */
  async delete(id: BugId): Promise<Result<void>> {
    try {
      const filePath = `${this.BUGS_DIR}/${id}.json`;
      const deleteResult = await this.storage.delete(filePath);

      if (!deleteResult.success) {
        return failure(deleteResult.error);
      }

      this.cache.delete(id);
      this.cacheExpiry.delete(id);
      return success(undefined);
    } catch (error) {
      return failure(error as Error);
    }
  }

  /**
   * List all bugs with optional filtering, sorting, and pagination
   */
  async list(
    filter?: BugFilter,
    sort?: BugSortOptions,
    pagination?: BugPaginationOptions
  ): Promise<Result<BugPaginatedResult>> {
    try {
      const listResult = await this.storage.list(this.BUGS_DIR);
      if (!listResult.success) {
        return failure(listResult.error);
      }

      // Read all bugs
      const bugs: Bug[] = [];
      for (const filename of listResult.data) {
        const id = filename.replace('.json', '') as BugId;
        const bugResult = await this.getById(id);
        if (bugResult.success && bugResult.data) {
          bugs.push(bugResult.data);
        }
      }

      // Apply filters
      let filtered = bugs;
      if (filter) {
        filtered = this.applyFilter(bugs, filter);
      }

      // Apply sorting
      if (sort) {
        filtered = this.applySort(filtered, sort);
      }

      // Apply pagination
      const total = filtered.length;
      let paginated = filtered;
      let page = 1;
      let pageSize = total;
      let totalPages = 1;

      if (pagination) {
        page = pagination.page;
        pageSize = pagination.pageSize;
        totalPages = Math.ceil(total / pageSize);
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        paginated = filtered.slice(start, end);
      }

      return success({
        items: paginated,
        total,
        page,
        pageSize,
        totalPages,
      });
    } catch (error) {
      return failure(error as Error);
    }
  }

  /**
   * Find bugs by feature ID
   */
  async findByFeature(featureId: FeatureId): Promise<Result<Bug[]>> {
    const listResult = await this.list({ featureId });
    if (!listResult.success) {
      return failure(listResult.error);
    }
    return success(listResult.data.items);
  }

  /**
   * Find bugs by status
   */
  async findByStatus(status: BugStatus | BugStatus[]): Promise<Result<Bug[]>> {
    const listResult = await this.list({ status });
    if (!listResult.success) {
      return failure(listResult.error);
    }
    return success(listResult.data.items);
  }

  /**
   * Find bugs by severity
   */
  async findBySeverity(severity: Severity | Severity[]): Promise<Result<Bug[]>> {
    const listResult = await this.list({ severity });
    if (!listResult.success) {
      return failure(listResult.error);
    }
    return success(listResult.data.items);
  }

  /**
   * Search bugs by text
   */
  async search(searchText: string): Promise<Result<Bug[]>> {
    const listResult = await this.list({ searchText });
    if (!listResult.success) {
      return failure(listResult.error);
    }
    return success(listResult.data.items);
  }

  /**
   * Update bug status
   */
  async updateStatus(id: BugId, status: BugStatus): Promise<Result<Bug>> {
    return this.update(id, { status });
  }

  /**
   * Update bug phase
   */
  async updatePhase(id: BugId, currentPhase: BugPhase): Promise<Result<Bug>> {
    return this.update(id, { currentPhase });
  }

  /**
   * Add tag to bug
   */
  async addTag(id: BugId, tag: string): Promise<Result<Bug>> {
    const bugResult = await this.getById(id);
    if (!bugResult.success || !bugResult.data) {
      return bugResult as Result<Bug>;
    }

    const tags = [...bugResult.data.tags, tag];
    return this.update(id, { tags });
  }

  /**
   * Remove tag from bug
   */
  async removeTag(id: BugId, tag: string): Promise<Result<Bug>> {
    const bugResult = await this.getById(id);
    if (!bugResult.success || !bugResult.data) {
      return bugResult as Result<Bug>;
    }

    const tags = bugResult.data.tags.filter((t) => t !== tag);
    return this.update(id, { tags });
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  // Private helper methods

  private setCache(id: BugId, bug: Bug): void {
    this.cache.set(id, bug);
    this.cacheExpiry.set(id, Date.now() + this.CACHE_TTL);
  }

  private getCache(id: BugId): Bug | null {
    const expiry = this.cacheExpiry.get(id);
    if (!expiry || Date.now() > expiry) {
      this.cache.delete(id);
      this.cacheExpiry.delete(id);
      return null;
    }
    return this.cache.get(id) || null;
  }

  private applyFilter(bugs: Bug[], filter: BugFilter): Bug[] {
    return bugs.filter((bug) => {
      // Status filter
      if (filter.status) {
        const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
        if (!statuses.includes(bug.status)) {
          return false;
        }
      }

      // Phase filter
      if (filter.phase) {
        const phases = Array.isArray(filter.phase) ? filter.phase : [filter.phase];
        if (!phases.includes(bug.currentPhase)) {
          return false;
        }
      }

      // Severity filter
      if (filter.severity) {
        const severities = Array.isArray(filter.severity) ? filter.severity : [filter.severity];
        if (!severities.includes(bug.severity)) {
          return false;
        }
      }

      // Priority filter
      if (filter.priority) {
        const priorities = Array.isArray(filter.priority) ? filter.priority : [filter.priority];
        if (!priorities.includes(bug.priority)) {
          return false;
        }
      }

      // Tags filter
      if (filter.tags) {
        const requiredTags = Array.isArray(filter.tags) ? filter.tags : [filter.tags];
        if (!requiredTags.every((tag) => bug.tags.includes(tag))) {
          return false;
        }
      }

      // Feature ID filter
      if (filter.featureId !== undefined) {
        if (!bug.affectedFeatures.includes(filter.featureId)) {
          return false;
        }
      }

      // Boolean filters
      if (filter.hasRootCause !== undefined) {
        const hasRootCause = bug.rootCause !== undefined;
        if (hasRootCause !== filter.hasRootCause) {
          return false;
        }
      }

      if (filter.hasResolution !== undefined) {
        const hasResolution = bug.resolution !== undefined;
        if (hasResolution !== filter.hasResolution) {
          return false;
        }
      }

      // Date range filters
      if (filter.createdAfter) {
        if (new Date(bug.createdAt) < filter.createdAfter) {
          return false;
        }
      }

      if (filter.createdBefore) {
        if (new Date(bug.createdAt) > filter.createdBefore) {
          return false;
        }
      }

      if (filter.updatedAfter) {
        if (new Date(bug.updatedAt) < filter.updatedAfter) {
          return false;
        }
      }

      if (filter.updatedBefore) {
        if (new Date(bug.updatedAt) > filter.updatedBefore) {
          return false;
        }
      }

      // Search text filter
      if (filter.searchText) {
        const searchLower = filter.searchText.toLowerCase();
        const searchable = [
          bug.title,
          bug.description,
          bug.stepsToReproduce || '',
          ...bug.tags,
        ].join(' ').toLowerCase();

        if (!searchable.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }

  private applySort(bugs: Bug[], sort: BugSortOptions): Bug[] {
    const sorted = [...bugs];
    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sort.field) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        case 'severity':
          // critical > high > medium > low
          const severityOrder: Record<Severity, number> = {
            'critical': 4,
            'high': 3,
            'medium': 2,
            'low': 1,
          };
          aValue = severityOrder[a.severity];
          bValue = severityOrder[b.severity];
          break;
        case 'priority':
          aValue = a.priority;
          bValue = b.priority;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sort.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sort.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }
}
