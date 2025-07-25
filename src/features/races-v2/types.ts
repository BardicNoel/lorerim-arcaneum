// New race data structure matching playable-races.json
export interface RacialSpell {
  edid: string
  name: string
  description: string
  globalFormId: string
}

export interface SkillBonus {
  skill: string
  bonus: number
}

export interface Keyword {
  edid: string
  globalFormId: string
}

export interface PhysicalAttributes {
  heightMale: number
  heightFemale: number
  weightMale: number
  weightFemale: number
  size: string
}

export interface StartingStats {
  health: number
  magicka: number
  stamina: number
  carryWeight: number
}

export interface RegenerationMultiplier {
  value: number
  source: string
}

export interface RegenerationAdjustment {
  value: number
  source: string
}

export interface RegenerationStat {
  base: number
  multipliers?: RegenerationMultiplier[]
  adjustments?: RegenerationAdjustment[]
}

export interface Regeneration {
  health: RegenerationStat
  magicka: RegenerationStat
  stamina: RegenerationStat
}

export interface Combat {
  unarmedDamage: number
  unarmedReach: number
}

export interface Race {
  name: string
  edid: string
  category: 'Human' | 'Beast' | 'Elven'
  source: string
  description: string
  startingStats: StartingStats
  physicalAttributes: PhysicalAttributes
  skillBonuses: SkillBonus[]
  racialSpells: RacialSpell[]
  keywords: Keyword[]
  flags?: string[]
  regeneration: Regeneration
  combat: Combat
}

// Legacy interfaces for backward compatibility during transition
export interface RaceTrait {
  name: string
  description: string
  effect: {
    type: 'resistance' | 'ability' | 'passive'
    value?: number
    target?: string
    name?: string
    cooldown?: number
  }
}

export interface LegacyRace {
  id: string
  name: string
  description: string
  traits: RaceTrait[]
  startingStats: {
    health: number
    mana: number
    stamina: number
    strength: number
    intelligence: number
    agility: number
  }
}

export interface RaceFilters {
  search: string
  type: string
  tags: string[]
}

// Utility types for data transformation
export interface TransformedRace {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  effects: Array<{
    name: string
    type: 'positive' | 'negative' | 'neutral'
    description: string
    value?: number
    target?: string
  }>
  startingStats: StartingStats
  skillBonuses: SkillBonus[]
  keywords: string[]
  regeneration: Regeneration
  combat: Combat
}

// MVA-specific types
export interface RaceStats {
  totalHealth: number
  totalMagicka: number
  totalStamina: number
  totalCarryWeight: number
  skillBonusCount: number
  racialSpellCount: number
}

export interface RaceComparison {
  selectedRace: Race
  comparedRace: Race
  differences: {
    stats: Record<string, { selected: number; compared: number; difference: number }>
    skills: Array<{ skill: string; selected: number; compared: number; difference: number }>
    spells: Array<{ selected: string[]; compared: string[]; unique: string[] }>
  }
}

export interface SearchCategory {
  id: string
  name: string
  options: string[]
} 