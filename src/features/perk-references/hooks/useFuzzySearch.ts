import Fuse from 'fuse.js'
import { useMemo } from 'react'
import type { PerkReferenceNode } from '../types'

interface SearchablePerk {
  id: string
  name: string
  description: string
  searchableText: string
  tags: string[]
  category: string
  skillTree: string
  originalPerk: PerkReferenceNode
}

/**
 * Hook for fuzzy searching through perk data using Fuse.js
 */
export function useFuzzySearch(perks: PerkReferenceNode[], searchQuery: string) {
  // Create searchable perk objects
  const searchablePerks = useMemo(() => {
    return perks.map(perk => ({
      id: perk.edid,
      name: perk.name,
      description: perk.ranks[0]?.description?.base || '',
      searchableText: perk.searchableText,
      tags: perk.tags,
      category: perk.category,
      skillTree: perk.skillTreeName,
      originalPerk: perk,
    }))
  }, [perks])

  // Configure Fuse.js options
  const fuseOptions = useMemo(
    () => ({
      keys: [
        { name: 'name', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'searchableText', weight: 0.2 },
        { name: 'tags', weight: 0.1 },
        { name: 'category', weight: 0.05 },
        { name: 'skillTree', weight: 0.05 },
      ],
      threshold: 0.4, // Lower threshold = more strict matching
      includeScore: true,
      includeMatches: true,
    }),
    []
  )

  // Create Fuse instance
  const fuse = useMemo(() => {
    return new Fuse(searchablePerks, fuseOptions)
  }, [searchablePerks, fuseOptions])

  // Perform search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return searchablePerks.map(perk => ({
        item: perk,
        score: 0,
        matches: [],
      }))
    }

    return fuse.search(searchQuery)
  }, [fuse, searchQuery])

  // Return filtered perks based on search results
  const filteredPerks = useMemo(() => {
    return searchResults.map(result => result.item.originalPerk)
  }, [searchResults])

  return {
    filteredPerks,
    searchResults,
    searchablePerks,
  }
} 