# Races Feature Enhancement Specification

## 🎯 Overview
Update the races feature to utilize the new `playable-races.json` data structure, providing users with comprehensive race information including enhanced stats, skill bonuses, racial abilities, and improved search/filtering capabilities focused on keywords and skill bonuses.

## 📋 Implementation Phases

### Phase 1: Data Structure & Types Update
**Duration**: 1-2 days  
**Priority**: High

#### 1.1 Update Type Definitions
- **File**: `src/features/races/types.ts`
- **Changes**:
  - Replace existing `Race` interface with new structure matching `playable-races.json`
  - Add new interfaces for `RacialSpell`, `SkillBonus`, `PhysicalAttributes`, `Regeneration`, `Combat`
  - Update `StartingStats` to match new structure (health, magicka, stamina, carryWeight)
  - Add `Keyword` interface for filtering capabilities

#### 1.2 Create Data Transformation Utilities
- **File**: `src/features/races/utils/dataTransform.ts`
- **Purpose**: Transform new race data to compatible format for existing components
- **Functions**:
  - `transformRaceToPlayerCreationItem(race: NewRace): PlayerCreationItem`
  - `extractKeywordsFromRace(race: NewRace): string[]`
  - `extractEffectType(spellName: string, description: string): 'positive' | 'negative' | 'neutral'`
  - `extractValueFromDescription(description: string): number | undefined`

#### 1.3 Update Data Source
- **File**: `src/features/races/hooks/useRaces.ts`
- **Changes**:
  - Update import path to `playable-races.json`
  - Implement data transformation in the hook
  - Update filtering logic for new data structure

### Phase 2: Enhanced Race Cards
**Duration**: 2-3 days  
**Priority**: High

#### 2.1 Update RaceCard Component
- **File**: `src/features/races/components/RaceCard.tsx`
- **Enhancements**:
  - **Category Badges**: Color-coded badges (Human: Blue, Elf: Green, Beast: Orange)
  - **Stat Preview**: Mini progress bars for health/magicka/stamina
  - **Primary Abilities**: Display 2-3 most important racial spells with icons
  - **Skill Bonuses**: Show top 2-3 skill bonuses with icons
  - **Keyword Tags**: Display relevant keywords (e.g., "Strong Stomach", "IsBeastRace")

#### 2.2 Create New UI Components
- **File**: `src/features/races/components/StatBar.tsx`
  - Reusable progress bar component for stats
  - Configurable colors and max values

- **File**: `src/features/races/components/CategoryBadge.tsx`
  - Styled badge component for race categories
  - Consistent color scheme across the app

- **File**: `src/features/races/components/KeywordTag.tsx`
  - Small tag component for keywords
  - Different styling for different keyword types

### Phase 3: Comprehensive Detail Panel
**Duration**: 3-4 days  
**Priority**: High

#### 3.1 Redesign RaceDetailPanel
- **File**: `src/features/races/components/RaceDetailPanel.tsx`
- **New Sections**:
  - **Enhanced Stats Display**: All starting stats with progress bars
  - **Skill Bonuses Grid**: Visual grid showing all skill bonuses with icons
  - **Racial Abilities**: Detailed descriptions of all racial spells with effect values
  - **Keywords Section**: Display all relevant keywords with explanations
  - **Regeneration Rates**: Visual representation of natural healing rates
  - **Combat Information**: Unarmed damage and reach stats

#### 3.2 Create Detail Panel Components
- **File**: `src/features/races/components/SkillBonusGrid.tsx`
  - Grid layout for skill bonuses
  - Icon-based skill representation
  - Bonus value highlighting

- **File**: `src/features/races/components/RacialAbilities.tsx`
  - Detailed ability descriptions
  - Effect value extraction and display
  - Categorization by ability type

- **File**: `src/features/races/components/KeywordsSection.tsx`
  - Display all keywords with descriptions
  - Group keywords by type (abilities, traits, flags)

### Phase 4: Enhanced Search & Filtering (Focused)
**Duration**: 2-3 days  
**Priority**: High

#### 4.1 Update Search Categories
- **File**: `src/features/races/pages/UnifiedRacesPage.tsx`
- **New Categories**:
  - **Racial Abilities**: Search by specific abilities (e.g., "Waterbreathing", "Night Eye")
  - **Skill Bonuses**: Filter by skill types (e.g., "Destruction", "Sneak")
  - **Keywords**: Filter by keywords (e.g., "Strong Stomach", "IsBeastRace", "REQ_StrongStomach")
  - **Race Categories**: Human/Elf/Beast filtering

