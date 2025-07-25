import { z } from 'zod'

// Enhanced base entity schema with better error messages
export const BaseEntitySchema = z.object({
  id: z.string().min(1, 'ID is required and cannot be empty'),
  name: z.string().min(1, 'Name is required and cannot be empty'),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
}).refine((data) => {
  // Ensure ID is URL-safe
  return /^[a-zA-Z0-9-_]+$/.test(data.id)
}, {
  message: 'ID must contain only letters, numbers, hyphens, and underscores',
  path: ['id']
})

// Enhanced skill schema with additional validation
export const SkillSchema = BaseEntitySchema.extend({
  edid: z.string().min(1, 'EDID is required'),
  keyAbilities: z.array(z.string()).optional(),
  metaTags: z.array(z.string()).optional(),
  scaling: z.string().optional(),
}).refine((data) => {
  // Ensure EDID follows Skyrim naming convention
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(data.edid)
}, {
  message: 'EDID must follow Skyrim naming convention (letters, numbers, underscores, starting with letter or underscore)',
  path: ['edid']
})

// Race starting stats schema with range validation
export const RaceStartingStatsSchema = z.object({
  health: z.number().min(0, 'Health cannot be negative').max(1000, 'Health seems unreasonably high'),
  magicka: z.number().min(0, 'Magicka cannot be negative').max(1000, 'Magicka seems unreasonably high'),
  stamina: z.number().min(0, 'Stamina cannot be negative').max(1000, 'Stamina seems unreasonably high'),
  carryWeight: z.number().min(0, 'Carry weight cannot be negative').max(10000, 'Carry weight seems unreasonably high'),
})

// Race skill bonus schema with validation
export const RaceSkillBonusSchema = z.object({
  skill: z.string().min(1, 'Skill name is required'),
  bonus: z.number().min(-100, 'Skill bonus cannot be less than -100').max(100, 'Skill bonus cannot be more than 100'),
})

// Race racial spell schema
export const RaceRacialSpellSchema = z.object({
  edid: z.string().min(1, 'Spell EDID is required'),
  name: z.string().min(1, 'Spell name is required'),
  description: z.string().min(1, 'Spell description is required'),
  globalFormId: z.string().min(1, 'Global form ID is required'),
})

// Enhanced race schema
export const RaceSchema = BaseEntitySchema.extend({
  edid: z.string().min(1, 'Race EDID is required'),
  source: z.string().optional(),
  startingStats: RaceStartingStatsSchema.optional(),
  skillBonuses: z.array(RaceSkillBonusSchema).optional(),
  racialSpells: z.array(RaceRacialSpellSchema).optional(),
  keywords: z.array(z.string()).optional(),
}).refine((data) => {
  // Ensure EDID follows Skyrim naming convention
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(data.edid)
}, {
  message: 'Race EDID must follow Skyrim naming convention',
  path: ['edid']
})

// Trait effect schema with validation
export const TraitEffectSchema = z.object({
  type: z.string().min(1, 'Effect type is required'),
  value: z.number(),
  description: z.string().optional(),
})

// Enhanced trait schema
export const TraitSchema = BaseEntitySchema.extend({
  effects: z.array(TraitEffectSchema).optional(),
})

// Enhanced religion schema
export const ReligionSchema = BaseEntitySchema.extend({
  pantheon: z.string().optional(),
  tenets: z.array(z.string()).optional(),
  powers: z.array(z.string()).optional(),
  restrictions: z.array(z.string()).optional(),
  favoredRaces: z.array(z.string()).optional(),
})

// Enhanced birthsign schema
export const BirthsignSchema = BaseEntitySchema.extend({
  edid: z.string().min(1, 'Birthsign EDID is required'),
  powers: z.array(z.string()).optional(),
  effects: z.array(z.string()).optional(),
}).refine((data) => {
  // Ensure EDID follows Skyrim naming convention
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(data.edid)
}, {
  message: 'Birthsign EDID must follow Skyrim naming convention',
  path: ['edid']
})

// Enhanced destiny node schema
export const DestinyNodeSchema = BaseEntitySchema.extend({
  edid: z.string().min(1, 'Destiny node EDID is required'),
  globalFormId: z.string().optional(),
  prerequisites: z.array(z.string()).optional(),
  nextBranches: z.array(z.string()).optional(),
  levelRequirement: z.number().min(1, 'Level requirement must be at least 1').max(100, 'Level requirement cannot exceed 100').optional(),
  lore: z.string().optional(),
}).refine((data) => {
  // Ensure EDID follows Skyrim naming convention
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(data.edid)
}, {
  message: 'Destiny node EDID must follow Skyrim naming convention',
  path: ['edid']
})

// Enhanced perk tree perk schema
export const PerkTreePerkSchema = z.object({
  id: z.string().min(1, 'Perk ID is required'),
  name: z.string().min(1, 'Perk name is required'),
  description: z.string().min(1, 'Perk description is required'),
  rank: z.number().min(1, 'Rank must be at least 1').max(10, 'Rank cannot exceed 10'),
  requirements: z.array(z.string()).optional(),
})

// Enhanced perk tree schema
export const PerkTreeSchema = z.object({
  treeId: z.string().min(1, 'Tree ID is required'),
  perks: z.array(PerkTreePerkSchema).min(1, 'Perk tree must have at least one perk'),
})

