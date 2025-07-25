# Races Feature MVA Migration Plan

## Overview
This document outlines the systematic migration of the races feature from its current architecture to the Model-View-Adapter (MVA) pattern, using the destiny feature as a blueprint. The migration will maintain all existing UI and user interactions while improving code organization, maintainability, and testability.

**Critical Requirement**: The UI must remain completely unchanged for users. This is purely an architectural refactor.

## Phase 1: Feature Analysis

### 1.1 Current User-Facing Views
Based on the races feature documentation, the following views are identified:

- **Primary View**: `AccordionRacesPage` - Main race selection interface
- **Secondary Views**: 
  - Race browsing in grid/list modes
  - Race detail panels
  - Race comparison modal
- **Utility Views**: 
  - Race autocomplete search
  - Race selection cards
  - Race display cards
- **Embedded Views**: 
  - Build page race cards (if applicable)

### 1.2 Current Component Mapping
```
Primary View:
- Current Components: AccordionRacesPage, RaceAccordion, RaceCard, RaceDetailPanel
- Gaps: Mixed responsibilities, direct data access, tight coupling

Secondary Views:
- Current Components: RaceDisplayCard, RaceSelectionCard, RaceComparisonModal
- Gaps: Duplicated logic, inconsistent data handling

Utility Views:
- Current Components: RaceAutocomplete, KeywordTag, CategoryBadge
- Gaps: Scattered state management, repeated search logic
```

### 1.3 Data Requirements Analysis
For each view, the following data is needed:

**Core Data**:
- `Race[]` - All available races from JSON
- `TransformedRace[]` - Races in PlayerCreationItem format

**State Data**:
- `selectedRace: string | null` - Currently selected race
- `viewMode: 'grid' | 'list'` - Display preference
- `searchQuery: string` - Current search term
- `activeFilters: RaceFilters` - Applied filters

**Computed Data**:
- `filteredRaces: Race[]` - Races matching current filters
- `raceCategories: string[]` - Available race categories
- `raceTags: string[]` - Available tags for filtering

**UI State**:
- `isLoading: boolean` - Data loading state
- `error: string | null` - Error state
- `expandedSections: string[]` - Accordion expansion state

---

## Phase 2: Data Layer Planning

### 2.1 Model Layer
Define pure data structures and utilities:

**RaceModel.ts**:
```typescript
export class RaceModel {
  static getRaceById(races: Race[], id: string): Race | undefined
  static getRacesByCategory(races: Race[], category: string): Race[]
  static getUniqueCategories(races: Race[]): string[]
  static getUniqueTags(races: Race[]): string[]
  static filterByCategory(races: Race[], category: string): Race[]
  static filterByTags(races: Race[], tags: string[]): Race[]
  static search(races: Race[], term: string): Race[]
  static sortByName(races: Race[]): Race[]
  static transformToPlayerCreationItem(race: Race): PlayerCreationItem
}
```

**RaceDataProvider.ts**:
```typescript
export class RaceDataProvider {
  private races: Race[] = []
  private loading = false
  private error: string | null = null
  private loaded = false

  async loadRaces(): Promise<Race[]>
  getRaces(): Race[]
  isLoading(): boolean
  getError(): string | null
  isLoaded(): boolean
  retry(): Promise<Race[]>
  clear(): void
}
```

**RaceUtilities.ts**:
```typescript
export class RaceUtilities {
  static enrichRacesWithTags(races: Race[]): void
  static generateSearchCategories(races: Race[]): SearchCategory[]
  static validateRaceData(race: Race): boolean
  static calculateRaceStats(race: Race): RaceStats
}
```

### 2.2 Adapter Layer
Design hooks that provide data to views:

**useRaceData.ts**:
```typescript
export function useRaceData() {
  return {
    races: Race[]
    isLoading: boolean
    error: string | null
    refresh: () => void
    getRaceById: (id: string) => Race | undefined
    getRacesByCategory: (category: string) => Race[]
  }
}
```

**useRaceState.ts**:
```typescript
export function useRaceState() {
  return {
    selectedRace: string | null
    viewMode: 'grid' | 'list'
    expandedSections: string[]
    setSelectedRace: (id: string | null) => void
    setViewMode: (mode: 'grid' | 'list') => void
    toggleExpandedSection: (section: string) => void
  }
}
```

