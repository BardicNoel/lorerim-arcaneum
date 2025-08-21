import { describe, it, expect } from 'vitest'
import { formatBuildForDiscordNamesOnly, formatBuildForDiscord } from '../discordExportFormatter'
import type { HydratedBuildData } from '@/shared/types/discordExport'

describe('discordExportFormatter', () => {
  describe('formatBuildForDiscordNamesOnly', () => {
    it('should include attributes section in names-only format', () => {
      const mockData: HydratedBuildData = {
        name: 'Test Character',
        notes: '',
        race: { name: 'Nord', effects: 'Test effects' },
        birthSign: { name: 'Warrior', effects: 'Test effects' },
        traits: [],
        religion: { name: 'Akatosh', effects: 'Divine' },
        skills: { major: [], minor: [], other: [] },
        perks: [],
        destinyPath: [],
        tags: [],
        attributes: {
          level: 5,
          health: 15,
          stamina: 10,
          magicka: 5,
          totalPoints: 30,
        },
      }

      const result = formatBuildForDiscordNamesOnly(mockData)

      expect(result).toContain('__⚔️ Attributes (Level 5)__')
      expect(result).toContain('Health: 15, Stamina: 10, Magicka: 5')
    })

    it('should handle builds with no attribute points', () => {
      const mockData: HydratedBuildData = {
        name: 'Test Character',
        notes: '',
        race: { name: 'Nord', effects: 'Test effects' },
        birthSign: { name: 'Warrior', effects: 'Test effects' },
        traits: [],
        religion: { name: 'Akatosh', effects: 'Divine' },
        skills: { major: [], minor: [], other: [] },
        perks: [],
        destinyPath: [],
        tags: [],
        attributes: {
          level: 1,
          health: 0,
          stamina: 0,
          magicka: 0,
          totalPoints: 0,
        },
      }

      const result = formatBuildForDiscordNamesOnly(mockData)

      expect(result).toContain('__⚔️ Attributes (Level 1)__')
      expect(result).toContain('No attribute points assigned')
    })
  })

  describe('formatBuildForDiscord', () => {
    it('should include attributes section in full format', () => {
      const mockData: HydratedBuildData = {
        name: 'Test Character',
        notes: '',
        race: { name: 'Nord', effects: 'Test effects' },
        birthSign: { name: 'Warrior', effects: 'Test effects' },
        traits: [],
        religion: { name: 'Akatosh', effects: 'Divine' },
        skills: { major: [], minor: [], other: [] },
        perks: [],
        destinyPath: [],
        tags: [],
        attributes: {
          level: 5,
          health: 15,
          stamina: 10,
          magicka: 5,
          totalPoints: 30,
        },
      }

      const result = formatBuildForDiscord(mockData)

      expect(result).toContain('__⚔️ Attributes (Level 5)__')
      expect(result).toContain('Health: 15, Stamina: 10, Magicka: 5')
    })

    it('should handle builds with no attribute points', () => {
      const mockData: HydratedBuildData = {
        name: 'Test Character',
        notes: '',
        race: { name: 'Nord', effects: 'Test effects' },
        birthSign: { name: 'Warrior', effects: 'Test effects' },
        traits: [],
        religion: { name: 'Akatosh', effects: 'Divine' },
        skills: { major: [], minor: [], other: [] },
        perks: [],
        destinyPath: [],
        tags: [],
        attributes: {
          level: 1,
          health: 0,
          stamina: 0,
          magicka: 0,
          totalPoints: 0,
        },
      }

      const result = formatBuildForDiscord(mockData)

      expect(result).toContain('__⚔️ Attributes (Level 1)__')
      expect(result).toContain('No attribute points assigned')
    })
  })
}) 