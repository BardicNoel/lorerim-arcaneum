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
    // Check cache first
    if (this.cache && Date.now() - this.lastFetch < this.CACHE_DURATION) {
      return this.cache
    }

    try {
      const response = await fetch(getDataUrl('data/player_spells.json'))
      if (!response.ok) {
        throw new Error(`Failed to fetch spells: ${response.status} ${response.statusText}`)
      }

      const rawData = await response.json()
      
      // Validate and transform the data
      const spells: SpellWithComputed[] = []
      
      for (const item of rawData) {
        if (SpellModel.isValid(item)) {
          const spellWithComputed = SpellModel.addComputedProperties(item)
          spells.push(spellWithComputed)
        } else {
          console.warn('Invalid spell data:', item)
        }
      }

      // Update cache
      this.cache = spells
      this.lastFetch = Date.now()

      return spells
    } catch (error) {
      console.error('Error loading spells:', error)
      throw error
    }
  }

  /**
   * Get spell data with statistics
   */
  async getSpellData(): Promise<SpellDataResponse> {
    const spells = await this.loadSpells()
    const stats = SpellModel.getStatistics(spells)
    
    return {
      spells,
      totalCount: stats.totalSpells,
      schools: stats.schools,
      levels: stats.levels,
      lastUpdated: new Date().toISOString()
    }
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
   * Search spells
   */
  async searchSpells(query: string): Promise<SpellWithComputed[]> {
    const spells = await this.loadSpells()
    const searchResults = SpellModel.search(spells, query)
    return searchResults.map(result => result.spell)
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
   * Get cache info
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