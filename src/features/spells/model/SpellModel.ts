import type { Spell, SpellWithComputed, SpellFilters, SpellSearchResult } from '../types'

export class SpellModel {
  /**
   * Validate if a spell has all required fields
   */
  static isValid(spell: any): spell is Spell {
    return (
      typeof spell === 'object' &&
      spell !== null &&
      typeof spell.name === 'string' &&
      typeof spell.editorId === 'string' &&
      typeof spell.school === 'string' &&
      typeof spell.level === 'string' &&
      typeof spell.magickaCost === 'number' &&
      Array.isArray(spell.effects)
    )
  }

  /**
   * Check if two spells are equal by editorId
   */
  static equals(spell1: Spell, spell2: Spell): boolean {
    return spell1.editorId === spell2.editorId
  }

  /**
   * Add computed properties to a spell
   */
  static addComputedProperties(spell: Spell): SpellWithComputed {
    const hasEffects = spell.effects.length > 0
    const effectCount = spell.effects.length
    const isAreaSpell = spell.effects.some(effect => effect.area > 0)
    const isDurationSpell = spell.effects.some(effect => effect.duration > 0)
    const isInstantSpell = spell.effects.every(effect => effect.duration === 0)
    
    const totalMagnitude = spell.effects.reduce((sum, effect) => sum + effect.magnitude, 0)
    const maxDuration = Math.max(...spell.effects.map(effect => effect.duration), 0)
    const maxArea = Math.max(...spell.effects.map(effect => effect.area), 0)

    // Generate tags based on spell properties
    const tags = this.generateTags(spell, {
      hasEffects,
      isAreaSpell,
      isDurationSpell,
      isInstantSpell
    })

    // Create searchable text for fuzzy search
    const searchableText = this.createSearchableText(spell, tags)

    return {
      ...spell,
      hasEffects,
      effectCount,
      isAreaSpell,
      isDurationSpell,
      isInstantSpell,
      totalMagnitude,
      maxDuration,
      maxArea,
      tags,
      searchableText
    }
  }

  /**
   * Generate tags for a spell based on its properties
   */
  private static generateTags(spell: Spell, computed: {
    hasEffects: boolean
    isAreaSpell: boolean
    isDurationSpell: boolean
    isInstantSpell: boolean
  }): string[] {
    const tags: string[] = []

    // School tags
    tags.push(spell.school)
    
    // Level tags
    tags.push(spell.level)

    // Effect type tags
    if (computed.hasEffects) {
      tags.push('Has Effects')
    }
    if (computed.isAreaSpell) {
      tags.push('Area Effect')
    }
    if (computed.isDurationSpell) {
      tags.push('Duration')
    }
    if (computed.isInstantSpell) {
      tags.push('Instant')
    }

    // Cost-based tags
    if (spell.magickaCost === 0) {
      tags.push('Free')
    } else if (spell.magickaCost <= 50) {
      tags.push('Low Cost')
    } else if (spell.magickaCost <= 150) {
      tags.push('Medium Cost')
    } else {
      tags.push('High Cost')
    }

    // Effect-specific tags
    spell.effects.forEach(effect => {
      if (effect.name.toLowerCase().includes('fire')) tags.push('Fire')
      if (effect.name.toLowerCase().includes('frost') || effect.name.toLowerCase().includes('ice')) tags.push('Frost')
      if (effect.name.toLowerCase().includes('shock') || effect.name.toLowerCase().includes('lightning')) tags.push('Shock')
      if (effect.name.toLowerCase().includes('heal') || effect.name.toLowerCase().includes('restore')) tags.push('Healing')
      if (effect.name.toLowerCase().includes('conjure') || effect.name.toLowerCase().includes('summon')) tags.push('Conjuration')
      if (effect.name.toLowerCase().includes('fear') || effect.name.toLowerCase().includes('calm')) tags.push('Illusion')
      if (effect.name.toLowerCase().includes('paralyze') || effect.name.toLowerCase().includes('slow')) tags.push('Control')
    })

    return [...new Set(tags)] // Remove duplicates
  }

  /**
   * Create searchable text for fuzzy search
   */
  private static createSearchableText(spell: Spell, tags: string[]): string {
    const parts = [
      spell.name,
      spell.school,
      spell.level,
      spell.description,
      ...tags,
      ...spell.effects.map(effect => effect.name),
      ...spell.effects.map(effect => effect.description)
    ]
    return parts.join(' ').toLowerCase()
  }

  /**
   * Filter spells by school
   */
  static filterBySchool(spells: SpellWithComputed[], school: string): SpellWithComputed[] {
    return spells.filter(spell => spell.school === school)
  }

