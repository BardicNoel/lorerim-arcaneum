import { describe, it, expect } from 'vitest'
import {
  sanitizeUnderscoreString,
  sanitizeEffectText,
  sanitizeTargetAttribute,
  sanitizeEffectName,
  sanitizeEffectDescription,
} from './stringSanitizer'

describe('stringSanitizer', () => {
  describe('sanitizeUnderscoreString', () => {
    it('should convert underscore-separated strings to user-friendly format', () => {
      expect(sanitizeUnderscoreString('stat_modifications')).toBe('Stat Modifications')
      expect(sanitizeUnderscoreString('magic_resistance')).toBe('Magic Resistance')
      expect(sanitizeUnderscoreString('weapon_damage')).toBe('Weapon Damage')
    })

    it('should handle empty or null input', () => {
      expect(sanitizeUnderscoreString('')).toBe('')
      expect(sanitizeUnderscoreString(null as any)).toBe(null)
    })
  })

  describe('sanitizeEffectText', () => {
    it('should replace Global variable patterns with user-friendly terms', () => {
      expect(sanitizeEffectText('Global=WSN_Favor_Global_Fractional%')).toBe('favor-based amount%')
      expect(sanitizeEffectText('Global=WSN_Favor_Global_Fractional2%')).toBe('favor-based amount2%')
      expect(sanitizeEffectText('WSN_Favor_Global_Fractional')).toBe('favor-based amount')
    })

    it('should handle underscore patterns', () => {
      expect(sanitizeEffectText('stat_modifications')).toBe('stat modifications')
      expect(sanitizeEffectText('magic_resistance_bonus')).toBe('magic resistance bonus')
    })

    it('should preserve angle brackets', () => {
      expect(sanitizeEffectText('Resist <mag>% of magic.')).toBe('Resist <mag>% of magic.')
      expect(sanitizeEffectText('Global=WSN_Favor_Global_Fractional% better')).toBe('favor-based amount% better')
    })
  })

  describe('sanitizeTargetAttribute', () => {
    it('should format target attributes correctly', () => {
      expect(sanitizeTargetAttribute('MagicResist')).toBe('Magic Resist')
      expect(sanitizeTargetAttribute('Health')).toBe('Health')
      expect(sanitizeTargetAttribute('Stamina')).toBe('Stamina')
    })

    it('should handle null input', () => {
      expect(sanitizeTargetAttribute(null)).toBe('')
    })
  })

  describe('sanitizeEffectName', () => {
    it('should sanitize effect names', () => {
      expect(sanitizeEffectName('Resist Magic')).toBe('Resist Magic')
      expect(sanitizeEffectName('Global_modifier')).toBe('Global Modifier')
    })
  })

  describe('sanitizeEffectDescription', () => {
    it('should sanitize effect descriptions', () => {
      expect(sanitizeEffectDescription('Resist <mag>% of magic.')).toBe('Resist <mag>% of magic.')
      expect(sanitizeEffectDescription('Global=WSN_Favor_Global_Fractional% better')).toBe('favor-based amount% better')
    })
  })
})
