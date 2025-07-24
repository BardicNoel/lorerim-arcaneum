# Destiny Filters - Immediate TODO

## 🚀 Next Priority Tasks (This Week)

### 1. Implement Path Filtering Logic
**File:** `src/features/destiny/adapters/useDestinyFilters.ts`
- [ ] Update `filteredPaths` to actually filter paths based on selected filters
- [ ] Integrate with `useDestinyPossiblePaths` to get actual possible paths
- [ ] Implement "includes-node" filtering logic
- [ ] Implement "ends-with-node" filtering logic

### 2. Reference Page Filtering
**File:** `src/features/destiny/pages/UnifiedDestinyPage.tsx`
- [ ] Apply tag filters to filter nodes in reference view
- [ ] Apply prerequisite filters to filter nodes in reference view
- [ ] Update `DestinyAccordionList` to use filtered data instead of `filteredItems`
- [ ] Remove legacy `usePlayerCreation` and `usePlayerCreationFilters` usage

### 3. Filter Persistence
**File:** `src/features/destiny/adapters/useDestinyFilters.ts`
- [ ] Add URL state management for filters
- [ ] Save filter state in URL parameters
- [ ] Restore filters on page reload
- [ ] Share filtered views via URL

## 🔧 Quick Fixes Needed

### 1. Remove Legacy Code
**File:** `src/features/destiny/pages/UnifiedDestinyPage.tsx`
- [ ] Remove `generateSearchCategories()` function (no longer needed)
- [ ] Remove `usePlayerCreation` hook usage
- [ ] Remove `usePlayerCreationFilters` hook usage
- [ ] Clean up unused imports

### 2. Update Component Integration
**File:** `src/features/destiny/components/composition/DestinyPathBuilder.tsx`
- [ ] Connect path builder to filtered paths from destiny filters
- [ ] Show filtered possible paths instead of all paths

## 🧪 Testing Tasks

### 1. Integration Tests
- [ ] Test filter integration with path building
- [ ] Test reference page filtering
- [ ] Test filter persistence in URL

### 2. Manual Testing
- [ ] Test build path filters with actual destiny data
- [ ] Test reference page filters with actual destiny data
- [ ] Test filter combinations
- [ ] Test filter persistence across page reloads

## 📋 Current Status

**✅ Working:**
- Filter UI components
- Filter state management
- Autocomplete functionality
- Chip removal and clearing
- TypeScript safety

**🔄 Partially Working:**
- Filter selection and storage
- Search categories generation

**❌ Not Working:**
- Actual path filtering (returns empty array)
- Reference page filtering (still uses legacy system)
- Filter persistence
- Integration with path builder

## 🎯 Success Criteria

1. **Build Path Filters**: Users can filter possible paths by including specific nodes or ending with specific terminals
2. **Reference Page Filters**: Users can filter nodes by tags or prerequisites
3. **Filter Persistence**: Filters are saved in URL and restored on page reload
4. **Performance**: Filtering works smoothly with large datasets
5. **UX**: Filter interaction feels natural and consistent with Race page

## 📝 Notes

- The core infrastructure is solid and follows MVA architecture
- The main work is connecting the filters to actual data filtering
- The Race page pattern provides a good reference for the interaction model
- TypeScript safety is maintained throughout 