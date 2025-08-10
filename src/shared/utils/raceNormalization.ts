/**
 * Race normalization utilities for handling race name variations and aliases
 */

export interface CanonicalRace {
  id: string
  name: string
  edid: string
  aliases: string[]
}

/**
 * Canonical race definitions with all known aliases and variations
 */
export const CANONICAL_RACES: CanonicalRace[] = [
  {
    id: 'nord',
    name: 'Nord',
    edid: 'NordRace',
    aliases: ['Nords', 'NordRace', 'nord', 'nords'],
  },
  {
    id: 'imperial',
    name: 'Imperial',
    edid: 'ImperialRace',
    aliases: ['Imperials', 'ImperialRace', 'imperial', 'imperials'],
  },
  {
    id: 'breton',
    name: 'Breton',
    edid: 'BretonRace',
    aliases: ['Bretons', 'BretonRace', 'breton', 'bretons'],
  },
  {
    id: 'redguard',
    name: 'Redguard',
    edid: 'RedguardRace',
    aliases: ['Redguards', 'RedguardRace', 'redguard', 'redguards'],
  },
  {
    id: 'altmer',
    name: 'Altmer',
    edid: 'HighElfRace',
    aliases: [
      'High Elves',
      'HighElf',
      'HighElfRace',
      'altmer',
      'high elf',
      'high elves',
    ],
  },
  {
    id: 'bosmer',
    name: 'Bosmer',
    edid: 'WoodElfRace',
    aliases: [
      'Wood Elves',
      'WoodElf',
      'WoodElfRace',
      'bosmer',
      'wood elf',
      'wood elves',
    ],
  },
  {
    id: 'dunmer',
    name: 'Dunmer',
    edid: 'DarkElfRace',
    aliases: [
      'Dark Elves',
      'DarkElf',
      'DarkElfRace',
      'dunmer',
      'dark elf',
      'dark elves',
    ],
  },
  {
    id: 'orsimer',
    name: 'Orsimer',
    edid: 'OrcRace',
    aliases: ['Orcs', 'OrcRace', 'orsimer', 'orc', 'orcs'],
  },
  {
    id: 'khajiit',
    name: 'Khajiit',
    edid: 'KhajiitRace',
    aliases: ['KhajiitRace', 'khajiit'],
  },
  {
    id: 'argonian',
    name: 'Argonian',
    edid: 'ArgonianRace',
    aliases: ['ArgonianRace', 'argonian', 'argonians'],
  },
  {
    id: 'falmer',
    name: 'Falmer',
    edid: 'FalmerRace',
    aliases: ['FalmerRace', 'falmer'],
  },
]

/**
 * Map of race aliases to canonical race IDs
 */
export const RACE_ALIAS_MAP = new Map<string, string>()

// Build the alias map
CANONICAL_RACES.forEach(race => {
  race.aliases.forEach(alias => {
    RACE_ALIAS_MAP.set(alias.toLowerCase(), race.id)
  })
})

/**
 * Normalize a race name to its canonical ID
 * @param input - The race name or alias to normalize
 * @returns The canonical race ID, or null if not found
 */
export function normalizeRaceKey(input: string): string | null {
  if (!input) return null

  const normalized = input.trim().toLowerCase()
  return RACE_ALIAS_MAP.get(normalized) || null
}

/**
 * Get the canonical race object by ID
 * @param raceId - The canonical race ID
 * @returns The canonical race object, or null if not found
 */
export function getCanonicalRace(raceId: string): CanonicalRace | null {
  return CANONICAL_RACES.find(race => race.id === raceId) || null
}

/**
 * Get the display name for a race ID
 * @param raceId - The canonical race ID
 * @returns The display name, or the original input if not found
 */
export function getRaceDisplayName(raceId: string): string {
  const canonical = getCanonicalRace(raceId)
  return canonical?.name || raceId
}

/**
 * Validate and normalize an array of race names
 * @param raceNames - Array of race names to normalize
 * @returns Object with normalized races and any warnings
 */
export function normalizeRaceArray(raceNames: string[]): {
  normalizedRaces: string[]
  warnings: string[]
  unknownRaces: string[]
} {
  const normalizedRaces: string[] = []
  const warnings: string[] = []
  const unknownRaces: string[] = []

  raceNames.forEach(raceName => {
    const normalized = normalizeRaceKey(raceName)
    if (normalized) {
      normalizedRaces.push(normalized)
    } else {
      unknownRaces.push(raceName)
      warnings.push(`Unknown race: "${raceName}"`)
    }
  })

  return { normalizedRaces, warnings, unknownRaces }
}

/**
 * Check if a race name is valid
 * @param raceName - The race name to validate
 * @returns True if the race name is valid
 */
export function isValidRaceName(raceName: string): boolean {
  return normalizeRaceKey(raceName) !== null
}

/**
 * Get all known race display names
 * @returns Array of all canonical race display names
 */
export function getAllRaceNames(): string[] {
  return CANONICAL_RACES.map(race => race.name)
}

/**
 * Get all known race IDs
 * @returns Array of all canonical race IDs
 */
export function getAllRaceIds(): string[] {
  return CANONICAL_RACES.map(race => race.id)
}