**useRaceFilters.ts**:
```typescript
export function useRaceFilters() {
  return {
    searchQuery: string
    activeFilters: RaceFilters
    filteredRaces: Race[]
    categories: string[]
    tags: string[]
    setSearchQuery: (query: string) => void
    setFilters: (filters: RaceFilters) => void
    clearFilters: () => void
  }
}
```

**useRaceComputed.ts**:
```typescript
export function useRaceComputed() {
  return {
    transformedRaces: PlayerCreationItem[]
    searchCategories: SearchCategory[]
    raceStats: RaceStats
    selectedRaceDetails: Race | null
  }
}
```

**useRaceDetail.ts**:
```typescript
export function useRaceDetail(raceId: string) {
  return {
    race: Race | null
    relatedRaces: Race[]
    raceComparison: RaceComparison
    isLoading: boolean
    error: string | null
  }
}
```

### 2.3 Data Flow Mapping
```
Data Source (races.json) → RaceDataProvider → useRaceData → Views
User Actions → useRaceState/useRaceFilters → RaceModel → Views Update
```

---

## Phase 3: Component Architecture Planning

### 3.1 Atomic Components
Pure presentational components that can be reused:

**RaceItem.tsx**:
- Core race display component
- Pure props interface
- No state management
- Reusable across different contexts

**RaceListItem.tsx**:
- Item in list/accordion context
- Handles selection states
- Consistent with other list items

**RaceCard.tsx**:
- Item in card/grid context
- Visual race representation
- Hover and selection effects

**RaceHoverCard.tsx**:
- Tooltip/hover information
- Quick race preview
- Consistent with other hover cards

**RaceBreadcrumb.tsx**:
- Navigation component
- Shows current selection path
- Consistent with other breadcrumbs

**RaceBadge.tsx**:
- Tag/category display
- Color-coded by category
- Reusable across features

### 3.2 Composition Components
Components that compose atomic components:

**RaceList.tsx**:
- Renders multiple RaceListItem
- Handles list-specific logic
- Consistent with other lists

**RaceGrid.tsx**:
- Renders multiple RaceCard
- Handles grid layout
- Responsive design

**RaceSearch.tsx**:
- Search input with results
- Integrates with useRaceFilters
- Consistent search experience

**RaceFilters.tsx**:
- Filter controls
- Category and tag filtering
- Integrates with useRaceFilters

### 3.3 View Components
High-level components that consume adapters:

**RacePageView.tsx**:
- Main race page view
- Consumes all race adapters
- Orchestrates layout

**RaceReferenceView.tsx**:
- Browse/search interface
- Uses shared PlayerCreationPage
- Custom race-specific rendering

**RaceQuickSelectorView.tsx**:
- Compact selection interface
- For embedded contexts
- Simplified interaction model

**RaceDetailView.tsx**:
- Detailed race view
- Consumes useRaceDetail
- Rich information display

---

## Phase 4: Current State Analysis

### 4.1 Component Mapping to MVA Roles

**Atomic/Presentational Components**:
- RaceCard
  - Current: Mixed presentation and logic
  - Gaps: Direct data access, state management

- RaceAvatar
  - Current: Pure presentation
  - Gaps: None - already atomic

- CategoryBadge
  - Current: Pure presentation
  - Gaps: None - already atomic

- KeywordTag
  - Current: Pure presentation
  - Gaps: None - already atomic

**Higher-Level Views**:
- AccordionRacesPage
  - Current: Monolithic component with mixed responsibilities
  - Gaps: Direct data fetching, state management, business logic

- RaceAccordion
  - Current: Complex component with data transformation
  - Gaps: Business logic mixed with presentation

**Adapters/Hooks**:
- useRaces
  - Current: Basic data fetching hook
  - Gaps: Limited functionality, no state management

- useFuzzySearch
  - Current: Generic search utility
  - Gaps: Not race-specific, could be enhanced

