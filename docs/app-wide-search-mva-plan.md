# App-Wide Search MVA Implementation Plan

## Overview

This document outlines the implementation plan for an app-wide search tool following the Model-View-Adapter (MVA) architecture pattern. The search feature will provide unified search across all record types: Skills, Races, Traits, Religions, Birthsigns, Destiny Nodes, and Perk Trees.

## Phase 1: Feature Analysis

### 1.1 Identify User-Facing Views

- **Primary View**: Search Results Page (`/search`) - Main search interface with filters and results
- **Secondary Views**:
  - Global Search Modal - Quick search from header (Cmd+K)
  - Search Suggestions - Autocomplete and recent searches
  - Search Filters Panel - Advanced filtering interface
- **Utility Views**:
  - Search Result Card - Individual result display (type-specific)
  - Search Result Detail Panel - Detailed item information (type-specific)
- **Embedded Views**:
  - Build Page Search Card - Search integration in build pages
  - Quick Search Bar - Compact search in other pages

### 1.2 Map Current Components to Views

```
Search Results Page:
- Current Components: None (new feature)
- Gaps: Need to leverage existing PlayerCreationPage infrastructure

Global Search Modal:
- Current Components: GlobalSearch.tsx (partially implemented)
- Gaps: Needs integration with new search service

Search Result Display:
- Current Components:
  - Skills: SkillCard, SkillDetailPanel
  - Races: RaceCard, RaceDetailPanel
  - Traits: TraitCard, TraitDetailPanel
  - Religions: ReligionCard, ReligionDetailPanel
  - Birthsigns: BirthsignCard, BirthsignDetailPanel
  - Destiny: DestinyCard, DestinyDetailPanel
  - Perk Trees: PerkTreeCard, PerkTreeDetailPanel
- Gaps: Need to integrate with search results and add search highlighting

Search Filters:
- Current Components: PlayerCreationFilters
- Gaps: Need content-type filters and search-specific categories
```

### 1.3 Identify Data Requirements

**Core Data:**

- `SearchableItem[]` - Unified search index across all data types
- `SearchResult[]` - Search results with relevance scoring
- `SearchFilters` - Filter state (types, categories, tags)

**State Data:**

- `searchQuery: string` - Current search term
- `selectedResult: SearchResult | null` - Currently selected result
- `activeFilters: SearchFilters` - Applied filters
- `viewMode: 'grid' | 'list'` - Display mode

**Computed Data:**

- `filteredResults: SearchResult[]` - Results after filtering
- `sortedResults: SearchResult[]` - Results after sorting
- `searchCategories: SearchCategory[]` - Available filter categories
- `resultCounts: Record<string, number>` - Counts by type/category

**UI State:**

- `isSearchOpen: boolean` - Modal open state
- `isLoading: boolean` - Search loading state
- `selectedIndex: number` - Keyboard navigation index

---

## Phase 2: Data Layer Planning

### 2.1 Model Layer

```typescript
// src/features/search/model/SearchModel.ts
interface SearchableItem {
  id: string
  type:
    | 'skill'
    | 'race'
    | 'trait'
    | 'religion'
    | 'birthsign'
    | 'destiny'
    | 'perk'
  name: string
  description?: string
  category?: string
  tags: string[]
  searchableText: string[]
  originalData: any
  url: string
}

interface SearchResult {
  item: SearchableItem
  score: number
  matches: Fuse.FuseResultMatch[]
  highlights: SearchHighlight[]
}

interface SearchHighlight {
  field: string
  snippet: string
  startIndex: number
  endIndex: number
}

interface SearchFilters {
  types: string[]
  categories: string[]
  tags: string[]
  skillCategories?: string[]
  raceTypes?: string[]
  traitTypes?: string[]
  religionTypes?: string[]
  birthsignGroups?: string[]
}

// Type-specific result rendering configuration
interface SearchResultRenderer {
  type: string
  cardComponent: React.ComponentType<any>
  detailComponent: React.ComponentType<any>
  compactComponent?: React.ComponentType<any> // For modal/quick search
}
```

```typescript
// src/features/search/model/SearchDataProvider.ts
export class SearchDataProvider {
  private searchIndex: Fuse<SearchableItem> | null = null
  private isIndexing = false

  async buildSearchIndex(): Promise<void> {
    // Build unified search index from all data stores
  }

  search(query: string, filters?: SearchFilters): SearchResult[] {
    // Perform search with filters
  }

  getAvailableFilters(): SearchFilterOptions {
    // Get available filter options based on current data
  }
}
```

