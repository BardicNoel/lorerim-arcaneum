# Task 1.1.6: Convert `perkListData.js` → `perks.json`

## 📋 Task Overview

Convert the JavaScript perks data file to JSON format with proper TypeScript types and EDID mappings. This is the largest data file (149KB) and contains complex perk structures.

## 🎯 Objectives

- [ ] Extract perks data from `perkListData.js`
- [ ] Convert to JSON format with proper structure
- [ ] Add unique IDs and EDID mappings
- [ ] Normalize skill references
- [ ] Update TypeScript interfaces
- [ ] Extend data loading infrastructure
- [ ] Add validation and error handling

## 📁 Files to Create/Modify

### 1. Update TypeScript Types
**File:** `src/features/gigaplanner/types/data.ts`

```typescript
// Add to existing file
export interface GigaPlannerPerk {
  id: string;
  name: string;
  skill: string;
  skillReq: number;
  description: string;
  edid?: string; // Our system's EDID
  rank?: number; // For multi-rank perks
  maxRank?: number; // Maximum rank for this perk
  prerequisites?: string[]; // Array of prerequisite perk IDs
}

export interface GigaPlannerPerkList {
  id: string;
  name: string;
  skillNames: string[];
  perks: GigaPlannerPerk[];
  version?: string;
  description?: string;
}

// Update GigaPlannerData interface
export interface GigaPlannerData {
  races: GigaPlannerRace[];
  standingStones: GigaPlannerStandingStone[];
  blessings: GigaPlannerBlessing[];
  gameMechanics: GigaPlannerGameMechanics[];
  presets: GigaPlannerPreset[];
  perks: GigaPlannerPerkList[];
}
```

### 2. Update EDID Mappings
**File:** `src/features/gigaplanner/adapters/mappings.ts`

```typescript
// Add to existing file
export const PERK_NAME_TO_EDID: Record<string, string> = {
  // Smithing perks
  'Advanced Armors': 'PerkAdvancedArmors',
  'Dwarven Smithing': 'PerkDwarvenSmithing',
  'Steel Smithing': 'PerkSteelSmithing',
  'Elven Smithing': 'PerkElvenSmithing',
  'Orcish Smithing': 'PerkOrcishSmithing',
  'Ebony Smithing': 'PerkEbonySmithing',
  'Daedric Smithing': 'PerkDaedricSmithing',
  
  // Heavy Armor perks
  'Juggernaut': 'PerkJuggernaut',
  'Fists of Steel': 'PerkFistsOfSteel',
  'Well Fitted': 'PerkWellFitted',
  'Tower of Strength': 'PerkTowerOfStrength',
  
  // Add more perk mappings as needed
};

// Add helper function
export function getPerkEdid(perkName: string): string {
  return PERK_NAME_TO_EDID[perkName] || perkName;
}

// Skill name mappings
export const SKILL_NAMES = [
  'Smithing',
  'Heavy Armor',
  'Block',
  'Two-handed',
  'One-handed',
  'Marksman',
  'Evasion',
  'Sneak',
  'Wayfarer',
  'Finesse',
  'Speech',
  'Alchemy',
  'Illusion',
  'Conjuration',
  'Destruction',
  'Restoration',
  'Alteration',
  'Enchanting'
] as const;

export type SkillName = typeof SKILL_NAMES[number];
```

### 3. JSON Data File
**File:** `src/features/gigaplanner/data/perks.json`

