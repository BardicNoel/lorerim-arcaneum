# URL Compression Analysis - Version 2+

## Current Build Structure Analysis

```json
{
  "v": 2,
  "name": "",
  "notes": "",
  "race": null,
  "stone": null,
  "religion": null,
  "favoriteBlessing": null,
  "skills": {"major": [], "minor": []},
  "traits": {"regular": [], "bonus": []},
  "traitLimits": {"regular": 2, "bonus": 1},
  "skillLevels": {"AVDestruction": 25},
  "equipment": [],
  "userProgress": {"unlocks": []},
  "destinyPath": [],
  "attributeAssignments": {
    "health": 0,
    "stamina": 0,
    "magicka": 0,
    "level": 1,
    "assignments": {}
  },
  "p": {"DST": [0, 12]}
}
```

## URL Parameter Compression Table

| **Current Property** | **Current Size** | **Proposed Short** | **Compression Strategy** | **Estimated Savings** |
|---------------------|------------------|-------------------|-------------------------|----------------------|
| `v` | 1 char | `v` | Keep as-is (version) | 0% |
| `name` | 4 chars | `n` | Single letter mapping | 75% |
| `notes` | 5 chars | `o` | Single letter mapping | 80% |
| `race` | 4 chars | `r` | Single letter mapping | 75% |
| `stone` | 5 chars | `s` | Single letter mapping | 80% |
| `religion` | 8 chars | `g` | Single letter mapping | 87.5% |
| `favoriteBlessing` | 16 chars | `f` | Single letter mapping | 93.75% |
| `skills` | 6 chars | `k` | Single letter mapping | 83.3% |
| `traits` | 6 chars | `t` | Single letter mapping | 83.3% |
| `traitLimits` | 11 chars | `l` | Single letter mapping | 90.9% |
| `skillLevels` | 11 chars | `sl` | Two letter mapping | 81.8% |
| `equipment` | 9 chars | `e` | Single letter mapping | 88.9% |
| `userProgress` | 12 chars | `u` | Single letter mapping | 91.7% |
| `destinyPath` | 11 chars | `d` | Single letter mapping | 90.9% |
| `attributeAssignments` | 20 chars | `a` | Single letter mapping | 95% |
| `p` | 1 char | `p` | Keep as-is (perks) | 0% |

## Detailed Field Usage Analysis

### 1. **String Properties** (High Impact)

#### **`name`** → `n`: 75% reduction
- **Usage**: Character name displayed in UI, Discord exports, build sharing
- **Importance**: HIGH - Core character identity
- **Compression**: Safe to compress to `n`
- **Notes**: Used in `BasicInfoCard`, `buildExportService`, Discord formatting

#### **`notes`** → `o`: 80% reduction  
- **Usage**: RP flavor text, build explanations, user comments
- **Importance**: MEDIUM - User-generated content, can be long
- **Compression**: Safe to compress to `o`
- **Notes**: Used in `BasicInfoCard`, Discord exports, can be multi-line

#### **`race`** → `r`: 75% reduction
- **Usage**: Character race selection, affects starting stats, skill bonuses
- **Importance**: HIGH - Core character identity, affects calculations
- **Compression**: Safe to compress to `r`
- **Notes**: Used in attribute calculations, skill level calculations, Discord exports

#### **`stone`** → `s`: 80% reduction
- **Usage**: Birthsign/standing stone selection, affects character abilities
- **Importance**: HIGH - Core character identity, affects gameplay
- **Compression**: Safe to compress to `s`
- **Notes**: Used in `useCharacterBuild`, Discord exports, GigaPlanner integration

#### **`religion`** → `g`: 87.5% reduction
- **Usage**: Deity selection, affects character roleplay and abilities
- **Importance**: MEDIUM - Roleplay element, affects some mechanics
- **Compression**: Safe to compress to `g`
- **Notes**: Used in `ReligionSelectionCard`, Discord exports, GigaPlanner integration

