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

export interface GigaPlannerData {
  races: GigaPlannerRace[];
  standingStones: GigaPlannerStandingStone[];
  perks?: any; // Will be defined later
  blessings?: any; // Will be defined later
  gameMechanics?: any; // Will be defined later
  presets?: any; // Will be defined later
}
