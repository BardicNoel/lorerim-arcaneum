# Task 1.1.3: Convert `blessingsData.js` → `blessings.json`

## 📋 Task Overview

Convert the JavaScript blessings data file to JSON format with proper TypeScript types and EDID mappings.

## 🎯 Objectives

- [ ] Extract blessings data from `blessingsData.js`
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
export interface GigaPlannerBlessing {
  id: string;
  name: string;
  edid: string;
  description: string;
  effects: string;
  source: string;
}

// Update GigaPlannerData interface
export interface GigaPlannerData {
  races: GigaPlannerRace[];
  standingStones: GigaPlannerStandingStone[];
  blessings: GigaPlannerBlessing[];
  perks?: any; // Will be defined later
  gameMechanics?: any; // Will be defined later
  presets?: any; // Will be defined later
}
```

### 2. Update EDID Mappings
**File:** `src/features/gigaplanner/adapters/mappings.ts`

```typescript
// Add to existing file
export const BLESSING_NAME_TO_EDID: Record<string, string> = {
  'Blessing of Akatosh': 'BlessingAkatosh',
  'Blessing of Arkay': 'BlessingArkay',
  'Blessing of Dibella': 'BlessingDibella',
  'Blessing of Julianos': 'BlessingJulianos',
  'Blessing of Kynareth': 'BlessingKynareth',
  'Blessing of Mara': 'BlessingMara',
  'Blessing of Stendarr': 'BlessingStendarr',
  'Blessing of Talos': 'BlessingTalos',
  'Blessing of Zenithar': 'BlessingZenithar',
  'Blessing of Nocturnal': 'BlessingNocturnal',
  'Blessing of Azura': 'BlessingAzura',
  'Blessing of Boethiah': 'BlessingBoethiah',
  'Blessing of Clavicus Vile': 'BlessingClavicusVile',
  'Blessing of Hermaeus Mora': 'BlessingHermaeusMora',
  'Blessing of Hircine': 'BlessingHircine',
  'Blessing of Malacath': 'BlessingMalacath',
  'Blessing of Mehrunes Dagon': 'BlessingMehrunesDagon',
  'Blessing of Mephala': 'BlessingMephala',
  'Blessing of Meridia': 'BlessingMeridia',
  'Blessing of Molag Bal': 'BlessingMolagBal',
  'Blessing of Namira': 'BlessingNamira',
  'Blessing of Peryite': 'BlessingPeryite',
  'Blessing of Sanguine': 'BlessingSanguine',
  'Blessing of Sheogorath': 'BlessingSheogorath',
  'Blessing of Vaermina': 'BlessingVaermina',
};

// Add helper function
export function getBlessingEdid(blessingName: string): string {
  return BLESSING_NAME_TO_EDID[blessingName] || blessingName;
}
```

### 3. JSON Data File
**File:** `src/features/gigaplanner/data/blessings.json`

```json
[
  {
    "id": "akatosh",
    "name": "Blessing of Akatosh",
    "edid": "BlessingAkatosh",
    "description": "Akatosh, the Dragon God of Time, grants protection against time-based effects.",
    "effects": "Resist magic 10%. Magicka regeneration increased by 25%.",
    "source": "Temple of the Divines"
  },
  {
    "id": "arkay",
    "name": "Blessing of Arkay",
    "edid": "BlessingArkay",
    "description": "Arkay, the God of the Cycle of Birth and Death, provides protection against undead.",
    "effects": "Resist disease 25%. Health regeneration increased by 25%.",
    "source": "Temple of the Divines"
  },
  {
    "id": "dibella",
    "name": "Blessing of Dibella",
    "edid": "BlessingDibella",
    "description": "Dibella, the Goddess of Beauty, enhances speech and persuasion abilities.",
    "effects": "Speech skill increased by 10. Prices are 10% better when buying and selling.",
    "source": "Temple of the Divines"
  }
]
```

**Note:** Complete the array with all blessings following the same pattern.

### 4. Update Data Loader
**File:** `src/features/gigaplanner/adapters/dataLoader.ts`

```typescript
// Add to existing GigaPlannerDataLoader class
async loadBlessings(): Promise<GigaPlannerBlessing[]> {
  if (this.cache.has('blessings')) {
    return this.cache.get('blessings');
  }
  
  try {
    const data = await import('../data/blessings.json');
    this.cache.set('blessings', data.default);
    return data.default;
  } catch (error) {
    console.error('Failed to load blessings data:', error);
    throw new Error('Failed to load blessings data');
  }
}

