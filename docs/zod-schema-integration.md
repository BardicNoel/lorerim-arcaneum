# Zod Schema Integration Documentation

## 🎯 Overview

This document describes the integration of Zod schemas into the standardized data loading system, providing runtime validation, type safety, and data quality assurance.

## 🏗️ Architecture

### Schema Structure

```
src/shared/data/
├── schemas.ts              # Zod schema definitions
├── validationUtils.ts      # Validation utilities and helpers
├── DataProvider.ts         # Updated with Zod validation
└── index.ts               # Exports all schemas and utilities
```

### Schema Hierarchy

```
BaseEntitySchema
├── SkillSchema
├── RaceSchema
├── TraitSchema
├── ReligionSchema
├── BirthsignSchema
└── DestinyNodeSchema

PerkTreeSchema (standalone)
SearchResultSchema (standalone)
```

## 📋 Schema Definitions

### Base Entity Schema

```typescript
export const BaseEntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
})
```

### Feature-Specific Schemas

#### Skill Schema
```typescript
export const SkillSchema = BaseEntitySchema.extend({
  edid: z.string(),
  keyAbilities: z.array(z.string()).optional(),
  metaTags: z.array(z.string()).optional(),
  scaling: z.string().optional(),
})
```

#### Race Schema
```typescript
export const RaceSchema = BaseEntitySchema.extend({
  edid: z.string(),
  source: z.string().optional(),
  startingStats: RaceStartingStatsSchema.optional(),
  skillBonuses: z.array(RaceSkillBonusSchema).optional(),
  racialSpells: z.array(RaceRacialSpellSchema).optional(),
  keywords: z.array(z.string()).optional(),
})
```

#### Trait Schema
```typescript
export const TraitSchema = BaseEntitySchema.extend({
  effects: z.array(TraitEffectSchema).optional(),
})
```

#### Religion Schema
```typescript
export const ReligionSchema = BaseEntitySchema.extend({
  pantheon: z.string().optional(),
  tenets: z.array(z.string()).optional(),
  powers: z.array(z.string()).optional(),
  restrictions: z.array(z.string()).optional(),
  favoredRaces: z.array(z.string()).optional(),
})
```

#### Birthsign Schema
```typescript
export const BirthsignSchema = BaseEntitySchema.extend({
  edid: z.string(),
  powers: z.array(z.string()).optional(),
  effects: z.array(z.string()).optional(),
})
```

#### Destiny Node Schema
```typescript
export const DestinyNodeSchema = BaseEntitySchema.extend({
  edid: z.string(),
  globalFormId: z.string().optional(),
  prerequisites: z.array(z.string()).optional(),
  nextBranches: z.array(z.string()).optional(),
  levelRequirement: z.number().optional(),
  lore: z.string().optional(),
})
```

### Data File Schemas

#### Skills Data Schema
```typescript
export const SkillsDataSchema = z.object({
  skills: z.array(SkillSchema),
})
```

#### Races Data Schema
```typescript
export const RacesDataSchema = z.object({
  races: z.array(RaceSchema),
})
```

#### Religions Data Schema
```typescript
export const ReligionsDataSchema = z.array(z.object({
  type: z.string(),
  deities: z.array(z.object({
    id: z.string().optional(),
    name: z.string(),
    description: z.string().optional(),
    tenets: z.array(z.string()).optional(),
    powers: z.array(z.string()).optional(),
    restrictions: z.array(z.string()).optional(),
    favoredRaces: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  })),
}))
```

## 🔧 Validation Functions

### Safe Validation Functions

These functions return `null` on validation failure and log errors:

```typescript
export function safeValidateSkillsData(data: unknown) {
  try {
    return SkillsDataSchema.parse(data)
  } catch (error) {
    console.error('Skills data validation failed:', error)
    return null
  }
}
```

### Strict Validation Functions

These functions throw Zod errors on validation failure:

```typescript
export function validateSkillsData(data: unknown) {
  return SkillsDataSchema.parse(data)
}
```

### Advanced Validation Functions

```typescript
export function validateData<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  context: string
): ValidationResult<T> {
  try {
    const validatedData = schema.parse(data)
    return {
      success: true,
      data: validatedData,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`${context} validation failed:`, error.errors)
      return {
        success: false,
        errors: error,
        errorMessage: formatZodError(error, context),
      }
    }
    
    return {
      success: false,
      errorMessage: `Unknown validation error for ${context}`,
    }
  }
}
```

## 📊 Data Quality Reporting

### Data Quality Report Interface

