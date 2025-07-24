# Feature MVA Refactor Template

## Overview
This template provides a systematic approach to refactor existing features into the Model-View-Adapter (MVA) architecture pattern. The MVA pattern separates concerns into three distinct layers:

- **Model**: Pure data structures and business logic
- **View**: UI components that render data
- **Adapter**: Hooks and utilities that connect models to views

## Phase 1: Feature Analysis

### 1.1 Identify User-Facing Views
List all the different ways users interact with this feature:

- **Primary View**: Main interface for the feature (e.g., "Feature Page")
- **Secondary Views**: Supporting interfaces (e.g., "Quick Selector", "Reference List")
- **Utility Views**: Helper components (e.g., "Detail Modal", "Search Results")
- **Embedded Views**: Components used within other features (e.g., "Build Page Card")

### 1.2 Map Current Components to Views
For each identified view, list the current components that implement it:

```
View Name:
- Current Components: [List components]
- Gaps: [Issues with current implementation]
```

### 1.3 Identify Data Requirements
For each view, identify what data it needs:

- **Core Data**: Primary entities (e.g., `FeatureItem[]`)
- **State Data**: Current selections, filters, etc. (e.g., `selectedItems: string[]`)
- **Computed Data**: Derived data (e.g., `filteredItems`, `possibleNextSteps`)
- **UI State**: Component-specific state (e.g., `isExpanded`, `searchQuery`)

---

## Phase 2: Data Layer Planning

### 2.1 Model Layer
Define pure data structures and utilities:

- **FeatureModel**: Core entity structure
- **FeatureDataProvider**: Data loading and caching
- **FeatureUtilities**: Pure functions for data manipulation

### 2.2 Adapter Layer
Design hooks that provide data to views:

- **useFeatureData()**: Load and provide core data
- **useFeatureState()**: Manage global feature state
- **useFeatureFilters()**: Handle search/filter logic
- **useFeatureComputed()**: Provide derived/computed data
- **useFeatureDetail(id)**: Get specific item with relationships

### 2.3 Data Flow Mapping
Map how data flows through the feature:

```
Data Source → Model → Adapter → View → User Action → Adapter → Model → View Update
```

---

## Phase 3: Component Architecture Planning

### 3.1 Atomic Components
Identify pure presentational components that can be reused:

- **FeatureItem**: Core entity display component
- **FeatureListItem**: Item in list/accordion context
- **FeatureCard**: Item in card/grid context
- **FeatureHoverCard**: Tooltip/hover information
- **FeatureBreadcrumb**: Navigation component
- **FeatureBadge**: Tag/category display

### 3.2 Composition Components
Components that compose atomic components:

- **FeatureList**: Renders multiple FeatureListItem
- **FeatureGrid**: Renders multiple FeatureCard
- **FeatureSearch**: Search input with results
- **FeatureFilters**: Filter controls

### 3.3 View Components
High-level components that consume adapters:

- **FeaturePageView**: Main feature page
- **FeatureReferenceView**: Browse/search interface
- **FeatureQuickSelectorView**: Compact selection interface
- **FeatureDetailView**: Detailed item view

---

## Phase 4: Current State Analysis

### 4.1 Component Mapping
Map current components to their MVA roles:

```
Atomic/Presentational Components:
- [Component Name]
  - Current: [Where it's currently used]
  - Gaps: [Issues to address]

Higher-Level Views:
- [View Name]
  - Current: [Current implementation]
  - Gaps: [Issues to address]

Adapters/Hooks:
- [Hook Name]
  - Current: [Current implementation]
  - Gaps: [Issues to address]
```

### 4.2 Data Flow Issues
Identify problems with current data flow:

- **Multiple Sources of Truth**: Same data managed in multiple places
- **Tight Coupling**: Components directly accessing data sources
- **Logic Duplication**: Same logic repeated across components
- **State Scattering**: Related state spread across multiple components

---

## Phase 5: Proposed Architecture

