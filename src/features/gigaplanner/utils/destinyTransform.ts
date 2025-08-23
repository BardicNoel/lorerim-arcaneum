/**
 * Destiny/Subclass Transformation Utilities
 * 
 * Handles transformation between GigaPlanner destiny/subclass names and our app's destiny node EDIDs
 * Uses the destiny nodes store data for dynamic mapping instead of hardcoded values
 */

import { useDestinyNodesStore } from '@/shared/stores/destinyNodesStore'

/**
 * Find destiny node by name (case-insensitive) in the destiny nodes store
 */
function findDestinyNodeByName(nodeName: string): string | null {
  const destinyStore = useDestinyNodesStore.getState()
  
  // Ensure destiny data is loaded
  if (destinyStore.data.length === 0) {
    console.warn('🔄 [Destiny Transform] Destiny store data not loaded, attempting to load...')
    destinyStore.load().catch(error => {
      console.error('🔄 [Destiny Transform] Failed to load destiny data:', error)
    })
    return null
  }
  
  // Normalize spaces and search for destiny node by name (case-insensitive)
  const normalizedNodeName = nodeName.trim().replace(/\s+/g, ' ').toLowerCase()
  console.log('🔄 [Destiny Transform] Looking for destiny node:', {
    original: nodeName,
    normalized: normalizedNodeName,
    availableNodes: destinyStore.data.map(n => n.name).slice(0, 5)
  })
  
  const foundNode = destinyStore.data.find(node => 
    node.name.toLowerCase().replace(/\s+/g, ' ') === normalizedNodeName
  )
  
  if (foundNode) {
    console.log('🔄 [Destiny Transform] Found destiny node:', {
      original: nodeName,
      normalized: normalizedNodeName,
      found: foundNode.name,
      edid: foundNode.edid
    })
  } else {
    console.warn('🔄 [Destiny Transform] Destiny node not found:', {
      original: nodeName,
      normalized: normalizedNodeName,
      totalNodesAvailable: destinyStore.data.length
    })
  }
  
  return foundNode?.edid || null
}

/**
 * Find destiny node name by EDID in the destiny nodes store
 */
function findDestinyNodeNameByEdid(edid: string): string | null {
  const destinyStore = useDestinyNodesStore.getState()
  
  // Ensure destiny data is loaded
  if (destinyStore.data.length === 0) {
    console.warn('🔄 [Destiny Transform] Destiny store data not loaded, attempting to load...')
    destinyStore.load().catch(error => {
      console.error('🔄 [Destiny Transform] Failed to load destiny data:', error)
    })
    return null
  }
  
  // Find destiny node by EDID
  const foundNode = destinyStore.data.find(node => node.edid === edid)
  
  return foundNode?.name || null
}

/**
 * Transform GigaPlanner destiny/subclass names to our BuildState format
 */
export function transformDestiny(gigaPlannerDestiny: string[]): string[] {
  const destinyPath: string[] = []
  
  gigaPlannerDestiny.forEach(nodeName => {
    if (nodeName === 'Unknown') {
      return // Skip unknown destiny nodes
    }
    
    const nodeEdid = findDestinyNodeByName(nodeName)
    
    if (nodeEdid) {
      destinyPath.push(nodeEdid)
      
      // Debug logging
      console.log('🔄 [Destiny Transform] Destiny mapping:', {
        original: nodeName,
        mapped: nodeEdid,
        dataLoaded: useDestinyNodesStore.getState().data.length > 0
      })
    } else {
      console.warn(`🔄 [Destiny Transform] Unknown destiny node: ${nodeName}`)
    }
  })
  
  return destinyPath
}

/**
 * Transform our BuildState destiny path to GigaPlanner format
 */
export function transformDestinyToGigaPlanner(buildStateDestiny: string[]): string[] {
  return buildStateDestiny.map(edid => {
    const nodeName = findDestinyNodeNameByEdid(edid)
    return nodeName || 'Unknown'
  }).filter(name => name !== 'Unknown')
}
