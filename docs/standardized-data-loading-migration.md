# Standardized Data Loading Migration Guide

## Overview

This guide outlines the migration from feature-specific data loading to a centralized, cached data loading system with full site search capabilities.

## 🏗️ Architecture Overview

### Before (Current State)
- Each feature loads its own data independently
- No shared caching between features
- Inconsistent error handling
- Duplicate data loading
- No global search capability
- Manual type checking and validation
- No data quality monitoring

### After (New System)
- Centralized data store with Zustand
- Automatic caching with 5-minute expiry
- Consistent error handling across all features
- Single source of truth for all data
- Global search across all content types
- **Runtime validation with Zod schemas**
- **Data quality reporting and monitoring**
- **Type-safe data transformations**
- **Enhanced error messages and debugging**
- **Performance optimization with validation caching**
- **Skyrim-specific validation rules (EDID format, stat ranges)**

## 📁 New File Structure

```
src/shared/data/
├── DataProvider.ts          # Centralized data store with Zod validation
├── DataInitializer.tsx      # App startup data loading
├── schemas.ts               # Zod schema definitions
├── validationUtils.ts       # Validation utilities and helpers
└── index.ts                 # Exports all schemas and utilities
```

src/shared/components/
└── GlobalSearch.tsx         # Global search component
```

## 🔄 Migration Steps

### Step 1: Update App Entry Point

Add the `DataInitializer` to your main app component:

```tsx
// src/main.tsx
import { DataInitializer } from '@/shared/data'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <DataInitializer showLoadingIndicator={true}>
        <App />
      </DataInitializer>
    </ThemeProvider>
  </StrictMode>
)
```

### Step 2: Replace Feature-Specific Data Loading

#### Before (Example: Skills Feature)
```tsx
// src/features/skills/adapters/useSkillData.ts
export function useSkillData() {
  const [skills, setSkills] = useState<UnifiedSkill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSkills = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${import.meta.env.BASE_URL}data/skills.json`)
        if (!res.ok) throw new Error('Failed to fetch skills data')
        const data = await res.json()
        setSkills(data.skills)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load skills')
      } finally {
        setLoading(false)
      }
    }
    loadSkills()
  }, [])

  return { skills, loading, error }
}
```

#### After (Using Centralized Store)
```tsx
// src/features/skills/adapters/useSkillData.ts
import { useSkills } from '@/shared/data'

export function useSkillData() {
  const { skills, loading, error, loadSkills } = useSkills()
  
  // Automatically loads data if not cached
  useEffect(() => {
    if (!loading && skills.length === 0) {
      loadSkills()
    }
  }, [loading, skills.length, loadSkills])

  return { skills, loading, error }
}
```

### Step 3: Update Page Components

#### Before
```tsx
// src/features/skills/pages/SkillsPage.tsx
export function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSkills() {
      try {
        setLoading(true)
        const res = await fetch(`${import.meta.env.BASE_URL}data/skills.json`)
        if (!res.ok) throw new Error('Failed to fetch skills data')
        const data = await res.json()
        setSkills(data.skills)
      } catch (err) {
        setError('Failed to load skills')
      } finally {
        setLoading(false)
      }
    }
    fetchSkills()
  }, [])

  // ... rest of component
}
```

#### After
```tsx
// src/features/skills/pages/SkillsPage.tsx
import { useSkills } from '@/shared/data'

export function SkillsPage() {
  const { skills, loading, error } = useSkills()

  // ... rest of component (no data loading logic needed)
}
```

### Step 4: Add Global Search

Add the `GlobalSearch` component to your header or navigation:

```tsx
// src/app/SiteHeader.tsx
import { GlobalSearch } from '@/shared/components/GlobalSearch'

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center gap-4">
        <h1 className="text-xl font-bold">Lorerim Arcaneum</h1>
        <GlobalSearch className="max-w-md" />
        {/* ... other header content */}
      </div>
    </header>
  )
}
```

## 🔧 Feature-Specific Migration Examples

### Skills Feature Migration

1. **Update `useSkillData.ts`**:
```tsx
import { useSkills } from '@/shared/data'

export function useSkillData() {
  const { skills, loading, error, loadSkills } = useSkills()
  
  // Transform skills to feature-specific format if needed
  const transformedSkills = useMemo(() => {
    return skills.map(skill => ({
      ...skill,
      // Add any skill-specific transformations
    }))
  }, [skills])

  return { 
    skills: transformedSkills, 
    loading, 
    error,
    refreshSkills: loadSkills 
  }
}
```

2. **Update `SkillsPage.tsx`**:
```tsx
import { useSkillData } from '../adapters/useSkillData'

export function SkillsPage() {
  const { skills, loading, error } = useSkillData()

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  return (
    <div>
      {skills.map(skill => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  )
}
```

### Races Feature Migration

1. **Update `useRaces.ts`**:
```tsx
import { useRaces } from '@/shared/data'

export function useRaces() {
  const { races, loading, error, loadRaces } = useRaces()
  
  // Add race-specific filtering logic
  const [filters, setFilters] = useState<RaceFilters>({
    search: '',
    type: '',
    tags: [],
  })

  const filteredRaces = useMemo(() => {
    return races.filter(race => {
      // Apply filters
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const searchableText = [
          race.name,
          race.description,
          race.category,
          ...(race.tags || []),
        ].join(' ').toLowerCase()
        
        if (!searchableText.includes(searchLower)) return false
      }
      
      if (filters.type && race.category !== filters.type) return false
      
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => 
          race.tags?.includes(tag) || race.category === tag
        )
        if (!hasMatchingTag) return false
      }
      
      return true
    })
  }, [races, filters])

  return {
    races: filteredRaces,
    allRaces: races,
    loading,
    error,
    filters,
    setFilters,
  }
}
```

## 🎯 Benefits of Migration

### Performance Improvements
- **Reduced Network Requests**: Data is cached and shared across features
- **Faster Page Loads**: No duplicate data fetching
- **Better User Experience**: Consistent loading states

### Developer Experience
- **Simplified Code**: Remove boilerplate data loading logic
- **Consistent Patterns**: Standardized error handling and loading states
- **Type Safety**: Centralized type definitions with Zod schemas
- **Runtime Validation**: Catch data format errors early
- **Data Quality Monitoring**: Automatic quality reporting

### User Experience
- **Global Search**: Search across all content types
- **Keyboard Navigation**: Cmd/Ctrl+K to open search
- **Consistent UI**: Unified loading and error states
- **Data Reliability**: Validated data prevents crashes

## 🚀 Advanced Usage

### Custom Data Transformations

If your feature needs data in a specific format, create a transformation layer:

```tsx
// src/features/skills/adapters/skillTransformers.ts
import { useSkills } from '@/shared/data'
import type { Skill } from '@/shared/data'

export function useTransformedSkills() {
  const { skills, loading, error } = useSkills()
  
  const transformedSkills = useMemo(() => {
    return skills.map(skill => ({
      ...skill,
      // Add skill-specific computed properties
      perkCount: 0, // Will be computed from perk trees
      isSelected: false, // Will be managed by build state
    }))
  }, [skills])

  return { skills: transformedSkills, loading, error }
}
```

### Search Integration

Leverage the global search in your feature-specific components:

```tsx
// src/features/skills/components/SkillSearch.tsx
import { useGlobalSearch } from '@/shared/data'

export function SkillSearch() {
  const { searchAll } = useGlobalSearch()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])

  useEffect(() => {
    if (query.trim()) {
      const allResults = searchAll(query)
      // Filter to only skills
      const skillResults = allResults.filter(r => r.type === 'skill')
      setResults(skillResults)
    } else {
      setResults([])
    }
  }, [query, searchAll])

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search skills..."
      />
      {results.map(result => (
        <div key={result.id}>{result.name}</div>
      ))}
    </div>
  )
}
```

## 🔍 Testing the Migration

### 1. Verify Data Loading
```tsx
// Test that data loads correctly
import { useSkills } from '@/shared/data'

function TestComponent() {
  const { skills, loading, error } = useSkills()
  
  console.log('Skills:', skills.length)
  console.log('Loading:', loading)
  console.log('Error:', error)
  
  return null
}
```

### 2. Test Global Search
- Press `Cmd/Ctrl+K` to open search
- Type a search term
- Verify results appear
- Test keyboard navigation
- Verify clicking results navigates correctly

### 3. Test Caching
- Load a page with data
- Navigate away and back
- Verify data loads instantly (from cache)
- Check network tab to confirm no duplicate requests

## 🐛 Common Issues and Solutions

### Issue: Data Not Loading
**Solution**: Ensure `DataInitializer` is wrapping your app and `showLoadingIndicator` is set appropriately.

### Issue: Type Mismatches
**Solution**: Update your feature types to extend the base types from the data provider:

```tsx
import type { Skill as BaseSkill } from '@/shared/data'

export interface Skill extends BaseSkill {
  // Add feature-specific properties
  perkCount: number
  isSelected: boolean
}
```

### Issue: Search Not Working
**Solution**: Ensure all data is loaded before searching. The `GlobalSearch` component automatically calls `loadAllData()` when opened.

### Issue: Performance Issues
**Solution**: 
- Check that you're not creating unnecessary re-renders
- Use `useMemo` for expensive transformations
- Consider implementing virtual scrolling for large lists

## 📊 Migration Checklist

- [ ] Add `DataInitializer` to app entry point
- [ ] Replace feature-specific data loading hooks
- [ ] Update page components to use new hooks
- [ ] Add `GlobalSearch` to header/navigation
- [ ] Test data loading and caching
- [ ] Test global search functionality
- [ ] Update types to extend base types
- [ ] Remove old data loading code
- [ ] Test error handling
- [ ] Verify performance improvements

## 🎉 Post-Migration Benefits

After migration, you'll have:
- ✅ Centralized, cached data loading
- ✅ Global search across all content
- ✅ Consistent error handling
- ✅ Reduced code duplication
- ✅ Better performance
- ✅ Improved developer experience
- ✅ Enhanced user experience
- ✅ Runtime data validation with Zod
- ✅ Data quality monitoring and reporting
- ✅ Type-safe data transformations
- ✅ Enhanced error messages and debugging
- ✅ Performance optimization with validation caching
- ✅ Skyrim-specific validation rules

## 🔧 Enhanced Zod Schema Features

### Runtime Validation
All data is automatically validated against Zod schemas when loaded:
- **Type Safety**: Ensures data matches expected structure
- **Custom Validation**: Skyrim-specific rules (EDID format, stat ranges)
- **Error Reporting**: Detailed error messages with field paths
- **Safe Validation**: Graceful handling of invalid data

### Data Quality Monitoring
Automatic quality reports for all data:
- **Quality Scores**: 0-100 scoring based on completeness
- **Missing Fields**: Tracking of required vs optional fields
- **Data Integrity**: Detection of duplicate IDs and invalid formats
- **Recommendations**: Suggestions for data improvement

### Performance Features
- **Validation Caching**: 5-minute cache for validation results
- **Timing Metrics**: Performance monitoring for validation
- **Cache Management**: Automatic cleanup and statistics

### Example Quality Report
```typescript
{
  totalItems: 50,
  missingFields: { name: 0, description: 5, category: 2, tags: 10 },
  invalidFields: { emptyNames: 0, emptyIds: 0, duplicateIds: 0, invalidEdids: 1 },
  warnings: ["1 items have invalid EDID format"],
  recommendations: ["Consider adding tags to improve searchability"],
  qualityScore: 85
}
```

For detailed information about the Zod schema system, see [Zod Schema System Documentation](./zod-schema-system.md). 