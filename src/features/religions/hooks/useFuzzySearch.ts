import { useMemo } from 'react'
import Fuse from 'fuse.js'
import type { Religion } from '../types'

interface SearchableReligion {
  id: string
  name: string
  description: string
  type: string
  pantheon: string
  favoredRaces: string[]
  tenetEffects: string[]
  blessingEffects: string[]
  followerPowers: string[]
  devoteePowers: string[]
  originalReligion: Religion
}

/**
 * Hook for fuzzy searching through religion data using Fuse.js
 */
export function useFuzzySearch(religions: Religion[], searchQuery: string) {
  // Create searchable religion objects
  const searchableReligions = useMemo(() => {
    return religions.map(religion => ({
      id: religion.name.toLowerCase().replace(/\s+/g, '-'),
      name: religion.name,
      description: religion.tenet?.description || '',
      type: religion.type,
      favoredRaces: religion.favoredRaces || [],
      tenetEffects:
        religion.tenet?.effects?.map(
          effect => `${effect.effectName} ${effect.effectDescription}`
        ) || [],
      blessingEffects:
        religion.blessing?.effects?.map(
          effect => `${effect.effectName} ${effect.effectDescription}`
        ) || [],
      followerPowers:
        religion.boon1?.effects?.map(
          effect => `${effect.effectName} ${effect.effectDescription}`
        ) || [],
      devoteePowers:
        religion.boon2?.effects?.map(
          effect => `${effect.effectName} ${effect.effectDescription}`
        ) || [],
      originalReligion: religion,
    }))
  }, [religions])

  // Configure Fuse.js options
  const fuseOptions = useMemo(
    () => ({
      keys: [
        { name: 'name', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'tenetEffects', weight: 0.2 },
        { name: 'blessingEffects', weight: 0.2 },
        { name: 'followerPowers', weight: 0.15 },
        { name: 'devoteePowers', weight: 0.15 },
        { name: 'favoredRaces', weight: 0.1 },
        { name: 'type', weight: 0.1 },
      ],
      threshold: 0.3, // Lower threshold = more strict matching
      includeScore: true,
      includeMatches: true,
    }),
    []
  )

  // Create Fuse instance
  const fuse = useMemo(() => {
    return new Fuse(searchableReligions, fuseOptions)
  }, [searchableReligions, fuseOptions])

  // Perform search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return searchableReligions.map(religion => ({
        item: religion,
        score: 0,
        matches: [],
      }))
    }

    return fuse.search(searchQuery)
  }, [fuse, searchQuery])

  // Return filtered religions based on search results
  const filteredReligions = useMemo(() => {
    return searchResults.map(result => result.item.originalReligion)
  }, [searchResults])

  return {
    filteredReligions,
    searchResults,
    searchableReligions,
  }
}