```typescript
// src/features/search/model/SearchUtilities.ts
export function transformSkillsToSearchable(skills: Skill[]): SearchableItem[] {
  // Transform skills data to searchable format
}

export function transformRacesToSearchable(races: Race[]): SearchableItem[] {
  // Transform races data to searchable format
}

// ... other transformation functions

export function searchResultToPlayerCreationItem(
  result: SearchResult
): PlayerCreationItem {
  // Transform search result to PlayerCreationItem for UI compatibility
}

export function createSearchCategories(
  results: SearchResult[]
): SearchCategory[] {
  // Generate search-specific filter categories
}

// Type-specific renderer registry
export const SEARCH_RESULT_RENDERERS: Record<string, SearchResultRenderer> = {
  skill: {
    type: 'skill',
    cardComponent: SkillCard,
    detailComponent: SkillDetailPanel,
    compactComponent: SkillCompactCard,
  },
  race: {
    type: 'race',
    cardComponent: RaceCard,
    detailComponent: RaceDetailPanel,
    compactComponent: RaceCompactCard,
  },
  trait: {
    type: 'trait',
    cardComponent: TraitCard,
    detailComponent: TraitDetailPanel,
    compactComponent: TraitCompactCard,
  },
  religion: {
    type: 'religion',
    cardComponent: ReligionCard,
    detailComponent: ReligionDetailPanel,
    compactComponent: ReligionCompactCard,
  },
  birthsign: {
    type: 'birthsign',
    cardComponent: BirthsignCard,
    detailComponent: BirthsignDetailPanel,
    compactComponent: BirthsignCompactCard,
  },
  destiny: {
    type: 'destiny',
    cardComponent: DestinyCard,
    detailComponent: DestinyDetailPanel,
    compactComponent: DestinyCompactCard,
  },
  perk: {
    type: 'perk',
    cardComponent: PerkTreeCard,
    detailComponent: PerkTreeDetailPanel,
    compactComponent: PerkTreeCompactCard,
  },
}
```

### 2.2 Adapter Layer

```typescript
// src/features/search/adapters/useSearchData.ts
export function useSearchData() {
  const [searchIndex, setSearchIndex] = useState<Fuse<SearchableItem> | null>(
    null
  )
  const [isIndexing, setIsIndexing] = useState(false)

  // Get all data from stores
  const skills = useSkillsStore(state => state.data)
  const races = useRacesStore(state => state.data)
  // ... other stores

  useEffect(() => {
    if (allDataLoaded) {
      buildSearchIndex()
    }
  }, [skills, races, traits, religions, birthsigns, destinyNodes, perkTrees])

  return {
    isReady: searchIndex !== null,
    isIndexing,
  }
}
```

```typescript
// src/features/search/adapters/useSearchState.ts
export function useSearchState() {
  const [query, setQuery] = useState('')
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(
    null
  )
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({
    types: [],
    categories: [],
    tags: [],
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return {
    query,
    setQuery,
    selectedResult,
    setSelectedResult,
    activeFilters,
    setActiveFilters,
    viewMode,
    setViewMode,
  }
}
```

```typescript
// src/features/search/adapters/useSearchFilters.ts
export function useSearchFilters() {
  const { search } = useSearchData()
  const { query, activeFilters } = useSearchState()

  const searchResults = useMemo(() => {
    if (!query.trim()) return []
    return search(query, activeFilters)
  }, [search, query, activeFilters])

  const availableFilters = useMemo(() => {
    return getAvailableFilters(searchResults)
  }, [searchResults])

  return {
    searchResults,
    availableFilters,
    applyFilters: (filters: Partial<SearchFilters>) => {
      setActiveFilters(prev => ({ ...prev, ...filters }))
    },
    clearFilters: () => {
      setActiveFilters({ types: [], categories: [], tags: [] })
    },
  }
}
```

```typescript
// src/features/search/adapters/useSearchComputed.ts
export function useSearchComputed() {
  const { searchResults } = useSearchFilters()
  const { viewMode } = useSearchState()

  const filteredResults = useMemo(() => {
    return searchResults // Already filtered by useSearchFilters
  }, [searchResults])

  const sortedResults = useMemo(() => {
    return sortResults(filteredResults, 'relevance')
  }, [filteredResults])

  const resultCounts = useMemo(() => {
    return getResultCounts(searchResults)
  }, [searchResults])

  const playerCreationItems = useMemo(() => {
    return sortedResults.map(searchResultToPlayerCreationItem)
  }, [sortedResults])

  return {
    filteredResults,
    sortedResults,
    resultCounts,
    playerCreationItems,
  }
}
```

