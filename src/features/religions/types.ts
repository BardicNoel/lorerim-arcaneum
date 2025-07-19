export interface ReligionEffect {
  magnitude: number
  area: number
  duration: number
  effectName: string
  effectDescription: string
  effectType: string
  targetAttribute: string | null
  keywords: string[]
}

export interface ReligionSpell {
  spellId: string
  spellName: string
  effects: ReligionEffect[]
}

export interface ReligionTenet {
  spellId: string
  spellName: string
  header: string
  description: string
  effects: ReligionEffect[]
}

export interface Religion {
  name: string
  type: string
  blessing: ReligionSpell
  boon1: ReligionSpell // Follower power
  boon2: ReligionSpell // Devotee power
  tenet: ReligionTenet
  favoredRaces: string[]
  worshipRestrictions: string[]
}

export interface ReligionPantheon {
  type: string
  description: string
  deities: Religion[]
}

export interface ReligionFilters {
  search: string
  pantheon: string
  domain: string
  alignment: string
  tags: string[]
}
