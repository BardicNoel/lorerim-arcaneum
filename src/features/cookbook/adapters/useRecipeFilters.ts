import { useState, useMemo, useCallback } from 'react'
import { RecipeModel } from '../model/RecipeModel'
import type { RecipeWithComputed, RecipeFilters, RecipeSearchResult } from '../types'
import type { SelectedTag } from '@/shared/components/playerCreation/types'

interface UseRecipeFiltersOptions {
  initialFilters?: Partial<RecipeFilters>
  enableSearch?: boolean
  enableSorting?: boolean
}

interface UseRecipeFiltersReturn {
  // Filters state
  filters: RecipeFilters
  searchTerm: string
  
  // Tag-based filtering
  selectedTags: SelectedTag[]
  setSelectedTags: (tags: SelectedTag[]) => void
  addTagFilter: (tag: SelectedTag) => void
  removeTagFilter: (tagId: string) => void
  clearAllTags: () => void
  
  // Filtered data
  filteredRecipes: RecipeWithComputed[]
  searchResults: RecipeSearchResult[]
  
  // Computed
  hasActiveFilters: boolean
  filterCount: number
  
  // Actions
  setSearchTerm: (term: string) => void
  setCategories: (categories: string[]) => void
  setEffects: (effects: string[]) => void
  setIngredients: (ingredients: string[]) => void
  setDifficulties: (difficulties: string[]) => void
  setHasEffects: (hasEffects: boolean | null) => void
  setIsComplex: (isComplex: boolean | null) => void
  setIngredientCountRange: (min: number | null, max: number | null) => void
  setMagnitudeRange: (min: number | null, max: number | null) => void
  clearFilters: () => void
  clearSearch: () => void
  
  // Sorting
  sortBy: 'name' | 'category' | 'difficulty' | 'ingredientCount' | 'effectCount' | 'magnitude' | 'duration'
  sortOrder: 'asc' | 'desc'
  setSortBy: (sortBy: 'name' | 'category' | 'difficulty' | 'ingredientCount' | 'effectCount' | 'magnitude' | 'duration') => void
  setSortOrder: (sortOrder: 'asc' | 'desc') => void
  toggleSortOrder: () => void
}

