import { describe, it, expect } from 'vitest'
import {
  getBirthsignGroupStyle,
  getBirthsignGroupColor,
  getBirthsignEffectIcon,
  getBirthsignEffectTypeColor,
} from '../birthsignConfig'

describe('birthsignConfig', () => {
  it('returns correct group style for known group', () => {
    const style = getBirthsignGroupStyle('Warrior')
    expect(style.background).toContain('red')
    expect(style.text).toContain('red')
  })

  it('returns default group style for unknown group', () => {
    const style = getBirthsignGroupStyle('Unknown')
    expect(style.background).toContain('yellow')
    expect(style.text).toContain('yellow')
  })

  it('returns correct group color for known group', () => {
    expect(getBirthsignGroupColor('Mage')).toContain('blue')
  })

  it('returns default group color for unknown group', () => {
    expect(getBirthsignGroupColor('Unknown')).toContain('yellow')
  })

  it('returns correct effect icon for known type', () => {
    const iconConfig = getBirthsignEffectIcon('health')
    expect(iconConfig.color).toContain('red')
    expect(iconConfig.icon).toBeTruthy()
    expect(['function', 'object']).toContain(typeof iconConfig.icon)
  })

  it('returns default effect icon for unknown type', () => {
    const iconConfig = getBirthsignEffectIcon('unknown')
    expect(iconConfig.color).toContain('muted')
    expect(iconConfig.icon).toBeTruthy()
    expect(['function', 'object']).toContain(typeof iconConfig.icon)
  })

  it('returns correct effect type color for bonus', () => {
    expect(getBirthsignEffectTypeColor('bonus')).toContain('green')
  })

  it('returns correct effect type color for penalty', () => {
    expect(getBirthsignEffectTypeColor('penalty')).toContain('red')
  })

  it('returns correct effect type color for conditional', () => {
    expect(getBirthsignEffectTypeColor('conditional')).toContain('purple')
  })

  it('returns correct effect type color for mastery', () => {
    expect(getBirthsignEffectTypeColor('mastery')).toContain('blue')
  })

  it('returns neutral color for unknown effect type', () => {
    // @ts-expect-error: testing fallback
    expect(getBirthsignEffectTypeColor('unknown')).toContain('skyrim-gold')
  })
})