// Update loadAllData method
async loadAllData(): Promise<GigaPlannerData> {
  const [races, standingStones, blessings] = await Promise.all([
    this.loadRaces(),
    this.loadStandingStones(),
    this.loadBlessings(),
  ]);
  
  return {
    races,
    standingStones,
    blessings,
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
  GigaPlannerData,
} from './data';
```

### 6. Update Tests
**File:** `src/features/gigaplanner/adapters/__tests__/dataLoader.test.ts`

```typescript
// Add to existing test file
test('should load blessings data', async () => {
  const blessings = await loader.loadBlessings();
  
  expect(blessings).toBeDefined();
  expect(Array.isArray(blessings)).toBe(true);
  expect(blessings.length).toBeGreaterThan(0);
  
  // Test first blessing structure
  const firstBlessing = blessings[0];
  expect(firstBlessing).toHaveProperty('id');
  expect(firstBlessing).toHaveProperty('name');
  expect(firstBlessing).toHaveProperty('edid');
  expect(firstBlessing).toHaveProperty('description');
  expect(firstBlessing).toHaveProperty('effects');
  expect(firstBlessing).toHaveProperty('source');
});

test('should load all data including blessings', async () => {
  const allData = await loader.loadAllData();
  
  expect(allData.races).toBeDefined();
  expect(allData.standingStones).toBeDefined();
  expect(allData.blessings).toBeDefined();
  expect(Array.isArray(allData.races)).toBe(true);
  expect(Array.isArray(allData.standingStones)).toBe(true);
  expect(Array.isArray(allData.blessings)).toBe(true);
});
```

## 🔧 Implementation Steps

1. **Analyze source data**
   - Read `docs/gigaplanner-decoder/blessingsData.js`
   - Identify all blessings and their properties
   - Note any special formatting or data structures
   - Identify blessing sources (temples, shrines, etc.)

2. **Update TypeScript types**
   - Add `GigaPlannerBlessing` interface
   - Update `GigaPlannerData` interface
   - Update index file exports

3. **Create EDID mappings**
   - Map blessing names to EDIDs
   - Create helper function for conversion
   - Include both Divine and Daedric blessings

4. **Convert JavaScript to JSON**
   - Extract blessing data from JS file
   - Add unique IDs for each blessing
   - Apply EDID mappings
   - Include source information
   - Format as valid JSON

5. **Extend data loader**
   - Add `loadBlessings` method
   - Update `loadAllData` method
   - Add caching for blessings

6. **Update tests**
   - Test blessings loading
   - Test combined data loading
   - Test error scenarios

## ✅ Acceptance Criteria

- [ ] All blessings converted to JSON
- [ ] Each blessing has unique `id` field
- [ ] Each blessing has correct `edid` mapping
- [ ] Each blessing includes source information
- [ ] Data types match TypeScript interfaces
- [ ] Data loader can load blessings successfully
- [ ] Caching mechanism works for blessings
- [ ] Error handling implemented
- [ ] Tests pass
- [ ] Existing functionality still works

## 🚨 Common Issues

### Issue: Missing Blessing Names
**Solution:** Check the source file for all blessing names and add to EDID mappings

### Issue: Source Information Missing
**Solution:** Ensure each blessing includes the source (temple, shrine, etc.)

### Issue: Divine vs Daedric Blessings
**Solution:** Distinguish between Divine and Daedric blessings in the data structure

### Issue: Large Number of Blessings
**Solution:** Consider performance implications and ensure efficient loading

## 📚 Resources

- [Source file](../blessingsData.js)
- [Previous task](./TASK_1.1.2_CONVERT_STANDING_STONES.md)
- [Phase 1 Overview](../PHASE_1_TASKS.md)

## 🔄 Next Task

After completing this task, move to [Task 1.1.4: Convert Game Mechanics](./TASK_1.1.4_CONVERT_GAME_MECHANICS.md)

