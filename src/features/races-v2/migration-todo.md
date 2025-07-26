# Races MVA Migration Todo List

## Current Status

- ✅ Model layer implemented (RaceModel, RaceDataProvider, RaceUtilities)
- ✅ All adapters implemented (useRaceData, useRaceState, useRaceFilters, useRaceComputed, useRaceDetail)
- ✅ Demo page created (RacesMVADemoPage)
- ✅ Types defined
- ✅ Atomic components implemented (RaceAvatar, CategoryBadge, KeywordTag, StatBar)
- ✅ Composition components implemented (RaceCard, RaceStatsDisplay, RaceEffectsDisplay, RaceKeywordsDisplay)
- ✅ View components implemented (RacePageView, RaceReferenceView, RaceQuickSelectorView, RaceDetailView)
- ✅ Fixed critical bug: Adapter parameter passing in view components
- ✅ RacePageView updated to match AccordionRacesPage design and functionality
- ✅ Fixed duplicate description issue in RaceAccordion component
- ✅ Fixed type conflicts between races and races-v2 features
- ✅ Created local raceToPlayerCreationItem utility for races-v2
- ✅ Created local useFuzzySearch hook for races-v2
- ✅ Removed unused imports and variables from RacePageView
- ✅ Fixed type errors in RaceReferenceView

## Phase 1: Complete Adapter Layer

### 1.1 State Management Adapter

- [x] **useRaceState.ts** - Selection and view mode state
  - [x] Implement selectedRace state
  - [x] Implement viewMode state ('grid' | 'list')
  - [x] Implement expandedSections state
  - [x] Add state setters and toggles
  - [x] Add persistence if needed
  - [ ] Write unit tests

### 1.2 Filters Adapter

- [x] **useRaceFilters.ts** - Search and filtering logic
  - [x] Implement searchQuery state
  - [x] Implement activeFilters state
  - [x] Implement filteredRaces computed value
  - [x] Add filter setters and clear functions
  - [x] Integrate with RaceModel filtering methods
  - [ ] Write unit tests

### 1.3 Computed Data Adapter

- [x] **useRaceComputed.ts** - Data transformation and computed values
  - [x] Implement transformedRaces (PlayerCreationItem format)
  - [x] Implement searchCategories
  - [x] Implement raceStats calculations
  - [x] Implement selectedRaceDetails
  - [x] Add memoization for performance
  - [ ] Write unit tests

### 1.4 Detail View Adapter

- [x] **useRaceDetail.ts** - Detailed race information
  - [x] Implement race detail fetching
  - [x] Implement relatedRaces logic
  - [x] Implement raceComparison data
  - [x] Add loading and error states
  - [ ] Write unit tests

### 1.5 Adapter Integration

- [x] Update **adapters/index.ts** to export all adapters
- [x] Ensure adapters work together without conflicts
- [ ] Add integration tests for adapter interactions

## Phase 2: Atomic Components

### 2.1 Core Display Components

- [x] **RaceAvatar.tsx** - Race avatar component
  - [x] Copy from existing races component
  - [x] Uses generic EntityAvatar
  - [x] Maintains backward compatibility
  - [ ] Write component tests

- [x] **CategoryBadge.tsx** - Category badge component
  - [x] Copy from existing races component
  - [x] Uses generic CategoryBadge
  - [x] Race-specific styling
  - [ ] Write component tests

- [x] **KeywordTag.tsx** - Keyword tag component
  - [x] Copy from existing races component
  - [x] Auto-detects keyword types
  - [x] Color-coded by type
  - [ ] Write component tests

- [x] **StatBar.tsx** - Stat bar component
  - [x] Copy from existing races component
  - [x] Progress bar with labels
  - [x] Configurable colors and sizes
  - [ ] Write component tests

### 2.2 Component Integration

- [x] Update **components/atomic/index.ts** to export all atomic components
- [x] Ensure consistent prop interfaces
- [ ] Add storybook stories for each component

## Phase 3: Composition Components

### 3.1 Core Display Components

- [x] **RaceCard.tsx** - Main race card component
  - [x] Uses atomic components (RaceAvatar, CategoryBadge)
  - [x] Integrates with composition components
  - [x] Handles accordion expansion
  - [x] Supports PlayerCreationItem and Race data
  - [ ] Write component tests

- [x] **RaceStatsDisplay.tsx** - Race statistics display
  - [x] Uses StatBar atomic component
  - [x] Shows starting stats and regeneration
  - [x] Supports compact and full views
  - [x] Configurable display options
  - [ ] Write component tests

