/**
 * Religion Index System
 *
 * Maps religion names to compact numeric indexes for URL compression.
 * This reduces religion references from ~15 characters to 1-2 characters.
 * Used for both religion and favorite blessing fields.
 */

import RELIGION_DATA from '../../../public/data/religion-data.json'

const RELIGION_NAMES = RELIGION_DATA.map(religion =>
  religion.name.toLowerCase()
)

export const religionToIndex = (name: string): number => {
  const index = RELIGION_NAMES.indexOf(name.toLowerCase())
  if (index === -1) {
    console.warn(`Religion name not found in catalog: ${name}`)
    return -1
  }
  return index
}

export const religionFromIndex = (index: number): string => {
  if (index < 0 || index >= RELIGION_NAMES.length) {
    console.warn(`Religion index out of bounds: ${index}`)
    return ''
  }
  return RELIGION_NAMES[index]
}

/**
 * Get total number of religions in the index
 */
export function getReligionCount(): number {
  return RELIGION_NAMES.length
}
