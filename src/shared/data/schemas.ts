// Remove all Zod imports and runtime validation. Only keep type definitions if used elsewhere.
// If types depend on Zod, replace with TypeScript interfaces.

// Skill
export interface Skill {
  id?: string;
  name: string;
  edid: string;
  description?: string;
  category?: string;
  tags?: string[];
  keyAbilities?: string[];
  metaTags?: string[];
  scaling?: string;
}

// Race
export interface RaceStartingStats {
  health: number;
  magicka: number;
  stamina: number;
  carryWeight: number;
}
export interface RaceSkillBonus {
  skill: string;
  bonus: number;
}
export interface RaceRacialSpell {
  edid: string;
  name: string;
  description: string;
  globalFormId: string;
}
export interface Race {
  id?: string;
  name: string;
  edid: string;
  description?: string;
  category?: string;
  tags?: string[];
  source?: string;
  startingStats?: RaceStartingStats;
  skillBonuses?: RaceSkillBonus[];
  racialSpells?: RaceRacialSpell[];
  keywords?: string[];
}

// Trait
export interface TraitEffect {
  type: string;
  value: number;
  description?: string;
  condition?: string;
  duration: number;
  flags: string[];
}

export interface TraitSpell {
  cost: number;
  type: string;
  castType: string;
  delivery: string;
}

export interface Trait {
  id?: string;
  name: string;
  description?: string;
  edid?: string;
  formId?: string;
  spell?: TraitSpell;
  effects?: TraitEffect[];
  category?: string;
  tags?: string[];
  diagram?: string;
}

// Religion
export interface Religion {
  id?: string;
  name: string;
  description?: string;
  pantheon?: string;
  tenets?: string[];
  powers?: string[];
  restrictions?: string[];
  favoredRaces?: string[];
  tags?: string[];
}

// Birthsign
export interface Birthsign {
  id?: string;
  name: string;
  edid: string;
  description?: string;
  category?: string;
  tags?: string[];
  powers?: string[];
  effects?: string[];
}

// DestinyNode
export interface DestinyNode {
  id?: string;
  name: string;
  edid: string;
  description?: string;
  icon?: string;
  globalFormId?: string;
  prerequisites?: string[];
  nextBranches?: string[];
  levelRequirement?: number;
  lore?: string;
  tags?: string[];
}

// PerkTree
export interface PerkTreePerk {
  id: string;
  name: string;
  description: string;
  rank: number;
  requirements?: string[];
}
export interface PerkTree {
  treeId: string;
  perks: PerkTreePerk[];
}

// SearchResult
export interface SearchResultHighlight {
  field: string;
  snippet: string;
}
export interface SearchResult {
  type: string;
  id: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  score: number;
  highlights: SearchResultHighlight[];
}

// Data file types
export interface SkillsData { skills: Skill[]; }
export interface RacesData { races: Race[]; }
export interface TraitsData { traits: Trait[]; }
export type ReligionsData = Religion[];
export interface BirthsignsData { birthsigns: Birthsign[]; }
export type DestinyNodesData = DestinyNode[];
export type PerkTreesData = PerkTree[]; 