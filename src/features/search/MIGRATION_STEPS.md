# Search System Migration Steps

## Current Status

✅ **Phase 1: Foundation Complete**

- [x] Created simplified architecture
- [x] Implemented `SearchCard` switchboard
- [x] Created `DefaultSearchCard` fallback
- [x] Built `SimpleSearchResultsGrid`
- [x] Added `SearchDetailPanel`
- [x] Created `SimpleSearchPageView`
- [x] Updated router to use new system
- [x] Implemented `RaceSearchCard`
- [x] Implemented `SkillSearchCard`

## Phase 2: Complete Type-Specific Cards

### 2.1 TraitSearchCard ✅ **COMPLETE**

**File:** `src/features/search/components/type-specific/TraitSearchCard.tsx`

```tsx
import { TraitCard } from '@/features/traits/components/TraitCard'
import { useTraitsStore } from '@/shared/stores/traitsStore'
import type { SearchableItem } from '../../model/SearchModel'
import { findItemInStore } from '../../utils/storeLookup'

interface TraitSearchCardProps {
  item: SearchableItem
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

export function TraitSearchCard({
  item,
  isSelected = false,
  onClick,
  className,
}: TraitSearchCardProps) {
  const traits = useTraitsStore(state => state.data)

  // Find the full trait record from the store
  const fullTrait = findItemInStore(traits, item.originalData)

  if (!fullTrait) {
    // Fallback to default card if trait not found
    return (
      <div
        className={`p-4 border rounded-lg bg-muted cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''} ${className}`}
        onClick={onClick}
      >
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-muted-foreground">
          Trait not found in store
        </p>
      </div>
    )
  }

  // Convert the trait to PlayerCreationItem format for TraitCard
  const traitAsPlayerCreationItem = {
    id: fullTrait.id || fullTrait.edid || fullTrait.name,
    name: fullTrait.name,
    description: fullTrait.description || '',
    category: fullTrait.category || '',
    tags: fullTrait.tags || [],
    type: 'trait' as const,
  }

  // Render the existing TraitCard with the full trait data
  return (
    <div className={className} onClick={onClick}>
      <TraitCard item={traitAsPlayerCreationItem} />
    </div>
  )
}
```

**Steps:**

✅ 1. Create `TraitSearchCard.tsx`
✅ 2. Add to type-specific index
✅ 3. Update `SearchCard` switchboard
⏳ 4. Test with trait search results

### 2.2 BirthsignSearchCard

**File:** `src/features/search/components/type-specific/BirthsignSearchCard.tsx`

```tsx
import { useBirthsignsStore } from '@/shared/stores/birthsignsStore'
import { BirthsignCard } from '@/features/birthsigns/components/BirthsignCard'

export function BirthsignSearchCard({ item, isSelected, onClick, className }) {
  const birthsigns = useBirthsignsStore(state => state.data)
  const fullBirthsign = birthsigns?.find(
    birthsign => birthsign.id === item.originalData.id
  )

  if (!fullBirthsign) {
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
      <BirthsignCard birthsign={fullBirthsign} isSelected={isSelected} />
    </div>
  )
}
```

**Steps:**

1. Create `BirthsignSearchCard.tsx`
2. Add to type-specific index
3. Update `SearchCard` switchboard
4. Test with birthsign search results

### 2.3 DestinySearchCard ✅ **COMPLETE**

**File:** `src/features/search/components/type-specific/DestinySearchCard.tsx`

```tsx
import { DestinyCard } from '@/features/destiny/components/composition/DestinyCard'
import { useDestinyNodesStore } from '@/shared/stores/destinyNodesStore'
import type { SearchableItem } from '../../model/SearchModel'
import { findItemInStore } from '../../utils/storeLookup'

interface DestinySearchCardProps {
  item: SearchableItem
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

export function DestinySearchCard({
  item,
  isSelected = false,
  onClick,
  className,
}: DestinySearchCardProps) {
  const destinyNodes = useDestinyNodesStore(state => state.data)

  // Find the full destiny node record from the store
  const fullDestiny = findItemInStore(destinyNodes, item.originalData)

  if (!fullDestiny) {
    // Fallback to default card if destiny node not found
    return (
      <div
        className={`p-4 border rounded-lg bg-muted cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''} ${className}`}
        onClick={onClick}
      >
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-muted-foreground">
          Destiny node not found in store
        </p>
      </div>
    )
  }

  // Convert the destiny node to PlayerCreationItem format for DestinyCard
  const destinyAsPlayerCreationItem = {
    id: fullDestiny.id || fullDestiny.edid || fullDestiny.name,
    name: fullDestiny.name,
    description: fullDestiny.description || '',
    category: fullDestiny.category || '',
    tags: fullDestiny.tags || [],
    type: 'destiny' as const,
    imageUrl: fullDestiny.icon,
    effects: fullDestiny.effects,
  }

  // Render the existing DestinyCard with the full destiny data
  return (
    <div className={className} onClick={onClick}>
      <DestinyCard
        item={destinyAsPlayerCreationItem}
        isSelected={isSelected}
        originalNode={fullDestiny}
        allNodes={destinyNodes}
        viewMode="grid"
      />
    </div>
  )
}
```

