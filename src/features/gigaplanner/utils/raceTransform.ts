/**
 * Race Transformation Utilities
 * 
 * Handles transformation between GigaPlanner race names and our app's EDIDs
 */

/**
 * Map GigaPlanner race names to our app's EDIDs
 */
export function mapRaceNameToEdid(raceName: string): string | null {
  const raceMap: Record<string, string> = {
    'Altmer': 'HighElfRace',
    'Argonian': 'ArgonianRace',
    'Bosmer': 'WoodElfRace',
    'Breton': 'BretonRace',
    'Dunmer': 'DarkElfRace',
    'Imperial': 'ImperialRace',
    'Khajiit': 'KhajiitRace',
    'Nord': 'NordRace',
    'Orc': 'OrcRace',
    'Redguard': 'RedguardRace',
  }
  
  return raceMap[raceName] || null
}

/**
 * Map our app's EDIDs to GigaPlanner race names
 */
export function mapEdidToRaceName(edid: string): string | null {
  const reverseRaceMap: Record<string, string> = {
    'HighElfRace': 'Altmer',
    'ArgonianRace': 'Argonian',
    'WoodElfRace': 'Bosmer',
    'BretonRace': 'Breton',
    'DarkElfRace': 'Dunmer',
    'ImperialRace': 'Imperial',
    'KhajiitRace': 'Khajiit',
    'NordRace': 'Nord',
    'OrcRace': 'Orc',
    'RedguardRace': 'Redguard',
  }
  
  return reverseRaceMap[edid] || null
}

/**
 * Transform GigaPlanner race to our BuildState format
 */
export function transformRace(gigaPlannerRace: string): string | null {
  if (gigaPlannerRace === 'Unknown') {
    return null
  }
  
  const raceEdid = mapRaceNameToEdid(gigaPlannerRace)
  
  // Debug logging
  console.log('🔄 [Race Transform] Race mapping:', {
    original: gigaPlannerRace,
    mapped: raceEdid
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
  
  const raceName = mapEdidToRaceName(buildStateRace)
  return raceName || 'Nord'
}
