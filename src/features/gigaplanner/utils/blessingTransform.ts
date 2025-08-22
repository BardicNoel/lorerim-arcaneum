/**
 * Blessing Transformation Utilities
 * 
 * Handles transformation between GigaPlanner blessing names and our app's format
 * Uses the blessings store data for dynamic mapping instead of hardcoded values
 */

import { useBlessingsStore } from '@/shared/stores/blessingsStore'

/**
 * Find blessing by name (case-insensitive) in the blessings store
 */
function findBlessingByName(blessingName: string): string | null {
  const blessingsStore = useBlessingsStore.getState()
  
  // Ensure blessing data is loaded
  if (blessingsStore.data.length === 0) {
    console.warn('🔄 [Blessing Transform] Blessings store data not loaded, attempting to load...')
    blessingsStore.load().catch(error => {
      console.error('🔄 [Blessing Transform] Failed to load blessing data:', error)
    })
    return null
  }
  
  // Search for blessing by name (case-insensitive)
  const foundBlessing = blessingsStore.data.find(blessing => 
    blessing.name.toLowerCase() === blessingName.toLowerCase() ||
    blessing.blessingName.toLowerCase() === blessingName.toLowerCase()
  )
  
  return foundBlessing?.id || null
}

/**
 * Find blessing name by ID in the blessings store
 */
function findBlessingNameById(id: string): string | null {
  const blessingsStore = useBlessingsStore.getState()
  
  // Ensure blessing data is loaded
  if (blessingsStore.data.length === 0) {
    console.warn('🔄 [Blessing Transform] Blessings store data not loaded, attempting to load...')
    blessingsStore.load().catch(error => {
      console.error('🔄 [Blessing Transform] Failed to load blessing data:', error)
    })
    return null
  }
  
  // Find blessing by ID
  const foundBlessing = blessingsStore.data.find(blessing => blessing.id === id)
  
  return foundBlessing?.name || null
}

/**
 * Transform GigaPlanner blessing to our BuildState format
 */
export function transformBlessing(gigaPlannerBlessing: string): string | null {
  if (gigaPlannerBlessing === 'Unknown') {
    return null
  }
  
  const blessingId = findBlessingByName(gigaPlannerBlessing)
  
  // Debug logging
  console.log('🔄 [Blessing Transform] Blessing mapping:', {
    original: gigaPlannerBlessing,
    mapped: blessingId,
    dataLoaded: useBlessingsStore.getState().data.length > 0
  })
  
  return blessingId
}

/**
 * Transform our BuildState blessing to GigaPlanner format
 */
export function transformBlessingToGigaPlanner(buildStateBlessing: string | null): string {
  if (!buildStateBlessing) {
    return 'None'
  }
  
  const blessingName = findBlessingNameById(buildStateBlessing)
  return blessingName || 'None'
}
