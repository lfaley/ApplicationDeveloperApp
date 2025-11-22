/**
 * Feature Repository
 * High-level API for managing feature work items
 */

import { FileSystemStorage } from '../storage/FileSystemStorage';
import { Feature, FeatureStatus, CreateFeatureData, validateFeature, generateFeatureId } from '../schemas/Feature';
import { Result, success, failure, FeatureId } from '../../types/common';

export interface FeatureFilter {
  status?: FeatureStatus | FeatureStatus[];
  priority?: string | string[];
  assignee?: string | string[];
  tags?: string | string[];
  parentId?: FeatureId;
  hasParent?: boolean;
  hasChildren?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  updatedAfter?: Date;
  updatedBefore?: Date;
  searchText?: string;
}

export interface FeatureSortOptions {
  field: 'createdAt' | 'updatedAt' | 'priority' | 'status' | 'title';
  direction: 'asc' | 'desc';
}

export interface FeaturePaginationOptions {
  page: number;
  pageSize: number;
}

export interface FeaturePaginatedResult {
  items: Feature[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Repository for Feature work items
 */
export class FeatureRepository {
  private storage: FileSystemStorage;
  private readonly FEATURES_DIR = 'features';
  private cache: Map<FeatureId, Feature>;
  private cacheExpiry: Map<FeatureId, number>;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(baseDir: string) {
    this.storage = new FileSystemStorage(baseDir);
    this.cache = new Map();
    this.cacheExpiry = new Map();
  }

  /**
   * Create a new feature
   */
  async create(data: CreateFeatureData, createdBy: string): Promise<Result<Feature>> {
    try {
      // Generate ID
      const listResult = await this.storage.list(this.FEATURES_DIR);
      const existingIds = listResult.success ? 
        listResult.data.map(f => f.replace('.json', '') as FeatureId) : [];
      const id = generateFeatureId(existingIds);

      // Create feature object
      const now = new Date().toISOString();
      const feature: Feature = {
        id,
        type: 'feature',
        title: data.title,
        description: data.description,
        createdAt: now,
        updatedAt: now,
        createdBy,
        status: 'draft',
        currentPhase: 'planning',
        workflow: 'standard-feature',
        priority: data.priority,
        complexity: data.complexity,
        category: data.category,
        tags: data.tags || [],
        parentId: data.parentId,
        dependencies: [],
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
        compliance: {
          score: 0,
          lastChecked: now,
          violations: []
        },
        artifacts: {
          commits: [],
          pullRequests: [],
          documentation: [],
          tests: []
        },
        estimates: {},
        custom: data.custom || {}
      };

      const errors = validateFeature(feature);
      if (errors.length > 0) {
        return failure(new Error(`Validation failed: ${errors.join(', ')}`));
      }

      const filePath = `${this.FEATURES_DIR}/${feature.id}.json`;
      const saveResult = await this.storage.write(filePath, feature);

      if (!saveResult.success) {
        return failure(saveResult.error);
      }

      this.setCache(feature.id, feature);
      return success(feature);
    } catch (error) {
      return failure(error as Error);
    }
  }

  /**
   * Get a feature by ID
   */
  async getById(id: FeatureId): Promise<Result<Feature | null>> {
    try {
      // Check cache first
      const cached = this.getCache(id);
      if (cached) {
        return success(cached);
      }

      const filePath = `${this.FEATURES_DIR}/${id}.json`;
      const readResult = await this.storage.read<Feature>(filePath);

      if (!readResult.success) {
        if (readResult.error.message.includes('ENOENT')) {
          return success(null);
        }
        return failure(readResult.error);
      }

      const feature = readResult.data;
      this.setCache(id, feature);
      return success(feature);
    } catch (error) {
      return failure(error as Error);
    }
  }

  /**
   * Update an existing feature
   */
  async update(id: FeatureId, updates: Partial<Omit<Feature, 'id' | 'createdAt' | 'type' | 'createdBy'>>): Promise<Result<Feature>> {
    try {
      const existingResult = await this.getById(id);
      if (!existingResult.success) {
        return failure(existingResult.error);
      }

      if (!existingResult.data) {
        return failure(new Error(`Feature ${id} not found`));
      }

      const updated: Feature = {
        ...existingResult.data,
        ...updates,
        id,
        type: 'feature',
        createdAt: existingResult.data.createdAt,
        createdBy: existingResult.data.createdBy,
        updatedAt: new Date().toISOString(),
      };

      const errors = validateFeature(updated);
      if (errors.length > 0) {
        return failure(new Error(`Validation failed: ${errors.join(', ')}`));
      }

      const filePath = `${this.FEATURES_DIR}/${id}.json`;
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
   * Delete a feature
   */
  async delete(id: FeatureId): Promise<Result<void>> {
    try {
      const filePath = `${this.FEATURES_DIR}/${id}.json`;
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
   * List all features with optional filtering, sorting, and pagination
   */
  async list(
    filter?: FeatureFilter,
    sort?: FeatureSortOptions,
    pagination?: FeaturePaginationOptions
  ): Promise<Result<FeaturePaginatedResult>> {
    try {
      const listResult = await this.storage.list(this.FEATURES_DIR);
      if (!listResult.success) {
        return failure(listResult.error);
      }

      // Read all features
      const features: Feature[] = [];
      for (const filename of listResult.data) {
        const id = filename.replace('.json', '') as FeatureId;
        const featureResult = await this.getById(id);
        if (featureResult.success && featureResult.data) {
          features.push(featureResult.data);
        }
      }

      // Apply filters
      let filtered = features;
      if (filter) {
        filtered = this.applyFilter(features, filter);
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
   * Find features by parent ID
   */
  async findByParent(parentId: FeatureId): Promise<Result<Feature[]>> {
    const listResult = await this.list({ parentId });
    if (!listResult.success) {
      return failure(listResult.error);
    }
    return success(listResult.data.items);
  }

  /**
   * Find features by status
   */
  async findByStatus(status: FeatureStatus | FeatureStatus[]): Promise<Result<Feature[]>> {
    const listResult = await this.list({ status });
    if (!listResult.success) {
      return failure(listResult.error);
    }
    return success(listResult.data.items);
  }

  /**
   * Search features by text
   */
  async search(searchText: string): Promise<Result<Feature[]>> {
    const listResult = await this.list({ searchText });
    if (!listResult.success) {
      return failure(listResult.error);
    }
    return success(listResult.data.items);
  }

  /**
   * Update feature status
   */
  async updateStatus(id: FeatureId, status: FeatureStatus): Promise<Result<Feature>> {
    return this.update(id, { status });
  }

  // Note: Feature schema doesn't have assignee field
  // Use custom fields if assignment tracking is needed

  /**
   * Add tag to feature
   */
  async addTag(id: FeatureId, tag: string): Promise<Result<Feature>> {
    const featureResult = await this.getById(id);
    if (!featureResult.success || !featureResult.data) {
      return featureResult as Result<Feature>;
    }

    const tags = [...featureResult.data.tags, tag];
    return this.update(id, { tags });
  }

  /**
   * Remove tag from feature
   */
  async removeTag(id: FeatureId, tag: string): Promise<Result<Feature>> {
    const featureResult = await this.getById(id);
    if (!featureResult.success || !featureResult.data) {
      return featureResult as Result<Feature>;
    }

    const tags = featureResult.data.tags.filter((t) => t !== tag);
    return this.update(id, { tags });
  }

  /**
   * Get feature hierarchy (parent and children)
   */
  async getHierarchy(id: FeatureId): Promise<Result<{
    feature: Feature;
    parent?: Feature;
    children: Feature[];
  }>> {
    try {
      const featureResult = await this.getById(id);
      if (!featureResult.success || !featureResult.data) {
        return failure(new Error(`Feature ${id} not found`));
      }

      const feature = featureResult.data;
      let parent: Feature | undefined;
      const children: Feature[] = [];

      // Get parent
      if (feature.parentId) {
        const parentResult = await this.getById(feature.parentId);
        if (parentResult.success && parentResult.data) {
          parent = parentResult.data;
        }
      }

      // Get children
      const childrenResult = await this.findByParent(id);
      if (childrenResult.success) {
        children.push(...childrenResult.data);
      }

      return success({ feature, parent, children });
    } catch (error) {
      return failure(error as Error);
    }
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  // Private helper methods

  private setCache(id: FeatureId, feature: Feature): void {
    this.cache.set(id, feature);
    this.cacheExpiry.set(id, Date.now() + this.CACHE_TTL);
  }

  private getCache(id: FeatureId): Feature | null {
    const expiry = this.cacheExpiry.get(id);
    if (!expiry || Date.now() > expiry) {
      this.cache.delete(id);
      this.cacheExpiry.delete(id);
      return null;
    }
    return this.cache.get(id) || null;
  }

  private applyFilter(features: Feature[], filter: FeatureFilter): Feature[] {
    return features.filter((feature) => {
      // Status filter
      if (filter.status) {
        const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
        if (!statuses.includes(feature.status)) {
          return false;
        }
      }

      // Priority filter
      if (filter.priority) {
        const priorities = Array.isArray(filter.priority) ? filter.priority : [filter.priority];
        if (!priorities.includes(feature.priority)) {
          return false;
        }
      }

      // Assignee filter (Note: Feature schema doesn't have assignee)
      // This filter is not supported for features

      // Tags filter (feature must have ALL specified tags)
      if (filter.tags) {
        const requiredTags = Array.isArray(filter.tags) ? filter.tags : [filter.tags];
        if (!requiredTags.every((tag) => feature.tags.includes(tag))) {
          return false;
        }
      }

      // Parent ID filter
      if (filter.parentId !== undefined) {
        if (feature.parentId !== filter.parentId) {
          return false;
        }
      }

      // Has parent filter
      if (filter.hasParent !== undefined) {
        const hasParent = feature.parentId !== undefined;
        if (hasParent !== filter.hasParent) {
          return false;
        }
      }

      // Date range filters
      if (filter.createdAfter) {
        if (new Date(feature.createdAt) < filter.createdAfter) {
          return false;
        }
      }

      if (filter.createdBefore) {
        if (new Date(feature.createdAt) > filter.createdBefore) {
          return false;
        }
      }

      if (filter.updatedAfter) {
        if (new Date(feature.updatedAt) < filter.updatedAfter) {
          return false;
        }
      }

      if (filter.updatedBefore) {
        if (new Date(feature.updatedAt) > filter.updatedBefore) {
          return false;
        }
      }

      // Search text filter
      if (filter.searchText) {
        const searchLower = filter.searchText.toLowerCase();
        const searchable = [
          feature.title,
          feature.description,
          ...feature.tags,
        ].join(' ').toLowerCase();

        if (!searchable.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }

  private applySort(features: Feature[], sort: FeatureSortOptions): Feature[] {
    const sorted = [...features];
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