```json
{
  "perkLists": [
    {
      "id": "loreRimV4",
      "name": "LoreRim v4",
      "version": "4.0.0",
      "description": "LoreRim v4 perk list with balanced and lore-friendly perks.",
      "skillNames": [
        "Smithing",
        "Heavy Armor",
        "Block",
        "Two-handed",
        "One-handed",
        "Marksman",
        "Evasion",
        "Sneak",
        "Wayfarer",
        "Finesse",
        "Speech",
        "Alchemy",
        "Illusion",
        "Conjuration",
        "Destruction",
        "Restoration",
        "Alteration",
        "Enchanting"
      ],
      "perks": [
        {
          "id": "advancedArmors",
          "name": "Advanced Armors",
          "skill": "Smithing",
          "skillReq": 30,
          "description": "You can craft advanced armor types including steel plate and scaled armor.",
          "edid": "PerkAdvancedArmors",
          "rank": 1,
          "maxRank": 1,
          "prerequisites": []
        },
        {
          "id": "dwarvenSmithing",
          "name": "Dwarven Smithing",
          "skill": "Smithing",
          "skillReq": 30,
          "description": "You can craft Dwarven armor and weapons.",
          "edid": "PerkDwarvenSmithing",
          "rank": 1,
          "maxRank": 1,
          "prerequisites": ["advancedArmors"]
        },
        {
          "id": "juggernaut",
          "name": "Juggernaut",
          "skill": "Heavy Armor",
          "skillReq": 20,
          "description": "Heavy armor is 20% more effective.",
          "edid": "PerkJuggernaut",
          "rank": 1,
          "maxRank": 5,
          "prerequisites": []
        }
      ]
    }
  ]
}
```

**Note:** Complete the array with all perk lists and their perks following the same pattern.

### 4. Update Data Loader
**File:** `src/features/gigaplanner/adapters/dataLoader.ts`

```typescript
// Add to existing GigaPlannerDataLoader class
async loadPerks(): Promise<GigaPlannerPerkList[]> {
  if (this.cache.has('perks')) {
    return this.cache.get('perks');
  }
  
  try {
    const data = await import('../data/perks.json');
    this.cache.set('perks', data.default.perkLists);
    return data.default.perkLists;
  } catch (error) {
    console.error('Failed to load perks data:', error);
    throw new Error('Failed to load perks data');
  }
}

// Update loadAllData method
async loadAllData(): Promise<GigaPlannerData> {
  const [races, standingStones, blessings, gameMechanics, presets, perks] = await Promise.all([
    this.loadRaces(),
    this.loadStandingStones(),
    this.loadBlessings(),
    this.loadGameMechanics(),
    this.loadPresets(),
    this.loadPerks(),
  ]);
  
  return {
    races,
    standingStones,
    blessings,
    gameMechanics,
    presets,
    perks,
  };
}

// Add helper methods for perk operations
getPerkListById(id: string): GigaPlannerPerkList | undefined {
  return this.cache.get('perks')?.find(list => list.id === id);
}

getPerksBySkill(skillName: string): GigaPlannerPerk[] {
  const allPerks: GigaPlannerPerk[] = [];
  this.cache.get('perks')?.forEach(list => {
    allPerks.push(...list.perks.filter(perk => perk.skill === skillName));
  });
  return allPerks;
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
  GigaPlannerPerk,
  GigaPlannerPerkList,
  GigaPlannerData,
} from './data';
```

### 6. Update Tests
**File:** `src/features/gigaplanner/adapters/__tests__/dataLoader.test.ts`

