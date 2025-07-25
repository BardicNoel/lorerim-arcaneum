import { useMemo } from 'react'
import { RaceModel } from '../model/RaceModel'
import type { Race, RaceComparison } from '../types'

interface UseRaceDetailOptions {
  raceId: string
  allRaces: Race[]
}

interface UseRaceDetailReturn {
  // Data
  race: Race | null
  relatedRaces: Race[]
  raceComparison: RaceComparison | null

  // State
  isLoading: boolean
  error: string | null

  // Computed
  hasRelatedRaces: boolean
  relatedRacesCount: number
}

export function useRaceDetail({ 
  raceId, 
  allRaces 
}: UseRaceDetailOptions): UseRaceDetailReturn {
  
  // Get the target race
  const race = useMemo(() => {
    return RaceModel.getRaceById(allRaces, raceId) || null
  }, [allRaces, raceId])

  // Get related races
  const relatedRaces = useMemo(() => {
    if (!race) return []
    return RaceModel.getRelatedRaces(race, allRaces)
  }, [race, allRaces])

  // Create race comparison (placeholder for now)
  const raceComparison = useMemo(() => {
    if (!race || relatedRaces.length === 0) return null
    
    // For now, compare with the first related race
    const comparedRace = relatedRaces[0]
    
    return {
      selectedRace: race,
      comparedRace,
      differences: {
        stats: {
          health: { 
            selected: race.startingStats.health, 
            compared: comparedRace.startingStats.health,
            difference: race.startingStats.health - comparedRace.startingStats.health
          },
          magicka: { 
            selected: race.startingStats.magicka, 
            compared: comparedRace.startingStats.magicka,
            difference: race.startingStats.magicka - comparedRace.startingStats.magicka
          },
          stamina: { 
            selected: race.startingStats.stamina, 
            compared: comparedRace.startingStats.stamina,
            difference: race.startingStats.stamina - comparedRace.startingStats.stamina
          },
          carryWeight: { 
            selected: race.startingStats.carryWeight, 
            compared: comparedRace.startingStats.carryWeight,
            difference: race.startingStats.carryWeight - comparedRace.startingStats.carryWeight
          }
        },
        skills: race.skillBonuses.map(skill => {
          const comparedSkill = comparedRace.skillBonuses.find(s => s.skill === skill.skill)
          return {
            skill: skill.skill,
            selected: skill.bonus,
            compared: comparedSkill?.bonus || 0,
            difference: skill.bonus - (comparedSkill?.bonus || 0)
          }
        }),
        spells: {
          selected: race.racialSpells.map(s => s.name),
          compared: comparedRace.racialSpells.map(s => s.name),
          unique: race.racialSpells
            .filter(s => !comparedRace.racialSpells.some(cs => cs.name === s.name))
            .map(s => s.name)
        }
      }
    } as RaceComparison
  }, [race, relatedRaces])

  // Computed values
  const hasRelatedRaces = useMemo(() => {
    return relatedRaces.length > 0
  }, [relatedRaces])

  const relatedRacesCount = useMemo(() => {
    return relatedRaces.length
  }, [relatedRaces])

  // State (for now, assuming data is always available)
  const isLoading = false
  const error = null

  return {
    // Data
    race,
    relatedRaces,
    raceComparison,

    // State
    isLoading,
    error,

    // Computed
    hasRelatedRaces,
    relatedRacesCount,
  }
} 