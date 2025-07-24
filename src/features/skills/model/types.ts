import { z } from 'zod'

// ============================================================================
// SKILL TYPES
// ============================================================================

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

// ============================================================================
// PERK TYPES
// ============================================================================

// Prerequisite item schema
export const PrerequisiteItemSchema = z.object({
  type: z.string(),
  id: z.string(),
})

// Skill level prerequisite schema
export const SkillLevelPrerequisiteSchema = z.object({
  skill: z.string(),
  level: z.number(),
})

// Prerequisites schema
export const PrerequisitesSchema = z.object({
  skillLevel: SkillLevelPrerequisiteSchema.optional(),
  items: z.array(PrerequisiteItemSchema).optional(),
})

// Description schema
export const DescriptionSchema = z.object({
  base: z.string(),
  subtext: z.string(),
})

// Rank schema
export const RankSchema = z.object({
  rank: z.number(),
  edid: z.string(),
  name: z.string(),
  description: DescriptionSchema,
  prerequisites: PrerequisitesSchema,
})

// Position schema
export const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
  horizontal: z.number(),
  vertical: z.number(),
})

// Connections schema
export const ConnectionsSchema = z.object({
  parents: z.array(z.string()),
  children: z.array(z.string()),
})

// Perk node schema
export const PerkNodeSchema = z.object({
  edid: z.string(),
  name: z.string(),
  ranks: z.array(RankSchema),
  totalRanks: z.number(),
  connections: ConnectionsSchema,
  isRoot: z.boolean(),
  position: PositionSchema,
})

// Perk tree schema
export const PerkTreeSchema = z.object({
  treeId: z.string(),
  treeName: z.string(),
  treeDescription: z.string(),
  category: z.string(),
  perks: z.array(PerkNodeSchema),
})

// Array of perk trees
export const PerkTreesSchema = z.array(PerkTreeSchema)

// TypeScript types inferred from schemas
export type PrerequisiteItem = z.infer<typeof PrerequisiteItemSchema>
export type SkillLevelPrerequisite = z.infer<typeof SkillLevelPrerequisiteSchema>
export type Prerequisites = z.infer<typeof PrerequisitesSchema>
export type Description = z.infer<typeof DescriptionSchema>
export type Rank = z.infer<typeof RankSchema>
export type Position = z.infer<typeof PositionSchema>
export type Connections = z.infer<typeof ConnectionsSchema>
export type PerkNode = z.infer<typeof PerkNodeSchema>
export type PerkTree = z.infer<typeof PerkTreeSchema>

// Extended PerkNode type for component usage
export type PerkNodeWithUI = PerkNode & {
  selected?: boolean
  currentRank?: number
  hasChildren?: boolean
  isRoot?: boolean
}

// Extended PerkNode type for React Flow data
export type PerkNodeData = PerkNode & {
  selected?: boolean
  currentRank?: number
  hasChildren?: boolean
  isRoot?: boolean
}

// Perk plan type for state management
export type PerkPlan = {
  selectedPerks: Record<string, PerkNode[]>
  minLevels: Record<string, number>
  totalPerks: number
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export const validatePerkTree = (data: unknown): PerkTree => {
  return PerkTreeSchema.parse(data)
}

export const validatePerkNode = (data: unknown): PerkNode => {
  return PerkNodeSchema.parse(data)
}

export const validatePerkTrees = (data: unknown): PerkTree[] => {
  return PerkTreesSchema.parse(data)
}

export const isPerkTree = (data: unknown): data is PerkTree => {
  return PerkTreeSchema.safeParse(data).success
}

export const isPerkNode = (data: unknown): data is PerkNode => {
  return PerkNodeSchema.safeParse(data).success
}

export const isPerkTrees = (data: unknown): data is PerkTree[] => {
  return PerkTreesSchema.safeParse(data).success
} 