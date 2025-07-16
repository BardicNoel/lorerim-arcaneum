import type { Race, TransformedRace } from '../types'
import { transformRaceToTransformedRace } from './dataTransform'

/**
 * Validate race data structure
 */
export function validateRaceData(data: any): boolean {
  if (!data || typeof data !== 'object') return false
  
  // Check if it's the expected structure
  if (data.races && Array.isArray(data.races)) {
    return data.races.every((race: any) => validateSingleRace(race))
  }
  
  // Check if it's a single race
  return validateSingleRace(data)
}

/**
 * Validate a single race object
 */
function validateSingleRace(race: any): boolean {
  if (!race || typeof race !== 'object') return false
  
  const requiredFields = [
    'name', 'edid', 'category', 'description', 
    'startingStats', 'skillBonuses', 'racialSpells', 'keywords'
  ]
  
  return requiredFields.every(field => {
    if (!(field in race)) return false
    
    // Validate specific field types
    switch (field) {
      case 'name':
      case 'edid':
      case 'category':
      case 'description':
        return typeof race[field] === 'string'
      case 'startingStats':
        return validateStartingStats(race[field])
      case 'skillBonuses':
        return Array.isArray(race[field]) && race[field].every(validateSkillBonus)
      case 'racialSpells':
        return Array.isArray(race[field]) && race[field].every(validateRacialSpell)
      case 'keywords':
        return Array.isArray(race[field]) && race[field].every(validateKeyword)
      default:
        return true
    }
  })
}

/**
 * Validate starting stats
 */
function validateStartingStats(stats: any): boolean {
  if (!stats || typeof stats !== 'object') return false
  
  const requiredStats = ['health', 'magicka', 'stamina', 'carryWeight']
  return requiredStats.every(stat => 
    typeof stats[stat] === 'number' && stats[stat] >= 0
  )
}

/**
 * Validate skill bonus
 */
function validateSkillBonus(bonus: any): boolean {
  return bonus && 
         typeof bonus.skill === 'string' && 
         typeof bonus.bonus === 'number'
}

/**
 * Validate racial spell
 */
function validateRacialSpell(spell: any): boolean {
  return spell && 
         typeof spell.edid === 'string' &&
         typeof spell.name === 'string' &&
         typeof spell.description === 'string' &&
         typeof spell.globalFormId === 'string'
}

/**
 * Validate keyword
 */
function validateKeyword(keyword: any): boolean {
  return keyword && 
         typeof keyword.edid === 'string' &&
         typeof keyword.globalFormId === 'string'
}

/**
 * Sanitize race data by providing fallback values
 */
export function sanitizeRaceData(race: any): Race {
  return {
    name: race.name || 'Unknown Race',
    edid: race.edid || 'UnknownRace',
    category: race.category || 'Unknown',
    source: race.source || 'Unknown',
    description: race.description || 'No description available.',
    startingStats: {
      health: race.startingStats?.health || 100,
      magicka: race.startingStats?.magicka || 100,
      stamina: race.startingStats?.stamina || 100,
      carryWeight: race.startingStats?.carryWeight || 200
    },
    physicalAttributes: race.physicalAttributes || {
      heightMale: 1.0,
      heightFemale: 1.0,
      weightMale: 1.0,
      weightFemale: 1.0,
      size: 'Medium'
    },
    skillBonuses: Array.isArray(race.skillBonuses) ? race.skillBonuses : [],
    racialSpells: Array.isArray(race.racialSpells) ? race.racialSpells : [],
    keywords: Array.isArray(race.keywords) ? race.keywords : [],
    flags: Array.isArray(race.flags) ? race.flags : [],
    regeneration: race.regeneration || {
      health: 0.1,
      magicka: 1.0,
      stamina: 1.0
    },
    combat: race.combat || {
      unarmedDamage: 10,
      unarmedReach: 70
    }
  }
}

/**
 * Handle missing data by providing sensible defaults
 */
export function handleMissingData(race: Race): Race {
  // If any critical fields are missing, provide defaults
  if (!race.name || !race.edid || !race.description) {
    console.warn(`Race data incomplete for ${race.name || 'unknown'}, using defaults`)
  }
  
  return sanitizeRaceData(race)
}

/**
 * Test data transformation with sample data
 */
export function testDataTransformation(races: Race[]): {
  success: boolean
  errors: string[]
  transformedCount: number
} {
  const errors: string[] = []
  let transformedCount = 0
  
  races.forEach((race, index) => {
    try {
      const transformed = transformRaceToTransformedRace(race)
      transformedCount++
      
      // Basic validation of transformed data
      if (!transformed.id || !transformed.name || !transformed.category) {
        errors.push(`Race ${index}: Missing required transformed fields`)
      }
      
      if (transformed.effects.length === 0 && race.racialSpells.length > 0) {
        errors.push(`Race ${index}: No effects transformed from ${race.racialSpells.length} spells`)
      }
      
    } catch (error) {
      errors.push(`Race ${index}: Transformation failed - ${error}`)
    }
  })
  
  return {
    success: errors.length === 0,
    errors,
    transformedCount
  }
} 