# Quick Start Guide: Converting Race Data

## 🎯 First Task: Convert `raceListData.js` → `races.json`

This guide will walk you through converting the first JavaScript data file to JSON format, establishing the pattern for all subsequent conversions.

## 📋 Prerequisites

1. **Project Setup**: Ensure you're in the project root directory
2. **File Access**: Access to `docs/gigaplanner-decoder/raceListData.js`
3. **Target Directory**: Create `src/features/gigaplanner/data/` directory

## 🚀 Step-by-Step Implementation

### Step 1: Create Directory Structure

```bash
# Create the gigaplanner feature directory
mkdir -p src/features/gigaplanner/data
mkdir -p src/features/gigaplanner/types
mkdir -p src/features/gigaplanner/adapters
```

### Step 2: Analyze Source Data

**File:** `docs/gigaplanner-decoder/raceListData.js`

**Key Observations:**
- Contains `raceListData` array with 10 race objects
- Each race has: `name`, `startingHMS`, `startingCW`, `speedBonus`, `hmsBonus`, `startingHMSRegen`, `unarmedDam`, `startingSkills`, `desc`, `bonus`
- Races: Argonian, Breton, Dunmer, Altmer, Imperial, Khajiit, Nord, Orc, Redguard, Bosmer

### Step 3: Create TypeScript Types

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

### Step 4: Create EDID Mapping

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

### Step 5: Convert JavaScript to JSON

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

### Step 6: Create Data Loader

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

### Step 7: Create Index File

**File:** `src/features/gigaplanner/types/index.ts`

```typescript
// Data types
export type {
  GigaPlannerRace,
  GigaPlannerData,
} from './data';
```

### Step 8: Test the Implementation

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

## ✅ Validation Checklist

- [ ] All 10 races converted to JSON
- [ ] Each race has unique `id` field
- [ ] Each race has correct `edid` mapping
- [ ] Data types match TypeScript interfaces
- [ ] Data loader can load races successfully
- [ ] Caching mechanism works
- [ ] Error handling implemented
- [ ] Tests pass

## 🔄 Next Steps

After completing this task:

1. **Move to next data file**: Convert `standingStoneData.js` → `standingStones.json`
2. **Follow same pattern**: Use the established structure and patterns
3. **Update types**: Add new interfaces to `data.ts`
4. **Update loader**: Add new loading methods to `dataLoader.ts`
5. **Add tests**: Create tests for new data types

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

- [TypeScript JSON Import](https://www.typescriptlang.org/docs/handbook/modules.html#json-modules)
- [JavaScript to JSON Conversion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)
- [Project Structure Guidelines](../GIGAPLANNER_INTEGRATION_PLAN.md#file-structure)

