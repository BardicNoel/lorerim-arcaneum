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

export const BLESSING_NAME_TO_EDID: Record<string, string> = {
  'None': '', // Special case for no blessing
  'Akatosh': 'BlessingAkatosh',
  'Arkay': 'BlessingArkay',
  'Dibella': 'BlessingDibella',
  'Julianos': 'BlessingJulianos',
  'Kynareth': 'BlessingKynareth',
  'Mara': 'BlessingMara',
  'Stendarr': 'BlessingStendarr',
  'Talos': 'BlessingTalos',
  'Zenithar': 'BlessingZenithar',
  'Azura': 'BlessingAzura',
  'Boethia': 'BlessingBoethia',
  'Clavicus Vile': 'BlessingClavicusVile',
  'Hermaeus Mora': 'BlessingHermaeusMora',
  'Hircine': 'BlessingHircine',
  'Jyggalag': 'BlessingJyggalag',
  'Malacath': 'BlessingMalacath',
  'Mehrunes Dagon': 'BlessingMehrunesDagon',
  'Mephala': 'BlessingMephala',
  'Meridia': 'BlessingMeridia',
  'Molag Bal': 'BlessingMolagBal',
  'Namira': 'BlessingNamira',
  'Nocturnal': 'BlessingNocturnal',
  'Peryite': 'BlessingPeryite',
  'Sanguine': 'BlessingSanguine',
  'Sheogorath': 'BlessingSheogorath',
  'Vaermina': 'BlessingVaermina',
  'Auriel': 'BlessingAuriel',
  'Jephre': 'BlessingJephre',
  'Magnus': 'BlessingMagnus',
  'Phynaster': 'BlessingPhynaster',
  'Syrabane': 'BlessingSyrabane',
  'Trinimac': 'BlessingTrinimac',
  'Xarxes': 'BlessingXarxes',
  'Z\'en': 'BlessingZen',
  'Almalexia': 'BlessingAlmalexia',
  'Sotha Sil': 'BlessingSothaSil',
  'Vivec': 'BlessingVivec',
  'Leki': 'BlessingLeki',
  'Morwha': 'BlessingMorwha',
  'Satakal': 'BlessingSatakal',
  'Tall Papa': 'BlessingTallPapa',
  'The HoonDing': 'BlessingHoonDing',
  'Rajhin': 'BlessingRajhin',
  'Riddle\'Thar': 'BlessingRiddleThar',
  'Baan Dar': 'BlessingBaanDar',
  'Ebonarm': 'BlessingEbonarm',
  'Mannimarco': 'BlessingMannimarco',
  'Shor': 'BlessingShor',
  'Sithis': 'BlessingSithis',
  'St. Alessia': 'BlessingStAlessia',
  'The All-Maker': 'BlessingAllMaker',
  'The Hist': 'BlessingHist',
  'The Magna-Ge': 'BlessingMagnaGe',
  'The Old Ways': 'BlessingOldWays',
};

export function getBlessingEdid(blessingName: string): string {
  if (blessingName in BLESSING_NAME_TO_EDID) {
    return BLESSING_NAME_TO_EDID[blessingName];
  }
  return blessingName;
}

export function getBlessingNameFromEdid(edid: string): string | null {
  const entry = Object.entries(BLESSING_NAME_TO_EDID).find(([_, value]) => value === edid);
  return entry ? entry[0] : null;
}

export const GAME_MECHANICS_NAME_TO_ID: Record<string, number> = {
  'LoreRim v4': 0,
  // Future game mechanics will be added here
  // 'Vanilla': 1,
  // 'Requiem': 2,
  // 'Ordinator': 3,
};

export function getGameMechanicsId(mechanicsName: string): number {
  return GAME_MECHANICS_NAME_TO_ID[mechanicsName] ?? 0;
}

export function getGameMechanicsNameFromId(mechanicsId: number): string | null {
  const entry = Object.entries(GAME_MECHANICS_NAME_TO_ID).find(([_, id]) => id === mechanicsId);
  return entry ? entry[0] : null;
}

export function getGameMechanicsIdFromStringId(stringId: string): string | null {
  // Map from string ID back to name, then to numeric ID
  const idToNameMap: Record<string, string> = {
    'lorerim-v4': 'LoreRim v4',
  };
  
  return idToNameMap[stringId] || null;
}

export const PRESET_NAME_TO_ID: Record<string, number> = {
  'LoreRim v3.0.4': 0,
  // Future presets will be added here
  // 'Vanilla': 1,
  // 'Requiem': 2,
  // 'Ordinator': 3,
};

export function getPresetId(presetName: string): number {
  return PRESET_NAME_TO_ID[presetName] ?? 0;
}

export function getPresetNameFromId(presetId: number): string | null {
  const entry = Object.entries(PRESET_NAME_TO_ID).find(([_, id]) => id === presetId);
  return entry ? entry[0] : null;
}

export function getPresetIdFromStringId(stringId: string): string | null {
  // Map from string ID back to name, then to numeric ID
  const idToNameMap: Record<string, string> = {
    'lorerim-v3-0-4': 'LoreRim v3.0.4',
  };
  
  return idToNameMap[stringId] || null;
}