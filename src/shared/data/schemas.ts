// Remove all Zod imports and runtime validation. Only keep type definitions if used elsewhere.
// If types depend on Zod, replace with TypeScript interfaces.

// Skill
export interface Skill {
  id?: string
  name: string
  edid: string
  description?: string
  category?: string
  tags?: string[]
  keyAbilities?: string[]
  metaTags?: string[]
  scaling?: string
}

// Race
export interface RaceStartingStats {
  health: number
  magicka: number
  stamina: number
  carryWeight: number
}
export interface RaceSkillBonus {
  skill: string
  bonus: number
}
export interface RaceRacialSpell {
  edid: string
  name: string
  description: string
  globalFormId: string
}
export interface Race {
  id?: string
  name: string
  edid: string
  description?: string
  category?: string
  tags?: string[]
  source?: string
  startingStats?: RaceStartingStats
  skillBonuses?: RaceSkillBonus[]
  racialSpells?: RaceRacialSpell[]
  keywords?: string[]
}

// Trait
export interface TraitEffect {
  type: string
  value: number
  description?: string
  condition?: string
  duration: number
  flags: string[]
}

export interface TraitSpell {
  cost: number
  type: string
  castType: string
  delivery: string
}

export interface Trait {
  id?: string
  name: string
  description?: string
  edid?: string
  formId?: string
  spell?: TraitSpell
  effects?: TraitEffect[]
  category?: string
  tags?: string[]
  diagram?: string
}

// Religion
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
  id?: string
  name: string
  type?: string
  pantheon?: string
  blessing?: ReligionSpell
  boon1?: ReligionSpell // Follower power
  boon2?: ReligionSpell // Devotee power
  tenet?: ReligionTenet
  favoredRaces?: string[]
  worshipRestrictions?: string[]
  tags?: string[]
}

// Birthsign
export interface Birthsign {
  id?: string
  name: string
  edid: string
  description?: string
  category?: string
  tags?: string[]
  powers?: string[]
  effects?: string[]
}

// DestinyNode
export interface DestinyNode {
  id?: string
  name: string
  edid: string
  description?: string
  icon?: string
  globalFormId?: string
  prerequisites?: string[]
  nextBranches?: string[]
  levelRequirement?: number
  lore?: string
  tags?: string[]
}

// PerkTree
export interface PerkTreePerk {
  id: string
  name: string
  description: string
  rank: number
  requirements?: string[]
}
export interface PerkTree {
  treeId: string
  perks: PerkTreePerk[]
}

// SearchResult
export interface SearchResultHighlight {
  field: string
  snippet: string
}
export interface SearchResult {
  type: string
  id: string
  name: string
  description?: string
  category?: string
  tags?: string[]
  score: number
  highlights: SearchResultHighlight[]
}

// Data file types - unified array structure
export type SkillsData = Skill[]
export type RacesData = Race[]
export type TraitsData = Trait[]
export type ReligionsData = Religion[]
export type BirthsignsData = Birthsign[]
export type DestinyNodesData = DestinyNode[]
export type PerkTreesData = PerkTree[]
