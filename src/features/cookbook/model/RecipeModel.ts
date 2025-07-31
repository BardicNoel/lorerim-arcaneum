import type { Recipe, RecipeWithComputed, RecipeFilters, RecipeSearchResult, RecipeStatistics } from '../types'

export class RecipeModel {
  /**
   * Validate if a recipe has all required fields
   */
  static isValid(recipe: any): recipe is Recipe {
    return (
      typeof recipe === 'object' &&
      recipe !== null &&
      typeof recipe.name === 'string' &&
      typeof recipe.output === 'string' &&
      Array.isArray(recipe.ingredients) &&
      Array.isArray(recipe.effects)
    )
  }

  /**
   * Check if two recipes are equal by name
   */
  static equals(recipe1: Recipe, recipe2: Recipe): boolean {
    return recipe1.name === recipe2.name
  }

  /**
   * Add computed properties to a recipe
   */
  static addComputedProperties(recipe: Recipe): RecipeWithComputed {
    const hasEffects = recipe.effects.length > 0
    const effectCount = recipe.effects.length
    const ingredientCount = recipe.ingredients.length
    const isComplex = ingredientCount > 3 || effectCount > 2
    const isSimple = ingredientCount <= 2 && effectCount <= 1
    
    const totalMagnitude = recipe.effects.reduce((sum, effect) => sum + effect.magnitude, 0)
    const maxDuration = Math.max(...recipe.effects.map(effect => effect.duration), 0)

    // Determine difficulty based on complexity
    const difficulty = this.determineDifficulty(recipe, {
      ingredientCount,
      effectCount,
      isComplex,
      isSimple
    })

    // Generate tags based on recipe properties
    const tags = this.generateTags(recipe, {
      hasEffects,
      effectCount,
      ingredientCount,
      isComplex,
      isSimple,
      difficulty
    })

    // Create searchable text for fuzzy search
    const searchableText = this.createSearchableText(recipe, tags)

    return {
      ...recipe,
      hasEffects,
      effectCount,
      ingredientCount,
      isComplex,
      isSimple,
      totalMagnitude,
      maxDuration,
      tags,
      searchableText,
      difficulty
    }
  }

  /**
   * Determine recipe difficulty based on complexity
   */
  private static determineDifficulty(recipe: Recipe, computed: {
    ingredientCount: number
    effectCount: number
    isComplex: boolean
    isSimple: boolean
  }): 'Simple' | 'Moderate' | 'Complex' {
    if (computed.isSimple) return 'Simple'
    if (computed.isComplex) return 'Complex'
    return 'Moderate'
  }

  /**
   * Generate tags for a recipe based on its properties
   */
  private static generateTags(recipe: Recipe, computed: {
    hasEffects: boolean
    effectCount: number
    ingredientCount: number
    isComplex: boolean
    isSimple: boolean
    difficulty: 'Simple' | 'Moderate' | 'Complex'
  }): string[] {
    const tags: string[] = []

    // Category tags
    if (recipe.category) {
      tags.push(recipe.category)
    }

    // Difficulty tags
    tags.push(computed.difficulty)

    // Effect type tags
    if (computed.hasEffects) {
      tags.push('Has Effects')
    }

    // Ingredient count tags
    if (computed.ingredientCount === 1) {
      tags.push('Single Ingredient')
    } else if (computed.ingredientCount <= 3) {
      tags.push('Few Ingredients')
    } else {
      tags.push('Many Ingredients')
    }

    // Effect count tags
    if (computed.effectCount === 1) {
      tags.push('Single Effect')
    } else if (computed.effectCount <= 2) {
      tags.push('Few Effects')
    } else {
      tags.push('Many Effects')
    }

    // Add effect names as tags
    recipe.effects.forEach(effect => {
      tags.push(effect.name)
    })

    // Add ingredient names as tags
    recipe.ingredients.forEach(ingredient => {
      tags.push(ingredient)
    })

    return [...new Set(tags)] // Remove duplicates
  }

  /**
   * Create searchable text for fuzzy search
   */
  private static createSearchableText(recipe: Recipe, tags: string[]): string {
    const ingredientNames = recipe.ingredients.map(ingredient => {
      if (typeof ingredient === 'string') {
        return ingredient
      }
      if (ingredient && typeof ingredient === 'object') {
        return ingredient.item || ingredient.name || ingredient.label || ingredient.id || String(ingredient)
      }
      return String(ingredient)
    })

    const parts = [
      recipe.name,
      recipe.output,
      recipe.description || '',
      ...ingredientNames,
      ...recipe.effects.map(effect => effect.name),
      ...recipe.effects.map(effect => effect.description),
      ...tags
    ]

    return parts.join(' ').toLowerCase()
  }

