import { describe, expect, it } from 'vitest';
import { 
  RACE_NAME_TO_EDID, 
  getRaceEdid, 
  getRaceNameFromEdid,
  STANDING_STONE_NAME_TO_EDID,
  getStandingStoneEdid,
  getStandingStoneNameFromEdid,
  GAME_MECHANICS_NAME_TO_ID,
  getGameMechanicsId,
  getGameMechanicsNameFromId,
  getGameMechanicsIdFromStringId,
  PRESET_NAME_TO_ID,
  getPresetId,
  getPresetNameFromId,
  getPresetIdFromStringId
} from '../mappings';

describe('Race EDID Mappings', () => {
  describe('RACE_NAME_TO_EDID', () => {
    it('should contain all expected race mappings', () => {
      const expectedMappings = {
        'Argonian': 'ArgonianRace',
        'Breton': 'BretonRace',
        'Dunmer': 'DarkElfRace',
        'Altmer': 'HighElfRace',
        'Imperial': 'ImperialRace',
        'Khajiit': 'KhajiitRace',
        'Nord': 'NordRace',
        'Orsimer': 'OrcRace',
        'Redguard': 'RedguardRace',
        'Bosmer': 'WoodElfRace',
      };

      expect(RACE_NAME_TO_EDID).toEqual(expectedMappings);
    });

    it('should have 10 race mappings', () => {
      expect(Object.keys(RACE_NAME_TO_EDID)).toHaveLength(10);
    });
  });

  describe('getRaceEdid', () => {
    it('should return correct EDID for known race names', () => {
      expect(getRaceEdid('Argonian')).toBe('ArgonianRace');
      expect(getRaceEdid('Breton')).toBe('BretonRace');
      expect(getRaceEdid('Dunmer')).toBe('DarkElfRace');
      expect(getRaceEdid('Altmer')).toBe('HighElfRace');
      expect(getRaceEdid('Imperial')).toBe('ImperialRace');
      expect(getRaceEdid('Khajiit')).toBe('KhajiitRace');
      expect(getRaceEdid('Nord')).toBe('NordRace');
      expect(getRaceEdid('Orsimer')).toBe('OrcRace');
      expect(getRaceEdid('Redguard')).toBe('RedguardRace');
      expect(getRaceEdid('Bosmer')).toBe('WoodElfRace');
    });

    it('should return the input name for unknown race names', () => {
      expect(getRaceEdid('UnknownRace')).toBe('UnknownRace');
      expect(getRaceEdid('')).toBe('');
      expect(getRaceEdid('argonian')).toBe('argonian'); // Case sensitive
    });
  });

  describe('getRaceNameFromEdid', () => {
    it('should return correct race name for known EDIDs', () => {
      expect(getRaceNameFromEdid('ArgonianRace')).toBe('Argonian');
      expect(getRaceNameFromEdid('BretonRace')).toBe('Breton');
      expect(getRaceNameFromEdid('DarkElfRace')).toBe('Dunmer');
      expect(getRaceNameFromEdid('HighElfRace')).toBe('Altmer');
      expect(getRaceNameFromEdid('ImperialRace')).toBe('Imperial');
      expect(getRaceNameFromEdid('KhajiitRace')).toBe('Khajiit');
      expect(getRaceNameFromEdid('NordRace')).toBe('Nord');
      expect(getRaceNameFromEdid('OrcRace')).toBe('Orsimer');
      expect(getRaceNameFromEdid('RedguardRace')).toBe('Redguard');
      expect(getRaceNameFromEdid('WoodElfRace')).toBe('Bosmer');
    });

    it('should return null for unknown EDIDs', () => {
      expect(getRaceNameFromEdid('UnknownRace')).toBeNull();
      expect(getRaceNameFromEdid('')).toBeNull();
      expect(getRaceNameFromEdid('argonianrace')).toBeNull(); // Case sensitive
    });
  });

  describe('bidirectional mapping consistency', () => {
    it('should maintain consistency between getRaceEdid and getRaceNameFromEdid', () => {
      const raceNames = Object.keys(RACE_NAME_TO_EDID);
      
      for (const raceName of raceNames) {
        const edid = getRaceEdid(raceName);
        const mappedRaceName = getRaceNameFromEdid(edid);
        expect(mappedRaceName).toBe(raceName);
      }
    });

    it('should maintain consistency in reverse direction', () => {
      const edids = Object.values(RACE_NAME_TO_EDID);
      
      for (const edid of edids) {
        const raceName = getRaceNameFromEdid(edid);
        const mappedEdid = getRaceEdid(raceName!);
        expect(mappedEdid).toBe(edid);
      }
    });
  });
});

