export interface Birthsign {
  name: string
  group: string
  description: string
  powers: BirthsignPower[]
  edid: string
  formid: string
  stat_modifications: StatModification[]
  skill_bonuses: SkillBonus[]
  conditional_effects: ConditionalEffect[]
  mastery_effects: MasteryEffect[]
}

export interface BirthsignPower {
  name: string
  description: string
  magnitude?: number
  duration?: number
}

export interface StatModification {
  stat: string
  type: 'bonus' | 'penalty'
  value: number
  value_type: 'flat' | 'percentage'
}

export interface SkillBonus {
  stat: string
  type: 'bonus'
  value: number
  value_type: 'flat' | 'percentage'
}

export interface ConditionalEffect {
  stat: string
  type: 'conditional'
  value: number
  value_type: 'multiplier' | 'percentage' | 'flat'
  condition: string
  description: string
}

export interface MasteryEffect {
  stat: string
  type: 'bonus'
  value: number
  value_type: 'flat' | 'percentage'
  condition?: string
  description: string
}

export interface BirthsignFilters {
  search: string
  group: string
  tags: string[]
}

export interface TransformedBirthsign {
  id: string
  name: string
  description: string
  tags: string[]
  effects: string[]
  category: string
  group?: string
  powers?: BirthsignPower[]
  stat_modifications?: StatModification[]
  skill_bonuses?: SkillBonus[]
  conditional_effects?: ConditionalEffect[]
  mastery_effects?: MasteryEffect[]
}

export type SortOption = 'alphabetical' | 'group' | 'name'

export interface BirthsignSearchResult {
  id: string
  name: string
  group: string
  tags: string[]
  matchType: 'name' | 'description' | 'power' | 'tag'
  matchScore: number
}
