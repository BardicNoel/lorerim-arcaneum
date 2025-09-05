/**
 * Compact Perk Data Representation
 * 
 * This file contains fixed catalogs of perk EDIDs for each skill tree.
 * These catalogs are used to compress build data by replacing long perk
 * string IDs with compact indexes, reducing character count by ~90%.
 */

// Import the generated catalogs
import { PERK_CATALOGS as GENERATED_CATALOGS } from './generatedPerkCatalogs'

// Skill tree ID mappings to compact codes
export const SKILL_TREE_CODES = {
  'AVSmithing': 'SMG',
  'AVDestruction': 'DST',
  'AVEnchanting': 'ENC',
  'AVRestoration': 'RES',
  'AVMysticism': 'MYS',
  'AVConjuration': 'CNJ',
  'AVAlteration': 'ALT',
  'AVSpeechcraft': 'SPC',
  'AVAlchemy': 'ALC',
  'AVSneak': 'SNK',
  'AVLockpicking': 'LCK',
  'AVPickpocket': 'PKP',
  'AVLightArmor': 'LAR',
  'AVHeavyArmor': 'HAR',
  'AVBlock': 'BLK',
  'AVMarksman': 'MRK',
  'AVTwoHanded': 'TWH',
  'AVOneHanded': 'OHD',
} as const

// Reverse mapping for decoding
export const SKILL_TREE_CODES_REVERSE = Object.fromEntries(
  Object.entries(SKILL_TREE_CODES).map(([k, v]) => [v, k])
) as Record<string, string>

// Fixed perk catalogs - each array contains EDIDs in canonical order
export const PERK_CATALOGS = GENERATED_CATALOGS

// Type definitions for the compact format
export type SkillTreeCode = keyof typeof SKILL_TREE_CODES
export type CompactPerks = Record<string, number[]>

// Validation function to ensure all skill trees have catalogs
export function validatePerkCatalogs(): void {
  const missingCatalogs = Object.values(SKILL_TREE_CODES).filter(
    code => !(code in PERK_CATALOGS)
  )
  
  if (missingCatalogs.length > 0) {
    throw new Error(`Missing perk catalogs for: ${missingCatalogs.join(', ')}`)
  }
}

// Initialize validation on module load
validatePerkCatalogs()