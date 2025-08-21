import { z } from 'zod'
import {
  type SkillsData,
  type RacesData,
  type TraitsData,
  type ReligionsData,
  type BirthsignsData,
  type DestinyNodesData,
  type PerkTreesData,
  SkillsDataSchema,
  RacesDataSchema,
  TraitsDataSchema,
  ReligionsDataSchema,
  BirthsignsDataSchema,
  DestinyNodesDataSchema,
  PerkTreesDataSchema,
} from './schemas'

// Enhanced validation result type
export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: z.ZodError
  errorMessage?: string
  warnings?: string[]
  validationTime?: number
}

// Validation function type
export type ValidationFunction<T> = (data: unknown) => ValidationResult<T>

// Validation cache for performance
const validationCache = new Map<string, { result: ValidationResult<any>; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Generic validation function with caching and timing
export function validateData<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  context: string,
  useCache: boolean = true
): ValidationResult<T> {
  const startTime = performance.now()
  
  // Generate cache key
  const cacheKey = useCache ? `${context}-${JSON.stringify(data)}` : null
  
  // Check cache
  if (cacheKey && validationCache.has(cacheKey)) {
    const cached = validationCache.get(cacheKey)!
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return {
        ...cached.result,
        validationTime: performance.now() - startTime,
      }
    } else {
      validationCache.delete(cacheKey)
    }
  }

  try {
    const validatedData = schema.parse(data)
    const result: ValidationResult<T> = {
      success: true,
      data: validatedData,
      validationTime: performance.now() - startTime,
    }
    
    // Cache successful validation
    if (cacheKey) {
      validationCache.set(cacheKey, { result, timestamp: Date.now() })
    }
    
    return result
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`${context} validation failed:`, error.issues)
      const result: ValidationResult<T> = {
        success: false,
        errors: error,
        errorMessage: formatZodError(error, context),
        validationTime: performance.now() - startTime,
      }
      
      // Cache failed validation (to avoid repeated parsing of invalid data)
      if (cacheKey) {
        validationCache.set(cacheKey, { result, timestamp: Date.now() })
      }
      
      return result
    }
    
    console.error(`${context} validation failed with unknown error:`, error)
    return {
      success: false,
      errorMessage: `Unknown validation error for ${context}`,
      validationTime: performance.now() - startTime,
    }
  }
}

// Enhanced Zod error formatting with better structure
export function formatZodError(error: z.ZodError, context: string): string {
  const issues = error.issues.map((issue: z.ZodIssue) => {
    const path = issue.path.join('.')
    const message = issue.message
    const code = issue.code
    return path ? `[${code}] ${path}: ${message}` : `[${code}] ${message}`
  })
  
  return `${context} validation failed:\n${issues.join('\n')}`
}

// Specific validation functions with enhanced error reporting
export function validateSkillsDataSafe(data: unknown): ValidationResult<SkillsData> {
  return validateData(data, SkillsDataSchema, 'Skills data')
}

export function validateRacesDataSafe(data: unknown): ValidationResult<RacesData> {
  return validateData(data, RacesDataSchema, 'Races data')
}

export function validateTraitsDataSafe(data: unknown): ValidationResult<TraitsData> {
  return validateData(data, TraitsDataSchema, 'Traits data')
}

export function validateReligionsDataSafe(data: unknown): ValidationResult<ReligionsData> {
  return validateData(data, ReligionsDataSchema, 'Religions data')
}

export function validateBirthsignsDataSafe(data: unknown): ValidationResult<BirthsignsData> {
  return validateData(data, BirthsignsDataSchema, 'Birthsigns data')
}

export function validateDestinyNodesDataSafe(data: unknown): ValidationResult<DestinyNodesData> {
  return validateData(data, DestinyNodesDataSchema, 'Destiny nodes data')
}

export function validatePerkTreesDataSafe(data: unknown): ValidationResult<PerkTreesData> {
  return validateData(data, PerkTreesDataSchema, 'Perk trees data')
}

// Enhanced data quality checks
export interface DataQualityReport {
  totalItems: number
  missingFields: {
    name: number
    description: number
    category: number
    tags: number
  }
  invalidFields: {
    emptyNames: number
    emptyIds: number
    duplicateIds: number
    invalidEdids: number
  }
  warnings: string[]
  recommendations: string[]
  qualityScore: number // 0-100
}

