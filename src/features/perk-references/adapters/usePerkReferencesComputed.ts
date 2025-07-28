import { useMemo } from 'react'
import { usePerkReferencesData } from './usePerkReferencesData'
import { usePerkReferencesFilters } from './usePerkReferencesFilters'
import { usePerkReferenceModel } from '../model/PerkReferenceModel'
import type { PerkReferenceItem, PerkReferenceViewMode } from '../types'

// Adapter for computed perk references data
export function usePerkReferencesComputed() {
  // Get data and filters
  const {
    allPerks,
    skillTrees,
    categories,
    tags,
    loading: dataLoading,
    error: dataError,
  } = usePerkReferencesData()

  const {
    selectedTags,
    viewMode,
    searchQuery,
    onTagSelect,
    onTagRemove,
    onClearTags,
    onViewModeChange,
    onSearchChange,
  } = usePerkReferencesFilters()

  // Create a default filters object since the filters adapter now returns different properties
  const filters = useMemo(() => ({
    skills: [],
    categories: [],
    prerequisites: [],
    tags: [],
    rankLevel: 'all' as const,
    rootOnly: false,
    searchQuery: searchQuery || '',
  }), [searchQuery])

  // Note: Available filters are now handled by the model itself

  // Use the model to transform and filter data
  const {
    model,
    filteredNodes,
    perkItems,
    availableFilters: modelAvailableFilters,
  } = usePerkReferenceModel(allPerks, filters)

  // Computed statistics
  const statistics = useMemo(() => {
    return {
      totalPerks: allPerks.length,
      filteredPerks: filteredNodes.length,
      rootPerks: allPerks.filter(perk => perk.isRoot).length,
      multiRankPerks: allPerks.filter(perk => perk.totalRanks > 1).length,
      singleRankPerks: allPerks.filter(perk => perk.totalRanks === 1).length,
      skills: skillTrees.length,
      categories: categories.length,
      tags: tags.length,
    }
  }, [allPerks, filteredNodes, skillTrees, categories, tags])

  // Group perks by skill for display
  const perksBySkill = useMemo(() => {
    const grouped = new Map<string, PerkReferenceItem[]>()
    
    perkItems.forEach(item => {
      if (!grouped.has(item.skillTree)) {
        grouped.set(item.skillTree, [])
      }
      grouped.get(item.skillTree)!.push(item)
    })

    return Array.from(grouped.entries()).map(([skillId, perks]) => ({
      skillId,
      skillName: perks[0]?.skillTreeName || skillId,
      perks,
      count: perks.length,
    })).sort((a, b) => a.skillName.localeCompare(b.skillName))
  }, [perkItems])

  // Group perks by category for display
  const perksByCategory = useMemo(() => {
    const grouped = new Map<string, PerkReferenceItem[]>()
    
    perkItems.forEach(item => {
      if (!grouped.has(item.category)) {
        grouped.set(item.category, [])
      }
      grouped.get(item.category)!.push(item)
    })

    return Array.from(grouped.entries()).map(([category, perks]) => ({
      category,
      perks,
      count: perks.length,
    })).sort((a, b) => a.category.localeCompare(b.category))
  }, [perkItems])

  // Get selected perks
  const selectedPerks = useMemo(() => {
    return perkItems.filter(item => item.isSelected)
  }, [perkItems])

  // Get available perks (perks that can be selected)
  const availablePerks = useMemo(() => {
    return perkItems.filter(item => item.isAvailable)
  }, [perkItems])

  // Get root perks
  const rootPerks = useMemo(() => {
    return perkItems.filter(item => item.isRoot)
  }, [perkItems])

  // Get multi-rank perks
  const multiRankPerks = useMemo(() => {
    return perkItems.filter(item => item.totalRanks > 1)
  }, [perkItems])

  // Get single-rank perks
  const singleRankPerks = useMemo(() => {
    return perkItems.filter(item => item.totalRanks === 1)
  }, [perkItems])

  // Sort perks by various criteria
  const sortPerks = useMemo(() => {
    return (perks: PerkReferenceItem[], sortBy: string = 'name'): PerkReferenceItem[] => {
      const sorted = [...perks]
      
      switch (sortBy) {
        case 'name':
          return sorted.sort((a, b) => a.name.localeCompare(b.name))
        case 'skill':
          return sorted.sort((a, b) => a.skillTreeName.localeCompare(b.skillTreeName))
        case 'category':
          return sorted.sort((a, b) => a.category.localeCompare(b.category))
        case 'rank':
          return sorted.sort((a, b) => b.totalRanks - a.totalRanks)
        case 'prerequisites':
          return sorted.sort((a, b) => a.prerequisites.length - b.prerequisites.length)
        case 'selected':
          return sorted.sort((a, b) => Number(b.isSelected) - Number(a.isSelected))
        default:
          return sorted
      }
    }
  }, [])

  return {
    // Data - using the expected property names
    filteredItems: perkItems,
    groupedItems: Object.fromEntries(
      perksBySkill.map(group => [group.skillId, group.perks])
    ),
    stats: {
      totalPerks: statistics.totalPerks,
      skillTrees: statistics.skills,
      multiRank: statistics.multiRankPerks,
      singleRank: statistics.singleRankPerks,
      withPrerequisites: allPerks.filter(perk => perk.prerequisites && perk.prerequisites.length > 0).length,
    },
    searchCategories: [], // TODO: Generate search categories from available filters
    availableFilters: modelAvailableFilters,

    // State
    isLoading: dataLoading,
    error: dataError,
  }
} 