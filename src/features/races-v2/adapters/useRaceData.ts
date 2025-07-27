import type { Race } from '@/shared/data/schemas'
import { useRacesStore } from '@/shared/stores/racesStore'
import { useMemo } from 'react'
import { RaceModel } from '../model/RaceModel'

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

  // Use the global races store instead of RaceDataProvider
  const { data: races, loading: isLoading, error } = useRacesStore()

  // Categories and tags
  const categories = useMemo(
    () => RaceModel.getUniqueCategories(races),
    [races]
  )
  const tags = useMemo(() => RaceModel.getUniqueTags(races), [races])

  // Filtered races based on options
  const filteredRaces = useMemo(() => {
    return races.filter(race => {
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
  }, [races, categoryFilter, searchTerm])

  // Sort filtered races
  const sortedFilteredRaces = useMemo(() => {
    return sortBy === 'name'
      ? RaceModel.sortByName(filteredRaces)
      : RaceModel.sortByCategory(filteredRaces)
  }, [filteredRaces, sortBy])

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
    // Trigger a reload of the global races store
    await useRacesStore.getState().load()
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
