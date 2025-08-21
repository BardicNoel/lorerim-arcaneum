# Task 1.1.1: Convert `raceListData.js` → `races.json`

## 📋 Task Overview

Convert the JavaScript race data file to JSON format with proper TypeScript types and EDID mappings.

## 🎯 Objectives

- [ ] Extract race data from `raceListData.js`
- [ ] Convert to JSON format with proper structure
- [ ] Add unique IDs and EDID mappings
- [ ] Create TypeScript interfaces
- [ ] Implement data loading infrastructure
- [ ] Add validation and error handling

## 📁 Files to Create/Modify

### 1. TypeScript Types
**File:** `src/features/gigaplanner/types/data.ts`

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

// Complete data structure
export interface GigaPlannerData {
  races: GigaPlannerRace[];
  perks?: any; // Will be defined later
  standingStones?: any; // Will be defined later
  blessings?: any; // Will be defined later
  gameMechanics?: any; // Will be defined later
  presets?: any; // Will be defined later
}
```

### 2. EDID Mappings
**File:** `src/features/gigaplanner/adapters/mappings.ts`

```typescript
// Race name to EDID mapping
export const RACE_NAME_TO_EDID: Record<string, string> = {
  'Argonian': 'ArgonianRace',
  'Breton': 'BretonRace',
  'Dunmer': 'DarkElfRace',
  'Altmer': 'HighElfRace',
  'Imperial': 'ImperialRace',
  'Khajiit': 'KhajiitRace',
  'Nord': 'NordRace',
  'Orc': 'OrcRace',
  'Redguard': 'RedguardRace',
  'Bosmer': 'WoodElfRace',
};

// Helper function to get EDID from race name
export function getRaceEdid(raceName: string): string {
  return RACE_NAME_TO_EDID[raceName] || raceName;
}
```

### 3. JSON Data File
**File:** `src/features/gigaplanner/data/races.json`

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
    "description": "Argonians are the reptilian denizens of Black Marsh. Years of defending their borders have made them experts in stealth and evasion, and their natural abilities make them equally at home in water and on land. They are resistant to diseases and poisons and enjoy raw meat. Their Histskin allows them to quickly heal their wounds.",
    "bonus": "• Waterbreathing: Your Argonian lungs can breathe underwater, while you also find it much easier to swim than members of other races. You can breathe underwater, swimming is 20% faster, swimming is 75% less exhausting.\n• Claws: Bestial claws are extremely sharp - sharp enough to easily shred through flesh, making them much more lethal than normal hands. Unarmed damage is increased by 20.\n• Histskin: Argonians can nautrally regenerate health faster than others, and their metabolism increases the effect of alchemical substances. Regenerate 1 health per second, potions are 10% more effective and last longer.\n• Resist Poison and Disease: Your Argonian blood greatly reduces the effect of poison and disease. Poison deals 75% less damage to you, you are 75% less likely to contract diseases.\n• Strong Stomach: Your metabolism can digest raw food without food poisoning."
  },
  {
    "id": "breton",
    "name": "Breton",
    "edid": "BretonRace",
    "startingHMS": [120, 140, 100],
    "startingCW": 200,
    "speedBonus": 0,
    "hmsBonus": [0, 0, 0],
    "startingHMSRegen": [0.15, 1.15, 1.60],
    "unarmedDam": 12,
    "startingSkills": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 15, 0, 10, 0, 10, 1, 0],
    "description": "Bretons, the inhabitants of the province of High Rock, are the human descendants of the Elves and the ancient race of the Nedes. While Bretons are physically weak, they can tap on magicka more than any other human race and they are particularly capable in the school of Conjuration. Their magic resistance blocks one fifth of incoming spell damage and their Dragonskin ability can fully absorb harmful magic by chance.",
    "bonus": "• Magic Resistance: Your Breton blood reduces damage taken from all magical sources. Magic deals 15% less damage to you.\n• Dragonskin: Bretons can naturally absorb harmful magic by chance. Increases chance to absorb the magicka from hostile spells by 10%."
  }
]
```

**Note:** Complete the array with all 10 races following the same pattern.

### 4. Data Loader
**File:** `src/features/gigaplanner/adapters/dataLoader.ts`

