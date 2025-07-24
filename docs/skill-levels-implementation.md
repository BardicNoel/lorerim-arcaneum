# Skill Levels Implementation

## Overview

The skill levels feature automatically calculates and displays the minimum required skill level based on selected perks. This ensures that when perks are added or removed, the minimum skill level is recalculated to reflect the highest requirement among the remaining perks.

## Implementation Details

### Build State Enhancement

The `BuildState` interface has been extended to include skill levels:

```typescript
export interface BuildState {
  // ... existing fields
  skillLevels: Record<string, number> // skillId -> minimum required level based on selected perks
}
```

### Core Utilities

#### `calculateMinimumSkillLevel(skillId, selectedPerks, perkRanks)`

Calculates the minimum skill level required for a specific skill based on its selected perks.

**Parameters:**
- `skillId`: The skill ID (e.g., 'AVSmithing')
- `selectedPerks`: Array of selected perk EDIDs for this skill
- `perkRanks`: Record of perk EDID to current rank

**Returns:** The minimum required skill level, or 0 if no perks require a level

**Logic:**
1. Returns 0 if no perks are selected
2. Finds the perk tree for the skill
3. For each selected perk, checks the skill level requirement at the current rank
4. Returns the highest required level among all selected perks

#### `calculateAllSkillLevels(perks)`

Calculates minimum skill levels for all skills based on selected perks.

**Parameters:**
- `perks`: The perks object from build state with `selected` and `ranks` properties

**Returns:** Record of skillId to minimum required level (only includes skills with level requirements > 0)

### Character Build Integration

The `useCharacterBuild` hook has been updated to automatically calculate skill levels whenever perks are modified:

#### Updated Functions:
- `addPerk()`: Calculates new skill levels after adding a perk
- `removePerk()`: Recalculates skill levels after removing a perk
- `setPerkRank()`: Updates skill levels when perk ranks change
- `clearSkillPerks()`: Resets skill levels when all perks for a skill are cleared

#### New Function:
- `getSkillLevel(skillId)`: Returns the minimum required level for a specific skill

### UI Integration

#### Skills Page Adapter

The `useSkillsPage` adapter now calculates skill levels for each skill:

```typescript
const skillLevel = calculateMinimumSkillLevel(
  skill.id,
  selectedPerks,
  build.perks?.ranks || {}
)
```

#### Skill Card Display

The `UnifiedSkillCard` component displays skill levels alongside perk counts:

```tsx
{/* Skill Level and Perks Count */}
<div className="flex items-center justify-between text-sm text-muted-foreground">
  {/* Skill Level */}
  {skill.level > 0 && (
    <div className="flex items-center gap-1">
      <span className="text-blue-600 font-medium">Level {skill.level}</span>
    </div>
  )}
  
  {/* Perks Count */}
  {skill.totalPerks > 0 && (
    <div className="flex items-center gap-1">
      <span>⭐ {skill.selectedPerksCount}/{skill.totalPerks} Perks</span>
    </div>
  )}
</div>
```

## Data Flow

1. **Perk Selection**: User selects/deselects perks or changes perk ranks
2. **Build Update**: `useCharacterBuild` functions update the build state
3. **Level Calculation**: `calculateAllSkillLevels` is called to recalculate all skill levels
4. **Store Update**: Both perks and skill levels are updated in the character build store
5. **URL Sync**: The updated build state is encoded and saved to the URL
6. **UI Update**: Components re-render with the new skill level information

## Example Scenarios

### Scenario 1: Adding a High-Level Perk
- User selects "Dwarven Smithing" perk (requires Smithing level 25)
- Skill level for Smithing becomes 25
- UI displays "Level 25" for the Smithing skill card

### Scenario 2: Adding Multiple Perks
- User has "Dwarven Smithing" (level 25) and adds "Orcish Smithing" (level 50)
- Skill level for Smithing becomes 50 (highest requirement)
- UI displays "Level 50" for the Smithing skill card

### Scenario 3: Removing Perks
- User removes "Orcish Smithing" (level 50)
- Skill level for Smithing becomes 25 (remaining highest requirement)
- UI displays "Level 25" for the Smithing skill card

### Scenario 4: Removing All Perks
- User removes all perks for Smithing
- Skill level becomes 0
- UI no longer displays a level for the Smithing skill card

## Testing

Comprehensive tests are included in `src/features/skills/utils/__tests__/skillLevels.test.ts` covering:

- Empty perk selections
- Non-existent skill trees
- Perks without level requirements
- Single and multiple perk scenarios
- Rank-based calculations
- Edge cases and error conditions

## Benefits

1. **Automatic Calculation**: Skill levels are automatically calculated and updated
2. **Accurate Requirements**: Always shows the correct minimum level needed
3. **Dynamic Updates**: Changes immediately when perks are modified
4. **Visual Feedback**: Clear indication of skill requirements in the UI
5. **Build Validation**: Helps users understand skill prerequisites
6. **Persistence**: Skill levels are saved with the character build and restored on page refresh

## Future Enhancements

Potential improvements for the skill level system:

1. **Level Validation**: Warn users when they don't meet skill level requirements
2. **Progressive Display**: Show skill level progression as perks are added
3. **Requirement Highlighting**: Highlight perks that require higher skill levels
4. **Build Optimization**: Suggest perk selections that maximize skill level efficiency
5. **Export Integration**: Include skill levels in character build exports 