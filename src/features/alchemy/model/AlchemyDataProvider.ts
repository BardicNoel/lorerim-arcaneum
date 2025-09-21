import { getDataUrl } from '@/shared/utils/baseUrl'
import type {
  AlchemyDataResponse,
  AlchemyIngredientWithComputed,
} from '../types'
import { AlchemyIngredientModel } from './AlchemyIngredientModel'

export class AlchemyDataProvider {
  private static instance: AlchemyDataProvider
  private cache: AlchemyIngredientWithComputed[] | null = null
  private lastFetch: number = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  private constructor() {}

  static getInstance(): AlchemyDataProvider {
    if (!AlchemyDataProvider.instance) {
      AlchemyDataProvider.instance = new AlchemyDataProvider()
    }
    return AlchemyDataProvider.instance
  }

  /**
   * Load alchemy ingredient data from the JSON file
   */
  async loadIngredients(): Promise<AlchemyIngredientWithComputed[]> {
    // Check cache first
    if (this.cache && Date.now() - this.lastFetch < this.CACHE_DURATION) {
      return this.cache
    }

    try {
      const dataUrl = getDataUrl('data/alchemy-ingredients.json')

      const response = await fetch(dataUrl)
      if (!response.ok) {
        throw new Error(
          `Failed to fetch alchemy ingredients: ${response.status} ${response.statusText}`
        )
      }

      const rawData = await response.json()

      // Ensure we have an array to iterate over
      if (!Array.isArray(rawData) || rawData.length === 0) {
        throw new Error(
          'AlchemyDataProvider: No valid ingredients found in data structure'
        )
      }

      // Validate and transform the data
      const ingredients: AlchemyIngredientWithComputed[] = []
      let validCount = 0
      let invalidCount = 0

      for (const item of rawData) {
        if (AlchemyIngredientModel.isValid(item)) {
          const ingredientWithComputed =
            AlchemyIngredientModel.addComputedProperties(item)
          ingredients.push(ingredientWithComputed)
          validCount++
        } else {
          console.warn('AlchemyDataProvider: Invalid ingredient data:', item)
          invalidCount++
        }
      }

      console.log(
        `AlchemyDataProvider: Loaded ${validCount} valid ingredients, ${invalidCount} invalid items`
      )

      // Update cache
      this.cache = ingredients
      this.lastFetch = Date.now()

      return ingredients
    } catch (error) {
      console.error('AlchemyDataProvider: Error loading ingredients:', error)
      throw error
    }
  }

  /**
   * Get ingredient data with statistics
   */
  async getIngredientData(): Promise<AlchemyDataResponse> {
    const ingredients = await this.loadIngredients()
    const stats = AlchemyIngredientModel.getStatistics(ingredients)

    const result = {
      ingredients,
      totalCount: stats.totalIngredients,
      effectTypes: AlchemyIngredientModel.getUniqueEffectTypes(ingredients),
      effects: AlchemyIngredientModel.getUniqueEffects(ingredients),
      skills: AlchemyIngredientModel.getUniqueSkills(ingredients),
      plugins: AlchemyIngredientModel.getUniquePlugins(ingredients),
      lastUpdated: new Date().toISOString(),
    }

    return result
  }

  /**
   * Get a specific ingredient by name
   */
  async getIngredientByName(
    name: string
  ): Promise<AlchemyIngredientWithComputed | null> {
    const ingredients = await this.loadIngredients()
    return ingredients.find(ingredient => ingredient.name === name) || null
  }

  /**
   * Get ingredients by effect type
   */
  async getIngredientsByEffectType(
    effectType: string
  ): Promise<AlchemyIngredientWithComputed[]> {
    const ingredients = await this.loadIngredients()
    return AlchemyIngredientModel.filterByEffectType(ingredients, effectType)
  }

  /**
   * Get ingredients by skill
   */
  async getIngredientsBySkill(
    skill: string
  ): Promise<AlchemyIngredientWithComputed[]> {
    const ingredients = await this.loadIngredients()
    return AlchemyIngredientModel.filterBySkill(ingredients, skill)
  }

  /**
   * Get ingredients by plugin
   */
  async getIngredientsByPlugin(
    plugin: string
  ): Promise<AlchemyIngredientWithComputed[]> {
    const ingredients = await this.loadIngredients()
    return AlchemyIngredientModel.filterByPlugin(ingredients, plugin)
  }

  /**
   * Get ingredients by rarity
   */
  async getIngredientsByRarity(
    rarity: string
  ): Promise<AlchemyIngredientWithComputed[]> {
    const ingredients = await this.loadIngredients()
    return AlchemyIngredientModel.filterByRarity(ingredients, rarity)
  }

  /**
   * Get ingredients by effect
   */
  async getIngredientsByEffect(
    effect: string
  ): Promise<AlchemyIngredientWithComputed[]> {
    const ingredients = await this.loadIngredients()
    return AlchemyIngredientModel.filterByEffects(ingredients, [effect])
  }

  /**
   * Search ingredients
   */
  async searchIngredients(
    query: string
  ): Promise<AlchemyIngredientWithComputed[]> {
    const ingredients = await this.loadIngredients()
    const searchResults = AlchemyIngredientModel.search(ingredients, query)
    return searchResults.map(result => result.ingredient)
  }

  /**
   * Get ingredient statistics
   */
  async getStatistics() {
    const ingredients = await this.loadIngredients()
    return AlchemyIngredientModel.getStatistics(ingredients)
  }

  /**
   * Get meta analysis data
   */
  async getMetaAnalysis() {
    const ingredients = await this.loadIngredients()
    return AlchemyIngredientModel.getMetaAnalysis(ingredients)
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache = null
    this.lastFetch = 0
  }

  /**
   * Check if cache is valid
   */
  isCacheValid(): boolean {
    return (
      this.cache !== null && Date.now() - this.lastFetch < this.CACHE_DURATION
    )
  }

  /**
   * Get cache information
   */
  getCacheInfo() {
    return {
      hasCache: this.cache !== null,
      cacheSize: this.cache?.length || 0,
      lastFetch: this.lastFetch,
      isExpired:
        this.cache !== null &&
        Date.now() - this.lastFetch >= this.CACHE_DURATION,
      timeUntilExpiry: this.cache
        ? Math.max(0, this.CACHE_DURATION - (Date.now() - this.lastFetch))
        : 0,
    }
  }
}
