# App-Wide Search MVA Implementation Checklist

## Phase 1: Core Search Infrastructure ✅

### Model Layer

- [x] Create `src/features/search/model/SearchModel.ts`
  - [x] Define `SearchableItem` interface
  - [x] Define `SearchResult` interface
  - [x] Define `SearchFilters` interface
  - [x] Define `SearchHighlight` interface
  - [x] Define `SearchResultRenderer` interface

- [x] Create `src/features/search/model/SearchDataProvider.ts`
  - [x] Implement search index building
  - [x] Implement search function with filters
  - [x] Add available filters generation
  - [x] Add data loading from all stores

- [x] Create `src/features/search/model/SearchUtilities.ts`
  - [x] `transformSkillsToSearchable()`
  - [x] `transformRacesToSearchable()`
  - [x] `transformTraitsToSearchable()`
  - [x] `transformReligionsToSearchable()`
  - [x] `transformBirthsignsToSearchable()`
  - [x] `transformDestinyNodesToSearchable()`
  - [x] `transformPerkTreesToSearchable()`
  - [x] `searchResultToPlayerCreationItem()` - Transform to PlayerCreationItem format
  - [x] `createSearchCategories()` - Generate search-specific filter categories

- [x] Create `src/features/search/model/SearchRenderers.ts`
  - [x] Define `SEARCH_RESULT_RENDERERS` registry
  - [x] Map each type to its existing card component
  - [x] Map each type to its existing detail component
  - [x] Map each type to its compact component (for modal search)
  - [x] Add fallback renderer for unknown types

### Adapter Layer

- [x] Create `src/features/search/adapters/useSearchData.ts`
  - [x] Implement search index building
  - [x] Add data loading from all stores
  - [x] Add loading states
  - [x] Add error handling

- [x] Create `src/features/search/adapters/useSearchState.ts`
  - [x] Manage search query state
  - [x] Manage selected result state
  - [x] Manage active filters state
  - [x] Manage view mode state
  - [x] Add URL synchronization

- [x] Create `src/features/search/adapters/useSearchFilters.ts`
  - [x] Implement search with filters
  - [x] Add available filters generation
  - [x] Add filter application logic
  - [x] Add filter clearing logic

- [x] Create `src/features/search/adapters/useSearchComputed.ts`
  - [x] Add result filtering logic
  - [x] Add result sorting logic
  - [x] Add result counting logic
  - [x] Add PlayerCreationItem transformation

- [ ] Create `src/features/search/adapters/useSearchDetail.ts`
  - [ ] Add selected result logic
  - [ ] Add related results logic
  - [ ] Add navigation helpers

- [x] Create `src/features/search/adapters/useSearchRenderers.ts`
  - [x] Implement renderer registry access
  - [x] Add type-specific component selection
  - [x] Add search result card rendering
  - [x] Add search result detail rendering
  - [x] Add variant support (card/compact/detail)

## Phase 2: Search Components ✅

### Atomic Components

- [x] Create `src/features/search/components/atomic/SearchResultWrapper.tsx`
  - [x] Wrapper component for type-specific rendering
  - [x] Handle click events and selection
  - [x] Support different variants (card/compact/detail)
  - [x] Pass search context to type-specific components

- [x] Create `src/features/search/components/atomic/SearchTypeBadge.tsx`
  - [x] Display type with appropriate icon
  - [x] Add type-specific colors
  - [x] Add hover tooltips
  - [x] Can be used by type-specific components

- [x] Create `src/features/search/components/atomic/SearchHighlight.tsx`
  - [x] Highlight matching text in search results
  - [x] Support multiple highlight ranges
  - [x] Add accessibility features
  - [x] Can be used by type-specific components

### Composition Components

- [x] Create `src/features/search/components/composition/SearchResultsGrid.tsx`
  - [x] Use existing ItemGrid with type-specific rendering
  - [x] Add search result transformation
  - [x] Add result selection handling
  - [x] Support different variants

- [x] Create `src/features/search/components/composition/SearchFilters.tsx`
  - [x] Enhanced version of PlayerCreationFilters
  - [x] Add content-type filters
  - [x] Add search-specific filter categories
  - [x] Add result count display