#### **`favoriteBlessing`** → `f`: 93.75% reduction
- **Usage**: Blessing source selection, can be different from religion
- **Importance**: MEDIUM - Roleplay element, affects some mechanics
- **Compression**: Safe to compress to `f`
- **Notes**: Used in `FavoriteBlessingSelectionCard`, Discord exports, GigaPlanner integration

### 2. **Object Properties** (Medium Impact)

#### **`skills`** → `k`: 83.3% reduction
- **Usage**: Major/minor skill assignments, affects skill level calculations
- **Importance**: HIGH - Core character build, affects perk selection
- **Compression**: Safe to compress to `k`
- **Notes**: Used in `useCharacterBuild`, skill level calculations, Discord exports
- **Structure**: `{major: string[], minor: string[]}`

#### **`traits`** → `t`: 83.3% reduction
- **Usage**: Regular and bonus trait selections, affects character abilities
- **Importance**: HIGH - Core character build, affects gameplay
- **Compression**: Safe to compress to `t`
- **Notes**: Used in `useCharacterBuild`, Discord exports, GigaPlanner integration
- **Structure**: `{regular: string[], bonus: string[]}`

#### **`traitLimits`** → `l`: 90.9% reduction
- **Usage**: Maximum number of traits allowed (regular: 2, bonus: 1)
- **Importance**: MEDIUM - Configuration, rarely changes from defaults
- **Compression**: Safe to compress to `l`
- **Notes**: Used in `useTraitLimits`, trait management logic
- **Structure**: `{regular: number, bonus: number}`

#### **`skillLevels`** → `sl`: 81.8% reduction
- **Usage**: Minimum required skill levels based on selected perks
- **Importance**: HIGH - Calculated field, affects skill display
- **Compression**: Safe to compress to `sl`
- **Notes**: Used in skill level calculations, Discord exports
- **Structure**: `Record<string, number>` (skillId -> level)

#### **`equipment`** → `e`: 88.9% reduction
- **Usage**: Equipment selections, affects character build
- **Importance**: MEDIUM - Equipment tracking, not heavily used
- **Compression**: Safe to compress to `e`
- **Notes**: Used in `useCharacterBuild`, Discord exports
- **Structure**: `string[]` (array of EDIDs)

#### **`userProgress`** → `u`: 91.7% reduction
- **Usage**: User unlock progress, game completion tracking
- **Importance**: LOW - Not heavily used in current implementation
- **Compression**: Safe to compress to `u`
- **Notes**: Used in validation, mostly empty in practice
- **Structure**: `{unlocks: string[]}`

#### **`destinyPath`** → `d`: 90.9% reduction
- **Usage**: Destiny path selection, affects character progression
- **Importance**: MEDIUM - Roleplay element, affects some mechanics
- **Compression**: Safe to compress to `d`
- **Notes**: Used in `BuildPageDestinyCard`, Discord exports, GigaPlanner integration
- **Structure**: `string[]` (array of DestinyNode EDIDs)

#### **`attributeAssignments`** → `a`: 95% reduction
- **Usage**: Health/stamina/magicka assignments per level, character progression
- **Importance**: HIGH - Core character progression, affects calculations
- **Compression**: Safe to compress to `a`
- **Notes**: Used in `useAttributeAssignments`, Discord exports, GigaPlanner integration
- **Structure**: `{health: number, stamina: number, magicka: number, level: number, assignments: Record<number, 'health' | 'stamina' | 'magicka'>}`

### 3. **Special Cases** (Low Impact)

#### **`v`** → Keep as-is (version identifier)
- **Usage**: Schema version for backwards compatibility
- **Importance**: HIGH - Critical for migration and compatibility
- **Compression**: Keep as-is
- **Notes**: Used in validation, migration logic, URL encoding

#### **`p`** → Keep as-is (perks, already compact)
- **Usage**: Compact perk representation (v2+ format)
- **Importance**: HIGH - Core character build data
- **Compression**: Already optimized in v2
- **Notes**: Used in `compactPerkEncoding`, URL encoding, build state
- **Structure**: `Record<string, number[]>` (skillId -> perk indexes)

## Compression Strategies by Property

