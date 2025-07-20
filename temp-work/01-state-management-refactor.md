# Unit of Work: State Management Refactor

## 📋 Overview

Refactor the complex state management in `AccordionBirthsignsPage` from multiple useState calls to a more maintainable useReducer pattern with custom hooks.

## 🎯 Objective

Improve maintainability and reduce complexity by consolidating related state into logical groups with proper separation of concerns.

## 📊 Current Issues

- **8 separate useState calls** in AccordionBirthsignsPage
- **Complex filtering logic** mixed with component logic
- **No separation** between data, UI, and filter state
- **Difficult to test** individual state slices

## 🔧 Proposed Changes

### 1. Create State Reducers

#### `src/features/birthsigns/hooks/useBirthsignData.ts`

```typescript
interface BirthsignDataState {
  birthsigns: Birthsign[]
  loading: boolean
  error: string | null
}

type BirthsignDataAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Birthsign[] }
  | { type: 'FETCH_ERROR'; payload: string }

function birthsignDataReducer(
  state: BirthsignDataState,
  action: BirthsignDataAction
): BirthsignDataState {
  // Implementation
}
```

#### `src/features/birthsigns/hooks/useBirthsignFilters.ts`

```typescript
interface FilterState {
  selectedTags: SelectedTag[]
  sortBy: SortOption
  viewMode: ViewMode
  expandedBirthsigns: Set<string>
}

type FilterAction =
  | { type: 'ADD_TAG'; payload: SelectedTag }
  | { type: 'REMOVE_TAG'; payload: string }
  | { type: 'SET_SORT'; payload: SortOption }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'TOGGLE_EXPANDED'; payload: string }
  | { type: 'EXPAND_ALL'; payload: string[] }
  | { type: 'COLLAPSE_ALL' }
```

#### `src/features/birthsigns/hooks/useDisplayControls.ts`

```typescript
interface DisplayState {
  showStats: boolean
  showPowers: boolean
  showSkills: boolean
  showEffects: boolean
}

type DisplayAction =
  | { type: 'TOGGLE_STATS' }
  | { type: 'TOGGLE_POWERS' }
  | { type: 'TOGGLE_SKILLS' }
  | { type: 'TOGGLE_EFFECTS' }
  | { type: 'TOGGLE_ALL'; payload: boolean }
```

### 2. Create Custom Hooks

#### `src/features/birthsigns/hooks/useBirthsignData.ts`

