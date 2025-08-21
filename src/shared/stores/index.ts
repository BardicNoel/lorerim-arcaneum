// Export all individual data stores
export { useBirthsignsStore } from './birthsignsStore'
export { useBlessingsStore } from './blessingsStore'
export { useDestinyNodesStore } from './destinyNodesStore'
export { usePerkTreesStore } from './perkTreesStore'
export { useRacesStore } from './racesStore'
export { useRecipesStore } from './recipesStore'
export { useReligionsStore } from './religionsStore'
export { useSkillsStore } from './skillsStore'
export { useSpellsStore } from './spellsStore'
export { useTraitsStore } from './traitsStore'

// Export convenience hooks (matches old useDataCache API)
export {
  useBirthsigns,
  useBirthsignsSync,
  useBlessings,
  useBlessingsSync,
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
  useSpells,
  useSpellsSync,
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