```typescript
import type { GigaPlannerRace, GigaPlannerData } from '../types/data';

export class GigaPlannerDataLoader {
  private cache: Map<string, any> = new Map();
  
  async loadRaces(): Promise<GigaPlannerRace[]> {
    if (this.cache.has('races')) {
      return this.cache.get('races');
    }
    
    try {
      const data = await import('../data/races.json');
      this.cache.set('races', data.default);
      return data.default;
    } catch (error) {
      console.error('Failed to load races data:', error);
      throw new Error('Failed to load races data');
    }
  }
  
  async loadAllData(): Promise<GigaPlannerData> {
    const races = await this.loadRaces();
    
    return {
      races,
      // Other data types will be added as they're converted
    };
  }
  
  clearCache(): void {
    this.cache.clear();
  }
}
```

### 5. Index File
**File:** `src/features/gigaplanner/types/index.ts`

```typescript
// Data types
export type {
  GigaPlannerRace,
  GigaPlannerData,
} from './data';
```

### 6. Tests
**File:** `src/features/gigaplanner/adapters/__tests__/dataLoader.test.ts`

```typescript
import { GigaPlannerDataLoader } from '../dataLoader';

describe('GigaPlannerDataLoader', () => {
  let loader: GigaPlannerDataLoader;
  
  beforeEach(() => {
    loader = new GigaPlannerDataLoader();
  });
  
  afterEach(() => {
    loader.clearCache();
  });
  
  test('should load races data', async () => {
    const races = await loader.loadRaces();
    
    expect(races).toBeDefined();
    expect(Array.isArray(races)).toBe(true);
    expect(races.length).toBe(10);
    
    // Test first race structure
    const firstRace = races[0];
    expect(firstRace).toHaveProperty('id');
    expect(firstRace).toHaveProperty('name');
    expect(firstRace).toHaveProperty('edid');
    expect(firstRace).toHaveProperty('startingHMS');
    expect(firstRace).toHaveProperty('startingSkills');
  });
  
  test('should cache races data', async () => {
    const races1 = await loader.loadRaces();
    const races2 = await loader.loadRaces();
    
    expect(races1).toBe(races2); // Same reference due to caching
  });
});
```

## 🔧 Implementation Steps

1. **Create directory structure**
   ```bash
   mkdir -p src/features/gigaplanner/data
   mkdir -p src/features/gigaplanner/types
   mkdir -p src/features/gigaplanner/adapters
   mkdir -p src/features/gigaplanner/adapters/__tests__
   ```

2. **Analyze source data**
   - Read `docs/gigaplanner-decoder/raceListData.js`
   - Identify all 10 races and their properties
   - Note any special formatting or data structures

3. **Create TypeScript types**
   - Define `GigaPlannerRace` interface
   - Define `GigaPlannerData` interface
   - Export from index file

4. **Create EDID mappings**
   - Map race names to EDIDs
   - Create helper function for conversion

5. **Convert JavaScript to JSON**
   - Extract race data from JS file
   - Add unique IDs for each race
   - Apply EDID mappings
   - Format as valid JSON

6. **Implement data loader**
   - Create `GigaPlannerDataLoader` class
   - Add caching mechanism
   - Add error handling

7. **Write tests**
   - Test data loading
   - Test caching
   - Test error scenarios

## ✅ Acceptance Criteria

- [ ] All 10 races converted to JSON
- [ ] Each race has unique `id` field
- [ ] Each race has correct `edid` mapping
- [ ] Data types match TypeScript interfaces
- [ ] Data loader can load races successfully
- [ ] Caching mechanism works
- [ ] Error handling implemented
- [ ] Tests pass

## 🚨 Common Issues

### Issue: JSON Import Errors
**Solution:** Ensure JSON files are in the correct location and properly formatted

### Issue: Type Mismatches
**Solution:** Verify all data matches the TypeScript interfaces exactly

### Issue: Missing EDID Mappings
**Solution:** Check the `mappings.ts` file and add any missing race names

### Issue: Cache Not Working
**Solution:** Ensure the cache key matches between set and get operations

## 📚 Resources

- [Source file](../raceListData.js)
- [Quick Start Guide](../QUICK_START_GUIDE.md)
- [Phase 1 Overview](../PHASE_1_TASKS.md)

## 🔄 Next Task

After completing this task, move to [Task 1.1.2: Convert Standing Stones](./TASK_1.1.2_CONVERT_STANDING_STONES.md)

