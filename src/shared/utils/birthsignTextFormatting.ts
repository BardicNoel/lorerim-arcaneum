import { parseFormattedText, type TextFormattingOptions } from './textFormatting'

const BIRTHSIGN_ATTRIBUTES = [
  'health',
  'magicka',
  'stamina',
  'health regeneration',
  'magicka regeneration',
  'stamina regeneration',
  // ... add more as needed
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
  // ... add more as needed
] as const

const BIRTHSIGN_COMBAT_STATS = [
  'weapon damage',
  'armor rating',
  'armor penetration',
  'unarmed damage',
  'movement speed',
  'sprint speed',
  // ... add more as needed
] as const

export function getBirthsignTextFormattingOptions(): TextFormattingOptions {
  return {
    highlightBrackets: true,
    highlightAttributes: true,
    highlightSkills: true,
    highlightNumbers: true,
    customPatterns: [
      {
        pattern: /<\d+>/g,
        className: 'font-bold italic text-skyrim-gold',
        transform: match => match.slice(1, -1),
      },
      {
        pattern: new RegExp(`\\b(${BIRTHSIGN_ATTRIBUTES.join('|')})\\b`, 'gi'),
        className: 'font-semibold text-primary',
      },
      {
        pattern: new RegExp(`\\b(${BIRTHSIGN_SKILLS.join('|')})\\b`, 'gi'),
        className: 'font-semibold text-primary',
      },
      {
        pattern: /[+-]?\d+(?:\.\d+)?%?/g,
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