  /**
   * Filter recipes by category
   */
  static filterByCategory(recipes: RecipeWithComputed[], category: string): RecipeWithComputed[] {
    return recipes.filter(recipe => recipe.category === category)
  }

  /**
   * Filter recipes by categories
   */
  static filterByCategories(recipes: RecipeWithComputed[], categories: string[]): RecipeWithComputed[] {
    if (categories.length === 0) return recipes
    return recipes.filter(recipe => recipe.category && categories.includes(recipe.category))
  }

  /**
   * Filter recipes by difficulty
   */
  static filterByDifficulty(recipes: RecipeWithComputed[], difficulty: string): RecipeWithComputed[] {
    return recipes.filter(recipe => recipe.difficulty === difficulty)
  }

  /**
   * Filter recipes by difficulties
   */
  static filterByDifficulties(recipes: RecipeWithComputed[], difficulties: string[]): RecipeWithComputed[] {
    if (difficulties.length === 0) return recipes
    return recipes.filter(recipe => difficulties.includes(recipe.difficulty))
  }

  /**
   * Filter recipes by ingredient count
   */
  static filterByIngredientCount(
    recipes: RecipeWithComputed[], 
    minCount: number | null, 
    maxCount: number | null
  ): RecipeWithComputed[] {
    return recipes.filter(recipe => {
      const count = recipe.ingredientCount
      if (minCount !== null && count < minCount) return false
      if (maxCount !== null && count > maxCount) return false
      return true
    })
  }

  /**
   * Filter recipes by magnitude
   */
  static filterByMagnitude(
    recipes: RecipeWithComputed[], 
    minMagnitude: number | null, 
    maxMagnitude: number | null
  ): RecipeWithComputed[] {
    return recipes.filter(recipe => {
      const magnitude = recipe.totalMagnitude
      if (minMagnitude !== null && magnitude < minMagnitude) return false
      if (maxMagnitude !== null && magnitude > maxMagnitude) return false
      return true
    })
  }

  /**
   * Filter recipes by effect properties
   */
  static filterByEffectProperties(
    recipes: RecipeWithComputed[],
    hasEffects: boolean | null,
    isComplex: boolean | null
  ): RecipeWithComputed[] {
    return recipes.filter(recipe => {
      if (hasEffects !== null && recipe.hasEffects !== hasEffects) return false
      if (isComplex !== null && recipe.isComplex !== isComplex) return false
      return true
    })
  }

  /**
   * Filter recipes by ingredients
   */
  static filterByIngredients(recipes: RecipeWithComputed[], ingredients: string[]): RecipeWithComputed[] {
    if (ingredients.length === 0) return recipes
    return recipes.filter(recipe => 
      ingredients.some(ingredient => 
        recipe.ingredients.some(recipeIngredient => {
          const ingredientName = typeof recipeIngredient === 'string' 
            ? recipeIngredient 
            : (recipeIngredient.item || recipeIngredient.name || recipeIngredient.label || recipeIngredient.id || String(recipeIngredient))
          return ingredientName.toLowerCase().includes(ingredient.toLowerCase())
        })
      )
    )
  }

  /**
   * Filter recipes by effects
   */
  static filterByEffects(recipes: RecipeWithComputed[], effects: string[]): RecipeWithComputed[] {
    if (effects.length === 0) return recipes
    return recipes.filter(recipe => 
      effects.some(effect => 
        recipe.effects.some(recipeEffect => 
          recipeEffect.name.toLowerCase().includes(effect.toLowerCase())
        )
      )
    )
  }

  /**
   * Search recipes using fuzzy search
   */
  static search(recipes: RecipeWithComputed[], query: string): RecipeSearchResult[] {
    if (!query.trim()) return []

    const searchTerm = query.toLowerCase().trim()
    const results: RecipeSearchResult[] = []

    for (const recipe of recipes) {
      const score = this.calculateSearchScore(recipe, searchTerm)
      if (score > 0) {
        const matchedFields = this.getMatchedFields(recipe, searchTerm)
        results.push({
          recipe,
          score,
          matchedFields
        })
      }
    }

    // Sort by score (highest first)
    return results.sort((a, b) => b.score - a.score)
  }

