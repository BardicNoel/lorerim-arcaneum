# Zod Schema System Documentation

## Overview

The Zod schema system provides comprehensive runtime validation, type safety, and data quality monitoring for all application data. This system ensures that data loaded from JSON files is properly validated, transformed, and cached for optimal performance.

## Architecture

### Core Components

1. **Schemas** (`src/shared/data/schemas.ts`)
   - Zod schema definitions for all data types
   - Enhanced validation rules with custom error messages
   - Skyrim-specific validation (EDID format, stat ranges, etc.)

2. **Validation Utilities** (`src/shared/data/validationUtils.ts`)
   - Generic validation functions with caching
   - Data quality reporting and monitoring
   - Error handling and transformation utilities

3. **Data Provider** (`src/shared/data/DataProvider.ts`)
   - Centralized data store with Zustand
   - Integration with Zod validation
   - Caching and search functionality

## Schema Definitions

### Base Entity Schema

All entities extend the `BaseEntitySchema` which provides common validation:

```typescript
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
```

### Enhanced Validation Rules

#### Skill Schema
- **EDID Validation**: Must follow Skyrim naming convention
- **Required Fields**: id, name, edid
- **Optional Fields**: description, category, tags, keyAbilities, metaTags, scaling

```typescript
export const SkillSchema = BaseEntitySchema.extend({
  edid: z.string().min(1, 'EDID is required'),
  keyAbilities: z.array(z.string()).optional(),
  metaTags: z.array(z.string()).optional(),
  scaling: z.string().optional(),
}).refine((data) => {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(data.edid)
}, {
  message: 'EDID must follow Skyrim naming convention',
  path: ['edid']
})
```

#### Race Schema
- **Starting Stats**: Health, magicka, stamina (0-1000), carry weight (0-10000)
- **Skill Bonuses**: -100 to +100 range validation
- **EDID Validation**: Skyrim naming convention

```typescript
export const RaceStartingStatsSchema = z.object({
  health: z.number().min(0, 'Health cannot be negative').max(1000, 'Health seems unreasonably high'),
  magicka: z.number().min(0, 'Magicka cannot be negative').max(1000, 'Magicka seems unreasonably high'),
  stamina: z.number().min(0, 'Stamina cannot be negative').max(1000, 'Stamina seems unreasonably high'),
  carryWeight: z.number().min(0, 'Carry weight cannot be negative').max(10000, 'Carry weight seems unreasonably high'),
})
```

#### Destiny Node Schema
- **Level Requirements**: 1-100 range validation
- **EDID Validation**: Skyrim naming convention
- **Optional Fields**: globalFormId, prerequisites, nextBranches, lore

#### Perk Tree Schema
- **Perk Ranks**: 1-10 range validation
- **Minimum Requirements**: At least one perk per tree

## Validation Functions

### Safe Validation Functions

These functions return `null` on validation failure and log detailed errors:

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

### Enhanced Validation with Caching

The `validateData` function provides:
- **Performance Caching**: 5-minute cache for validation results
- **Timing Information**: Validation performance metrics
- **Detailed Error Reporting**: Structured error messages with context

```typescript
export function validateData<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  context: string,
  useCache: boolean = true
): ValidationResult<T>
```

## Data Quality Monitoring

### Quality Report Interface

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
    invalidEdids: number
  }
  warnings: string[]
  recommendations: string[]
  qualityScore: number // 0-100
}
```

### Quality Score Calculation

The quality score is calculated based on:
- **Required Fields**: name, description, category, tags
- **Data Integrity**: duplicate IDs, invalid EDIDs
- **Completeness**: percentage of items with all required fields

### Automatic Quality Monitoring

All transformation functions automatically generate quality reports:

```typescript
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
```

## Error Handling

### Structured Error Messages

Zod errors are formatted with context and field paths:

```
Skills data validation failed:
[invalid_string] edid: EDID must follow Skyrim naming convention
[too_small] name: Name is required and cannot be empty
```

### Error Handling Utilities

```typescript
export function handleValidationError(
  error: unknown,
  context: string,
  fallbackData: any[] = []
): { data: any[]; error: string | null; warnings?: string[] }
```

## Performance Features

### Validation Caching

- **Cache Duration**: 5 minutes
- **Cache Key**: Context + JSON stringified data
- **Cache Management**: Automatic cleanup of expired entries

### Cache Utilities

```typescript
// Clear validation cache
export function clearValidationCache(): void

