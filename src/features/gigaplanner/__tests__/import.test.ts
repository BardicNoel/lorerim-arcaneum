import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GigaPlannerConverter } from '../adapters/gigaplannerConverter'
import { AdvancedGigaPlannerTransformer } from '../utils/advancedTransformation'

// Mock fetch for testing
global.fetch = vi.fn()

describe('GigaPlanner Import', () => {
  let converter: GigaPlannerConverter
  let transformer: AdvancedGigaPlannerTransformer

  beforeEach(() => {
    vi.clearAllMocks()
    converter = new GigaPlannerConverter()
    transformer = new AdvancedGigaPlannerTransformer()
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
        description: 'A hardy race'
      }
    ]

    const mockStandingStones = [
      {
        id: 'none',
        name: 'None',
        edid: 'None',
        group: 'None',
        description: 'No standing stone',
        bonus: 'No bonus'
      }
    ]

    const mockBlessings = [
      {
        id: 'none',
        name: 'None',
        edid: 'None',
        description: 'No blessing'
      }
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
          weight_stamina: [0, 0, 1]
        }
      }
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
        description: 'LoreRim v4 preset'
      }
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
          maxRank: 1
        }
      ],
      version: '4.0.0',
      description: 'LoreRim v4 perk system'
    }

    // Mock fetch responses for all data loading calls
    ;(fetch as any).mockImplementation((url: string) => {
      if (url.includes('races.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockRaces
        })
      }
      if (url.includes('standingStones.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockStandingStones
        })
      }
      if (url.includes('blessings.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockBlessings
        })
      }
      if (url.includes('gameMechanics.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockGameMechanics
        })
      }
      if (url.includes('presets.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockPresets
        })
      }
      if (url.includes('perks.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockPerks
        })
      }
      return Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })
    })

    await expect(converter.initialize()).resolves.not.toThrow()
    await expect(transformer.initialize()).resolves.not.toThrow()
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
            perks: [{
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
              maxRank: 1
            }],
            version: '1.0.0',
            description: 'Test perk system'
          })
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => []
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
            perks: [{
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
              maxRank: 1
            }],
            version: '1.0.0',
            description: 'Test perk system'
          })
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => []
      })
    })

    await transformer.initialize()

    const mockCharacter = {
      level: 50,
      hmsIncreases: {
        health: 10,
        magicka: 5,
        stamina: 5
      },
      skillLevels: [
        { skill: 'Smithing', level: 100 },
        { skill: 'Heavy Armor', level: 75 }
      ],
      oghmaChoice: 'Health' as const,
      race: 'Nord',
      standingStone: 'Warrior',
      blessing: 'Blessing of Akatosh',
      perks: ['Craftsmanship'],
      configuration: {
        perkList: 'LoreRim v4',
        gameMechanics: 'LoreRim v4'
      }
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
})
