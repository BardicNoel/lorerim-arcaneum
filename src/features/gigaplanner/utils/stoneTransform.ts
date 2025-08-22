/**
 * Standing Stone Transformation Utilities
 * 
 * Handles transformation between GigaPlanner standing stone names and our app's EDIDs
 */

/**
 * Map GigaPlanner standing stone names to our app's EDIDs
 */
export function mapStoneNameToEdid(stoneName: string): string | null {
  const stoneMap: Record<string, string> = {
    'Warrior': 'WarriorStone',
    'Mage': 'MageStone',
    'Thief': 'ThiefStone',
    'Lady': 'LadyStone',
    'Steed': 'SteedStone',
    'Lord': 'LordStone',
    'Apprentice': 'ApprenticeStone',
    'Atronach': 'AtronachStone',
    'Lover': 'LoverStone',
    'Shadow': 'ShadowStone',
    'Tower': 'TowerStone',
    'Ritual': 'RitualStone',
    'Serpent': 'SerpentStone',
  }
  
  return stoneMap[stoneName] || null
}

/**
 * Map our app's EDIDs to GigaPlanner standing stone names
 */
export function mapEdidToStoneName(edid: string): string | null {
  const reverseStoneMap: Record<string, string> = {
    'WarriorStone': 'Warrior',
    'MageStone': 'Mage',
    'ThiefStone': 'Thief',
    'LadyStone': 'Lady',
    'SteedStone': 'Steed',
    'LordStone': 'Lord',
    'ApprenticeStone': 'Apprentice',
    'AtronachStone': 'Atronach',
    'LoverStone': 'Lover',
    'ShadowStone': 'Shadow',
    'TowerStone': 'Tower',
    'RitualStone': 'Ritual',
    'SerpentStone': 'Serpent',
  }
  
  return reverseStoneMap[edid] || null
}

/**
 * Transform GigaPlanner standing stone to our BuildState format
 */
export function transformStone(gigaPlannerStone: string): string | null {
  if (gigaPlannerStone === 'Unknown') {
    return null
  }
  
  const stoneEdid = mapStoneNameToEdid(gigaPlannerStone)
  
  // Debug logging
  console.log('🔄 [Stone Transform] Stone mapping:', {
    original: gigaPlannerStone,
    mapped: stoneEdid
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
  
  const stoneName = mapEdidToStoneName(buildStateStone)
  return stoneName || 'None'
}
