import type {
  GigaPlannerBlessing,
  GigaPlannerData,
  GigaPlannerGameMechanics,
  GigaPlannerRace,
  GigaPlannerStandingStone,
} from '../types/data'

export class GigaPlannerDataLoader {
  private cache: Map<string, any> = new Map()

  /**
   * Load races data from JSON file
   */
  async loadRaces(): Promise<GigaPlannerRace[]> {
    const cacheKey = 'races'

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      const response = await fetch('/src/features/gigaplanner/data/races.json')
      if (!response.ok) {
        throw new Error(
          `Failed to load races data: ${response.status} ${response.statusText}`
        )
      }

      const races: GigaPlannerRace[] = await response.json()

      // Validate the data structure
      if (!Array.isArray(races)) {
        throw new Error('Races data is not an array')
      }

      // Basic validation of each race
      for (const race of races) {
        if (!race.id || !race.name || !race.edid) {
          throw new Error(
            `Invalid race data: missing required fields for ${race.name || 'unknown'}`
          )
        }

        if (!Array.isArray(race.startingHMS) || race.startingHMS.length !== 3) {
          throw new Error(
            `Invalid race data: startingHMS must be array of 3 numbers for ${race.name}`
          )
        }

        if (
          !Array.isArray(race.startingSkills) ||
          race.startingSkills.length !== 20
        ) {
          throw new Error(
            `Invalid race data: startingSkills must be array of 20 numbers for ${race.name}`
          )
        }
      }

      this.cache.set(cacheKey, races)
      return races
    } catch (error) {
      console.error('Error loading races data:', error)
      throw new Error(
        `Failed to load races data: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Load standing stones data from JSON file
   */
  async loadStandingStones(): Promise<GigaPlannerStandingStone[]> {
    const cacheKey = 'standingStones'

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      const response = await fetch(
        '/src/features/gigaplanner/data/standingStones.json'
      )
      if (!response.ok) {
        throw new Error(
          `Failed to load standing stones data: ${response.status} ${response.statusText}`
        )
      }

      const standingStones: GigaPlannerStandingStone[] = await response.json()

      // Validate the data structure
      if (!Array.isArray(standingStones)) {
        throw new Error('Standing stones data is not an array')
      }

      // Basic validation of each standing stone
      for (const stone of standingStones) {
        if (!stone.id || !stone.name) {
          throw new Error(
            `Invalid standing stone data: missing required fields for ${stone.name || 'unknown'}`
          )
        }
      }

      this.cache.set(cacheKey, standingStones)
      return standingStones
    } catch (error) {
      console.error('Error loading standing stones data:', error)
      throw new Error(
        `Failed to load standing stones data: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Load blessings data from JSON file
   */
  async loadBlessings(): Promise<GigaPlannerBlessing[]> {
    const cacheKey = 'blessings'

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      const response = await fetch(
        '/src/features/gigaplanner/data/blessings.json'
      )
      if (!response.ok) {
        throw new Error(
          `Failed to load blessings data: ${response.status} ${response.statusText}`
        )
      }

      const blessings: GigaPlannerBlessing[] = await response.json()

      // Validate the data structure
      if (!Array.isArray(blessings)) {
        throw new Error('Blessings data is not an array')
      }

      // Basic validation of each blessing
      for (const blessing of blessings) {
        if (!blessing.id || !blessing.name) {
          throw new Error(
            `Invalid blessing data: missing required fields for ${blessing.name || 'unknown'}`
          )
        }
      }

      this.cache.set(cacheKey, blessings)
      return blessings
    } catch (error) {
      console.error('Error loading blessings data:', error)
      throw new Error(
        `Failed to load blessings data: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Load game mechanics data from JSON file
   */
  async loadGameMechanics(): Promise<GigaPlannerGameMechanics[]> {
    const cacheKey = 'gameMechanics'

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      const response = await fetch(
        '/src/features/gigaplanner/data/gameMechanics.json'
      )
      if (!response.ok) {
        throw new Error(
          `Failed to load game mechanics data: ${response.status} ${response.statusText}`
        )
      }

      const gameMechanics: GigaPlannerGameMechanics[] = await response.json()

      // Validate the data structure
      if (!Array.isArray(gameMechanics)) {
        throw new Error('Game mechanics data is not an array')
      }

      // Basic validation of each game mechanics entry
      for (const mechanics of gameMechanics) {
        if (!mechanics.id || !mechanics.name || mechanics.gameId === undefined) {
          throw new Error(
            `Invalid game mechanics data: missing required fields for ${mechanics.name || 'unknown'}`
          )
        }

        // Validate derived attributes structure
        if (!mechanics.derivedAttributes || !mechanics.derivedAttributes.attribute) {
          throw new Error(
            `Invalid game mechanics data: missing derivedAttributes for ${mechanics.name}`
          )
        }

        // Validate arrays have consistent length
        const { derivedAttributes } = mechanics
        const expectedLength = derivedAttributes.attribute.length
        if (
          derivedAttributes.isPercent.length !== expectedLength ||
          derivedAttributes.prefactor.length !== expectedLength ||
          derivedAttributes.threshold.length !== expectedLength ||
          derivedAttributes.weight_health.length !== expectedLength ||
          derivedAttributes.weight_magicka.length !== expectedLength ||
          derivedAttributes.weight_stamina.length !== expectedLength
        ) {
          throw new Error(
            `Invalid game mechanics data: derivedAttributes arrays have inconsistent lengths for ${mechanics.name}`
          )
        }
      }

      this.cache.set(cacheKey, gameMechanics)
      return gameMechanics
    } catch (error) {
      console.error('Error loading game mechanics data:', error)
      throw new Error(
        `Failed to load game mechanics data: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Load all GigaPlanner data (races, standing stones, blessings, and game mechanics)
   */
  async loadAllData(): Promise<GigaPlannerData> {
    const [races, standingStones, blessings, gameMechanics] = await Promise.all([
      this.loadRaces(),
      this.loadStandingStones(),
      this.loadBlessings(),
      this.loadGameMechanics(),
    ])

    return {
      races,
      standingStones,
      blessings,
      gameMechanics,
      // Other data types will be added as they're implemented
    }
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}
