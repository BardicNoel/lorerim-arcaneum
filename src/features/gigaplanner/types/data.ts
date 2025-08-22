export interface GigaPlannerRace {
  id: string;
  name: string;
  edid: string;
  startingHMS: [number, number, number]; // [Health, Magicka, Stamina]
  startingCW: number; // Starting carry weight
  speedBonus: number;
  hmsBonus: [number, number, number]; // [Health, Magicka, Stamina] bonuses
  startingHMSRegen: [number, number, number]; // [Health, Magicka, Stamina] regeneration
  unarmedDam: number;
  startingSkills: number[]; // Array of 21 skill levels (0-15)
  description: string;
  bonus: string;
}

export interface GigaPlannerStandingStone {
  id: string;
  name: string;
  edid: string;
  group: string;
  description: string;
  bonus: string;
}

export interface GigaPlannerBlessing {
  id: string;
  name: string;
  edid: string;
  shrine: string;
  follower: string;
  devotee: string;
  tenents: string;
  race: string;
  starting: string;
  req: string;
  category: string; // "Divine", "Daedric", "Elven", "Tribunal", "Yokudan", "Khajiiti", "Miscellaneous"
}

export interface GigaPlannerGameMechanics {
  id: string;
  name: string;
  gameId: number; // The original numeric ID from the source
  description: string;
  version: string;
  initialPerks: number;
  oghmaData: {
    perksGiven: number;
    hmsGiven: [number, number, number]; // [Health, Magicka, Stamina]
  };
  leveling: {
    base: number;
    mult: number;
    hmsGiven: [number, number, number]; // [Health, Magicka, Stamina]
  };
  derivedAttributes: {
    attribute: string[];
    isPercent: boolean[];
    prefactor: number[];
    threshold: number[];
    weight_health: number[];
    weight_magicka: number[];
    weight_stamina: number[];
  };
}

export interface GigaPlannerData {
  races: GigaPlannerRace[];
  standingStones: GigaPlannerStandingStone[];
  blessings: GigaPlannerBlessing[];
  gameMechanics: GigaPlannerGameMechanics[];
  perks?: any; // Will be defined later
  presets?: any; // Will be defined later
}
