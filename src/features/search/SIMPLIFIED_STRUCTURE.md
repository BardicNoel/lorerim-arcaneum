# Simplified Search Structure

## Overview

The search system has been simplified from a complex multi-layered rendering system to a clean, straightforward approach.

## New Structure

### Core Components

1. **SearchCard** (`components/atomic/SearchCard.tsx`)
   - Simple switchboard component
   - Takes a `SearchableItem` and renders the appropriate type-specific card
   - Easy to extend by adding new cases to the switch statement

2. **DefaultSearchCard** (`components/atomic/DefaultSearchCard.tsx`)
   - Clean, generic card design
   - Shows name, description, type badge, and tags
   - Used as fallback for types not yet implemented

3. **SimpleSearchResultsGrid** (`components/composition/SimpleSearchResultsGrid.tsx`)
   - Simple grid layout
   - Maps `SearchableItem[]` to `SearchCard[]`
   - Handles selection state

4. **SearchDetailPanel** (`components/atomic/SearchDetailPanel.tsx`)
   - Shows details for selected item
   - Includes raw data view for debugging
   - Ready for type-specific detail content

### Type-Specific Wrappers

Each type gets a wrapper component that:

- Takes a `SearchableItem`
- Finds the full record from the appropriate store
- Renders the existing core component (e.g., `RaceCard`, `SkillCard`)

**Example: RaceSearchCard** (`components/type-specific/RaceSearchCard.tsx`)

```tsx
export function RaceSearchCard({ item, isSelected, onClick, className }) {
  const races = useRacesStore(state => state.data)
  const fullRace = races?.find(race => race.id === item.originalData.id)

  if (!fullRace) {
    return (
      <DefaultSearchCard
        item={item}
        isSelected={isSelected}
        onClick={onClick}
        className={className}
      />
    )
  }

  return (
    <div className={className} onClick={onClick}>
      <RaceCard race={fullRace} isSelected={isSelected} />
    </div>
  )
}
```

### Usage

```tsx
// Simple usage in a grid
<SimpleSearchResultsGrid
  items={searchResults.map(result => result.item)}
  selectedItemId={selectedItem?.id}
  onItemSelect={handleItemSelect}
/>

// Or individual card
<SearchCard
  item={searchItem}
  isSelected={isSelected}
  onClick={handleClick}
/>
```

## Implementation Plan

### Phase 1: Foundation ✅

- [x] Create `SearchCard` switchboard
- [x] Create `DefaultSearchCard` fallback
- [x] Create `SimpleSearchResultsGrid`
- [x] Create `SearchDetailPanel`
- [x] Create `SimpleSearchPageView`

### Phase 2: Type-Specific Cards (One by one)

- [x] RaceSearchCard
- [ ] SkillSearchCard
- [ ] TraitSearchCard
- [ ] BirthsignSearchCard
- [ ] DestinySearchCard
- [ ] ReligionSearchCard
- [ ] PerkSearchCard

### Phase 3: Enhancements

- [ ] Type-specific detail panels
- [ ] Search highlighting in type-specific cards
- [ ] Performance optimizations

## Benefits

1. **Simplicity**: Clear, linear data flow
2. **Maintainability**: Easy to understand and modify
3. **Incremental**: Can implement type-specific cards one at a time
4. **Reusability**: Uses existing core components
5. **Consistency**: All cards follow the same interface

## Migration Path

1. Use `SimpleSearchPage` instead of `SearchPage` for testing
2. Gradually implement type-specific cards
3. Replace complex rendering system once all types are implemented
4. Remove old components and adapters

## Files to Remove (Eventually)

- `SearchResultWrapper.tsx`
- `useSearchRenderers.ts`
- `useTypeSpecificRenderers.tsx`
- `componentMapping.tsx`
- `TypeSpecificSearchResults.tsx`
- `SearchRenderers.ts`
- Complex transformation utilities
