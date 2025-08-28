import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { Race } from '../types'

/**
 * Extracts unperked abilities from race keywords.
 * Unperked abilities are recognizable by the keyword edid including "unperked".
 * Converts camelCase to spaced words (e.g., "CreatePotions" -> "Create Potions").
 */
export function extractUnperkedAbilities(race: Race): string[] {
  if (!race.keywords || race.keywords.length === 0) {
    return []
  }

  return race.keywords
    .filter(keyword => keyword.edid.toLowerCase().includes('unperked'))
    .map(keyword => {
      // Extract the skill name from the edid
      // Example: "REQ_RacialSkills_SneakUnperked" -> "Sneak"
      const match = keyword.edid.match(/REQ_RacialSkills_(\w+)Unperked/)
      if (match) {
        const skillName = match[1]
        // Convert camelCase to spaced words
        return skillName.replace(/([A-Z])/g, ' $1').trim()
      }
      // Fallback: return the edid without the prefix/suffix
      const fallbackName = keyword.edid.replace(/REQ_RacialSkills_/, '').replace(/Unperked$/, '')
      return fallbackName.replace(/([A-Z])/g, ' $1').trim()
    })
    .filter(Boolean) // Remove any empty strings
}

/**
 * Maps a Race entity to a PlayerCreationItem for use in shared player creation UIs.
 * Includes skill bonuses, racial spells, and category as tags.
 */
export function raceToPlayerCreationItem(
  race: Race
): PlayerCreationItem & { originalRace: Race } {
  return {
    ...race, // Spread domain-specific fields first
    id: race.edid, // Use edid for character build compatibility
    name: race.name,
    description: race.description,
    tags: [race.category, ...(Array.isArray(race.flags) ? race.flags : [])],
    summary:
      race.description.length > 100
        ? `${race.description.substring(0, 100)}...`
        : race.description,
    effects: [
      // Skill bonuses
      ...(race.skillBonuses?.map(bonus => ({
        type: 'positive' as const,
        name: bonus.skill,
        description: `+${bonus.bonus} to ${bonus.skill}`,
        value: bonus.bonus,
        target: bonus.skill,
      })) || []),
      // Racial spells
      ...(race.racialSpells?.map(spell => ({
        type: 'positive' as const,
        name: spell.name,
        description: spell.description,
      })) || []),
    ],
    associatedItems: [],
    imageUrl: undefined,
    category: race.category,
    originalRace: race, // Include original race for extensibility
  }
}
