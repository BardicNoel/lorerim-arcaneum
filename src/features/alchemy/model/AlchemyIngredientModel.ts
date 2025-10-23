import type {
  AlchemyFilters,
  AlchemyIngredient,
  AlchemyIngredientWithComputed,
  AlchemyMetaAnalysis,
  AlchemySearchResult,
  AlchemyStatistics,
  EffectComparison,
} from '../types'

export class AlchemyIngredientModel {
  /**
   * Validate if an ingredient has all required fields
   */
  static isValid(ingredient: any): ingredient is AlchemyIngredient {
    return (
      typeof ingredient === 'object' &&
      ingredient !== null &&
      typeof ingredient.name === 'string' &&
      typeof ingredient.edid === 'string' &&
      typeof ingredient.globalFormId === 'string' &&
      typeof ingredient.plugin === 'string' &&
      typeof ingredient.value === 'number' &&
      typeof ingredient.weight === 'number' &&
      Array.isArray(ingredient.flags) &&
      Array.isArray(ingredient.effects)
    )
  }

  /**
   * Check if two ingredients are equal by name
   */
  static equals(
    ingredient1: AlchemyIngredient,
    ingredient2: AlchemyIngredient
  ): boolean {
    return ingredient1.name === ingredient2.name
  }

  /**
   * Add computed properties to an ingredient
   */
  static addComputedProperties(
    ingredient: AlchemyIngredient
  ): AlchemyIngredientWithComputed {
    const hasEffects = ingredient.effects.length > 0
    const effectCount = ingredient.effects.length
    const isComplex = effectCount > 2
    const isSimple = effectCount <= 1

    const totalMagnitude = ingredient.effects.reduce(
      (sum, effect) => sum + effect.magnitude,
      0
    )
    const maxDuration = Math.max(
      ...ingredient.effects.map(effect => effect.duration),
      0
    )
    const minDuration = Math.min(
      ...ingredient.effects.map(effect => effect.duration),
      0
    )
    const totalBaseCost = ingredient.effects.reduce(
      (sum, effect) => sum + effect.baseCost,
      0
    )
    const averageMagnitude = effectCount > 0 ? totalMagnitude / effectCount : 0
    const averageDuration =
      effectCount > 0
        ? ingredient.effects.reduce((sum, effect) => sum + effect.duration, 0) /
          effectCount
        : 0

    // Determine rarity based on value and effect complexity
    const rarity = this.determineRarity(ingredient, {
      effectCount,
      totalMagnitude,
      averageMagnitude,
      value: ingredient.value,
    })

    // Generate tags based on ingredient properties
    const tags = this.generateTags(ingredient, {
      hasEffects,
      effectCount,
      isComplex,
      isSimple,
      rarity,
    })

    // Create searchable text for fuzzy search
    const searchableText = this.createSearchableText(ingredient, tags)

    // Extract unique effect types and skills
    const effectTypes = [
      ...new Set(ingredient.effects.map(effect => effect.effectType)),
    ]
    const skills = [
      ...new Set(
        ingredient.effects
          .map(effect => effect.skill)
          .filter(skill => skill !== 'None')
      ),
    ]

    return {
      ...ingredient,
      hasEffects,
      effectCount,
      isComplex,
      isSimple,
      totalMagnitude,
      maxDuration,
      minDuration,
      totalBaseCost,
      averageMagnitude,
      averageDuration,
      tags,
      searchableText,
      rarity,
      effectTypes,
      skills,
    }
  }

  /**
   * Determine ingredient rarity based on properties
   */
  private static determineRarity(
    ingredient: AlchemyIngredient,
    computed: {
      effectCount: number
      totalMagnitude: number
      averageMagnitude: number
      value: number
    }
  ): 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' {
    const { effectCount, totalMagnitude, averageMagnitude, value } = computed

    // Legendary: High value, many effects, high magnitude
    if (value >= 100 && effectCount >= 3 && averageMagnitude >= 50) {
      return 'Legendary'
    }

