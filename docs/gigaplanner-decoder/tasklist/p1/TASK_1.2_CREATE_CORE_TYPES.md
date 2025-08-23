# Task 1.2: Create Core GigaPlanner Types

## 📋 Task Overview

Create comprehensive TypeScript interfaces for GigaPlanner character data, conversion results, and core functionality.

## 🎯 Objectives

- [ ] Define GigaPlanner character data structure
- [ ] Define conversion result interfaces
- [ ] Define validation schemas
- [ ] Create mapping interfaces
- [ ] Add comprehensive type exports

## 📁 Files to Create/Modify

### 1. Core GigaPlanner Types
**File:** `src/features/gigaplanner/types/gigaplanner.ts`

```typescript
// GigaPlanner character data structure
export interface GigaPlannerCharacter {
  level: number;
  hmsIncreases: {
    health: number;
    magicka: number;
    stamina: number;
  };
  skillLevels: Array<{
    skill: string;
    level: number;
  }>;
  oghmaChoice: 'None' | 'Health' | 'Magicka' | 'Stamina';
  race: string;
  standingStone: string;
  blessing: string;
  perks: string[];
  configuration: {
    perkList: string;
    gameMechanics: string;
  };
}

// GigaPlanner URL decode result
export interface GigaPlannerDecodeResult {
  success: boolean;
  preset?: string;
  character?: GigaPlannerCharacter;
  error?: string;
  warnings?: string[];
}

// GigaPlanner URL encode result
export interface GigaPlannerEncodeResult {
  success: boolean;
  url?: string;
  error?: string;
  warnings?: string[];
}

// GigaPlanner URL structure
export interface GigaPlannerUrl {
  baseUrl: string;
  buildCode: string;
  presetNumber?: number;
}

// GigaPlanner build code structure
export interface GigaPlannerBuildCode {
  version: number;
  perkListId: number;
  raceListId: number;
  gameMechanicsId: number;
  blessingListId: number;
  characterData: {
    level: number;
    hmsIncreases: {
      health: number;
      magicka: number;
      stamina: number;
    };
    skillLevels: number[];
    oghmaChoice: number;
    race: number;
    standingStone: number;
    blessing: number;
    perks: boolean[];
  };
}
```

### 2. Mapping Types
**File:** `src/features/gigaplanner/types/mappings.ts`

```typescript
// Mapping between GigaPlanner names and our EDIDs
export interface NameToEdidMapping {
  gigaplannerName: string;
  edid: string;
  category: 'race' | 'standingStone' | 'blessing' | 'perk' | 'skill';
}

// Lookup maps for efficient conversion
export interface LookupMaps {
  raceNameToId: Map<string, number>;
  raceIdToName: Map<number, string>;
  stoneNameToId: Map<string, number>;
  stoneIdToName: Map<number, string>;
  blessingNameToId: Map<string, number>;
  blessingIdToName: Map<number, string>;
  perkListNameToId: Map<string, number>;
  perkListIdToName: Map<number, string>;
  mechanicsNameToId: Map<string, number>;
  mechanicsIdToName: Map<number, string>;
}

// Conversion result with warnings
export interface ConversionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
  unmappedItems?: Array<{
    type: string;
    name: string;
    category: string;
  }>;
}

// Mapping configuration
export interface MappingConfig {
  strictMode: boolean; // Whether to fail on unmapped items
  allowPartial: boolean; // Whether to allow partial conversions
  defaultValues: Record<string, any>; // Default values for missing data
}
```

### 3. Validation Types
**File:** `src/features/gigaplanner/types/validation.ts`

```typescript
// Validation schemas for data integrity
export interface ValidationSchema {
  required: string[];
  optional: string[];
  types: Record<string, string>;
  constraints?: Record<string, any>;
  customValidators?: Array<(data: any) => ValidationResult>;
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  details?: Record<string, any>;
}

// Character validation rules
export interface CharacterValidationRules {
  maxLevel: number;
  minLevel: number;
  maxSkillLevel: number;
  minSkillLevel: number;
  maxPerks: number;
  requiredFields: string[];
  skillCount: number;
}

// Validation context
export interface ValidationContext {
  rules: CharacterValidationRules;
  data: any;
  source: 'import' | 'export';
  strictMode: boolean;
}
```

### 4. Error Types
**File:** `src/features/gigaplanner/types/errors.ts`

```typescript
// Base error class for GigaPlanner operations
export class GigaPlannerError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'GigaPlannerError';
  }
}

// Specific error types
export class GigaPlannerDecodeError extends GigaPlannerError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'DECODE_ERROR', details);
    this.name = 'GigaPlannerDecodeError';
  }
}

export class GigaPlannerEncodeError extends GigaPlannerError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'ENCODE_ERROR', details);
    this.name = 'GigaPlannerEncodeError';
  }
}

export class GigaPlannerValidationError extends GigaPlannerError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'GigaPlannerValidationError';
  }
}

export class GigaPlannerMappingError extends GigaPlannerError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'MAPPING_ERROR', details);
    this.name = 'GigaPlannerMappingError';
  }
}

// Error codes
export const ERROR_CODES = {
  INVALID_URL: 'INVALID_URL',
  INVALID_BUILD_CODE: 'INVALID_BUILD_CODE',
  MISSING_DATA: 'MISSING_DATA',
  UNMAPPED_ITEM: 'UNMAPPED_ITEM',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  DATA_LOAD_FAILED: 'DATA_LOAD_FAILED',
  CONVERSION_FAILED: 'CONVERSION_FAILED',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
```

### 5. Update Main Index File
**File:** `src/features/gigaplanner/types/index.ts`