  /**
   * Filter spells by level
   */
  static filterByLevel(spells: SpellWithComputed[], level: string): SpellWithComputed[] {
    return spells.filter(spell => spell.level === level)
  }

  /**
   * Filter spells by multiple schools
   */
  static filterBySchools(spells: SpellWithComputed[], schools: string[]): SpellWithComputed[] {
    if (schools.length === 0) return spells
    return spells.filter(spell => schools.includes(spell.school))
  }

  /**
   * Filter spells by multiple levels
   */
  static filterByLevels(spells: SpellWithComputed[], levels: string[]): SpellWithComputed[] {
    if (levels.length === 0) return spells
    return spells.filter(spell => levels.includes(spell.level))
  }

  /**
   * Filter spells by magicka cost range
   */
  static filterByMagickaCost(
    spells: SpellWithComputed[], 
    minCost: number | null, 
    maxCost: number | null
  ): SpellWithComputed[] {
    return spells.filter(spell => {
      if (minCost !== null && spell.magickaCost < minCost) return false
      if (maxCost !== null && spell.magickaCost > maxCost) return false
      return true
    })
  }

  /**
   * Filter spells by magnitude range
   */
  static filterByMagnitude(
    spells: SpellWithComputed[], 
    minMagnitude: number | null, 
    maxMagnitude: number | null
  ): SpellWithComputed[] {
    return spells.filter(spell => {
      if (minMagnitude !== null && spell.totalMagnitude < minMagnitude) return false
      if (maxMagnitude !== null && spell.totalMagnitude > maxMagnitude) return false
      return true
    })
  }

  /**
   * Filter spells by effect properties
   */
  static filterByEffectProperties(
    spells: SpellWithComputed[],
    hasEffects: boolean | null,
    isAreaSpell: boolean | null,
    isDurationSpell: boolean | null
  ): SpellWithComputed[] {
    return spells.filter(spell => {
      if (hasEffects !== null && spell.hasEffects !== hasEffects) return false
      if (isAreaSpell !== null && spell.isAreaSpell !== isAreaSpell) return false
      if (isDurationSpell !== null && spell.isDurationSpell !== isDurationSpell) return false
      return true
    })
  }

  /**
   * Search spells using fuzzy search
   */
  static search(spells: SpellWithComputed[], query: string): SpellSearchResult[] {
    if (!query.trim()) {
      return spells.map(spell => ({
        spell,
        score: 1,
        matchedFields: []
      }))
    }

    const searchTerm = query.toLowerCase()
    const results: SpellSearchResult[] = []

    spells.forEach(spell => {
      let score = 0
      const matchedFields: string[] = []

      // Exact name match (highest priority)
      if (spell.name.toLowerCase() === searchTerm) {
        score += 100
        matchedFields.push('name')
      }
      // Name contains search term
      else if (spell.name.toLowerCase().includes(searchTerm)) {
        score += 50
        matchedFields.push('name')
      }

      // School match
      if (spell.school.toLowerCase() === searchTerm) {
        score += 30
        matchedFields.push('school')
      }
      else if (spell.school.toLowerCase().includes(searchTerm)) {
        score += 15
        matchedFields.push('school')
      }

      // Level match
      if (spell.level.toLowerCase() === searchTerm) {
        score += 25
        matchedFields.push('level')
      }
      else if (spell.level.toLowerCase().includes(searchTerm)) {
        score += 10
        matchedFields.push('level')
      }

      // Description contains search term
      if (spell.description.toLowerCase().includes(searchTerm)) {
        score += 5
        matchedFields.push('description')
      }

      // Tag matches
      spell.tags.forEach(tag => {
        if (tag.toLowerCase().includes(searchTerm)) {
          score += 3
          matchedFields.push('tags')
        }
      })

      // Effect name/description matches
      spell.effects.forEach(effect => {
        if (effect.name.toLowerCase().includes(searchTerm)) {
          score += 8
          matchedFields.push('effects')
        }
        if (effect.description.toLowerCase().includes(searchTerm)) {
          score += 4
          matchedFields.push('effects')
        }
      })

      if (score > 0) {
        results.push({
          spell,
          score,
          matchedFields: [...new Set(matchedFields)]
        })
      }
    })

    return results.sort((a, b) => b.score - a.score)
  }

