/**
 * GigaPlanner Bidirectional Converter
 *
 * This module provides complete functionality to:
 * 1. Decode GigaPlanner URLs into structured character data
 * 2. Encode character data back into GigaPlanner URLs
 * 3. Provide mappings between IDs and names for all game elements
 */

import { GigaPlannerDataLoader } from './dataLoader'

// Types for the converter
export interface GigaPlannerCharacter {
  level: number
  hmsIncreases: {
    health: number
    magicka: number
    stamina: number
  }
  skillLevels: Array<{
    skill: string
    level: number
  }>
  oghmaChoice: 'None' | 'Health' | 'Magicka' | 'Stamina'
  race: string
  standingStone: string
  blessing: string
  perks: Array<{ name: string; skill: number | string }>
  traits?: string[] // Optional traits field
  configuration: {
    perkList: string
    gameMechanics: string
  }
}

export interface GigaPlannerDecodeResult {
  success: boolean
  preset?: string | null
  character?: GigaPlannerCharacter
  error?: string
}

export interface GigaPlannerEncodeResult {
  success: boolean
  url?: string
  error?: string
}

export interface GigaPlannerDataMappings {
  perkLists: Array<{ id: number; name: string }>
  races: Array<{ id: number; name: string }>
  gameMechanics: Array<{ id: number; name: string }>
  standingStones: Array<{ id: number; name: string }>
  blessings: Array<{ id: number; name: string }>
  presets: Array<{ id: number; name: string }>
}

export class GigaPlannerConverter {
  private dataLoader: GigaPlannerDataLoader
  private data: any = null
  private lookupMaps: any = {}

  constructor() {
    this.dataLoader = new GigaPlannerDataLoader()
  }

  /**
   * Initialize the converter by loading all data and creating lookup maps
   */
  async initialize(): Promise<void> {
    try {
      // Load all data using our data loader
      this.data = await this.dataLoader.loadAllData()

      // Create lookup maps for efficient name/ID conversion
      this.createLookupMaps()
    } catch (error) {
      throw new Error(`Failed to initialize GigaPlannerConverter: ${error}`)
    }
  }

  /**
   * Create lookup maps for efficient name/ID conversion
   */
  private createLookupMaps(): void {
    if (!this.data) {
      throw new Error('Data not loaded. Call initialize() first.')
    }

    // Races
    this.lookupMaps.raceNameToId = {}
    this.lookupMaps.raceIdToName = {}
    this.data.races.forEach((race: any, index: number) => {
      this.lookupMaps.raceNameToId[race.name] = index
      this.lookupMaps.raceIdToName[index] = race.name
    })

    // Standing Stones
    this.lookupMaps.stoneNameToId = {}
    this.lookupMaps.stoneIdToName = {}
    this.data.standingStones.forEach((stone: any, index: number) => {
      this.lookupMaps.stoneNameToId[stone.name] = index
      this.lookupMaps.stoneIdToName[index] = stone.name
    })

    // Blessings
    this.lookupMaps.blessingNameToId = {}
    this.lookupMaps.blessingIdToName = {}
    this.data.blessings.forEach((blessing: any, index: number) => {
      this.lookupMaps.blessingNameToId[blessing.name] = index
      this.lookupMaps.blessingIdToName[index] = blessing.name
    })

    // Perk Lists (Subclasses)
    this.lookupMaps.perkListNameToId = {}
    this.lookupMaps.perkListIdToName = {}
    this.data.perks.forEach((perkList: any) => {
      this.lookupMaps.perkListNameToId[perkList.name] = perkList.perkListId
      this.lookupMaps.perkListIdToName[perkList.perkListId] = perkList.name
    })

    // Game Mechanics
    this.lookupMaps.mechanicsNameToId = {}
    this.lookupMaps.mechanicsIdToName = {}
    this.data.gameMechanics.forEach((mechanics: any) => {
      this.lookupMaps.mechanicsNameToId[mechanics.name] = mechanics.id
      this.lookupMaps.mechanicsIdToName[mechanics.id] = mechanics.name
    })
  }