**Steps:**

✅ 1. Create `DestinySearchCard.tsx`
✅ 2. Add to type-specific index
✅ 3. Update `SearchCard` switchboard
⏳ 4. Test with destiny search results

### 2.4 ReligionSearchCard ✅ **COMPLETE**

**File:** `src/features/search/components/type-specific/ReligionSearchCard.tsx`

```tsx
import { ReligionAccordion } from '@/features/religions/components/ReligionAccordion'
import { useReligionsStore } from '@/shared/stores/religionsStore'
import type { SearchableItem } from '../../model/SearchModel'
import { findItemInStore } from '../../utils/storeLookup'

interface ReligionSearchCardProps {
  item: SearchableItem
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

export function ReligionSearchCard({
  item,
  isSelected = false,
  onClick,
  className,
}: ReligionSearchCardProps) {
  const religions = useReligionsStore(state => state.data)

  // Find the full religion record from the store
  const fullReligion = findItemInStore(religions, item.originalData)

  if (!fullReligion) {
    // Fallback to default card if religion not found
    return (
      <div
        className={`p-4 border rounded-lg bg-muted cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''} ${className}`}
        onClick={onClick}
      >
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-muted-foreground">
          Religion not found in store
        </p>
      </div>
    )
  }

  // Convert the religion to PlayerCreationItem format for ReligionAccordion
  const religionAsPlayerCreationItem = {
    id: fullReligion.id || fullReligion.name,
    name: fullReligion.name,
    description: fullReligion.description || '',
    category: fullReligion.category || fullReligion.pantheon || '',
    tags: fullReligion.tags || [],
    type: 'religion' as const,
    summary: fullReligion.description,
    effects: fullReligion.effects,
  }

  // Render the existing ReligionAccordion with the full religion data
  return (
    <div className={className} onClick={onClick}>
      <ReligionAccordion
        item={religionAsPlayerCreationItem}
        originalReligion={fullReligion}
        isExpanded={false}
        onToggle={onClick}
        className="w-full"
        showBlessings={true}
        showTenets={true}
        showBoons={true}
        showFavoredRaces={true}
        disableHover={false}
        showToggle={false}
      />
    </div>
  )
}
```

**Steps:**

✅ 1. Create `ReligionSearchCard.tsx`
✅ 2. Add to type-specific index
✅ 3. Update `SearchCard` switchboard
✅ 4. Use existing `ReligionAccordion` component
⏳ 5. Test with religion search results

### 2.5 PerkSearchCard

**File:** `src/features/search/components/type-specific/PerkSearchCard.tsx`

```tsx
import { usePerkTreesStore } from '@/shared/stores/perkTreesStore'
// Note: May need to create PerkCard component first

export function PerkSearchCard({ item, isSelected, onClick, className }) {
  const perkTrees = usePerkTreesStore(state => state.data)
  const fullPerk = perkTrees?.find(perk => perk.id === item.originalData.id)

  if (!fullPerk) {
    return (
      <DefaultSearchCard
        item={item}
        isSelected={isSelected}
        onClick={onClick}
        className={className}
      />
    )
  }

  // For now, use DefaultSearchCard until PerkCard is created
  return (
    <DefaultSearchCard
      item={item}
      isSelected={isSelected}
      onClick={onClick}
      className={className}
    />
  )
}
```

**Steps:**

1. Create `PerkSearchCard.tsx`
2. Add to type-specific index
3. Update `SearchCard` switchboard
4. Create `PerkCard` component (if needed)
5. Test with perk search results

## Phase 3: Enhanced Detail Panels

### 3.1 Type-Specific Detail Panels

Create detail panels that show rich information for each type:

**Files to create:**

- `src/features/search/components/type-specific/RaceSearchDetail.tsx`
- `src/features/search/components/type-specific/SkillSearchDetail.tsx`
- `src/features/search/components/type-specific/TraitSearchDetail.tsx`
- etc.

**Example:**

```tsx
export function RaceSearchDetail({ item }) {
  const races = useRacesStore(state => state.data)
  const fullRace = races?.find(race => race.id === item.originalData.id)

  if (!fullRace) {
    return <SearchDetailPanel item={item} />
  }

  return (
    <div className="space-y-4">
      <h2>{fullRace.name}</h2>
      <p>{fullRace.description}</p>
      {/* Add race-specific details */}
    </div>
  )
}
```

