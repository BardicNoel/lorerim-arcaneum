// Export schemas and types
export * from './schemas'

// Types
export type {
  Birthsign,
  BirthsignsData,
  DestinyNode,
  DestinyNodesData,
  PerkTree,
  PerkTreesData,
  Race,
  RacesData,
  Religion,
  ReligionsData,
  SearchResult,
  SearchResultHighlight,
  Skill,
  // Data file types
  SkillsData,
  Trait,
  TraitsData,
} from './schemas'

// Validation Utilities
export {
  DataValidationError,
  formatZodError,
  generateDataQualityReport,
  handleValidationError,
  transformBirthsignsData,
  transformDestinyNodesData,
  transformRacesData,
  transformReligionsData,
  transformSkillsData,
  transformTraitsData,
  validateBirthsignsDataSafe,
  validateData,
  validateDestinyNodesDataSafe,
  validatePerkTreesDataSafe,
  validateRacesDataSafe,
  validateReligionsDataSafe,
  validateSkillsDataSafe,
  validateTraitsDataSafe,
  type DataQualityReport,
  type ValidationFunction,
  type ValidationResult,
} from './validationUtils'

// Components
export { GlobalSearch } from '../components/GlobalSearch'
export { DataInitializer } from './DataInitializer'
