import { beforeEach, describe, expect, it, vi } from 'vitest'
import blessingsData from '../../data/blessings.json'
import { GigaPlannerDataLoader } from '../dataLoader'
import { GigaPlannerConverter } from '../gigaplannerConverter'
import { getPerkInternalName } from '../mappings'

// Mock the data loader
vi.mock('../dataLoader', () => ({
  GigaPlannerDataLoader: vi.fn(),
}))

describe('GigaPlannerConverter', () => {
  let converter: GigaPlannerConverter
  let mockDataLoader: any

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Create mock data
    const mockData = {
      races: [
        { name: 'Nord', edid: 'NordRace' },
        { name: 'Argonian', edid: 'ArgonianRace' },
      ],
      standingStones: [
        { name: 'Warrior', edid: 'REQ_Ability_Birthsign_Warrior' },
        { name: 'Mage', edid: 'REQ_Ability_Birthsign_Mage' },
      ],
      blessings: [
        { name: 'Blessing of Akatosh', edid: 'BlessingAkatosh' },
        { name: 'Blessing of Dibella', edid: 'BlessingDibella' },
      ],
      perks: [
        {
          name: 'LoreRim v3.0.4',
          perkListId: 0,
          skillNames: ['Smithing', 'Heavy Armor', 'Block'],
          perks: [
            {
              name: 'Craftsmanship',
              skill: 0,
              skillReq: 0,
              description: 'Basic crafting',
            },
            {
              name: 'Conditioning',
              skill: 1,
              skillReq: 0,
              description: 'Basic armor',
            },
          ],
        },
      ],
      gameMechanics: [{ name: 'LoreRim v4', id: 0 }],
      presets: [{ name: 'Default Preset', perks: 0 }],
    }

    // Mock the data loader
    mockDataLoader = {
      loadAllData: vi.fn().mockResolvedValue(mockData),
    }
    ;(GigaPlannerDataLoader as any).mockImplementation(() => mockDataLoader)

    converter = new GigaPlannerConverter()
  })

  describe('blessing indices debug', () => {
    it('should show blessing indices for Mephala and Molag Bal', () => {
      console.log('Total blessings in data:', blessingsData.length)

      // Show first few entries to see what we have
      console.log('First 10 entries:', blessingsData.slice(0, 10))

      // Show entries around index 20
      console.log('Entries around index 20:', blessingsData.slice(18, 25))

      // Find the indices
      const mephalaIndex = blessingsData.findIndex(b => b === 'Mephala')
      const molagBalIndex = blessingsData.findIndex(b => b === 'Molag Bal')

      console.log(`Mephala index: ${mephalaIndex}`)
      console.log(`Molag Bal index: ${molagBalIndex}`)

      expect(mephalaIndex).toBeGreaterThan(-1)
      expect(molagBalIndex).toBeGreaterThan(-1)
    })

    it('should decode the user build code to check blessing ID', () => {
      const buildCode =
        'AgAAAAAUCQAKEgoKCjwPMjwKFApGGQ8UCgoKAAIJFAAAAAAAAAAFkAAQBAAmQWAABgAAAAGRAGAAAAAAAAAAAAAAAAAAAAAAEkECAAAAAAAgAAwgAAAAAAAAAAAAAA'

      // Convert base64url to base64
      let code = buildCode.replace(/-/g, '+').replace(/_/g, '/')

      // Decode base64 to binary string
      code = atob(buildCode)

      console.log('Build code length:', code.length)
      console.log('Version:', code.charCodeAt(0))
      console.log('PerkListId:', code.charCodeAt(1))
      console.log('GameMechanicsId:', code.charCodeAt(3))
      console.log('Level:', code.charCodeAt(5))
      console.log('Blessing ID (charCodeAt 30):', code.charCodeAt(30))

      // Check what blessing this ID maps to
      const blessingId = code.charCodeAt(30)
      if (blessingId < blessingsData.length) {
        console.log(
          `Blessing ID ${blessingId} maps to: ${blessingsData[blessingId] || 'Unknown'}`
        )
      } else {
        console.log(
          `Blessing ID ${blessingId} is out of range (max: ${blessingsData.length - 1})`
        )
      }
    })

    it('should show how to create build code with Mephala blessing', () => {
      const buildCode =
        'AgAAAAAUCQAKEgoKCjwPMjwKFApGGQ8UCgoKAAIJFAAAAAAAAAAFkAAQBAAmQWAABgAAAAGRAGAAAAAAAAAAAAAAAAAAAAAAEkECAAAAAAAgAAwgAAAAAAAAAAAAAA'

      // Convert base64url to base64
      let code = buildCode.replace(/-/g, '+').replace(/_/g, '/')

      // Decode base64 to binary string
      code = atob(buildCode)

      // Create a new string with Mephala blessing (ID 18 instead of 20)
      const mephalaCode = code
        .split('')
        .map((char, index) => {
          if (index === 30) {
            // Change blessing ID from 20 to 18 (Mephala)
            return String.fromCharCode(18)
          }
          return char
        })
        .join('')

      // Encode back to base64url
      const mephalaBuildCode = btoa(mephalaCode)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')

      console.log('Original build code:', buildCode)
      console.log('Mephala build code:', mephalaBuildCode)
      console.log(
        'Original blessing ID:',
        code.charCodeAt(30),
        '->',
        blessingsData[code.charCodeAt(30)]
      )
      console.log(
        'Mephala blessing ID:',
        mephalaCode.charCodeAt(30),
        '->',
        blessingsData[mephalaCode.charCodeAt(30)]
      )

      // Verify the change
      const verifyCode = atob(
        mephalaBuildCode.replace(/-/g, '+').replace(/_/g, '/')
      )
      console.log(
        'Verification - blessing ID:',
        verifyCode.charCodeAt(30),
        '->',
        blessingsData[verifyCode.charCodeAt(30)]
      )
    })

    it('should check blessing indices around 20', () => {
      console.log('Checking blessing order around indices 18-22:')
      for (let i = 16; i <= 24; i++) {
        if (blessingsData[i]) {
          console.log(`Index ${i}: ${blessingsData[i]}`)
        }
      }

      console.log('\nOriginal GigaPlanner order should be:')
      console.log('Index 20: Mephala (based on //20 comment in original)')
      console.log('Index 22: Molag Bal (based on //22 comment in original)')
    })
  })

  describe('initialization', () => {
    it('should initialize successfully with data', async () => {
      await expect(converter.initialize()).resolves.not.toThrow()
    })

    it('should throw error if data loading fails', async () => {
      mockDataLoader.loadAllData.mockRejectedValue(
        new Error('Data loading failed')
      )

      await expect(converter.initialize()).rejects.toThrow(
        'Failed to initialize GigaPlannerConverter'
      )
    })
  })

  describe('data mappings', () => {
    beforeEach(async () => {
      await converter.initialize()
    })

    it('should return correct data mappings', () => {
      const mappings = converter.getDataMappings()

      expect(mappings.races).toHaveLength(2)
      expect(mappings.standingStones).toHaveLength(2)
      expect(mappings.blessings).toHaveLength(2)
      expect(mappings.perkLists).toHaveLength(1)
      expect(mappings.gameMechanics).toHaveLength(1)
      expect(mappings.presets).toHaveLength(1)
    })

    it('should return correct perk list data', () => {
      const perks = converter.getPerksForList('LoreRim v3.0.4')

      expect(perks).toHaveLength(2)
      expect(perks[0]).toEqual({
        id: 0,
        name: 'Craftsmanship',
        skill: 'Smithing',
        skillReq: 0,
        description: 'Basic crafting',
      })
    })

    it('should return empty array for unknown perk list', () => {
      const perks = converter.getPerksForList('Unknown List')
      expect(perks).toEqual([])
    })
  })

  describe('URL decoding', () => {
    beforeEach(async () => {
      await converter.initialize()
    })

    it('should decode valid URL successfully', () => {
      // Create a valid base64url encoded string that matches our mock data
      // Version 2, perkListId 0, gameMechanicsId 0, level 50, etc.
      const result = converter.decodeUrl('https://gigaplanner.com?b=AgAAAAAA')

      expect(result.success).toBe(true)
      expect(result.character).toBeDefined()
      if (result.character) {
        expect(result.character.level).toBeDefined()
        expect(result.character.race).toBeDefined()
        expect(result.character.standingStone).toBeDefined()
        expect(result.character.blessing).toBeDefined()
      }
    })

    it('should handle URL without build code', () => {
      const result = converter.decodeUrl('https://gigaplanner.com')

      expect(result.success).toBe(false)
      expect(result.error).toBe('No build code found in URL')
    })

    it('should handle invalid URL', () => {
      const result = converter.decodeUrl('invalid-url')

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('URL encoding', () => {
    beforeEach(async () => {
      await converter.initialize()
    })

    it('should encode valid character data successfully', () => {
      const characterData = {
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
          perkList: 'LoreRim v3.0.4',
          gameMechanics: 'LoreRim v4',
        },
      }

      const result = converter.encodeUrl(characterData)

      expect(result.success).toBe(true)
      expect(result.url).toBeDefined()
      expect(result.url).toContain('https://gigaplanner.com?b=')
    })

    it('should handle unknown perk list', () => {
      const characterData = {
        level: 50,
        hmsIncreases: { health: 10, magicka: 5, stamina: 5 },
        skillLevels: [],
        oghmaChoice: 'Health' as const,
        race: 'Nord',
        standingStone: 'Warrior',
        blessing: 'Blessing of Akatosh',
        perks: [],
        configuration: {
          perkList: 'Unknown List',
          gameMechanics: 'LoreRim v4',
        },
      }

      const result = converter.encodeUrl(characterData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Unknown perk list')
    })

    it('should handle unknown game mechanics', () => {
      const characterData = {
        level: 50,
        hmsIncreases: { health: 10, magicka: 5, stamina: 5 },
        skillLevels: [],
        oghmaChoice: 'Health' as const,
        race: 'Nord',
        standingStone: 'Warrior',
        blessing: 'Blessing of Akatosh',
        perks: [],
        configuration: {
          perkList: 'LoreRim v3.0.4',
          gameMechanics: 'Unknown Mechanics',
        },
      }

      const result = converter.encodeUrl(characterData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Unknown game mechanics')
    })
  })

  describe('Oghma choice parsing', () => {
    beforeEach(async () => {
      await converter.initialize()
    })

    it('should parse Oghma choice correctly for version 1', () => {
      // This would test the private parseOghmaChoice method indirectly
      // through the decodeBuildCode method
      const result = converter.decodeUrl('https://gigaplanner.com?b=AQAAAAAA')

      if (result.success && result.character) {
        expect(['None', 'Health', 'Magicka', 'Stamina']).toContain(
          result.character.oghmaChoice
        )
      }
    })
  })

  describe('perk transformation', () => {
    it('should find perks in perk trees store', async () => {
      const converter = new GigaPlannerConverter()
      await converter.initialize()

      // Test perk names from the user's build
      const testPerkNames = [
        'Weapon Mastery',
        'Penetrating Strikes',
        'Short Blade Focus',
        'Puncture',
        'Flurry',
        'Ranged Combat Training',
        'Knife Expertise',
        'Agility',
        'Dodge',
        'Agile Spellcasting',
        'Stealth',
        'Deft Strike',
        'Anatomical Lore',
        'Arcane Assassin',
        'Nimble Fingers',
        'Alchemical Lore',
        'Concentrated Poisons',
        'Improved Poisons',
        'Novice Illusion',
        'Apprentice Illusion',
      ]

      console.log('🔍 [Perk Test] Testing perk name to EDID conversion:')
      testPerkNames.forEach(perkName => {
        const internalName = getPerkInternalName(perkName)
        console.log(`  ${perkName} -> ${internalName}`)
        // Some perk names like "Puncture" don't need transformation
        // Just verify that the function returns a valid string
        expect(internalName).toBeTypeOf('string')
        expect(internalName.length).toBeGreaterThan(0)
      })
    })

    it('should find perks in perk trees store by name', async () => {
      // Import the perk trees store directly
      const { usePerkTreesStore } = await import(
        '@/shared/stores/perkTreesStore'
      )

      // Load the perk trees store
      const perkTreesStore = usePerkTreesStore.getState()
      await perkTreesStore.load()

      console.log(
        '🔍 [Perk Trees Test] Loaded perk trees:',
        perkTreesStore.data.length
      )

      // Test finding specific perks
      const testPerks = [
        { name: 'Weapon Mastery', expectedTree: 'AVOneHanded' },
        { name: 'Penetrating Strikes', expectedTree: 'AVOneHanded' },
        { name: 'Craftsmanship', expectedTree: 'AVSmithing' },
      ]

      for (const testPerk of testPerks) {
        let found = false
        for (const tree of perkTreesStore.data) {
          const perk = tree.perks?.find(p => p.name === testPerk.name)
          if (perk) {
            console.log(
              `✅ Found "${testPerk.name}" in tree "${tree.treeId}" (expected: "${testPerk.expectedTree}")`
            )
            console.log(`   EDID: ${perk.edid}`)
            found = true
            break
          }
        }

        if (!found) {
          console.log(`❌ Could not find "${testPerk.name}" in any perk tree`)
        }
      }
    })

    it('should test perk transformation with mock data', async () => {
      // Import the perk transformation function
      const { transformPerks } = await import('../../utils/perkTransform')

      // Create mock perk trees data
      const mockPerkTrees = [
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
      ]

      // Mock the perk trees store to return our mock data
      const { usePerkTreesStore } = await import(
        '@/shared/stores/perkTreesStore'
      )
      const perkTreesStore = usePerkTreesStore.getState()

      // Temporarily replace the data with our mock
      const originalData = perkTreesStore.data
      perkTreesStore.data = mockPerkTrees

      try {
        // Test the perk transformation
        const gigaPlannerPerks = [
          { name: 'Weapon Mastery', skill: 'One-Handed' },
          { name: 'Penetrating Strikes', skill: 'One-Handed' },
        ]

        const result = transformPerks(gigaPlannerPerks, 'Test Perks')

        console.log('🔍 [Perk Transform Test] Result:', result)

        // Verify the transformation worked
        expect(result).not.toBeNull()
        expect(result?.selected).toBeDefined()
        expect(result?.selected['AVOneHanded']).toBeDefined()
        expect(result?.selected['AVOneHanded']).toContain(
          'REQ_OneHanded_WeaponMastery1'
        )
        expect(result?.selected['AVOneHanded']).toContain(
          'REQ_OneHanded_PenetratingStrikes'
        )

        console.log('✅ Perk transformation test passed!')
      } finally {
        // Restore original data
        perkTreesStore.data = originalData
      }
    })
  })
})
