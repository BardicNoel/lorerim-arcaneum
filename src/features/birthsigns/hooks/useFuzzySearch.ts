import { useMemo } from 'react'
import Fuse from 'fuse.js'
import type { Birthsign } from '../types'

interface SearchableBirthsign {
  id: string
  name: string
  description: string
  group: string
  statModifications: string[]
  skillBonuses: string[]
  powers: string[]
  conditionalEffects: string[]
  masteryEffects: string[]
  originalBirthsign: Birthsign
}

/**
 * Hook for fuzzy searching through birthsign data using Fuse.js
 */
export function useFuzzySearch(birthsigns: Birthsign[], searchQuery: string) {
  // Create searchable birthsign objects
  const searchableBirthsigns = useMemo(() => {
    return birthsigns.map(birthsign => ({
      id: birthsign.name.toLowerCase().replace(/\s+/g, '-'),
      name: birthsign.name,
      description: birthsign.description,
      group: birthsign.group,
      statModifications: birthsign.stat_modifications.map(stat => 
        `${stat.stat} ${stat.type} ${stat.value}${stat.value_type === 'percentage' ? '%' : ''}`
      ),
      skillBonuses: birthsign.skill_bonuses.map(skill => 
        `${skill.stat} +${skill.value}${skill.value_type === 'percentage' ? '%' : ''}`
      ),
      powers: birthsign.powers.map(power => 
        `${power.name} ${power.description}`
      ),
      conditionalEffects: birthsign.conditional_effects?.map(effect => 
        `${effect.stat} ${effect.description} ${effect.condition || ''}`
      ) || [],
      masteryEffects: birthsign.mastery_effects?.map(effect => 
        `${effect.stat} ${effect.description} ${effect.condition || ''}`
      ) || [],
      originalBirthsign: birthsign
    }))
  }, [birthsigns])

  // Configure Fuse.js options
  const fuseOptions = useMemo(() => ({
    keys: [
      { name: 'name', weight: 0.4 },
      { name: 'description', weight: 0.3 },
      { name: 'powers', weight: 0.2 },
      { name: 'statModifications', weight: 0.15 },
      { name: 'skillBonuses', weight: 0.15 },
      { name: 'conditionalEffects', weight: 0.1 },
      { name: 'masteryEffects', weight: 0.1 },
      { name: 'group', weight: 0.1 }
    ],
    threshold: 0.3, // Lower threshold = more strict matching
    includeScore: true,
    includeMatches: true
  }), [])

  // Create Fuse instance
  const fuse = useMemo(() => {
    return new Fuse(searchableBirthsigns, fuseOptions)
  }, [searchableBirthsigns, fuseOptions])

  // Perform search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return searchableBirthsigns.map(birthsign => ({
        item: birthsign,
        score: 0,
        matches: []
      }))
    }

    return fuse.search(searchQuery)
  }, [fuse, searchQuery])

  // Return filtered birthsigns based on search results
  const filteredBirthsigns = useMemo(() => {
    return searchResults.map(result => result.item.originalBirthsign)
  }, [searchResults])

  return {
    filteredBirthsigns,
    searchResults,
    searchableBirthsigns
  }
} 