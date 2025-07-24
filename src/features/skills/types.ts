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

// Unified skill interface for MVA architecture
export interface UnifiedSkill {
  // Basic skill properties
  id: string
  name: string
  category: string
  description: string
  keyAbilities: string[]
  metaTags: string[]
  assignmentType: 'major' | 'minor' | 'none'
  canAssignMajor: boolean
  canAssignMinor: boolean
  level: number
  totalPerks: number
  selectedPerksCount: number
  selectedPerks: Array<{ currentRank: number }>
  isSelected: boolean
}

// Perk-related types (consolidated from perks feature)
export interface PrerequisiteItem {
  type: string
  id: string
}

export interface SkillLevelPrerequisite {
  skill: string
  level: number
}

export interface Prerequisites {
  skillLevel?: SkillLevelPrerequisite
  items?: PrerequisiteItem[]
}

export interface Description {
  base: string
  subtext: string
}

export interface Rank {
  rank: number
  edid: string
  name: string
  description: Description
  prerequisites: Prerequisites
}

export interface Position {
  x: number
  y: number
  horizontal: number
  vertical: number
}

export interface Connections {
  parents: string[]
  children: string[]
}

export interface PerkNode {
  edid: string
  name: string
  ranks: Rank[]
  totalRanks: number
  connections: Connections
  isRoot: boolean
  position: Position
}

export interface PerkTree {
  treeId: string
  treeName: string
  treeDescription: string
  category: string
  perks: PerkNode[]
}

// Extended PerkNode type for component usage
export interface PerkNodeWithUI extends PerkNode {
  selected?: boolean
  currentRank?: number
  hasChildren?: boolean
}

// Extended PerkNode type for React Flow data
export interface PerkNodeData extends PerkNode {
  selected?: boolean
  currentRank?: number
  hasChildren?: boolean
}

export interface PerkPlan {
  selectedPerks: Record<string, PerkNode[]>
  minLevels: Record<string, number>
  totalPerks: number
}

export interface SkillWithPerks {
  id: string
  name: string
  icon: string
  description: string
  selectedPerks: number
  minLevel: number
}
