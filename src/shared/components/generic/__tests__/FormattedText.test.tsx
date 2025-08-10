import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getGameTextFormattingOptions } from '../../../utils/gameTextFormatting'
import { FormattedText } from '../FormattedText'

const customPatterns = [
  {
    pattern: /<\d+>/g,
    className: 'bracket',
    transform: (match: string) => match.slice(1, -1),
  },
  {
    pattern: /\*\*\*([^*]+)\*\*\*/g,
    className: 'markdown-bold',
    transform: (match: string) => match.slice(3, -3),
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
      <FormattedText
        text="You gain <10> health."
        options={{ customPatterns }}
      />
    )
    expect(screen.getByText('10').className).toContain('bracket')
  })

  it('renders attribute segments with correct class', () => {
    render(
      <FormattedText
        text="Increase your health and magicka."
        options={{ customPatterns }}
      />
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

  it('renders markdown bold patterns correctly', () => {
    render(
      <FormattedText
        text="You gain ***20%*** health and ***30%*** stamina."
        options={{ customPatterns }}
      />
    )
    expect(screen.getByText('20%').className).toContain('markdown-bold')
    expect(screen.getByText('30%').className).toContain('markdown-bold')
    // Verify the *** markers are removed
    expect(screen.queryByText('***20%***')).toBeNull()
    expect(screen.queryByText('***30%***')).toBeNull()
  })

  it('handles complex markdown bold text', () => {
    render(
      <FormattedText
        text="When at less than ***20% health, you move 20% faster and regenerate 1 stamina per second but also deal 30%*** less damage."
        options={{ customPatterns }}
      />
    )
    // Verify the *** markers are removed and content is styled
    expect(
      screen.getByText(
        '20% health, you move 20% faster and regenerate 1 stamina per second but also deal 30%'
      ).className
    ).toContain('markdown-bold')
    expect(
      screen.queryByText(
        '***20% health, you move 20% faster and regenerate 1 stamina per second but also deal 30%***'
      )
    ).toBeNull()
  })
})

describe('FormattedText with Game Text Formatting', () => {
  it('formats trait description with markdown bold correctly', () => {
    const traitDescription =
      'You possess a natural flight response. When at less than ***20% health, you move 20% faster and regenerate 1 stamina per second but also deal 30%*** less damage when below this threshold.'

    const { container } = render(
      <FormattedText
        text={traitDescription}
        options={getGameTextFormattingOptions()}
      />
    )

    // Verify the *** markers are removed
    expect(container.textContent).not.toContain(
      '***20% health, you move 20% faster and regenerate 1 stamina per second but also deal 30%***'
    )

    // Verify the content is displayed without the markers
    expect(container.textContent).toContain(
      '20% health, you move 20% faster and regenerate 1 stamina per second but also deal 30%'
    )

    // Verify the styling is applied
    const styledElement = container.querySelector(
      '.font-bold.text-green-600.bg-skyrim-gold\\/10'
    )
    expect(styledElement).not.toBeNull()
  })

  it('formats multiple markdown bold patterns in trait description', () => {
    const traitDescription =
      'Your magic flows through melody and vibration. After playing an instrument at an inn, your sonic spells become ***20%*** more powerful. However, your booming presence makes hiring followers more expensive, and your reliance on sound magic weakens your physical attacks by ***15%***.'

    const { container } = render(
      <FormattedText
        text={traitDescription}
        options={getGameTextFormattingOptions()}
      />
    )

    // Verify the *** markers are removed
    expect(container.textContent).not.toContain('***20%***')
    expect(container.textContent).not.toContain('***15%***')

    // Verify the content is displayed without the markers
    expect(container.textContent).toContain('20%')
    expect(container.textContent).toContain('15%')

    // Verify the styling is applied
    const styledElements = container.querySelectorAll(
      '.font-bold.text-green-600.bg-skyrim-gold\\/10'
    )
    expect(styledElements.length).toBeGreaterThan(0)
  })
})