- [x] **RaceEffectsDisplay.tsx** - Race effects/abilities display
  - [x] Shows racial spells and abilities
  - [x] Supports compact and full views
  - [x] Configurable max display count
  - [x] Handles descriptions and tooltips
  - [ ] Write component tests

- [x] **RaceKeywordsDisplay.tsx** - Race keywords display
  - [x] Uses KeywordTag atomic components
  - [x] Shows keyword count
  - [x] Configurable max display count
  - [x] Auto-detects keyword types
  - [ ] Write component tests

### 3.2 Player Creation Components

- [x] **RaceSelectionCard.tsx** - Race selection interface
  - [x] Integrates with character build state
  - [x] Shows autocomplete when no race selected
  - [x] Shows race accordion when race selected
  - [x] Handles navigation to race page
  - [ ] Write component tests

- [x] **RaceAccordion.tsx** - Accordion-style race display
  - [x] Uses AccordionCard from shared components
  - [x] Shows race details in expandable format
  - [x] Integrates with build system
  - [x] Supports custom styling options
  - [x] Fixed duplicate description issue (summary vs details)
  - [x] Truncated summary for long descriptions
  - [ ] Write component tests

- [x] **RaceAutocomplete.tsx** - Race search and selection
  - [x] Uses GenericAutocomplete from shared components
  - [x] Shows race avatars and categories
  - [x] Custom option rendering
  - [x] Handles race selection callbacks
  - [ ] Write component tests

### 3.3 Component Integration

- [x] Update **components/composition/index.ts** to export all composition components
- [x] Ensure composition components use atomic components
- [x] Update demo page to showcase composition components
- [ ] Add integration tests

## Phase 4: View Components ✅

### 4.1 Main Views

- [x] **RacePageView.tsx** - Main race page view
  - [x] Consume all race adapters
  - [x] Orchestrate layout
  - [x] Handle loading and error states
  - [x] Responsive design
  - [x] Updated to match AccordionRacesPage design and functionality
  - [x] Advanced search and filtering with fuzzy search
  - [x] Tag-based filtering system
  - [x] Accordion grid layout with row-based expansion
  - [x] Character build integration
  - [ ] Write component tests

- [x] **RaceReferenceView.tsx** - Browse/search interface
  - [x] Use shared PlayerCreationPage pattern
  - [x] Custom race-specific rendering
  - [x] Search and filter integration
  - [ ] Write component tests

### 4.2 Specialized Views

- [x] **RaceQuickSelectorView.tsx** - Compact selection interface
  - [x] For embedded contexts
  - [x] Simplified interaction model
  - [x] Quick selection workflow
  - [ ] Write component tests

- [x] **RaceDetailView.tsx** - Detailed race view
  - [x] Consume useRaceDetail
  - [x] Rich information display
  - [x] Related races section
  - [x] Comparison functionality
  - [ ] Write component tests

### 4.3 View Integration

- [x] Update **views/index.ts** to export all view components
- [x] Ensure views consume adapters properly
- [x] Update demo page to showcase view components
- [x] **CRITICAL BUG FIX**: Fixed adapter parameter passing in view components
  - [x] Fixed `useRaceFilters()` calls to pass required `{ races }` parameter
  - [x] Fixed `useRaceComputed()` calls to pass required `{ races, selectedRaceId }` parameters
  - [x] Updated all view components (RacePageView, RaceReferenceView, RaceQuickSelectorView)
  - [x] Resolved "Cannot destructure property 'races' of 'undefined'" TypeError
- [ ] Add integration tests for view-adapter interactions

## Phase 5: Page Integration

### 5.1 Main Page Refactor

- [x] **AccordionRacesPage.tsx** - Refactor existing page
  - [x] Replace direct data access with adapters
  - [x] Use new view components
  - [x] Maintain exact UI/UX
  - [x] Ensure all functionality preserved
  - [x] RacePageView now matches AccordionRacesPage design and functionality
  - [x] Advanced search and filtering capabilities implemented
  - [ ] Write comprehensive tests

### 5.2 Demo Page Enhancement

- [x] **RacesMVADemoPage.tsx** - Enhance demo page
  - [x] Showcase all new components
  - [x] Demonstrate adapter usage
  - [x] Add interactive examples
  - [x] Document usage patterns

### 5.3 Page Integration

