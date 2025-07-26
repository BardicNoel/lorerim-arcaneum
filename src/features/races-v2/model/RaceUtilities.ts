import type { Race, SearchCategory, RaceStats } from '../types'

export class RaceUtilities {
  /**
   * Enrich races with additional computed data
   */
  static enrichRacesWithTags(races: Race[]): void {
    // This could be used to add computed tags or enrich existing data
    // For now, we'll keep it simple as the data is already well-structured
    races.forEach(race => {
      // Could add computed tags based on stats, abilities, etc.
      // Example: if race has high health, add "Tanky" tag
    })
  }

  /**
   * Generate search categories for autocomplete
   */
  static generateSearchCategories(races: Race[]): SearchCategory[] {
    const categories = [...new Set(races.map(race => race.category))]
    const allKeywords = [...new Set(races.flatMap(race => race.keywords.map(k => k.edid)))]
    const allFlags = [...new Set(races.flatMap(race => race.flags))]

    return [
      {
        id: 'category',
        name: 'Race Type',
        options: categories
      },
      {
        id: 'keywords',
        name: 'Keywords',
        options: allKeywords
      },
      {
        id: 'flags',
        name: 'Flags',
        options: allFlags
      }
    ]
  }

  /**
   * Validate race data structure
   */
  static validateRaceData(race: Race): boolean {
    try {
      // Check required fields
      if (!race.name || !race.edid || !race.category) {
        return false
      }

      // Check starting stats
      if (!race.startingStats || 
          typeof race.startingStats.health !== 'number' ||
          typeof race.startingStats.magicka !== 'number' ||
          typeof race.startingStats.stamina !== 'number' ||
          typeof race.startingStats.carryWeight !== 'number') {
        return false
      }

      // Check arrays exist
      if (!Array.isArray(race.skillBonuses) || 
          !Array.isArray(race.racialSpells) ||
          !Array.isArray(race.keywords) ||
          !Array.isArray(race.flags)) {
        return false
      }

      return true
    } catch {
      return false
    }
  }

  /**
   * Calculate comprehensive race statistics
   */
  static calculateRaceStats(race: Race): RaceStats {
    const totalHealth = race.startingStats.health
    const totalMagicka = race.startingStats.magicka
    const totalStamina = race.startingStats.stamina
    const totalCarryWeight = race.startingStats.carryWeight
    const skillBonusCount = race.skillBonuses.length
    const racialSpellCount = race.racialSpells.length

    return {
      totalHealth,
      totalMagicka,
      totalStamina,
      totalCarryWeight,
      skillBonusCount,
      racialSpellCount
    }
  }

  /**
   * Get race power level based on stats and abilities
   */
  static calculatePowerLevel(race: Race): number {
    const stats = this.calculateRaceStats(race)
    
    // Simple power calculation based on stats and abilities
    const statPower = (stats.totalHealth + stats.totalMagicka + stats.totalStamina) / 3
    const abilityPower = (stats.skillBonusCount * 5) + (stats.racialSpellCount * 10)
    
    return Math.round(statPower + abilityPower)
  }

  /**
   * Get race difficulty rating (1-5, where 1 is easiest)
   */
  static getDifficultyRating(race: Race): number {
    const powerLevel = this.calculatePowerLevel(race)
    
    // Simple difficulty calculation
    if (powerLevel < 50) return 1
    if (powerLevel < 70) return 2
    if (powerLevel < 90) return 3
    if (powerLevel < 110) return 4
    return 5
  }

  /**
   * Get race playstyle suggestions based on stats and abilities
   */
  static getPlaystyleSuggestions(race: Race): string[] {
    const suggestions: string[] = []
    const stats = race.startingStats

    // Health-based suggestions
    if (stats.health > 120) {
      suggestions.push('Tank')
      suggestions.push('Melee Fighter')
    }

    // Magicka-based suggestions
    if (stats.magicka > 120) {
      suggestions.push('Mage')
      suggestions.push('Spellcaster')
    }

    // Stamina-based suggestions
    if (stats.stamina > 120) {
      suggestions.push('Archer')
      suggestions.push('Rogue')
    }

    // Ability-based suggestions
    if (race.skillBonuses.some(sb => sb.skill.toLowerCase().includes('onehanded'))) {
      suggestions.push('One-Handed Warrior')
    }

    if (race.skillBonuses.some(sb => sb.skill.toLowerCase().includes('destruction'))) {
      suggestions.push('Destruction Mage')
    }

    if (race.skillBonuses.some(sb => sb.skill.toLowerCase().includes('sneak'))) {
      suggestions.push('Stealth')
    }

    return [...new Set(suggestions)]
  }

  /**
   * Format race description with enhanced information
   */
  static formatRaceDescription(race: Race): string {
    const stats = this.calculateRaceStats(race)
    const playstyles = this.getPlaystyleSuggestions(race)
    
    let description = race.description
    
    if (playstyles.length > 0) {
      description += `\n\nRecommended playstyles: ${playstyles.join(', ')}`
    }
    
    description += `\n\nStarting Stats: Health ${stats.totalHealth}, Magicka ${stats.totalMagicka}, Stamina ${stats.totalStamina}`
    description += `\nAbilities: ${stats.skillBonusCount} skill bonuses, ${stats.racialSpellCount} racial spells`
    
    return description
  }
} 