### **High Priority (Biggest Impact)**

#### 1. **`attributeAssignments` → `a`**
- **Current**: 20 characters
- **Proposed**: 1 character
- **Savings**: 95% (19 chars)
- **Strategy**: Single letter mapping
- **Risk**: Low (unambiguous)
- **Usage**: Core character progression, affects calculations

#### 2. **`favoriteBlessing` → `f`**
- **Current**: 16 characters
- **Proposed**: 1 character
- **Savings**: 93.75% (15 chars)
- **Strategy**: Single letter mapping
- **Risk**: Low (unambiguous)
- **Usage**: Roleplay element, affects some mechanics

#### 3. **`userProgress` → `u`**
- **Current**: 12 characters
- **Proposed**: 1 character
- **Savings**: 91.7% (11 chars)
- **Strategy**: Single letter mapping
- **Risk**: Low (unambiguous)
- **Usage**: Not heavily used, mostly empty in practice

### **Medium Priority (Good Impact)**

#### 4. **`traitLimits` → `l`**
- **Current**: 11 characters
- **Proposed**: 1 character
- **Savings**: 90.9% (10 chars)
- **Strategy**: Single letter mapping
- **Risk**: Low (unambiguous)
- **Usage**: Configuration, rarely changes from defaults

#### 5. **`destinyPath` → `d`**
- **Current**: 11 characters
- **Proposed**: 1 character
- **Savings**: 90.9% (10 chars)
- **Strategy**: Single letter mapping
- **Risk**: Low (unambiguous)
- **Usage**: Roleplay element, affects some mechanics

#### 6. **`skillLevels` → `sl`**
- **Current**: 11 characters
- **Proposed**: 2 characters
- **Savings**: 81.8% (9 chars)
- **Strategy**: Two letter mapping (avoid conflict with `s` for stone)
- **Risk**: Low (unambiguous)
- **Usage**: Calculated field, affects skill display

### **Lower Priority (Still Beneficial)**

#### 7. **`equipment` → `e`**
- **Current**: 9 characters
- **Proposed**: 1 character
- **Savings**: 88.9% (8 chars)
- **Strategy**: Single letter mapping
- **Risk**: Low (unambiguous)
- **Usage**: Equipment tracking, not heavily used

#### 8. **`religion` → `g`**
- **Current**: 8 characters
- **Proposed**: 1 character
- **Savings**: 87.5% (7 chars)
- **Strategy**: Single letter mapping
- **Risk**: Low (unambiguous)
- **Usage**: Roleplay element, affects some mechanics

#### 9. **`skills` → `k`**
- **Current**: 6 characters
- **Proposed**: 1 character
- **Savings**: 83.3% (5 chars)
- **Strategy**: Single letter mapping
- **Risk**: Low (unambiguous)
- **Usage**: Core character build, affects perk selection

#### 10. **`traits` → `t`**
- **Current**: 6 characters
- **Proposed**: 1 character
- **Savings**: 83.3% (5 chars)
- **Strategy**: Single letter mapping
- **Risk**: Low (unambiguous)
- **Usage**: Core character build, affects gameplay

## Proposed Compressed Structure

```json
{
  "v": 2,
  "n": "",
  "o": "",
  "r": null,
  "s": null,
  "g": null,
  "f": null,
  "k": {"ma": [], "mi": []},
  "t": {"r": [], "b": []},
  "l": [2, 1],
  "sl": {1: 25},
  "e": [],
  "d": [],
  "a": {
    "h": 0,
    "st": 0,
    "m": 0,
    "l": 1,
    "as": {}
  },
  "p": {1: [0, 12]}
}
```

## Field Usage Summary

### **Essential Fields (Must Keep)**
- **`v`**: Version identifier - critical for migration
- **`n`**: Character name - core identity
- **`r`**: Race - affects calculations
- **`s`**: Stone/birthsign - affects gameplay
- **`k`**: Skills - core build data
- **`t`**: Traits - core build data
- **`p`**: Perks - core build data (already compact)

