import { describe, expect, it } from 'vitest'
import {
  CANONICAL_RACES,
  getAllRaceIds,
  getAllRaceNames,
  getCanonicalRace,
  getRaceDisplayName,
  isValidRaceName,
  normalizeRaceArray,
  normalizeRaceKey,
  RACE_ALIAS_MAP,
} from '../raceNormalization'

describe('raceNormalization', () => {
  describe('normalizeRaceKey', () => {
    it('should normalize Nord variations', () => {
      expect(normalizeRaceKey('Nord')).toBe('nord')
      expect(normalizeRaceKey('Nords')).toBe('nord')
      expect(normalizeRaceKey('NordRace')).toBe('nord')
      expect(normalizeRaceKey('nord')).toBe('nord')
      expect(normalizeRaceKey('nords')).toBe('nord')
    })

    it('should normalize Imperial variations', () => {
      expect(normalizeRaceKey('Imperial')).toBe('imperial')
      expect(normalizeRaceKey('Imperials')).toBe('imperial')
      expect(normalizeRaceKey('ImperialRace')).toBe('imperial')
    })

    it('should normalize Altmer variations', () => {
      expect(normalizeRaceKey('Altmer')).toBe('altmer')
      expect(normalizeRaceKey('High Elves')).toBe('altmer')
      expect(normalizeRaceKey('HighElf')).toBe('altmer')
      expect(normalizeRaceKey('HighElfRace')).toBe('altmer')
      expect(normalizeRaceKey('high elf')).toBe('altmer')
      expect(normalizeRaceKey('high elves')).toBe('altmer')
    })

    it('should normalize Dunmer variations', () => {
      expect(normalizeRaceKey('Dunmer')).toBe('dunmer')
      expect(normalizeRaceKey('Dark Elves')).toBe('dunmer')
      expect(normalizeRaceKey('DarkElf')).toBe('dunmer')
      expect(normalizeRaceKey('DarkElfRace')).toBe('dunmer')
      expect(normalizeRaceKey('dark elf')).toBe('dunmer')
      expect(normalizeRaceKey('dark elves')).toBe('dunmer')
    })

    it('should normalize Orsimer variations', () => {
      expect(normalizeRaceKey('Orsimer')).toBe('orsimer')
      expect(normalizeRaceKey('Orcs')).toBe('orsimer')
      expect(normalizeRaceKey('OrcRace')).toBe('orsimer')
      expect(normalizeRaceKey('orc')).toBe('orsimer')
      expect(normalizeRaceKey('orcs')).toBe('orsimer')
    })

    it('should handle edge cases', () => {
      expect(normalizeRaceKey('')).toBeNull()
      expect(normalizeRaceKey('   ')).toBeNull()
      expect(normalizeRaceKey('UnknownRace')).toBeNull()
      expect(normalizeRaceKey('Nord ')).toBe('nord') // trailing space
      expect(normalizeRaceKey(' Nord ')).toBe('nord') // leading and trailing space
    })
  })

  describe('getCanonicalRace', () => {
    it('should return canonical race for valid IDs', () => {
      const nord = getCanonicalRace('nord')
      expect(nord).toEqual({
        id: 'nord',
        name: 'Nord',
        edid: 'NordRace',
        aliases: ['Nords', 'NordRace', 'nord', 'nords'],
      })

      const imperial = getCanonicalRace('imperial')
      expect(imperial).toEqual({
        id: 'imperial',
        name: 'Imperial',
        edid: 'ImperialRace',
        aliases: ['Imperials', 'ImperialRace', 'imperial', 'imperials'],
      })
    })

    it('should return null for invalid IDs', () => {
      expect(getCanonicalRace('invalid')).toBeNull()
      expect(getCanonicalRace('')).toBeNull()
    })
  })

  describe('getRaceDisplayName', () => {
    it('should return display names for valid IDs', () => {
      expect(getRaceDisplayName('nord')).toBe('Nord')
      expect(getRaceDisplayName('imperial')).toBe('Imperial')
      expect(getRaceDisplayName('altmer')).toBe('Altmer')
      expect(getRaceDisplayName('dunmer')).toBe('Dunmer')
    })

    it('should return original input for invalid IDs', () => {
      expect(getRaceDisplayName('invalid')).toBe('invalid')
      expect(getRaceDisplayName('')).toBe('')
    })
  })

  describe('normalizeRaceArray', () => {
    it('should normalize valid race arrays', () => {
      const result = normalizeRaceArray(['Nord', 'Imperial', 'Altmer'])
      expect(result.normalizedRaces).toEqual(['nord', 'imperial', 'altmer'])
      expect(result.warnings).toEqual([])
      expect(result.unknownRaces).toEqual([])
    })

    it('should handle mixed valid and invalid races', () => {
      const result = normalizeRaceArray([
        'Nord',
        'InvalidRace',
        'Imperial',
        'UnknownRace',
      ])
      expect(result.normalizedRaces).toEqual(['nord', 'imperial'])
      expect(result.warnings).toEqual([
        'Unknown race: "InvalidRace"',
        'Unknown race: "UnknownRace"',
      ])
      expect(result.unknownRaces).toEqual(['InvalidRace', 'UnknownRace'])
    })

    it('should handle case variations', () => {
      const result = normalizeRaceArray(['nord', 'NORD', 'Nord', 'nOrD'])
      expect(result.normalizedRaces).toEqual(['nord', 'nord', 'nord', 'nord'])
      expect(result.warnings).toEqual([])
      expect(result.unknownRaces).toEqual([])
    })

    it('should handle empty array', () => {
      const result = normalizeRaceArray([])
      expect(result.normalizedRaces).toEqual([])
      expect(result.warnings).toEqual([])
      expect(result.unknownRaces).toEqual([])
    })
  })

  describe('isValidRaceName', () => {
    it('should return true for valid race names', () => {
      expect(isValidRaceName('Nord')).toBe(true)
      expect(isValidRaceName('Nords')).toBe(true)
      expect(isValidRaceName('NordRace')).toBe(true)
      expect(isValidRaceName('Imperial')).toBe(true)
      expect(isValidRaceName('Altmer')).toBe(true)
    })

    it('should return false for invalid race names', () => {
      expect(isValidRaceName('InvalidRace')).toBe(false)
      expect(isValidRaceName('')).toBe(false)
      expect(isValidRaceName('   ')).toBe(false)
    })
  })

  describe('getAllRaceNames', () => {
    it('should return all canonical race names', () => {
      const names = getAllRaceNames()
      expect(names).toContain('Nord')
      expect(names).toContain('Imperial')
      expect(names).toContain('Altmer')
      expect(names).toContain('Dunmer')
      expect(names).toContain('Orsimer')
      expect(names).toContain('Khajiit')
      expect(names).toContain('Argonian')
      expect(names).toContain('Falmer')
      expect(names).toContain('Breton')
      expect(names).toContain('Redguard')
      expect(names).toContain('Bosmer')
    })
  })

  describe('getAllRaceIds', () => {
    it('should return all canonical race IDs', () => {
      const ids = getAllRaceIds()
      expect(ids).toContain('nord')
      expect(ids).toContain('imperial')
      expect(ids).toContain('altmer')
      expect(ids).toContain('dunmer')
      expect(ids).toContain('orsimer')
      expect(ids).toContain('khajiit')
      expect(ids).toContain('argonian')
      expect(ids).toContain('falmer')
      expect(ids).toContain('breton')
      expect(ids).toContain('redguard')
      expect(ids).toContain('bosmer')
    })
  })

  describe('CANONICAL_RACES', () => {
    it('should have all expected races', () => {
      const expectedRaces = [
        'nord',
        'imperial',
        'breton',
        'redguard',
        'altmer',
        'bosmer',
        'dunmer',
        'orsimer',
        'khajiit',
        'argonian',
        'falmer',
      ]

      const actualRaces = CANONICAL_RACES.map(race => race.id)
      expect(actualRaces).toEqual(expect.arrayContaining(expectedRaces))
    })

    it('should have unique IDs', () => {
      const ids = CANONICAL_RACES.map(race => race.id)
      const uniqueIds = new Set(ids)
      expect(ids.length).toBe(uniqueIds.size)
    })
  })

  describe('RACE_ALIAS_MAP', () => {
    it('should contain all aliases', () => {
      CANONICAL_RACES.forEach(race => {
        race.aliases.forEach(alias => {
          expect(RACE_ALIAS_MAP.has(alias.toLowerCase())).toBe(true)
          expect(RACE_ALIAS_MAP.get(alias.toLowerCase())).toBe(race.id)
        })
      })
    })

    it('should contain lowercase keys for case insensitive lookups', () => {
      expect(RACE_ALIAS_MAP.get('nord')).toBe('nord')
      expect(RACE_ALIAS_MAP.get('nord')).toBe('nord') // All keys are lowercase
      expect(RACE_ALIAS_MAP.get('nord')).toBe('nord') // All keys are lowercase
    })
  })
})