### View Components

- [x] Create `src/features/search/views/SearchPageView.tsx`
  - [x] Use PlayerCreationPage as base layout
  - [x] Integrate with search adapters
  - [x] Use type-specific rendering for cards and details
  - [x] Add loading states
  - [x] Add error handling

- [x] Create `src/features/search/views/GlobalSearchView.tsx`
  - [x] Enhance existing GlobalSearch component
  - [x] Integrate with search adapters
  - [x] Use compact type-specific rendering
  - [x] Add keyboard navigation
  - [x] Add result selection

## Phase 3: Type-Specific Component Integration 🔄

### Enhance Existing Components

- [ ] Update `src/features/skills/components/SkillCard.tsx`
  - [ ] Add `searchHighlights` prop
  - [ ] Add `searchQuery` prop
  - [ ] Integrate `SearchHighlight` component
  - [ ] Add search context display

- [ ] Update `src/features/skills/components/SkillDetailPanel.tsx`
  - [ ] Add `searchHighlights` prop
  - [ ] Add `searchQuery` prop
  - [ ] Integrate `SearchHighlight` component
  - [ ] Add search context display

- [ ] Update `src/features/races-v2/components/RaceCard.tsx`
  - [ ] Add `searchHighlights` prop
  - [ ] Add `searchQuery` prop
  - [ ] Integrate `SearchHighlight` component
  - [ ] Add search context display

- [ ] Update `src/features/races-v2/components/RaceDetailPanel.tsx`
  - [ ] Add `searchHighlights` prop
  - [ ] Add `searchQuery` prop
  - [ ] Integrate `SearchHighlight` component
  - [ ] Add search context display

- [ ] Update `src/features/traits/components/TraitCard.tsx`
  - [ ] Add `searchHighlights` prop
  - [ ] Add `searchQuery` prop
  - [ ] Integrate `SearchHighlight` component
  - [ ] Add search context display

- [ ] Update `src/features/traits/components/TraitDetailPanel.tsx`
  - [ ] Add `searchHighlights` prop
  - [ ] Add `searchQuery` prop
  - [ ] Integrate `SearchHighlight` component
  - [ ] Add search context display

- [ ] Update `src/features/religions/components/ReligionCard.tsx`
  - [ ] Add `searchHighlights` prop
  - [ ] Add `searchQuery` prop
  - [ ] Integrate `SearchHighlight` component
  - [ ] Add search context display

- [ ] Update `src/features/religions/components/ReligionDetailPanel.tsx`
  - [ ] Add `searchHighlights` prop
  - [ ] Add `searchQuery` prop
  - [ ] Integrate `SearchHighlight` component
  - [ ] Add search context display

- [ ] Update `src/features/birthsigns/components/BirthsignCard.tsx`
  - [ ] Add `searchHighlights` prop
  - [ ] Add `searchQuery` prop
  - [ ] Integrate `SearchHighlight` component
  - [ ] Add search context display

- [ ] Update `src/features/birthsigns/components/BirthsignDetailPanel.tsx`
  - [ ] Add `searchHighlights` prop
  - [ ] Add `searchQuery` prop
  - [ ] Integrate `SearchHighlight` component
  - [ ] Add search context display

- [ ] Update `src/features/destiny/components/DestinyCard.tsx`
  - [ ] Add `searchHighlights` prop
  - [ ] Add `searchQuery` prop
  - [ ] Integrate `SearchHighlight` component
  - [ ] Add search context display

- [ ] Update `src/features/destiny/components/DestinyDetailPanel.tsx`
  - [ ] Add `searchHighlights` prop
  - [ ] Add `searchQuery` prop
  - [ ] Integrate `SearchHighlight` component
  - [ ] Add search context display

### Compact Components (for Modal Search)

- [ ] Create `src/features/skills/components/SkillCompactCard.tsx`
  - [ ] Compact version of SkillCard for modal search
  - [ ] Show essential information only
  - [ ] Include search highlighting