  /**
   * Calculate search score for a recipe
   */
  private static calculateSearchScore(recipe: RecipeWithComputed, searchTerm: string): number {
    let score = 0
    const term = searchTerm.toLowerCase()

    // Exact matches get highest score
    if (recipe.name.toLowerCase() === term) score += 100
    if (recipe.output.toLowerCase() === term) score += 100

    // Partial matches in name and output
    if (recipe.name.toLowerCase().includes(term)) score += 50
    if (recipe.output.toLowerCase().includes(term)) score += 50

    // Matches in description
    if (recipe.description?.toLowerCase().includes(term)) score += 30

    // Matches in ingredients
    recipe.ingredients.forEach(ingredient => {
      const ingredientName = typeof ingredient === 'string' 
        ? ingredient 
        : (ingredient.item || ingredient.name || ingredient.label || ingredient.id || String(ingredient))
      if (ingredientName.toLowerCase() === term) score += 40
      if (ingredientName.toLowerCase().includes(term)) score += 20
    })

    // Matches in effects
    recipe.effects.forEach(effect => {
      if (effect.name.toLowerCase() === term) score += 40
      if (effect.name.toLowerCase().includes(term)) score += 20
      if (effect.description.toLowerCase().includes(term)) score += 15
    })

    // Matches in tags
    recipe.tags.forEach(tag => {
      if (tag.toLowerCase() === term) score += 25
      if (tag.toLowerCase().includes(term)) score += 10
    })

    return score
  }

  /**
   * Get matched fields for search result
   */
  private static getMatchedFields(recipe: RecipeWithComputed, searchTerm: string): string[] {
    const matchedFields: string[] = []
    const term = searchTerm.toLowerCase()

    if (recipe.name.toLowerCase().includes(term)) matchedFields.push('name')
    if (recipe.output.toLowerCase().includes(term)) matchedFields.push('output')
    if (recipe.description?.toLowerCase().includes(term)) matchedFields.push('description')
    
    recipe.ingredients.forEach(ingredient => {
      const ingredientName = typeof ingredient === 'string' 
        ? ingredient 
        : (ingredient.item || ingredient.name || ingredient.label || ingredient.id || String(ingredient))
      if (ingredientName.toLowerCase().includes(term)) matchedFields.push('ingredients')
    })
    
    recipe.effects.forEach(effect => {
      if (effect.name.toLowerCase().includes(term) || effect.description.toLowerCase().includes(term)) {
        matchedFields.push('effects')
      }
    })

    return [...new Set(matchedFields)]
  }

  /**
   * Sort recipes by various criteria
   */
  static sort(
    recipes: RecipeWithComputed[], 
    sortBy: 'name' | 'category' | 'difficulty' | 'ingredientCount' | 'effectCount' | 'magnitude' | 'duration',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): RecipeWithComputed[] {
    const sorted = [...recipes].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'category':
          comparison = (a.category || '').localeCompare(b.category || '')
          break
        case 'difficulty':
          comparison = this.compareDifficulties(a.difficulty, b.difficulty)
          break
        case 'ingredientCount':
          comparison = a.ingredientCount - b.ingredientCount
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
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return sorted
  }

  /**
   * Compare difficulties for sorting
   */
  private static compareDifficulties(difficulty1: string, difficulty2: string): number {
    const order = { 'Simple': 1, 'Moderate': 2, 'Complex': 3 }
    return (order[difficulty1 as keyof typeof order] || 0) - (order[difficulty2 as keyof typeof order] || 0)
  }

  /**
   * Get unique categories from recipes
   */
  static getUniqueCategories(recipes: RecipeWithComputed[]): string[] {
    const categories = recipes
      .map(recipe => recipe.category)
      .filter((category): category is string => !!category)
    
    return [...new Set(categories)].sort()
  }

  /**
   * Get unique difficulties from recipes
   */
  static getUniqueDifficulties(recipes: RecipeWithComputed[]): string[] {
    const difficulties = recipes.map(recipe => recipe.difficulty)
    return [...new Set(difficulties)].sort((a, b) => this.compareDifficulties(a, b))
  }

  /**
   * Get unique effects from recipes
   */
  static getUniqueEffects(recipes: RecipeWithComputed[]): string[] {
    const effects = recipes.flatMap(recipe => recipe.effects.map(effect => effect.name))
    return [...new Set(effects)].sort()
  }

  /**
   * Get unique ingredients from recipes
   */
  static getUniqueIngredients(recipes: RecipeWithComputed[]): string[] {
    const ingredientNames = recipes.flatMap(recipe => 
      recipe.ingredients.map(ingredient => {
        if (typeof ingredient === 'string') {
          return ingredient
        }
        if (ingredient && typeof ingredient === 'object') {
          return ingredient.item || ingredient.name || ingredient.label || ingredient.id || String(ingredient)
        }
        return String(ingredient)
      })
    )
    return [...new Set(ingredientNames)].filter(name => name && name !== '[object Object]').sort()
  }

