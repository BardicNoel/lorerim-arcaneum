import type { GigaPlannerRace, GigaPlannerStandingStone, GigaPlannerData } from '../types/data';

export class GigaPlannerDataLoader {
  private cache: Map<string, any> = new Map();

  /**
   * Load races data from JSON file
   */
  async loadRaces(): Promise<GigaPlannerRace[]> {
    const cacheKey = 'races';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch('/src/features/gigaplanner/data/races.json');
      if (!response.ok) {
        throw new Error(`Failed to load races data: ${response.status} ${response.statusText}`);
      }
      
      const races: GigaPlannerRace[] = await response.json();
      
      // Validate the data structure
      if (!Array.isArray(races)) {
        throw new Error('Races data is not an array');
      }

      // Basic validation of each race
      for (const race of races) {
        if (!race.id || !race.name || !race.edid) {
          throw new Error(`Invalid race data: missing required fields for ${race.name || 'unknown'}`);
        }
        
        if (!Array.isArray(race.startingHMS) || race.startingHMS.length !== 3) {
          throw new Error(`Invalid race data: startingHMS must be array of 3 numbers for ${race.name}`);
        }
        
        if (!Array.isArray(race.startingSkills) || race.startingSkills.length !== 20) {
          throw new Error(`Invalid race data: startingSkills must be array of 20 numbers for ${race.name}`);
        }
      }

      this.cache.set(cacheKey, races);
      return races;
    } catch (error) {
      console.error('Error loading races data:', error);
      throw new Error(`Failed to load races data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Load standing stones data from JSON file
   */
  async loadStandingStones(): Promise<GigaPlannerStandingStone[]> {
    const cacheKey = 'standingStones';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch('/src/features/gigaplanner/data/standingStones.json');
      if (!response.ok) {
        throw new Error(`Failed to load standing stones data: ${response.status} ${response.statusText}`);
      }
      
      const standingStones: GigaPlannerStandingStone[] = await response.json();
      
      // Validate the data structure
      if (!Array.isArray(standingStones)) {
        throw new Error('Standing stones data is not an array');
      }

      // Basic validation of each standing stone
      for (const stone of standingStones) {
        if (!stone.id || !stone.name) {
          throw new Error(`Invalid standing stone data: missing required fields for ${stone.name || 'unknown'}`);
        }
      }

      this.cache.set(cacheKey, standingStones);
      return standingStones;
    } catch (error) {
      console.error('Error loading standing stones data:', error);
      throw new Error(`Failed to load standing stones data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Load all GigaPlanner data (races and standing stones)
   */
  async loadAllData(): Promise<GigaPlannerData> {
    const [races, standingStones] = await Promise.all([
      this.loadRaces(),
      this.loadStandingStones(),
    ]);
    
    return {
      races,
      standingStones,
      // Other data types will be added as they're implemented
    };
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}