describe('Standing Stone EDID Mappings', () => {
  describe('STANDING_STONE_NAME_TO_EDID', () => {
    it('should contain all expected standing stone mappings', () => {
      const expectedMappings = {
        'None': '',
        'Warrior': 'REQ_Ability_Birthsign_Warrior',
        'Lady': 'REQ_Ability_Birthsign_Lady',
        'Lord': 'REQ_Ability_Birthsign_Lord',
        'Steed': 'REQ_Ability_Birthsign_Steed',
        'Mage': 'REQ_Ability_Birthsign_Mage',
        'Apprentice': 'REQ_Ability_Birthsign_Apprentice',
        'Atronach': 'REQ_Ability_Birthsign_Atronach',
        'Ritual': 'REQ_Ability_Birthsign_Ritual',
        'Thief': 'REQ_Ability_Birthsign_Thief',
        'Lover': 'REQ_Ability_Birthsign_Lover',
        'Shadow': 'REQ_Ability_Birthsign_Shadow',
        'Tower': 'REQ_Ability_Birthsign_Tower',
        'Serpent': 'REQ_Ability_Birthsign_Serpent',
      };

      expect(STANDING_STONE_NAME_TO_EDID).toEqual(expectedMappings);
    });

    it('should have 14 standing stone mappings', () => {
      expect(Object.keys(STANDING_STONE_NAME_TO_EDID)).toHaveLength(14);
    });
  });

  describe('getStandingStoneEdid', () => {
    it('should return correct EDID for known standing stone names', () => {
      expect(getStandingStoneEdid('None')).toBe('');
      expect(getStandingStoneEdid('Warrior')).toBe('REQ_Ability_Birthsign_Warrior');
      expect(getStandingStoneEdid('Lady')).toBe('REQ_Ability_Birthsign_Lady');
      expect(getStandingStoneEdid('Lord')).toBe('REQ_Ability_Birthsign_Lord');
      expect(getStandingStoneEdid('Steed')).toBe('REQ_Ability_Birthsign_Steed');
      expect(getStandingStoneEdid('Mage')).toBe('REQ_Ability_Birthsign_Mage');
      expect(getStandingStoneEdid('Apprentice')).toBe('REQ_Ability_Birthsign_Apprentice');
      expect(getStandingStoneEdid('Atronach')).toBe('REQ_Ability_Birthsign_Atronach');
      expect(getStandingStoneEdid('Ritual')).toBe('REQ_Ability_Birthsign_Ritual');
      expect(getStandingStoneEdid('Thief')).toBe('REQ_Ability_Birthsign_Thief');
      expect(getStandingStoneEdid('Lover')).toBe('REQ_Ability_Birthsign_Lover');
      expect(getStandingStoneEdid('Shadow')).toBe('REQ_Ability_Birthsign_Shadow');
      expect(getStandingStoneEdid('Tower')).toBe('REQ_Ability_Birthsign_Tower');
      expect(getStandingStoneEdid('Serpent')).toBe('REQ_Ability_Birthsign_Serpent');
    });

    it('should return the input name for unknown standing stone names', () => {
      expect(getStandingStoneEdid('UnknownStone')).toBe('UnknownStone');
      expect(getStandingStoneEdid('')).toBe('');
      expect(getStandingStoneEdid('warrior')).toBe('warrior'); // Case sensitive
    });
  });

  describe('getStandingStoneNameFromEdid', () => {
    it('should return correct standing stone name for known EDIDs', () => {
      expect(getStandingStoneNameFromEdid('')).toBe('None');
      expect(getStandingStoneNameFromEdid('REQ_Ability_Birthsign_Warrior')).toBe('Warrior');
      expect(getStandingStoneNameFromEdid('REQ_Ability_Birthsign_Lady')).toBe('Lady');
      expect(getStandingStoneNameFromEdid('REQ_Ability_Birthsign_Lord')).toBe('Lord');
      expect(getStandingStoneNameFromEdid('REQ_Ability_Birthsign_Steed')).toBe('Steed');
      expect(getStandingStoneNameFromEdid('REQ_Ability_Birthsign_Mage')).toBe('Mage');
      expect(getStandingStoneNameFromEdid('REQ_Ability_Birthsign_Apprentice')).toBe('Apprentice');
      expect(getStandingStoneNameFromEdid('REQ_Ability_Birthsign_Atronach')).toBe('Atronach');
      expect(getStandingStoneNameFromEdid('REQ_Ability_Birthsign_Ritual')).toBe('Ritual');
      expect(getStandingStoneNameFromEdid('REQ_Ability_Birthsign_Thief')).toBe('Thief');
      expect(getStandingStoneNameFromEdid('REQ_Ability_Birthsign_Lover')).toBe('Lover');
      expect(getStandingStoneNameFromEdid('REQ_Ability_Birthsign_Shadow')).toBe('Shadow');
      expect(getStandingStoneNameFromEdid('REQ_Ability_Birthsign_Tower')).toBe('Tower');
      expect(getStandingStoneNameFromEdid('REQ_Ability_Birthsign_Serpent')).toBe('Serpent');
    });

    it('should return null for unknown EDIDs', () => {
      expect(getStandingStoneNameFromEdid('UnknownEDID')).toBeNull();
      expect(getStandingStoneNameFromEdid('req_ability_birthsign_warrior')).toBeNull(); // Case sensitive
    });
  });

  describe('bidirectional mapping consistency', () => {
    it('should maintain consistency between getStandingStoneEdid and getStandingStoneNameFromEdid', () => {
      const stoneNames = Object.keys(STANDING_STONE_NAME_TO_EDID);
      
      for (const stoneName of stoneNames) {
        const edid = getStandingStoneEdid(stoneName);
        const mappedStoneName = getStandingStoneNameFromEdid(edid);
        expect(mappedStoneName).toBe(stoneName);
      }
    });

    it('should maintain consistency in reverse direction', () => {
      const edids = Object.values(STANDING_STONE_NAME_TO_EDID);
      
      for (const edid of edids) {
        const stoneName = getStandingStoneNameFromEdid(edid);
        const mappedEdid = getStandingStoneEdid(stoneName!);
        expect(mappedEdid).toBe(edid);
      }
    });
  });
});