// Search result highlight schema
export const SearchResultHighlightSchema = z.object({
  field: z.string().min(1, 'Field name is required'),
  snippet: z.string().min(1, 'Snippet text is required'),
})

// Enhanced search result schema
export const SearchResultSchema = z.object({
  type: z.enum(['skill', 'race', 'trait', 'religion', 'birthsign', 'destiny', 'perk']),
  id: z.string().min(1, 'Result ID is required'),
  name: z.string().min(1, 'Result name is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  score: z.number().min(0, 'Score cannot be negative').max(1, 'Score cannot exceed 1'),
  highlights: z.array(SearchResultHighlightSchema),
})

// Data file schemas with enhanced validation
export const SkillsDataSchema = z.object({
  skills: z.array(SkillSchema).min(1, 'Skills data must contain at least one skill'),
})

export const RacesDataSchema = z.object({
  races: z.array(RaceSchema).min(1, 'Races data must contain at least one race'),
})

export const TraitsDataSchema = z.object({
  traits: z.array(TraitSchema).min(1, 'Traits data must contain at least one trait'),
})

export const ReligionsDataSchema = z.array(z.object({
  type: z.string().min(1, 'Pantheon type is required'),
  deities: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Deity name is required'),
    description: z.string().optional(),
    tenets: z.array(z.string()).optional(),
    powers: z.array(z.string()).optional(),
    restrictions: z.array(z.string()).optional(),
    favoredRaces: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  })).min(1, 'Pantheon must contain at least one deity'),
})).min(1, 'Religions data must contain at least one pantheon')

export const BirthsignsDataSchema = z.object({
  birthsigns: z.array(BirthsignSchema).min(1, 'Birthsigns data must contain at least one birthsign'),
})

export const DestinyNodesDataSchema = z.array(DestinyNodeSchema).min(1, 'Destiny nodes data must contain at least one node')

export const PerkTreesDataSchema = z.array(PerkTreeSchema).min(1, 'Perk trees data must contain at least one tree')

// Enhanced validation functions with better error handling
export function validateSkillsData(data: unknown) {
  return SkillsDataSchema.parse(data)
}

export function validateRacesData(data: unknown) {
  return RacesDataSchema.parse(data)
}

export function validateTraitsData(data: unknown) {
  return TraitsDataSchema.parse(data)
}

export function validateReligionsData(data: unknown) {
  return ReligionsDataSchema.parse(data)
}

export function validateBirthsignsData(data: unknown) {
  return BirthsignsDataSchema.parse(data)
}

export function validateDestinyNodesData(data: unknown) {
  return DestinyNodesDataSchema.parse(data)
}

export function validatePerkTreesData(data: unknown) {
  return PerkTreesDataSchema.parse(data)
}

// Safe validation functions that return null on error with detailed logging
export function safeValidateSkillsData(data: unknown) {
  try {
    return SkillsDataSchema.parse(data)
  } catch (error) {
    console.error('Skills data validation failed:', error)
    return null
  }
}

export function safeValidateRacesData(data: unknown) {
  try {
    return RacesDataSchema.parse(data)
  } catch (error) {
    console.error('Races data validation failed:', error)
    return null
  }
}

export function safeValidateTraitsData(data: unknown) {
  try {
    return TraitsDataSchema.parse(data)
  } catch (error) {
    console.error('Traits data validation failed:', error)
    return null
  }
}

export function safeValidateReligionsData(data: unknown) {
  try {
    return ReligionsDataSchema.parse(data)
  } catch (error) {
    console.error('Religions data validation failed:', error)
    return null
  }
}

export function safeValidateBirthsignsData(data: unknown) {
  try {
    return BirthsignsDataSchema.parse(data)
  } catch (error) {
    console.error('Birthsigns data validation failed:', error)
    return null
  }
}

export function safeValidateDestinyNodesData(data: unknown) {
  try {
    return DestinyNodesDataSchema.parse(data)
  } catch (error) {
    console.error('Destiny nodes data validation failed:', error)
    return null
  }
}

export function safeValidatePerkTreesData(data: unknown) {
  try {
    return PerkTreesDataSchema.parse(data)
  } catch (error) {
    console.error('Perk trees data validation failed:', error)
    return null
  }
}

// Type exports
export type BaseEntity = z.infer<typeof BaseEntitySchema>
export type Skill = z.infer<typeof SkillSchema>
export type Race = z.infer<typeof RaceSchema>
export type Trait = z.infer<typeof TraitSchema>
export type Religion = z.infer<typeof ReligionSchema>
export type Birthsign = z.infer<typeof BirthsignSchema>
export type DestinyNode = z.infer<typeof DestinyNodeSchema>
export type PerkTree = z.infer<typeof PerkTreeSchema>
export type SearchResult = z.infer<typeof SearchResultSchema>
export type SearchResultHighlight = z.infer<typeof SearchResultHighlightSchema>

// Data file types
export type SkillsData = z.infer<typeof SkillsDataSchema>
export type RacesData = z.infer<typeof RacesDataSchema>
export type TraitsData = z.infer<typeof TraitsDataSchema>
export type ReligionsData = z.infer<typeof ReligionsDataSchema>
export type BirthsignsData = z.infer<typeof BirthsignsDataSchema>
export type DestinyNodesData = z.infer<typeof DestinyNodesDataSchema>
export type PerkTreesData = z.infer<typeof PerkTreesDataSchema> 