### **Important Fields (Should Keep)**
- **`sl`**: Skill levels - calculated field
- **`a`**: Attribute assignments - character progression
- **`l`**: Trait limits - configuration

### **Optional Fields (Could Remove)**
- **`o`**: Notes - user-generated content
- **`g`**: Religion - roleplay element
- **`f`**: Favorite blessing - roleplay element
- **`e`**: Equipment - not heavily used
- **`d`**: Destiny path - roleplay element

### **Removed Fields**
- **`u`**: User progress - removed entirely (not heavily used, mostly empty)

## Estimated Total Savings

- **Current total property names**: ~140 characters
- **Compressed total property names**: ~20 characters
- **Total savings**: ~120 characters (85.7% reduction)
- **URL impact**: Significant reduction in build parameter size

## Compression Recommendations

### **Phase 1: High Impact Fields**
1. **`attributeAssignments` → `a`** (95% reduction)
2. **`favoriteBlessing` → `f`** (93.75% reduction)
3. **`userProgress` → `u`** (91.7% reduction)

### **Phase 2: Medium Impact Fields**
4. **`traitLimits` → `l`** (90.9% reduction)
5. **`destinyPath` → `d`** (90.9% reduction)
6. **`skillLevels` → `sl`** (81.8% reduction)

### **Phase 3: Lower Impact Fields**
7. **`equipment` → `e`** (88.9% reduction)
8. **`religion` → `g`** (87.5% reduction)
9. **`skills` → `k`** (83.3% reduction)
10. **`traits` → `t`** (83.3% reduction)

### **Phase 4: String Fields**
11. **`name` → `n`** (75% reduction)
12. **`notes` → `o`** (80% reduction)
13. **`race` → `r`** (75% reduction)
14. **`stone` → `s`** (80% reduction)

## Implementation Considerations

### **Backwards Compatibility**
- Need migration functions for v2 → v3
- Support both formats during transition
- Gradual migration strategy

### **Code Changes Required**
- Update type definitions
- Update encoding/decoding functions
- Update validation logic
- Update all references in codebase

### **Testing Strategy**
- Unit tests for compression/decompression
- Integration tests for migration
- Performance tests for URL size reduction
- Backwards compatibility tests

## Field Removal Considerations

### **Fields That Could Be Removed Entirely**
1. **`userProgress`** - Not heavily used, mostly empty
2. **`equipment`** - Not heavily used in current implementation
3. **`notes`** - User-generated content, can be very long

### **Fields That Could Be Simplified**
1. **`traitLimits`** - Could be hardcoded to defaults (regular: 2, bonus: 1)
2. **`destinyPath`** - Could be optional, not critical for core build

### **Fields That Must Be Kept**
1. **`v`** - Version identifier
2. **`n`** - Character name
3. **`r`** - Race
4. **`s`** - Stone/birthsign
5. **`k`** - Skills
6. **`t`** - Traits
7. **`p`** - Perks
8. **`sl`** - Skill levels
9. **`a`** - Attribute assignments

## Skill Indexing System

### **Problem Identified**
We have massive duplication in skill references across different fields:

- **`p` field**: Uses compact codes like `"DST"` for Destruction
- **`sl` field**: Uses full EDIDs like `"AVDestruction"` 
- **`skills` field**: Uses full EDIDs like `"AVDestruction"`

### **Solution: Skill Index System**
Create a fixed skill index mapping where all skill references use numeric indexes:

```typescript
// Fixed skill index mapping (order must NEVER change)
export const SKILL_INDEX = [
  'AVSmithing',      // 0
  'AVDestruction',   // 1
  'AVEnchanting',    // 2
  'AVRestoration',   // 3
  'AVMysticism',     // 4 (Illusion)
  'AVConjuration',   // 5
  'AVAlteration',    // 6
  'AVSpeechcraft',   // 7
  'AVAlchemy',       // 8
  'AVSneak',         // 9
  'AVLockpicking',   // 10 (Wayfarer)
  'AVPickpocket',    // 11 (Finesse)
  'AVLightArmor',    // 12 (Evasion)
  'AVHeavyArmor',    // 13
  'AVBlock',         // 14
  'AVMarksman',      // 15
  'AVTwoHanded',     // 16
  'AVOneHanded',     // 17
] as const
```

