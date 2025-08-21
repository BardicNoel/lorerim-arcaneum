import { describe, it, expect } from 'vitest'
import {
  sanitizeUnderscoreString,
  sanitizeStatName,
  sanitizeSkillName,
  sanitizeEffectName,
  sanitizeEffectDescription,
  getUserFriendlyStatEnhanced,
} from './stringSanitizer'

describe('birthsigns stringSanitizer', () => {
  describe('sanitizeUnderscoreString', () => {
    it('should convert underscore-separated strings to user-friendly format', () => {
      expect(sanitizeUnderscoreString('stat_modifications')).toBe('Stat Modifications')
      expect(sanitizeUnderscoreString('weapon_damage')).toBe('Weapon Damage')
      expect(sanitizeUnderscoreString('magicka_regeneration')).toBe('Magicka Regeneration')
    })

    it('should handle empty or null input', () => {
      expect(sanitizeUnderscoreString('')).toBe('')
      expect(sanitizeUnderscoreString(null as any)).toBe(null)
    })
  })

  describe('sanitizeStatName', () => {
    it('should sanitize stat names correctly', () => {
      expect(sanitizeStatName('weapon_damage')).toBe('Weapon Damage')
      expect(sanitizeStatName('armor_penetration')).toBe('Armor Penetration')
      expect(sanitizeStatName('unarmed_damage')).toBe('Unarmed Damage')
    })

    it('should handle empty input', () => {
      expect(sanitizeStatName('')).toBe('')
    })
  })

  describe('sanitizeSkillName', () => {
    it('should sanitize skill names correctly', () => {
      expect(sanitizeSkillName('lockpicking_durability')).toBe('Lockpicking Durability')
      expect(sanitizeSkillName('pickpocketing_success')).toBe('Pickpocketing Success')
      expect(sanitizeSkillName('stealth_detection')).toBe('Stealth Detection')
    })

    it('should handle empty input', () => {
      expect(sanitizeSkillName('')).toBe('')
    })
  })

  describe('sanitizeEffectName', () => {
    it('should sanitize effect names', () => {
      expect(sanitizeEffectName('conditional_effect')).toBe('Conditional Effect')
      expect(sanitizeEffectName('mastery_bonus')).toBe('Mastery Bonus')
    })
  })

  describe('sanitizeEffectDescription', () => {
    it('should sanitize effect descriptions', () => {
      expect(sanitizeEffectDescription('Increases weapon_damage by 10%')).toBe('Increases Weapon Damage by 10%')
      expect(sanitizeEffectDescription('Improves lockpicking_durability')).toBe('Improves Lockpicking Durability')
    })
  })

  describe('getUserFriendlyStatEnhanced', () => {
    it('should use stat mapping for known stats', () => {
      expect(getUserFriendlyStatEnhanced('health')).toBe('Health')
      expect(getUserFriendlyStatEnhanced('magicka')).toBe('Magicka')
      expect(getUserFriendlyStatEnhanced('stamina')).toBe('Stamina')
      expect(getUserFriendlyStatEnhanced('weapon_damage')).toBe('Weapon Damage')
    })

    it('should fallback to sanitization for unknown stats', () => {
      expect(getUserFriendlyStatEnhanced('unknown_stat')).toBe('Unknown Stat')
      expect(getUserFriendlyStatEnhanced('custom_effect')).toBe('Custom Effect')
    })
  })
})
