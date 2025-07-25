import { useEffect, useState } from 'react'
import { RaceDataProvider } from '../model/RaceDataProvider'
import { RaceModel } from '../model/RaceModel'
import type { Race } from '../types'

interface UseRaceDataOptions {
  includeRelated?: boolean
  categoryFilter?: string
  searchTerm?: string
  sortBy?: 'name' | 'category'
}

interface UseRaceDataReturn {
  // Data
  races: Race[]
  filteredRaces: Race[]

  // State
  isLoading: boolean
  error: string | null

  // Computed
  categories: string[]
  tags: string[]

  // Actions
  refresh: () => void
  getRaceById: (id: string) => Race | undefined
  getRacesByCategory: (category: string) => Race[]

  // Filtering
  filterByCategory: (category: string) => Race[]
  filterByTag: (tag: string) => Race[]
  searchRaces: (term: string) => Race[]
}

export function useRaceData(
  options: UseRaceDataOptions = {}
): UseRaceDataReturn {
  const {
    includeRelated = false,
    categoryFilter = '',
    searchTerm = '',
    sortBy = 'name',
  } = options

  const [races, setRaces] = useState<Race[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataProvider] = useState(() => new RaceDataProvider())

  // Load races on mount
  useEffect(() => {
    const loadRaces = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const loadedRaces = await dataProvider.loadRaces()
        setRaces(loadedRaces)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load race data'
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadRaces()
  }, [dataProvider])

  // Categories and tags
  const categories = RaceModel.getUniqueCategories(races)
  const tags = RaceModel.getUniqueTags(races)

  // Filtered races based on options
  const filteredRaces = races.filter(race => {
    // Apply category filter
    if (categoryFilter && race.category !== categoryFilter) {
      return false
    }

    // Apply search term
    if (searchTerm) {
      const searchResults = RaceModel.search([race], searchTerm)
      if (searchResults.length === 0) {
        return false
      }
    }

    return true
  })

  // Sort filtered races
  const sortedFilteredRaces = sortBy === 'name' 
    ? RaceModel.sortByName(filteredRaces)
    : RaceModel.sortByCategory(filteredRaces)

  // Helper functions
  const getRaceById = (id: string): Race | undefined => {
    return RaceModel.getRaceById(races, id)
  }

  const getRacesByCategory = (category: string): Race[] => {
    return RaceModel.getRacesByCategory(races, category)
  }

  const filterByCategory = (category: string): Race[] => {
    return RaceModel.filterByCategory(races, category)
  }

  const filterByTag = (tag: string): Race[] => {
    return RaceModel.filterByTags(races, [tag])
  }

  const searchRaces = (term: string): Race[] => {
    return RaceModel.search(races, term)
  }

  const refresh = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const loadedRaces = await dataProvider.loadRaces()
      setRaces(loadedRaces)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to refresh race data'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return {
    // Data
    races,
    filteredRaces: sortedFilteredRaces,

    // State
    isLoading,
    error,

    // Computed
    categories,
    tags,

    // Actions
    refresh,
    getRaceById,
    getRacesByCategory,

    // Filtering
    filterByCategory,
    filterByTag,
    searchRaces,
  }
} 