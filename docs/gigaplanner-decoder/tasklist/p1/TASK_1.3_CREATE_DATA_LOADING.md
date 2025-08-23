# Task 1.3: Create Data Loading Infrastructure

## 📋 Task Overview

Create a comprehensive data loading system that handles all JSON data files with caching, error handling, and validation.

## 🎯 Objectives

- [ ] Create robust data loader class
- [ ] Implement caching mechanism
- [ ] Add error handling and validation
- [ ] Create data validation utilities
- [ ] Add performance optimizations
- [ ] Create comprehensive tests

## 📁 Files to Create/Modify

### 1. Enhanced Data Loader
**File:** `src/features/gigaplanner/adapters/dataLoader.ts`

```typescript
import type {
  GigaPlannerData,
  GigaPlannerRace,
  GigaPlannerStandingStone,
  GigaPlannerBlessing,
  GigaPlannerGameMechanics,
  GigaPlannerPreset,
  GigaPlannerPerkList,
  ValidationResult,
} from '../types';
import { GigaPlannerError, ERROR_CODES } from '../types/errors';
import { validateData } from '../utils/validation';

export class GigaPlannerDataLoader {
  private cache: Map<string, any> = new Map();
  private loadingPromises: Map<string, Promise<any>> = new Map();
  private validationResults: Map<string, ValidationResult> = new Map();

  /**
   * Load all GigaPlanner data
   */
  async loadAllData(): Promise<GigaPlannerData> {
    try {
      const [races, standingStones, blessings, gameMechanics, presets, perks] = await Promise.all([
        this.loadRaces(),
        this.loadStandingStones(),
        this.loadBlessings(),
        this.loadGameMechanics(),
        this.loadPresets(),
        this.loadPerks(),
      ]);

      const data: GigaPlannerData = {
        races,
        standingStones,
        blessings,
        gameMechanics,
        presets,
        perks,
      };

      // Validate complete dataset
      const validation = await this.validateCompleteDataset(data);
      if (!validation.isValid) {
        throw new GigaPlannerError(
          'Data validation failed',
          ERROR_CODES.VALIDATION_FAILED,
          { validation }
        );
      }

      return data;
    } catch (error) {
      throw new GigaPlannerError(
        'Failed to load all data',
        ERROR_CODES.DATA_LOAD_FAILED,
        { originalError: error }
      );
    }
  }

  /**
   * Load races data with caching
   */
  async loadRaces(): Promise<GigaPlannerRace[]> {
    return this.loadDataWithCache('races', '../data/races.json');
  }

  /**
   * Load standing stones data with caching
   */
  async loadStandingStones(): Promise<GigaPlannerStandingStone[]> {
    return this.loadDataWithCache('standingStones', '../data/standingStones.json');
  }

  /**
   * Load blessings data with caching
   */
  async loadBlessings(): Promise<GigaPlannerBlessing[]> {
    return this.loadDataWithCache('blessings', '../data/blessings.json');
  }

  /**
   * Load game mechanics data with caching
   */
  async loadGameMechanics(): Promise<GigaPlannerGameMechanics[]> {
    return this.loadDataWithCache('gameMechanics', '../data/gameMechanics.json');
  }

  /**
   * Load presets data with caching
   */
  async loadPresets(): Promise<GigaPlannerPreset[]> {
    return this.loadDataWithCache('presets', '../data/presets.json');
  }

  /**
   * Load perks data with caching
   */
  async loadPerks(): Promise<GigaPlannerPerkList[]> {
    return this.loadDataWithCache('perks', '../data/perks.json', (data) => data.perkLists);
  }

  /**
   * Generic data loading with caching and deduplication
   */
  private async loadDataWithCache<T>(
    cacheKey: string,
    importPath: string,
    dataExtractor?: (data: any) => T
  ): Promise<T> {
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Check if already loading
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey);
    }

    // Start loading
    const loadPromise = this.performDataLoad<T>(cacheKey, importPath, dataExtractor);
    this.loadingPromises.set(cacheKey, loadPromise);

    try {
      const data = await loadPromise;
      this.cache.set(cacheKey, data);
      this.loadingPromises.delete(cacheKey);
      return data;
    } catch (error) {
      this.loadingPromises.delete(cacheKey);
      throw error;
    }
  }

  /**
   * Perform actual data loading
   */
  private async performDataLoad<T>(
    cacheKey: string,
    importPath: string,
    dataExtractor?: (data: any) => T
  ): Promise<T> {
    try {
      const module = await import(importPath);
      const rawData = module.default;
      
      // Extract data if needed
      const data = dataExtractor ? dataExtractor(rawData) : rawData;

      // Validate data
      const validation = await this.validateData(cacheKey, data);
      this.validationResults.set(cacheKey, validation);

      if (!validation.isValid) {
        throw new GigaPlannerError(
          `Data validation failed for ${cacheKey}`,
          ERROR_CODES.VALIDATION_FAILED,
          { validation, dataType: cacheKey }
        );
      }

      return data;
    } catch (error) {
      if (error instanceof GigaPlannerError) {
        throw error;
      }
      
      throw new GigaPlannerError(
        `Failed to load ${cacheKey} data`,
        ERROR_CODES.DATA_LOAD_FAILED,
        { originalError: error, dataType: cacheKey }
      );
    }
  }

  /**
   * Validate individual data type
   */
  private async validateData(cacheKey: string, data: any): Promise<ValidationResult> {
    return validateData(cacheKey, data);
  }

  /**
   * Validate complete dataset
   */
  private async validateCompleteDataset(data: GigaPlannerData): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for required data types
    if (!data.races || data.races.length === 0) {
      errors.push('No races data loaded');
    }
    if (!data.standingStones || data.standingStones.length === 0) {
      errors.push('No standing stones data loaded');
    }
    if (!data.blessings || data.blessings.length === 0) {
      errors.push('No blessings data loaded');
    }
    if (!data.gameMechanics || data.gameMechanics.length === 0) {
      errors.push('No game mechanics data loaded');
    }
    if (!data.presets || data.presets.length === 0) {
      errors.push('No presets data loaded');
    }
    if (!data.perks || data.perks.length === 0) {
      errors.push('No perks data loaded');
    }

    // Check for data consistency
    if (data.perks && data.presets) {
      const perkListIds = new Set(data.perks.map(p => p.id));
      const invalidPresets = data.presets.filter(p => !perkListIds.has(p.perkListId));
      
      if (invalidPresets.length > 0) {
        warnings.push(`Found ${invalidPresets.length} presets with invalid perk list references`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get cached data
   */
  getCachedData<T>(cacheKey: string): T | undefined {
    return this.cache.get(cacheKey);
  }

  /**
   * Get validation results
   */
  getValidationResult(cacheKey: string): ValidationResult | undefined {
    return this.validationResults.get(cacheKey);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.validationResults.clear();
  }

  /**
   * Check if data is loaded
   */
  isDataLoaded(cacheKey: string): boolean {
    return this.cache.has(cacheKey);
  }

  /**
   * Get loading status
   */
  isLoading(cacheKey: string): boolean {
    return this.loadingPromises.has(cacheKey);
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): Record<string, any> {
    return {
      cachedItems: Array.from(this.cache.keys()),
      loadingItems: Array.from(this.loadingPromises.keys()),
      validationResults: Array.from(this.validationResults.keys()),
      cacheSize: this.cache.size,
    };
  }
}
```

