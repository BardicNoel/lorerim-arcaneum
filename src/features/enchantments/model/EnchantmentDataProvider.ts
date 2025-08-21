import type { 
  Enchantment, 
  EnchantmentWithComputed, 
  EnchantmentCategory, 
  EnchantmentPrimerData,
  EnchantmentDataResponse 
} from '../types'
import { EnchantmentModel } from './EnchantmentModel'
import { getDataUrl } from '@/shared/utils/baseUrl'

export class EnchantmentDataProvider {
  private static instance: EnchantmentDataProvider
  private cache: EnchantmentWithComputed[] | null = null
  private lastFetch: number = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  private constructor() {}

  static getInstance(): EnchantmentDataProvider {
    if (!EnchantmentDataProvider.instance) {
      EnchantmentDataProvider.instance = new EnchantmentDataProvider()
    }
    return EnchantmentDataProvider.instance
  }

  /**
   * Load enchantment data from the JSON file
   */
  async loadEnchantments(): Promise<EnchantmentWithComputed[]> {
    // Check cache first
    if (this.cache && Date.now() - this.lastFetch < this.CACHE_DURATION) {
      return this.cache
    }

    try {
      const dataUrl = getDataUrl('data/enchantment-primer.json')
      
      const response = await fetch(dataUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch enchantments: ${response.status} ${response.statusText}`)
      }

      const rawData: EnchantmentPrimerData = await response.json()
      
      // Validate and transform the data
      const enchantments: EnchantmentWithComputed[] = []
      let validCount = 0
      let invalidCount = 0
      
      for (const category of rawData.categories) {
        for (const enchantment of category.enchantments) {
          if (EnchantmentModel.isValid(enchantment)) {
            const enchantmentWithComputed = EnchantmentModel.addComputedProperties(enchantment, category.name)
            enchantments.push(enchantmentWithComputed)
            validCount++
          } else {
            console.warn('EnchantmentDataProvider: Invalid enchantment data:', enchantment)
            invalidCount++
          }
        }
      }

      // Update cache
      this.cache = enchantments
      this.lastFetch = Date.now()

      console.log(`EnchantmentDataProvider: Loaded ${validCount} valid enchantments, ${invalidCount} invalid`)
      return enchantments
    } catch (error) {
      console.error('EnchantmentDataProvider: Error loading enchantments:', error)
      throw error
    }
  }

  /**
   * Get enchantment data with statistics
   */
  async getEnchantmentData(): Promise<EnchantmentDataResponse> {
    console.log('EnchantmentDataProvider: getEnchantmentData called')
    const enchantments = await this.loadEnchantments()
    console.log('EnchantmentDataProvider: Getting statistics for', enchantments.length, 'enchantments')
    const stats = EnchantmentModel.getStatistics(enchantments)
    
    const result = {
      enchantments,
      totalCount: stats.totalEnchantments,
      categoryNames: stats.categories,
      targetTypes: stats.targetTypes,
      plugins: stats.plugins,
      lastUpdated: new Date().toISOString()
    }
    
    console.log('EnchantmentDataProvider: getEnchantmentData result:', {
      enchantmentsCount: result.enchantments.length,
      totalCount: result.totalCount,
      categories: result.categoryNames,
      targetTypes: result.targetTypes,
      plugins: result.plugins
    })
    
    return result
  }

  /**
   * Get a specific enchantment by baseEnchantmentId
   */
  async getEnchantmentByBaseId(baseEnchantmentId: string): Promise<EnchantmentWithComputed | null> {
    const enchantments = await this.loadEnchantments()
    return enchantments.find(enchantment => enchantment.baseEnchantmentId === baseEnchantmentId) || null
  }

  /**
   * Get enchantments by category
   */
  async getEnchantmentsByCategory(categoryName: string): Promise<EnchantmentWithComputed[]> {
    const enchantments = await this.loadEnchantments()
    return enchantments.filter(enchantment => enchantment.category === categoryName)
  }

  /**
   * Get enchantments by target type
   */
  async getEnchantmentsByTargetType(targetType: string): Promise<EnchantmentWithComputed[]> {
    const enchantments = await this.loadEnchantments()
    return enchantments.filter(enchantment => enchantment.targetType === targetType)
  }

  /**
   * Get enchantments by plugin
   */
  async getEnchantmentsByPlugin(plugin: string): Promise<EnchantmentWithComputed[]> {
    const enchantments = await this.loadEnchantments()
    return enchantments.filter(enchantment => enchantment.plugin === plugin)
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache = null
    this.lastFetch = 0
  }

  /**
   * Get cache status
   */
  getCacheStatus(): { hasCache: boolean; age: number } {
    return {
      hasCache: this.cache !== null,
      age: this.cache ? Date.now() - this.lastFetch : 0
    }
  }
}
