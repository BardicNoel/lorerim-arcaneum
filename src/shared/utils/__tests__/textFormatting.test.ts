import { describe, it, expect } from 'vitest'
import { parseFormattedText } from '../textFormatting'

const customPatterns = [
  {
    pattern: /<\d+>/g,
    className: 'bracket',
    transform: (match: string) => match.slice(1, -1),
  },
  {
    pattern: /\b(health|magicka|stamina)\b/gi,
    className: 'attribute',
  },
  {
    pattern: /\b(one-handed|two-handed|archery)\b/gi,
    className: 'skill',
  },
  {
    pattern: /[+-]?\d+(?:\.\d+)?%?/g,
    className: (match: string) => {
      const numericValue = parseFloat(match)
      const isPositive = match.startsWith('+') || numericValue > 0
      const isNegative = match.startsWith('-') || numericValue < 0
      if (isPositive) return 'positive'
      if (isNegative) return 'negative'
      return 'neutral'
    },
  },
]

describe('parseFormattedText', () => {
  it('highlights brackets', () => {
    const result = parseFormattedText('You gain <10> health.', { customPatterns })
    expect(result.some(seg => seg.className === 'bracket' && seg.text === '10')).toBe(true)
  })

  it('highlights attributes', () => {
    const result = parseFormattedText('Increase your health and magicka.', { customPatterns })
    expect(result.some(seg => seg.className === 'attribute' && seg.text.toLowerCase() === 'health')).toBe(true)
    expect(result.some(seg => seg.className === 'attribute' && seg.text.toLowerCase() === 'magicka')).toBe(true)
  })

  it('highlights skills', () => {
    const result = parseFormattedText('Boost your one-handed skill.', { customPatterns })
    expect(result.some(seg => seg.className === 'skill' && seg.text.toLowerCase() === 'one-handed')).toBe(true)
  })

  it('highlights positive numbers as positive', () => {
    const result = parseFormattedText('Gain +5 health.', { customPatterns })
    expect(result.some(seg => seg.className === 'positive' && seg.text === '+5')).toBe(true)
  })

  it('highlights negative numbers as negative', () => {
    const result = parseFormattedText('Lose -3 stamina.', { customPatterns })
    expect(result.some(seg => seg.className === 'negative' && seg.text === '-3')).toBe(true)
  })

  it('highlights neutral numbers as neutral', () => {
    const result = parseFormattedText('You have 0 magicka.', { customPatterns })
    expect(result.some(seg => seg.className === 'neutral' && seg.text === '0')).toBe(true)
  })
}) 