```typescript
// Add to existing test file
test('should load perks data', async () => {
  const perks = await loader.loadPerks();
  
  expect(perks).toBeDefined();
  expect(Array.isArray(perks)).toBe(true);
  expect(perks.length).toBeGreaterThan(0);
  
  // Test first perk list structure
  const firstPerkList = perks[0];
  expect(firstPerkList).toHaveProperty('id');
  expect(firstPerkList).toHaveProperty('name');
  expect(firstPerkList).toHaveProperty('skillNames');
  expect(firstPerkList).toHaveProperty('perks');
  expect(Array.isArray(firstPerkList.skillNames)).toBe(true);
  expect(Array.isArray(firstPerkList.perks)).toBe(true);
  
  // Test first perk structure
  const firstPerk = firstPerkList.perks[0];
  expect(firstPerk).toHaveProperty('id');
  expect(firstPerk).toHaveProperty('name');
  expect(firstPerk).toHaveProperty('skill');
  expect(firstPerk).toHaveProperty('skillReq');
  expect(firstPerk).toHaveProperty('description');
});

test('should load all data including perks', async () => {
  const allData = await loader.loadAllData();
  
  expect(allData.races).toBeDefined();
  expect(allData.standingStones).toBeDefined();
  expect(allData.blessings).toBeDefined();
  expect(allData.gameMechanics).toBeDefined();
  expect(allData.presets).toBeDefined();
  expect(allData.perks).toBeDefined();
  expect(Array.isArray(allData.perks)).toBe(true);
});

test('should handle perk list operations', async () => {
  await loader.loadPerks();
  
  const loreRimList = loader.getPerkListById('loreRimV4');
  expect(loreRimList).toBeDefined();
  expect(loreRimList?.name).toBe('LoreRim v4');
  
  const smithingPerks = loader.getPerksBySkill('Smithing');
  expect(Array.isArray(smithingPerks)).toBe(true);
  expect(smithingPerks.length).toBeGreaterThan(0);
  smithingPerks.forEach(perk => {
    expect(perk.skill).toBe('Smithing');
  });
});

test('should validate perk prerequisites', async () => {
  const perks = await loader.loadPerks();
  
  perks.forEach(perkList => {
    perkList.perks.forEach(perk => {
      if (perk.prerequisites && perk.prerequisites.length > 0) {
        perk.prerequisites.forEach(prereqId => {
          const prereqExists = perkList.perks.some(p => p.id === prereqId);
          expect(prereqExists).toBe(true);
        });
      }
    });
  });
});
```

## 🔧 Implementation Steps

1. **Analyze source data**
   - Read `docs/gigaplanner-decoder/perkListData.js`
   - Identify all perk lists and their structures
   - Note skill name arrays and perk relationships
   - Understand prerequisite systems

2. **Update TypeScript types**
   - Add `GigaPlannerPerk` interface
   - Add `GigaPlannerPerkList` interface
   - Update `GigaPlannerData` interface
   - Update index file exports

3. **Create EDID mappings**
   - Map perk names to EDIDs
   - Create skill name constants
   - Create helper functions for conversion

4. **Convert JavaScript to JSON**
   - Extract perk data from JS file
   - Normalize skill references to use names instead of indices
   - Add unique IDs for each perk
   - Apply EDID mappings
   - Include prerequisite relationships
   - Format as valid JSON

5. **Extend data loader**
   - Add `loadPerks` method
   - Update `loadAllData` method
   - Add helper methods for perk operations
   - Add caching for perks

6. **Update tests**
   - Test perks loading
   - Test combined data loading
   - Test perk list operations
   - Test prerequisite validation
   - Test error scenarios

## ✅ Acceptance Criteria

- [ ] All perk lists converted to JSON
- [ ] All perks converted to JSON
- [ ] Each perk has unique `id` field
- [ ] Each perk has correct `edid` mapping
- [ ] Skill references use names instead of indices
- [ ] Prerequisite relationships are properly structured
- [ ] Data types match TypeScript interfaces
- [ ] Data loader can load perks successfully
- [ ] Caching mechanism works for perks
- [ ] Helper methods work correctly
- [ ] Error handling implemented
- [ ] Tests pass
- [ ] Existing functionality still works

## 🚨 Common Issues

### Issue: Large File Size
**Solution:** Consider lazy loading or chunking for large perk data

### Issue: Skill Index References
**Solution:** Convert all skill index references to skill names

### Issue: Complex Prerequisites
**Solution:** Ensure prerequisite relationships are properly validated

### Issue: Missing Perk Names
**Solution:** Check the source file for all perk names and add to EDID mappings

### Issue: Performance with Large Data
**Solution:** Implement efficient caching and loading strategies

## 📚 Resources

- [Source file](../perkListData.js)
- [Previous task](./TASK_1.1.5_CONVERT_PRESETS.md)
- [Phase 1 Overview](../PHASE_1_TASKS.md)

## 🔄 Next Task

After completing this task, move to [Task 1.2: Create Core Types](./TASK_1.2_CREATE_CORE_TYPES.md)

