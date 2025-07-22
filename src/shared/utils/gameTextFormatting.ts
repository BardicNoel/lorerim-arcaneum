import { type TextFormattingOptions } from './textFormatting'

/**
 * Shared text formatting options for game content (birthsigns, traits, etc.).
 * Multiple features use similar text patterns, so we can share this formatter.
 */
const GAME_ATTRIBUTES = [
  'health',
  'magicka',
  'stamina',
  'health regeneration',
  'magicka regeneration',
  'stamina regeneration',
  // ... add more as needed
] as const

const GAME_SKILLS = [
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

const GAME_COMBAT_STATS = [
  'weapon damage',
  'armor rating',
  'armor penetration',
  'unarmed damage',
  'movement speed',
  'sprint speed',
  // ... add more as needed
] as const

/**
 * Get text formatting options for game content (birthsigns, traits, etc.).
 * This is a shared formatter since multiple features use similar text patterns.
 */
export function getGameTextFormattingOptions(): TextFormattingOptions {
  return {
    highlightBrackets: true,
    highlightAttributes: true,
    highlightSkills: true,
    highlightNumbers: true,
    customPatterns: [
      // Number highlighting should come BEFORE ***text*** pattern
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
      // Highlight markdown bold patterns (***text***) with Skyrim gold styling
      {
        pattern: /\*\*\*(.*?)\*\*\*/g,
        className: (match: string) => {
          const content = match.slice(3, -3) // Remove the *** markers
          // Check if the content contains numbers for green/red highlighting
          const numericMatch = content.match(/[+-]?\d+(?:\.\d+)?%?/)
          if (numericMatch) {
            const numericValue = parseFloat(numericMatch[0])
            const isPositive =
              numericMatch[0].startsWith('+') || numericValue > 0
            const isNegative =
              numericMatch[0].startsWith('-') || numericValue < 0
            if (isPositive)
              return 'font-bold text-green-600 bg-skyrim-gold/10 px-1 py-0.5 rounded'
            if (isNegative)
              return 'font-bold text-red-600 bg-skyrim-gold/10 px-1 py-0.5 rounded'
          }
          return 'font-bold text-skyrim-gold bg-skyrim-gold/10 px-1 py-0.5 rounded'
        },
        transform: match => match.slice(3, -3), // Remove the *** markers
      },
      {
        pattern: /<\d+>/g,
        className: 'font-bold italic text-skyrim-gold',
        transform: match => match.slice(1, -1),
      },
      {
        pattern: new RegExp(`\\b(${GAME_ATTRIBUTES.join('|')})\\b`, 'gi'),
        className: 'font-semibold text-primary',
      },
      {
        pattern: new RegExp(`\\b(${GAME_SKILLS.join('|')})\\b`, 'gi'),
        className: 'font-semibold text-primary',
      },
    ],
  }
}
