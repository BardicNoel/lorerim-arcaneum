export interface RaceTrait {
  name: string;
  description: string;
  effect: {
    type: "resistance" | "ability" | "passive";
    value?: number;
    target?: string;
    name?: string;
    cooldown?: number;
  };
}

export interface StartingStats {
  health: number;
  mana: number;
  stamina: number;
  strength: number;
  intelligence: number;
  agility: number;
}

export interface Race {
  id: string;
  name: string;
  description: string;
  traits: RaceTrait[];
  startingStats: StartingStats;
}

export interface RaceFilters {
  search: string;
  type: string;
  tags: string[];
}
