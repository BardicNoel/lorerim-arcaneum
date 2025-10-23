# Alchemy Documentation Page - Implementation Todo List

## Overview

This document outlines the complete implementation plan for creating an alchemy documentation page similar to the cookbook feature. The alchemy page will display and allow searching/filtering of alchemy ingredients from the `alchemy-ingredients.json` data file.

## Data Structure Analysis

Based on `alchemy-ingredients.json`, each ingredient has:

- `name`: Ingredient name (e.g., "Hawk's Egg")
- `edid`: Editor ID (e.g., "BYOHHawkEgg01")
- `globalFormId`: Form ID (e.g., "0x0300F1CC")
- `plugin`: Source plugin (e.g., "LoreRim - Alchemy Tweaks.esp")
- `value`: Gold value
- `weight`: Weight in game units
- `flags`: Array of flags (e.g., ["ManualCalc"])
- `effects`: Array of effect objects with:
  - `mgefFormId`: Effect form ID
  - `mgefName`: Effect name (e.g., "Resist Magic")
  - `mgefDescription`: Effect description
  - `effectType`: Effect type (e.g., "Werewolf")
  - `skill`: Associated skill
  - `baseCost`: Base magicka cost
  - `magnitude`: Effect magnitude
  - `duration`: Effect duration in seconds
  - `area`: Area of effect
  - `originalEFID`: Original effect ID
  - `originalEFIT`: Original effect data

## Implementation Tasks

### 1. Core Architecture Setup ✅

- [x] Create alchemy feature directory structure under `src/features/alchemy/`
- [x] Create documentation directory under `docs/alchemy/`

### 2. Type Definitions

- [ ] **Define alchemy ingredient types and interfaces** based on alchemy-ingredients.json structure
  - `AlchemyIngredient` interface
  - `AlchemyEffect` interface
  - `AlchemyIngredientWithComputed` interface
  - `AlchemyFilters` interface
  - `AlchemySearchResult` interface
  - `AlchemyStatistics` interface
  - `AlchemyViewState` interface

### 3. Data Model Layer

- [ ] **Create AlchemyIngredientModel class** with validation, filtering, and search capabilities
  - Validation methods for ingredient data
  - Computed property generation (effect count, total magnitude, etc.)
  - Filtering methods (by effect type, magnitude, duration, etc.)
  - Search functionality with scoring
  - Sorting methods
  - Statistics calculation
  - Tag generation for searchability

### 4. Data Provider Layer

- [ ] **Implement AlchemyDataProvider** for loading and caching ingredient data
  - Singleton pattern for data management
  - Caching mechanism with expiration
  - Data loading from `alchemy-ingredients.json`
  - Error handling and validation
  - Cache management methods

### 5. State Management

- [ ] **Create Zustand store** for alchemy ingredients state management
  - Store structure similar to recipes store
  - Actions for loading, filtering, searching
  - Computed selectors
  - Error state management

### 6. Adapter Hooks

- [ ] **Build adapter hooks** for component integration
  - `useAlchemyData`: Data loading and management
  - `useAlchemyFilters`: Filter state and application
  - `useAlchemyComputed`: Statistics and computed data
  - `useAlchemyPagination`: Pagination logic
  - `useFuzzySearch`: Search functionality

### 7. Atomic Components

- [ ] **Create atomic components** for ingredient display
  - `IngredientCard`: Main ingredient display component
    - Variants: default, compact, detailed
    - Effect display with icons
    - Ingredient properties (value, weight, flags)
    - Click handlers
  - `IngredientBadge`: Small ingredient indicator
  - `EffectDisplay`: Individual effect display component
  - `IngredientStats`: Statistics display component

### 8. Composition Components

