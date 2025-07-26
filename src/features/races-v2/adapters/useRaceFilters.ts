import { useState, useMemo, useCallback } from 'react'
import { RaceModel } from '../model/RaceModel'
import type { Race, RaceFilters } from '../types'

interface UseRaceFiltersOptions {
  races: Race[]
}

interface UseRaceFiltersReturn {
  // State
  searchQuery: string
  activeFilters: RaceFilters

  // Computed
  filteredRaces: Race[]
  categories: string[]
  tags: string[]

  // Actions
  setSearchQuery: (query: string) => void
  setFilters: (filters: RaceFilters) => void
  clearFilters: () => void
  addTagFilter: (tag: string) => void
  removeTagFilter: (tag: string) => void
  setCategoryFilter: (category: string) => void
}

export function useRaceFilters({ races }: UseRaceFiltersOptions): UseRaceFiltersReturn {
  const [searchQuery, setSearchQueryState] = useState('')
  const [activeFilters, setActiveFiltersState] = useState<RaceFilters>({
    search: '',
    type: '',
    tags: [],
  })

  // Computed values
  const categories = useMemo(() => {
    return RaceModel.getUniqueCategories(races)
  }, [races])

  const tags = useMemo(() => {
    return RaceModel.getUniqueTags(races)
  }, [races])

  // Filtered races based on current state
  const filteredRaces = useMemo(() => {
    let filtered = races

    // Apply search query
    if (searchQuery.trim()) {
      filtered = RaceModel.search(filtered, searchQuery)
    }

    // Apply category filter
    if (activeFilters.type) {
      filtered = RaceModel.filterByCategory(filtered, activeFilters.type)
    }

    // Apply tag filters
    if (activeFilters.tags.length > 0) {
      filtered = RaceModel.filterByTags(filtered, activeFilters.tags)
    }

    return RaceModel.sortByName(filtered)
  }, [races, searchQuery, activeFilters])

  // Actions
  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query)
    setActiveFiltersState(prev => ({
      ...prev,
      search: query,
    }))
  }, [])

  const setFilters = useCallback((filters: RaceFilters) => {
    setActiveFiltersState(filters)
    setSearchQueryState(filters.search)
  }, [])

  const clearFilters = useCallback(() => {
    setSearchQueryState('')
    setActiveFiltersState({
      search: '',
      type: '',
      tags: [],
    })
  }, [])

  const addTagFilter = useCallback((tag: string) => {
    setActiveFiltersState(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags : [...prev.tags, tag],
    }))
  }, [])

  const removeTagFilter = useCallback((tag: string) => {
    setActiveFiltersState(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }))
  }, [])

  const setCategoryFilter = useCallback((category: string) => {
    setActiveFiltersState(prev => ({
      ...prev,
      type: category,
    }))
  }, [])

  return {
    // State
    searchQuery,
    activeFilters,

    // Computed
    filteredRaces,
    categories,
    tags,

    // Actions
    setSearchQuery,
    setFilters,
    clearFilters,
    addTagFilter,
    removeTagFilter,
    setCategoryFilter,
  }
} 