import { describe, it, expect } from 'vitest'
import { formatBuildForDiscordNamesOnly, formatBuildForDiscord } from '../discordExportFormatter'
import type { HydratedBuildData } from '@/shared/types/discordExport'

describe('discordExportFormatter', () => {
  const mockHydratedData: HydratedBuildData = {
    name: 'Test Character',
    notes: 'Test notes',
    race: { name: 'Nord' },
    birthSign: { name: 'The Warrior', effects: 'Combat bonuses' },
    traits: [
      { name: 'Warrior Born', effects: 'Combat skill bonuses', type: 'regular' }
    ],
    religion: { name: 'Talos', effects: 'Divine blessings' },
    skills: {
      major: [{ name: 'One-Handed', level: 50 }],
      minor: [{ name: 'Heavy Armor' }],
      other: []
    },
    perks: [
      {
        skillName: 'One-Handed',
        perks: [{ name: 'Armsman', effects: 'Increased damage', rank: 2 }]
      }
    ],
    destinyPath: [{ name: 'Warrior Path', effects: 'Combat mastery' }],
    tags: ['lorerim', 'nord', 'warrior'],
    attributes: {
      level: 7,
      health: 3,
      stamina: 2,
      magicka: 1,
      totalPoints: 6
    }
  }

  describe('formatBuildForDiscordNamesOnly', () => {
    it('should include attributes section in names-only format', () => {
      const formatted = formatBuildForDiscordNamesOnly(mockHydratedData)
      
      expect(formatted).toContain('__⚔️ Attributes (Level 7)__')
      expect(formatted).toContain('Health: 3, Stamina: 2, Magicka: 1')
    })

    it('should handle builds with no attribute points', () => {
      const dataWithNoAttributes = {
        ...mockHydratedData,
        attributes: {
          level: 1,
          health: 0,
          stamina: 0,
          magicka: 0,
          totalPoints: 0
        }
      }
      
      const formatted = formatBuildForDiscordNamesOnly(dataWithNoAttributes)
      
      expect(formatted).toContain('__⚔️ Attributes (Level 1)__')
      expect(formatted).toContain('No attribute points assigned')
    })
  })

  describe('formatBuildForDiscord', () => {
    it('should include attributes section in full format', () => {
      const formatted = formatBuildForDiscord(mockHydratedData)
      
      expect(formatted).toContain('__⚔️ Attributes (Level 7)__')
      expect(formatted).toContain('Health: 3, Stamina: 2, Magicka: 1')
    })

    it('should handle builds with no attribute points', () => {
      const dataWithNoAttributes = {
        ...mockHydratedData,
        attributes: {
          level: 1,
          health: 0,
          stamina: 0,
          magicka: 0,
          totalPoints: 0
        }
      }
      
      const formatted = formatBuildForDiscord(dataWithNoAttributes)
      
      expect(formatted).toContain('__⚔️ Attributes (Level 1)__')
      expect(formatted).toContain('No attribute points assigned')
    })
  })
}) 