/**
 * Standing Stone Transformation Utilities
 * 
 * Handles transformation between GigaPlanner standing stone names and our app's EDIDs
 * Uses the birthsign store data for dynamic mapping instead of hardcoded values
 */

import { useBirthsignsStore } from '@/shared/stores/birthsignsStore'

/**
 * Find standing stone by name (case-insensitive) in the birthsign store
 */
function findStoneByName(stoneName: string): string | null {
  const birthsignsStore = useBirthsignsStore.getState()
  
  // Ensure birthsign data is loaded
  if (birthsignsStore.data.length === 0) {
    console.warn('🔄 [Stone Transform] Birthsign store data not loaded, attempting to load...')
    birthsignsStore.load().catch(error => {
      console.error('🔄 [Stone Transform] Failed to load birthsign data:', error)
    })
    return null
  }
  
  // Search for standing stone by name (case-insensitive)
  const foundStone = birthsignsStore.data.find(birthsign => 
    birthsign.name.toLowerCase() === stoneName.toLowerCase()
  )
  
  return foundStone?.edid || null
}

/**
 * Find standing stone name by EDID in the birthsign store
 */
function findStoneNameByEdid(edid: string): string | null {
  const birthsignsStore = useBirthsignsStore.getState()
  
  // Ensure birthsign data is loaded
  if (birthsignsStore.data.length === 0) {
    console.warn('🔄 [Stone Transform] Birthsign store data not loaded, attempting to load...')
    birthsignsStore.load().catch(error => {
      console.error('🔄 [Stone Transform] Failed to load birthsign data:', error)
    })
    return null
  }
  
  // Find standing stone by EDID
  const foundStone = birthsignsStore.data.find(birthsign => birthsign.edid === edid)
  
  return foundStone?.name || null
}

/**
 * Transform GigaPlanner standing stone to our BuildState format
 */
export function transformStone(gigaPlannerStone: string): string | null {
  if (gigaPlannerStone === 'Unknown') {
    return null
  }
  
  const stoneEdid = findStoneByName(gigaPlannerStone)
  
  // Debug logging
  console.log('🔄 [Stone Transform] Stone mapping:', {
    original: gigaPlannerStone,
    mapped: stoneEdid,
    dataLoaded: useBirthsignsStore.getState().data.length > 0
  })
  
  return stoneEdid
}

/**
 * Transform our BuildState stone to GigaPlanner format
 */
export function transformStoneToGigaPlanner(buildStateStone: string | null): string {
  if (!buildStateStone) {
    return 'None'
  }
  
  const stoneName = findStoneNameByEdid(buildStateStone)
  return stoneName || 'None'
}
