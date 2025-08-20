import { useCallback, useMemo } from 'react'
import { useGlobalSearchStore, TAG_CATEGORIES } from '@/shared/stores/globalSearchStore'
import type { SearchOption, SelectedTag } from '@/shared/components/playerCreation/types'
import type { SearchFilters } from '../model/SearchModel'

export function useSearchState() {
  const {
    activeFilters,
    selectedTags,
    viewMode,
    setActiveFilters,
    updateActiveFilters,
    addTag,
    removeTag,
    removeTagByValue,
    clearAllTags,
    setViewMode,
    hasTag,
    getTagsByCategory,
    getFuzzySearchTags,
    getFilterTags,
    clearAllSearchState,
  } = useGlobalSearchStore()

  // Computed values
  const fuzzySearchQuery = useMemo(() => {
    const fuzzyTags = getFuzzySearchTags()
    return fuzzyTags.map(tag => tag.value).join(' ')
  }, [getFuzzySearchTags])

  const hasActiveFilters = useMemo(() => {
    return selectedTags.length > 0
  }, [selectedTags])

  // Enhanced tag management
  const handleTagSelect = useCallback((optionOrTag: SearchOption | string) => {
    let tag: SelectedTag
    
    if (typeof optionOrTag === 'string') {
      tag = {
        id: `custom-${optionOrTag}`,
        label: optionOrTag,
        value: optionOrTag,
        category: TAG_CATEGORIES.FUZZY_SEARCH,
      }
    } else {
      tag = {
        id: `${optionOrTag.category}-${optionOrTag.id}`,
        label: optionOrTag.label,
        value: optionOrTag.value,
        category: optionOrTag.category,
      }
    }
    
    addTag(tag)
  }, [addTag])

  const handleTagRemove = useCallback((tagId: string) => {
    removeTag(tagId)
  }, [removeTag])

  const handleClearFilters = useCallback(() => {
    clearAllTags()
  }, [clearAllTags])

  const handleViewModeChange = useCallback((mode: 'list' | 'grid') => {
    setViewMode(mode)
  }, [setViewMode])

  // Legacy API compatibility (for existing components)
  const clearFilters = useCallback(() => {
    clearAllTags()
  }, [clearAllTags])

  return {
    // State
    activeFilters,
    selectedTags,
    viewMode,
    fuzzySearchQuery,
    hasActiveFilters,
    
    // Actions
    setActiveFilters,
    updateActiveFilters,
    addTag,
    removeTag,
    removeTagByValue,
    clearAllTags,
    setViewMode,
    
    // Enhanced handlers
    handleTagSelect,
    handleTagRemove,
    handleClearFilters,
    handleViewModeChange,
    
    // Utility methods
    hasTag,
    getTagsByCategory,
    getFuzzySearchTags,
    getFilterTags,
    
    // Legacy API compatibility
    clearFilters,
  }
}
