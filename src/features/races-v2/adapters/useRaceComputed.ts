import { useMemo } from 'react'
import { RaceModel } from '../model/RaceModel'
import { RaceUtilities } from '../model/RaceUtilities'
import type { Race, RaceStats, SearchCategory, TransformedRace } from '../types'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'

interface UseRaceComputedOptions {
  races: Race[]
  selectedRaceId: string | null
}

interface UseRaceComputedReturn {
  // Computed data
  transformedRaces: PlayerCreationItem[]
  searchCategories: SearchCategory[]
  raceStats: RaceStats | null
  selectedRaceDetails: Race | null

  // Helper computed values
  totalRaces: number
  categoriesWithCounts: Array<{ category: string; count: number }>
  tagsWithCounts: Array<{ tag: string; count: number }>
}

export function useRaceComputed({ 
  races, 
  selectedRaceId 
}: UseRaceComputedOptions): UseRaceComputedReturn {
  
  // Transform races to PlayerCreationItem format
  const transformedRaces = useMemo(() => {
    return races.map(race => RaceModel.transformToPlayerCreationItem(race))
  }, [races])

  // Generate search categories
  const searchCategories = useMemo(() => {
    return RaceUtilities.generateSearchCategories(races)
  }, [races])

  // Get selected race details
  const selectedRaceDetails = useMemo(() => {
    if (!selectedRaceId) return null
    return RaceModel.getRaceById(races, selectedRaceId) || null
  }, [races, selectedRaceId])

  // Calculate race stats for selected race
  const raceStats = useMemo(() => {
    if (!selectedRaceDetails) return null
    return RaceModel.calculateRaceStats(selectedRaceDetails)
  }, [selectedRaceDetails])

  // Total races count
  const totalRaces = useMemo(() => {
    return races.length
  }, [races])

  // Categories with counts
  const categoriesWithCounts = useMemo(() => {
    const categoryCounts = races.reduce((acc, race) => {
      acc[race.category] = (acc[race.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    }))
  }, [races])

  // Tags with counts
  const tagsWithCounts = useMemo(() => {
    const tagCounts = races.reduce((acc, race) => {
      // Count keywords
      race.keywords.forEach(keyword => {
        acc[keyword.edid] = (acc[keyword.edid] || 0) + 1
      })
      
      // Count flags
      race.flags?.forEach(flag => {
        acc[flag] = (acc[flag] || 0) + 1
      })
      
      return acc
    }, {} as Record<string, number>)

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count) // Sort by count descending
  }, [races])

  return {
    // Computed data
    transformedRaces,
    searchCategories,
    raceStats,
    selectedRaceDetails,

    // Helper computed values
    totalRaces,
    categoriesWithCounts,
    tagsWithCounts,
  }
} 