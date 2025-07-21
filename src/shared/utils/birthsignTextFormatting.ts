import { type TextFormattingOptions } from './textFormatting'

// Birthsign-specific configuration
const BIRTHSIGN_ATTRIBUTES = [
  'health',
  'magicka',
  'stamina',
  'health regeneration',
  'magicka regeneration',
  'stamina regeneration',
] as const

const BIRTHSIGN_SKILLS = [
  'one-handed',
  'two-handed',
  'archery',
  'block',
  'heavy armor',
  'light armor',
  'smithing',
  'alchemy',
  'enchanting',
  'restoration',
  'destruction',
  'alteration',
  'illusion',
  'conjuration',
  'mysticism',
  'speech',
  'lockpicking',
  'sneak',
  'pickpocket',
  'pickpocketing',
  'stealth',
  'acrobatics',
  // Skill variations
  'one handed',
  'two handed',
] as const

const BIRTHSIGN_COMBAT_STATS = [
  'weapon damage',
  'armor rating',
  'armor penetration',
  'unarmed damage',
  'movement speed',
  'sprint speed',
  'carry weight',
  'spell strength',
  'shout cooldown',
  'price modification',
  'damage reflection',
] as const

const BIRTHSIGN_RESISTANCES = [
  'poison resistance',
  'fire resistance',
  'frost resistance',
  'shock resistance',
  'magic resistance',
  'disease resistance',
] as const

const BIRTHSIGN_SPECIAL_EFFECTS = [
  'lockpicking durability',
  'lockpicking expertise',
  'pickpocketing success',
  'stealth detection',
  'enchanting strength',
] as const

// Combine all attributes and skills for the pattern
const ALL_ATTRIBUTES_AND_SKILLS = [
  ...BIRTHSIGN_ATTRIBUTES,
  ...BIRTHSIGN_SKILLS,
  ...BIRTHSIGN_COMBAT_STATS,
  ...BIRTHSIGN_RESISTANCES,
  ...BIRTHSIGN_SPECIAL_EFFECTS,
]

export function getBirthsignTextFormattingOptions(): TextFormattingOptions {
  return {
    customPatterns: [
      {
        pattern: /<[^>]+>/g,
        className: 'font-bold italic text-skyrim-gold',
        transform: match => match.slice(1, -1), // Remove brackets
      },
      {
        pattern: new RegExp(
          `\\b(${ALL_ATTRIBUTES_AND_SKILLS.join('|')})\\b`,
          'gi'
        ),
        className: 'font-semibold text-primary',
      },
      {
        pattern: /\b[+-]?\d+(?:\.\d+)?%?\b/g,
        className: (match: string) => {
          const numericValue = parseFloat(match)
          const isPositive = match.startsWith('+') || numericValue > 0
          const isNegative = match.startsWith('-') || numericValue < 0

          if (isPositive) return 'font-bold text-green-600'
          if (isNegative) return 'font-bold text-red-600'
          return 'font-bold text-skyrim-gold'
        },
      },
    ],
  }
}
