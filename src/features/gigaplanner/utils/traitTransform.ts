/**
 * Trait Transformation Utilities
 * 
 * Handles transformation between GigaPlanner trait names and our app's EDIDs
 * Uses the traits store data for dynamic mapping instead of hardcoded values
 */

import { useTraitsStore } from '@/shared/stores/traitsStore'

/**
 * Find trait by name (case-insensitive) in the traits store
 */
function findTraitByName(traitName: string): string | null {
  const traitsStore = useTraitsStore.getState()
  
  // Ensure trait data is loaded
  if (traitsStore.data.length === 0) {
    console.warn('🔄 [Trait Transform] Traits store data not loaded, attempting to load...')
    traitsStore.load().catch(error => {
      console.error('🔄 [Trait Transform] Failed to load trait data:', error)
    })
    return null
  }
  
  // Normalize spaces and search for trait by name (case-insensitive)
  const normalizedTraitName = traitName.trim().replace(/\s+/g, ' ').toLowerCase()
  console.log('🔄 [Trait Transform] Looking for trait:', {
    original: traitName,
    normalized: normalizedTraitName,
    availableTraits: traitsStore.data.map(t => t.name).slice(0, 5)
  })
  
  const foundTrait = traitsStore.data.find(trait => 
    trait.name.toLowerCase().replace(/\s+/g, ' ') === normalizedTraitName
  )
  
  if (foundTrait) {
    console.log('🔄 [Trait Transform] Found trait:', {
      original: traitName,
      normalized: normalizedTraitName,
      found: foundTrait.name,
      edid: foundTrait.edid
    })
  } else {
    console.warn('🔄 [Trait Transform] Trait not found:', {
      original: traitName,
      normalized: normalizedTraitName,
      totalTraitsAvailable: traitsStore.data.length
    })
  }
  
  return foundTrait?.edid || null
}

/**
 * Find trait name by EDID in the traits store
 */
function findTraitNameByEdid(edid: string): string | null {
  const traitsStore = useTraitsStore.getState()
  
  // Ensure trait data is loaded
  if (traitsStore.data.length === 0) {
    console.warn('🔄 [Trait Transform] Traits store data not loaded, attempting to load...')
    traitsStore.load().catch(error => {
      console.error('🔄 [Trait Transform] Failed to load trait data:', error)
    })
    return null
  }
  
  // Find trait by EDID
  const foundTrait = traitsStore.data.find(trait => trait.edid === edid)
  
  return foundTrait?.name || null
}

/**
 * Transform GigaPlanner traits to our BuildState format
 */
export function transformTraits(gigaPlannerTraits: string[]): {
  regular: string[]
  bonus: string[]
} {
  const regular: string[] = []
  const bonus: string[] = []
  
  gigaPlannerTraits.forEach(traitName => {
    if (traitName === 'Unknown') {
      return // Skip unknown traits
    }
    
    const traitEdid = findTraitByName(traitName)
    
    if (traitEdid) {
      // For now, we'll put all traits in regular slots
      // In the future, we could determine bonus vs regular based on trait data
      regular.push(traitEdid)
      
      // Debug logging
      console.log('🔄 [Trait Transform] Trait mapping:', {
        original: traitName,
        mapped: traitEdid,
        dataLoaded: useTraitsStore.getState().data.length > 0
      })
    } else {
      console.warn(`🔄 [Trait Transform] Unknown trait: ${traitName}`)
    }
  })
  
  return { regular, bonus }
}

/**
 * Transform our BuildState traits to GigaPlanner format
 */
export function transformTraitsToGigaPlanner(buildStateTraits: {
  regular: string[]
  bonus: string[]
}): string[] {
  const allTraits = [...buildStateTraits.regular, ...buildStateTraits.bonus]
  
  return allTraits.map(edid => {
    const traitName = findTraitNameByEdid(edid)
    return traitName || 'Unknown'
  }).filter(name => name !== 'Unknown')
}
