# Search Page Type-Specific Rendering Plan

## Overview

Currently, the search page uses a unified `SearchResultWrapper` component that renders all search results with generic components. The goal is to enhance this to render type-specific components based on the search result type, providing a consistent experience with the individual feature pages.

## Current State Analysis

### Current Implementation

- `SearchResultsGrid` renders all results using `SearchResultWrapper`
- `SearchResultWrapper` uses `useSearchRenderers` to get type-specific renderers
- `SearchRenderers.ts` currently uses fallback components for all types
- Search results are transformed to `PlayerCreationItem` format for consistency

### Available Components by Type

#### Races (`race`)

- **Card Components**: `RaceCard`, `RaceSelectionCard`
- **Accordion Components**: `RaceAccordion`
- **Detail Components**: `RaceDetailView` (from views)
- **Location**: `src/features/races-v2/components/`

#### Birthsigns (`birthsign`)

- **Card Components**: `BirthsignCard`, `BirthsignSelectionCard`
- **Accordion Components**: `BirthsignAccordion`
- **Detail Components**: `BirthsignDetailPanel`
- **Location**: `src/features/birthsigns/components/`

#### Skills (`skill`)

- **Card Components**: `SkillCard`, `UnifiedSkillCard`
- **Accordion Components**: `SkillAccordion`
- **Grid Components**: `SkillGrid`, `PerkTreeGrid`
- **Detail Components**: Need to identify
- **Location**: `src/features/skills/components/`

#### Traits (`trait`)

- **Card Components**: `TraitCard`, `TraitSelectionCard`
- **Accordion Components**: `TraitAccordion`
- **Detail Components**: Need to identify
- **Location**: `src/features/traits/components/`

#### Religions (`religion`)

- **Card Components**: Need to identify
- **Accordion Components**: Need to identify
- **Detail Components**: Need to identify
- **Location**: `src/features/religions/components/`

#### Destiny (`destiny`)

- **Card Components**: `DestinyCard`
- **Accordion Components**: `DestinyAccordionList`
- **Detail Components**: `DestinyDetailPanel`
- **Location**: `src/features/destiny/components/`

#### Perks (`perk`)

- **Card Components**: Need to identify
- **Grid Components**: `PerkTreeGrid`
- **Detail Components**: Need to identify
- **Location**: `src/features/skills/components/`

## Implementation Plan

### Phase 1: Component Mapping and Integration

#### 1.1 Create Type-Specific Component Registry

- **File**: `src/features/search/model/TypeSpecificComponents.ts`
- **Purpose**: Map each search result type to its appropriate components
- **Structure**:

  ```typescript
  interface TypeComponentMap {
    card: React.ComponentType<any>
    accordion?: React.ComponentType<any>
    detail: React.ComponentType<any>
    grid?: React.ComponentType<any>
  }

  const TYPE_COMPONENT_MAP: Record<string, TypeComponentMap> = {
    race: {
      card: RaceCard,
      accordion: RaceAccordion,
      detail: RaceDetailView,
    },
    // ... other types
  }
  ```

#### 1.2 Enhance SearchResultRenderer Interface

- **File**: `src/features/search/model/SearchModel.ts`
- **Changes**: Add support for accordion and grid components
- **New Interface**:
  ```typescript
  export interface SearchResultRenderer {
    type: string
    cardComponent: React.ComponentType<any>
    detailComponent: React.ComponentType<any>
    accordionComponent?: React.ComponentType<any>
    gridComponent?: React.ComponentType<any>
    compactComponent?: React.ComponentType<any>
  }
  ```

#### 1.3 Update SearchRenderers Implementation

- **File**: `src/features/search/model/SearchRenderers.ts`
- **Changes**: Replace fallback components with actual type-specific components
- **Implementation**: Import and use real components from each feature

### Phase 2: Enhanced Rendering Logic

#### 2.1 Create Type-Specific Renderer Hook

