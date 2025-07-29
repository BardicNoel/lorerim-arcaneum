import { useState, useMemo, useCallback } from 'react'
import { SpellModel } from '../model/SpellModel'
import type { SpellWithComputed, SpellFilters, SpellSearchResult } from '../types'
import type { SelectedTag } from '@/shared/components/playerCreation/types'

interface UseSpellFiltersOptions {
  initialFilters?: Partial<SpellFilters>
  enableSearch?: boolean
  enableSorting?: boolean
}

interface UseSpellFiltersReturn {
  // Filters state
  filters: SpellFilters
  searchTerm: string
  
  // Tag-based filtering (new)
  selectedTags: SelectedTag[]
  setSelectedTags: (tags: SelectedTag[]) => void
  addTagFilter: (tag: SelectedTag) => void
  removeTagFilter: (tagId: string) => void
  clearAllTags: () => void
  
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

  // Ensure spells is always an array
  const safeSpells = Array.isArray(spells) ? spells : []

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

  // Tag-based filtering state (new)
  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([])

  // Sorting state
  const [sortBy, setSortBy] = useState<'name' | 'school' | 'level' | 'magickaCost' | 'magnitude' | 'duration'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Tag management functions (new)
  const addTagFilter = useCallback((tag: SelectedTag) => {
    if (!selectedTags.some(t => t.value === tag.value && t.category === tag.category)) {
      setSelectedTags(prev => [...prev, tag])
    }
  }, [selectedTags])

  const removeTagFilter = useCallback((tagId: string) => {
    setSelectedTags(prev => prev.filter(tag => tag.id !== tagId))
  }, [])

  const clearAllTags = useCallback(() => {
    setSelectedTags([])
  }, [])

  // Apply tag-based filters first (new)
  const filteredByTags = useMemo(() => {
    if (selectedTags.length === 0) return safeSpells
    
    return safeSpells.filter(spell => {
      return selectedTags.every(tag => {
        switch (tag.category) {
          case 'Magic Schools':
            return spell.school === tag.value
          case 'Spell Levels':
            return spell.level === tag.value
          case 'Fuzzy Search':
            return true // Handled by fuzzy search later
          default:
            return true
        }
      })
    })
  }, [safeSpells, selectedTags])

  // Apply existing filters to tag-filtered spells
  const filteredSpells = useMemo(() => {
    return SpellModel.applyFilters(filteredByTags, filters)
  }, [filteredByTags, filters])

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
      selectedTags.length > 0 ||
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
  }, [selectedTags, filters])

  const filterCount = useMemo(() => {
    let count = 0
    if (selectedTags.length > 0) count += 1
    if (filters.schools.length > 0) count += 1
    if (filters.levels.length > 0) count += 1
    if (filters.searchTerm) count += 1
    if (filters.hasEffects !== null) count += 1
    if (filters.isAreaSpell !== null) count += 1
    if (filters.isDurationSpell !== null) count += 1
    if (filters.minMagickaCost !== null || filters.maxMagickaCost !== null) count += 1
    if (filters.minMagnitude !== null || filters.maxMagnitude !== null) count += 1
    return count
  }, [selectedTags, filters])

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
    setSelectedTags([])
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
    
    // Tag-based filtering (new)
    selectedTags,
    setSelectedTags,
    addTagFilter,
    removeTagFilter,
    clearAllTags,
    
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