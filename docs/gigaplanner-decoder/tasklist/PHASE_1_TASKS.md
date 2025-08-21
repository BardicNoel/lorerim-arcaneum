# Phase 1: Data Conversion & Type Definitions

## 📋 Overview

Phase 1 focuses on converting the JavaScript data files to JSON format and creating comprehensive TypeScript type definitions. This establishes the foundation for the entire integration.

## 🎯 Objectives

- Convert all JavaScript data files to JSON format
- Create TypeScript interfaces for all data structures
- Establish mapping relationships between GigaPlanner and our system
- Set up data loading infrastructure

## 📝 Task Breakdown

### Task 1.1: Convert JavaScript Data to JSON

#### Subtask 1.1.1: Convert `raceListData.js` → `races.json`

**File:** `src/features/gigaplanner/data/races.json`

**Source Analysis:**
- Contains race definitions with starting stats
- Each race has: name, startingHMS, startingCW, speedBonus, hmsBonus, startingHMSRegen, unarmedDam, startingSkills, desc, bonus
- 10 races total: Argonian, Breton, Dunmer, Altmer, etc.

**Conversion Steps:**
1. Extract the `raceListData` array from the JS file
2. Clean up the data structure (remove comments, normalize formatting)
3. Add unique IDs for each race
4. Map to our race EDID system
5. Validate data integrity

**Expected Output:**
```json
[
  {
    "id": "argonian",
    "name": "Argonian",
    "edid": "ArgonianRace",
    "startingHMS": [140, 120, 100],
    "startingCW": 200,
    "speedBonus": 0,
    "hmsBonus": [0, 0, 0],
    "startingHMSRegen": [0.20, 1.10, 1.60],
    "unarmedDam": 32,
    "startingSkills": [0, 0, 0, 0, 10, 0, 10, 10, 0, 0, 0, 15, 0, 0, 0, 10, 0, 0, 1, 0],
    "description": "Argonians are the reptilian denizens of Black Marsh...",
    "bonus": "Waterbreathing: Your Argonian lungs can breathe underwater..."
  }
]
```

#### Subtask 1.1.2: Convert `perkListData.js` → `perks.json`

**File:** `src/features/gigaplanner/data/perks.json`

**Source Analysis:**
- Large file (149KB) containing perk definitions
- Multiple perk lists (subclasses) with different skill sets
- Each perk has: name, skill, skillReq, description
- Skills are referenced by index in skillNames array

**Conversion Steps:**
1. Extract perk list data structure
2. Normalize skill references to use skill names instead of indices
3. Add unique IDs for each perk
4. Map perk names to our perk EDID system
5. Organize by perk list (subclass)

**Expected Output:**
```json
{
  "perkLists": [
    {
      "id": "loreRimV4",
      "name": "LoreRim v4",
      "skillNames": ["Smithing", "Heavy Armor", "Block", "Two-handed", "One-handed", "Marksman", "Evasion", "Sneak", "Wayfarer", "Finesse", "Speech", "Alchemy", "Illusion", "Conjuration", "Destruction", "Restoration", "Alteration", "Enchanting"],
      "perks": [
        {
          "id": "advancedArmors",
          "name": "Advanced Armors",
          "skill": "Smithing",
          "skillReq": 30,
          "description": "You can craft advanced armor types..."
        }
      ]
    }
  ]
}
```

#### Subtask 1.1.3: Convert `standingStoneData.js` → `standingStones.json`

**File:** `src/features/gigaplanner/data/standingStones.json`

**Conversion Steps:**
1. Extract standing stone definitions
2. Add unique IDs and EDID mappings
3. Normalize data structure

#### Subtask 1.1.4: Convert `blessingsData.js` → `blessings.json`

**File:** `src/features/gigaplanner/data/blessings.json`

**Conversion Steps:**
1. Extract blessing definitions
2. Add unique IDs and EDID mappings
3. Normalize data structure

#### Subtask 1.1.5: Convert `gameMechanicsData.js` → `gameMechanics.json`

**File:** `src/features/gigaplanner/data/gameMechanics.json`

**Conversion Steps:**
1. Extract game mechanics configuration
2. Add unique IDs
3. Normalize data structure

#### Subtask 1.1.6: Convert `presetData.js` → `presets.json`

**File:** `src/features/gigaplanner/data/presets.json`

**Conversion Steps:**
1. Extract preset definitions
2. Add unique IDs
3. Normalize data structure

### Task 1.2: Create TypeScript Types

#### Subtask 1.2.1: Define Core GigaPlanner Types

**File:** `src/features/gigaplanner/types/gigaplanner.ts`

**Types to Define:**
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
}

// GigaPlanner URL encode result
export interface GigaPlannerEncodeResult {
  success: boolean;
  url?: string;
  error?: string;
}
```

#### Subtask 1.2.2: Define Data Structure Types

**File:** `src/features/gigaplanner/types/data.ts`

**Types to Define:**
```typescript
// Race data structure
export interface GigaPlannerRace {
  id: string;
  name: string;
  edid: string;
  startingHMS: [number, number, number]; // [health, magicka, stamina]
  startingCW: number;
  speedBonus: number;
  hmsBonus: [number, number, number];
  startingHMSRegen: [number, number, number];
  unarmedDam: number;
  startingSkills: number[];
  description: string;
  bonus: string;
}

