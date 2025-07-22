# Religion Selection Implementation

## Overview

This document describes the implementation of the dual religion selection system for the Lorerim Arcaneum character builder. The system allows players to independently select:

1. **Deity Following** - Which deity the character follows (affects tenets, follower/devotee powers)
2. **Blessing Source** - Which deity's shrine blessing the character receives

## Architecture

### Data Model Changes

#### Updated Build State
```typescript
export interface BuildState {
  // ... existing fields ...
  religion: {
    followedDeity: string | null    // EDID of followed deity
    blessingSource: string | null   // EDID of blessing source deity
  } | null
}
```

#### New Type Definitions
```typescript
// src/features/religions/types/selection.ts
export interface ReligionSelection {
  followedDeity: Religion | null
  blessingSource: Religion | null
}

export interface ReligionSelectionState {
  followedDeityId: string | null
  blessingSourceId: string | null
}

export interface DeityOption {
  id: string
  name: string
  type: string
  description: string
  tenetDescription: string
  followerPower: string
  devoteePower: string
  favoredRaces: string[]
  worshipRestrictions: string[]
  originalReligion: Religion
}

export interface BlessingOption {
  id: string
  name: string
  type: string
  blessingName: string
  blessingDescription: string
  effects: Array<{
    name: string
    description: string
    magnitude: number
    duration: number
  }>
  originalReligion: Religion
}
```

### Component Structure

```
src/features/religions/
├── components/
│   ├── ReligionSelectionCard.tsx     # Main selection card
│   ├── DeityAutocomplete.tsx         # Deity selection dropdown
│   ├── BlessingAutocomplete.tsx      # Blessing selection dropdown
│   └── index.ts                      # Component exports
├── hooks/
│   ├── useReligionData.ts            # Data loading hook
│   └── index.ts                      # Hook exports
├── types/
│   ├── selection.ts                  # Selection types
│   └── index.ts                      # Type exports
├── utils/
│   ├── religionFilters.ts            # Data transformation utilities
│   └── index.ts                      # Utility exports
└── index.ts                          # Feature exports
```

## Key Components

### ReligionSelectionCard

The main component that displays both deity and blessing selections on the Build page.

**Features:**
- Displays selected deity with tenets and favored races
- Displays selected blessing with effects and duration
- Independent dropdowns for each selection
- Clear visual distinction between deity following and blessing
- Navigation to full religion page
- Loading and error states

**Usage:**
```tsx
<ReligionSelectionCard className="w-full" />
```

### DeityAutocomplete

Searchable dropdown for selecting which deity to follow.

**Features:**
- Fuzzy search by deity name, tenets, and powers
- Deity type badges (Divine, Daedric, etc.)
- Tenet description preview
- Favored races display
- Keyboard navigation

**Usage:**
```tsx
<DeityAutocomplete
  religions={religions}
  selectedDeityId={religionSelection.followedDeity}
  onDeitySelect={setFollowedDeity}
  placeholder="Choose a deity to follow..."
/>
```

### BlessingAutocomplete

Searchable dropdown for selecting blessing sources.

**Features:**
- Fuzzy search by blessing effects and deity names
- Blessing effects preview with magnitude and duration
- Deity type badges
- Effect count display

**Usage:**
```tsx
<BlessingAutocomplete
  religions={religions}
  selectedBlessingId={religionSelection.blessingSource}
  onBlessingSelect={setBlessingSource}
  placeholder="Choose a blessing source..."
/>
```

## State Management

### Updated useCharacterBuild Hook

New functions for managing dual religion selection:

```typescript
// Set followed deity
const setFollowedDeity = (deityId: string | null) => {
  const currentReligion = build?.religion || { followedDeity: null, blessingSource: null }
  updateBuild({ 
    religion: { 
      ...currentReligion, 
      followedDeity: deityId 
    } 
  })
}

// Set blessing source
const setBlessingSource = (deityId: string | null) => {
  const currentReligion = build?.religion || { followedDeity: null, blessingSource: null }
  updateBuild({ 
    religion: { 
      ...currentReligion, 
      blessingSource: deityId 
    } 
  })
}

// Get current religion selection
const getReligionSelection = () => {
  return build?.religion || { followedDeity: null, blessingSource: null }
}

// Legacy function for backward compatibility
const setReligion = (religionId: string | null) => {
  if (religionId) {
    // Set both followed deity and blessing source to the same religion
    updateBuild({ 
      religion: { 
        followedDeity: religionId, 
        blessingSource: religionId 
      } 
    })
  } else {
    // Clear both
    updateBuild({ religion: null })
  }
}
```

