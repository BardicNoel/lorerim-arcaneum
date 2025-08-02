# InfiniteGrid Migration Checklist

## Overview

This checklist outlines the step-by-step process to migrate from `react-masonry-css` to `@egjs/react-infinitegrid` for improved virtualization and performance with large datasets (2,500+ items).

## Current State Analysis

- **Current Library**: `react-masonry-css` v1.0.16
- **Primary Usage**: `SearchResultsGrid.tsx` in search feature
- **Grid Configuration**: Responsive breakpoints (3/2/1 columns)
- **Item Types**: Multiple searchable item types with dynamic heights

---

## Phase 1: Environment Setup & Dependencies

### 1.1 Install Dependencies

- [x] Install `@egjs/react-infinitegrid`
- [x] Install `@egjs/infinitegrid` (core dependency)
- [x] Update `package.json` and `package-lock.json`
- [x] Verify TypeScript types are available

### 1.2 Remove Old Dependencies

- [x] Remove `react-masonry-css` from `package.json`
- [x] Run `npm uninstall react-masonry-css`
- [x] Remove `search-masonry.css` file
- [x] Update any remaining imports

---

## Phase 2: Isolated Test Implementation (MANDATORY)

### 2.1 Create Test Page Structure

- [x] Create `src/features/search/pages/VirtualMasonryDemoPage.tsx`
- [x] Add route to router configuration
- [x] Create navigation link for testing

### 2.2 Implement Dummy Data Generator

- [x] Create utility function to generate 100-200 dummy items
- [x] Implement randomized heights (100-300px)
- [x] Add optional randomized widths for responsive testing
- [x] Include unique IDs and mock content

### 2.3 Build Core VirtualMasonryGrid Component

- [x] Create `src/features/search/components/composition/VirtualMasonryGrid.tsx`
- [x] Implement TypeScript interface:
  ```ts
  interface VirtualMasonryGridProps<T> {
    items: T[]
    keyExtractor: (item: T) => string
    renderItem: (item: T) => React.ReactNode
    loadMore?: () => void
    hasMore?: boolean
    columns?: number // Default 3
    gap?: number // Default 12px
    maxColumnWidth?: number // Optional, for responsive constraints
    className?: string
  }
  ```

### 2.4 Implement InfiniteGrid Integration

- [x] Import and configure `InfiniteGrid` from `@egjs/react-infinitegrid`
- [x] Set up `onRequestAppend` callback to trigger `loadMore`
- [x] Configure `useRecycle={true}` for DOM node reuse
- [x] Implement responsive column calculation
- [x] Add proper width constraints to item containers

### 2.5 Create Test Item Component

- [x] Build simple test card component with:
  - Dynamic height based on content
  - `width: 100%` styling
  - Visual indicators for testing (borders, colors)
  - Height measurement capabilities

### 2.6 Implement Infinite Scroll Logic

- [x] Add state management for loaded items
- [x] Implement batch loading (20-40 items per request)
- [x] Add 80% scroll threshold detection
- [x] Handle loading states and error cases

---

## Phase 3: Testing & Validation

### 3.1 Basic Functionality Tests

- [ ] Test page renders 200 dummy items without overlap
- [ ] Verify dynamic heights (100-300px) are respected
- [ ] Confirm infinite scroll loads new items at ~80% scroll
- [ ] Test window resize → grid recalculates layout
- [ ] Verify no noticeable lag with 1,600+ items loaded

### 3.2 Layout & Sizing Tests

- [ ] Test responsive breakpoints (3/2/1 columns)
- [ ] Verify consistent gap spacing between items
- [ ] Test with different screen sizes
- [ ] Confirm no horizontal overflow
- [ ] Test with items of varying heights

### 3.3 Performance Tests

- [ ] Monitor memory usage with 2,500+ items
- [ ] Test smooth scrolling performance
- [ ] Verify DOM node recycling is working
- [ ] Test rapid scrolling and item loading
- [ ] Monitor CPU usage during interactions

### 3.4 Edge Case Tests

- [ ] Test with empty item array
- [ ] Test with single item
- [ ] Test rapid window resizing
- [ ] Test with very tall items (500px+)
- [ ] Test with very short items (50px-)

---

## Phase 4: Production Migration