// Perk data structure
export interface GigaPlannerPerk {
  id: string;
  name: string;
  skill: string;
  skillReq: number;
  description: string;
  edid?: string; // Our system's EDID
}

// Perk list (subclass) structure
export interface GigaPlannerPerkList {
  id: string;
  name: string;
  skillNames: string[];
  perks: GigaPlannerPerk[];
}

// Standing stone structure
export interface GigaPlannerStandingStone {
  id: string;
  name: string;
  edid: string;
  description: string;
  effects: string;
}

// Blessing structure
export interface GigaPlannerBlessing {
  id: string;
  name: string;
  edid: string;
  description: string;
  effects: string;
  source: string;
}

// Game mechanics structure
export interface GigaPlannerGameMechanics {
  id: string;
  name: string;
  description: string;
  version: string;
}

// Preset structure
export interface GigaPlannerPreset {
  id: string;
  name: string;
  perks: string; // Reference to perk list ID
  description?: string;
}
```

#### Subtask 1.2.3: Define Mapping Types

**File:** `src/features/gigaplanner/types/mappings.ts`

**Types to Define:**
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
```

#### Subtask 1.2.4: Define Validation Schemas

**File:** `src/features/gigaplanner/types/validation.ts`

**Schemas to Define:**
```typescript
// Validation schemas for data integrity
export interface ValidationSchema {
  required: string[];
  optional: string[];
  types: Record<string, string>;
  constraints?: Record<string, any>;
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
```

### Task 1.3: Create Data Loading Infrastructure

#### Subtask 1.3.1: Data Loader Implementation

**File:** `src/features/gigaplanner/adapters/dataLoader.ts`

**Implementation:**
```typescript
export class GigaPlannerDataLoader {
  private cache: Map<string, any> = new Map();
  
  async loadAllData(): Promise<GigaPlannerData> {
    const [races, perks, stones, blessings, mechanics, presets] = await Promise.all([
      this.loadRaces(),
      this.loadPerks(),
      this.loadStandingStones(),
      this.loadBlessings(),
      this.loadGameMechanics(),
      this.loadPresets(),
    ]);
    
    return { races, perks, stones, blessings, mechanics, presets };
  }
  
  private async loadRaces(): Promise<GigaPlannerRace[]> {
    if (this.cache.has('races')) {
      return this.cache.get('races');
    }
    
    const data = await import('../data/races.json');
    this.cache.set('races', data.default);
    return data.default;
  }
  
  // Similar methods for other data types...
}
```

#### Subtask 1.3.2: Index File Exports

**File:** `src/features/gigaplanner/types/index.ts`

**Exports:**
```typescript
// Core types
export type {
  GigaPlannerCharacter,
  GigaPlannerDecodeResult,
  GigaPlannerEncodeResult,
} from './gigaplanner';

// Data types
export type {
  GigaPlannerRace,
  GigaPlannerPerk,
  GigaPlannerPerkList,
  GigaPlannerStandingStone,
  GigaPlannerBlessing,
  GigaPlannerGameMechanics,
  GigaPlannerPreset,
} from './data';

// Mapping types
export type {
  NameToEdidMapping,
  LookupMaps,
  ConversionResult,
} from './mappings';

// Validation types
export type {
  ValidationSchema,
  ValidationResult,
} from './validation';
```

## ✅ Acceptance Criteria

### Data Conversion
- [ ] All JavaScript data files successfully converted to JSON
- [ ] Data integrity maintained during conversion
- [ ] Unique IDs added for all entities
- [ ] EDID mappings established where possible
- [ ] JSON files are valid and well-formatted

### Type Definitions
- [ ] All TypeScript interfaces properly defined
- [ ] Types are comprehensive and accurate
- [ ] Proper type constraints and unions used
- [ ] All types exported from index file
- [ ] No TypeScript compilation errors

### Data Loading
- [ ] Data loader can load all JSON files
- [ ] Caching mechanism implemented
- [ ] Error handling for missing files
- [ ] Async loading with proper typing

## 🔧 Implementation Notes

### Data Conversion Strategy
1. **Manual Review**: Each JS file needs manual review to understand structure
2. **Incremental Conversion**: Convert one file at a time and validate
3. **ID Generation**: Create consistent ID scheme across all data types
4. **EDID Mapping**: Map to our existing EDID system where possible

### Type Safety
1. **Strict Typing**: Use strict TypeScript types throughout
2. **Validation**: Add runtime validation for data integrity
3. **Error Handling**: Comprehensive error handling for all operations
4. **Documentation**: Document all types and their purposes

### Performance Considerations
1. **Lazy Loading**: Load data only when needed
2. **Caching**: Cache loaded data to avoid repeated file reads
3. **Memory Management**: Consider memory usage for large perk data
4. **Bundle Size**: Ensure JSON files don't bloat the bundle

## 🚀 Next Steps

After completing Phase 1:
1. Move to Phase 2: Core Converter implementation
2. Begin mapping system development
3. Start integration planning
4. Consider testing strategy for converted data

