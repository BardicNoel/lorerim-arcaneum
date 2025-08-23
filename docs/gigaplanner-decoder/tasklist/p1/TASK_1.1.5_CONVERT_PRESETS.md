# Task 1.1.5: Convert `presetData.js` → `presets.json`

## 📋 Task Overview

Convert the JavaScript presets data file to JSON format with proper TypeScript types and ID mappings.

## 🎯 Objectives

- [ ] Extract presets data from `presetData.js`
- [ ] Convert to JSON format with proper structure
- [ ] Add unique IDs and references to other data
- [ ] Update TypeScript interfaces
- [ ] Extend data loading infrastructure
- [ ] Add validation and error handling

## 📁 Files to Create/Modify

### 1. Update TypeScript Types
**File:** `src/features/gigaplanner/types/data.ts`

```typescript
// Add to existing file
export interface GigaPlannerPreset {
  id: string;
  name: string;
  perkListId: string; // Reference to perk list ID
  description?: string;
  category?: string;
  tags?: string[];
}

// Update GigaPlannerData interface
export interface GigaPlannerData {
  races: GigaPlannerRace[];
  standingStones: GigaPlannerStandingStone[];
  blessings: GigaPlannerBlessing[];
  gameMechanics: GigaPlannerGameMechanics[];
  presets: GigaPlannerPreset[];
  perks?: any; // Will be defined later
}
```

### 2. Update ID Mappings
**File:** `src/features/gigaplanner/adapters/mappings.ts`

```typescript
// Add to existing file
export const PRESET_NAME_TO_ID: Record<string, number> = {
  'LoreRim v4': 0,
  'Vanilla': 1,
  'Requiem': 2,
  'Ordinator': 3,
  // Add other presets as found in source
};

// Add helper function
export function getPresetId(presetName: string): number {
  return PRESET_NAME_TO_ID[presetName] ?? 0;
}

export function getPresetName(presetId: number): string {
  const entries = Object.entries(PRESET_NAME_TO_ID);
  const found = entries.find(([_, id]) => id === presetId);
  return found ? found[0] : 'Unknown';
}
```

### 3. JSON Data File
**File:** `src/features/gigaplanner/data/presets.json`

```json
[
  {
    "id": "loreRimV4",
    "name": "LoreRim v4",
    "perkListId": "loreRimV4",
    "description": "LoreRim v4 preset with balanced progression and lore-friendly mechanics.",
    "category": "balanced",
    "tags": ["lore-friendly", "balanced", "immersive"]
  },
  {
    "id": "vanilla",
    "name": "Vanilla",
    "perkListId": "vanilla",
    "description": "Original Skyrim preset with standard progression and systems.",
    "category": "vanilla",
    "tags": ["vanilla", "standard", "original"]
  },
  {
    "id": "requiem",
    "name": "Requiem",
    "perkListId": "requiem",
    "description": "Requiem mod preset with hardcore progression and realistic systems.",
    "category": "hardcore",
    "tags": ["hardcore", "realistic", "challenging"]
  }
]
```

**Note:** Complete the array with all presets following the same pattern.

### 4. Update Data Loader
**File:** `src/features/gigaplanner/adapters/dataLoader.ts`

```typescript
// Add to existing GigaPlannerDataLoader class
async loadPresets(): Promise<GigaPlannerPreset[]> {
  if (this.cache.has('presets')) {
    return this.cache.get('presets');
  }
  
  try {
    const data = await import('../data/presets.json');
    this.cache.set('presets', data.default);
    return data.default;
  } catch (error) {
    console.error('Failed to load presets data:', error);
    throw new Error('Failed to load presets data');
  }
}

// Update loadAllData method
async loadAllData(): Promise<GigaPlannerData> {
  const [races, standingStones, blessings, gameMechanics, presets] = await Promise.all([
    this.loadRaces(),
    this.loadStandingStones(),
    this.loadBlessings(),
    this.loadGameMechanics(),
    this.loadPresets(),
  ]);
  
  return {
    races,
    standingStones,
    blessings,
    gameMechanics,
    presets,
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
  GigaPlannerPreset,
  GigaPlannerData,
} from './data';
```

### 6. Update Tests
**File:** `src/features/gigaplanner/adapters/__tests__/dataLoader.test.ts`

