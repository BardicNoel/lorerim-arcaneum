import type { Race } from '../types'

// Raw data structure from JSON
interface RawRace {
  name: string
  edid: string
  category: 'Human' | 'Beast' | 'Elven'
  source: string
  description: string
  startingStats: {
    health: number
    magicka: number
    stamina: number
    carryWeight: number
  }
  physicalAttributes: {
    heightMale: number
    heightFemale: number
    weightMale: number
    weightFemale: number
    size: string
  }
  skillBonuses: Array<{
    skill: string
    bonus: number
  }>
  racialSpells: Array<{
    edid: string
    name: string
    description: string
    globalFormId: string
  }>
  keywords: Array<{
    edid: string
    globalFormId: string
  }>
  flags?: string[]
  regeneration: {
    health: {
      base: number
      multipliers?: Array<{ value: number; source: string }>
      adjustments?: Array<{ value: number; source: string }>
    }
    magicka: {
      base: number
      multipliers?: Array<{ value: number; source: string }>
      adjustments?: Array<{ value: number; source: string }>
    }
    stamina: {
      base: number
      multipliers?: Array<{ value: number; source: string }>
      adjustments?: Array<{ value: number; source: string }>
    }
  }
  combat: {
    unarmedDamage: number
    unarmedReach: number
  }
}

export class RaceDataProvider {
  private races: Race[] = []
  private loading = false
  private error: string | null = null
  private loaded = false

  /**
   * Load races from the JSON file
   */
  async loadRaces(): Promise<Race[]> {
    if (this.loaded && this.races.length > 0) {
      return this.races
    }

    try {
      this.loading = true
      this.error = null

      const res = await fetch(`${import.meta.env.BASE_URL}data/playable-races.json`)
      if (!res.ok) throw new Error('Failed to fetch race data')

      const responseData = await res.json()
      const rawData: RawRace[] = responseData.races || []

      // Transform the data to match our Race interface
      const transformedRaces: Race[] = rawData.map((race: RawRace) => ({
        name: race.name,
        edid: race.edid,
        category: race.category,
        source: race.source,
        description: race.description,
        startingStats: race.startingStats,
        physicalAttributes: race.physicalAttributes,
        skillBonuses: race.skillBonuses,
        racialSpells: race.racialSpells,
        keywords: race.keywords,
        flags: race.flags || [],
        regeneration: race.regeneration,
        combat: race.combat,
      }))

      this.races = transformedRaces
      this.loaded = true
      return this.races
    } catch (err) {
      this.error = 'Failed to load race data'
      console.error('Error loading race data:', err)
      throw new Error(this.error)
    } finally {
      this.loading = false
    }
  }

  /**
   * Get cached races (returns empty array if not loaded)
   */
  getRaces(): Race[] {
    return this.races
  }

  /**
   * Check if data is currently loading
   */
  isLoading(): boolean {
    return this.loading
  }

  /**
   * Get current error state
   */
  getError(): string | null {
    return this.error
  }

  /**
   * Check if data has been loaded
   */
  isLoaded(): boolean {
    return this.loaded
  }

  /**
   * Retry loading data
   */
  async retry(): Promise<Race[]> {
    this.loaded = false
    this.races = []
    return this.loadRaces()
  }

  /**
   * Clear cached data
   */
  clear(): void {
    this.races = []
    this.loaded = false
    this.error = null
  }
} 