describe('Game Mechanics ID Mappings', () => {
  describe('GAME_MECHANICS_NAME_TO_ID', () => {
    it('should contain all expected game mechanics mappings', () => {
      const expectedMappings = {
        'LoreRim v4': 0,
      };

      expect(GAME_MECHANICS_NAME_TO_ID).toEqual(expectedMappings);
    });

    it('should have 1 game mechanics mapping', () => {
      expect(Object.keys(GAME_MECHANICS_NAME_TO_ID)).toHaveLength(1);
    });
  });

  describe('getGameMechanicsId', () => {
    it('should return correct ID for known game mechanics names', () => {
      expect(getGameMechanicsId('LoreRim v4')).toBe(0);
    });

    it('should return 0 (default) for unknown game mechanics names', () => {
      expect(getGameMechanicsId('UnknownMechanics')).toBe(0);
      expect(getGameMechanicsId('')).toBe(0);
      expect(getGameMechanicsId('lorerim v4')).toBe(0); // Case sensitive
    });
  });

  describe('getGameMechanicsNameFromId', () => {
    it('should return correct game mechanics name for known IDs', () => {
      expect(getGameMechanicsNameFromId(0)).toBe('LoreRim v4');
    });

    it('should return null for unknown IDs', () => {
      expect(getGameMechanicsNameFromId(1)).toBeNull();
      expect(getGameMechanicsNameFromId(-1)).toBeNull();
      expect(getGameMechanicsNameFromId(999)).toBeNull();
    });
  });

  describe('getGameMechanicsIdFromStringId', () => {
    it('should return correct name for known string IDs', () => {
      expect(getGameMechanicsIdFromStringId('lorerim-v4')).toBe('LoreRim v4');
    });

    it('should return null for unknown string IDs', () => {
      expect(getGameMechanicsIdFromStringId('unknown-mechanics')).toBeNull();
      expect(getGameMechanicsIdFromStringId('')).toBeNull();
      expect(getGameMechanicsIdFromStringId('LoreRim v4')).toBeNull(); // Wrong format
    });
  });

  describe('bidirectional mapping consistency', () => {
    it('should maintain consistency between getGameMechanicsId and getGameMechanicsNameFromId', () => {
      const mechanicsNames = Object.keys(GAME_MECHANICS_NAME_TO_ID);
      
      for (const mechanicsName of mechanicsNames) {
        const id = getGameMechanicsId(mechanicsName);
        const mappedMechanicsName = getGameMechanicsNameFromId(id);
        expect(mappedMechanicsName).toBe(mechanicsName);
      }
    });

    it('should maintain consistency in reverse direction', () => {
      const ids = Object.values(GAME_MECHANICS_NAME_TO_ID);
      
      for (const id of ids) {
        const mechanicsName = getGameMechanicsNameFromId(id);
        const mappedId = getGameMechanicsId(mechanicsName!);
        expect(mappedId).toBe(id);
      }
    });
  });
});