### 4.1 Update SearchResultsGrid Component

- [x] Replace `react-masonry-css` import with `VirtualMasonryGrid`
- [x] Update component props to match new interface
- [x] Remove old masonry CSS classes
- [x] Update responsive breakpoint logic

### 4.2 Adapt SearchCard Components

- [x] Ensure all `SearchCard` variants use `width: 100%`
- [x] Verify height is either intrinsic or fixed via props
- [x] Test each type-specific card (Race, Skill, Trait, etc.)
- [x] Update any hardcoded width constraints

### 4.3 Implement Data Integration

- [ ] Connect real search data to `VirtualMasonryGrid`
- [ ] Implement proper `keyExtractor` for search items
- [ ] Add `loadMore` callback for search pagination
- [ ] Handle search result updates and filtering

### 4.4 Update CSS and Styling

- [x] Remove `search-masonry.css` references
- [x] Update any grid-related Tailwind classes
- [x] Ensure responsive design works with new grid
- [x] Test dark/light theme compatibility

---

## Phase 5: Advanced Features

### 5.1 Optimize Item Measurement

- [ ] Implement `updateItems()` calls after async content loads
- [ ] Add height measurement for dynamic content (images, text)
- [ ] Optimize re-renders when item data changes
- [ ] Add debounced layout updates

### 5.2 Add Loading States

- [ ] Implement loading indicators during item fetch
- [ ] Add skeleton placeholders for new items
- [ ] Handle loading errors gracefully
- [ ] Add retry mechanisms for failed loads

### 5.3 Performance Optimizations

- [ ] Implement item memoization with `React.memo`
- [ ] Add intersection observer for better scroll detection
- [ ] Optimize re-render triggers
- [ ] Add performance monitoring

---

## Phase 6: Testing & Quality Assurance

### 6.1 Integration Testing

- [ ] Test with all search result types
- [ ] Verify search filtering works correctly
- [ ] Test selection and detail panel functionality
- [ ] Verify keyboard navigation

### 6.2 Cross-Browser Testing

- [ ] Test in Chrome, Firefox, Safari, Edge
- [ ] Verify mobile responsiveness
- [ ] Test touch scrolling on mobile devices
- [ ] Check accessibility features

### 6.3 Performance Validation

- [ ] Load test with 2,500+ search results
- [ ] Monitor memory usage over time
- [ ] Test rapid search queries
- [ ] Verify smooth scrolling performance

---

## Phase 7: Documentation & Cleanup

### 7.1 Update Documentation

- [ ] Update component documentation
- [ ] Add migration notes to README
- [ ] Document new props and interfaces
- [ ] Add performance considerations

### 7.2 Code Cleanup

- [ ] Remove unused imports and dependencies
- [ ] Clean up old masonry-related code
- [ ] Update TypeScript types
- [ ] Remove test files and routes

### 7.3 Final Validation

- [ ] Run full test suite
- [ ] Verify no console errors
- [ ] Check bundle size impact
- [ ] Final performance review

---

## Success Criteria

### Performance Targets

- [ ] Smooth scrolling with 2,500+ items
- [ ] Memory usage stays under 100MB
- [ ] No layout thrash during scrolling
- [ ] Responsive design works on all screen sizes

### Functionality Requirements

- [ ] All existing search features work
- [ ] Infinite scroll loads items correctly
- [ ] Item selection and detail panels function
- [ ] Search filtering and sorting work

### User Experience

- [ ] No visible lag or stuttering
- [ ] Smooth transitions and animations
- [ ] Consistent visual design
- [ ] Accessible keyboard navigation

---

## Rollback Plan

If issues arise during migration:

1. Keep `react-masonry-css` as fallback dependency
2. Maintain feature flag for switching between implementations
3. Document rollback procedure
4. Monitor performance metrics closely

---

## Notes

- **Critical**: Start with isolated test page before touching production code
- **Width Constraints**: InfiniteGrid requires predictable widths - use `calc(100%/columns - gap)` or fixed `columnSize`
- **Height Flexibility**: Heights can be dynamic but must be measurable on mount
- **Responsive Design**: Test thoroughly across all breakpoints
- **Performance**: Monitor memory usage and scrolling performance throughout migration
