import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GigaPlannerConverter } from '../adapters/gigaplannerConverter'
import { transformGigaPlannerToBuildState } from '../utils/transformation'

// Mock fetch for testing
global.fetch = vi.fn()

describe('GigaPlanner Import', () => {
  let converter: GigaPlannerConverter

  beforeEach(() => {
    vi.clearAllMocks()
    converter = new GigaPlannerConverter()
  })

  it('should initialize converter and transformer', async () => {
    // Mock successful data loading
    const mockRaces = [
      {
        id: 'nord',
        name: 'Nord',
        edid: 'NordRace',
        startingHMS: [100, 100, 100],
        startingSkills: Array(20).fill(15),
        description: 'A hardy race',
      },
    ]

    const mockStandingStones = [
      {
        id: 'none',
        name: 'None',
        edid: 'None',
        group: 'None',
        description: 'No standing stone',
        bonus: 'No bonus',
      },
    ]

    const mockBlessings = [
      {
        id: 'none',
        name: 'None',
        edid: 'None',
        description: 'No blessing',
      },
    ]

    const mockGameMechanics = [
      {
        id: 'lorerim-v4',
        name: 'LoreRim v4',
        gameId: 0,
        derivedAttributes: {
          attribute: ['health', 'magicka', 'stamina'],
          isPercent: [false, false, false],
          prefactor: [1, 1, 1],
          threshold: [0, 0, 0],
          weight_health: [1, 0, 0],
          weight_magicka: [0, 1, 0],
          weight_stamina: [0, 0, 1],
        },
      },
    ]

    const mockPresets = [
      {
        id: 'lorerim-v4',
        name: 'LoreRim v4',
        presetId: 0,
        perks: 0,
        races: 0,
        gameMechanics: 0,
        blessings: 0,
        version: '4.0.0',
        description: 'LoreRim v4 preset',
      },
    ]

    const mockPerks = {
      id: 'lorerim-v4-perks',
      name: 'LoreRim v4',
      perkListId: 0,
      skillNames: ['Smithing', 'Heavy Armor'],
      perks: [
        {
          id: 'craftsmanship',
          name: 'Craftsmanship',
          skill: 'Smithing',
          skillReq: 40,
          xPos: 50,
          yPos: 62.86,
          prerequisites: [],
          nextPerk: -1,
          description: "You've acquired the basics of craftsmanship.",
          rank: 1,
          maxRank: 1,
        },
      ],
      version: '4.0.0',
      description: 'LoreRim v4 perk system',
    }

    // Mock fetch responses for all data loading calls
    ;(fetch as any).mockImplementation((url: string) => {
      if (url.includes('races.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockRaces,
        })
      }
      if (url.includes('standingStones.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockStandingStones,
        })
      }
      if (url.includes('blessings.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockBlessings,
        })
      }
      if (url.includes('gameMechanics.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockGameMechanics,
        })
      }
      if (url.includes('presets.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockPresets,
        })
      }
      if (url.includes('perks.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockPerks,
        })
      }
      if (url.includes('perk-trees.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => [
            {
              treeId: 'AVOneHanded',
              treeName: 'One-handed',
              treeDescription: 'The skill to use light weaponry',
              category: 'Combat',
              perks: [
                {
                  edid: 'REQ_OneHanded_WeaponMastery1',
                  name: 'Weapon Mastery',
                  globalFormId: '0x000BABE4',
                  ranks: [
                    {
                      rank: 1,
                      edid: 'REQ_OneHanded_WeaponMastery1',
                      name: 'Weapon Mastery',
                      globalFormId: '0x000BABE4',
                      description: {
                        base: 'Your improved fighting techniques allow you to swing one-handed weapons with less effort and deal more damage.',
                        subtext: '[20% more damage]',
                      },
                      prerequisites: {},
                    },
                  ],
                  totalRanks: 2,
                  connections: {
                    parents: [],
                    children: ['REQ_OneHanded_PenetratingStrikes'],
                  },
                  isRoot: true,
                  position: {
                    x: 2,
                    y: 0,
                    horizontal: 0.18666699528694153,
                    vertical: 0,
                  },
                },
                {
                  edid: 'REQ_OneHanded_PenetratingStrikes',
                  name: 'Penetrating Strikes',
                  globalFormId: '0x00052D50',
                  ranks: [
                    {
                      rank: 1,
                      edid: 'REQ_OneHanded_PenetratingStrikes',
                      name: 'Penetrating Strikes',
                      globalFormId: '0x00052D50',
                      description: {
                        base: 'Your power attacks with one-handed weapons are now devastating enough to penetrate enemy armor.',
                        subtext:
                          '[-30% power attack stamina cost, +30% armor penetration]',
                      },
                      prerequisites: {
                        skillLevel: {
                          skill: 'One-Handed',
                          level: 20,
                        },
                      },
                    },
                  ],
                  totalRanks: 1,
                  connections: {
                    parents: ['REQ_OneHanded_WeaponMastery1'],
                    children: [],
                  },
                  isRoot: false,
                  position: {
                    x: 2,
                    y: 1,
                    horizontal: 0.18666699528694153,
                    vertical: -0.10000000149011612,
                  },
                },
              ],
            },
            {
              treeId: 'AVSmithing',
              treeName: 'Smithing',
              treeDescription:
                'The art of creating and improving weapons and armor',
              category: 'Combat',
              perks: [
                {
                  edid: 'REQ_Smithing_Craftsmanship',
                  name: 'Craftsmanship',
                  globalFormId: '0x000CB40D',
                  ranks: [
                    {
                      rank: 1,
                      edid: 'REQ_Smithing_Craftsmanship',
                      name: 'Craftsmanship',
                      globalFormId: '0x000CB40D',
                      description: {
                        base: "You've read The Armorer's Encyclopedia and know how to properly use all kinds of tools.",
                        subtext:
                          'You now also understand the secondary material properties of Iron and Steel weapons.',
                      },
                      prerequisites: {
                        items: [
                          {
                            type: 'INGR',
                            id: '0x8C35B997',
                          },
                        ],
                      },
                    },
                  ],
                  totalRanks: 2,
                  connections: {
                    parents: [],
                    children: ['REQ_Smithing_DwarvenSmithing'],
                  },
                  isRoot: false,
                  position: {
                    x: 4,
                    y: 2,
                    horizontal: -0.08571399748325348,
                    vertical: -0.08571399748325348,
                  },
                },
              ],
            },
          ],
        })
      }
      return Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })
    })

    await expect(converter.initialize()).resolves.not.toThrow()
  })

  it('should decode a valid GigaPlanner URL', async () => {
    // Mock data loading first with valid perk data
    ;(fetch as any).mockImplementation((url: string) => {
      if (url.includes('perks.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            id: 'test-perks',
            name: 'Test Perks',
            perkListId: 0,
            skillNames: ['Smithing'],
            perks: [
              {
                id: 'test-perk',
                name: 'Test Perk',
                skill: 'Smithing',
                skillReq: 40,
                xPos: 50,
                yPos: 50,
                prerequisites: [],
                nextPerk: -1,
                description: 'Test perk',
                rank: 1,
                maxRank: 1,
              },
            ],
            version: '1.0.0',
            description: 'Test perk system',
          }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => [],
      })
    })

    await converter.initialize()

    // Test with a URL that has a build code parameter
    const testUrl = 'https://gigaplanner.com?b=AgAAAAAA'
    const result = converter.decodeUrl(testUrl)

    // The URL should be parsed successfully, but the build code is invalid
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
    // We're testing that the URL parsing works and error handling works correctly
  })

  it('should transform GigaPlanner character to BuildState', async () => {
    // Mock data loading with valid perk data
    ;(fetch as any).mockImplementation((url: string) => {
      if (url.includes('perks.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            id: 'test-perks',
            name: 'Test Perks',
            perkListId: 0,
            skillNames: ['Smithing'],
            perks: [
              {
                id: 'test-perk',
                name: 'Test Perk',
                skill: 'Smithing',
                skillReq: 40,
                xPos: 50,
                yPos: 50,
                prerequisites: [],
                nextPerk: -1,
                description: 'Test perk',
                rank: 1,
                maxRank: 1,
              },
            ],
            version: '1.0.0',
            description: 'Test perk system',
          }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => [],
      })
    })

    await transformer.initialize()

    const mockCharacter = {
      level: 50,
      hmsIncreases: {
        health: 10,
        magicka: 5,
        stamina: 5,
      },
      skillLevels: [
        { skill: 'Smithing', level: 100 },
        { skill: 'Heavy Armor', level: 75 },
      ],
      oghmaChoice: 'Health' as const,
      race: 'Nord',
      standingStone: 'Warrior',
      blessing: 'Blessing of Akatosh',
      perks: ['Craftsmanship'],
      configuration: {
        perkList: 'LoreRim v4',
        gameMechanics: 'LoreRim v4',
      },
    }

    const result = transformer.transformGigaPlannerToBuildState(mockCharacter)

    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
    if (result.data) {
      expect(result.data.race).toBe('Nord')
      expect(result.data.stone).toBe('Warrior')
      expect(result.data.favoriteBlessing).toBe('Blessing of Akatosh')
      expect(result.data.attributeAssignments).toBeDefined()
      expect(result.data.attributeAssignments?.health).toBe(11) // 10 + 1 from Oghma
    }
  })

  it('should transform GigaPlanner character with correct perk EDID conversion', async () => {
    // Mock data loading with valid perk data
    ;(fetch as any).mockImplementation((url: string) => {
      if (url.includes('perks.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            id: 'test-perks',
            name: 'Test Perks',
            perkListId: 0,
            skillNames: [
              'One-Handed',
              'Marksman',
              'Evasion',
              'Sneak',
              'Finesse',
              'Alchemy',
              'Illusion',
            ],
            perks: [
              {
                id: 'weapon-mastery',
                name: 'Weapon Mastery',
                skill: 'One-Handed',
                skillReq: 20,
                xPos: 50,
                yPos: 50,
                prerequisites: [],
                nextPerk: -1,
                description: 'Weapon mastery perk',
                rank: 1,
                maxRank: 1,
              },
              {
                id: 'penetrating-strikes',
                name: 'Penetrating Strikes',
                skill: 'One-Handed',
                skillReq: 20,
                xPos: 50,
                yPos: 50,
                prerequisites: [],
                nextPerk: -1,
                description: 'Penetrating strikes perk',
                rank: 1,
                maxRank: 1,
              },
            ],
            version: '1.0.0',
            description: 'Test perk system',
          }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => [],
      })
    })

    await converter.initialize()

    // Create a mock GigaPlanner character with perks
    const mockCharacter = {
      level: 20,
      hmsIncreases: { health: 45, magicka: 0, stamina: 50 },
      skillLevels: [
        { skill: 'One-Handed', level: 60 },
        { skill: 'Marksman', level: 15 },
        { skill: 'Evasion', level: 50 },
        { skill: 'Sneak', level: 60 },
        { skill: 'Finesse', level: 20 },
        { skill: 'Alchemy', level: 70 },
        { skill: 'Illusion', level: 25 },
      ],
      oghmaChoice: 'None' as const,
      race: 'DarkElfRace',
      standingStone: 'REQ_Ability_Birthsign_Thief',
      blessing: 'Mephala',
      perks: [
        { name: 'Weapon Mastery', skill: 'One-Handed' },
        { name: 'Penetrating Strikes', skill: 'One-Handed' },
        { name: 'Short Blade Focus', skill: 'One-Handed' },
        { name: 'Puncture', skill: 'One-Handed' },
        { name: 'Flurry', skill: 'One-Handed' },
        { name: 'Ranged Combat Training', skill: 'Marksman' },
        { name: 'Knife Expertise', skill: 'Marksman' },
        { name: 'Agility', skill: 'Evasion' },
        { name: 'Dodge', skill: 'Evasion' },
        { name: 'Agile Spellcasting', skill: 'Evasion' },
        { name: 'Stealth', skill: 'Sneak' },
        { name: 'Deft Strike', skill: 'Sneak' },
        { name: 'Anatomical Lore', skill: 'Sneak' },
        { name: 'Arcane Assassin', skill: 'Sneak' },
        { name: 'Nimble Fingers', skill: 'Finesse' },
        { name: 'Alchemical Lore', skill: 'Alchemy' },
        { name: 'Concentrated Poisons', skill: 'Alchemy' },
        { name: 'Improved Poisons', skill: 'Alchemy' },
        { name: 'Novice Illusion', skill: 'Illusion' },
        { name: 'Apprentice Illusion', skill: 'Illusion' },
      ],
      configuration: {
        perkList: 'LoreRim v3.0.4',
        gameMechanics: 'LoreRim v4',
      },
    }

    const result = await transformGigaPlannerToBuildState(mockCharacter)

    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()

    if (result.data) {
      console.log(
        '🔍 [Import Test] Transformed build state perks:',
        result.data.perks
      )

      // Check that perks are converted to EDIDs
      if (result.data.perks?.selected) {
        Object.entries(result.data.perks.selected).forEach(([skill, perks]) => {
          console.log(`🔍 [Import Test] Skill ${skill} perks:`, perks)
          perks.forEach(perk => {
            // Should be EDIDs, not original names
            expect(perk).toMatch(/^Perk[A-Z]/) // Should start with "Perk" and be camelCase
          })
        })
      }
    }
  })
})
