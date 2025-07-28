import { useMemo } from 'react'
import { usePerkReferenceData } from '../model/PerkReferenceDataProvider'
import type { PerkReferenceNode } from '../types'

// Adapter for perk references data
export function usePerkReferencesData() {
  const { dataProvider, allPerks, loading, error } = usePerkReferenceData()

  // Get unique skill trees
  const skillTrees = useMemo(() => {
    const trees = new Map<string, { id: string; name: string; count: number }>()
    
    allPerks.forEach(perk => {
      if (!trees.has(perk.skillTree)) {
        trees.set(perk.skillTree, {
          id: perk.skillTree,
          name: perk.skillTreeName,
          count: 0,
        })
      }
      const tree = trees.get(perk.skillTree)!
      tree.count++
    })

    return Array.from(trees.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [allPerks])

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Map<string, { name: string; count: number }>()
    
    allPerks.forEach(perk => {
      if (!cats.has(perk.category)) {
        cats.set(perk.category, { name: perk.category, count: 0 })
      }
      const cat = cats.get(perk.category)!
      cat.count++
    })

    return Array.from(cats.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [allPerks])

  // Get unique tags
  const tags = useMemo(() => {
    const tagSet = new Set<string>()
    allPerks.forEach(perk => {
      perk.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [allPerks])

  // Get root perks
  const rootPerks = useMemo(() => {
    return allPerks.filter(perk => perk.isRoot)
  }, [allPerks])

  // Get multi-rank perks
  const multiRankPerks = useMemo(() => {
    return allPerks.filter(perk => perk.totalRanks > 1)
  }, [allPerks])

  // Get single-rank perks
  const singleRankPerks = useMemo(() => {
    return allPerks.filter(perk => perk.totalRanks === 1)
  }, [allPerks])

  // Get perks by skill
  const getPerksBySkill = useMemo(() => {
    return (skillId: string): PerkReferenceNode[] => {
      return dataProvider?.getPerksBySkill(skillId) || []
    }
  }, [dataProvider])

  // Get perks by category
  const getPerksByCategory = useMemo(() => {
    return (category: string): PerkReferenceNode[] => {
      return dataProvider?.getPerksByCategory(category) || []
    }
  }, [dataProvider])

  // Search perks
  const searchPerks = useMemo(() => {
    return (query: string): PerkReferenceNode[] => {
      return dataProvider?.searchPerks(query) || []
    }
  }, [dataProvider])

  return {
    // Data
    allPerks,
    skillTrees,
    categories,
    tags,
    rootPerks,
    multiRankPerks,
    singleRankPerks,

    // Functions
    getPerksBySkill,
    getPerksByCategory,
    searchPerks,

    // State
    loading,
    error,
    dataProvider,
  }
} 