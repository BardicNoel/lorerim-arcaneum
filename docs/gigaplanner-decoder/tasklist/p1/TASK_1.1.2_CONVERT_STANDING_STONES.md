# Task 1.1.2: Convert `standingStoneData.js` → `standingStones.json`

## 📋 Task Overview

Convert the JavaScript standing stone data file to JSON format with proper TypeScript types and EDID mappings.

## 🎯 Objectives

- [ ] Extract standing stone data from `standingStoneData.js`
- [ ] Convert to JSON format with proper structure
- [ ] Add unique IDs and EDID mappings
- [ ] Update TypeScript interfaces
- [ ] Extend data loading infrastructure
- [ ] Add validation and error handling

## 📁 Files to Create/Modify

### 1. Update TypeScript Types
**File:** `src/features/gigaplanner/types/data.ts`

```typescript
// Add to existing file
export interface GigaPlannerStandingStone {
  id: string;
  name: string;
  edid: string;
  description: string;
  effects: string;
}

// Update GigaPlannerData interface
export interface GigaPlannerData {
  races: GigaPlannerRace[];
  standingStones: GigaPlannerStandingStone[];
  perks?: any; // Will be defined later
  blessings?: any; // Will be defined later
  gameMechanics?: any; // Will be defined later
  presets?: any; // Will be defined later
}
```

### 2. Update EDID Mappings
**File:** `src/features/gigaplanner/adapters/mappings.ts`

```typescript
// Add to existing file
export const STANDING_STONE_NAME_TO_EDID: Record<string, string> = {
  'The Warrior': 'StandingStoneWarrior',
  'The Mage': 'StandingStoneMage',
  'The Thief': 'StandingStoneThief',
  'The Lady': 'StandingStoneLady',
  'The Steed': 'StandingStoneSteed',
  'The Lord': 'StandingStoneLord',
  'The Apprentice': 'StandingStoneApprentice',
  'The Atronach': 'StandingStoneAtronach',
  'The Ritual': 'StandingStoneRitual',
  'The Lover': 'StandingStoneLover',
  'The Shadow': 'StandingStoneShadow',
  'The Tower': 'StandingStoneTower',
  'The Serpent': 'StandingStoneSerpent',
};

// Add helper function
export function getStandingStoneEdid(stoneName: string): string {
  return STANDING_STONE_NAME_TO_EDID[stoneName] || stoneName;
}
```

### 3. JSON Data File
**File:** `src/features/gigaplanner/data/standingStones.json`

```json
[
  {
    "id": "warrior",
    "name": "The Warrior",
    "edid": "StandingStoneWarrior",
    "description": "The Warrior Stone grants increased combat effectiveness.",
    "effects": "Combat skills improve 20% faster. Health increases by 25 points."
  },
  {
    "id": "mage",
    "name": "The Mage",
    "edid": "StandingStoneMage",
    "description": "The Mage Stone enhances magical abilities.",
    "effects": "Magic skills improve 20% faster. Magicka increases by 25 points."
  },
  {
    "id": "thief",
    "name": "The Thief",
    "edid": "StandingStoneThief",
    "description": "The Thief Stone improves stealth and agility.",
    "effects": "Stealth skills improve 20% faster. Stamina increases by 25 points."
  }
]
```

**Note:** Complete the array with all standing stones following the same pattern.

### 4. Update Data Loader
**File:** `src/features/gigaplanner/adapters/dataLoader.ts`

```typescript
// Add to existing GigaPlannerDataLoader class
async loadStandingStones(): Promise<GigaPlannerStandingStone[]> {
  if (this.cache.has('standingStones')) {
    return this.cache.get('standingStones');
  }
  
  try {
    const data = await import('../data/standingStones.json');
    this.cache.set('standingStones', data.default);
    return data.default;
  } catch (error) {
    console.error('Failed to load standing stones data:', error);
    throw new Error('Failed to load standing stones data');
  }
}

// Update loadAllData method
async loadAllData(): Promise<GigaPlannerData> {
  const [races, standingStones] = await Promise.all([
    this.loadRaces(),
    this.loadStandingStones(),
  ]);
  
  return {
    races,
    standingStones,
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
  GigaPlannerData,
} from './data';
```

### 6. Update Tests
**File:** `src/features/gigaplanner/adapters/__tests__/dataLoader.test.ts`

```typescript
// Add to existing test file
test('should load standing stones data', async () => {
  const standingStones = await loader.loadStandingStones();
  
  expect(standingStones).toBeDefined();
  expect(Array.isArray(standingStones)).toBe(true);
  expect(standingStones.length).toBeGreaterThan(0);
  
  // Test first standing stone structure
  const firstStone = standingStones[0];
  expect(firstStone).toHaveProperty('id');
  expect(firstStone).toHaveProperty('name');
  expect(firstStone).toHaveProperty('edid');
  expect(firstStone).toHaveProperty('description');
  expect(firstStone).toHaveProperty('effects');
});

test('should load all data including standing stones', async () => {
  const allData = await loader.loadAllData();
  
  expect(allData.races).toBeDefined();
  expect(allData.standingStones).toBeDefined();
  expect(Array.isArray(allData.races)).toBe(true);
  expect(Array.isArray(allData.standingStones)).toBe(true);
});
```

## 🔧 Implementation Steps

1. **Analyze source data**
   - Read `docs/gigaplanner-decoder/standingStoneData.js`
   - Identify all standing stones and their properties
   - Note any special formatting or data structures

2. **Update TypeScript types**
   - Add `GigaPlannerStandingStone` interface
   - Update `GigaPlannerData` interface
   - Update index file exports

3. **Create EDID mappings**
   - Map standing stone names to EDIDs
   - Create helper function for conversion

4. **Convert JavaScript to JSON**
   - Extract standing stone data from JS file
   - Add unique IDs for each standing stone
   - Apply EDID mappings
   - Format as valid JSON

5. **Extend data loader**
   - Add `loadStandingStones` method
   - Update `loadAllData` method
   - Add caching for standing stones

6. **Update tests**
   - Test standing stones loading
   - Test combined data loading
   - Test error scenarios

## ✅ Acceptance Criteria

- [ ] All standing stones converted to JSON
- [ ] Each standing stone has unique `id` field
- [ ] Each standing stone has correct `edid` mapping
- [ ] Data types match TypeScript interfaces
- [ ] Data loader can load standing stones successfully
- [ ] Caching mechanism works for standing stones
- [ ] Error handling implemented
- [ ] Tests pass
- [ ] Existing race functionality still works

## 🚨 Common Issues

### Issue: Missing Standing Stone Names
**Solution:** Check the source file for all standing stone names and add to EDID mappings

### Issue: Type Conflicts
**Solution:** Ensure new types don't conflict with existing race types

### Issue: Cache Key Conflicts
**Solution:** Use unique cache keys for different data types

### Issue: Import Path Issues
**Solution:** Verify JSON file path is correct relative to loader

## 📚 Resources

- [Source file](../standingStoneData.js)
- [Previous task](./TASK_1.1.1_CONVERT_RACES.md)
- [Phase 1 Overview](../PHASE_1_TASKS.md)

## 🔄 Next Task

After completing this task, move to [Task 1.1.3: Convert Blessings](./TASK_1.1.3_CONVERT_BLESSINGS.md)