```typescript
// src/features/search/adapters/useSearchDetail.ts
export function useSearchDetail(resultId: string) {
  const { searchResults } = useSearchFilters()

  const selectedResult = useMemo(() => {
    return searchResults.find(result => result.item.id === resultId) || null
  }, [searchResults, resultId])

  const relatedResults = useMemo(() => {
    if (!selectedResult) return []
    return getRelatedResults(selectedResult, searchResults)
  }, [selectedResult, searchResults])

  return {
    selectedResult,
    relatedResults,
  }
}
```

```typescript
// src/features/search/adapters/useSearchRenderers.ts
export function useSearchRenderers() {
  const getRenderer = useCallback((type: string): SearchResultRenderer => {
    return SEARCH_RESULT_RENDERERS[type] || SEARCH_RESULT_RENDERERS.default
  }, [])

  const renderSearchResultCard = useCallback((
    result: SearchResult,
    isSelected: boolean,
    variant: 'card' | 'compact' = 'card'
  ) => {
    const renderer = getRenderer(result.item.type)
    const Component = variant === 'compact'
      ? renderer.compactComponent || renderer.cardComponent
      : renderer.cardComponent

    return (
      <Component
        item={result.item.originalData}
        isSelected={isSelected}
        searchHighlights={result.highlights}
        searchQuery={result.item.name} // Pass search context
      />
    )
  }, [getRenderer])

  const renderSearchResultDetail = useCallback((result: SearchResult) => {
    const renderer = getRenderer(result.item.type)
    const Component = renderer.detailComponent

    return (
      <Component
        item={result.item.originalData}
        searchHighlights={result.highlights}
        searchQuery={result.item.name}
      />
    )
  }, [getRenderer])

  return {
    getRenderer,
    renderSearchResultCard,
    renderSearchResultDetail,
  }
}
```

### 2.3 Data Flow Mapping

```
Data Sources (Zustand Stores)
  ↓
SearchDataProvider (Model)
  ↓
useSearchData (Adapter)
  ↓
useSearchFilters + useSearchComputed + useSearchRenderers (Adapters)
  ↓
Search Views (PlayerCreationPage, GlobalSearch)
  ↓
User Actions (search, filter, select)
  ↓
useSearchState (Adapter)
  ↓
View Updates
```

---

## Phase 3: Component Architecture Planning

### 3.1 Atomic Components

```typescript
// src/features/search/components/atomic/SearchResultWrapper.tsx
export function SearchResultWrapper({
  result,
  isSelected,
  onSelect,
  variant = 'card',
  renderer,
}: SearchResultWrapperProps) {
  const { renderSearchResultCard } = useSearchRenderers()

  return (
    <div
      className={cn(
        'cursor-pointer transition-all',
        isSelected && 'ring-2 ring-primary'
      )}
      onClick={() => onSelect(result)}
    >
      {renderSearchResultCard(result, isSelected, variant)}
    </div>
  )
}

// src/features/search/components/atomic/SearchHighlight.tsx
export function SearchHighlight({ text, highlights }: SearchHighlightProps) {
  // Highlight matching text in search results
  // This can be used by type-specific components
}

// src/features/search/components/atomic/SearchTypeBadge.tsx
export function SearchTypeBadge({ type }: { type: string }) {
  // Display type with appropriate icon and color
  // Can be used by type-specific components
}
```

### 3.2 Composition Components

```typescript
// src/features/search/components/composition/SearchResultsGrid.tsx
export function SearchResultsGrid({
  results,
  onResultSelect,
  variant = 'card'
}: SearchResultsGridProps) {
  const { renderSearchResultCard } = useSearchRenderers()

  return (
    <ItemGrid
      items={results.map(searchResultToPlayerCreationItem)}
      renderItemCard={(item, isSelected) => (
        <SearchResultWrapper
          result={item.originalSearchResult}
          isSelected={isSelected}
          onSelect={() => onResultSelect(item.originalSearchResult)}
          variant={variant}
        />
      )}
    />
  )
}

// src/features/search/components/composition/SearchFilters.tsx
export function SearchFilters({
  filters,
  onFiltersChange
}: SearchFiltersProps) {
  // Enhanced version of PlayerCreationFilters with content-type filters
}
```