- [ ] Create `src/features/races-v2/components/RaceCompactCard.tsx`
  - [ ] Compact version of RaceCard for modal search
  - [ ] Show essential information only
  - [ ] Include search highlighting

- [ ] Create `src/features/traits/components/TraitCompactCard.tsx`
  - [ ] Compact version of TraitCard for modal search
  - [ ] Show essential information only
  - [ ] Include search highlighting

- [ ] Create `src/features/religions/components/ReligionCompactCard.tsx`
  - [ ] Compact version of ReligionCard for modal search
  - [ ] Show essential information only
  - [ ] Include search highlighting

- [ ] Create `src/features/birthsigns/components/BirthsignCompactCard.tsx`
  - [ ] Compact version of BirthsignCard for modal search
  - [ ] Show essential information only
  - [ ] Include search highlighting

- [ ] Create `src/features/destiny/components/DestinyCompactCard.tsx`
  - [ ] Compact version of DestinyCard for modal search
  - [ ] Show essential information only
  - [ ] Include search highlighting

## Phase 4: Integration & Polish ✅

### Router Integration

- [x] Add search route to `src/app/router.tsx`
  - [x] `/search` route
  - [x] Query parameter handling
  - [x] URL state synchronization

### Header Integration

- [x] Update `src/app/SiteHeader.tsx`
  - [x] Add GlobalSearch component
  - [x] Responsive layout
  - [x] Keyboard shortcut (Cmd+K)

### Navigation

- [x] Implement result navigation
  - [x] Skills → `/build/perks?skill=${id}`
  - [x] Races → `/races`
  - [x] Traits → `/traits`
  - [x] Religions → `/religions`
  - [x] Birthsigns → `/birthsigns`
  - [x] Destiny → `/destiny`

### Keyboard Shortcuts

- [x] Global shortcuts
  - [x] Cmd/Ctrl + K to open search
  - [x] Escape to close search
  - [x] Arrow keys for navigation
  - [x] Enter to select result

## Phase 5: Advanced Features 🔄

### Search Suggestions

- [ ] Create `src/features/search/components/SearchSuggestions.tsx`
  - [ ] Popular searches
  - [ ] Recent searches
  - [ ] Related searches

### Recent Searches

- [ ] Create `src/features/search/adapters/useRecentSearches.ts`
  - [ ] localStorage integration
  - [ ] Search history management
  - [ ] Clear history functionality

### Search Analytics

- [ ] Create `src/features/search/services/searchAnalytics.ts`
  - [ ] Track search queries
  - [ ] Track result clicks
  - [ ] Track popular searches

### Performance Optimizations

- [x] Implement result caching
- [ ] Add pagination
- [ ] Lazy loading for large result sets
- [x] Debounced search (300ms)

## Testing 🔄

### Unit Tests

- [ ] Test search model and utilities
- [ ] Test search adapters
- [ ] Test renderer registry
- [ ] Test filter logic
- [ ] Test sorting logic
- [ ] Test PlayerCreationItem transformation

### Component Tests

- [ ] Test atomic search components
- [ ] Test composition search components
- [ ] Test search views
- [ ] Test type-specific components with search props
- [ ] Test compact components

### Integration Tests

- [ ] Test search flow
- [ ] Test type-specific rendering
- [ ] Test navigation
- [ ] Test keyboard shortcuts
- [ ] Test mobile responsiveness

## Documentation 🔄

### User Documentation

- [ ] Search usage guide
- [ ] Keyboard shortcuts reference
- [ ] Advanced search syntax guide

### Developer Documentation

- [ ] Search service API docs
- [ ] Component props documentation
- [ ] Integration guide
- [ ] MVA architecture patterns
- [ ] Type-specific rendering guide

## Accessibility 🔄

### ARIA Support

- [ ] Proper ARIA labels
- [ ] ARIA descriptions
- [ ] ARIA live regions for results

### Keyboard Navigation

- [x] Full keyboard support
- [x] Focus management
- [ ] Screen reader compatibility

### Mobile Accessibility

- [ ] Touch-friendly targets
- [ ] Voice search support
- [ ] Mobile keyboard handling

## Performance 🔄

### Optimization

