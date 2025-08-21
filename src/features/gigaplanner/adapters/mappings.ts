export const RACE_NAME_TO_EDID: Record<string, string> = {
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

export function getRaceEdid(raceName: string): string {
  return RACE_NAME_TO_EDID[raceName] || raceName;
}

export function getRaceNameFromEdid(edid: string): string | null {
  const entry = Object.entries(RACE_NAME_TO_EDID).find(([_, value]) => value === edid);
  return entry ? entry[0] : null;
}

export const STANDING_STONE_NAME_TO_EDID: Record<string, string> = {
  'None': '', // Special case for no standing stone
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

export function getStandingStoneEdid(stoneName: string): string {
  if (stoneName in STANDING_STONE_NAME_TO_EDID) {
    return STANDING_STONE_NAME_TO_EDID[stoneName];
  }
  return stoneName;
}

export function getStandingStoneNameFromEdid(edid: string): string | null {
  const entry = Object.entries(STANDING_STONE_NAME_TO_EDID).find(([_, value]) => value === edid);
  return entry ? entry[0] : null;
}
