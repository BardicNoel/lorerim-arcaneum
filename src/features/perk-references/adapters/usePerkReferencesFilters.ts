import { useCallback, useMemo, useState } from 'react'
import type { PerkReferenceFilters, PerkReferenceFilter, PerkReferenceSearchOption } from '../types'

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
  })

  // Available filter options (will be populated by data adapter)
  const [availableFilters, setAvailableFilters] = useState({
    skills: [],
    categories: [],
    prerequisites: [],
    tags: [],
  })

  // Update available filter options
  const updateAvailableFilters = useCallback((newFilters: typeof availableFilters) => {
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

    // Add category options
    availableFilters.categories.forEach(category => {
      options.push({
        id: `category-${category}`,
        label: category,
        value: category,
        category: 'Categories',
        type: 'category',
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

  return {
    // State - using the expected property names
    selectedTags: activeFilters.map(filter => ({
      id: filter.id,
      label: filter.label,
      category: filter.type,
    })),
    viewMode: 'grid' as const, // Default view mode
    searchQuery: filters.searchQuery,

    // Actions - using the expected function names
    onTagSelect: (option: string | { id: string; label: string; category: string }) => {
      if (typeof option === 'string') {
        // Handle custom search
        return
      }
      
      const filterId = option.id
      if (filterId.startsWith('skill-')) {
        addSkillFilter(filterId.replace('skill-', ''))
      } else if (filterId.startsWith('category-')) {
        addCategoryFilter(filterId.replace('category-', ''))
      } else if (filterId.startsWith('tag-')) {
        addTagFilter(filterId.replace('tag-', ''))
      }
    },
    onTagRemove: (tagId: string) => {
      const filter = activeFilters.find(f => f.id === tagId)
      if (filter) {
        if (filter.type === 'skill') {
          removeSkillFilter(filter.value)
        } else if (filter.type === 'category') {
          removeCategoryFilter(filter.value)
        } else if (filter.type === 'tag') {
          removeTagFilter(filter.value)
        }
      }
    },
    onClearTags: clearFilters,
    onViewModeChange: () => {}, // TODO: Implement view mode change
    onSearchChange: setSearchQuery,
  }
} 