export function generateDataQualityReport<T extends { id: string; name: string; description?: string; category?: string; tags?: string[]; edid?: string }>(
  items: T[],
  context: string
): DataQualityReport {
  const report: DataQualityReport = {
    totalItems: items.length,
    missingFields: {
      name: 0,
      description: 0,
      category: 0,
      tags: 0,
    },
    invalidFields: {
      emptyNames: 0,
      emptyIds: 0,
      duplicateIds: 0,
      invalidEdids: 0,
    },
    warnings: [],
    recommendations: [],
    qualityScore: 0,
  }

  const ids = new Set<string>()
  const duplicateIds = new Set<string>()
  const edidPattern = /^[A-Za-z_][A-Za-z0-9_]*$/

  items.forEach((item, index) => {
    // Check for missing fields
    if (!item.name) {
      report.missingFields.name++
      report.invalidFields.emptyNames++
    }
    if (!item.description) {
      report.missingFields.description++
    }
    if (!item.category) {
      report.missingFields.category++
    }
    if (!item.tags || item.tags.length === 0) {
      report.missingFields.tags++
    }

    // Check for invalid fields
    if (!item.id) {
      report.invalidFields.emptyIds++
    } else {
      if (ids.has(item.id)) {
        duplicateIds.add(item.id)
        report.invalidFields.duplicateIds++
      } else {
        ids.add(item.id)
      }
    }

    // Check EDID format if present
    if ('edid' in item && item.edid && !edidPattern.test(item.edid)) {
      report.invalidFields.invalidEdids++
    }
  })

  // Generate warnings
  if (report.missingFields.name > 0) {
    report.warnings.push(`${report.missingFields.name} items missing names`)
  }
  if (report.missingFields.description > 0) {
    report.warnings.push(`${report.missingFields.description} items missing descriptions`)
  }
  if (report.invalidFields.duplicateIds > 0) {
    report.warnings.push(`${report.invalidFields.duplicateIds} duplicate IDs found: ${Array.from(duplicateIds).join(', ')}`)
  }
  if (report.invalidFields.invalidEdids > 0) {
    report.warnings.push(`${report.invalidFields.invalidEdids} items have invalid EDID format`)
  }

  // Generate recommendations
  if (report.missingFields.description > report.totalItems * 0.5) {
    report.recommendations.push('Consider adding descriptions to improve user experience')
  }
  if (report.missingFields.category > report.totalItems * 0.3) {
    report.recommendations.push('Consider adding categories to improve organization')
  }
  if (report.missingFields.tags > report.totalItems * 0.7) {
    report.recommendations.push('Consider adding tags to improve searchability')
  }

  // Calculate quality score (0-100)
  const totalChecks = report.totalItems * 4 // name, description, category, tags
  const passedChecks = totalChecks - 
    report.missingFields.name - 
    report.missingFields.description - 
    report.missingFields.category - 
    report.missingFields.tags
  report.qualityScore = Math.round((passedChecks / totalChecks) * 100)

  // Log report if there are issues
  if (report.warnings.length > 0) {
    console.warn(`${context} data quality report:`, report)
  }

  return report
}

// Enhanced data transformation helpers with validation
export function transformSkillsData(data: SkillsData) {
  const transformedSkills = data.skills.map(skill => ({
    ...skill,
    tags: [...(skill.metaTags || []), skill.category].filter((tag): tag is string => Boolean(tag)),
  }))

  const qualityReport = generateDataQualityReport(transformedSkills, 'Skills')
  if (qualityReport.qualityScore < 80) {
    console.warn('Skills data quality score is low:', qualityReport.qualityScore)
  }

  return transformedSkills
}

export function transformRacesData(data: RacesData) {
  const transformedRaces = data.races.map(race => ({
    ...race,
    tags: [race.category, ...(race.keywords || [])].filter((tag): tag is string => Boolean(tag)),
  }))

  const qualityReport = generateDataQualityReport(transformedRaces, 'Races')
  if (qualityReport.qualityScore < 80) {
    console.warn('Races data quality score is low:', qualityReport.qualityScore)
  }

  return transformedRaces
}

