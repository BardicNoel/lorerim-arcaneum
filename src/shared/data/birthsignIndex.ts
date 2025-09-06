/**
 * Birthsign Index System
 *
 * Maps birthsign EDIDs to compact numeric indexes for URL compression.
 * This reduces birthsign references from ~30 characters to 1-2 characters.
 */

import BIRTHSIGNS_DATA from '../../../public/data/birthsigns.json'

const BIRTHSIGN_EDIDS = BIRTHSIGNS_DATA.map(birthsign => birthsign.edid)

export const birthsignToIndex = (edid: string): number => {
  const index = BIRTHSIGN_EDIDS.indexOf(edid)
  if (index === -1) {
    console.warn(`Birthsign EDID not found in catalog: ${edid}`)
    return -1
  }
  return index
}

export const birthsignFromIndex = (index: number): string => {
  if (index < 0 || index >= BIRTHSIGN_EDIDS.length) {
    console.warn(`Birthsign index out of bounds: ${index}`)
    return ''
  }
  return BIRTHSIGN_EDIDS[index]
}

/**
 * Get total number of birthsigns in the index
 */
export function getBirthsignCount(): number {
  return BIRTHSIGN_EDIDS.length
}