### 4.2 Data Flow Issues
- **Multiple Sources of Truth**: Race data accessed directly in components
- **Tight Coupling**: Components directly fetch and transform data
- **Logic Duplication**: Search and filter logic repeated across components
- **State Scattering**: Related state spread across multiple components

---

## Phase 5: Proposed Architecture

### 5.1 File Structure
```
src/features/races/
├── model/
│   ├── RaceModel.ts
│   ├── RaceDataProvider.ts
│   ├── RaceUtilities.ts
│   └── index.ts
├── adapters/
│   ├── useRaceData.ts
│   ├── useRaceState.ts
│   ├── useRaceFilters.ts
│   ├── useRaceComputed.ts
│   ├── useRaceDetail.ts
│   └── index.ts
├── views/
│   ├── RacePageView.tsx
│   ├── RaceReferenceView.tsx
│   ├── RaceQuickSelectorView.tsx
│   ├── RaceDetailView.tsx
│   └── index.ts
├── components/
│   ├── atomic/
│   │   ├── RaceItem.tsx
│   │   ├── RaceListItem.tsx
│   │   ├── RaceCard.tsx
│   │   ├── RaceHoverCard.tsx
│   │   ├── RaceBreadcrumb.tsx
│   │   ├── RaceBadge.tsx
│   │   └── index.ts
│   ├── composition/
│   │   ├── RaceList.tsx
│   │   ├── RaceGrid.tsx
│   │   ├── RaceSearch.tsx
│   │   ├── RaceFilters.tsx
│   │   └── index.ts
│   └── index.ts
├── pages/
│   ├── AccordionRacesPage.tsx (refactored)
│   └── index.ts
├── types.ts
└── index.ts
```

### 5.2 Component Hierarchy
```
RacePageView
├── RaceSearch
├── RaceFilters
└── RaceReferenceView
    └── RaceList/RaceGrid
        └── RaceListItem/RaceCard
            └── RaceItem
```

---

## Phase 6: Migration Strategy

### 6.1 Adapter Extraction Plan

**Phase 1: Data Adapter** (Week 1)
- [ ] Implement `RaceDataProvider` and `RaceModel`
- [ ] Implement `useRaceData` hook
- [ ] Refactor `AccordionRacesPage` to use `useRaceData`
- [ ] Test data loading and error handling

**Phase 2: State Adapter** (Week 1-2)
- [ ] Implement `useRaceState` hook
- [ ] Extract selection and view mode state
- [ ] Refactor components to use `useRaceState`
- [ ] Test state management

**Phase 3: Filters Adapter** (Week 2)
- [ ] Implement `useRaceFilters` hook
- [ ] Extract search and filter logic
- [ ] Refactor search components to use `useRaceFilters`
- [ ] Test filtering functionality

**Phase 4: Computed Adapter** (Week 2-3)
- [ ] Implement `useRaceComputed` hook
- [ ] Extract data transformation logic
- [ ] Refactor components to use computed data
- [ ] Test computed data accuracy

**Phase 5: Detail Adapter** (Week 3)
- [ ] Implement `useRaceDetail` hook
- [ ] Extract detail view logic
- [ ] Refactor detail components
- [ ] Test detail functionality

### 6.2 View Refactoring Plan

**Phase 1: Extract Atomic Components** (Week 3-4)
- [ ] Create `RaceItem` from `RaceCard`
- [ ] Create `RaceListItem` for list contexts
- [ ] Extract `RaceBadge` and `RaceBreadcrumb`
- [ ] Ensure pure presentation components

**Phase 2: Create Composition Components** (Week 4)
- [ ] Create `RaceList` and `RaceGrid`
- [ ] Create `RaceSearch` and `RaceFilters`
- [ ] Ensure consistent interfaces

**Phase 3: Create View Components** (Week 4-5)
- [ ] Create `RacePageView`
- [ ] Create `RaceReferenceView`
- [ ] Create `RaceDetailView`
- [ ] Ensure adapter consumption

**Phase 4: Refactor Main Page** (Week 5)
- [ ] Update `AccordionRacesPage` to use new architecture
- [ ] Ensure UI remains unchanged
- [ ] Test all functionality

