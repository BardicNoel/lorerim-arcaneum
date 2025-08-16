import type { BuildState } from '@/shared/types/build'
import type { BaseAttributes, DataSources, DerivedStat } from '../types'

// Define the interface locally to match config file
interface DerivedStatConfig {
  name: string
  isPercentage: boolean
  prefactor: number
  threshold: number
  weights: {
    health: number
    magicka: number
    stamina: number
  }
  description: string
  category: 'combat' | 'survival' | 'movement' | 'magic'
}

export class DerivedStatsCalculator {
  /**
   * Calculate base attributes from core sources (Phase 1)
   * Uses race starting stats + attribute assignments
   */
  static calculateBaseAttributes(
    build: BuildState,
    dataSources: DataSources
  ): BaseAttributes {
    // Start with race starting stats (or defaults if no race selected)
    let base = { health: 100, stamina: 100, magicka: 100 }

    // Override with race starting stats
    if (build.race && dataSources.races) {
      const race = dataSources.races.find((r: any) => r.edid === build.race)
      if (race?.startingStats) {
        base = {
          health: race.startingStats.health || 100,
          stamina: race.startingStats.stamina || 100,
          magicka: race.startingStats.magicka || 100,
        }
      }
    }

    // Add attribute assignments (points from character level)
    base.health += build.attributeAssignments.health || 0
    base.stamina += build.attributeAssignments.stamina || 0
    base.magicka += build.attributeAssignments.magicka || 0

    return base
  }

  /**
   * Calculate a single derived stat using the formula:
   * value = prefactor * sqrt(weightedSum - threshold) if weightedSum > threshold
   * value = 0 otherwise
   */
  static calculateDerivedStat(
    baseAttributes: BaseAttributes,
    config: DerivedStatConfig
  ): number {
    const weightedSum =
      baseAttributes.health * config.weights.health +
      baseAttributes.magicka * config.weights.magicka +
      baseAttributes.stamina * config.weights.stamina

    if (weightedSum > config.threshold) {
      const bonus = config.prefactor * Math.sqrt(weightedSum - config.threshold)
      return Math.floor(bonus)
    }

    return 0
  }

  /**
   * Calculate all derived stats from base attributes
   */
  static calculateAllDerivedStats(
    baseAttributes: BaseAttributes,
    config: Record<string, DerivedStatConfig>
  ): DerivedStat[] {
    return Object.entries(config).map(([key, statConfig]) => ({
      name: statConfig.name,
      value: this.calculateDerivedStat(baseAttributes, statConfig),
      isPercentage: statConfig.isPercentage,
      formula: `${statConfig.prefactor} * sqrt(weightedSum - ${statConfig.threshold})`,
      description: statConfig.description,
      category: statConfig.category,
    }))
  }

  /**
   * Validate base attributes are within reasonable bounds
   */
  static validateBaseAttributes(attributes: BaseAttributes): boolean {
    return (
      attributes.health >= 0 &&
      attributes.stamina >= 0 &&
      attributes.magicka >= 0 &&
      attributes.health <= 1000 &&
      attributes.stamina <= 1000 &&
      attributes.magicka <= 1000
    )
  }

  /**
   * Get calculation breakdown for debugging
   */
  static getCalculationBreakdown(
    baseAttributes: BaseAttributes,
    config: DerivedStatConfig
  ): {
    weightedSum: number
    threshold: number
    difference: number
    prefactor: number
    result: number
  } {
    const weightedSum =
      baseAttributes.health * config.weights.health +
      baseAttributes.magicka * config.weights.magicka +
      baseAttributes.stamina * config.weights.stamina

    const difference = weightedSum - config.threshold
    const result =
      difference > 0 ? Math.floor(config.prefactor * Math.sqrt(difference)) : 0

    return {
      weightedSum,
      threshold: config.threshold,
      difference,
      prefactor: config.prefactor,
      result,
    }
  }
}
