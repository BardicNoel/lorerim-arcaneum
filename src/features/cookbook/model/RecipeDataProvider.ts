import type { Recipe, RecipeWithComputed, RecipeDataResponse } from '../types'
import { RecipeModel } from './RecipeModel'
import { getDataUrl } from '@/shared/utils/baseUrl'

export class RecipeDataProvider {
  private static instance: RecipeDataProvider
  private cache: RecipeWithComputed[] | null = null
  private lastFetch: number = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  private constructor() {}

  static getInstance(): RecipeDataProvider {
    if (!RecipeDataProvider.instance) {
      RecipeDataProvider.instance = new RecipeDataProvider()
    }
    return RecipeDataProvider.instance
  }

  /**
   * Load recipe data from the JSON file
   */
  async loadRecipes(): Promise<RecipeWithComputed[]> {
    // Check cache first
    if (this.cache && Date.now() - this.lastFetch < this.CACHE_DURATION) {
      return this.cache
    }

    try {
      const dataUrl = getDataUrl('data/cookbook-wiki.json')
      
      const response = await fetch(dataUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch recipes: ${response.status} ${response.statusText}`)
      }

      const rawData = await response.json()
      
      // Extract recipes from both food and alcohol sections, skip dev
      // Expected structure: { "food": {...}, "alcohol": {...}, "dev": {...} }
      const allRecipes: any[] = []
      
      console.log('RecipeDataProvider: Raw data keys:', Object.keys(rawData))
      
      // Add food recipes if they exist
      if (rawData.food && Array.isArray(rawData.food)) {
        console.log('RecipeDataProvider: Found', rawData.food.length, 'food recipes')
        allRecipes.push(...rawData.food)
      } else if (rawData.food && typeof rawData.food === 'object') {
        console.log('RecipeDataProvider: Food section is an object, checking for recipes property')
        if (rawData.food.recipes && Array.isArray(rawData.food.recipes)) {
          console.log('RecipeDataProvider: Found', rawData.food.recipes.length, 'food recipes in recipes property')
          allRecipes.push(...rawData.food.recipes)
        }
      }
      
      // Add alcohol recipes if they exist
      if (rawData.alcohol && Array.isArray(rawData.alcohol)) {
        console.log('RecipeDataProvider: Found', rawData.alcohol.length, 'alcohol recipes')
        allRecipes.push(...rawData.alcohol)
      } else if (rawData.alcohol && typeof rawData.alcohol === 'object') {
        console.log('RecipeDataProvider: Alcohol section is an object, checking for recipes property')
        if (rawData.alcohol.recipes && Array.isArray(rawData.alcohol.recipes)) {
          console.log('RecipeDataProvider: Found', rawData.alcohol.recipes.length, 'alcohol recipes in recipes property')
          allRecipes.push(...rawData.alcohol.recipes)
        }
      }
      
      // If no recipes found in expected structure, try fallback
      if (allRecipes.length === 0) {
        console.log('RecipeDataProvider: No recipes found in food/alcohol sections, trying fallback')
        const fallbackData = rawData.food?.recipes || rawData.recipes || rawData
        if (Array.isArray(fallbackData)) {
          console.log('RecipeDataProvider: Found', fallbackData.length, 'recipes in fallback data')
          allRecipes.push(...fallbackData)
        }
      }
      
      // Ensure we have an array to iterate over
      if (!Array.isArray(allRecipes) || allRecipes.length === 0) {
        throw new Error('RecipeDataProvider: No valid recipes found in data structure')
      }
      
      // Validate and transform the data
      const recipes: RecipeWithComputed[] = []
      let validCount = 0
      let invalidCount = 0
      
      for (const item of allRecipes) {
        if (RecipeModel.isValid(item)) {
          const recipeWithComputed = RecipeModel.addComputedProperties(item)
          recipes.push(recipeWithComputed)
          validCount++
        } else {
          console.warn('RecipeDataProvider: Invalid recipe data:', item)
          invalidCount++
        }
      }

      // Update cache
      this.cache = recipes
      this.lastFetch = Date.now()

      console.log(`RecipeDataProvider: Loaded ${validCount} valid recipes, ${invalidCount} invalid recipes`)

      return recipes
    } catch (error) {
      console.error('RecipeDataProvider: Error loading recipes:', error)
      throw error
    }
  }

  /**
   * Get recipe data with statistics
   */
  async getRecipeData(): Promise<RecipeDataResponse> {
    console.log('RecipeDataProvider: getRecipeData called')
    const recipes = await this.loadRecipes()
    console.log('RecipeDataProvider: Getting statistics for', recipes.length, 'recipes')
    const stats = RecipeModel.getStatistics(recipes)
    
    const result = {
      recipes,
      totalCount: stats.totalRecipes,
      categories: RecipeModel.getUniqueCategories(recipes),
      effects: RecipeModel.getUniqueEffects(recipes),
      ingredients: RecipeModel.getUniqueIngredients(recipes),
      lastUpdated: new Date().toISOString()
    }
    
    console.log('RecipeDataProvider: getRecipeData result:', {
      recipesCount: result.recipes.length,
      totalCount: result.totalCount,
      categories: result.categories,
      effects: result.effects,
      ingredients: result.ingredients
    })
    
    return result
  }

  /**
   * Get a specific recipe by name
   */
  async getRecipeByName(name: string): Promise<RecipeWithComputed | null> {
    const recipes = await this.loadRecipes()
    return recipes.find(recipe => recipe.name === name) || null
  }

  /**
   * Get recipes by category
   */
  async getRecipesByCategory(category: string): Promise<RecipeWithComputed[]> {
    const recipes = await this.loadRecipes()
    return RecipeModel.filterByCategory(recipes, category)
  }

  /**
   * Get recipes by difficulty
   */
  async getRecipesByDifficulty(difficulty: string): Promise<RecipeWithComputed[]> {
    const recipes = await this.loadRecipes()
    return RecipeModel.filterByDifficulty(recipes, difficulty)
  }

  /**
   * Get recipes by ingredient
   */
  async getRecipesByIngredient(ingredient: string): Promise<RecipeWithComputed[]> {
    const recipes = await this.loadRecipes()
    return RecipeModel.filterByIngredients(recipes, [ingredient])
  }

  /**
   * Get recipes by effect
   */
  async getRecipesByEffect(effect: string): Promise<RecipeWithComputed[]> {
    const recipes = await this.loadRecipes()
    return RecipeModel.filterByEffects(recipes, [effect])
  }

  /**
   * Search recipes
   */
  async searchRecipes(query: string): Promise<RecipeWithComputed[]> {
    const recipes = await this.loadRecipes()
    const searchResults = RecipeModel.search(recipes, query)
    return searchResults.map(result => result.recipe)
  }

  /**
   * Get recipe statistics
   */
  async getStatistics() {
    const recipes = await this.loadRecipes()
    return RecipeModel.getStatistics(recipes)
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache = null
    this.lastFetch = 0
    console.log('RecipeDataProvider: Cache cleared')
  }

  /**
   * Check if cache is valid
   */
  isCacheValid(): boolean {
    return this.cache !== null && Date.now() - this.lastFetch < this.CACHE_DURATION
  }

  /**
   * Get cache information
   */
  getCacheInfo() {
    return {
      hasCache: this.cache !== null,
      cacheSize: this.cache?.length || 0,
      lastFetch: this.lastFetch,
      isExpired: this.cache !== null && Date.now() - this.lastFetch >= this.CACHE_DURATION,
      timeUntilExpiry: this.cache 
        ? Math.max(0, this.CACHE_DURATION - (Date.now() - this.lastFetch))
        : 0
    }
  }
} 