### 6.3 Testing Strategy
- **Unit Tests**: Test adapters and utilities in isolation
- **Integration Tests**: Test view-adapter interactions
- **Component Tests**: Test atomic components with mock data
- **E2E Tests**: Test complete user workflows
- **Visual Regression Tests**: Ensure UI remains unchanged

---

## Phase 7: Implementation Checklist

### 7.1 Pre-Refactor Tasks
- [ ] Document current component responsibilities
- [ ] Identify all data sources and state management
- [ ] Map current data flow
- [ ] Identify reusable patterns
- [ ] Set up testing infrastructure

### 7.2 Adapter Implementation
- [ ] Create model layer (RaceModel, RaceDataProvider, RaceUtilities)
- [ ] Implement useRaceData adapter
- [ ] Implement useRaceState adapter
- [ ] Implement useRaceFilters adapter
- [ ] Implement useRaceComputed adapter
- [ ] Implement useRaceDetail adapter

### 7.3 View Refactoring
- [ ] Extract atomic components (RaceItem, RaceListItem, RaceCard, etc.)
- [ ] Create composition components (RaceList, RaceGrid, RaceSearch, etc.)
- [ ] Create view components (RacePageView, RaceReferenceView, etc.)
- [ ] Refactor AccordionRacesPage to use new architecture
- [ ] Ensure consistent component interfaces

### 7.4 Cleanup
- [ ] Remove deprecated components
- [ ] Update imports and exports
- [ ] Update documentation
- [ ] Run full test suite
- [ ] Perform visual regression testing

---

## Phase 8: Validation

### 8.1 Architecture Validation
- [ ] No direct data access in views
- [ ] All state management through adapters
- [ ] Atomic components are pure and reusable
- [ ] Clear separation of concerns
- [ ] Consistent patterns across feature

### 8.2 Functionality Validation
- [ ] All existing functionality preserved
- [ ] Performance maintained or improved
- [ ] User experience unchanged
- [ ] Error handling improved
- [ ] Search and filtering work correctly

### 8.3 Code Quality Validation
- [ ] Reduced code duplication
- [ ] Improved testability
- [ ] Better maintainability
- [ ] Consistent patterns across feature
- [ ] Type safety improved

---

## Risk Mitigation

### 8.1 UI Preservation
- **Risk**: UI changes during refactor
- **Mitigation**: 
  - Comprehensive visual regression testing
  - Incremental refactoring with frequent validation
  - Maintain existing component interfaces during transition

### 8.2 Data Integrity
- **Risk**: Data transformation errors
- **Mitigation**:
  - Thorough testing of data transformation logic
  - Validation of computed data accuracy
  - Fallback mechanisms for data errors

### 8.3 Performance Impact
- **Risk**: Performance degradation during refactor
- **Mitigation**:
  - Performance benchmarking before and after
  - Optimized adapter implementations
  - Efficient memoization strategies

---

## Success Metrics

### 8.1 Code Quality
- Reduced cyclomatic complexity
- Improved test coverage (>90%)
- Reduced code duplication
- Better type safety

### 8.2 Maintainability
- Clear separation of concerns
- Consistent patterns
- Improved developer experience
- Better error handling

### 8.3 User Experience
- Zero UI changes
- Maintained performance
- Preserved functionality
- Improved error states

---

## Timeline

**Week 1**: Data and State Adapters
**Week 2**: Filters and Computed Adapters
**Week 3**: Detail Adapter and Atomic Components
**Week 4**: Composition and View Components
**Week 5**: Main Page Refactor and Testing
**Week 6**: Validation and Cleanup

**Total Duration**: 6 weeks
**Critical Path**: Adapter implementation and view refactoring

---

## Conclusion

This migration plan provides a systematic approach to refactor the races feature into the MVA architecture while preserving all existing functionality and user experience. The plan follows the proven patterns established in the destiny feature and ensures a smooth transition with minimal risk.

The key success factors are:
1. Maintaining UI consistency throughout the migration
2. Incremental refactoring with frequent validation
3. Comprehensive testing at each phase
4. Clear communication and documentation

By following this plan, the races feature will achieve the same architectural benefits as the destiny feature while maintaining its current user experience. 