  /**
   * Get unique tags from recipes
   */
  static getUniqueTags(recipes: RecipeWithComputed[]): string[] {
    const tags = recipes.flatMap(recipe => recipe.tags)
    return [...new Set(tags)].sort()
  }

  /**
   * Apply filters to recipes
   */
  static applyFilters(recipes: RecipeWithComputed[], filters: RecipeFilters): RecipeWithComputed[] {
    let filtered = [...recipes]

    // Apply search term
    if (filters.searchTerm.trim()) {
      const searchResults = this.search(filtered, filters.searchTerm)
      filtered = searchResults.map(result => result.recipe)
    }

    // Apply category filters
    if (filters.categories.length > 0) {
      filtered = this.filterByCategories(filtered, filters.categories)
    }

    // Apply difficulty filters
    if (filters.difficulties.length > 0) {
      filtered = this.filterByDifficulties(filtered, filters.difficulties)
    }

    // Apply ingredient filters
    if (filters.ingredients.length > 0) {
      filtered = this.filterByIngredients(filtered, filters.ingredients)
    }

    // Apply effect filters
    if (filters.effects.length > 0) {
      filtered = this.filterByEffects(filtered, filters.effects)
    }

    // Apply effect property filters
    filtered = this.filterByEffectProperties(
      filtered,
      filters.hasEffects,
      filters.isComplex
    )

    // Apply ingredient count filters
    filtered = this.filterByIngredientCount(
      filtered,
      filters.minIngredientCount,
      filters.maxIngredientCount
    )

    // Apply magnitude filters
    filtered = this.filterByMagnitude(
      filtered,
      filters.minMagnitude,
      filters.maxMagnitude
    )

    return filtered
  }

  /**
   * Get statistics for recipes
   */
  static getStatistics(recipes: RecipeWithComputed[]): RecipeStatistics {
    const totalRecipes = recipes.length

    // Food and alcohol recipe counts
    const foodRecipes = recipes.filter(recipe => recipe.type === 'food').length
    const alcoholRecipes = recipes.filter(recipe => recipe.type === 'alcohol').length

    // Recipes by category
    const recipesByCategory: Record<string, number> = {}
    recipes.forEach(recipe => {
      if (recipe.category) {
        recipesByCategory[recipe.category] = (recipesByCategory[recipe.category] || 0) + 1
      }
    })

    // Recipes by difficulty
    const recipesByDifficulty: Record<string, number> = {}
    recipes.forEach(recipe => {
      recipesByDifficulty[recipe.difficulty] = (recipesByDifficulty[recipe.difficulty] || 0) + 1
    })

    // Recipes by effect
    const recipesByEffect: Record<string, number> = {}
    recipes.forEach(recipe => {
      recipe.effects.forEach(effect => {
        recipesByEffect[effect.name] = (recipesByEffect[effect.name] || 0) + 1
      })
    })

    // Average ingredient and effect counts
    const totalIngredients = recipes.reduce((sum, recipe) => sum + recipe.ingredientCount, 0)
    const totalEffects = recipes.reduce((sum, recipe) => sum + recipe.effectCount, 0)
    const averageIngredientCount = totalRecipes > 0 ? totalIngredients / totalRecipes : 0
    const averageEffectCount = totalRecipes > 0 ? totalEffects / totalRecipes : 0

    // Average magnitude and duration
    const totalMagnitude = recipes.reduce((sum, recipe) => sum + recipe.totalMagnitude, 0)
    const totalDuration = recipes.reduce((sum, recipe) => sum + recipe.maxDuration, 0)
    const averageMagnitude = totalRecipes > 0 ? totalMagnitude / totalRecipes : 0
    const averageDuration = totalRecipes > 0 ? totalDuration / totalRecipes : 0

    // Top ingredients
    const ingredientCounts: Record<string, number> = {}
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        ingredientCounts[ingredient] = (ingredientCounts[ingredient] || 0) + 1
      })
    })
    const topIngredients = Object.entries(ingredientCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Top effects
    const effectCounts: Record<string, number> = {}
    recipes.forEach(recipe => {
      recipe.effects.forEach(effect => {
        effectCounts[effect.name] = (effectCounts[effect.name] || 0) + 1
      })
    })
    const topEffects = Object.entries(effectCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      totalRecipes,
      foodRecipes,
      alcoholRecipes,
      recipesByCategory,
      recipesByDifficulty,
      recipesByEffect,
      averageIngredientCount,
      averageEffectCount,
      averageMagnitude,
      averageDuration,
      topEffects,
      topIngredients
    }
  }
} 