  /**
   * Sort spells by various criteria
   */
  static sort(
    spells: SpellWithComputed[], 
    sortBy: 'name' | 'school' | 'level' | 'magickaCost' | 'magnitude' | 'duration',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): SpellWithComputed[] {
    const sorted = [...spells].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'school':
          comparison = a.school.localeCompare(b.school)
          break
        case 'level':
          comparison = this.compareLevels(a.level, b.level)
          break
        case 'magickaCost':
          comparison = a.magickaCost - b.magickaCost
          break
        case 'magnitude':
          comparison = a.totalMagnitude - b.totalMagnitude
          break
        case 'duration':
          comparison = a.maxDuration - b.maxDuration
          break
      }

      return sortOrder === 'desc' ? -comparison : comparison
    })

    return sorted
  }

  /**
   * Compare spell levels (Novice < Apprentice < Adept < Expert < Master)
   */
  private static compareLevels(level1: string, level2: string): number {
    const levelOrder = ['Novice', 'Apprentice', 'Adept', 'Expert', 'Master']
    const index1 = levelOrder.indexOf(level1)
    const index2 = levelOrder.indexOf(level2)
    
    if (index1 === -1 && index2 === -1) return 0
    if (index1 === -1) return 1
    if (index2 === -1) return -1
    
    return index1 - index2
  }

  /**
   * Get unique schools from spells
   */
  static getUniqueSchools(spells: SpellWithComputed[]): string[] {
    return [...new Set(spells.map(spell => spell.school))].sort()
  }

  /**
   * Get unique levels from spells
   */
  static getUniqueLevels(spells: SpellWithComputed[]): string[] {
    const levels = [...new Set(spells.map(spell => spell.level))]
    return this.sortLevels(levels)
  }

  /**
   * Sort levels in proper order
   */
  private static sortLevels(levels: string[]): string[] {
    const levelOrder = ['Novice', 'Apprentice', 'Adept', 'Expert', 'Master']
    return levels.sort((a, b) => {
      const indexA = levelOrder.indexOf(a)
      const indexB = levelOrder.indexOf(b)
      if (indexA === -1 && indexB === -1) return 0
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })
  }

  /**
   * Get unique tags from spells
   */
  static getUniqueTags(spells: SpellWithComputed[]): string[] {
    const allTags = spells.flatMap(spell => spell.tags)
    return [...new Set(allTags)].sort()
  }

  /**
   * Apply multiple filters to spells
   */
  static applyFilters(spells: SpellWithComputed[], filters: SpellFilters): SpellWithComputed[] {
    let filtered = [...spells]

    // Apply school filters
    if (filters.schools.length > 0) {
      filtered = this.filterBySchools(filtered, filters.schools)
    }

    // Apply level filters
    if (filters.levels.length > 0) {
      filtered = this.filterByLevels(filtered, filters.levels)
    }

    // Apply effect property filters
    filtered = this.filterByEffectProperties(
      filtered,
      filters.hasEffects,
      filters.isAreaSpell,
      filters.isDurationSpell
    )

    // Apply magicka cost filters
    filtered = this.filterByMagickaCost(
      filtered,
      filters.minMagickaCost,
      filters.maxMagickaCost
    )

    // Apply magnitude filters
    filtered = this.filterByMagnitude(
      filtered,
      filters.minMagnitude,
      filters.maxMagnitude
    )

    // Apply search term
    if (filters.searchTerm) {
      const searchResults = this.search(filtered, filters.searchTerm)
      filtered = searchResults.map(result => result.spell)
    }

    return filtered
  }

  /**
   * Get spell statistics
   */
  static getStatistics(spells: SpellWithComputed[]) {
    const schools = this.getUniqueSchools(spells)
    const levels = this.getUniqueLevels(spells)
    const tags = this.getUniqueTags(spells)

    const totalSpells = spells.length
    const spellsWithEffects = spells.filter(spell => spell.hasEffects).length
    const areaSpells = spells.filter(spell => spell.isAreaSpell).length
    const durationSpells = spells.filter(spell => spell.isDurationSpell).length
    const freeSpells = spells.filter(spell => spell.magickaCost === 0).length

    const avgMagickaCost = spells.length > 0 
      ? spells.reduce((sum, spell) => sum + spell.magickaCost, 0) / spells.length 
      : 0

    const avgMagnitude = spells.length > 0
      ? spells.reduce((sum, spell) => sum + spell.totalMagnitude, 0) / spells.length
      : 0

    return {
      totalSpells,
      spellsWithEffects,
      areaSpells,
      durationSpells,
      freeSpells,
      avgMagickaCost: Math.round(avgMagickaCost),
      avgMagnitude: Math.round(avgMagnitude),
      schools,
      levels,
      tags
    }
  }
} 