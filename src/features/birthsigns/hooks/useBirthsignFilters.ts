import { useReducer, useCallback, useMemo } from 'react'
import type { SelectedTag, SearchOption, SearchCategory, PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { Birthsign } from '../types'
import { getAllGroups, getAllStats, transformBirthsignToPlayerCreationItem } from '../utils'
import { useFuzzySearch } from '../hooks'

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
      if (state.selectedTags.some(t => t.value === action.payload.value && t.category === action.payload.category)) {
        return state
      }
      return { ...state, selectedTags: [...state.selectedTags, action.payload] }
    case 'REMOVE_TAG':
      return { ...state, selectedTags: state.selectedTags.filter(tag => tag.id !== action.payload) }
    case 'SET_SORT':
      return { ...state, sortBy: action.payload }
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload }
    case 'TOGGLE_EXPANDED': {
      const newExpanded = new Set(state.expandedBirthsigns)
      if (newExpanded.has(action.payload)) {
        newExpanded.delete(action.payload)
      } else {
        newExpanded.add(action.payload)
      }
      return { ...state, expandedBirthsigns: newExpanded }
    }
    case 'EXPAND_ALL':
      return { ...state, expandedBirthsigns: new Set(action.payload) }
    case 'COLLAPSE_ALL':
      return { ...state, expandedBirthsigns: new Set() }
    default:
      return state
  }
}

export function useBirthsignFilters(birthsigns: Birthsign[]) {
  const [state, dispatch] = useReducer(filterReducer, initialState)

  // Generate enhanced search categories for autocomplete
  const searchCategories: SearchCategory[] = useMemo(() => {
    const groups = getAllGroups(birthsigns)
    const stats = getAllStats(birthsigns)
    return [
      {
        id: 'fuzzy-search',
        name: 'Fuzzy Search',
        placeholder: 'Search by name, description, or abilities...',
        options: [],
      },
      {
        id: 'groups',
        name: 'Birthsign Groups',
        placeholder: 'Search by birthsign group...',
        options: groups.map(group => ({
          id: `group-${group}`,
          label: group,
          value: group,
          category: 'Birthsign Groups',
          description: `Birthsigns from ${group} group`,
        })),
      },
      {
        id: 'stats',
        name: 'Stats & Skills',
        placeholder: 'Search by stats and skills...',
        options: stats.map(stat => ({
          id: `stat-${stat}`,
          label: stat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value: stat,
          category: 'Stats & Skills',
          description: `Birthsigns that affect ${stat}`,
        })),
      },
    ]
  }, [birthsigns])

  // Filtering logic
  const filteredBirthsigns = useMemo(() => {
    if (state.selectedTags.length === 0) return birthsigns
    return birthsigns.filter(birthsign => {
      return state.selectedTags.every(tag => {
        switch (tag.category) {
          case 'Fuzzy Search':
            return true
          case 'Birthsign Groups':
            return birthsign.group === tag.value
          case 'Stats & Skills': {
            const allStats = [
              ...birthsign.stat_modifications.map(stat => stat.stat),
              ...birthsign.skill_bonuses.map(skill => skill.stat),
            ]
            return allStats.some(stat => stat === tag.value)
          }
          default:
            return true
        }
      })
    })
  }, [birthsigns, state.selectedTags])

  // Fuzzy search query
  const fuzzySearchQuery = useMemo(() =>
    state.selectedTags.filter(tag => tag.category === 'Fuzzy Search').map(tag => tag.value).join(' '),
    [state.selectedTags]
  )

  // Fuzzy search
  const { filteredBirthsigns: fuzzyFilteredBirthsigns } = useFuzzySearch(filteredBirthsigns, fuzzySearchQuery)

  // Convert to PlayerCreationItem format
  const displayItems: PlayerCreationItem[] = useMemo(() =>
    fuzzyFilteredBirthsigns.map(transformBirthsignToPlayerCreationItem),
    [fuzzyFilteredBirthsigns]
  )

  // Sorting
  const sortedDisplayItems = useMemo(() => {
    return [...displayItems].sort((a, b) => {
      switch (state.sortBy) {
        case 'alphabetical':
          return a.name.localeCompare(b.name)
        case 'group': {
          const getGroupPriority = (group: string | undefined) => {
            switch (group) {
              case 'Warrior': return 1
              case 'Mage': return 2
              case 'Thief': return 3
              case 'Serpent': return 4
              case 'Other': return 5
              default: return 6
            }
          }
          const aPriority = getGroupPriority(a.category)
          const bPriority = getGroupPriority(b.category)
          if (aPriority !== bPriority) return aPriority - bPriority
          return a.name.localeCompare(b.name)
        }
        case 'power-count': {
          const aPowerCount = a.effects?.filter(effect => effect.target === 'power').length || 0
          const bPowerCount = b.effects?.filter(effect => effect.target === 'power').length || 0
          if (aPowerCount !== bPowerCount) return bPowerCount - aPowerCount
          return a.name.localeCompare(b.name)
        }
        default:
          return 0
      }
    })
  }, [displayItems, state.sortBy])

  // Handlers
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
    searchCategories,
    fuzzySearchQuery,
    filteredBirthsigns,
    displayItems,
    sortedDisplayItems,
  }
} 