export function useRecipeFilters(
  recipes: RecipeWithComputed[],
  options: UseRecipeFiltersOptions = {}
): UseRecipeFiltersReturn {
  const { 
    initialFilters = {}, 
    enableSearch = true, 
    enableSorting = true 
  } = options

  // Ensure recipes is always an array
  const safeRecipes = Array.isArray(recipes) ? recipes : []

  // Filters state
  const [filters, setFilters] = useState<RecipeFilters>({
    categories: [],
    effects: [],
    ingredients: [],
    difficulties: [],
    searchTerm: '',
    hasEffects: null,
    isComplex: null,
    minIngredientCount: null,
    maxIngredientCount: null,
    minMagnitude: null,
    maxMagnitude: null,
    ...initialFilters
  })

  // Tag-based filtering state
  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([])

  // Sorting state
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'difficulty' | 'ingredientCount' | 'effectCount' | 'magnitude' | 'duration'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Tag management functions
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

  // Filter actions
  const setSearchTerm = useCallback((term: string) => {
    setFilters(prev => ({ ...prev, searchTerm: term }))
  }, [])

  const setCategories = useCallback((categories: string[]) => {
    setFilters(prev => ({ ...prev, categories }))
  }, [])

  const setEffects = useCallback((effects: string[]) => {
    setFilters(prev => ({ ...prev, effects }))
  }, [])

  const setIngredients = useCallback((ingredients: string[]) => {
    setFilters(prev => ({ ...prev, ingredients }))
  }, [])

  const setDifficulties = useCallback((difficulties: string[]) => {
    setFilters(prev => ({ ...prev, difficulties }))
  }, [])

  const setHasEffects = useCallback((hasEffects: boolean | null) => {
    setFilters(prev => ({ ...prev, hasEffects }))
  }, [])

  const setIsComplex = useCallback((isComplex: boolean | null) => {
    setFilters(prev => ({ ...prev, isComplex }))
  }, [])

  const setIngredientCountRange = useCallback((min: number | null, max: number | null) => {
    setFilters(prev => ({ 
      ...prev, 
      minIngredientCount: min, 
      maxIngredientCount: max 
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
      categories: [],
      effects: [],
      ingredients: [],
      difficulties: [],
      searchTerm: '',
      hasEffects: null,
      isComplex: null,
      minIngredientCount: null,
      maxIngredientCount: null,
      minMagnitude: null,
      maxMagnitude: null,
    })
    setSelectedTags([])
  }, [])

  const clearSearch = useCallback(() => {
    setFilters(prev => ({ ...prev, searchTerm: '' }))
  }, [])

  // Sorting actions
  const updateSortOrder = useCallback((order: 'asc' | 'desc') => {
    setSortOrder(order)
  }, [])

  const toggleSortOrder = useCallback(() => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }, [])

  // Apply filters and search
  const filteredRecipes = useMemo(() => {
    let filtered = RecipeModel.applyFilters(safeRecipes, filters)

    // Apply tag-based filtering
    if (selectedTags.length > 0) {
      const tagFilters = selectedTags.reduce((acc, tag) => {
        switch (tag.category) {
          case 'categories':
            acc.categories.push(tag.value)
            break
          case 'effects':
            acc.effects.push(tag.value)
            break
          case 'ingredients':
            acc.ingredients.push(tag.value)
            break
          case 'difficulties':
            acc.difficulties.push(tag.value)
            break
        }
        return acc
      }, {
        categories: [] as string[],
        effects: [] as string[],
        ingredients: [] as string[],
        difficulties: [] as string[]
      })

      // Apply tag filters
      if (tagFilters.categories.length > 0) {
        filtered = RecipeModel.filterByCategories(filtered, tagFilters.categories)
      }
      if (tagFilters.effects.length > 0) {
        filtered = RecipeModel.filterByEffects(filtered, tagFilters.effects)
      }
      if (tagFilters.ingredients.length > 0) {
        filtered = RecipeModel.filterByIngredients(filtered, tagFilters.ingredients)
      }
      if (tagFilters.difficulties.length > 0) {
        filtered = RecipeModel.filterByDifficulties(filtered, tagFilters.difficulties)
      }
    }

    // Apply sorting
    if (enableSorting) {
      filtered = RecipeModel.sort(filtered, sortBy, sortOrder)
    }

    return filtered
  }, [safeRecipes, filters, selectedTags, enableSorting, sortBy, sortOrder])

  // Search results
  const searchResults = useMemo(() => {
    if (!enableSearch || !filters.searchTerm.trim()) {
      return []
    }
    return RecipeModel.search(safeRecipes, filters.searchTerm)
  }, [safeRecipes, filters.searchTerm, enableSearch])

  // Computed values
  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchTerm.trim() !== '' ||
      filters.categories.length > 0 ||
      filters.effects.length > 0 ||
      filters.ingredients.length > 0 ||
      filters.difficulties.length > 0 ||
      filters.hasEffects !== null ||
      filters.isComplex !== null ||
      filters.minIngredientCount !== null ||
      filters.maxIngredientCount !== null ||
      filters.minMagnitude !== null ||
      filters.maxMagnitude !== null ||
      selectedTags.length > 0
    )
  }, [filters, selectedTags])

  const filterCount = useMemo(() => {
    let count = 0
    if (filters.searchTerm.trim()) count++
    if (filters.categories.length > 0) count += filters.categories.length
    if (filters.effects.length > 0) count += filters.effects.length
    if (filters.ingredients.length > 0) count += filters.ingredients.length
    if (filters.difficulties.length > 0) count += filters.difficulties.length
    if (filters.hasEffects !== null) count++
    if (filters.isComplex !== null) count++
    if (filters.minIngredientCount !== null || filters.maxIngredientCount !== null) count++
    if (filters.minMagnitude !== null || filters.maxMagnitude !== null) count++
    count += selectedTags.length
    return count
  }, [filters, selectedTags])

  return {
    // Filters state
    filters,
    searchTerm: filters.searchTerm,
    
    // Tag-based filtering
    selectedTags,
    setSelectedTags,
    addTagFilter,
    removeTagFilter,
    clearAllTags,
    
    // Filtered data
    filteredRecipes,
    searchResults,
    
    // Computed
    hasActiveFilters,
    filterCount,
    
    // Actions
    setSearchTerm,
    setCategories,
    setEffects,
    setIngredients,
    setDifficulties,
    setHasEffects,
    setIsComplex,
    setIngredientCountRange,
    setMagnitudeRange,
    clearFilters,
    clearSearch,
    
    // Sorting
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder: updateSortOrder,
    toggleSortOrder,
  }
} 