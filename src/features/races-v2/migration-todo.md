# Races MVA Migration Todo List

## Current Status
- ✅ Model layer implemented (RaceModel, RaceDataProvider, RaceUtilities)
- ✅ All adapters implemented (useRaceData, useRaceState, useRaceFilters, useRaceComputed, useRaceDetail)
- ✅ Demo page created (RacesMVADemoPage)
- ✅ Types defined
- ✅ Atomic components implemented (RaceAvatar, CategoryBadge, KeywordTag, StatBar)
- ❌ Missing composition components
- ❌ Missing view components

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

### 3.1 Layout Components
- [ ] **RaceList.tsx** - List layout component
  - [ ] Renders multiple RaceListItem
  - [ ] Handles list-specific logic
  - [ ] Consistent with other lists
  - [ ] Add virtualization if needed
  - [ ] Write component tests

- [ ] **RaceGrid.tsx** - Grid layout component
  - [ ] Renders multiple RaceCard
  - [ ] Handles grid layout
  - [ ] Responsive design
  - [ ] Add masonry layout option
  - [ ] Write component tests

### 3.2 Interactive Components
- [ ] **RaceSearch.tsx** - Search interface
  - [ ] Search input with results
  - [ ] Integrate with useRaceFilters
  - [ ] Consistent search experience
  - [ ] Add search suggestions
  - [ ] Write component tests

- [ ] **RaceFilters.tsx** - Filter controls
  - [ ] Category and tag filtering
  - [ ] Integrate with useRaceFilters
  - [ ] Clear and reset functionality
  - [ ] Visual filter indicators
  - [ ] Write component tests

### 3.3 Component Integration
- [ ] Update **components/composition/index.ts** to export all composition components
- [ ] Ensure composition components use atomic components
- [ ] Add integration tests

## Phase 4: View Components

### 4.1 Main Views
- [ ] **RacePageView.tsx** - Main race page view
  - [ ] Consume all race adapters
  - [ ] Orchestrate layout
  - [ ] Handle loading and error states
  - [ ] Responsive design
  - [ ] Write component tests

- [ ] **RaceReferenceView.tsx** - Browse/search interface
  - [ ] Use shared PlayerCreationPage pattern
  - [ ] Custom race-specific rendering
  - [ ] Search and filter integration
  - [ ] Write component tests

### 4.2 Specialized Views
- [ ] **RaceQuickSelectorView.tsx** - Compact selection interface
  - [ ] For embedded contexts
  - [ ] Simplified interaction model
  - [ ] Quick selection workflow
  - [ ] Write component tests

- [ ] **RaceDetailView.tsx** - Detailed race view
  - [ ] Consume useRaceDetail
  - [ ] Rich information display
  - [ ] Related races section
  - [ ] Comparison functionality
  - [ ] Write component tests

### 4.3 View Integration
- [ ] Update **views/index.ts** to export all view components
- [ ] Ensure views consume adapters properly
- [ ] Add integration tests for view-adapter interactions

## Phase 5: Page Integration

### 5.1 Main Page Refactor
- [ ] **AccordionRacesPage.tsx** - Refactor existing page
  - [ ] Replace direct data access with adapters
  - [ ] Use new view components
  - [ ] Maintain exact UI/UX
  - [ ] Ensure all functionality preserved
  - [ ] Write comprehensive tests

### 5.2 Demo Page Enhancement
- [ ] **RacesMVADemoPage.tsx** - Enhance demo page
  - [ ] Showcase all new components
  - [ ] Demonstrate adapter usage
  - [ ] Add interactive examples
  - [ ] Document usage patterns

### 5.3 Page Integration
- [ ] Update **pages/index.ts** to export all pages
- [ ] Ensure proper routing integration
- [ ] Test page navigation and state persistence

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

## Phase 8: Migration Completion

### 8.1 Feature Integration
- [ ] Integrate with main application
- [ ] Test with other features
- [ ] Ensure no breaking changes
- [ ] Update feature flags if needed

### 8.2 Deployment
- [ ] Deploy to staging environment
- [ ] Perform user acceptance testing
- [ ] Deploy to production
- [ ] Monitor for issues

### 8.3 Post-Migration
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