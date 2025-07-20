import { useCallback, useReducer } from 'react'
import type { SelectedTag } from '@/shared/components/playerCreation/types'

type SortOption = 'alphabetical' | 'group' | 'power-count'
type ViewMode = 'list' | 'grid'

interface FilterState {
  selectedTags: SelectedTag[]
  sortBy: SortOption
  viewMode: ViewMode
  expandedBirthsigns: Set<string>
}

type FilterAction =
  | { type: 'ADD_TAG'; payload: SelectedTag }
  | { type: 'REMOVE_TAG'; payload: string }
  | { type: 'CLEAR_ALL_TAGS' }
  | { type: 'SET_SORT'; payload: SortOption }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'TOGGLE_EXPANDED'; payload: string }
  | { type: 'EXPAND_ALL'; payload: string[] }
  | { type: 'COLLAPSE_ALL' }

const initialState: FilterState = {
  selectedTags: [],
  sortBy: 'alphabetical',
  viewMode: 'grid',
  expandedBirthsigns: new Set(),
}

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'ADD_TAG':
      // Prevent duplicate tags
      if (
        !state.selectedTags.some(
          t =>
            t.value === action.payload.value &&
            t.category === action.payload.category
        )
      ) {
        return {
          ...state,
          selectedTags: [...state.selectedTags, action.payload],
        }
      }
      return state

    case 'REMOVE_TAG':
      return {
        ...state,
        selectedTags: state.selectedTags.filter(
          tag => tag.id !== action.payload
        ),
      }

    case 'CLEAR_ALL_TAGS':
      return {
        ...state,
        selectedTags: [],
      }

    case 'SET_SORT':
      return {
        ...state,
        sortBy: action.payload,
      }

    case 'SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload,
      }

    case 'TOGGLE_EXPANDED':
      const newExpanded = new Set(state.expandedBirthsigns)
      if (newExpanded.has(action.payload)) {
        newExpanded.delete(action.payload)
      } else {
        newExpanded.add(action.payload)
      }
      return {
        ...state,
        expandedBirthsigns: newExpanded,
      }

    case 'EXPAND_ALL':
      return {
        ...state,
        expandedBirthsigns: new Set(action.payload),
      }

    case 'COLLAPSE_ALL':
      return {
        ...state,
        expandedBirthsigns: new Set(),
      }

    default:
      return state
  }
}

export function useBirthsignFilters() {
  const [state, dispatch] = useReducer(filterReducer, initialState)

  const addTag = useCallback((tag: SelectedTag) => {
    dispatch({ type: 'ADD_TAG', payload: tag })
  }, [])

  const removeTag = useCallback((tagId: string) => {
    dispatch({ type: 'REMOVE_TAG', payload: tagId })
  }, [])

  const clearAllTags = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_TAGS' })
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
    clearAllTags,
    setSort,
    setViewMode,
    toggleExpanded,
    expandAll,
    collapseAll,
  }
}
