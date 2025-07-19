import { useState, useMemo, useCallback } from 'react'
import type {
  PlayerCreationItem,
  PlayerCreationFilters,
  FilterGroup,
} from '../components/playerCreation/types'

interface UsePlayerCreationOptions<T extends PlayerCreationItem> {
  items: T[]
  filters?: FilterGroup[]
}

export function usePlayerCreation<T extends PlayerCreationItem>({
  items,
  filters = [],
}: UsePlayerCreationOptions<T>) {
  const [selectedItem, setSelectedItem] = useState<T | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentFilters, setCurrentFilters] = useState<PlayerCreationFilters>({
    search: '',
    selectedFilters: {},
    selectedTags: [],
  })

  // Filter items based on search and tags
  const filteredItems = useMemo(() => {
    let result = items

    // Apply search filter
    if (currentFilters.search) {
      const searchLower = currentFilters.search.toLowerCase()
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Apply tag-based filtering
    if (currentFilters.selectedTags.length > 0) {
      result = result.filter(item => {
        // For now, we'll use a simple tag matching approach
        // This can be customized based on specific requirements
        return currentFilters.selectedTags.some(
          tag =>
            item.tags.includes(tag.value) ||
            item.category === tag.value ||
            item.name.toLowerCase().includes(tag.value.toLowerCase())
        )
      })
    }

    return result
  }, [items, currentFilters])

  // Update filters with counts (only if filters are provided)
  const filtersWithCounts = useMemo(() => {
    if (filters.length === 0) return []

    return filters.map(filterGroup => ({
      ...filterGroup,
      options: filterGroup.options.map(option => ({
        ...option,
        count: items.filter(item => {
          // Count items that match this filter option
          return (
            item.tags.includes(option.value) || item.category === option.value
          )
        }).length,
      })),
    }))
  }, [filters, items])

  const handleItemSelect = useCallback((item: T) => {
    setSelectedItem(item)
  }, [])

  const handleFiltersChange = useCallback((filters: PlayerCreationFilters) => {
    setCurrentFilters(filters)
  }, [])

  const handleSearch = useCallback((query: string) => {
    setCurrentFilters(prev => ({ ...prev, search: query }))
  }, [])

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode)
  }, [])

  return {
    // State
    selectedItem,
    viewMode,
    currentFilters,

    // Computed
    filteredItems,
    filtersWithCounts,

    // Actions
    handleItemSelect,
    handleFiltersChange,
    handleSearch,
    handleViewModeChange,
    setSelectedItem,
  }
}