- **File**: `src/features/search/adapters/useTypeSpecificRenderers.ts`
- **Purpose**: Provide type-specific rendering logic with proper data transformation
- **Features**:
  - Transform search result data to match component expectations
  - Handle search highlighting within components
  - Support different view modes (grid, list, accordion)

#### 2.2 Update SearchResultsGrid Component

- **File**: `src/features/search/components/composition/SearchResultsGrid.tsx`
- **Changes**:
  - Use type-specific components based on result type
  - Support different view modes per type
  - Handle data transformation for each type

#### 2.3 Create Type-Specific Result Components

- **File**: `src/features/search/components/type-specific/`
- **Components**:
  - `RaceSearchResult.tsx`
  - `BirthsignSearchResult.tsx`
  - `SkillSearchResult.tsx`
  - `TraitSearchResult.tsx`
  - `ReligionSearchResult.tsx`
  - `DestinySearchResult.tsx`
  - `PerkSearchResult.tsx`

### Phase 3: Data Transformation and Highlighting

#### 3.1 Create Type-Specific Data Transformers

- **File**: `src/features/search/utils/typeTransformers.ts`
- **Purpose**: Transform search result data to match component expectations
- **Transformers**:
  - `transformRaceData(searchResult: SearchResult): RaceData`
  - `transformBirthsignData(searchResult: SearchResult): BirthsignData`
  - `transformSkillData(searchResult: SearchResult): SkillData`
  - etc.

#### 3.2 Implement Search Highlighting

- **File**: `src/features/search/components/SearchHighlight.tsx`
- **Purpose**: Highlight search terms within rendered components
- **Implementation**: Use existing `SearchHighlight` component and integrate with type-specific components

#### 3.3 Create Highlighted Text Component

- **File**: `src/features/search/components/HighlightedText.tsx`
- **Purpose**: Reusable component for highlighting search terms in text
- **Usage**: Wrap text content that should be highlighted

### Phase 4: View Mode Support

#### 4.1 Enhance View Mode Logic

- **File**: `src/features/search/adapters/useSearchState.ts`
- **Changes**: Support type-specific view modes
- **Features**:
  - Different default view modes per type
  - Type-specific view mode options
  - Persist view mode preferences per type

#### 4.2 Create Type-Specific Grid Components

- **File**: `src/features/search/components/type-specific/grids/`
- **Components**:
  - `RaceSearchGrid.tsx`
  - `SkillSearchGrid.tsx`
  - `DestinySearchGrid.tsx`
  - etc.

#### 4.3 Create Type-Specific Accordion Components

- **File**: `src/features/search/components/type-specific/accordions/`
- **Components**:
  - `RaceSearchAccordion.tsx`
  - `BirthsignSearchAccordion.tsx`
  - `SkillSearchAccordion.tsx`
  - etc.

### Phase 5: Integration and Testing

#### 5.1 Update Search Page View

- **File**: `src/features/search/views/SearchPageView.tsx`
- **Changes**: Integrate new type-specific rendering system
- **Features**:
  - Dynamic view mode switching based on result types
  - Type-specific filtering and sorting
  - Enhanced detail panel rendering

#### 5.2 Create Integration Tests

- **File**: `src/features/search/__tests__/`
- **Tests**:
  - Type-specific rendering tests
  - Data transformation tests
  - View mode switching tests
  - Search highlighting tests

#### 5.3 Performance Optimization

- **File**: `src/features/search/adapters/useSearchRenderers.ts`
- **Changes**: Implement component lazy loading and caching
- **Features**:
  - Lazy load type-specific components
  - Cache rendered components
  - Optimize re-renders

## Implementation Details

### Component Integration Strategy

#### 1. Direct Component Usage

For components that already exist and work well:

```typescript
// Import existing components
import { RaceCard } from '@/features/races-v2/components/RaceCard'
import { BirthsignAccordion } from '@/features/birthsigns/components/BirthsignAccordion'

// Use directly with transformed data
const RaceSearchResult = ({ result, viewMode }) => {
  const raceData = transformRaceData(result)

  if (viewMode === 'accordion') {
    return <RaceAccordion race={raceData} />
  }

  return <RaceCard race={raceData} />
}
```

