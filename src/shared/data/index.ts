// Export the new cache-based data system
export * from './dataCache'
export * from './useDataCache'
export * from './schemas'

// Legacy exports for backward compatibility (deprecated)
// Note: These may conflict with the new system - use the new hooks instead
export {
  useDataStore,
  useGlobalSearch,
  useDataCache as useLegacyDataCache,
} from './DataProvider'

// Types
export type {
  Skill,
  Race,
  Trait,
  Religion,
  Birthsign,
  DestinyNode,
  PerkTree,
  SearchResult,
  SearchResultHighlight,
  
  // Data file types
  SkillsData,
  RacesData,
  TraitsData,
  ReligionsData,
  BirthsignsData,
  DestinyNodesData,
  PerkTreesData,
} from './schemas'

// Validation Utilities
export {
  validateData,
  formatZodError,
  validateSkillsDataSafe,
  validateRacesDataSafe,
  validateTraitsDataSafe,
  validateReligionsDataSafe,
  validateBirthsignsDataSafe,
  validateDestinyNodesDataSafe,
  validatePerkTreesDataSafe,
  generateDataQualityReport,
  transformSkillsData,
  transformRacesData,
  transformTraitsData,
  transformReligionsData,
  transformBirthsignsData,
  transformDestinyNodesData,
  DataValidationError,
  handleValidationError,
  type ValidationResult,
  type ValidationFunction,
  type DataQualityReport,
} from './validationUtils'

// Components
export { DataInitializer } from './DataInitializer'
export { GlobalSearch } from '../components/GlobalSearch' 