// Get cache statistics
export function getValidationCacheStats(): {
  size: number
  entries: Array<{ key: string; timestamp: number; age: number }>
}
```

## Integration with Data Provider

### Automatic Validation

The DataProvider automatically validates all loaded data:

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
      // Update cache timestamp
    } catch (error) {
      state.setError('skills', error instanceof Error ? error.message : 'Failed to load skills')
    } finally {
      state.setLoading('skills', false)
    }
  }
}
```

## Best Practices

### 1. Schema Design

- **Use descriptive error messages** for better debugging
- **Implement custom refinements** for domain-specific validation
- **Set appropriate min/max values** for numeric fields
- **Use optional fields** for non-critical data

### 2. Error Handling

- **Always use safe validation functions** in production code
- **Log validation errors** for debugging
- **Provide fallback data** when validation fails
- **Monitor quality scores** to maintain data integrity

### 3. Performance

- **Enable validation caching** for frequently accessed data
- **Monitor cache statistics** to optimize cache duration
- **Use appropriate cache keys** to avoid cache misses

### 4. Data Quality

- **Set quality score thresholds** (recommended: 80+)
- **Address warnings** in quality reports
- **Follow recommendations** for data improvement
- **Monitor EDID format compliance**

## Migration Guide

### From Manual Validation

1. **Replace manual type checking** with Zod schemas
2. **Update data loading functions** to use safe validation
3. **Add quality monitoring** to transformation functions
4. **Implement error handling** with structured messages

### Example Migration

**Before:**
```typescript
const skills = await fetch('/data/skills.json').then(r => r.json())
if (!Array.isArray(skills)) {
  throw new Error('Invalid skills data')
}
```

**After:**
```typescript
const rawData = await fetch('/data/skills.json').then(r => r.json())
const validatedData = safeValidateSkillsData(rawData)
if (!validatedData) {
  throw new Error('Invalid skills data format')
}
const skills = transformSkillsData(validatedData)
```

## Troubleshooting

### Common Issues

1. **EDID Format Errors**
   - Ensure EDIDs start with letter or underscore
   - Use only letters, numbers, and underscores
   - Example: `MySkill_01`, `_CustomSkill`

2. **Quality Score Warnings**
   - Add missing descriptions
   - Include categories for better organization
   - Add tags for improved searchability

3. **Validation Performance**
   - Check cache hit rates
   - Monitor validation timing
   - Consider adjusting cache duration

### Debug Tools

```typescript
// Get validation cache statistics
const stats = getValidationCacheStats()
console.log('Cache size:', stats.size)
console.log('Cache entries:', stats.entries)

// Clear cache if needed
clearValidationCache()

// Check schema compatibility
const compatibility = validateSchemaCompatibility(data, schema, 'context')
if (!compatibility.compatible) {
  console.log('Schema issues:', compatibility.issues)
}
```

## Future Enhancements

### Planned Features

1. **Schema Versioning**: Support for schema evolution
2. **Custom Validators**: Domain-specific validation rules
3. **Performance Metrics**: Detailed validation timing analysis
4. **Data Migration**: Automatic data format updates
5. **Schema Documentation**: Auto-generated schema documentation

### Contributing

When adding new schemas or validation rules:

1. **Follow existing patterns** for consistency
2. **Add comprehensive error messages**
3. **Include quality monitoring**
4. **Update documentation**
5. **Add tests for edge cases**

## Conclusion

The Zod schema system provides a robust foundation for data validation, type safety, and quality monitoring. By following the patterns and best practices outlined in this documentation, you can ensure reliable, performant, and maintainable data handling throughout the application. 