  /**
   * Decode a GigaPlanner URL into structured character data
   * @param url - The GigaPlanner URL
   * @returns Structured character data with names instead of IDs
   */
  decodeUrl(url: string): GigaPlannerDecodeResult {
    try {
      const urlObj = new URL(url)
      const buildCode = urlObj.searchParams.get('b')
      const presetNum = urlObj.searchParams.get('p')

      if (!buildCode) {
        return {
          success: false,
          error: 'No build code found in URL',
        }
      }

      const characterData = this.decodeBuildCode(buildCode)
      const preset =
        presetNum && this.data.presets[parseInt(presetNum)]
          ? this.data.presets[parseInt(presetNum)].name
          : null

      return {
        success: true,
        preset,
        character: characterData,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Decode a build code string into character data
   * @param buildCode - The base64url encoded build code
   * @returns Character data with names
   */
  private decodeBuildCode(buildCode: string): GigaPlannerCharacter {
    // Convert base64url to base64
    let code = buildCode.replace(/-/g, '+').replace(/_/g, '/')

    // Decode base64 to binary string
    code = atob(code)

    const version = code.charCodeAt(0)

    // Parse configuration
    const perkListId = code.charCodeAt(1)
    const gameMechanicsId = code.charCodeAt(3)

    const perkList = this.data.perks.find(
      (p: any) => p.perkListId === perkListId
    )
    console.log('🔍 [Converter] Looking for perkListId:', perkListId)
    console.log('🔍 [Converter] Looking for gameMechanicsId:', gameMechanicsId)
    console.log('🔍 [Converter] Available perk lists:', this.data.perks.map((p: any) => ({ id: p.perkListId, name: p.name })))
    console.log('🔍 [Converter] Available game mechanics:', this.data.gameMechanics.map((g: any) => ({ id: g.gameId, name: g.name })))
    
    const gameMechanics = this.data.gameMechanics.find(
      (g: any) => g.gameId === gameMechanicsId
    )

    if (!perkList) {
      throw new Error(`Invalid perk list ID: ${perkListId}`)
    }
    if (!gameMechanics) {
      throw new Error(`Invalid game mechanics ID: ${gameMechanicsId}`)
    }

    // Parse character data
    const character: GigaPlannerCharacter = {
      level: code.charCodeAt(5),
      hmsIncreases: {
        health: code.charCodeAt(6),
        magicka: code.charCodeAt(7),
        stamina: code.charCodeAt(8),
      },
      skillLevels: [],
      oghmaChoice: this.parseOghmaChoice(code.charCodeAt(27), version),
      race: this.lookupMaps.raceIdToName[code.charCodeAt(28)] || 'Unknown',
      standingStone:
        this.lookupMaps.stoneIdToName[code.charCodeAt(29)] || 'Unknown',
      blessing:
        this.lookupMaps.blessingIdToName[code.charCodeAt(30)] || 'Unknown',
      perks: this.parsePerks(code, perkList),
      configuration: {
        perkList: perkList.name,
        gameMechanics: gameMechanics.name,
      },
    }

    // Parse skill levels
    for (let i = 0; i < 18; i++) {
      character.skillLevels.push({
        skill: perkList.skillNames[i],
        level: code.charCodeAt(9 + i),
      })
    }

    // Version 2 specific handling
    if (version === 2) {
      character.skillLevels.push({
        skill: 'Level',
        level: character.level,
      })
    }

    return character
  }

  /**
   * Parse Oghma choice from encoded value
   */
  private parseOghmaChoice(
    encodedValue: number,
    version: number
  ): 'None' | 'Health' | 'Magicka' | 'Stamina' {
    let choice = encodedValue
    if (version === 2) {
      choice = choice >> 4
    }

    const choices: Array<'None' | 'Health' | 'Magicka' | 'Stamina'> = [
      'None',
      'Health',
      'Magicka',
      'Stamina',
    ]
    return choices[choice] || 'None'
  }

  /**
   * Parse perks from binary data
   */
  private parsePerks(buildCode: string, perkList: any): Array<{ name: string; skill: number }> {
    const perks: Array<{ name: string; skill: number }> = []
    
    console.log('🔍 [Perk Parser] Starting perk parsing...')
    console.log('🔍 [Perk Parser] PerkList info:', {
      name: perkList.name,
      totalPerks: perkList.perks.length,
      skillNames: perkList.skillNames
    })
    console.log('🔍 [Perk Parser] Build code length:', buildCode.length)
    console.log('🔍 [Perk Parser] First few bytes:', Array.from(buildCode.slice(0, 10)).map(c => c.charCodeAt(0)))

    for (let i = 0; i < perkList.perks.length; i++) {
      const byteIndex = 31 + Math.floor(i / 8)
      const bitOffset = 7 - (i % 8)
      const byteValue = buildCode.charCodeAt(byteIndex)
      const hasPerk = (byteValue & (1 << bitOffset)) > 0

      if (hasPerk) {
        const perk = {
          name: perkList.perks[i].name,
          skill: perkList.perks[i].skill
        }
        perks.push(perk)
        console.log(`🔍 [Perk Parser] Found perk ${i}:`, {
          name: perk.name,
          skill: perk.skill,
          skillName: perkList.skillNames[perk.skill],
          byteIndex,
          bitOffset,
          byteValue: byteValue.toString(2).padStart(8, '0')
        })
      }
    }

    console.log('🔍 [Perk Parser] Final results:', {
      totalFound: perks.length,
      bySkill: perks.reduce((acc, perk) => {
        const skillName = perkList.skillNames[perk.skill] || `Skill ${perk.skill}`
        acc[skillName] = (acc[skillName] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      allPerks: perks.map(p => ({ name: p.name, skill: p.skill, skillName: perkList.skillNames[p.skill] }))
    })

    return perks
  }

  /**
   * Encode character data back to a GigaPlanner URL
   * @param characterData - Character data with names
   * @param baseUrl - Base URL for GigaPlanner
   * @returns GigaPlanner URL
   */
  encodeUrl(
    characterData: GigaPlannerCharacter,
    baseUrl: string = 'https://gigaplanner.com'
  ): GigaPlannerEncodeResult {
    try {
      const buildCode = this.encodeBuildCode(characterData)
      const presetNum = this.findPresetNumber(
        characterData.configuration.perkList
      )

      let url = `${baseUrl}?b=${buildCode}`
      if (presetNum !== null) {
        url += `&p=${presetNum}`
      }

      return {
        success: true,
        url,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Encode character data to build code
   */
  private encodeBuildCode(characterData: GigaPlannerCharacter): string {
    const version = 2
    let code = String.fromCodePoint(version)

    // Configuration IDs
    const perkListId =
      this.lookupMaps.perkListNameToId[characterData.configuration.perkList]
    const gameMechanicsId =
      this.lookupMaps.mechanicsNameToId[
        characterData.configuration.gameMechanics
      ]

    if (perkListId === undefined) {
      throw new Error(
        `Unknown perk list: ${characterData.configuration.perkList}`
      )
    }
    if (gameMechanicsId === undefined) {
      throw new Error(
        `Unknown game mechanics: ${characterData.configuration.gameMechanics}`
      )
    }

    code += String.fromCodePoint(perkListId)
    code += String.fromCodePoint(0) // Race list always 0
    code += String.fromCodePoint(gameMechanicsId)
    code += String.fromCodePoint(0) // Blessing list always 0

    // Character data
    code += String.fromCodePoint(characterData.level)
    code += String.fromCodePoint(characterData.hmsIncreases.health)
    code += String.fromCodePoint(characterData.hmsIncreases.magicka)
    code += String.fromCodePoint(characterData.hmsIncreases.stamina)

    // Skill levels
    const perkList = this.data.perks.find(
      (p: any) => p.perkListId === perkListId
    )
    for (let i = 0; i < 18; i++) {
      const skillLevel = characterData.skillLevels.find(
        s => s.skill === perkList.skillNames[i]
      )
      code += String.fromCodePoint(skillLevel ? skillLevel.level : 0)
    }

    // Oghma choice
    const oghmaChoices: Array<'None' | 'Health' | 'Magicka' | 'Stamina'> = [
      'None',
      'Health',
      'Magicka',
      'Stamina',
    ]
    const oghmaIndex = oghmaChoices.indexOf(characterData.oghmaChoice)
    code += String.fromCodePoint(oghmaIndex << 4)

    // Race, standing stone, blessing
    code += String.fromCodePoint(
      this.lookupMaps.raceNameToId[characterData.race] || 0
    )
    code += String.fromCodePoint(
      this.lookupMaps.stoneNameToId[characterData.standingStone] || 0
    )
    code += String.fromCodePoint(
      this.lookupMaps.blessingNameToId[characterData.blessing] || 0
    )

    // Perks
    const perksTaken = this.encodePerks(characterData.perks, perkList)
    code += perksTaken

    // Encode to base64url
    code = btoa(code)
    code = code.replace(/\+/g, '-').replace(/\//g, '_')
    if (code.indexOf('=') !== -1) {
      code = code.substring(0, code.indexOf('='))
    }

    return code
  }

  /**
   * Encode perks to binary format
   */
  private encodePerks(perkNames: string[], perkList: any): string {
    let code = ''
    let character = 0

    for (let i = 0; i < perkList.perks.length; i++) {
      const hasPerk = perkNames.includes(perkList.perks[i].name)
      character = (character << 1) | (hasPerk ? 1 : 0)

      if (i % 8 === 7) {
        code += String.fromCodePoint(character)
        character = 0
      }
    }

    // Handle remaining bits
    const remainingBits = perkList.perks.length % 8
    if (remainingBits > 0) {
      const paddingNeeded = 8 - remainingBits
      code += String.fromCodePoint(character << paddingNeeded)
    }

    return code
  }

  /**
   * Find preset number for a perk list
   */
  private findPresetNumber(perkListName: string): number | null {
    const perkListId = this.lookupMaps.perkListNameToId[perkListName]
    const preset = this.data.presets.find((p: any) => p.perks === perkListId)
    return preset ? this.data.presets.indexOf(preset) : null
  }

  /**
   * Get all available data mappings
   */
  getDataMappings(): GigaPlannerDataMappings {
    return {
      perkLists: this.data.perks.map((p: any) => ({
        id: p.perkListId,
        name: p.name,
      })),
      races: this.data.races.map((r: any, i: number) => ({
        id: i,
        name: r.name,
      })),
      gameMechanics: this.data.gameMechanics.map((g: any) => ({
        id: g.id,
        name: g.name,
      })),
      standingStones: this.data.standingStones.map((s: any, i: number) => ({
        id: i,
        name: s.name,
      })),
      blessings: this.data.blessings.map((b: any, i: number) => ({
        id: i,
        name: b.name,
      })),
      presets: this.data.presets.map((p: any, i: number) => ({
        id: i,
        name: p.name,
      })),
    }
  }

  /**
   * Get all perks for a specific perk list
   */
  getPerksForList(perkListName: string): Array<{
    id: number
    name: string
    skill: string
    skillReq: number
    description: string
  }> {
    const perkList = this.data.perks.find((p: any) => p.name === perkListName)
    if (!perkList) return []

    return perkList.perks.map((perk: any, index: number) => ({
      id: index,
      name: perk.name,
      skill: perkList.skillNames[perk.skill],
      skillReq: perk.skillReq,
      description: perk.description,
    }))
  }
}