- [ ] **Build composition components** for layout and organization
  - `IngredientGrid`: Grid layout for ingredients
  - `IngredientList`: List layout for ingredients
  - `VirtualIngredientGrid`: Virtualized grid for performance
  - `IngredientAccordion`: Collapsible ingredient groups
  - `SearchAndFilters`: Combined search and filter interface
  - `ViewModeToggle`: Switch between grid/list views

### 9. Search and Filter System

- [ ] **Implement search and filter components** with fuzzy search
  - Multi-category autocomplete search
  - Filter by effect types
  - Filter by magnitude/duration ranges
  - Filter by value/weight ranges
  - Filter by plugin source
  - Tag-based filtering system
  - Clear filters functionality

### 10. Statistics and Analysis

- [ ] **Create statistics dashboard and meta analysis components**
  - `StatisticsDashboard`: Overview statistics
    - Total ingredient count
    - Ingredients by effect type
    - Average magnitude/duration
    - Top effects by frequency
    - Value/weight distributions
  - `AlchemyMetaAnalysis`: Advanced analysis
    - Effect combination analysis
    - Plugin contribution analysis
    - Magnitude/duration correlations
    - Rare ingredient identification

### 11. Main View Components

- [ ] **Build main AlchemyPageView component** with tabs and view modes
  - Tab structure: Ingredients, Statistics, Meta Analysis
  - View mode toggle (grid/list)
  - Search and filter integration
  - Pagination support
  - Loading and error states
  - Responsive design

### 12. Page Wrapper

- [ ] **Create AlchemyPage wrapper component**
  - Page shell integration
  - Title and description
  - Breadcrumb navigation
  - SEO metadata

### 13. Routing Integration

- [ ] **Add alchemy page to router configuration**
  - Route definition
  - Navigation menu integration
  - URL parameter handling
  - Deep linking support

### 14. Documentation

- [ ] **Create documentation page** under `docs/alchemy/`
  - Implementation guide
  - API documentation
  - Usage examples
  - Data structure reference
  - Component documentation

### 15. Testing and Validation

- [ ] **Test and validate all alchemy functionality**
  - Data loading and caching
  - Search and filtering
  - Component rendering
  - Performance optimization
  - Error handling
  - Responsive design
  - Accessibility compliance

## Key Differences from Cookbook

### Data Structure

- **Ingredients vs Recipes**: Alchemy focuses on individual ingredients rather than recipe combinations
- **Effects vs Recipe Effects**: Alchemy effects are more complex with form IDs, skill associations, and original data
- **Properties**: Additional properties like value, weight, flags, and plugin source

### Filtering Capabilities

- **Effect-based filtering**: Filter by specific magic effects
- **Magnitude/Duration ranges**: Numeric range filtering
- **Plugin filtering**: Filter by mod/plugin source
- **Value/Weight filtering**: Economic and weight-based filtering

### Display Components

- **Effect complexity**: More detailed effect display with form IDs and original data
- **Property display**: Value, weight, and flags information
- **Plugin attribution**: Show which mod/plugin provides each ingredient

### Search Features

- **Technical search**: Search by form IDs, editor IDs
- **Effect-based search**: Search by effect names and descriptions
- **Plugin search**: Search by mod/plugin names

## Performance Considerations

- **Virtualization**: Use virtual scrolling for large ingredient lists
- **Caching**: Implement proper caching for ingredient data
- **Lazy loading**: Load effects and details on demand
- **Search optimization**: Optimize fuzzy search for large datasets

## Accessibility Features

- **Keyboard navigation**: Full keyboard support
- **Screen reader support**: Proper ARIA labels and descriptions
- **High contrast**: Support for high contrast themes
- **Focus management**: Proper focus handling in modals and dropdowns

## Future Enhancements

- **Ingredient combinations**: Show which ingredients can be combined
- **Potion recipes**: Display potion recipes using ingredients
- **Effect synergies**: Show which effects work well together
- **Economic analysis**: Value optimization tools
- **Collection tracking**: Track which ingredients player has found
- **Export functionality**: Export ingredient lists and statistics
