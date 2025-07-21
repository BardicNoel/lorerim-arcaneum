import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormattedText } from '../FormattedText'
import React from 'react'

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

describe('FormattedText', () => {
  it('renders bracket segments with correct class', () => {
    render(
      <FormattedText text="You gain <10> health." options={{ customPatterns }} />
    )
    expect(screen.getByText('10').className).toContain('bracket')
  })

  it('renders attribute segments with correct class', () => {
    render(
      <FormattedText text="Increase your health and magicka." options={{ customPatterns }} />
    )
    const healthEls = screen.getAllByText(/health/i)
    const magickaEls = screen.getAllByText(/magicka/i)
    expect(healthEls.some(el => el.className.includes('attribute'))).toBe(true)
    expect(magickaEls.some(el => el.className.includes('attribute'))).toBe(true)
  })

  it('renders positive numbers with correct class', () => {
    render(
      <FormattedText text="Gain +5 health." options={{ customPatterns }} />
    )
    expect(screen.getByText('+5').className).toContain('positive')
  })

  it('renders negative numbers with correct class', () => {
    render(
      <FormattedText text="Lose -3 stamina." options={{ customPatterns }} />
    )
    expect(screen.getByText('-3').className).toContain('negative')
  })

  it('renders neutral numbers with correct class', () => {
    render(
      <FormattedText text="You have 0 magicka." options={{ customPatterns }} />
    )
    expect(screen.getByText('0').className).toContain('neutral')
  })
}) 