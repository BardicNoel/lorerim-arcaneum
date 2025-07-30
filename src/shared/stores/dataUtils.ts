import { useBirthsignsStore } from './birthsignsStore'
import { useDestinyNodesStore } from './destinyNodesStore'
import { usePerkTreesStore } from './perkTreesStore'
import { useRacesStore } from './racesStore'
import { useReligionsStore } from './religionsStore'
import { useSkillsStore } from './skillsStore'
import { useSpellsStore } from './spellsStore'
import { useTraitsStore } from './traitsStore'

/**
 * Load all data stores in parallel
 */
export async function loadAllData() {
  await Promise.all([
    useSkillsStore.getState().load(),
    useRacesStore.getState().load(),
    useTraitsStore.getState().load(),
    useReligionsStore.getState().load(),
    useBirthsignsStore.getState().load(),
    useDestinyNodesStore.getState().load(),
    usePerkTreesStore.getState().load(),
    useSpellsStore.getState().load(),
  ])
}

/**
 * Check if all data stores are loaded
 */
export function areAllDataStoresLoaded() {
  return (
    useSkillsStore.getState().data.length > 0 &&
    useRacesStore.getState().data.length > 0 &&
    useTraitsStore.getState().data.length > 0 &&
    useReligionsStore.getState().data.length > 0 &&
    useBirthsignsStore.getState().data.length > 0 &&
    useDestinyNodesStore.getState().data.length > 0 &&
    usePerkTreesStore.getState().data.length > 0 &&
    useSpellsStore.getState().data.length > 0
  )
}

/**
 * Get loading state across all stores
 */
export function getGlobalLoadingState() {
  const stores = [
    useSkillsStore,
    useRacesStore,
    useTraitsStore,
    useReligionsStore,
    useBirthsignsStore,
    useDestinyNodesStore,
    usePerkTreesStore,
    useSpellsStore,
  ]

  return stores.some(store => store.getState().loading)
}

/**
 * Get any errors from all stores
 */
export function getGlobalErrors() {
  const stores = [
    useSkillsStore,
    useRacesStore,
    useTraitsStore,
    useReligionsStore,
    useBirthsignsStore,
    useDestinyNodesStore,
    usePerkTreesStore,
    useSpellsStore,
  ]

  return stores.map(store => store.getState().error).filter(Boolean) as string[]
}