### 3.2 Update SearchDetailPanel

Modify `SearchDetailPanel` to use type-specific detail components:

```tsx
switch (item.type) {
  case 'race':
    return <RaceSearchDetail item={item} />
  case 'skill':
    return <SkillSearchDetail item={item} />
  default:
    return <DefaultSearchDetail item={item} />
}
```

## Phase 4: Search Highlighting

### 4.1 Add Highlighting to Type-Specific Cards

Update type-specific cards to show search highlights:

```tsx
export function RaceSearchCard({
  item,
  isSelected,
  onClick,
  className,
  highlights,
}) {
  // ... existing logic ...

  return (
    <div className={className} onClick={onClick}>
      <RaceCard
        race={fullRace}
        isSelected={isSelected}
        searchHighlights={highlights} // Add highlighting support
      />
    </div>
  )
}
```

### 4.2 Update Core Components

Modify core components (RaceCard, SkillCard, etc.) to accept and display search highlights.

## Phase 5: Performance Optimizations

### 5.1 Memoization

Add memoization to type-specific cards:

```tsx
export const RaceSearchCard = React.memo(function RaceSearchCard({
  item,
  isSelected,
  onClick,
  className,
}) {
  // ... component logic
})
```

### 5.2 Lazy Loading

Implement lazy loading for type-specific components:

```tsx
const RaceSearchCard = React.lazy(() => import('./RaceSearchCard'))
```

### 5.3 Virtual Scrolling

For large result sets, implement virtual scrolling in `SimpleSearchResultsGrid`.

## Phase 6: Cleanup and Removal

### 6.1 Remove Old Components

Once all type-specific cards are implemented and tested:

**Files to remove:**

- `src/features/search/components/atomic/SearchResultWrapper.tsx`
- `src/features/search/components/atomic/SearchResultCard.tsx`
- `src/features/search/components/atomic/SearchResultDetail.tsx`
- `src/features/search/components/composition/SearchResultsGrid.tsx`
- `src/features/search/components/composition/TypeSpecificSearchResults.tsx`
- `src/features/search/adapters/useSearchRenderers.ts`
- `src/features/search/adapters/useTypeSpecificRenderers.tsx`
- `src/features/search/adapters/componentMapping.tsx`
- `src/features/search/model/SearchRenderers.ts`
- `src/features/search/utils/typeTransformers.ts`

### 6.2 Remove Old Views

- `src/features/search/views/SearchPageView.tsx`
- `src/features/search/pages/SearchPage.tsx`

### 6.3 Update Exports

Clean up index files to remove exports of deleted components.

## Phase 7: Testing and Validation

### 7.1 Functional Testing

- [ ] Test search functionality for all types
- [ ] Verify filtering works correctly
- [ ] Test URL state synchronization
- [ ] Validate search highlighting
- [ ] Test error handling and fallbacks

### 7.2 Performance Testing

- [ ] Measure search performance with large datasets
- [ ] Test component rendering performance
- [ ] Validate memory usage
- [ ] Test with slow network conditions

### 7.3 User Experience Testing

- [ ] Test search result relevance
- [ ] Validate keyboard navigation
- [ ] Test mobile responsiveness
- [ ] Verify accessibility compliance

## Phase 8: Documentation and Training

### 8.1 Update Documentation

- [ ] Update component documentation
- [ ] Create usage examples
- [ ] Document the new architecture
- [ ] Create migration guide for other features

### 8.2 Team Training

- [ ] Present the new architecture to the team
- [ ] Create training materials
- [ ] Document best practices

## Migration Checklist

### Immediate (Next Sprint)

- [x] Implement TraitSearchCard
- [ ] Implement BirthsignSearchCard
- [x] Implement DestinySearchCard
- [x] Implement ReligionSearchCard
- [ ] Test all implemented cards

### Short Term (2-3 Sprints)

- [ ] Implement ReligionSearchCard
- [ ] Implement PerkSearchCard
- [ ] Add search highlighting
- [ ] Create type-specific detail panels

### Medium Term (1-2 Months)

- [ ] Performance optimizations
- [ ] Remove old components
- [ ] Comprehensive testing
- [ ] Documentation updates

### Long Term (Ongoing)

- [ ] Monitor performance
- [ ] Gather user feedback
- [ ] Iterate and improve
- [ ] Apply patterns to other features

## Success Criteria

1. **All search types work correctly** with proper type-specific cards
2. **Performance is maintained or improved** compared to old system
3. **Code is simpler and more maintainable** than the previous implementation
4. **No breaking changes** for users during migration
5. **Team can easily add new types** following the established patterns
6. **Search functionality is reliable** and handles edge cases gracefully
