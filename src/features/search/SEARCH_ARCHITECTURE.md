# Search Page Architecture

## Overview

The search system follows a **Model-View-Adapter (MVA)** pattern with a simplified component structure that eliminates the complex multi-layered rendering system.

## Architecture Layers

### 1. Model Layer (`/model/`)

**Core Data Structures:**

- `SearchableItem` - The fundamental search data structure
- `SearchResult` - Search results with scoring and highlights
- `SearchFilters` - Filter configuration
- `SearchDataProvider` - Manages search indexing and queries

**Key Files:**

- `SearchModel.ts` - Core interfaces and types
- `SearchDataProvider.ts` - Search engine using Fuse.js
- `SearchUtilities.ts` - Data transformation utilities

### 2. Adapter Layer (`/adapters/`)

**State Management & Data Flow:**

- `useSearchData()` - Manages search index and data loading
- `useSearchState()` - URL-synced state management
- `useSearchFilters()` - Filter logic and search execution
- `useSearchComputed()` - Computed values and sorting

**Data Flow:**

```
Stores → SearchDataProvider → useSearchData → useSearchFilters → Components
```

### 3. Component Layer (`/components/`)

#### Atomic Components (`/atomic/`)

- `SearchCard` - Main switchboard component
- `DefaultSearchCard` - Generic fallback card
- `SearchDetailPanel` - Detail view for selected items
- `SearchTypeBadge` - Type indicators
- `SearchHighlight` - Search result highlighting

#### Composition Components (`/composition/`)

- `SimpleSearchResultsGrid` - Grid layout for search results
- `SearchFilters` - Filter UI and logic
- `SearchPageLayout` - Page layout wrapper

#### Type-Specific Components (`/type-specific/`)

- `RaceSearchCard` - Race-specific card wrapper
- `SkillSearchCard` - Skill-specific card wrapper
- (Future: TraitSearchCard, BirthsignSearchCard, etc.)

### 4. View Layer (`/views/`)

- `SimpleSearchPageView` - Main search page view
- `GlobalSearchView` - Global search component

### 5. Page Layer (`/pages/`)

- `SimpleSearchPage` - Page component wrapper

## Component Hierarchy

```
SimpleSearchPage
└── SimpleSearchPageView
    ├── SearchPageLayout
    │   ├── SearchFilters
    │   │   └── CustomMultiAutocompleteSearch
    │   └── SimpleSearchResultsGrid
    │       └── SearchCard (switchboard)
    │           ├── RaceSearchCard → RaceCard
    │           ├── SkillSearchCard → SkillCard
    │           └── DefaultSearchCard (fallback)
    └── SearchDetailPanel
```

## Data Flow

### 1. Initialization

```
App Router → SimpleSearchPage → SimpleSearchPageView
↓
useSearchData() → SearchDataProvider → Store Data
↓
useSearchFilters() → Filtered Results
```

### 2. Search Execution

```
User Input → SearchFilters → useSearchFilters()
↓
SearchDataProvider.search() → Fuse.js
↓
SearchResult[] → SimpleSearchResultsGrid
↓
SearchCard → Type-specific wrapper → Core component
```

### 3. Selection Flow

```
User Click → SearchCard → onItemSelect
↓
SimpleSearchPageView → setSelectedItem
↓
SearchDetailPanel → Display details
```

## Key Design Principles

### 1. **Simple Switchboard Pattern**

The `SearchCard` component acts as a simple switchboard:

```tsx
switch (item.type) {
  case 'race':
    return <RaceSearchCard item={item} />
  case 'skill':
    return <SkillSearchCard item={item} />
  default:
    return <DefaultSearchCard item={item} />
}
```

### 2. **Type-Specific Wrappers**

Each type has a wrapper that:

- Takes a `SearchableItem`
- Finds the full record from the appropriate store
- Renders the existing core component

### 3. **Incremental Implementation**

- Start with `DefaultSearchCard` for all types
- Implement type-specific cards one by one
- No breaking changes during migration

### 4. **Store Integration**

Type-specific wrappers integrate with existing stores:

```tsx
const races = useRacesStore(state => state.data)
const fullRace = races?.find(race => race.id === item.originalData.id)
```

## State Management

### URL-Synced State (`useSearchState`)

- Filters are synced with URL parameters
- Browser back/forward works correctly
- Shareable search URLs

### Local State (`SimpleSearchPageView`)

- Selected item state
- Tag management
- UI interactions

### Computed State (`useSearchComputed`)

- Filtered and sorted results
- Result counts
- Type groupings

## Search Engine

### Fuse.js Configuration

- Fuzzy search with configurable thresholds
- Multi-field search (name, description, tags, etc.)
- Result scoring and highlighting

### Indexing Strategy

- Incremental indexing as stores load
- Singleton `SearchDataProvider` instance
- Automatic re-indexing when stores update

## Performance Considerations

### 1. **Lazy Loading**

- Type-specific components loaded on demand
- Store data loaded asynchronously

### 2. **Memoization**

- Computed values memoized with `useMemo`
- Component re-renders minimized

### 3. **Efficient Filtering**

- Filter application at search level
- Minimal component re-renders

## Error Handling

### 1. **Graceful Degradation**

- Fallback to `DefaultSearchCard` if type-specific card fails
- Store data not found → fallback card
- Component errors → error boundary

### 2. **Loading States**

- Search index building indicator
- Component loading states
- Data loading indicators

## Extensibility

### Adding New Types

1. Create type-specific wrapper in `/type-specific/`
2. Add case to `SearchCard` switchboard
3. Update `SearchableItem` type if needed
4. Add transformation utility if needed

### Adding New Features

1. Extend `SearchFilters` interface
2. Update `SearchDataProvider` logic
3. Add UI components as needed
4. Update state management

## Benefits of This Architecture

1. **Simplicity**: Clear, linear data flow
2. **Maintainability**: Easy to understand and modify
3. **Performance**: Efficient rendering and state management
4. **Extensibility**: Easy to add new types and features
5. **Consistency**: All components follow the same patterns
6. **Reusability**: Uses existing core components
7. **Incremental**: Can be implemented and improved over time
