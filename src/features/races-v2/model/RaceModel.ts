import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { Race, RaceFilters } from '../types'

export class RaceModel {
  /**
   * Get a race by its ID (edid)
   */
  static getRaceById(races: Race[], id: string): Race | undefined {
    return races.find(race => race.edid === id)
  }

  /**
   * Get races by category
   */
  static getRacesByCategory(races: Race[], category: string): Race[] {
    return races.filter(race => race.category === category)
  }

  /**
   * Get unique categories from races
   */
  static getUniqueCategories(races: Race[]): string[] {
    return [...new Set(races.map(race => race.category))]
  }

  /**
   * Get unique tags from races (keywords and flags)
   */
  static getUniqueTags(races: Race[]): string[] {
    const allTags = races.flatMap(race => [
      ...race.keywords.map(k => k.edid),
      ...(race.flags || []),
    ])
    return [...new Set(allTags)]
  }

  /**
   * Filter races by category
   */
  static filterByCategory(races: Race[], category: string): Race[] {
    if (!category) return races
    return races.filter(race => race.category === category)
  }

  /**
   * Filter races by tags (keywords or flags)
   */
  static filterByTags(races: Race[], tags: string[]): Race[] {
    if (tags.length === 0) return races
    return races.filter(race =>
      tags.some(
        tag =>
          race.keywords.some(k => k.edid === tag) ||
          (race.flags || []).includes(tag)
      )
    )
  }

  /**
   * Filter races by any of the provided tags
   */
  static filterByAnyTag(races: Race[], tags: string[]): Race[] {
    if (tags.length === 0) return races
    return races.filter(race =>
      tags.some(
        tag =>
          race.keywords.some(k => k.edid === tag) ||
          (race.flags || []).includes(tag)
      )
    )
  }

  /**
   * Search races by name, description, or keywords
   */
  static search(races: Race[], term: string): Race[] {
    if (!term.trim()) return races
    const searchTerm = term.toLowerCase()

    return races.filter(
      race =>
        race.name.toLowerCase().includes(searchTerm) ||
        race.description.toLowerCase().includes(searchTerm) ||
        race.keywords.some(k => k.edid.toLowerCase().includes(searchTerm)) ||
        (race.flags || []).some(flag => flag.toLowerCase().includes(searchTerm))
    )
  }

  /**
   * Sort races by name
   */
  static sortByName(races: Race[]): Race[] {
    return [...races].sort((a, b) => a.name.localeCompare(b.name))
  }

  /**
   * Sort races by category, then by name
   */
  static sortByCategory(races: Race[]): Race[] {
    return [...races].sort((a, b) => {
      const categoryCompare = a.category.localeCompare(b.category)
      if (categoryCompare !== 0) return categoryCompare
      return a.name.localeCompare(b.name)
    })
  }

  /**
   * Transform a race to PlayerCreationItem format
   */
  static transformToPlayerCreationItem(race: Race): PlayerCreationItem {
    const tags = [
      ...race.keywords.map(k => k.edid),
      ...race.flags,
      race.category,
    ]

    const effects = [
      ...race.skillBonuses.map(sb => ({
        name: `${sb.skill} +${sb.bonus}`,
        type: 'positive' as const,
        description: `Provides ${sb.bonus} bonus to ${sb.skill}`,
        value: sb.bonus,
        target: sb.skill,
      })),
      ...race.racialSpells.map(spell => ({
        name: spell.name,
        type: 'positive' as const,
        description: spell.description,
        target: 'racial ability',
      })),
    ]

    return {
      id: race.edid,
      name: race.name,
      description: race.description,
      tags,
      effects,
      associatedItems: [],
      imageUrl: undefined,
      category: race.category,
    }
  }

  /**
   * Get related races (same category)
   */
  static getRelatedRaces(race: Race, allRaces: Race[]): Race[] {
    return allRaces.filter(
      r => r.edid !== race.edid && r.category === race.category
    )
  }

  /**
   * Calculate race statistics
   */
  static calculateRaceStats(race: Race) {
    return {
      totalHealth: race.startingStats.health,
      totalMagicka: race.startingStats.magicka,
      totalStamina: race.startingStats.stamina,
      totalCarryWeight: race.startingStats.carryWeight,
      skillBonusCount: race.skillBonuses.length,
      racialSpellCount: race.racialSpells.length,
    }
  }

  /**
   * Apply filters to races
   */
  static applyFilters(races: Race[], filters: RaceFilters): Race[] {
    let filtered = [...races]

    // Apply search filter
    if (filters.search) {
      filtered = this.search(filtered, filters.search)
    }

    // Apply type filter
    if (filters.type) {
      filtered = this.filterByCategory(filtered, filters.type)
    }

    // Apply tag filters
    if (filters.tags.length > 0) {
      filtered = this.filterByTags(filtered, filters.tags)
    }

    return filtered
  }
}
