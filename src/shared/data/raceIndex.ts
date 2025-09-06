/**
 * Race Index System
 *
 * Maps race EDIDs to compact numeric indexes for URL compression.
 * This reduces race references from ~15 characters to 1-2 characters.
 */

import RACES_DATA from '../../../public/data/playable-races.json'

const RACE_EDIDS = RACES_DATA.races.map(race => race.edid)

export const raceToIndex = (edid: string): number => {
  const index = RACE_EDIDS.indexOf(edid)
  if (index === -1) {
    console.warn(`Race EDID not found in catalog: ${edid}`)
    return -1
  }
  return index
}

export const raceFromIndex = (index: number): string => {
  if (index < 0 || index >= RACE_EDIDS.length) {
    console.warn(`Race index out of bounds: ${index}`)
    return ''
  }
  return RACE_EDIDS[index]
}

/**
 * Get total number of races in the index
 */
export function getRaceCount(): number {
  return RACE_EDIDS.length
}
