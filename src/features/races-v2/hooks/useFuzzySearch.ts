import Fuse from 'fuse.js'
import { useMemo } from 'react'
import type { Race } from '../types'

interface SearchableRace {
  id: string
  name: string
  description: string
  category: Race['category']
  abilities: string[]
  skills: string[]
  keywords: string[]
  originalRace: Race
}

/**
 * Hook for fuzzy searching through race data using Fuse.js
 */
export function useFuzzySearch(races: Race[], searchQuery: string) {
  // Create searchable race objects
  const searchableRaces = useMemo(() => {
    return races.map(race => ({
      id: race.edid.toLowerCase().replace('race', ''),
      name: race.name,
      description: race.description,
      category: race.category,
      abilities: race.racialSpells.map(spell => spell.name),
      skills: race.skillBonuses.map(bonus => bonus.skill),
      keywords: race.keywords.map(keyword => keyword.edid),
      originalRace: race,
    }))
  }, [races])

  // Configure Fuse.js options
  const fuseOptions = useMemo(
    () => ({
      keys: [
        { name: 'name', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'abilities', weight: 0.2 },
        { name: 'skills', weight: 0.1 },
        { name: 'keywords', weight: 0.1 },
      ],
      threshold: 0.3, // Lower threshold = more strict matching
      includeScore: true,
      includeMatches: true,
    }),
    []
  )

  // Create Fuse instance
  const fuse = useMemo(() => {
    return new Fuse(searchableRaces, fuseOptions)
  }, [searchableRaces, fuseOptions])

  // Perform search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return searchableRaces.map(race => ({
        item: race,
        score: 0,
        matches: [],
      }))
    }

    return fuse.search(searchQuery)
  }, [fuse, searchQuery])

  // Return filtered races based on search results
  const filteredRaces = useMemo(() => {
    return searchResults.map(result => result.item.originalRace)
  }, [searchResults])

  return {
    filteredRaces,
    searchResults,
    searchableRaces,
  }
}
