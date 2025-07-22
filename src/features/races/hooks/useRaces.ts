import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import type { Race, RaceFilters } from '../types'
import {
  getAllKeywords,
  getAllSkills,
  getAllRacialAbilities,
  getUserFriendlyKeyword,
} from '../utils/dataTransform'
import {
  validateRaceData,
  sanitizeRaceData,
  testDataTransformation,
} from '../utils/validation'

// Import the new race data
import raceData from '../../../../public/data/playable-races.json'

export function useRaces() {
  const [filters, setFilters] = useState<RaceFilters>({
    search: '',
    type: '',
    tags: [],
  })

  // Transform and validate the new race data
  const races = useMemo(() => {
    const rawData = raceData.races

    // Validate the data structure
    if (!validateRaceData({ races: rawData })) {
      console.error('Invalid race data structure detected')
      return []
    }

    // Sanitize each race to ensure data integrity
    const sanitizedRaces = rawData.map(race => sanitizeRaceData(race))

    // Test transformation to catch any issues
    const testResult = testDataTransformation(sanitizedRaces)
    if (!testResult.success) {
      console.error('Data transformation errors:', testResult.errors)
    } else {
      console.log(
        `Successfully transformed ${testResult.transformedCount} races`
      )
    }

    return sanitizedRaces
  }, [])

  // Filter races based on current filters
  const filteredRaces = useMemo(() => {
    return races.filter(race => {
      // Search filter - search across all relevant fields
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const searchableText = [
          race.name,
          race.description,
          ...race.racialSpells.map(spell => spell.name),
          ...race.skillBonuses.map(bonus => bonus.skill),
          ...race.keywords.map(keyword => getUserFriendlyKeyword(keyword.edid)),
        ]
          .join(' ')
          .toLowerCase()

        if (!searchableText.includes(searchLower)) return false
      }

      // Category filter
      if (filters.type && race.category !== filters.type) return false

      // Tags filter - check keywords, skills, and abilities
      if (filters.tags.length > 0) {
        const raceKeywords = race.keywords.map(k =>
          getUserFriendlyKeyword(k.edid)
        )
        const raceSkills = race.skillBonuses.map(b => b.skill)
        const raceAbilities = race.racialSpells.map(s => s.name)

        const hasMatchingTag = filters.tags.some(tag => {
          return (
            raceKeywords.includes(tag) ||
            raceSkills.includes(tag) ||
            raceAbilities.includes(tag) ||
            race.category === tag
          )
        })

        if (!hasMatchingTag) return false
      }

      return true
    })
  }, [races, filters])

  // Get all available keywords, skills, and abilities for filtering
  const allKeywords = useMemo(() => getAllKeywords(races), [races])
  const allSkills = useMemo(() => getAllSkills(races), [races])
  const allAbilities = useMemo(() => getAllRacialAbilities(races), [races])

  return {
    races: filteredRaces,
    allRaces: races,
    loading: false,
    error: null,
    filters,
    setFilters,
    allKeywords,
    allSkills,
    allAbilities,
  }
}

// Legacy function for backward compatibility
function getRaceType(raceName: string): string {
  const humanRaces = ['Nord', 'Breton', 'Imperial', 'Redguard']
  const elfRaces = ['Altmer', 'Bosmer', 'Dunmer', 'Orsimer']
  const beastRaces = ['Khajiit', 'Argonian']

  if (humanRaces.includes(raceName)) return 'Human'
  if (elfRaces.includes(raceName)) return 'Elf'
  if (beastRaces.includes(raceName)) return 'Beast'

  return 'Unknown'
}