```typescript
// Add to existing test file
test('should load presets data', async () => {
  const presets = await loader.loadPresets();
  
  expect(presets).toBeDefined();
  expect(Array.isArray(presets)).toBe(true);
  expect(presets.length).toBeGreaterThan(0);
  
  // Test first preset structure
  const firstPreset = presets[0];
  expect(firstPreset).toHaveProperty('id');
  expect(firstPreset).toHaveProperty('name');
  expect(firstPreset).toHaveProperty('perkListId');
  expect(firstPreset).toHaveProperty('description');
  expect(firstPreset).toHaveProperty('category');
  expect(firstPreset).toHaveProperty('tags');
});

test('should load all data including presets', async () => {
  const allData = await loader.loadAllData();
  
  expect(allData.races).toBeDefined();
  expect(allData.standingStones).toBeDefined();
  expect(allData.blessings).toBeDefined();
  expect(allData.gameMechanics).toBeDefined();
  expect(allData.presets).toBeDefined();
  expect(Array.isArray(allData.races)).toBe(true);
  expect(Array.isArray(allData.standingStones)).toBe(true);
  expect(Array.isArray(allData.blessings)).toBe(true);
  expect(Array.isArray(allData.gameMechanics)).toBe(true);
  expect(Array.isArray(allData.presets)).toBe(true);
});

test('should handle preset ID mapping', () => {
  const loreRimId = getPresetId('LoreRim v4');
  const loreRimName = getPresetName(loreRimId);
  
  expect(loreRimId).toBe(0);
  expect(loreRimName).toBe('LoreRim v4');
});

test('should validate preset perk list references', async () => {
  const presets = await loader.loadPresets();
  
  // This test will be more meaningful once perks are loaded
  // For now, just ensure perkListId is present
  presets.forEach(preset => {
    expect(preset.perkListId).toBeDefined();
    expect(typeof preset.perkListId).toBe('string');
  });
});
```

## 🔧 Implementation Steps

1. **Analyze source data**
   - Read `docs/gigaplanner-decoder/presetData.js`
   - Identify all presets and their properties
   - Note relationships to perk lists and other data
   - Understand preset categories and tags

2. **Update TypeScript types**
   - Add `GigaPlannerPreset` interface
   - Update `GigaPlannerData` interface
   - Update index file exports

3. **Create ID mappings**
   - Map preset names to numeric IDs
   - Create helper functions for conversion
   - Ensure consistent ID scheme

4. **Convert JavaScript to JSON**
   - Extract preset data from JS file
   - Add unique IDs for each preset
   - Include perk list references
   - Add categorization and tags
   - Format as valid JSON

5. **Extend data loader**
   - Add `loadPresets` method
   - Update `loadAllData` method
   - Add caching for presets

6. **Update tests**
   - Test presets loading
   - Test combined data loading
   - Test ID mapping functions
   - Test perk list references
   - Test error scenarios

## ✅ Acceptance Criteria

- [ ] All presets converted to JSON
- [ ] Each preset has unique `id` field
- [ ] Each preset includes perk list reference
- [ ] Categorization and tags are properly structured
- [ ] Data types match TypeScript interfaces
- [ ] Data loader can load presets successfully
- [ ] Caching mechanism works for presets
- [ ] ID mapping functions work correctly
- [ ] Perk list references are valid
- [ ] Error handling implemented
- [ ] Tests pass
- [ ] Existing functionality still works

## 🚨 Common Issues

### Issue: Missing Preset Names
**Solution:** Check the source file for all preset names and add to ID mappings

### Issue: Invalid Perk List References
**Solution:** Ensure perk list references match actual perk list IDs

### Issue: Missing Categorization
**Solution:** Add appropriate categories and tags for each preset

### Issue: ID Mapping Conflicts
**Solution:** Ensure unique IDs for each preset

## 📚 Resources

- [Source file](../presetData.js)
- [Previous task](./TASK_1.1.4_CONVERT_GAME_MECHANICS.md)
- [Phase 1 Overview](../PHASE_1_TASKS.md)

## 🔄 Next Task

After completing this task, move to [Task 1.1.6: Convert Perks](./TASK_1.1.6_CONVERT_PERKS.md)