export function transformTraitsData(data: TraitsData) {
  const transformedTraits = data.traits.map(trait => ({
    ...trait,
    id: trait.id || trait.name,
    tags: [trait.category, ...(trait.tags || []), ...(trait.effects?.map(e => e.type) || [])].filter((tag): tag is string => Boolean(tag)),
  }))

  const qualityReport = generateDataQualityReport(transformedTraits, 'Traits')
  if (qualityReport.qualityScore < 80) {
    console.warn('Traits data quality score is low:', qualityReport.qualityScore)
  }

  return transformedTraits
}

export function transformReligionsData(data: ReligionsData) {
  const transformedReligions = data.flatMap(pantheon =>
    pantheon.deities.map(deity => ({
      id: deity.id || deity.name,
      name: deity.name,
      description: deity.description,
      pantheon: pantheon.type,
      tenets: deity.tenets || [],
      powers: deity.powers || [],
      restrictions: deity.restrictions || [],
      favoredRaces: deity.favoredRaces || [],
      tags: [pantheon.type, ...(deity.tags || [])].filter((tag): tag is string => Boolean(tag)),
    }))
  )

  const qualityReport = generateDataQualityReport(transformedReligions, 'Religions')
  if (qualityReport.qualityScore < 80) {
    console.warn('Religions data quality score is low:', qualityReport.qualityScore)
  }

  return transformedReligions
}

export function transformBirthsignsData(data: BirthsignsData) {
  const transformedBirthsigns = data.birthsigns.map(birthsign => ({
    ...birthsign,
    tags: [birthsign.category, ...(birthsign.tags || [])].filter((tag): tag is string => Boolean(tag)),
  }))

  const qualityReport = generateDataQualityReport(transformedBirthsigns, 'Birthsigns')
  if (qualityReport.qualityScore < 80) {
    console.warn('Birthsigns data quality score is low:', qualityReport.qualityScore)
  }

  return transformedBirthsigns
}

export function transformDestinyNodesData(data: DestinyNodesData) {
  const transformedDestinyNodes = data.map((node, index) => ({
    ...node,
    id: node.globalFormId || node.edid || `destiny-${index}`,
    nextBranches: node.nextBranches || [],
    levelRequirement: node.levelRequirement,
    lore: node.lore,
    tags: node.tags || [],
  }))

  const qualityReport = generateDataQualityReport(transformedDestinyNodes, 'Destiny Nodes')
  if (qualityReport.qualityScore < 80) {
    console.warn('Destiny nodes data quality score is low:', qualityReport.qualityScore)
  }

  return transformedDestinyNodes
}

// Enhanced error handling utilities
export class DataValidationError extends Error {
  constructor(
    message: string,
    public context: string,
    public originalError?: unknown,
    public validationTime?: number
  ) {
    super(message)
    this.name = 'DataValidationError'
  }
}

export function handleValidationError(
  error: unknown,
  context: string,
  fallbackData: any[] = []
): { data: any[]; error: string | null; warnings?: string[] } {
  if (error instanceof DataValidationError) {
    console.error(`Data validation error in ${context}:`, error.message)
    return { 
      data: fallbackData, 
      error: error.message,
      warnings: error.validationTime ? [`Validation took ${error.validationTime.toFixed(2)}ms`] : undefined
    }
  }

  if (error instanceof z.ZodError) {
    const formattedError = formatZodError(error, context)
    console.error(`Zod validation error in ${context}:`, formattedError)
    return { data: fallbackData, error: formattedError }
  }

  const errorMessage = error instanceof Error ? error.message : 'Unknown validation error'
  console.error(`Unknown error in ${context}:`, error)
  return { data: fallbackData, error: errorMessage }
}

// Cache management utilities
export function clearValidationCache(): void {
  validationCache.clear()
}

export function getValidationCacheStats(): {
  size: number
  entries: Array<{ key: string; timestamp: number; age: number }>
} {
  const now = Date.now()
  const entries = Array.from(validationCache.entries()).map(([key, value]) => ({
    key,
    timestamp: value.timestamp,
    age: now - value.timestamp,
  }))
  
  return {
    size: validationCache.size,
    entries,
  }
}

// Schema validation utilities
export function validateSchemaCompatibility<T>(
  data: T,
  schema: z.ZodSchema<any>,
  context: string
): { compatible: boolean; issues: string[] } {
  const issues: string[] = []
  
  try {
    schema.parse(data)
    return { compatible: true, issues: [] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      issues.push(...error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`))
    } else {
      issues.push('Unknown validation error')
    }
    return { compatible: false, issues }
  }
} 