### 5.1 File Structure
```
src/features/[featureName]/
├── model/
│   ├── [Feature]Model.ts
│   ├── [Feature]DataProvider.ts
│   ├── [Feature]Utilities.ts
│   └── index.ts
├── adapters/
│   ├── use[Feature]Data.ts
│   ├── use[Feature]State.ts
│   ├── use[Feature]Filters.ts
│   ├── use[Feature]Computed.ts
│   ├── use[Feature]Detail.ts
│   └── index.ts
├── views/
│   ├── [Feature]PageView.tsx
│   ├── [Feature]ReferenceView.tsx
│   ├── [Feature]QuickSelectorView.tsx
│   ├── [Feature]DetailView.tsx
│   └── index.ts
├── components/
│   ├── atomic/
│   │   ├── [Feature]Item.tsx
│   │   ├── [Feature]ListItem.tsx
│   │   ├── [Feature]Card.tsx
│   │   ├── [Feature]HoverCard.tsx
│   │   ├── [Feature]Breadcrumb.tsx
│   │   ├── [Feature]Badge.tsx
│   │   └── index.ts
│   ├── composition/
│   │   ├── [Feature]List.tsx
│   │   ├── [Feature]Grid.tsx
│   │   ├── [Feature]Search.tsx
│   │   ├── [Feature]Filters.tsx
│   │   └── index.ts
│   └── index.ts
├── pages/
│   ├── [Feature]Page.tsx
│   └── index.ts
├── types.ts
└── index.ts
```

### 5.2 Component Hierarchy Examples
Show how components compose together:

```
FeaturePageView
├── FeatureSearch
├── FeatureFilters
└── FeatureReferenceView
    └── FeatureList
        └── FeatureListItem
            └── FeatureItem
```

---

## Phase 6: Migration Strategy

### 6.1 Adapter Extraction Plan
Extract data and state management logic in phases:

**Phase 1: Data Adapter**
- Implement `use[Feature]Data`
- Refactor all data loading to use this hook

**Phase 2: State Adapter**
- Implement `use[Feature]State`
- Refactor all state management to use this hook

**Phase 3: Filters Adapter**
- Implement `use[Feature]Filters`
- Refactor all filter/search logic to use this hook

**Phase 4: Computed Adapter**
- Implement `use[Feature]Computed`
- Refactor all derived data logic to use this hook

**Phase 5: Detail Adapter**
- Implement `use[Feature]Detail`
- Refactor all relationship logic to use this hook

### 6.2 View Refactoring Plan
After adapters are in place:

1. **Extract Atomic Components**: Create pure presentational components
2. **Refactor Views**: Update views to consume only adapter data
3. **Update Composition Components**: Ensure they use atomic components
4. **Remove Old Components**: Clean up deprecated code

### 6.3 Testing Strategy
- **Unit Tests**: Test adapters and utilities in isolation
- **Integration Tests**: Test view-adapter interactions
- **Component Tests**: Test atomic components with mock data
- **E2E Tests**: Test complete user workflows

---

## Phase 7: Implementation Checklist

### 7.1 Pre-Refactor Tasks
- [ ] Document current component responsibilities
- [ ] Identify all data sources and state management
- [ ] Map current data flow
- [ ] Identify reusable patterns

### 7.2 Adapter Implementation
- [ ] Create model layer (data structures, utilities)
- [ ] Implement data adapter (`use[Feature]Data`)
- [ ] Implement state adapter (`use[Feature]State`)
- [ ] Implement filters adapter (`use[Feature]Filters`)
- [ ] Implement computed adapter (`use[Feature]Computed`)
- [ ] Implement detail adapter (`use[Feature]Detail`)

### 7.3 View Refactoring
- [ ] Extract atomic components
- [ ] Refactor views to consume adapters
- [ ] Update composition components
- [ ] Ensure consistent component interfaces

### 7.4 Cleanup
- [ ] Remove deprecated components
- [ ] Update imports and exports
- [ ] Update documentation
- [ ] Run full test suite

---

## Phase 8: Validation

### 8.1 Architecture Validation
- [ ] No direct data access in views
- [ ] All state management through adapters
- [ ] Atomic components are pure and reusable
- [ ] Clear separation of concerns

### 8.2 Functionality Validation
- [ ] All existing functionality preserved
- [ ] Performance maintained or improved
- [ ] User experience unchanged or enhanced
- [ ] Error handling improved

### 8.3 Code Quality Validation
- [ ] Reduced code duplication
- [ ] Improved testability
- [ ] Better maintainability
- [ ] Consistent patterns across feature

---

## Template Usage Instructions

1. **Replace Placeholders**: Replace `[Feature]`, `[featureName]`, etc. with your feature's name
2. **Customize Views**: Adjust the view types based on your feature's specific needs
3. **Adapt Data Requirements**: Modify data structures and relationships for your domain
4. **Scale Complexity**: Add or remove phases based on feature complexity
5. **Iterate**: Use this as a starting point and refine based on your specific needs

## Benefits of MVA Refactor

- **Maintainability**: Clear separation of concerns makes code easier to understand and modify
- **Testability**: Pure models and adapters are easier to test in isolation
- **Reusability**: Atomic components can be reused across different views
- **Consistency**: Standardized patterns across the feature
- **Performance**: Better data caching and state management
- **Scalability**: Easier to add new views or modify existing ones 