describe('Preset ID Mappings', () => {
  describe('PRESET_NAME_TO_ID', () => {
    it('should contain all expected preset mappings', () => {
      const expectedMappings = {
        'LoreRim v3.0.4': 0,
      };

      expect(PRESET_NAME_TO_ID).toEqual(expectedMappings);
    });

    it('should have 1 preset mapping', () => {
      expect(Object.keys(PRESET_NAME_TO_ID)).toHaveLength(1);
    });
  });

  describe('getPresetId', () => {
    it('should return correct ID for known preset names', () => {
      expect(getPresetId('LoreRim v3.0.4')).toBe(0);
    });

    it('should return 0 (default) for unknown preset names', () => {
      expect(getPresetId('UnknownPreset')).toBe(0);
      expect(getPresetId('')).toBe(0);
      expect(getPresetId('lorerim v3.0.4')).toBe(0); // Case sensitive
    });
  });

  describe('getPresetNameFromId', () => {
    it('should return correct preset name for known IDs', () => {
      expect(getPresetNameFromId(0)).toBe('LoreRim v3.0.4');
    });

    it('should return null for unknown IDs', () => {
      expect(getPresetNameFromId(1)).toBeNull();
      expect(getPresetNameFromId(-1)).toBeNull();
      expect(getPresetNameFromId(999)).toBeNull();
    });
  });

  describe('getPresetIdFromStringId', () => {
    it('should return correct name for known string IDs', () => {
      expect(getPresetIdFromStringId('lorerim-v3-0-4')).toBe('LoreRim v3.0.4');
    });

    it('should return null for unknown string IDs', () => {
      expect(getPresetIdFromStringId('unknown-preset')).toBeNull();
      expect(getPresetIdFromStringId('')).toBeNull();
      expect(getPresetIdFromStringId('LoreRim v3.0.4')).toBeNull(); // Wrong format
    });
  });

  describe('bidirectional mapping consistency', () => {
    it('should maintain consistency between getPresetId and getPresetNameFromId', () => {
      const presetNames = Object.keys(PRESET_NAME_TO_ID);
      
      for (const presetName of presetNames) {
        const id = getPresetId(presetName);
        const mappedPresetName = getPresetNameFromId(id);
        expect(mappedPresetName).toBe(presetName);
      }
    });

    it('should maintain consistency in reverse direction', () => {
      const ids = Object.values(PRESET_NAME_TO_ID);
      
      for (const id of ids) {
        const presetName = getPresetNameFromId(id);
        const mappedId = getPresetId(presetName!);
        expect(mappedId).toBe(id);
      }
    });
  });
});
