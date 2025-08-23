# Task 1.1.4: Convert `gameMechanicsData.js` → `gameMechanics.json`

## 📋 Task Overview

Convert the JavaScript game mechanics data file to JSON format with proper TypeScript types and ID mappings.

## 🎯 Objectives

- [ ] Extract game mechanics data from `gameMechanicsData.js`
- [ ] Convert to JSON format with proper structure
- [ ] Add unique IDs and version information
- [ ] Update TypeScript interfaces
- [ ] Extend data loading infrastructure
- [ ] Add validation and error handling

## 📁 Files to Create/Modify

### 1. Update TypeScript Types
**File:** `src/features/gigaplanner/types/data.ts`

```typescript
// Add to existing file
export interface GigaPlannerGameMechanics {
  id: string;
  name: string;
  description: string;
  version: string;
  config?: Record<string, any>; // Additional configuration data
}

// Update GigaPlannerData interface
export interface GigaPlannerData {
  races: GigaPlannerRace[];
  standingStones: GigaPlannerStandingStone[];
  blessings: GigaPlannerBlessing[];
  gameMechanics: GigaPlannerGameMechanics[];
  perks?: any; // Will be defined later
  presets?: any; // Will be defined later
}
```

### 2. Update ID Mappings
**File:** `src/features/gigaplanner/adapters/mappings.ts`

```typescript
// Add to existing file
export const GAME_MECHANICS_NAME_TO_ID: Record<string, number> = {
  'LoreRim v4': 0,
  'Vanilla': 1,
  'Requiem': 2,
  'Ordinator': 3,
  // Add other game mechanics as found in source
};

// Add helper function
export function getGameMechanicsId(mechanicsName: string): number {
  return GAME_MECHANICS_NAME_TO_ID[mechanicsName] ?? 0;
}

export function getGameMechanicsName(mechanicsId: number): string {
  const entries = Object.entries(GAME_MECHANICS_NAME_TO_ID);
  const found = entries.find(([_, id]) => id === mechanicsId);
  return found ? found[0] : 'Unknown';
}
```

### 3. JSON Data File
**File:** `src/features/gigaplanner/data/gameMechanics.json`

```json
[
  {
    "id": "loreRimV4",
    "name": "LoreRim v4",
    "description": "LoreRim v4 game mechanics configuration with balanced progression and lore-friendly mechanics.",
    "version": "4.0.0",
    "config": {
      "skillProgression": "balanced",
      "combatSystem": "realistic",
      "magicSystem": "loreFriendly",
      "levelingSpeed": "moderate"
    }
  },
  {
    "id": "vanilla",
    "name": "Vanilla",
    "description": "Original Skyrim game mechanics with standard progression and systems.",
    "version": "1.0.0",
    "config": {
      "skillProgression": "standard",
      "combatSystem": "basic",
      "magicSystem": "vanilla",
      "levelingSpeed": "fast"
    }
  },
  {
    "id": "requiem",
    "name": "Requiem",
    "description": "Requiem mod game mechanics with hardcore progression and realistic systems.",
    "version": "5.0.0",
    "config": {
      "skillProgression": "hardcore",
      "combatSystem": "realistic",
      "magicSystem": "balanced",
      "levelingSpeed": "slow"
    }
  }
]
```

**Note:** Complete the array with all game mechanics following the same pattern.

### 4. Update Data Loader
**File:** `src/features/gigaplanner/adapters/dataLoader.ts`

```typescript
// Add to existing GigaPlannerDataLoader class
async loadGameMechanics(): Promise<GigaPlannerGameMechanics[]> {
  if (this.cache.has('gameMechanics')) {
    return this.cache.get('gameMechanics');
  }
  
  try {
    const data = await import('../data/gameMechanics.json');
    this.cache.set('gameMechanics', data.default);
    return data.default;
  } catch (error) {
    console.error('Failed to load game mechanics data:', error);
    throw new Error('Failed to load game mechanics data');
  }
}

// Update loadAllData method
async loadAllData(): Promise<GigaPlannerData> {
  const [races, standingStones, blessings, gameMechanics] = await Promise.all([
    this.loadRaces(),
    this.loadStandingStones(),
    this.loadBlessings(),
    this.loadGameMechanics(),
  ]);
  
  return {
    races,
    standingStones,
    blessings,
    gameMechanics,
    // Other data types will be added as they're converted
  };
}
```

