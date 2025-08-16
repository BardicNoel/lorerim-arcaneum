// Main component export
export { DerivedStatsCard } from './views/DerivedStatsCard'

// Hook export
export { useDerivedStatsCalculation } from './adapters/useDerivedStatsCalculation'

// Type exports
export type {
  BaseAttributes,
  DerivedStat,
  DerivedStatConfig,
  DerivedStatsCalculation,
  DataSources,
} from './types'

// Model exports
export { DerivedStatsCalculator } from './model/DerivedStatsCalculator'

// Configuration exports
export { DERIVED_STATS_CONFIG } from './config/derivedStatsConfig'