```typescript
// Core types
export type {
  GigaPlannerCharacter,
  GigaPlannerDecodeResult,
  GigaPlannerEncodeResult,
  GigaPlannerUrl,
  GigaPlannerBuildCode,
} from './gigaplanner';

// Data types
export type {
  GigaPlannerRace,
  GigaPlannerStandingStone,
  GigaPlannerBlessing,
  GigaPlannerGameMechanics,
  GigaPlannerPreset,
  GigaPlannerPerk,
  GigaPlannerPerkList,
  GigaPlannerData,
} from './data';

// Mapping types
export type {
  NameToEdidMapping,
  LookupMaps,
  ConversionResult,
  MappingConfig,
} from './mappings';

// Validation types
export type {
  ValidationSchema,
  ValidationResult,
  CharacterValidationRules,
  ValidationContext,
} from './validation';

// Error types
export {
  GigaPlannerError,
  GigaPlannerDecodeError,
  GigaPlannerEncodeError,
  GigaPlannerValidationError,
  GigaPlannerMappingError,
  ERROR_CODES,
} from './errors';

export type { ErrorCode } from './errors';
```

### 6. Create Tests
**File:** `src/features/gigaplanner/types/__tests__/types.test.ts`

```typescript
import type {
  GigaPlannerCharacter,
  GigaPlannerDecodeResult,
  GigaPlannerEncodeResult,
  ConversionResult,
  ValidationResult,
} from '../index';
import {
  GigaPlannerError,
  GigaPlannerDecodeError,
  ERROR_CODES,
} from '../errors';

describe('GigaPlanner Types', () => {
  test('should create valid GigaPlannerCharacter', () => {
    const character: GigaPlannerCharacter = {
      level: 50,
      hmsIncreases: {
        health: 10,
        magicka: 5,
        stamina: 15,
      },
      skillLevels: [
        { skill: 'Smithing', level: 100 },
        { skill: 'Heavy Armor', level: 75 },
      ],
      oghmaChoice: 'Health',
      race: 'Nord',
      standingStone: 'The Warrior',
      blessing: 'Blessing of Talos',
      perks: ['Advanced Armors', 'Dwarven Smithing'],
      configuration: {
        perkList: 'LoreRim v4',
        gameMechanics: 'LoreRim v4',
      },
    };

    expect(character.level).toBe(50);
    expect(character.race).toBe('Nord');
    expect(character.perks).toHaveLength(2);
  });

  test('should create valid ConversionResult', () => {
    const result: ConversionResult<GigaPlannerCharacter> = {
      success: true,
      data: {
        level: 50,
        hmsIncreases: { health: 10, magicka: 5, stamina: 15 },
        skillLevels: [],
        oghmaChoice: 'Health',
        race: 'Nord',
        standingStone: 'The Warrior',
        blessing: 'Blessing of Talos',
        perks: [],
        configuration: {
          perkList: 'LoreRim v4',
          gameMechanics: 'LoreRim v4',
        },
      },
      warnings: ['Some items could not be mapped'],
    };

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.warnings).toHaveLength(1);
  });

  test('should create valid ValidationResult', () => {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: ['Level is higher than recommended'],
    };

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(1);
  });
});

describe('GigaPlanner Errors', () => {
  test('should create GigaPlannerError', () => {
    const error = new GigaPlannerError(
      'Invalid build code',
      ERROR_CODES.INVALID_BUILD_CODE,
      { buildCode: 'invalid' }
    );

    expect(error.message).toBe('Invalid build code');
    expect(error.code).toBe(ERROR_CODES.INVALID_BUILD_CODE);
    expect(error.details).toEqual({ buildCode: 'invalid' });
  });

  test('should create GigaPlannerDecodeError', () => {
    const error = new GigaPlannerDecodeError('Failed to decode URL', {
      url: 'https://example.com',
    });

    expect(error.message).toBe('Failed to decode URL');
    expect(error.code).toBe('DECODE_ERROR');
    expect(error.name).toBe('GigaPlannerDecodeError');
  });
});
```

## 🔧 Implementation Steps

1. **Create core type files**
   - Create `gigaplanner.ts` with character and result types
   - Create `mappings.ts` with mapping interfaces
   - Create `validation.ts` with validation schemas
   - Create `errors.ts` with error classes

2. **Define comprehensive interfaces**
   - Character data structure
   - Conversion results
   - Validation schemas
   - Error handling

3. **Create error hierarchy**
   - Base error class
   - Specific error types
   - Error codes and constants

4. **Update index exports**
   - Export all types from main index
   - Organize exports by category
   - Ensure proper type coverage

5. **Write comprehensive tests**
   - Test type creation
   - Test error handling
   - Test validation schemas
   - Test conversion results

## ✅ Acceptance Criteria

- [ ] All core types properly defined
- [ ] TypeScript interfaces are comprehensive
- [ ] Error hierarchy is complete
- [ ] Validation schemas are defined
- [ ] Mapping interfaces are clear
- [ ] All types exported from index
- [ ] Tests pass and cover all types
- [ ] No TypeScript compilation errors
- [ ] Types follow project conventions

## 🚨 Common Issues

### Issue: Type Conflicts
**Solution:** Ensure unique type names and proper namespacing

### Issue: Missing Type Exports
**Solution:** Verify all types are exported from index file

### Issue: Circular Dependencies
**Solution:** Organize types to avoid circular imports

### Issue: Incomplete Type Coverage
**Solution:** Ensure all data structures have corresponding types

## 📚 Resources

- [Previous task](./TASK_1.1.6_CONVERT_PERKS.md)
- [Phase 1 Overview](../PHASE_1_TASKS.md)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🔄 Next Task

After completing this task, move to [Task 1.3: Create Data Loading Infrastructure](./TASK_1.3_CREATE_DATA_LOADING.md)