### 5. Update Index File
**File:** `src/features/gigaplanner/types/index.ts`

```typescript
// Update exports
export type {
  GigaPlannerRace,
  GigaPlannerStandingStone,
  GigaPlannerBlessing,
  GigaPlannerGameMechanics,
  GigaPlannerData,
} from './data';
```

### 6. Update Tests
**File:** `src/features/gigaplanner/adapters/__tests__/dataLoader.test.ts`

```typescript
// Add to existing test file
test('should load game mechanics data', async () => {
  const gameMechanics = await loader.loadGameMechanics();
  
  expect(gameMechanics).toBeDefined();
  expect(Array.isArray(gameMechanics)).toBe(true);
  expect(gameMechanics.length).toBeGreaterThan(0);
  
  // Test first game mechanics structure
  const firstMechanics = gameMechanics[0];
  expect(firstMechanics).toHaveProperty('id');
  expect(firstMechanics).toHaveProperty('name');
  expect(firstMechanics).toHaveProperty('description');
  expect(firstMechanics).toHaveProperty('version');
  expect(firstMechanics).toHaveProperty('config');
});

test('should load all data including game mechanics', async () => {
  const allData = await loader.loadAllData();
  
  expect(allData.races).toBeDefined();
  expect(allData.standingStones).toBeDefined();
  expect(allData.blessings).toBeDefined();
  expect(allData.gameMechanics).toBeDefined();
  expect(Array.isArray(allData.races)).toBe(true);
  expect(Array.isArray(allData.standingStones)).toBe(true);
  expect(Array.isArray(allData.blessings)).toBe(true);
  expect(Array.isArray(allData.gameMechanics)).toBe(true);
});

test('should handle game mechanics ID mapping', () => {
  const loreRimId = getGameMechanicsId('LoreRim v4');
  const loreRimName = getGameMechanicsName(loreRimId);
  
  expect(loreRimId).toBe(0);
  expect(loreRimName).toBe('LoreRim v4');
});
```

## 🔧 Implementation Steps

1. **Analyze source data**
   - Read `docs/gigaplanner-decoder/gameMechanicsData.js`
   - Identify all game mechanics configurations
   - Note version information and configuration details
   - Understand the relationship between mechanics and other data

2. **Update TypeScript types**
   - Add `GigaPlannerGameMechanics` interface
   - Update `GigaPlannerData` interface
   - Update index file exports

3. **Create ID mappings**
   - Map game mechanics names to numeric IDs
   - Create helper functions for conversion
   - Ensure consistent ID scheme

4. **Convert JavaScript to JSON**
   - Extract game mechanics data from JS file
   - Add unique IDs for each mechanics configuration
   - Include version information
   - Add configuration details
   - Format as valid JSON

5. **Extend data loader**
   - Add `loadGameMechanics` method
   - Update `loadAllData` method
   - Add caching for game mechanics

6. **Update tests**
   - Test game mechanics loading
   - Test combined data loading
   - Test ID mapping functions
   - Test error scenarios

## ✅ Acceptance Criteria

- [ ] All game mechanics converted to JSON
- [ ] Each game mechanics has unique `id` field
- [ ] Each game mechanics includes version information
- [ ] Configuration data is properly structured
- [ ] Data types match TypeScript interfaces
- [ ] Data loader can load game mechanics successfully
- [ ] Caching mechanism works for game mechanics
- [ ] ID mapping functions work correctly
- [ ] Error handling implemented
- [ ] Tests pass
- [ ] Existing functionality still works

## 🚨 Common Issues

### Issue: Missing Game Mechanics Names
**Solution:** Check the source file for all game mechanics names and add to ID mappings

### Issue: Version Information Missing
**Solution:** Ensure each game mechanics includes proper version information

### Issue: Configuration Data Structure
**Solution:** Define consistent structure for configuration data across all mechanics

### Issue: ID Mapping Conflicts
**Solution:** Ensure unique IDs for each game mechanics configuration

## 📚 Resources

- [Source file](../gameMechanicsData.js)
- [Previous task](./TASK_1.1.3_CONVERT_BLESSINGS.md)
- [Phase 1 Overview](../PHASE_1_TASKS.md)

## 🔄 Next Task

After completing this task, move to [Task 1.1.5: Convert Presets](./TASK_1.1.5_CONVERT_PRESETS.md)