### **Benefits of Skill Indexing**
1. **Eliminates duplication**: All skill references use the same numeric system
2. **Massive size reduction**: `"AVDestruction"` (13 chars) → `1` (1 char) = 92% reduction
3. **Consistency**: No more different naming conventions across fields
4. **Future-proof**: Easy to add new skills without breaking existing data

### **Compressed Structure with Skill Indexing**
```json
{
  "v": 2,
  "n": "",
  "o": "",
  "r": null,
  "s": null,
  "g": null,
  "f": null,
  "k": {"ma": [0, 1], "mi": [2, 3, 4]},  // Skill indexes with compressed subfields
  "t": {"r": [], "b": []},  // Compressed subfields
  "l": [2, 1],  // Tuple format: [regular, bonus]
  "sl": {1: 25},  // Skill index 1 (Destruction) = level 25
  "e": [],
  "d": [],
  "a": {
    "h": 0,    // health
    "st": 0,   // stamina  
    "m": 0,    // magicka
    "l": 1,    // level
    "as": {}   // assignments
  },
  "p": {1: [0, 12]}  // Skill index 1 (Destruction) with perk indexes [0, 12]
}
```

### **Estimated Savings from Skill Indexing**
- **Current**: `"AVDestruction"` = 13 characters
- **Compressed**: `1` = 1 character
- **Savings**: 92% reduction per skill reference
- **Total impact**: Massive reduction in URL size for builds with many skills

## Additional Optimizations

### **1. Remove `userProgress` Field**
- **Rationale**: Not heavily used, mostly empty in practice
- **Savings**: Eliminates entire field and its structure
- **Impact**: Cleaner data model, reduced complexity

### **2. Compress `traitLimits` to Tuple Format**
- **Current**: `{"regular": 2, "bonus": 1}` (25 characters)
- **Proposed**: `[2, 1]` (7 characters)
- **Savings**: 72% reduction (18 characters)
- **Conditional**: Only include if different from defaults `[2, 1]`
- **Strategy**: Omit field entirely if using default values

### **3. Compress Skills Subfields**
- **Current**: `{"major": [], "minor": []}` (22 characters)
- **Proposed**: `{"ma": [], "mi": []}` (16 characters)
- **Savings**: 27% reduction (6 characters)
- **Strategy**: Use 2-letter abbreviations for subfields

### **4. Compress Traits Subfields**
- **Current**: `{"regular": [], "bonus": []}` (26 characters)
- **Proposed**: `{"r": [], "b": []}` (14 characters)
- **Savings**: 46% reduction (12 characters)
- **Strategy**: Use single letters for subfields

### **5. Compress Attribute Assignments Subfields**
- **Current**: `{"health": 0, "stamina": 0, "magicka": 0, "level": 1, "assignments": {}}` (78 characters)
- **Proposed**: `{"h": 0, "st": 0, "m": 0, "l": 1, "as": {}}` (35 characters)
- **Savings**: 55% reduction (43 characters)
- **Strategy**: Use 1-2 letter abbreviations for all subfields

### **Total Additional Savings**
- **Property names**: ~120 characters saved
- **Subfield compression**: ~79 characters saved
- **Field removal**: ~20 characters saved (userProgress)
- **Total**: ~219 characters saved per build

## Next Steps

1. **Update v2 type definitions** with compressed property names and skill indexing
2. **Implement skill indexing system** to eliminate duplication
3. **Update v2 migration functions** to handle compressed format
4. **Update v2 encoding/decoding** to handle compressed format
5. **Create comprehensive tests** for the new v2 format
6. **Update all application logic** to work with compressed format
7. **Remove `userProgress` field** entirely
8. **Implement conditional `traitLimits`** (only include if different from defaults)
9. **Update all subfield references** to use compressed names
10. **Test URL persistence** with new compressed format