- [x] Search index optimization
- [x] Result caching
- [ ] Lazy loading
- [ ] Bundle size optimization

### Monitoring

- [ ] Search performance metrics
- [ ] User interaction tracking
- [ ] Error monitoring

## Deployment 🔄

### Production Readiness

- [ ] Environment configuration
- [x] Error handling
- [x] Loading states
- [ ] Fallback UI

### Analytics Integration

- [ ] Search analytics setup
- [ ] User behavior tracking
- [ ] Performance monitoring

---

## Current Implementation Status

### ✅ Completed

- **Model Layer**: All core models, data provider, utilities, and renderer registry implemented
- **Adapter Layer**: All core adapters implemented (data, state, filters, computed, renderers)
- **Atomic Components**: SearchResultWrapper, SearchTypeBadge, SearchHighlight, SearchResultCard, SearchResultDetail implemented
- **Composition Components**: SearchResultsGrid, SearchFilters implemented
- **View Components**: SearchPageView, GlobalSearchView implemented
- **Core Functionality**: Search index building, filtering, keyboard navigation, URL sync
- **Integration**: Router integration, header integration, navigation working

### 🔄 In Progress

- **Type-Specific Integration**: Need to enhance existing components with search highlighting props
- **Compact Components**: Need to create compact versions for modal search

### ❌ Not Started

- **Advanced Features**: Search suggestions, recent searches, analytics
- **Testing**: Unit, component, and integration tests
- **Documentation**: User and developer documentation
- **Accessibility**: ARIA support, screen reader compatibility
- **Performance**: Lazy loading, pagination, bundle optimization

---

## Quick Start Commands

```bash
# Install dependencies (if needed)
npm install fuse.js

# Create MVA directory structure
mkdir -p src/features/search/model
mkdir -p src/features/search/adapters
mkdir -p src/features/search/views
mkdir -p src/features/search/components/atomic
mkdir -p src/features/search/components/composition
mkdir -p src/features/search/pages

# Start implementation (MVA order)
# 1. Create model layer (SearchModel, SearchDataProvider, SearchUtilities, SearchRenderers)
# 2. Create adapter layer (useSearchData, useSearchState, useSearchFilters, useSearchRenderers, etc.)
# 3. Create atomic components (SearchResultWrapper, SearchTypeBadge, SearchHighlight)
# 4. Create composition components (SearchResultsGrid, SearchFilters)
# 5. Create view components (SearchPageView, GlobalSearchView)
# 6. Create pages (SearchPage)
# 7. Enhance existing type-specific components with search props
# 8. Create compact components for modal search
```

## Priority Order (MVA Approach)

1. **High Priority**: Router integration, header integration, type-specific component enhancements
2. **Medium Priority**: Compact components, testing, documentation
3. **Low Priority**: Advanced features, analytics, performance optimizations

## MVA Architecture Benefits

✅ **Clear Separation**: Model (data), View (UI), Adapter (logic)
✅ **Testability**: Pure adapters and models are easier to test
✅ **Reusability**: Type-specific components can be reused across different views
✅ **Consistency**: Follows established MVA patterns in the codebase
✅ **Maintainability**: Clear data flow and state management
✅ **Scalability**: Easy to add new search features or data types
✅ **Type-Specific Rendering**: Leverages existing, well-tested display components

## Type-Specific Rendering Benefits

✅ **Consistency**: Same display components used in feature pages and search
✅ **Maintainability**: One component to maintain per type
✅ **Familiarity**: Users see the same UI patterns they're used to
✅ **Rich Information**: Full feature-specific details in search results
✅ **Extensibility**: Easy to add new data types

## MVA Implementation Flow

```
1. Model Layer (Data & Business Logic + Renderer Registry) ✅
   ↓
2. Adapter Layer (State Management & Data Transformation + Type-Specific Rendering) ✅
   ↓
3. View Layer (UI Components + Type-Specific Integration) 🔄
   ↓
4. Integration (Router, Header, Navigation) 🔄
```

The core MVA architecture is complete. The next steps focus on integration and enhancing existing type-specific components to work with the search system.
