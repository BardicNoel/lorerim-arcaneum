/**
 * Race Transformation Utilities
 * 
 * Handles transformation between GigaPlanner race names and our app's EDIDs
 * Uses the race store data for dynamic mapping instead of hardcoded values
 */

import { useRacesStore } from '@/shared/stores/racesStore'

/**
 * Find race by name (case-insensitive) in the race store
 */
function findRaceByName(raceName: string): string | null {
  const racesStore = useRacesStore.getState()
  
  // Ensure race data is loaded
  if (racesStore.data.length === 0) {
    console.warn('🔄 [Race Transform] Race store data not loaded, attempting to load...')
    racesStore.load().catch(error => {
      console.error('🔄 [Race Transform] Failed to load race data:', error)
    })
    return null
  }
  
  // Search for race by name (case-insensitive)
  const foundRace = racesStore.data.find(race => 
    race.name.toLowerCase() === raceName.toLowerCase()
  )
  
  return foundRace?.edid || null
}

/**
 * Find race name by EDID in the race store
 */
function findRaceNameByEdid(edid: string): string | null {
  const racesStore = useRacesStore.getState()
  
  // Ensure race data is loaded
  if (racesStore.data.length === 0) {
    console.warn('🔄 [Race Transform] Race store data not loaded, attempting to load...')
    racesStore.load().catch(error => {
      console.error('🔄 [Race Transform] Failed to load race data:', error)
    })
    return null
  }
  
  // Find race by EDID
  const foundRace = racesStore.data.find(race => race.edid === edid)
  
  return foundRace?.name || null
}

/**
 * Transform GigaPlanner race to our BuildState format
 */
export function transformRace(gigaPlannerRace: string): string | null {
  if (gigaPlannerRace === 'Unknown') {
    return null
  }
  
  const raceEdid = findRaceByName(gigaPlannerRace)
  
  // Debug logging
  console.log('🔄 [Race Transform] Race mapping:', {
    original: gigaPlannerRace,
    mapped: raceEdid,
    dataLoaded: useRacesStore.getState().data.length > 0
  })
  
  return raceEdid
}

/**
 * Transform our BuildState race to GigaPlanner format
 */
export function transformRaceToGigaPlanner(buildStateRace: string | null): string {
  if (!buildStateRace) {
    return 'Nord' // Default to Nord if not specified
  }
  
  const raceName = findRaceNameByEdid(buildStateRace)
  return raceName || 'Nord'
}
