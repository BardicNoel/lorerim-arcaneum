import { describe, it, expect, vi, beforeEach } from 'vitest'
import { hydrateBuildData } from '../buildExportService'
import type { BuildState } from '@/shared/types/build'

// Mock the religions store
vi.mock('@/shared/stores/religionsStore', () => ({
  useReligionsStore: {
    getState: vi.fn(() => ({
      data: [
        {
          id: 'Akatosh',
          name: 'Akatosh',
          type: 'Divine',
          pantheon: 'Divine',
          tenet: {
            description: 'Fulfill your destiny by saving Tamriel. Raise your character level. Absorb dragon souls.',
            effects: [
              {
                effectDescription: 'Fulfill your destiny by saving Tamriel. Raise your character level. Absorb dragon souls.'
              }
            ]
          },
          boon1: {
            spellName: 'Father of Dragons',
            effects: [
              {
                effectDescription: 'Attacks, spells, scrolls, shouts and enchantments are better against dragons.'
              }
            ]
          },
          boon2: {
            spellName: 'Turn the Hourglass',
            effects: [
              {
                effectDescription: 'Praying to Akatosh resets the cooldown of your most recently used shout and power.'
              }
            ]
          }
        },
        {
          id: 'Mara',
          name: 'Mara',
          type: 'Divine',
          pantheon: 'Divine',
        },
      ],
    })),
  },
}))

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

    it('should resolve religion by lowercase hyphenated ID', () => {
      const mockBuild: BuildState = {
        v: 1,
        name: 'Test Character',
        notes: '',
        race: null,
        stone: null,
        religion: 'akatosh', // This is the format stored when a religion is selected
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

      expect(hydratedData.religion.name).toBe('Akatosh')
      expect(hydratedData.religion.effects).toBe('Divine')
      expect(hydratedData.religion.tenets).toBe('Fulfill your destiny by saving Tamriel. Raise your character level. Absorb dragon souls.')
      expect(hydratedData.religion.followerBoon).toBe('Attacks, spells, scrolls, shouts and enchantments are better against dragons.')
      expect(hydratedData.religion.devoteeBoon).toBe('Praying to Akatosh resets the cooldown of your most recently used shout and power.')
    })

    it('should resolve religion by original ID', () => {
      const mockBuild: BuildState = {
        v: 1,
        name: 'Test Character',
        notes: '',
        race: null,
        stone: null,
        religion: 'Akatosh', // This is the original ID format
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

      expect(hydratedData.religion.name).toBe('Akatosh')
      expect(hydratedData.religion.effects).toBe('Divine')
      expect(hydratedData.religion.tenets).toBe('Fulfill your destiny by saving Tamriel. Raise your character level. Absorb dragon souls.')
      expect(hydratedData.religion.followerBoon).toBe('Attacks, spells, scrolls, shouts and enchantments are better against dragons.')
      expect(hydratedData.religion.devoteeBoon).toBe('Praying to Akatosh resets the cooldown of your most recently used shout and power.')
    })

    it('should handle unknown religion gracefully', () => {
      const mockBuild: BuildState = {
        v: 1,
        name: 'Test Character',
        notes: '',
        race: null,
        stone: null,
        religion: 'unknown-religion',
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

      expect(hydratedData.religion.name).toBe('Unknown Religion')
      expect(hydratedData.religion.effects).toBe('No effects')
    })
  })
}) 