```typescript
export function useBirthsignData() {
  const [state, dispatch] = useReducer(birthsignDataReducer, initialState)

  const fetchBirthsigns = useCallback(async () => {
    dispatch({ type: 'FETCH_START' })
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}data/birthsigns.json`)
      if (!res.ok) throw new Error('Failed to fetch birthsign data')
      const data = await res.json()
      dispatch({ type: 'FETCH_SUCCESS', payload: data })
    } catch (err) {
      dispatch({
        type: 'FETCH_ERROR',
        payload: 'Failed to load birthsign data',
      })
    }
  }, [])

  useEffect(() => {
    fetchBirthsigns()
  }, [fetchBirthsigns])

  return { ...state, refetch: fetchBirthsigns }
}
```

#### `src/features/birthsigns/hooks/useBirthsignFilters.ts`

```typescript
export function useBirthsignFilters() {
  const [state, dispatch] = useReducer(filterReducer, initialState)

  const addTag = useCallback((tag: SelectedTag) => {
    dispatch({ type: 'ADD_TAG', payload: tag })
  }, [])

  const removeTag = useCallback((tagId: string) => {
    dispatch({ type: 'REMOVE_TAG', payload: tagId })
  }, [])

  const setSort = useCallback((sortBy: SortOption) => {
    dispatch({ type: 'SET_SORT', payload: sortBy })
  }, [])

  const setViewMode = useCallback((viewMode: ViewMode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: viewMode })
  }, [])

  const toggleExpanded = useCallback((birthsignId: string) => {
    dispatch({ type: 'TOGGLE_EXPANDED', payload: birthsignId })
  }, [])

  const expandAll = useCallback((birthsignIds: string[]) => {
    dispatch({ type: 'EXPAND_ALL', payload: birthsignIds })
  }, [])

  const collapseAll = useCallback(() => {
    dispatch({ type: 'COLLAPSE_ALL' })
  }, [])

  return {
    ...state,
    addTag,
    removeTag,
    setSort,
    setViewMode,
    toggleExpanded,
    expandAll,
    collapseAll,
  }
}
```

#### `src/features/birthsigns/hooks/useDisplayControls.ts`

```typescript
export function useDisplayControls() {
  const [state, dispatch] = useReducer(displayReducer, initialState)

  const toggleStats = useCallback(() => {
    dispatch({ type: 'TOGGLE_STATS' })
  }, [])

  const togglePowers = useCallback(() => {
    dispatch({ type: 'TOGGLE_POWERS' })
  }, [])

  const toggleSkills = useCallback(() => {
    dispatch({ type: 'TOGGLE_SKILLS' })
  }, [])

  const toggleEffects = useCallback(() => {
    dispatch({ type: 'TOGGLE_EFFECTS' })
  }, [])

  const toggleAll = useCallback((enabled: boolean) => {
    dispatch({ type: 'TOGGLE_ALL', payload: enabled })
  }, [])

  return {
    ...state,
    toggleStats,
    togglePowers,
    toggleSkills,
    toggleEffects,
    toggleAll,
  }
}
```

### 3. Refactor Main Component

#### `src/features/birthsigns/pages/AccordionBirthsignsPage.tsx`

```typescript
export function AccordionBirthsignsPage() {
  const { birthsigns, loading, error, refetch } = useBirthsignData()
  const {
    selectedTags,
    sortBy,
    viewMode,
    expandedBirthsigns,
    addTag,
    removeTag,
    setSort,
    setViewMode,
    toggleExpanded,
    expandAll,
    collapseAll,
  } = useBirthsignFilters()
  const {
    showStats,
    showPowers,
    showSkills,
    showEffects,
    toggleStats,
    togglePowers,
    toggleSkills,
    toggleEffects,
    toggleAll,
  } = useDisplayControls()

  // Rest of component logic using the new hooks
}
```

## 📁 Files to Create/Modify

### New Files

- `src/features/birthsigns/hooks/useBirthsignData.ts`
- `src/features/birthsigns/hooks/useBirthsignFilters.ts`
- `src/features/birthsigns/hooks/useDisplayControls.ts`

### Modified Files

- `src/features/birthsigns/hooks/index.ts` - Export new hooks
- `src/features/birthsigns/pages/AccordionBirthsignsPage.tsx` - Use new hooks

## 🧪 Testing Strategy

- Unit tests for each reducer function
- Integration tests for custom hooks
- Component tests for the refactored page

## 📈 Benefits

- **Separation of Concerns**: Each hook handles one aspect of state
- **Testability**: Individual state slices can be tested in isolation
- **Reusability**: Hooks can be reused in other components
- **Maintainability**: Easier to understand and modify state logic
- **Performance**: Better memoization opportunities

## ⚠️ Risks

- **Breaking Changes**: Existing component behavior must be preserved
- **Migration Complexity**: Need to carefully migrate existing state
- **Testing Overhead**: Additional tests required for new hooks

## 🎯 Success Criteria

- [x] All state management moved to custom hooks
- [x] Component reduced to <200 lines
- [x] All existing functionality preserved
- [ ] Unit tests for all reducers and hooks
- [x] No performance regressions

## 📅 Estimated Effort

- **Development**: 2-3 days
- **Testing**: 1 day
- **Total**: 3-4 days

## ✅ Refactor Complete

The state management refactor has been successfully completed! Here's what was accomplished:

### 🎯 Achievements

1. **Created 3 Custom Hooks**:
   - `useBirthsignData` - Manages data fetching, loading, and error states
   - `useBirthsignFilters` - Manages filtering, sorting, view mode, and accordion expansion
   - `useDisplayControls` - Manages display visibility toggles

2. **Reduced Component Complexity**:
   - Removed 8 separate `useState` calls
   - Consolidated related state into logical groups
   - Improved separation of concerns

3. **Maintained Functionality**:
   - All existing features preserved
   - Build passes successfully
   - No breaking changes introduced

### 📁 Files Created/Modified

**New Files:**

- `src/features/birthsigns/hooks/useBirthsignData.ts`
- `src/features/birthsigns/hooks/useBirthsignFilters.ts`
- `src/features/birthsigns/hooks/useDisplayControls.ts`

**Modified Files:**

- `src/features/birthsigns/hooks/index.ts` - Added exports for new hooks
- `src/features/birthsigns/pages/AccordionBirthsignsPage.tsx` - Refactored to use new hooks

### 🚀 Benefits Achieved

- **Better Testability**: Each state slice can be tested independently
- **Improved Reusability**: Hooks can be reused in other components
- **Enhanced Maintainability**: Clear separation of concerns
- **Better Performance**: Optimized memoization opportunities
- **Cleaner Code**: Component logic is more focused and readable

### 🔄 Next Steps

The only remaining item is to add unit tests for the new hooks and reducers, which can be done as a separate task.