- [x] Update **pages/index.ts** to export all pages
- [x] Ensure proper routing integration
- [x] Test page navigation and state persistence
- [x] **Replaced AccordionRacesPage with RacePageView** in router
- [x] **Updated BuildPage integration** to use races-v2 components
- [x] **Created new RaceSelectionCard** for races-v2 with MVA architecture
- [x] **Fixed navigation paths** to use `/build/race` instead of `/race`

## Phase 6: Testing and Validation

### 6.1 Unit Testing

- [ ] Test all adapters in isolation
- [ ] Test all atomic components with mock data
- [ ] Test composition components
- [ ] Test view components with mock adapters
- [ ] Achieve >90% test coverage

### 6.2 Integration Testing

- [ ] Test adapter interactions
- [ ] Test view-adapter integration
- [ ] Test component composition
- [ ] Test data flow end-to-end

### 6.3 Visual Regression Testing

- [ ] Ensure UI remains unchanged
- [ ] Test responsive behavior
- [ ] Test accessibility features
- [ ] Test cross-browser compatibility

### 6.4 Performance Testing

- [ ] Benchmark before and after
- [ ] Test with large datasets
- [ ] Optimize adapter implementations
- [ ] Add performance monitoring

## Phase 7: Documentation and Cleanup

### 7.1 Documentation

- [ ] Update feature documentation
- [ ] Document adapter usage patterns
- [ ] Create component usage examples
- [ ] Document migration patterns for other features

### 7.2 Code Cleanup

- [ ] Remove deprecated components
- [ ] Update all imports and exports
- [ ] Ensure consistent naming conventions
- [ ] Remove unused code and dependencies

### 7.3 Final Validation

- [ ] Run full test suite
- [ ] Perform manual testing
- [ ] Validate against original requirements
- [ ] Get stakeholder approval

## Phase 8: Recent Fixes and Improvements ✅

### 8.1 Type System and Compatibility

- [x] **Fixed type conflicts** between races and races-v2 features
- [x] **Created local utilities** to avoid shared dependency conflicts
  - [x] `raceToPlayerCreationItem` utility for races-v2
  - [x] `useFuzzySearch` hook for races-v2
- [x] **Resolved category type mismatch** ('Elven' vs 'Elf')

### 8.2 UI/UX Improvements

- [x] **Fixed duplicate description** in RaceAccordion component
- [x] **Implemented truncated summaries** for long descriptions
- [x] **Enhanced RacePageView** to match AccordionRacesPage functionality
- [x] **Advanced search and filtering** with fuzzy search capabilities
- [x] **Tag-based filtering system** with visual tag display
- [x] **Accordion grid layout** with row-based expansion logic

### 8.3 Code Quality

- [x] **Removed unused imports and variables** from RacePageView
- [x] **Fixed type errors** in RaceReferenceView
- [x] **Improved component composition** and reusability
- [x] **Enhanced error handling** and defensive programming

## Phase 9: Migration Completion

### 9.1 Feature Integration

- [ ] Integrate with main application
- [ ] Test with other features
- [ ] Ensure no breaking changes
- [ ] Update feature flags if needed

### 9.2 Deployment

- [ ] Deploy to staging environment
- [ ] Perform user acceptance testing
- [ ] Deploy to production
- [ ] Monitor for issues

### 9.3 Post-Migration

- [ ] Document lessons learned
- [ ] Plan migration for other features
- [ ] Update development guidelines
- [ ] Share knowledge with team

## Priority Levels

### High Priority (Must Complete)

- Phase 1: Complete Adapter Layer
- Phase 2: Atomic Components
- Phase 5: Main Page Refactor
- Phase 6: Testing and Validation

### Medium Priority (Should Complete)

- Phase 3: Composition Components
- Phase 4: View Components
- Phase 7: Documentation and Cleanup

### Low Priority (Nice to Have)

- Phase 8: Migration Completion
- Additional demo pages
- Advanced features

## Estimated Timeline

- **Phase 1**: 1-2 weeks
- **Phase 2**: 1-2 weeks
- **Phase 3**: 1 week
- **Phase 4**: 1 week
- **Phase 5**: 1 week
- **Phase 6**: 1-2 weeks
- **Phase 7**: 1 week
- **Phase 8**: 1 week

**Total Estimated Duration**: 7-10 weeks

## Success Criteria

- [ ] All existing functionality preserved
- [ ] UI remains completely unchanged
- [ ] Performance maintained or improved
- [ ] Code coverage >90%
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Team can maintain and extend the feature
- [ ] Migration pattern can be applied to other features