```typescript
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
  }
  warnings: string[]
}
```

### Usage Example

```typescript
import { generateDataQualityReport } from '@/shared/data'

const skills = loadSkillsData()
const report = generateDataQualityReport(skills, 'Skills')

if (report.warnings.length > 0) {
  console.warn('Data quality issues found:', report.warnings)
}
```

## 🔄 Data Transformation

### Transformation Functions

Each data type has a corresponding transformation function that:
1. Validates the data using Zod schemas
2. Transforms the data into the expected format
3. Generates a data quality report
4. Returns the transformed data

```typescript
export function transformSkillsData(data: SkillsData) {
  const transformedSkills = data.skills.map(skill => ({
    ...skill,
    tags: [...(skill.metaTags || []), skill.category].filter(Boolean),
  }))

  generateDataQualityReport(transformedSkills, 'Skills')
  return transformedSkills
}
```

## 🚨 Error Handling

### Custom Error Classes

```typescript
export class DataValidationError extends Error {
  constructor(
    message: string,
    public context: string,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'DataValidationError'
  }
}
```

### Error Handling Utilities

```typescript
export function handleValidationError(
  error: unknown,
  context: string,
  fallbackData: any[] = []
): { data: any[]; error: string | null } {
  if (error instanceof DataValidationError) {
    console.error(`Data validation error in ${context}:`, error.message)
    return { data: fallbackData, error: error.message }
  }

  if (error instanceof z.ZodError) {
    const formattedError = formatZodError(error, context)
    console.error(`Zod validation error in ${context}:`, formattedError)
    return { data: fallbackData, error: formattedError }
  }

  const errorMessage = error instanceof Error ? error.message : 'Unknown validation error'
  return { data: fallbackData, error: errorMessage }
}
```

## 🔧 Integration with DataProvider

### Updated Loading Methods

The DataProvider now uses Zod validation for all data loading:

```typescript
loadSkills: async () => {
  const state = get()
  if (!state.isCacheValid('skills')) {
    state.setLoading('skills', true)
    state.setError('skills', null)
    
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}data/skills.json`)
      if (!response.ok) throw new Error('Failed to fetch skills data')
      
      const rawData = await response.json()
      const validatedData = safeValidateSkillsData(rawData)
      
      if (!validatedData) {
        throw new Error('Invalid skills data format')
      }
      
      const skills = validatedData.skills.map(skill => ({
        ...skill,
        tags: [...(skill.metaTags || []), skill.category].filter(Boolean),
      }))
      
      state.setSkills(skills)
      // Update cache timestamp...
    } catch (error) {
      state.setError('skills', error instanceof Error ? error.message : 'Failed to load skills')
    } finally {
      state.setLoading('skills', false)
    }
  }
}
```

## 📈 Benefits

### 1. Runtime Type Safety
- Validates data structure at runtime
- Catches data format errors early
- Prevents runtime crashes from malformed data

### 2. Development Experience
- IntelliSense support for all data types
- Compile-time type checking
- Automatic type inference from schemas

### 3. Data Quality Assurance
- Automatic data quality reporting
- Detection of missing or invalid fields
- Duplicate ID detection

### 4. Error Handling
- Structured error messages
- Graceful fallbacks
- Detailed validation error reporting

### 5. Maintainability
- Single source of truth for data structure
- Easy schema updates
- Consistent validation across features

## 🧪 Testing

### Schema Testing

```typescript
import { describe, it, expect } from 'vitest'
import { SkillSchema, safeValidateSkillsData } from '@/shared/data'

describe('Skill Schema Validation', () => {
  it('should validate valid skill data', () => {
    const validSkill = {
      id: 'test-skill',
      name: 'Test Skill',
      description: 'A test skill',
      edid: 'TestSkill',
      category: 'Combat',
      keyAbilities: ['Strength'],
      metaTags: ['combat', 'melee'],
      scaling: 'Strength',
    }

    const result = SkillSchema.safeParse(validSkill)
    expect(result.success).toBe(true)
  })

  it('should reject invalid skill data', () => {
    const invalidSkill = {
      // Missing required fields
      description: 'A test skill',
    }

    const result = SkillSchema.safeParse(invalidSkill)
    expect(result.success).toBe(false)
  })
})
```

### Data Loading Testing

```typescript
import { describe, it, expect, vi } from 'vitest'
import { useSkills } from '@/shared/data'

