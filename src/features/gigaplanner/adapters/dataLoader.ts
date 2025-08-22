import type {
  GigaPlannerBlessing,
  GigaPlannerData,
  GigaPlannerGameMechanics,
  GigaPlannerPerkList,
  GigaPlannerPreset,
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
      const response = await fetch('/data/gigaplanner/races.json')
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
      const response = await fetch('/data/gigaplanner/standingStones.json')
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
      const response = await fetch('/data/gigaplanner/blessings.json')
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
      const response = await fetch('/data/gigaplanner/gameMechanics.json')
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
        if (
          !mechanics.id ||
          !mechanics.name ||
          mechanics.gameId === undefined
        ) {
          throw new Error(
            `Invalid game mechanics data: missing required fields for ${mechanics.name || 'unknown'}`
          )
        }

        // Validate derived attributes structure
        if (
          !mechanics.derivedAttributes ||
          !mechanics.derivedAttributes.attribute
        ) {
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
   * Load presets data from JSON file
   */
  async loadPresets(): Promise<GigaPlannerPreset[]> {
    const cacheKey = 'presets'

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      const response = await fetch('/data/gigaplanner/presets.json')
      if (!response.ok) {
        throw new Error(
          `Failed to load presets data: ${response.status} ${response.statusText}`
        )
      }

      const presets: GigaPlannerPreset[] = await response.json()

      // Validate the data structure
      if (!Array.isArray(presets)) {
        throw new Error('Presets data is not an array')
      }

      // Basic validation of each preset entry
      for (const preset of presets) {
        if (!preset.id || !preset.name || preset.presetId === undefined) {
          throw new Error(
            `Invalid preset data: missing required fields for ${preset.name || 'unknown'}`
          )
        }

        // Validate reference fields are numbers
        if (
          typeof preset.perks !== 'number' ||
          typeof preset.races !== 'number' ||
          typeof preset.gameMechanics !== 'number' ||
          typeof preset.blessings !== 'number'
        ) {
          throw new Error(
            `Invalid preset data: reference fields must be numbers for ${preset.name}`
          )
        }

        // Validate version format
        if (!preset.version || !preset.version.match(/^\d+\.\d+\.\d+$/)) {
          throw new Error(
            `Invalid preset data: version must be in format x.y.z for ${preset.name}`
          )
        }
      }

      this.cache.set(cacheKey, presets)
      return presets
    } catch (error) {
      console.error('Error loading presets data:', error)
      throw new Error(
        `Failed to load presets data: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Load perks data from JSON file
   */
  async loadPerks(): Promise<GigaPlannerPerkList[]> {
    const cacheKey = 'perks'

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      const response = await fetch('/data/gigaplanner/perks.json')
      if (!response.ok) {
        throw new Error(
          `Failed to load perks data: ${response.status} ${response.statusText}`
        )
      }

      const perkList: GigaPlannerPerkList = await response.json()

      // Validate the data structure
      if (!perkList || typeof perkList !== 'object') {
        throw new Error('Perks data is not an object')
      }

      // Validate required fields
      if (!perkList.id || !perkList.name || perkList.perkListId === undefined) {
        throw new Error('Invalid perks data: missing required fields')
      }

      // Validate skillNames array
      if (
        !Array.isArray(perkList.skillNames) ||
        perkList.skillNames.length === 0
      ) {
        throw new Error(
          'Invalid perks data: skillNames must be a non-empty array'
        )
      }

      // Validate perks array
      if (!Array.isArray(perkList.perks) || perkList.perks.length === 0) {
        throw new Error('Invalid perks data: perks must be a non-empty array')
      }

      // Basic validation of each perk
      for (const perk of perkList.perks) {
        if (
          !perk.id ||
          !perk.name ||
          !perk.skill ||
          perk.skillReq === undefined
        ) {
          throw new Error(
            `Invalid perk data: missing required fields for ${perk.name || 'unknown'}`
          )
        }

        // Validate skill is in skillNames
        if (!perkList.skillNames.includes(perk.skill)) {
          throw new Error(
            `Invalid perk data: skill '${perk.skill}' not found in skillNames for ${perk.name}`
          )
        }

        // Validate prerequisites array
        if (!Array.isArray(perk.prerequisites)) {
          throw new Error(
            `Invalid perk data: prerequisites must be an array for ${perk.name}`
          )
        }
      }

      // Return as array since our interface expects GigaPlannerPerkList[]
      this.cache.set(cacheKey, [perkList])
      return [perkList]
    } catch (error) {
      console.error('Error loading perks data:', error)
      throw new Error(
        `Failed to load perks data: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Load all GigaPlanner data (races, standing stones, blessings, game mechanics, presets, and perks)
   */
  async loadAllData(): Promise<GigaPlannerData> {
    const [races, standingStones, blessings, gameMechanics, presets, perks] =
      await Promise.all([
        this.loadRaces(),
        this.loadStandingStones(),
        this.loadBlessings(),
        this.loadGameMechanics(),
        this.loadPresets(),
        this.loadPerks(),
      ])

    return {
      races,
      standingStones,
      blessings,
      gameMechanics,
      presets,
      perks,
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