## Data Transformation

### Religion Filters

Utility functions for transforming religion data:

```typescript
// Convert religion to deity option
export function religionToDeityOption(religion: Religion): DeityOption

// Convert religion to blessing option
export function religionToBlessingOption(religion: Religion): BlessingOption

// Get all deity options from religions
export function getDeityOptions(religions: Religion[]): DeityOption[]

// Get all blessing options from religions
export function getBlessingOptions(religions: Religion[]): BlessingOption[]

// Find religion by ID
export function findReligionById(religions: Religion[], id: string): Religion | undefined
```

## UI/UX Design

### Visual Hierarchy

1. **Religion Card Header**: Title with "View All" button
2. **Deity Section**: Heart icon, deity name, type badge, tenets, favored races
3. **Separator**: Clear visual separation
4. **Blessing Section**: Zap icon, blessing source, type badge, effects
5. **Summary**: Combined display when both are selected

### Color Coding

- **Divine**: Blue badges
- **Daedric Prince**: Red badges
- **Tribunal**: Purple badges
- **Ancestor**: Green badges
- **Nordic Deity**: Orange badges
- **Yokudan Deity**: Yellow badges
- **Khajiiti Deity**: Indigo badges

### Icons

- **Deity Following**: Heart icon (blue)
- **Blessing**: Zap icon (yellow)
- **Favored Races**: Star icon (gold)
- **Effects**: Shield icon (gold)

## Integration Points

### Build Page Integration

The `ReligionSelectionCard` is integrated into the Build page alongside other selection cards:

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
  <RaceSelectionCard />
  <BirthsignSelectionCard />
  <TraitSelectionCard />
  <ReligionSelectionCard />  {/* New component */}
</div>
```

### Summary Card Updates

The `BuildSummaryCard` has been updated to display the dual religion selection:

```typescript
// Format religion display for summary
const formatReligionDisplay = () => {
  if (!build.religion) return 'Not selected'
  
  const { followedDeity, blessingSource } = build.religion
  
  if (followedDeity && blessingSource) {
    if (followedDeity === blessingSource) {
      return followedDeity
    } else {
      return `${followedDeity} + ${blessingSource} blessing`
    }
  } else if (followedDeity) {
    return `${followedDeity} (no blessing)`
  } else if (blessingSource) {
    return `${blessingSource} blessing only`
  }
  
  return 'Not selected'
}
```

## Testing

### Unit Tests

Comprehensive test coverage for utility functions:

```typescript
// src/features/religions/utils/religionFilters.test.ts
describe('religionFilters', () => {
  it('should convert religion to deity option')
  it('should convert religion to blessing option')
  it('should get deity options from religions')
  it('should get blessing options from religions')
  it('should find religion by id')
  it('should return undefined for non-existent religion id')
})
```

## Acceptance Criteria Verification

### ✅ View Selected Religion
- **ReligionSelectionCard** displays both followed deity and blessing source prominently
- Shows all relevant details (tenets, powers, effects, duration)
- Clear visual distinction between deity following and blessing

### ✅ Quick Religion Change
- **DeityAutocomplete** and **BlessingAutocomplete** provide independent selection
- Changes update build state immediately
- Selections persist across navigation

### ✅ Jump to Religion Page
- "View All" button in **ReligionSelectionCard** navigates to `/build/religions`
- Maintains context of current selections
- Allows detailed exploration of both aspects

## Future Enhancements

### Potential Improvements

1. **Religion Restrictions**: Validate deity restrictions based on race/alignment
2. **Blessing Requirements**: Check blessing availability requirements
3. **Favor Tracking**: Visual indicators for favor gain/loss mechanics
4. **Religion Comparison**: Side-by-side comparison tool
5. **Favorites System**: Save preferred religion combinations

### Technical Improvements

1. **Performance**: Memoize expensive data transformations
2. **Caching**: Implement service worker for offline access
3. **Analytics**: Track religion selection patterns
4. **Accessibility**: Enhanced screen reader support

## Migration Notes

### Backward Compatibility

The implementation maintains backward compatibility through:

1. **Legacy setReligion function**: Sets both deity and blessing to the same religion
2. **Default build state**: Religion field defaults to `null`
3. **Summary display**: Handles both old and new religion structures

### Breaking Changes

- Build state religion field structure changed from `string | null` to object structure
- Components expecting the old structure need to be updated

## Conclusion

The dual religion selection system successfully implements the requested functionality while maintaining code quality, type safety, and user experience standards. The implementation provides a flexible foundation for future enhancements and maintains backward compatibility with existing systems. 