### 3.3 View Components

```typescript
// src/features/search/views/SearchPageView.tsx
export function SearchPageView() {
  const { isReady } = useSearchData()
  const { query, setQuery, selectedResult, setSelectedResult } = useSearchState()
  const { playerCreationItems } = useSearchComputed()
  const { renderSearchResultDetail } = useSearchRenderers()

  if (!isReady) {
    return <SearchLoadingView />
  }

  return (
    <PlayerCreationPage
      title={`Search Results: "${query}"`}
      description={`Found ${playerCreationItems.length} results`}
      items={playerCreationItems}
      selectedItem={selectedResult ? searchResultToPlayerCreationItem(selectedResult) : null}
      onItemSelect={(item) => setSelectedResult(item.originalSearchResult)}
      renderItemCard={(item, isSelected) => (
        <SearchResultWrapper
          result={item.originalSearchResult}
          isSelected={isSelected}
          onSelect={() => setSelectedResult(item.originalSearchResult)}
        />
      )}
      renderDetailPanel={(item) => (
        <SearchResultWrapper
          result={item.originalSearchResult}
          isSelected={false}
          variant="detail"
        />
      )}
    />
  )
}

// src/features/search/views/GlobalSearchView.tsx
export function GlobalSearchView() {
  const { query, setQuery } = useSearchState()
  const { searchResults } = useSearchFilters()
  const { renderSearchResultCard } = useSearchRenderers()

  return (
    <GlobalSearch
      query={query}
      onQueryChange={setQuery}
      results={searchResults}
      onResultSelect={handleResultSelect}
      renderResult={(result, isSelected) =>
        renderSearchResultCard(result, isSelected, 'compact')
      }
    />
  )
}
```

---

## Phase 4: Current State Analysis

### 4.1 Component Mapping

```
Atomic/Presentational Components:
- SkillCard, RaceCard, TraitCard, etc.
  - Current: Used in respective feature pages
  - Gaps: Need to accept search highlighting props

- PlayerCreationFilters
  - Current: Used for filtering in feature pages
  - Gaps: Needs content-type filters

Higher-Level Views:
- PlayerCreationPage
  - Current: Main layout for feature pages
  - Gaps: Perfect fit for search results page

- GlobalSearch
  - Current: Partially implemented modal
  - Gaps: Needs integration with new search service and type-specific rendering

Adapters/Hooks:
- useFuzzySearch (in individual features)
  - Current: Feature-specific fuzzy search
  - Gaps: Need unified search across all features
```

### 4.2 Data Flow Issues

- **Multiple Search Implementations**: Each feature has its own fuzzy search
- **No Unified Search**: No way to search across all data types
- **Inconsistent Data Formats**: Different features use different data structures
- **No Global Search State**: Search state not shared across components
- **No Type-Specific Rendering**: Search results don't use existing display components

---

## Phase 5: Proposed Architecture

### 5.1 File Structure

```
src/features/search/
├── model/
│   ├── SearchModel.ts
│   ├── SearchDataProvider.ts
│   ├── SearchUtilities.ts
│   ├── SearchRenderers.ts
│   └── index.ts
├── adapters/
│   ├── useSearchData.ts
│   ├── useSearchState.ts
│   ├── useSearchFilters.ts
│   ├── useSearchComputed.ts
│   ├── useSearchDetail.ts
│   ├── useSearchRenderers.ts
│   └── index.ts
├── views/
│   ├── SearchPageView.tsx
│   ├── GlobalSearchView.tsx
│   └── index.ts
├── components/
│   ├── atomic/
│   │   ├── SearchResultWrapper.tsx
│   │   ├── SearchTypeBadge.tsx
│   │   ├── SearchHighlight.tsx
│   │   └── index.ts
│   ├── composition/
│   │   ├── SearchResultsGrid.tsx
│   │   ├── SearchFilters.tsx
│   │   └── index.ts
│   └── index.ts
├── pages/
│   ├── SearchPage.tsx
│   └── index.ts
├── types.ts
└── index.ts
```

### 5.2 Component Hierarchy

```
SearchPageView
├── PlayerCreationPage (existing)
    ├── SearchFilters (enhanced)
    └── SearchResultsGrid
        └── SearchResultWrapper
            └── [Type-Specific Card Component]
                ├── SearchTypeBadge
                └── SearchHighlight

GlobalSearchView
├── GlobalSearch (existing, enhanced)
    └── SearchResultWrapper (compact)
        └── [Type-Specific Compact Component]
```

