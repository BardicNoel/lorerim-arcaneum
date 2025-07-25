// Data Provider and Store
export {
  useDataStore,
  useSkills,
  useRaces,
  useTraits,
  useReligions,
  useBirthsigns,
  useDestinyNodes,
  usePerkTrees,
  useGlobalSearch,
  useDataCache,
} from './DataProvider'

// Schemas and Validation
export {
  // Schemas
  BaseEntitySchema,
  SkillSchema,
  RaceSchema,
  TraitSchema,
  ReligionSchema,
  BirthsignSchema,
  DestinyNodeSchema,
  PerkTreeSchema,
  SearchResultSchema,
  
  // Data file schemas
  SkillsDataSchema,
  RacesDataSchema,
  TraitsDataSchema,
  ReligionsDataSchema,
  BirthsignsDataSchema,
  DestinyNodesDataSchema,
  PerkTreesDataSchema,
  
  // Validation functions
  validateSkillsData,
  validateRacesData,
  validateTraitsData,
  validateReligionsData,
  validateBirthsignsData,
  validateDestinyNodesData,
  validatePerkTreesData,
  
  // Safe validation functions
  safeValidateSkillsData,
  safeValidateRacesData,
  safeValidateTraitsData,
  safeValidateReligionsData,
  safeValidateBirthsignsData,
  safeValidateDestinyNodesData,
  safeValidatePerkTreesData,
} from './schemas'

// Types
export type {
  BaseEntity,
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