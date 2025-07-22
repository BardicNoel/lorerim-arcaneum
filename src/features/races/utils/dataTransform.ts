import type {
  Race,
  RacialSpell,
  SkillBonus,
  Keyword,
  TransformedRace,
} from '../types'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'

// Keyword mapping for user-friendly display
const keywordMapping: Record<string, string> = {
  REQ_StrongStomach: 'Strong Stomach',
  IsBeastRace: 'Beast Race',
  REQ_DropsBloodKeyword: 'Bleeds',
  REQ_RacialSkills_SneakUnperked: 'Natural Sneak',
  REQ_RacialSkills_CreatePotionsUnperked: 'Natural Alchemy',
  REQ_RacialSkills_LockpickUnperked: 'Natural Lockpicking',
  REQ_RacialSkills_RechargeWeaponsUnperked: 'Natural Enchanting',
  ActorTypeNPC: 'NPC',
  REQ_RaceHuman: 'Human Race',
}

/**
 * Extract effect type from racial spell description
 */
export function extractEffectType(
  spellName: string,
  description: string
): 'positive' | 'negative' | 'neutral' {
  const lowerDescription = description.toLowerCase()
  const lowerName = spellName.toLowerCase()

  // Check for beneficial resistance abilities first
  if (
    lowerName.includes('resist') ||
    lowerName.includes('resistance') ||
    lowerDescription.includes('resist') ||
    lowerDescription.includes('resistance') ||
    lowerDescription.includes('immune') ||
    lowerDescription.includes('protection')
  ) {
    return 'positive'
  }

  // Check for other beneficial abilities that might use "less" language
  if (
    lowerDescription.includes('less likely to') ||
    lowerDescription.includes('less damage') ||
    lowerDescription.includes('less effect') ||
    lowerDescription.includes('reduced effect') ||
    lowerDescription.includes('reduced damage') ||
    lowerDescription.includes('reduced chance')
  ) {
    return 'positive'
  }

  // Negative effects
  if (
    lowerDescription.includes('penalty') ||
    lowerDescription.includes('reduced') ||
    lowerDescription.includes('less') ||
    lowerName.includes('no ') ||
    lowerName.includes('penalty') ||
    lowerName.includes('weakness')
  ) {
    return 'negative'
  }

  // Positive effects
  if (
    lowerDescription.includes('increased') ||
    lowerDescription.includes('more') ||
    lowerDescription.includes('faster') ||
    lowerDescription.includes('bonus') ||
    lowerDescription.includes('+')
  ) {
    return 'positive'
  }

  return 'neutral'
}

/**
 * Extract numeric value from description using angle brackets
 */
export function extractValueFromDescription(
  description: string
): number | undefined {
  const match = description.match(/<(\d+(?:\.\d+)?)>/)
  return match ? parseFloat(match[1]) : undefined
}

/**
 * Extract target from description
 */
export function extractTargetFromDescription(
  description: string
): string | undefined {
  const targets = ['health', 'magicka', 'stamina', 'damage', 'speed', 'effect']
  const lowerDescription = description.toLowerCase()

  for (const target of targets) {
    if (lowerDescription.includes(target)) {
      return target
    }
  }

  return undefined
}

/**
 * Extract user-friendly keywords from race data
 */
export function extractKeywordsFromRace(race: Race): string[] {
  const keywords: string[] = []

  // Add category
  keywords.push(race.category)

  // Add mapped keywords
  race.keywords.forEach(keyword => {
    const mappedKeyword = keywordMapping[keyword.edid]
    if (mappedKeyword) {
      keywords.push(mappedKeyword)
    }
  })

  // Add racial spell names
  race.racialSpells.forEach(spell => {
    keywords.push(spell.name)
  })

  // Add skill names
  race.skillBonuses.forEach(bonus => {
    keywords.push(bonus.skill)
  })

  return [...new Set(keywords)] // Remove duplicates
}

/**
 * Transform race data to PlayerCreationItem format
 */


/**
 * Transform race data to TransformedRace format for internal use
 */
export function transformRaceToTransformedRace(race: Race): TransformedRace {
  const effects = race.racialSpells.map(spell => ({
    name: spell.name,
    type: extractEffectType(spell.name, spell.description),
    description: spell.description,
    value: extractValueFromDescription(spell.description),
    target: extractTargetFromDescription(spell.description),
  }))

  const keywords = extractKeywordsFromRace(race)

  return {
    id: race.edid.toLowerCase().replace('race', ''),
    name: race.name,
    description: race.description,
    category: race.category,
    tags: keywords,
    effects,
    startingStats: race.startingStats,
    skillBonuses: race.skillBonuses,
    keywords,
    regeneration: race.regeneration,
    combat: race.combat,
  }
}

/**
 * Get user-friendly keyword name
 */
export function getUserFriendlyKeyword(keyword: string): string {
  return keywordMapping[keyword] || keyword
}

/**
 * Get all available keywords from race data
 */
export function getAllKeywords(races: Race[]): string[] {
  const allKeywords = new Set<string>()

  races.forEach(race => {
    race.keywords.forEach(keyword => {
      const friendlyName = getUserFriendlyKeyword(keyword.edid)
      allKeywords.add(friendlyName)
    })
  })

  return Array.from(allKeywords).sort()
}

/**
 * Get all available skills from race data
 */
export function getAllSkills(races: Race[]): string[] {
  const allSkills = new Set<string>()

  races.forEach(race => {
    race.skillBonuses.forEach(bonus => {
      allSkills.add(bonus.skill)
    })
  })

  return Array.from(allSkills).sort()
}

/**
 * Get all available racial abilities from race data
 */
export function getAllRacialAbilities(races: Race[]): string[] {
  const allAbilities = new Set<string>()

  races.forEach(race => {
    race.racialSpells.forEach(spell => {
      allAbilities.add(spell.name)
    })
  })

  return Array.from(allAbilities).sort()
}