### 2. Data Validation Utilities
**File:** `src/features/gigaplanner/utils/validation.ts`

```typescript
import type { ValidationResult, ValidationSchema } from '../types';

// Validation schemas for different data types
const VALIDATION_SCHEMAS: Record<string, ValidationSchema> = {
  races: {
    required: ['id', 'name', 'edid', 'startingHMS', 'startingSkills'],
    optional: ['description', 'bonus'],
    types: {
      id: 'string',
      name: 'string',
      edid: 'string',
      startingHMS: 'array',
      startingSkills: 'array',
    },
    constraints: {
      startingHMS: { length: 3, type: 'number' },
      startingSkills: { minLength: 18, type: 'number' },
    },
  },
  standingStones: {
    required: ['id', 'name', 'edid', 'description', 'effects'],
    optional: [],
    types: {
      id: 'string',
      name: 'string',
      edid: 'string',
      description: 'string',
      effects: 'string',
    },
  },
  blessings: {
    required: ['id', 'name', 'edid', 'description', 'effects', 'source'],
    optional: [],
    types: {
      id: 'string',
      name: 'string',
      edid: 'string',
      description: 'string',
      effects: 'string',
      source: 'string',
    },
  },
  gameMechanics: {
    required: ['id', 'name', 'description', 'version'],
    optional: ['config'],
    types: {
      id: 'string',
      name: 'string',
      description: 'string',
      version: 'string',
      config: 'object',
    },
  },
  presets: {
    required: ['id', 'name', 'perkListId'],
    optional: ['description', 'category', 'tags'],
    types: {
      id: 'string',
      name: 'string',
      perkListId: 'string',
      description: 'string',
      category: 'string',
      tags: 'array',
    },
  },
  perks: {
    required: ['id', 'name', 'skill', 'skillReq', 'description'],
    optional: ['edid', 'rank', 'maxRank', 'prerequisites'],
    types: {
      id: 'string',
      name: 'string',
      skill: 'string',
      skillReq: 'number',
      description: 'string',
      edid: 'string',
      rank: 'number',
      maxRank: 'number',
      prerequisites: 'array',
    },
  },
};

/**
 * Validate data against schema
 */
export async function validateData(dataType: string, data: any): Promise<ValidationResult> {
  const schema = VALIDATION_SCHEMAS[dataType];
  if (!schema) {
    return {
      isValid: false,
      errors: [`No validation schema found for ${dataType}`],
      warnings: [],
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate array structure
  if (!Array.isArray(data)) {
    errors.push(`${dataType} data must be an array`);
    return { isValid: false, errors, warnings };
  }

  // Validate each item
  data.forEach((item, index) => {
    const itemErrors = validateItem(item, schema, `${dataType}[${index}]`);
    errors.push(...itemErrors);
  });

  // Check for duplicate IDs
  const ids = data.map((item: any) => item.id).filter(Boolean);
  const duplicateIds = ids.filter((id: string, index: number) => ids.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    warnings.push(`Found duplicate IDs: ${duplicateIds.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate individual item against schema
 */
function validateItem(item: any, schema: ValidationSchema, path: string): string[] {
  const errors: string[] = [];

  // Check required fields
  schema.required.forEach(field => {
    if (!(field in item)) {
      errors.push(`${path} missing required field: ${field}`);
    }
  });

  // Check field types
  Object.entries(schema.types).forEach(([field, expectedType]) => {
    if (field in item) {
      const actualType = getType(item[field]);
      if (actualType !== expectedType) {
        errors.push(`${path}.${field} expected ${expectedType}, got ${actualType}`);
      }
    }
  });

  // Check constraints
  if (schema.constraints) {
    Object.entries(schema.constraints).forEach(([field, constraint]) => {
      if (field in item) {
        const fieldErrors = validateConstraint(item[field], constraint, `${path}.${field}`);
        errors.push(...fieldErrors);
      }
    });
  }

  return errors;
}

/**
 * Get type of value
 */
function getType(value: any): string {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  return typeof value;
}

/**
 * Validate constraint
 */
function validateConstraint(value: any, constraint: any, path: string): string[] {
  const errors: string[] = [];

  if (constraint.length !== undefined) {
    if (Array.isArray(value) && value.length !== constraint.length) {
      errors.push(`${path} expected length ${constraint.length}, got ${value.length}`);
    }
  }

  if (constraint.minLength !== undefined) {
    if (Array.isArray(value) && value.length < constraint.minLength) {
      errors.push(`${path} expected minimum length ${constraint.minLength}, got ${value.length}`);
    }
  }

  if (constraint.type !== undefined) {
    if (Array.isArray(value)) {
      const invalidTypes = value.filter((v: any) => typeof v !== constraint.type);
      if (invalidTypes.length > 0) {
        errors.push(`${path} expected all elements to be ${constraint.type}`);
      }
    }
  }

  return errors;
}
```

### 3. Performance Utilities
**File:** `src/features/gigaplanner/utils/performance.ts`

```typescript
/**
 * Performance monitoring utilities for data loading
 */
export class PerformanceMonitor {
  private timers: Map<string, number> = new Map();
  private metrics: Map<string, number[]> = new Map();

  /**
   * Start timing an operation
   */
  startTimer(operation: string): void {
    this.timers.set(operation, performance.now());
  }

  /**
   * End timing an operation
   */
  endTimer(operation: string): number {
    const startTime = this.timers.get(operation);
    if (!startTime) {
      throw new Error(`Timer not started for operation: ${operation}`);
    }

    const duration = performance.now() - startTime;
    this.timers.delete(operation);

    // Store metric
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    this.metrics.get(operation)!.push(duration);

    return duration;
  }

  /**
   * Get performance metrics
   */
  getMetrics(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const result: Record<string, any> = {};

    this.metrics.forEach((durations, operation) => {
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
      const min = Math.min(...durations);
      const max = Math.max(...durations);

      result[operation] = {
        avg: Math.round(avg * 100) / 100,
        min: Math.round(min * 100) / 100,
        max: Math.round(max * 100) / 100,
        count: durations.length,
      };
    });

    return result;
  }

  /**
   * Clear metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```

### 4. Enhanced Tests
**File:** `src/features/gigaplanner/adapters/__tests__/dataLoader.test.ts`

```typescript
import { GigaPlannerDataLoader } from '../dataLoader';
import { GigaPlannerError, ERROR_CODES } from '../../types/errors';

describe('GigaPlannerDataLoader', () => {
  let loader: GigaPlannerDataLoader;

  beforeEach(() => {
    loader = new GigaPlannerDataLoader();
  });

  afterEach(() => {
    loader.clearCache();
  });

  describe('Data Loading', () => {
    test('should load all data types', async () => {
      const data = await loader.loadAllData();

      expect(data.races).toBeDefined();
      expect(data.standingStones).toBeDefined();
      expect(data.blessings).toBeDefined();
      expect(data.gameMechanics).toBeDefined();
      expect(data.presets).toBeDefined();
      expect(data.perks).toBeDefined();

      expect(Array.isArray(data.races)).toBe(true);
      expect(Array.isArray(data.standingStones)).toBe(true);
      expect(Array.isArray(data.blessings)).toBe(true);
      expect(Array.isArray(data.gameMechanics)).toBe(true);
      expect(Array.isArray(data.presets)).toBe(true);
      expect(Array.isArray(data.perks)).toBe(true);
    });

    test('should cache loaded data', async () => {
      const data1 = await loader.loadAllData();
      const data2 = await loader.loadAllData();

      expect(data1).toBe(data2); // Same reference due to caching
    });

    test('should handle loading errors gracefully', async () => {
      // Mock a failed import
      jest.doMock('../data/races.json', () => {
        throw new Error('File not found');
      });

      await expect(loader.loadRaces()).rejects.toThrow(GigaPlannerError);
    });
  });

  describe('Caching', () => {
    test('should check cache before loading', async () => {
      const races = await loader.loadRaces();
      expect(loader.isDataLoaded('races')).toBe(true);
      expect(loader.getCachedData('races')).toBe(races);
    });

    test('should clear cache', () => {
      loader.clearCache();
      expect(loader.isDataLoaded('races')).toBe(false);
    });

    test('should get cache statistics', async () => {
      await loader.loadRaces();
      const stats = loader.getCacheStats();

      expect(stats.cachedItems).toContain('races');
      expect(stats.cacheSize).toBeGreaterThan(0);
    });
  });

  describe('Validation', () => {
    test('should validate loaded data', async () => {
      await loader.loadRaces();
      const validation = loader.getValidationResult('races');

      expect(validation).toBeDefined();
      expect(validation!.isValid).toBe(true);
    });

    test('should detect validation errors', async () => {
      // This would require mocking invalid data
      // Implementation depends on actual data structure
    });
  });

  describe('Performance', () => {
    test('should handle concurrent loading', async () => {
      const promises = [
        loader.loadRaces(),
        loader.loadStandingStones(),
        loader.loadBlessings(),
      ];

      const results = await Promise.all(promises);
      expect(results).toHaveLength(3);
      expect(results.every(r => Array.isArray(r))).toBe(true);
    });

    test('should prevent duplicate loading', async () => {
      const promise1 = loader.loadRaces();
      const promise2 = loader.loadRaces();

      expect(loader.isLoading('races')).toBe(true);

      const [result1, result2] = await Promise.all([promise1, promise2]);
      expect(result1).toBe(result2);
    });
  });
});
```

## 🔧 Implementation Steps

1. **Create enhanced data loader**
   - Implement caching with deduplication
   - Add comprehensive error handling
   - Add data validation
   - Add performance monitoring

2. **Create validation utilities**
   - Define validation schemas
   - Implement data validation functions
   - Add constraint checking

3. **Create performance utilities**
   - Add performance monitoring
   - Add debounce and throttle functions
   - Add metrics collection

4. **Write comprehensive tests**
   - Test data loading
   - Test caching behavior
   - Test error handling
   - Test validation
   - Test performance

## ✅ Acceptance Criteria

- [ ] Data loader handles all data types
- [ ] Caching mechanism works correctly
- [ ] Error handling is comprehensive
- [ ] Data validation is implemented
- [ ] Performance optimizations are in place
- [ ] Tests cover all functionality
- [ ] No memory leaks
- [ ] Concurrent loading works correctly

## 🚨 Common Issues

### Issue: Memory Leaks
**Solution:** Ensure proper cleanup of cached data and timers

### Issue: Race Conditions
**Solution:** Use proper promise deduplication for concurrent loads

### Issue: Validation Performance
**Solution:** Implement efficient validation algorithms

### Issue: Cache Invalidation
**Solution:** Provide clear cache management methods

## 📚 Resources

- [Previous task](./TASK_1.2_CREATE_CORE_TYPES.md)
- [Phase 1 Overview](../PHASE_1_TASKS.md)

## 🔄 Next Task

After completing this task, Phase 1 is complete. Move to [Phase 2: Core Converter](./../PHASE_2_TASKS.md)