describe('Skills Data Loading', () => {
  it('should handle validation errors gracefully', async () => {
    // Mock fetch to return invalid data
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ skills: [{ invalid: 'data' }] }),
    })

    const { loadSkills, error } = useSkills()
    await loadSkills()

    expect(error).toContain('Invalid skills data format')
  })
})
```

## 🔄 Migration Guide

### From Manual Validation

#### Before
```typescript
const loadSkills = async () => {
  const response = await fetch('/data/skills.json')
  const data = await response.json()
  
  // Manual validation
  if (!data.skills || !Array.isArray(data.skills)) {
    throw new Error('Invalid skills data')
  }
  
  const skills = data.skills.map(skill => {
    if (!skill.name || !skill.edid) {
      throw new Error('Invalid skill data')
    }
    return skill
  })
  
  return skills
}
```

#### After
```typescript
import { safeValidateSkillsData, transformSkillsData } from '@/shared/data'

const loadSkills = async () => {
  const response = await fetch('/data/skills.json')
  const rawData = await response.json()
  
  const validatedData = safeValidateSkillsData(rawData)
  if (!validatedData) {
    throw new Error('Invalid skills data format')
  }
  
  return transformSkillsData(validatedData)
}
```

### Adding New Data Types

1. **Define the schema**:
```typescript
export const NewTypeSchema = BaseEntitySchema.extend({
  // Add type-specific fields
  customField: z.string(),
  optionalField: z.number().optional(),
})
```

2. **Add validation functions**:
```typescript
export function safeValidateNewTypeData(data: unknown) {
  try {
    return NewTypeDataSchema.parse(data)
  } catch (error) {
    console.error('New type data validation failed:', error)
    return null
  }
}
```

3. **Add transformation function**:
```typescript
export function transformNewTypeData(data: NewTypeData) {
  const transformed = data.items.map(item => ({
    ...item,
    tags: [item.category, ...(item.tags || [])].filter(Boolean),
  }))

  generateDataQualityReport(transformed, 'New Type')
  return transformed
}
```

4. **Update DataProvider**:
```typescript
// Add to DataState interface
newType: NewType[]

// Add loading method
loadNewType: async () => {
  // Implementation using Zod validation
}
```

## 📊 Performance Considerations

### Schema Compilation
- Zod schemas are compiled once at module load
- No runtime compilation overhead
- Efficient validation for large datasets

### Memory Usage
- Validation results are cached in the store
- No duplicate validation for cached data
- Minimal memory overhead from schema definitions

### Bundle Size
- Zod adds ~12KB to bundle size
- Tree-shaking removes unused schemas
- Consider code splitting for large applications

## 🔮 Future Enhancements

### 1. Advanced Validation
- Custom validation rules
- Cross-field validation
- Conditional validation based on field values

### 2. Schema Evolution
- Schema versioning
- Backward compatibility
- Migration helpers

### 3. Performance Optimizations
- Schema caching
- Lazy validation
- Parallel validation for large datasets

### 4. Developer Tools
- Schema visualization
- Data quality dashboards
- Validation performance metrics

## 📚 API Reference

### Schema Exports
```typescript
// Base schemas
BaseEntitySchema, SkillSchema, RaceSchema, TraitSchema, ReligionSchema, BirthsignSchema, DestinyNodeSchema, PerkTreeSchema

// Data file schemas
SkillsDataSchema, RacesDataSchema, TraitsDataSchema, ReligionsDataSchema, BirthsignsDataSchema, DestinyNodesDataSchema, PerkTreesDataSchema

// Validation functions
validateSkillsData, validateRacesData, validateTraitsData, validateReligionsData, validateBirthsignsData, validateDestinyNodesData, validatePerkTreesData

// Safe validation functions
safeValidateSkillsData, safeValidateRacesData, safeValidateTraitsData, safeValidateReligionsData, safeValidateBirthsignsData, safeValidateDestinyNodesData, safeValidatePerkTreesData

// Transformation functions
transformSkillsData, transformRacesData, transformTraitsData, transformReligionsData, transformBirthsignsData, transformDestinyNodesData

// Utilities
generateDataQualityReport, handleValidationError, formatZodError, DataValidationError
```

### Type Exports
```typescript
// Base types
BaseEntity, Skill, Race, Trait, Religion, Birthsign, DestinyNode, PerkTree, SearchResult

// Data file types
SkillsData, RacesData, TraitsData, ReligionsData, BirthsignsData, DestinyNodesData, PerkTreesData

// Utility types
ValidationResult, ValidationFunction, DataQualityReport
```

This Zod schema integration provides a robust foundation for data validation, type safety, and quality assurance in the standardized data loading system. 