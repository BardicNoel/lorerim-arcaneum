import { useMemo } from 'react'
import Fuse from 'fuse.js'
import type { Trait } from '@/shared/data/schemas'

interface SearchableTrait {
  id: string
  name: string
  description: string
  category: string
  effects: string[]
  tags: string[]
  originalTrait: Trait
}

/**
 * Hook for fuzzy searching through trait data using Fuse.js
 */
export function useFuzzySearch(traits: Trait[], searchQuery: string) {
  // Create searchable trait objects
  const searchableTraits = useMemo(() => {
    return traits.map(trait => ({
      id: trait.id || trait.name,
      name: trait.name,
      description: trait.description || '',
      category: trait.category || '',
      effects: trait.effects?.map(
        effect => `${effect.type} ${effect.description || ''} ${effect.value}`
      ) || [],
      tags: trait.tags || [],
      originalTrait: trait,
    }))
  }, [traits])

  // Configure Fuse.js options
  const fuseOptions = useMemo(
    () => ({
      keys: [
        { name: 'name', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'effects', weight: 0.2 },
        { name: 'tags', weight: 0.15 },
        { name: 'category', weight: 0.1 },
      ],
      threshold: 0.3, // Lower threshold = more strict matching
      includeScore: true,
      includeMatches: true,
    }),
    []
  )

  // Create Fuse instance
  const fuse = useMemo(() => {
    return new Fuse(searchableTraits, fuseOptions)
  }, [searchableTraits, fuseOptions])

  // Perform search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return searchableTraits.map(trait => ({
        item: trait,
        score: 0,
        matches: [],
      }))
    }

    return fuse.search(searchQuery)
  }, [fuse, searchQuery])

  // Return filtered traits based on search results
  const filteredTraits = useMemo(() => {
    return searchResults.map(result => result.item.originalTrait)
  }, [searchResults])

  return {
    filteredTraits,
    searchResults,
    searchableTraits,
  }
}