#### 4.2 Enhanced Filter Logic
- **File**: `src/features/races/hooks/useRaces.ts`
- **New Filters**:
  - **Keyword Filtering**: Filter by specific keywords from the data
  - **Skill Focus**: Filter by primary skill bonuses
  - **Ability Types**: Active abilities vs passive traits
  - **Race Categories**: Human/Elf/Beast filtering

#### 4.3 Keyword Extraction & Mapping
- **File**: `src/features/races/utils/keywordMapping.ts`
- **Purpose**: Map technical keywords to user-friendly terms
- **Examples**:
  - `REQ_StrongStomach` → "Strong Stomach"
  - `IsBeastRace` → "Beast Race"
  - `REQ_DropsBloodKeyword` → "Bleeds"
  - `REQ_RacialSkills_SneakUnperked` → "Natural Sneak"

### Phase 5: Icon System & Visual Enhancements
**Duration**: 1-2 days  
**Priority**: Medium

#### 5.1 Create Icon Mapping System
- **File**: `src/features/races/utils/iconMapping.ts`
- **Mappings**:
  - **Skill Icons**: Map skill names to appropriate Lucide icons
  - **Ability Icons**: Map racial ability names to icons
  - **Category Icons**: Icons for Human/Elf/Beast categories
  - **Keyword Icons**: Icons for different keyword types

#### 5.2 Update Visual Design
- **File**: `src/features/races/components/RaceCard.tsx`
- **Enhancements**:
  - Consistent color scheme for categories
  - Improved hover states with ability previews
  - Better visual hierarchy for information

### Phase 6: Data Validation & Error Handling
**Duration**: 1 day  
**Priority**: Medium

#### 6.1 Add Data Validation
- **File**: `src/features/races/utils/validation.ts`
- **Functions**:
  - `validateRaceData(data: any): boolean`
  - `sanitizeRaceData(race: any): NewRace`
  - `handleMissingData(race: NewRace): NewRace`

#### 6.2 Error Handling
- **File**: `src/features/races/hooks/useRaces.ts`
- **Enhancements**:
  - Graceful handling of malformed data
  - Fallback values for missing information
  - User-friendly error messages

## 🎨 Design Specifications

### Color Scheme
- **Human Races**: Blue (`#3b82f6`)
- **Elf Races**: Green (`#10b981`)
- **Beast Races**: Orange (`#f59e0b`)
- **Stat Colors**:
  - Health: Red (`#ef4444`)
  - Magicka: Blue (`#3b82f6`)
  - Stamina: Green (`#10b981`)
- **Keyword Colors**:
  - Ability Keywords: Purple (`#8b5cf6`)
  - Trait Keywords: Green (`#10b981`)
  - Flag Keywords: Gray (`#6b7280`)

### Icon System
- **Skills**: Use Lucide icons that match skill names
- **Abilities**: Use descriptive icons (e.g., water for Waterbreathing)
- **Categories**: Use distinct icons for each race category
- **Keywords**: Use appropriate icons for different keyword types

## 📊 Data Transformation Examples

### Example 1: Argonian Race with Keywords
```typescript
// Input: New race data
{
  name: "Argonian",
  category: "Beast",
  keywords: [
    { edid: "IsBeastRace", globalFormId: "0x000D61D1" },
    { edid: "REQ_StrongStomach", globalFormId: "0x8C4CF31E" },
    { edid: "REQ_DropsBloodKeyword", globalFormId: "0x8C586728" }
  ],
  racialSpells: [
    { name: "Waterbreathing", description: "Your Argonian lungs..." },
    { name: "Strong Stomach", description: "Your metabolism can digest raw food..." }
  ],
  skillBonuses: [
    { skill: "Light Armor", bonus: 10 },
    { skill: "Restoration", bonus: 15 }
  ]
}

// Output: PlayerCreationItem
{
  id: "argonian",
  name: "Argonian",
  category: "Beast",
  tags: [
    "Waterbreathing", 
    "Strong Stomach", 
    "Light Armor", 
    "Restoration",
    "Beast Race",
    "Bleeds"
  ],
  effects: [
    { name: "Waterbreathing", type: "positive", description: "Your Argonian lungs..." },
    { name: "Strong Stomach", type: "positive", description: "Your metabolism can digest raw food..." }
  ]
}
```

