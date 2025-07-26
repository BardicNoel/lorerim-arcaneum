import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { Race } from '../types'

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
