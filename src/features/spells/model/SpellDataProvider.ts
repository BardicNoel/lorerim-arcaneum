import type { Spell, SpellWithComputed, SpellDataResponse } from '../types'
import { SpellModel } from './SpellModel'
import { getDataUrl } from '@/shared/utils/baseUrl'

export class SpellDataProvider {
  private static instance: SpellDataProvider
  private cache: SpellWithComputed[] | null = null
  private lastFetch: number = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  private constructor() {}

  static getInstance(): SpellDataProvider {
    if (!SpellDataProvider.instance) {
      SpellDataProvider.instance = new SpellDataProvider()
    }
    return SpellDataProvider.instance
  }

  /**
   * Load spell data from the JSON file
   */
  async loadSpells(): Promise<SpellWithComputed[]> {
    console.log('SpellDataProvider: loadSpells called')
    
    // Check cache first
    if (this.cache && Date.now() - this.lastFetch < this.CACHE_DURATION) {
      console.log('SpellDataProvider: Returning cached data, count:', this.cache.length)
      return this.cache
    }

    try {
      const dataUrl = getDataUrl('data/player_spells.json')
      console.log('SpellDataProvider: Fetching from URL:', dataUrl)
      
      const response = await fetch(dataUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch spells: ${response.status} ${response.statusText}`)
      }

      const rawData = await response.json()
      console.log('SpellDataProvider: Raw data loaded, count:', rawData.length)
      
      // Validate and transform the data
      const spells: SpellWithComputed[] = []
      let validCount = 0
      let invalidCount = 0
      
      for (const item of rawData) {
        if (SpellModel.isValid(item)) {
          const spellWithComputed = SpellModel.addComputedProperties(item)
          spells.push(spellWithComputed)
          validCount++
        } else {
          console.warn('SpellDataProvider: Invalid spell data:', item)
          invalidCount++
        }
      }

      console.log('SpellDataProvider: Data processing complete:', {
        total: rawData.length,
        valid: validCount,
        invalid: invalidCount,
        processed: spells.length
      })

      // Update cache
      this.cache = spells
      this.lastFetch = Date.now()

      return spells
    } catch (error) {
      console.error('SpellDataProvider: Error loading spells:', error)
      throw error
    }
  }

  /**
   * Get spell data with statistics
   */
  async getSpellData(): Promise<SpellDataResponse> {
    console.log('SpellDataProvider: getSpellData called')
    const spells = await this.loadSpells()
    console.log('SpellDataProvider: Getting statistics for', spells.length, 'spells')
    const stats = SpellModel.getStatistics(spells)
    
    const result = {
      spells,
      totalCount: stats.totalSpells,
      schools: stats.schools,
      levels: stats.levels,
      lastUpdated: new Date().toISOString()
    }
    
    console.log('SpellDataProvider: getSpellData result:', {
      spellsCount: result.spells.length,
      totalCount: result.totalCount,
      schools: result.schools,
      levels: result.levels
    })
    
    return result
  }

  /**
   * Get a specific spell by editorId
   */
  async getSpellByEditorId(editorId: string): Promise<SpellWithComputed | null> {
    const spells = await this.loadSpells()
    return spells.find(spell => spell.editorId === editorId) || null
  }

  /**
   * Get spells by school
   */
  async getSpellsBySchool(school: string): Promise<SpellWithComputed[]> {
    const spells = await this.loadSpells()
    return SpellModel.filterBySchool(spells, school)
  }

  /**
   * Get spells by level
   */
  async getSpellsByLevel(level: string): Promise<SpellWithComputed[]> {
    const spells = await this.loadSpells()
    return SpellModel.filterByLevel(spells, level)
  }

  /**
   * Search spells by query
   */
  async searchSpells(query: string): Promise<SpellWithComputed[]> {
    const spells = await this.loadSpells()
    const results = SpellModel.search(spells, query)
    return results.map(result => result.spell)
  }

  /**
   * Get spell statistics
   */
  async getStatistics() {
    const spells = await this.loadSpells()
    return SpellModel.getStatistics(spells)
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    console.log('SpellDataProvider: Clearing cache')
    this.cache = null
    this.lastFetch = 0
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
      isValid: this.isCacheValid()
    }
  }
} 