### Example 2: Keyword Mapping
```typescript
// Keyword mapping examples
const keywordMapping = {
  "REQ_StrongStomach": "Strong Stomach",
  "IsBeastRace": "Beast Race",
  "REQ_DropsBloodKeyword": "Bleeds",
  "REQ_RacialSkills_SneakUnperked": "Natural Sneak",
  "REQ_RacialSkills_CreatePotionsUnperked": "Natural Alchemy",
  "REQ_RacialSkills_LockpickUnperked": "Natural Lockpicking",
  "REQ_RacialSkills_RechargeWeaponsUnperked": "Natural Enchanting"
}
```

## 🔍 Search & Filtering Strategy

### Search Categories
1. **Racial Abilities**: Direct search by ability names
2. **Skill Bonuses**: Search by skill names (e.g., "Destruction", "Sneak")
3. **Keywords**: Search by user-friendly keyword names
4. **Race Categories**: Human/Elf/Beast filtering

### Filter Logic
```typescript
// Enhanced filtering logic
const filterRaces = (races, filters) => {
  return races.filter(race => {
    // Text search across all searchable fields
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchableText = [
        race.name,
        race.description,
        ...race.racialSpells.map(spell => spell.name),
        ...race.skillBonuses.map(bonus => bonus.skill),
        ...race.keywords.map(keyword => keywordMapping[keyword.edid] || keyword.edid)
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(searchLower)) return false;
    }

    // Category filter
    if (filters.category && race.category !== filters.category) return false;

    // Keyword filter
    if (filters.keywords.length > 0) {
      const raceKeywords = race.keywords.map(k => keywordMapping[k.edid] || k.edid);
      const hasMatchingKeyword = filters.keywords.some(keyword => 
        raceKeywords.includes(keyword)
      );
      if (!hasMatchingKeyword) return false;
    }

    return true;
  });
};
```

## 📅 Implementation Timeline

| Phase | Duration | Dependencies | Deliverables |
|-------|----------|--------------|--------------|
| 1 | 1-2 days | None | Updated types, data transformation |
| 2 | 2-3 days | Phase 1 | Enhanced race cards, new UI components |
| 3 | 3-4 days | Phase 2 | Comprehensive detail panel |
| 4 | 2-3 days | Phase 1 | Enhanced search and filtering with keywords |
| 5 | 1-2 days | Phase 2 | Icon system, visual enhancements |
| 6 | 1 day | All phases | Data validation, error handling |

**Total Estimated Duration**: 10-15 days

## 🚫 Excluded Features (Noted for Future)

### Advanced Filtering (Not in Scope)
- **Stat Ranges**: Filter by minimum health/magicka/stamina values
- **Combat Style**: Unarmed, magic, or weapon-focused filtering
- **Physical Attributes**: Height/weight based filtering

### Performance Optimizations (Noted for Future)
- **Virtual Scrolling**: For large race lists
- **Data Caching**: Service worker implementation
- **Lazy Loading**: Detailed information on demand
- **Memoization**: Complex calculations and filtering

### Advanced Features (Noted for Future)
- **Physical Visualization**: Height/weight charts and comparisons
- **Build Suggestions**: AI-powered race recommendations
- **Technical Details**: EDID, source, flags display
- **Comparison Tools**: Side-by-side race comparison interface

## 🧪 Testing Strategy

### Unit Tests
- Data transformation utilities
- Icon mapping functions
- Validation logic
- Filter algorithms

### Integration Tests
- End-to-end race selection flow
- Search and filter interactions
- Data loading and error handling

### Visual Tests
- Responsive design across breakpoints
- Color contrast compliance
- Accessibility features

## 📚 Documentation Updates

### Required Updates
- **Feature Documentation**: Update `races-feature-doc.md` with new capabilities
- **API Documentation**: Document new data structure and transformation
- **Component Documentation**: Update component props and interfaces
- **User Guide**: Create guide for new search and filtering features

## 🎯 Success Criteria

### Functional Requirements
- [ ] All races from `playable-races.json` display correctly
- [ ] Search functionality works with racial abilities, skill bonuses, and keywords
- [ ] Filtering by race category (Human/Elf/Beast) works
- [ ] Detail panel shows comprehensive race information
- [ ] Race cards display enhanced information with proper styling

### Performance Requirements
- [ ] Page load time remains under 2 seconds
- [ ] Search/filter operations are responsive (< 100ms)
- [ ] No memory leaks from data transformation

### Quality Requirements
- [ ] All new components have proper TypeScript types
- [ ] Error handling for malformed data
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Responsive design across all breakpoints

---

*This specification provides a comprehensive plan for enhancing the races feature while maintaining the existing user experience and avoiding over-engineering for the current scope.* 