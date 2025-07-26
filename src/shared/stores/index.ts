// Export all individual data stores
export { useBirthsignsStore } from './birthsignsStore'
export { useDestinyNodesStore } from './destinyNodesStore'
export { usePerkTreesStore } from './perkTreesStore'
export { useRacesStore } from './racesStore'
export { useReligionsStore } from './religionsStore'
export { useSkillsStore } from './skillsStore'
export { useTraitsStore } from './traitsStore'

// Export convenience hooks (matches old useDataCache API)
export {
  useBirthsigns,
  useBirthsignsSync,
  useDestinyNodes,
  useDestinyNodesSync,
  usePerkTrees,
  usePerkTreesSync,
  useRaces,
  useRacesSync,
  useReligions,
  useReligionsSync,
  useSkills,
  useSkillsSync,
  useTraits,
  useTraitsSync,
} from './useDataStores'

// Export data initialization utilities
export {
  areAllDataStoresLoaded,
  getGlobalErrors,
  getGlobalLoadingState,
  loadAllData,
} from './dataUtils'

// Re-export character store
export { useCharacterStore } from './characterStore'