---

## Phase 6: Migration Strategy

### 6.1 Adapter Extraction Plan

**Phase 1: Data Adapter**

- [ ] Implement `useSearchData`
- [ ] Create `SearchDataProvider`
- [ ] Build unified search index

**Phase 2: State Adapter**

- [ ] Implement `useSearchState`
- [ ] Centralize search state management
- [ ] Add URL synchronization

**Phase 3: Filters Adapter**

- [ ] Implement `useSearchFilters`
- [ ] Create unified filtering logic
- [ ] Add content-type filters

**Phase 4: Computed Adapter**

- [ ] Implement `useSearchComputed`
- [ ] Add result transformation to PlayerCreationItem
- [ ] Add sorting and counting logic

**Phase 5: Detail Adapter**

- [ ] Implement `useSearchDetail`
- [ ] Add related results logic
- [ ] Add navigation helpers

**Phase 6: Renderers Adapter**

- [ ] Implement `useSearchRenderers`
- [ ] Create renderer registry
- [ ] Add type-specific component mapping

### 6.2 View Refactoring Plan

1. **Enhance Existing Components**
   - [ ] Add search highlighting props to type-specific cards
   - [ ] Add search context to type-specific detail panels
   - [ ] Enhance `PlayerCreationFilters` with content-type filters

2. **Create Search Views**
   - [ ] Implement `SearchPageView` using `PlayerCreationPage`
   - [ ] Enhance `GlobalSearch` with new search service
   - [ ] Create search-specific wrapper components

3. **Update Integration Points**
   - [ ] Add search route to router
   - [ ] Integrate `GlobalSearch` in header
   - [ ] Add search to build pages

### 6.3 Testing Strategy

- **Unit Tests**: Test adapters and utilities in isolation
- **Integration Tests**: Test view-adapter interactions
- **Component Tests**: Test type-specific components with search data
- **E2E Tests**: Test complete search workflows

---

## Phase 7: Implementation Checklist

### 7.1 Pre-Refactor Tasks

- [ ] Document current search implementations in each feature
- [ ] Identify all data sources and transformation needs
- [ ] Map current data flow and state management
- [ ] Identify reusable patterns from existing features
- [ ] Document type-specific component interfaces

### 7.2 Adapter Implementation

- [ ] Create model layer (SearchModel, SearchDataProvider, SearchUtilities, SearchRenderers)
- [ ] Implement data adapter (`useSearchData`)
- [ ] Implement state adapter (`useSearchState`)
- [ ] Implement filters adapter (`useSearchFilters`)
- [ ] Implement computed adapter (`useSearchComputed`)
- [ ] Implement detail adapter (`useSearchDetail`)
- [ ] Implement renderers adapter (`useSearchRenderers`)

### 7.3 View Refactoring

- [ ] Enhance existing type-specific components with search props
- [ ] Create search-specific wrapper components
- [ ] Implement search views using existing infrastructure
- [ ] Ensure consistent component interfaces

### 7.4 Integration

- [ ] Add search route to router
- [ ] Integrate GlobalSearch in header
- [ ] Add search to build pages
- [ ] Update navigation and URL handling

### 7.5 Cleanup

- [ ] Remove deprecated search implementations
- [ ] Update imports and exports
- [ ] Update documentation
- [ ] Run full test suite

---

## Phase 8: Validation

### 8.1 Architecture Validation

- [ ] No direct data access in views
- [ ] All state management through adapters
- [ ] Type-specific components are properly integrated
- [ ] Clear separation of concerns

### 8.2 Functionality Validation

- [ ] All existing functionality preserved
- [ ] Search works across all data types
- [ ] Type-specific rendering works correctly
- [ ] Performance maintained or improved
- [ ] User experience enhanced

### 8.3 Code Quality Validation

- [ ] Reduced code duplication
- [ ] Improved testability
- [ ] Better maintainability
- [ ] Consistent MVA patterns

---

## Benefits of MVA Approach for Search

- **Maintainability**: Clear separation between search logic and UI
- **Testability**: Pure search adapters are easier to test
- **Reusability**: Type-specific components can be reused across different views
- **Consistency**: Follows established MVA patterns in the codebase
- **Performance**: Better data caching and state management
- **Scalability**: Easy to add new search features or data types
- **Type-Specific Rendering**: Leverages existing, well-tested display components
