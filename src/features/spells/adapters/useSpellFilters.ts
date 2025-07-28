import { useState, useMemo, useCallback } from 'react'
import { SpellModel } from '../model/SpellModel'
import type { SpellWithComputed, SpellFilters, SpellSearchResult } from '../types'

interface UseSpellFiltersOptions {
  initialFilters?: Partial<SpellFilters>
  enableSearch?: boolean
  enableSorting?: boolean
}

interface UseSpellFiltersReturn {
  // Filters state
  filters: SpellFilters
  searchTerm: string
  
  // Filtered data
  filteredSpells: SpellWithComputed[]
  searchResults: SpellSearchResult[]
  
  // Computed
  hasActiveFilters: boolean
  filterCount: number
  
  // Actions
  setSearchTerm: (term: string) => void
  setSchools: (schools: string[]) => void
  setLevels: (levels: string[]) => void
  setHasEffects: (hasEffects: boolean | null) => void
  setIsAreaSpell: (isAreaSpell: boolean | null) => void
  setIsDurationSpell: (isDurationSpell: boolean | null) => void
  setMagickaCostRange: (min: number | null, max: number | null) => void
  setMagnitudeRange: (min: number | null, max: number | null) => void
  clearFilters: () => void
  clearSearch: () => void
  
  // Sorting
  sortBy: 'name' | 'school' | 'level' | 'magickaCost' | 'magnitude' | 'duration'
  sortOrder: 'asc' | 'desc'
  setSortBy: (sortBy: 'name' | 'school' | 'level' | 'magickaCost' | 'magnitude' | 'duration') => void
  setSortOrder: (sortOrder: 'asc' | 'desc') => void
  toggleSortOrder: () => void
}

export function useSpellFilters(
  spells: SpellWithComputed[],
  options: UseSpellFiltersOptions = {}
): UseSpellFiltersReturn {
  const { 
    initialFilters = {}, 
    enableSearch = true, 
    enableSorting = true 
  } = options

  // Filters state
  const [filters, setFilters] = useState<SpellFilters>({
    schools: [],
    levels: [],
    searchTerm: '',
    hasEffects: null,
    isAreaSpell: null,
    isDurationSpell: null,
    minMagickaCost: null,
    maxMagickaCost: null,
    minMagnitude: null,
    maxMagnitude: null,
    ...initialFilters
  })

  // Sorting state
  const [sortBy, setSortBy] = useState<'name' | 'school' | 'level' | 'magickaCost' | 'magnitude' | 'duration'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Apply filters to spells
  const filteredSpells = useMemo(() => {
    return SpellModel.applyFilters(spells, filters)
  }, [spells, filters])

  // Apply sorting
  const sortedSpells = useMemo(() => {
    if (!enableSorting) return filteredSpells
    return SpellModel.sort(filteredSpells, sortBy, sortOrder)
  }, [filteredSpells, sortBy, sortOrder, enableSorting])

  // Search results
  const searchResults = useMemo(() => {
    if (!enableSearch || !filters.searchTerm) {
      return sortedSpells.map(spell => ({
        spell,
        score: 1,
        matchedFields: []
      }))
    }
    return SpellModel.search(sortedSpells, filters.searchTerm)
  }, [sortedSpells, filters.searchTerm, enableSearch])

  // Computed properties
  const hasActiveFilters = useMemo(() => {
    return (
      filters.schools.length > 0 ||
      filters.levels.length > 0 ||
      filters.searchTerm !== '' ||
      filters.hasEffects !== null ||
      filters.isAreaSpell !== null ||
      filters.isDurationSpell !== null ||
      filters.minMagickaCost !== null ||
      filters.maxMagickaCost !== null ||
      filters.minMagnitude !== null ||
      filters.maxMagnitude !== null
    )
  }, [filters])

  const filterCount = useMemo(() => {
    let count = 0
    if (filters.schools.length > 0) count += 1
    if (filters.levels.length > 0) count += 1
    if (filters.searchTerm) count += 1
    if (filters.hasEffects !== null) count += 1
    if (filters.isAreaSpell !== null) count += 1
    if (filters.isDurationSpell !== null) count += 1
    if (filters.minMagickaCost !== null || filters.maxMagickaCost !== null) count += 1
    if (filters.minMagnitude !== null || filters.maxMagnitude !== null) count += 1
    return count
  }, [filters])

  // Filter actions
  const setSearchTerm = useCallback((term: string) => {
    setFilters(prev => ({ ...prev, searchTerm: term }))
  }, [])

  const setSchools = useCallback((schools: string[]) => {
    setFilters(prev => ({ ...prev, schools }))
  }, [])

  const setLevels = useCallback((levels: string[]) => {
    setFilters(prev => ({ ...prev, levels }))
  }, [])

  const setHasEffects = useCallback((hasEffects: boolean | null) => {
    setFilters(prev => ({ ...prev, hasEffects }))
  }, [])

  const setIsAreaSpell = useCallback((isAreaSpell: boolean | null) => {
    setFilters(prev => ({ ...prev, isAreaSpell }))
  }, [])

  const setIsDurationSpell = useCallback((isDurationSpell: boolean | null) => {
    setFilters(prev => ({ ...prev, isDurationSpell }))
  }, [])

  const setMagickaCostRange = useCallback((min: number | null, max: number | null) => {
    setFilters(prev => ({ 
      ...prev, 
      minMagickaCost: min, 
      maxMagickaCost: max 
    }))
  }, [])

  const setMagnitudeRange = useCallback((min: number | null, max: number | null) => {
    setFilters(prev => ({ 
      ...prev, 
      minMagnitude: min, 
      maxMagnitude: max 
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      schools: [],
      levels: [],
      searchTerm: '',
      hasEffects: null,
      isAreaSpell: null,
      isDurationSpell: null,
      minMagickaCost: null,
      maxMagickaCost: null,
      minMagnitude: null,
      maxMagnitude: null
    })
  }, [])

  const clearSearch = useCallback(() => {
    setFilters(prev => ({ ...prev, searchTerm: '' }))
  }, [])

  // Sorting actions
  const toggleSortOrder = useCallback(() => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }, [])

  return {
    // Filters state
    filters,
    searchTerm: filters.searchTerm,
    
    // Filtered data
    filteredSpells: sortedSpells,
    searchResults,
    
    // Computed
    hasActiveFilters,
    filterCount,
    
    // Actions
    setSearchTerm,
    setSchools,
    setLevels,
    setHasEffects,
    setIsAreaSpell,
    setIsDurationSpell,
    setMagickaCostRange,
    setMagnitudeRange,
    clearFilters,
    clearSearch,
    
    // Sorting
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    toggleSortOrder
  }
} 