    // Epic: High value or many effects with good magnitude
    if (
      (value >= 50 && effectCount >= 2) ||
      (effectCount >= 3 && averageMagnitude >= 30)
    ) {
      return 'Epic'
    }

    // Rare: Moderate value and effects
    if (
      (value >= 25 && effectCount >= 2) ||
      (effectCount >= 2 && averageMagnitude >= 20)
    ) {
      return 'Rare'
    }

    // Uncommon: Some value or effects
    if (value >= 10 || effectCount >= 1) {
      return 'Uncommon'
    }

    // Common: Low value, no effects
    return 'Common'
  }

  /**
   * Generate tags for an ingredient based on its properties
   */
  private static generateTags(
    ingredient: AlchemyIngredient,
    computed: {
      hasEffects: boolean
      effectCount: number
      isComplex: boolean
      isSimple: boolean
      rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary'
    }
  ): string[] {
    const tags: string[] = []

    // Rarity tags
    tags.push(computed.rarity)

    // Effect type tags
    if (computed.hasEffects) {
      tags.push('Has Effects')
    }

    // Effect count tags
    if (computed.effectCount === 1) {
      tags.push('Single Effect')
    } else if (computed.effectCount <= 2) {
      tags.push('Few Effects')
    } else {
      tags.push('Many Effects')
    }

    // Complexity tags
    if (computed.isComplex) {
      tags.push('Complex')
    } else if (computed.isSimple) {
      tags.push('Simple')
    }

    // Add effect names as tags
    ingredient.effects.forEach(effect => {
      tags.push(effect.mgefName)
      tags.push(effect.effectType)
      if (effect.skill !== 'None') {
        tags.push(effect.skill)
      }
    })

    // Add plugin as tag
    tags.push(ingredient.plugin)

    // Add flags as tags
    ingredient.flags.forEach(flag => {
      tags.push(flag)
    })

    return [...new Set(tags)] // Remove duplicates
  }

  /**
   * Create searchable text for fuzzy search
   */
  private static createSearchableText(
    ingredient: AlchemyIngredient,
    tags: string[]
  ): string {
    const parts = [
      ingredient.name,
      ingredient.edid,
      ingredient.globalFormId,
      ingredient.plugin,
      ...ingredient.effects.map(effect => effect.mgefName),
      ...ingredient.effects.map(effect => effect.mgefDescription),
      ...ingredient.effects.map(effect => effect.effectType),
      ...ingredient.effects.map(effect => effect.skill),
      ...ingredient.flags,
      ...tags,
    ]

    return parts.join(' ').toLowerCase()
  }

  /**
   * Filter ingredients by effect type
   */
  static filterByEffectType(
    ingredients: AlchemyIngredientWithComputed[],
    effectType: string
  ): AlchemyIngredientWithComputed[] {
    return ingredients.filter(ingredient =>
      ingredient.effectTypes.includes(effectType)
    )
  }

  /**
   * Filter ingredients by effect types
   */
  static filterByEffectTypes(
    ingredients: AlchemyIngredientWithComputed[],
    effectTypes: string[]
  ): AlchemyIngredientWithComputed[] {
    if (effectTypes.length === 0) return ingredients
    return ingredients.filter(ingredient =>
      effectTypes.some(effectType =>
        ingredient.effectTypes.includes(effectType)
      )
    )
  }

  /**
   * Filter ingredients by skill
   */
  static filterBySkill(
    ingredients: AlchemyIngredientWithComputed[],
    skill: string
  ): AlchemyIngredientWithComputed[] {
    return ingredients.filter(ingredient => ingredient.skills.includes(skill))
  }

  /**
   * Filter ingredients by skills
   */
  static filterBySkills(
    ingredients: AlchemyIngredientWithComputed[],
    skills: string[]
  ): AlchemyIngredientWithComputed[] {
    if (skills.length === 0) return ingredients
    return ingredients.filter(ingredient =>
      skills.some(skill => ingredient.skills.includes(skill))
    )
  }

  /**
   * Filter ingredients by plugin
   */
  static filterByPlugin(
    ingredients: AlchemyIngredientWithComputed[],
    plugin: string
  ): AlchemyIngredientWithComputed[] {
    return ingredients.filter(ingredient => ingredient.plugin === plugin)
  }

  /**
   * Filter ingredients by plugins
   */
  static filterByPlugins(
    ingredients: AlchemyIngredientWithComputed[],
    plugins: string[]
  ): AlchemyIngredientWithComputed[] {
    if (plugins.length === 0) return ingredients
    return ingredients.filter(ingredient => plugins.includes(ingredient.plugin))
  }

  /**
   * Filter ingredients by rarity
   */
  static filterByRarity(
    ingredients: AlchemyIngredientWithComputed[],
    rarity: string
  ): AlchemyIngredientWithComputed[] {
    return ingredients.filter(ingredient => ingredient.rarity === rarity)
  }

  /**
   * Filter ingredients by rarities
   */
  static filterByRarities(
    ingredients: AlchemyIngredientWithComputed[],
    rarities: string[]
  ): AlchemyIngredientWithComputed[] {
    if (rarities.length === 0) return ingredients
    return ingredients.filter(ingredient =>
      rarities.includes(ingredient.rarity)
    )
  }

  /**
   * Filter ingredients by value range
   */
  static filterByValueRange(
    ingredients: AlchemyIngredientWithComputed[],
    minValue: number | null,
    maxValue: number | null
  ): AlchemyIngredientWithComputed[] {
    return ingredients.filter(ingredient => {
      if (minValue !== null && ingredient.value < minValue) return false
      if (maxValue !== null && ingredient.value > maxValue) return false
      return true
    })
  }

  /**
   * Filter ingredients by weight range
   */
  static filterByWeightRange(
    ingredients: AlchemyIngredientWithComputed[],
    minWeight: number | null,
    maxWeight: number | null
  ): AlchemyIngredientWithComputed[] {
    return ingredients.filter(ingredient => {
      if (minWeight !== null && ingredient.weight < minWeight) return false
      if (maxWeight !== null && ingredient.weight > maxWeight) return false
      return true
    })
  }

  /**
   * Filter ingredients by magnitude range
   */
  static filterByMagnitudeRange(
    ingredients: AlchemyIngredientWithComputed[],
    minMagnitude: number | null,
    maxMagnitude: number | null
  ): AlchemyIngredientWithComputed[] {
    return ingredients.filter(ingredient => {
      if (minMagnitude !== null && ingredient.totalMagnitude < minMagnitude)
        return false
      if (maxMagnitude !== null && ingredient.totalMagnitude > maxMagnitude)
        return false
      return true
    })
  }

  /**
   * Filter ingredients by duration range
   */
  static filterByDurationRange(
    ingredients: AlchemyIngredientWithComputed[],
    minDuration: number | null,
    maxDuration: number | null
  ): AlchemyIngredientWithComputed[] {
    return ingredients.filter(ingredient => {
      if (minDuration !== null && ingredient.maxDuration < minDuration)
        return false
      if (maxDuration !== null && ingredient.maxDuration > maxDuration)
        return false
      return true
    })
  }

  /**
   * Filter ingredients by base cost range
   */
  static filterByBaseCostRange(
    ingredients: AlchemyIngredientWithComputed[],
    minBaseCost: number | null,
    maxBaseCost: number | null
  ): AlchemyIngredientWithComputed[] {
    return ingredients.filter(ingredient => {
      if (minBaseCost !== null && ingredient.totalBaseCost < minBaseCost)
        return false
      if (maxBaseCost !== null && ingredient.totalBaseCost > maxBaseCost)
        return false
      return true
    })
  }

  /**
   * Filter ingredients by effects
   */
  static filterByEffects(
    ingredients: AlchemyIngredientWithComputed[],
    effects: string[]
  ): AlchemyIngredientWithComputed[] {
    if (effects.length === 0) return ingredients
    return ingredients.filter(ingredient =>
      effects.some(effect =>
        ingredient.effects.some(ingredientEffect =>
          ingredientEffect.mgefName.toLowerCase().includes(effect.toLowerCase())
        )
      )
    )
  }

  /**
   * Filter ingredients by flags
   */
  static filterByFlags(
    ingredients: AlchemyIngredientWithComputed[],
    flags: string[]
  ): AlchemyIngredientWithComputed[] {
    if (flags.length === 0) return ingredients
    return ingredients.filter(ingredient =>
      flags.some(flag => ingredient.flags.includes(flag))
    )
  }

  /**
   * Search ingredients using fuzzy search
   */
  static search(
    ingredients: AlchemyIngredientWithComputed[],
    query: string
  ): AlchemySearchResult[] {
    if (!query.trim()) return []

    const searchTerm = query.toLowerCase().trim()
    const results: AlchemySearchResult[] = []

    for (const ingredient of ingredients) {
      const score = this.calculateSearchScore(ingredient, searchTerm)
      if (score > 0) {
        const matchedFields = this.getMatchedFields(ingredient, searchTerm)
        results.push({
          ingredient,
          score,
          matchedFields,
        })
      }
    }

    // Sort by score (highest first)
    return results.sort((a, b) => b.score - a.score)
  }

  /**
   * Calculate search score for an ingredient
   */
  private static calculateSearchScore(
    ingredient: AlchemyIngredientWithComputed,
    searchTerm: string
  ): number {
    let score = 0
    const term = searchTerm.toLowerCase()

    // Exact matches get highest score
    if (ingredient.name.toLowerCase() === term) score += 100
    if (ingredient.edid.toLowerCase() === term) score += 90
    if (ingredient.plugin.toLowerCase() === term) score += 80

    // Partial matches in name and edid
    if (ingredient.name.toLowerCase().includes(term)) score += 50
    if (ingredient.edid.toLowerCase().includes(term)) score += 45
    if (ingredient.plugin.toLowerCase().includes(term)) score += 40

    // Matches in effects
    ingredient.effects.forEach(effect => {
      if (effect.mgefName.toLowerCase() === term) score += 40
      if (effect.mgefName.toLowerCase().includes(term)) score += 20
      if (effect.mgefDescription.toLowerCase().includes(term)) score += 15
      if (effect.effectType.toLowerCase().includes(term)) score += 15
      if (effect.skill.toLowerCase().includes(term)) score += 10
    })

    // Matches in flags
    ingredient.flags.forEach(flag => {
      if (flag.toLowerCase() === term) score += 25
      if (flag.toLowerCase().includes(term)) score += 10
    })

    // Matches in tags
    ingredient.tags.forEach(tag => {
      if (tag.toLowerCase() === term) score += 25
      if (tag.toLowerCase().includes(term)) score += 10
    })

    return score
  }

  /**
   * Get matched fields for search result
   */
  private static getMatchedFields(
    ingredient: AlchemyIngredientWithComputed,
    searchTerm: string
  ): string[] {
    const matchedFields: string[] = []
    const term = searchTerm.toLowerCase()

    if (ingredient.name.toLowerCase().includes(term)) matchedFields.push('name')
    if (ingredient.edid.toLowerCase().includes(term)) matchedFields.push('edid')
    if (ingredient.plugin.toLowerCase().includes(term))
      matchedFields.push('plugin')

    ingredient.effects.forEach(effect => {
      if (
        effect.mgefName.toLowerCase().includes(term) ||
        effect.mgefDescription.toLowerCase().includes(term) ||
        effect.effectType.toLowerCase().includes(term) ||
        effect.skill.toLowerCase().includes(term)
      ) {
        matchedFields.push('effects')
      }
    })

    ingredient.flags.forEach(flag => {
      if (flag.toLowerCase().includes(term)) matchedFields.push('flags')
    })

    return [...new Set(matchedFields)]
  }

  /**
   * Sort ingredients by various criteria
   */
  static sort(
    ingredients: AlchemyIngredientWithComputed[],
    sortBy:
      | 'name'
      | 'value'
      | 'weight'
      | 'effectCount'
      | 'magnitude'
      | 'duration'
      | 'baseCost'
      | 'plugin',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): AlchemyIngredientWithComputed[] {
    const sorted = [...ingredients].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'value':
          comparison = a.value - b.value
          break
        case 'weight':
          comparison = a.weight - b.weight
          break
        case 'effectCount':
          comparison = a.effectCount - b.effectCount
          break
        case 'magnitude':
          comparison = a.totalMagnitude - b.totalMagnitude
          break
        case 'duration':
          comparison = a.maxDuration - b.maxDuration
          break
        case 'baseCost':
          comparison = a.totalBaseCost - b.totalBaseCost
          break
        case 'plugin':
          comparison = a.plugin.localeCompare(b.plugin)
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return sorted
  }

  /**
   * Get unique effect types from ingredients
   */
  static getUniqueEffectTypes(
    ingredients: AlchemyIngredientWithComputed[]
  ): string[] {
    const effectTypes = ingredients.flatMap(
      ingredient => ingredient.effectTypes
    )
    return [...new Set(effectTypes)].sort()
  }

  /**
   * Get unique effects from ingredients
   */
  static getUniqueEffects(
    ingredients: AlchemyIngredientWithComputed[]
  ): string[] {
    const effects = ingredients.flatMap(ingredient =>
      ingredient.effects.map(effect => effect.mgefName)
    )
    return [...new Set(effects)].sort()
  }

  /**
   * Get unique skills from ingredients
   */
  static getUniqueSkills(
    ingredients: AlchemyIngredientWithComputed[]
  ): string[] {
    const skills = ingredients.flatMap(ingredient => ingredient.skills)
    return [...new Set(skills)].sort()
  }

  /**
   * Get unique plugins from ingredients
   */
  static getUniquePlugins(
    ingredients: AlchemyIngredientWithComputed[]
  ): string[] {
    const plugins = ingredients.map(ingredient => ingredient.plugin)
    return [...new Set(plugins)].sort()
  }

  /**
   * Get unique rarities from ingredients
   */
  static getUniqueRarities(
    ingredients: AlchemyIngredientWithComputed[]
  ): string[] {
    const rarities = ingredients.map(ingredient => ingredient.rarity)
    return [...new Set(rarities)].sort()
  }

  /**
   * Get unique flags from ingredients
   */
  static getUniqueFlags(
    ingredients: AlchemyIngredientWithComputed[]
  ): string[] {
    const flags = ingredients.flatMap(ingredient => ingredient.flags)
    return [...new Set(flags)].sort()
  }

  /**
   * Apply filters to ingredients
   */
  static applyFilters(
    ingredients: AlchemyIngredientWithComputed[],
    filters: AlchemyFilters
  ): AlchemyIngredientWithComputed[] {
    let filtered = [...ingredients]

    // Apply search term
    if (filters.searchTerm.trim()) {
      const searchResults = this.search(filtered, filters.searchTerm)
      filtered = searchResults.map(result => result.ingredient)
    }

    // Apply effect type filters
    if (filters.effectTypes.length > 0) {
      filtered = this.filterByEffectTypes(filtered, filters.effectTypes)
    }

    // Apply skill filters
    if (filters.skills.length > 0) {
      filtered = this.filterBySkills(filtered, filters.skills)
    }

    // Apply plugin filters
    if (filters.plugins.length > 0) {
      filtered = this.filterByPlugins(filtered, filters.plugins)
    }

    // Apply rarity filters
    if (filters.rarities.length > 0) {
      filtered = this.filterByRarities(filtered, filters.rarities)
    }

    // Apply effect filters
    if (filters.effects.length > 0) {
      filtered = this.filterByEffects(filtered, filters.effects)
    }

    // Apply flag filters
    if (filters.flags.length > 0) {
      filtered = this.filterByFlags(filtered, filters.flags)
    }

    // Apply effect property filters
    if (filters.hasEffects !== null) {
      filtered = filtered.filter(
        ingredient => ingredient.hasEffects === filters.hasEffects
      )
    }

    if (filters.isComplex !== null) {
      filtered = filtered.filter(
        ingredient => ingredient.isComplex === filters.isComplex
      )
    }

    // Apply value range filters
    filtered = this.filterByValueRange(
      filtered,
      filters.minValue,
      filters.maxValue
    )

    // Apply weight range filters
    filtered = this.filterByWeightRange(
      filtered,
      filters.minWeight,
      filters.maxWeight
    )

    // Apply magnitude range filters
    filtered = this.filterByMagnitudeRange(
      filtered,
      filters.minMagnitude,
      filters.maxMagnitude
    )

    // Apply duration range filters
    filtered = this.filterByDurationRange(
      filtered,
      filters.minDuration,
      filters.maxDuration
    )

    // Apply base cost range filters
    filtered = this.filterByBaseCostRange(
      filtered,
      filters.minBaseCost,
      filters.maxBaseCost
    )

    return filtered
  }

  /**
   * Get statistics for ingredients
   */
  static getStatistics(
    ingredients: AlchemyIngredientWithComputed[]
  ): AlchemyStatistics {
    const totalIngredients = ingredients.length

    // Ingredients by effect type
    const ingredientsByEffectType: Record<string, number> = {}
    ingredients.forEach(ingredient => {
      ingredient.effectTypes.forEach(effectType => {
        ingredientsByEffectType[effectType] =
          (ingredientsByEffectType[effectType] || 0) + 1
      })
    })

    // Ingredients by plugin
    const ingredientsByPlugin: Record<string, number> = {}
    ingredients.forEach(ingredient => {
      ingredientsByPlugin[ingredient.plugin] =
        (ingredientsByPlugin[ingredient.plugin] || 0) + 1
    })

    // Ingredients by rarity
    const ingredientsByRarity: Record<string, number> = {}
    ingredients.forEach(ingredient => {
      ingredientsByRarity[ingredient.rarity] =
        (ingredientsByRarity[ingredient.rarity] || 0) + 1
    })

    // Ingredients by skill
    const ingredientsBySkill: Record<string, number> = {}
    ingredients.forEach(ingredient => {
      ingredient.skills.forEach(skill => {
        ingredientsBySkill[skill] = (ingredientsBySkill[skill] || 0) + 1
      })
    })

    // Average values
    const totalEffectCount = ingredients.reduce(
      (sum, ingredient) => sum + ingredient.effectCount,
      0
    )
    const totalMagnitude = ingredients.reduce(
      (sum, ingredient) => sum + ingredient.totalMagnitude,
      0
    )
    const totalDuration = ingredients.reduce(
      (sum, ingredient) => sum + ingredient.maxDuration,
      0
    )
    const totalBaseCost = ingredients.reduce(
      (sum, ingredient) => sum + ingredient.totalBaseCost,
      0
    )
    const totalValue = ingredients.reduce(
      (sum, ingredient) => sum + ingredient.value,
      0
    )
    const totalWeight = ingredients.reduce(
      (sum, ingredient) => sum + ingredient.weight,
      0
    )

    const averageEffectCount =
      totalIngredients > 0 ? totalEffectCount / totalIngredients : 0
    const averageMagnitude =
      totalIngredients > 0 ? totalMagnitude / totalIngredients : 0
    const averageDuration =
      totalIngredients > 0 ? totalDuration / totalIngredients : 0
    const averageBaseCost =
      totalIngredients > 0 ? totalBaseCost / totalIngredients : 0
    const averageValue =
      totalIngredients > 0 ? totalValue / totalIngredients : 0
    const averageWeight =
      totalIngredients > 0 ? totalWeight / totalIngredients : 0

    // Top effects
    const effectCounts: Record<string, number> = {}
    ingredients.forEach(ingredient => {
      ingredient.effects.forEach(effect => {
        effectCounts[effect.mgefName] = (effectCounts[effect.mgefName] || 0) + 1
      })
    })
    const topEffects = Object.entries(effectCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Top effect types
    const topEffectTypes = Object.entries(ingredientsByEffectType)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Top plugins
    const topPlugins = Object.entries(ingredientsByPlugin)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Top skills
    const topSkills = Object.entries(ingredientsBySkill)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Value and weight distributions
    const values = ingredients
      .map(ingredient => ingredient.value)
      .sort((a, b) => a - b)
    const weights = ingredients
      .map(ingredient => ingredient.weight)
      .sort((a, b) => a - b)

    const valueDistribution = {
      min: values[0] || 0,
      max: values[values.length - 1] || 0,
      mean: averageValue,
      median: values[Math.floor(values.length / 2)] || 0,
    }

    const weightDistribution = {
      min: weights[0] || 0,
      max: weights[weights.length - 1] || 0,
      mean: averageWeight,
      median: weights[Math.floor(weights.length / 2)] || 0,
    }

    return {
      totalIngredients,
      ingredientsByEffectType,
      ingredientsByPlugin,
      ingredientsByRarity,
      ingredientsBySkill,
      averageEffectCount,
      averageMagnitude,
      averageDuration,
      averageBaseCost,
      averageValue,
      averageWeight,
      topEffects,
      topEffectTypes,
      topPlugins,
      topSkills,
      valueDistribution,
      weightDistribution,
    }
  }

  /**
   * Calculate effect comparisons for an ingredient against all ingredients
   */
  static getEffectComparisons(
    ingredient: AlchemyIngredientWithComputed,
    allIngredients: AlchemyIngredientWithComputed[]
  ): EffectComparison[] {
    // Calculate mean values for each effect across all ingredients
    const effectStats: Record<
      string,
      {
        magnitudeSum: number
        durationSum: number
        baseCostSum: number
        count: number
      }
    > = {}

    allIngredients.forEach(ing => {
      ing.effects.forEach(effect => {
        if (!effectStats[effect.mgefName]) {
          effectStats[effect.mgefName] = {
            magnitudeSum: 0,
            durationSum: 0,
            baseCostSum: 0,
            count: 0,
          }
        }
        effectStats[effect.mgefName].magnitudeSum += effect.magnitude
        effectStats[effect.mgefName].durationSum += effect.duration
        effectStats[effect.mgefName].baseCostSum += effect.baseCost
        effectStats[effect.mgefName].count += 1
      })
    })

    // Calculate comparisons for each effect in the ingredient
    return ingredient.effects.map(effect => {
      const stats = effectStats[effect.mgefName]
      const meanMagnitude =
        stats.count > 0 ? stats.magnitudeSum / stats.count : 0
      const meanDuration = stats.count > 0 ? stats.durationSum / stats.count : 0
      const meanBaseCost = stats.count > 0 ? stats.baseCostSum / stats.count : 0

      const magnitudeDiff = effect.magnitude - meanMagnitude
      const durationDiff = effect.duration - meanDuration
      const baseCostDiff = effect.baseCost - meanBaseCost

      return {
        name: effect.mgefName,
        magnitude: {
          value: effect.magnitude,
          mean: meanMagnitude,
          difference: magnitudeDiff,
          percentage:
            meanMagnitude > 0 ? (magnitudeDiff / meanMagnitude) * 100 : 0,
        },
        duration: {
          value: effect.duration,
          mean: meanDuration,
          difference: durationDiff,
          percentage:
            meanDuration > 0 ? (durationDiff / meanDuration) * 100 : 0,
        },
        baseCost: {
          value: effect.baseCost,
          mean: meanBaseCost,
          difference: baseCostDiff,
          percentage:
            meanBaseCost > 0 ? (baseCostDiff / meanBaseCost) * 100 : 0,
        },
      }
    })
  }

  /**
   * Get meta analysis data
   */
  static getMetaAnalysis(
    ingredients: AlchemyIngredientWithComputed[]
  ): AlchemyMetaAnalysis {
    // Effect synergies analysis
    const effectSynergies: Array<{
      effect1: string
      effect2: string
      frequency: number
      averageMagnitude: number
    }> = []
    const effectPairs: Record<
      string,
      { count: number; totalMagnitude: number }
    > = {}

    ingredients.forEach(ingredient => {
      const effects = ingredient.effects.map(effect => effect.mgefName)
      for (let i = 0; i < effects.length; i++) {
        for (let j = i + 1; j < effects.length; j++) {
          const pair = [effects[i], effects[j]].sort().join('|')
          if (!effectPairs[pair]) {
            effectPairs[pair] = { count: 0, totalMagnitude: 0 }
          }
          effectPairs[pair].count += 1
          effectPairs[pair].totalMagnitude += ingredient.totalMagnitude
        }
      }
    })

    Object.entries(effectPairs).forEach(([pair, data]) => {
      const [effect1, effect2] = pair.split('|')
      effectSynergies.push({
        effect1,
        effect2,
        frequency: data.count,
        averageMagnitude: data.totalMagnitude / data.count,
      })
    })

    effectSynergies.sort((a, b) => b.frequency - a.frequency)

    // Plugin contributions analysis
    const pluginContributions = Object.entries(
      ingredients.reduce(
        (acc, ingredient) => {
          if (!acc[ingredient.plugin]) {
            acc[ingredient.plugin] = {
              ingredientCount: 0,
              uniqueEffects: new Set(),
              totalValue: 0,
            }
          }
          acc[ingredient.plugin].ingredientCount += 1
          acc[ingredient.plugin].totalValue += ingredient.value
          ingredient.effects.forEach(effect => {
            acc[ingredient.plugin].uniqueEffects.add(effect.mgefName)
          })
          return acc
        },
        {} as Record<
          string,
          {
            ingredientCount: number
            uniqueEffects: Set<string>
            totalValue: number
          }
        >
      )
    ).map(([plugin, data]) => ({
      plugin,
      ingredientCount: data.ingredientCount,
      uniqueEffects: data.uniqueEffects.size,
      averageValue: data.totalValue / data.ingredientCount,
    }))

    // Rarity analysis
    const rarityAnalysis = ingredients.reduce(
      (acc, ingredient) => {
        acc[ingredient.rarity.toLowerCase()] =
          (acc[ingredient.rarity.toLowerCase()] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    // Economic analysis
    const valuePerWeight = ingredients
      .map(ingredient => ({
        ingredient: ingredient.name,
        ratio: ingredient.weight > 0 ? ingredient.value / ingredient.weight : 0,
      }))
      .sort((a, b) => b.ratio - a.ratio)

    const mostValuable = ingredients
      .map(ingredient => ({
        ingredient: ingredient.name,
        value: ingredient.value,
      }))
      .sort((a, b) => b.value - a.value)

    return {
      effectSynergies: effectSynergies.slice(0, 20),
      pluginContributions: pluginContributions.sort(
        (a, b) => b.ingredientCount - a.ingredientCount
      ),
      rarityAnalysis,
      economicAnalysis: {
        valuePerWeight: valuePerWeight.slice(0, 20),
        mostValuable: mostValuable.slice(0, 20),
      },
    }
  }
}
