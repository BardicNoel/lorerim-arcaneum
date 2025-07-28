import { useCallback, useMemo, useState } from 'react'
import type { PerkReferenceFilters, PerkReferenceFilter, PerkReferenceSearchOption } from '../types'
import type { SelectedTag } from '@/shared/components/playerCreation/types'

// Available filter options interface
interface AvailableFilters {
  skills: Array<{ id: string; name: string }>
  categories: string[]
  prerequisites: string[]
  tags: string[]
}

// Adapter for perk references filters
export function usePerkReferencesFilters() {
  // Filter state
  const [filters, setFilters] = useState<PerkReferenceFilters>({
    skills: [],
    categories: [],
    prerequisites: [],
    tags: [],
    rankLevel: 'all',
    rootOnly: false,
    searchQuery: '',
    minLevel: undefined,
  })

  // Available filter options (will be populated by data adapter)
  const [availableFilters, setAvailableFilters] = useState<AvailableFilters>({
    skills: [],
    categories: [],
    prerequisites: [],
    tags: [],
  })

  // Update available filter options
  const updateAvailableFilters = useCallback((newFilters: AvailableFilters) => {
    setAvailableFilters(newFilters)
  }, [])

  // Filter management functions
  const addSkillFilter = useCallback((skillId: string) => {
    setFilters(prev => ({
      ...prev,
      skills: [...prev.skills, skillId],
    }))
  }, [])

  const removeSkillFilter = useCallback((skillId: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.filter(id => id !== skillId),
    }))
  }, [])

  const addCategoryFilter = useCallback((category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: [...prev.categories, category],
    }))
  }, [])

  const removeCategoryFilter = useCallback((category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat !== category),
    }))
  }, [])

  const addPrerequisiteFilter = useCallback((prerequisite: string) => {
    setFilters(prev => ({
      ...prev,
      prerequisites: [...prev.prerequisites, prerequisite],
    }))
  }, [])

  const removePrerequisiteFilter = useCallback((prerequisite: string) => {
    setFilters(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(prereq => prereq !== prerequisite),
    }))
  }, [])

  const addTagFilter = useCallback((tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: [...prev.tags, tag],
    }))
  }, [])

  const removeTagFilter = useCallback((tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }))
  }, [])

  const setRankLevelFilter = useCallback((rankLevel: 'single' | 'multi' | 'all') => {
    setFilters(prev => ({
      ...prev,
      rankLevel,
    }))
  }, [])

  const setRootOnlyFilter = useCallback((rootOnly: boolean) => {
    setFilters(prev => ({
      ...prev,
      rootOnly,
    }))
  }, [])

  const setMinLevelFilter = useCallback((minLevel: number | undefined) => {
    setFilters(prev => ({
      ...prev,
      minLevel,
    }))
  }, [])

  const setSearchQuery = useCallback((query: string) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: query,
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      skills: [],
      categories: [],
      prerequisites: [],
      tags: [],
      rankLevel: 'all',
      rootOnly: false,
      searchQuery: '',
      minLevel: undefined,
    })
  }, [])

  // Get active filters as filter objects
  const activeFilters = useMemo((): PerkReferenceFilter[] => {
    const active: PerkReferenceFilter[] = []

    filters.skills.forEach(skillId => {
      const skill = availableFilters.skills.find(s => s.id === skillId)
      if (skill) {
        active.push({
          id: `skill-${skillId}`,
          type: 'skill',
          value: skillId,
          label: skill.name,
        })
      }
    })

    filters.categories.forEach(category => {
      active.push({
        id: `category-${category}`,
        type: 'category',
        value: category,
        label: category,
      })
    })

    filters.prerequisites.forEach(prerequisite => {
      active.push({
        id: `prerequisite-${prerequisite}`,
        type: 'prerequisite',
        value: prerequisite,
        label: prerequisite,
      })
    })

    filters.tags.forEach(tag => {
      active.push({
        id: `tag-${tag}`,
        type: 'tag',
        value: tag,
        label: tag,
      })
    })

    if (filters.rankLevel !== 'all') {
      active.push({
        id: 'rank-level',
        type: 'rankLevel',
        value: filters.rankLevel,
        label: filters.rankLevel === 'single' ? 'Single Rank' : 'Multi Rank',
      })
    }

    if (filters.rootOnly) {
      active.push({
        id: 'root-only',
        type: 'rootOnly',
        value: 'true',
        label: 'Root Perks Only',
      })
    }

    if (filters.minLevel !== undefined) {
      active.push({
        id: 'min-level',
        type: 'minLevel',
        value: filters.minLevel.toString(),
        label: `Level ${filters.minLevel}+`,
      })
    }

    return active
  }, [filters, availableFilters])

  // Generate search options for autocomplete
  const searchOptions = useMemo((): PerkReferenceSearchOption[] => {
    const options: PerkReferenceSearchOption[] = []

    // Add skill options
    availableFilters.skills.forEach(skill => {
      options.push({
        id: `skill-${skill.id}`,
        label: skill.name,
        value: skill.id,
        category: 'Skills',
        type: 'skill',
      })
    })

    // Add tag options
    availableFilters.tags.forEach(tag => {
      options.push({
        id: `tag-${tag}`,
        label: tag,
        value: tag,
        category: 'Tags',
        type: 'tag',
      })
    })

    return options
  }, [availableFilters])

  // Handle tag selection (matching races page pattern)
  const handleTagSelect = useCallback((optionOrTag: any) => {
    let tag: SelectedTag
    
    if (typeof optionOrTag === 'string') {
      // Custom search input - add as a fuzzy search tag
      tag = {
        id: `custom-${optionOrTag}`,
        label: optionOrTag,
        value: optionOrTag,
        category: 'Fuzzy Search',
      }
      // Add to search query for fuzzy search (not tags)
      setSearchQuery(optionOrTag)
    } else {
      // Autocomplete option
      tag = {
        id: `${optionOrTag.category}-${optionOrTag.id}`,
        label: optionOrTag.label,
        value: optionOrTag.value,
        category: optionOrTag.category,
      }
      
      // Add to appropriate filter based on category
      if (optionOrTag.category === 'Skill Trees') {
        addSkillFilter(optionOrTag.value)
      } else if (optionOrTag.category === 'Minimum Level') {
        // Handle minimum level filter
        const level = parseInt(optionOrTag.value)
        if (!isNaN(level)) {
          setMinLevelFilter(level)
        }
      } else if (optionOrTag.category === 'Fuzzy Search') {
        // Add to search query for fuzzy search
        setSearchQuery(optionOrTag.value)
      }
    }
  }, [addSkillFilter, setSearchQuery, setMinLevelFilter])

  // Handle tag removal
  const handleTagRemove = useCallback((tagId: string) => {
    const filter = activeFilters.find(f => f.id === tagId)
    if (filter) {
      if (filter.type === 'skill') {
        removeSkillFilter(filter.value)
      } else if (filter.type === 'tag') {
        removeTagFilter(filter.value)
      } else if (filter.type === 'minLevel') {
        setMinLevelFilter(undefined)
      }
    } else {
      // Handle custom fuzzy search tags (they don't appear in activeFilters)
      if (tagId.startsWith('custom-')) {
        const customValue = tagId.replace('custom-', '')
        // Clear search query if it matches the removed tag
        if (filters.searchQuery === customValue) {
          setSearchQuery('')
        }
      }
    }
  }, [activeFilters, removeSkillFilter, removeTagFilter, setMinLevelFilter, filters.searchQuery, setSearchQuery])

  return {
    // State - using the expected property names
    selectedTags: [
      ...activeFilters.map(filter => ({
        id: filter.id,
        label: filter.label,
        value: filter.value,
        category: filter.type,
      })),
      // Add custom fuzzy search tags from search query
      ...(filters.searchQuery ? [{
        id: `custom-${filters.searchQuery}`,
        label: filters.searchQuery,
        value: filters.searchQuery,
        category: 'Fuzzy Search',
      }] : [])
    ],
    viewMode: 'grid' as const, // Default view mode
    searchQuery: filters.searchQuery,

    // Actions - using the expected function names
    onTagSelect: handleTagSelect,
    onTagRemove: handleTagRemove,
    onClearTags: clearFilters,
    onViewModeChange: () => {}, // TODO: Implement view mode change
    onSearchChange: setSearchQuery,
  }
} 