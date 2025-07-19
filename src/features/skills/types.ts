export interface Skill {
  name: string
  edid: string
  category: string
  description: string
  scaling: string
  keyAbilities: string[]
  metaTags: string[]
  abbreviation?: string
}

export interface SkillFilters {
  search: string
  category: string
  tags: string[]
}

export interface TransformedSkill {
  id: string
  name: string
  description: string
  tags: string[]
  effects: string[]
  category: string
  scaling?: string
  keyAbilities?: string[]
  metaTags?: string[]
  abbreviation?: string
}

export type SortOption = 'alphabetical' | 'category' | 'ability-count'

export interface SkillSearchResult {
  id: string
  name: string
  category: string
  tags: string[]
  matchType: 'name' | 'description' | 'ability' | 'tag'
  matchScore: number
}