#### 2. Wrapper Components

For components that need search-specific enhancements:

```typescript
const RaceSearchWrapper = ({ result, viewMode }) => {
  const raceData = transformRaceData(result)
  const highlightedData = applySearchHighlights(raceData, result.highlights)

  return (
    <div className="search-result-wrapper">
      <RaceCard
        race={highlightedData}
        searchHighlights={result.highlights}
      />
    </div>
  )
}
```

### Data Transformation Strategy

#### 1. Type-Safe Transformers

```typescript
export function transformRaceData(result: SearchResult): RaceData {
  const originalData = result.item.originalData

  return {
    id: result.item.id,
    name: result.item.name,
    description: result.item.description,
    // ... other race-specific fields
    searchHighlights: result.highlights,
  }
}
```

#### 2. Highlighting Integration

```typescript
export function applySearchHighlights(
  data: any,
  highlights: SearchHighlight[]
) {
  return {
    ...data,
    highlightedFields: highlights.reduce((acc, highlight) => {
      acc[highlight.field] = highlight.snippet
      return acc
    }, {}),
  }
}
```

### View Mode Strategy

#### 1. Type-Specific Defaults

```typescript
const TYPE_DEFAULT_VIEWS = {
  race: 'card',
  birthsign: 'accordion',
  skill: 'grid',
  destiny: 'accordion',
  trait: 'card',
  religion: 'card',
  perk: 'grid',
}
```

#### 2. Dynamic View Mode Switching

```typescript
const getEffectiveViewMode = (type: string, userViewMode: string) => {
  // If user has a preference, use it
  if (userViewMode) return userViewMode

  // Otherwise use type default
  return TYPE_DEFAULT_VIEWS[type] || 'card'
}
```

## Benefits

### 1. Consistency

- Search results will look and behave exactly like their feature page counterparts
- Users get familiar UI patterns and interactions
- Consistent styling and layout across the application

### 2. Functionality

- Full feature functionality available in search results
- Interactive components (accordions, grids, etc.) work as expected
- Proper data display and formatting for each type

### 3. Maintainability

- Single source of truth for component rendering
- Changes to feature components automatically reflect in search
- Reduced code duplication

### 4. User Experience

- Familiar interface patterns
- Appropriate view modes for each content type
- Rich, interactive search results

## Migration Strategy

### Phase 1: Foundation (Week 1)

1. Create type component registry
2. Implement basic type-specific rendering
3. Test with one type (e.g., races)

### Phase 2: Core Types (Week 2)

1. Implement remaining core types (birthsigns, skills, traits)
2. Add data transformers
3. Implement search highlighting

### Phase 3: Advanced Types (Week 3)

1. Implement complex types (destiny, perks)
2. Add view mode support
3. Performance optimization

### Phase 4: Polish (Week 4)

1. Integration testing
2. UI/UX refinements
3. Documentation and cleanup

## Success Criteria

1. **Functional**: All search result types render with their native components
2. **Performance**: No significant performance degradation
3. **Consistency**: Search results match feature page appearance and behavior
4. **Usability**: Users can interact with search results as they would on feature pages
5. **Maintainability**: Changes to feature components automatically reflect in search

## Risk Mitigation

### 1. Performance Risks

- Implement lazy loading for type-specific components
- Use React.memo for expensive components
- Cache transformed data where appropriate

### 2. Integration Risks

- Start with simple types and gradually add complexity
- Maintain fallback components for unknown types
- Comprehensive testing for each type

### 3. Maintenance Risks

- Clear documentation of component dependencies
- Automated tests for component integration
- Version compatibility checks

## Next Steps

1. **Immediate**: Create the type component registry and implement for races
2. **Short-term**: Add remaining core types with basic functionality
3. **Medium-term**: Implement advanced features (view modes, highlighting)
4. **Long-term**: Performance optimization and advanced integrations
