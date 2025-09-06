/**
 * Destiny Index System
 *
 * Maps destiny EDIDs to compact numeric indexes for URL compression.
 * This reduces destiny references from ~20 characters to 1-2 characters.
 */

// Destiny EDID to index mapping
export const DESTINY_INDEX: Record<string, number> = {
  DAR_Perk01Destiny: 0,
  DAR_Perk02Focus: 1,
  DAR_Perk03Constitution: 2,
  DAR_Perk04Endurance: 3,
  DAR_Perk05Mage: 4,
  DAR_Perk06Warrior: 5,
  DAR_Perk07Thief: 6,
  DAR_Perk08Fortification: 7,
  DAR_Perk09MagickaSurge: 8,
  DAR_Perk10MagicShell: 9,
  DAR_Perk11IronSkin: 10,
  DAR_Perk12BattleSpirit: 11,
  DAR_Perk13Adrenaline: 12,
  DAR_Perk14Swiftness: 13,
  DAR_Perk15Agent: 14,
  DAR_Perk16Sorcerer: 15,
  DAR_Perk17Spellsword: 16,
  DAR_Perk18Knight: 17,
  DAR_Perk19Acrobat: 18,
  DAR_Perk20Scout: 19,
  DAR_Perk21Spellblade: 20,
  DAR_Perk22Leadership: 21,
  DAR_Perk23HardSkin: 22,
  DAR_Perk24HealingPresence: 23,
  DAR_Perk25Absorbtion: 24,
  DAR_Perk26ConjuringPresence: 25,
  DAR_Perk27CorrosiveWeapon: 26,
  DAR_Perk28LeechingSpikes: 27,
  DAR_Perk29Deflection: 28,
  DAR_Perk30OverwhelmingPresence: 29,
  DAR_Perk31Smash: 30,
  DAR_Perk32Trickster: 31,
  DAR_Perk33SwiftShadow: 32,
  DAR_Perk34VipersBlade: 33,
  DAR_Perk35Evasion: 34,
  DAR_Perk36SilentBlade: 35,
  DAR_Perk37Bard: 36,
  DAR_Perk38Shaman: 37,
  DAR_Perk39Templar: 38,
  DAR_Perk40Archmage: 39,
  DAR_Perk41Summoner: 40,
  DAR_Perk42Battlemage: 41,
  DAR_Perk43BloodKnight: 42,
  DAR_Perk44General: 43,
  DAR_Perk45Monk: 44,
  DAR_Perk46Berserker: 45,
  DAR_Perk47Saboteur: 46,
  DAR_Perk48Assassin: 47,
  DAR_Perk49Rogue: 48,
  DAR_Perk50Stalker: 49,
  DAR_Perk51Nightblade: 50,
} as const

// Reverse mapping: index to EDID
export const DESTINY_INDEX_REVERSE: Record<number, string> = Object.fromEntries(
  Object.entries(DESTINY_INDEX).map(([edid, index]) => [index, edid])
)

/**
 * Convert destiny EDID to index
 */
export function destinyToIndex(edid: string): number | undefined {
  return DESTINY_INDEX[edid]
}

/**
 * Convert destiny index to EDID
 */
export function destinyFromIndex(index: number): string | undefined {
  return DESTINY_INDEX_REVERSE[index]
}

/**
 * Convert array of destiny EDIDs to indexes
 */
export function destiniesToIndexes(edids: string[]): number[] {
  return edids
    .map(edid => destinyToIndex(edid))
    .filter((index): index is number => index !== undefined)
}

/**
 * Convert array of destiny indexes to EDIDs
 */
export function destiniesFromIndexes(indexes: number[]): string[] {
  return indexes
    .map(index => destinyFromIndex(index))
    .filter((edid): edid is string => edid !== undefined)
}

/**
 * Get total number of destinies in the index
 */
export function getDestinyCount(): number {
  return Object.keys(DESTINY_INDEX).length
}
