/**
 * Feature flags for controlling UI features and functionality
 */

export const FEATURE_FLAGS = {
  /**
   * Controls whether favored races are displayed in religion/trait components
   * Disabled due to data inconsistencies in the core content
   */
  SHOW_FAVORED_RACES: true,

  /**
   * Controls whether race-based autocomplete is available in search
   */
  ENABLE_RACE_AUTOCOMPLETE: false,

  /**
   * Controls whether race filters are shown in search interfaces
   */
  SHOW_RACE_FILTERS: false,
} as const

/**
 * Type for feature flag keys
 */
export type FeatureFlagKey = keyof typeof FEATURE_FLAGS

/**
 * Get a feature flag value
 */
export function getFeatureFlag(key: FeatureFlagKey): boolean {
  return FEATURE_FLAGS[key]
}

/**
 * Check if favored races should be shown
 */
export function shouldShowFavoredRaces(): boolean {
  return getFeatureFlag('SHOW_FAVORED_RACES')
}

/**
 * Check if race autocomplete should be enabled
 */
export function shouldEnableRaceAutocomplete(): boolean {
  return getFeatureFlag('ENABLE_RACE_AUTOCOMPLETE')
}

/**
 * Check if race filters should be shown
 */
export function shouldShowRaceFilters(): boolean {
  return getFeatureFlag('SHOW_RACE_FILTERS')
}
