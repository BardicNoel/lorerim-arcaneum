import { describe, it, expect } from 'vitest'
import { hydrateBuildData } from '../buildExportService'
import type { BuildState } from '@/shared/types/build'

describe('buildExportService', () => {
  describe('hydrateBuildData', () => {
    it('should include attribute assignments in hydrated data', () => {
      const mockBuild: BuildState = {
        v: 1,
        name: 'Test Character',
        notes: 'Test notes',
        race: null,
        stone: null,
        religion: null,
        traits: {
          regular: [],
          bonus: [],
        },
        traitLimits: {
          regular: 2,
          bonus: 1,
        },
        skills: {
          major: [],
          minor: [],
        },
        perks: {
          selected: {},
          ranks: {},
        },
        skillLevels: {},
        equipment: [],
        userProgress: {
          unlocks: [],
        },
        destinyPath: [],
        attributeAssignments: {
          health: 3,
          stamina: 2,
          magicka: 1,
          level: 7,
          assignments: {
            2: 'health',
            3: 'health',
            4: 'stamina',
            5: 'health',
            6: 'stamina',
            7: 'magicka',
          },
        },
      }

      const hydratedData = hydrateBuildData(mockBuild)

      expect(hydratedData.attributes).toBeDefined()
      expect(hydratedData.attributes.level).toBe(7)
      expect(hydratedData.attributes.health).toBe(3)
      expect(hydratedData.attributes.stamina).toBe(2)
      expect(hydratedData.attributes.magicka).toBe(1)
      expect(hydratedData.attributes.totalPoints).toBe(6)
    })

    it('should handle default attribute assignments', () => {
      const mockBuild: BuildState = {
        v: 1,
        name: 'Test Character',
        notes: '',
        race: null,
        stone: null,
        religion: null,
        traits: {
          regular: [],
          bonus: [],
        },
        traitLimits: {
          regular: 2,
          bonus: 1,
        },
        skills: {
          major: [],
          minor: [],
        },
        perks: {
          selected: {},
          ranks: {},
        },
        skillLevels: {},
        equipment: [],
        userProgress: {
          unlocks: [],
        },
        destinyPath: [],
        attributeAssignments: {
          health: 0,
          stamina: 0,
          magicka: 0,
          level: 1,
          assignments: {},
        },
      }

      const hydratedData = hydrateBuildData(mockBuild)

      expect(hydratedData.attributes.level).toBe(1)
      expect(hydratedData.attributes.health).toBe(0)
      expect(hydratedData.attributes.stamina).toBe(0)
      expect(hydratedData.attributes.magicka).toBe(0)
      expect(hydratedData.attributes.totalPoints).toBe(0)
    })
  })
}) 