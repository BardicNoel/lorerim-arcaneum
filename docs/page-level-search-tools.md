# Page-Level Search Tools - Generic Structure

## Overview

This document defines the generic structure for page-level search tools used across the Lorerim Arcaneum application. The races-v2 feature serves as the emblematic implementation of this pattern, providing a comprehensive search and filtering system that can be adapted for other features like spells, perks, and more.

## Core Architecture

### Model-View-Adapter (MVA) Pattern

The page-level search tools follow the MVA pattern with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Model       │    │    Adapters     │    │      Views      │
│                 │    │                 │    │                 │
│ • Data Models   │◄──►│ • useData       │◄──►│ • Page Views    │
│ • Business      │    │ • useFilters    │    │ • Search UI     │
│   Logic         │    │ • useState      │    │ • Results       │
│ • Validation    │    │ • useComputed   │    │   Display       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Generic Search Structure

### 1. Search Categories System

The search system is built around a flexible category-based approach:

```typescript
interface SearchCategory {
  id: string
  name: string
  placeholder: string
  options: SearchOption[]
}

interface SearchOption {
  id: string
  label: string
  value: string
  category: string
  description: string
}

interface SelectedTag {
  id: string
  label: string
  value: string
  category: string
}
```

#### Standard Categories

Every feature should implement these core categories:

1. **Fuzzy Search** (`keywords` or `fuzzy-search`)
   - Free-text search across names, descriptions, and abilities
   - Supports custom input and autocomplete suggestions
   - Primary search interface

2. **Feature-Specific Categories**
   - Races: `skill-bonuses`, `race-categories`
   - Spells: `schools`, `levels`, `effect-types`
   - Perks: `trees`, `skill-requirements`
   - Religions: `deities`, `blessings`

### 2. Adapter Layer Structure

#### Core Adapters

```typescript
// Data Adapter
interface UseDataAdapter<T> {
  items: T[]
  isLoading: boolean
  error: string | null
  categories: string[]
  tags: string[]
}

// Filters Adapter
interface UseFiltersAdapter<T> {
  // State
  searchQuery: string
  activeFilters: FilterState
  
  // Computed
  filteredItems: T[]
  categories: string[]
  tags: string[]
  
  // Actions
  setSearchQuery: (query: string) => void
  setFilters: (filters: FilterState) => void
  clearFilters: () => void
  addTagFilter: (tag: string) => void
  removeTagFilter: (tag: string) => void
}

// State Adapter
interface UseStateAdapter {
  selectedItem: string | null
  viewMode: 'grid' | 'list'
  expandedSections: string[]
  
  setSelectedItem: (id: string | null) => void
  setViewMode: (mode: 'grid' | 'list') => void
  toggleExpandedSection: (id: string) => void
}

// Computed Adapter
interface UseComputedAdapter<T> {
  transformedItems: T[]
  searchCategories: SearchCategory[]
  categoriesWithCounts: Record<string, number>
  tagsWithCounts: Record<string, number>
}
```

### 3. Search Interface Components

#### CustomMultiAutocompleteSearch

The primary search interface that combines:

- **FuzzySearchBox**: For free-text search (takes remaining space)
- **AutocompleteSearch**: For categorical filters (fixed width)

```typescript
interface CustomMultiAutocompleteSearchProps {
  categories: SearchCategory[]
  onSelect: (option: SearchOption | string) => void
  onCustomSearch: (query: string) => void
  className?: string
}
```

#### Tag Management

Selected filters are displayed as removable tags:

```typescript
interface TagManagement {
  selectedTags: SelectedTag[]
  handleTagSelect: (optionOrTag: SearchOption | string) => void
  handleTagRemove: (tagId: string) => void
  clearAllTags: () => void
}
```

### 4. Filter Application Logic

#### Multi-Layer Filtering

```typescript
// 1. Apply categorical filters
const filteredByCategories = items.filter(item => {
  return selectedTags.every(tag => {
    switch (tag.category) {
      case 'Feature Categories':
        return item.category === tag.value
      case 'Skill Bonuses':
        return item.skills.some(skill => skill.name === tag.value)
      case 'Keywords':
        return item.keywords.some(keyword => keyword === tag.value)
      default:
        return true
    }
  })
})

// 2. Apply fuzzy search
const { filteredItems } = useFuzzySearch(filteredByCategories, fuzzySearchQuery)

// 3. Apply additional filters (sorting, pagination, etc.)
const finalItems = applyAdditionalFilters(filteredItems)
```

## Implementation Pattern

### 1. Feature-Specific Implementation

Each feature should implement:

```typescript
// 1. Generate search categories
const generateSearchCategories = (): SearchCategory[] => {
  const allKeywords = [...new Set(items.flatMap(item => item.keywords))]
  const allCategories = [...new Set(items.map(item => item.category))]
  
  return [
    {
      id: 'keywords',
      name: 'Fuzzy Search',
      placeholder: 'Search by name, description, or abilities...',
      options: allKeywords.map(keyword => ({
        id: `keyword-${keyword}`,
        label: keyword,
        value: keyword,
        category: 'Fuzzy Search',
        description: `Items with ${keyword} keyword`,
      })),
    },
    {
      id: 'categories',
      name: 'Feature Categories',
      placeholder: 'Filter by category...',
      options: allCategories.map(category => ({
        id: `category-${category}`,
        label: category,
        value: category,
        category: 'Feature Categories',
        description: `${category} items`,
      })),
    },
  ]
}

// 2. Tag management
const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([])

const handleTagSelect = (optionOrTag: SearchOption | string) => {
  let tag: SelectedTag
  if (typeof optionOrTag === 'string') {
    tag = {
      id: `custom-${optionOrTag}`,
      label: optionOrTag,
      value: optionOrTag,
      category: 'Fuzzy Search',
    }
  } else {
    tag = {
      id: `${optionOrTag.category}-${optionOrTag.id}`,
      label: optionOrTag.label,
      value: optionOrTag.value,
      category: optionOrTag.category,
    }
  }
  
  if (!selectedTags.some(t => t.value === tag.value && t.category === tag.category)) {
    setSelectedTags(prev => [...prev, tag])
  }
}

// 3. Filter application
const filteredItemsWithTags = items.filter(item => {
  if (selectedTags.length === 0) return true
  
  return selectedTags.every(tag => {
    // Feature-specific filter logic
    return applyFilter(item, tag)
  })
})

const fuzzySearchQuery = selectedTags
  .filter(tag => tag.category === 'Fuzzy Search')
  .map(tag => tag.value)
  .join(' ')

const { filteredItems } = useFuzzySearch(filteredItemsWithTags, fuzzySearchQuery)
```

### 2. View Component Structure

```typescript
export function FeaturePageView() {
  // Adapters
  const { items, isLoading, error } = useFeatureData()
  const { viewMode, setViewMode } = useFeatureState()
  const { filteredItems } = useFeatureFilters({ items })
  
  // Search setup
  const searchCategories = generateSearchCategories()
  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([])
  
  // Tag management
  const handleTagSelect = (optionOrTag: SearchOption | string) => { /* ... */ }
  const handleTagRemove = (tagId: string) => { /* ... */ }
  
  // Filtered results
  const finalItems = applyFilters(filteredItems, selectedTags)
  
  return (
    <BuildPageShell title="Feature" description="...">
      {/* Search Interface */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <CustomMultiAutocompleteSearch
            categories={searchCategories}
            onSelect={handleTagSelect}
            onCustomSearch={handleTagSelect}
          />
        </div>
        
        {/* View Mode Toggle */}
        <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>
      
      {/* Selected Tags */}
      <SelectedTagsDisplay
        tags={selectedTags}
        onTagRemove={handleTagRemove}
        onClearAll={() => setSelectedTags([])}
      />
      
      {/* Results Display */}
      <ResultsDisplay
        items={finalItems}
        viewMode={viewMode}
        onItemSelect={handleItemSelect}
      />
    </BuildPageShell>
  )
}
```

## Migration Guide: Spells to Races Pattern

### Current Spells Implementation Issues

1. **Inconsistent Search Interface**: Uses basic input + filter badges instead of the unified search system
2. **Separate Filter Logic**: Filters are handled separately from search, creating complexity
3. **No Tag Management**: Selected filters aren't displayed as removable tags
4. **Limited Categorization**: Search categories aren't dynamically generated from data

### Migration Steps

1. **Update Adapters**
   - Implement `useSpellFilters` following the races pattern
   - Add tag-based filtering alongside existing filter logic
   - Generate search categories from spell data

2. **Update View Component**
   - Replace current search interface with `CustomMultiAutocompleteSearch`
   - Add tag management system
   - Implement multi-layer filtering

3. **Update Search Categories**
   ```typescript
   const generateSpellSearchCategories = (): SearchCategory[] => {
     const allSchools = [...new Set(spells.map(spell => spell.school))]
     const allLevels = [...new Set(spells.map(spell => spell.level))]
     const allEffects = [...new Set(spells.flatMap(spell => spell.effects))]
     
     return [
       {
         id: 'keywords',
         name: 'Fuzzy Search',
         placeholder: 'Search spells by name, school, level, or effects...',
         options: [], // Will be populated by fuzzy search
       },
       {
         id: 'schools',
         name: 'Magic Schools',
         placeholder: 'Filter by school...',
         options: allSchools.map(school => ({
           id: `school-${school}`,
           label: school,
           value: school,
           category: 'Magic Schools',
           description: `${school} spells`,
         })),
       },
       {
         id: 'levels',
         name: 'Spell Levels',
         placeholder: 'Filter by level...',
         options: allLevels.map(level => ({
           id: `level-${level}`,
           label: level,
           value: level,
           category: 'Spell Levels',
           description: `${level} spells`,
         })),
       },
     ]
   }
   ```

4. **Implement Tag-Based Filtering**
   ```typescript
   const filteredSpellsWithTags = spells.filter(spell => {
     if (selectedTags.length === 0) return true
     
     return selectedTags.every(tag => {
       switch (tag.category) {
         case 'Magic Schools':
           return spell.school === tag.value
         case 'Spell Levels':
           return spell.level === tag.value
         case 'Fuzzy Search':
           return true // Handled by fuzzy search
         default:
           return true
       }
     })
   })
   ```

## Benefits of the Generic Structure

1. **Consistency**: All features use the same search interface and behavior
2. **Maintainability**: Centralized search logic reduces code duplication
3. **User Experience**: Familiar interface across all features
4. **Extensibility**: Easy to add new search categories and filters
5. **Performance**: Optimized filtering and search algorithms
6. **Accessibility**: Standardized keyboard navigation and screen reader support

## Future Enhancements

1. **Advanced Search Operators**: Support for AND/OR logic, exact phrases, etc.
2. **Search History**: Remember recent searches and filters
3. **Saved Searches**: Allow users to save and share search configurations
4. **Search Analytics**: Track popular searches and filter combinations
5. **Smart Suggestions**: AI-powered search suggestions based on user behavior
6. **Bulk Operations**: Select multiple items from search results for batch operations

## Conclusion

The races-v2 implementation provides a robust, scalable foundation for page-level search tools. By migrating other features to follow this pattern, we ensure consistency, maintainability, and an excellent user experience across the entire application.

The generic structure is flexible enough to accommodate different data types while maintaining a consistent interface and behavior pattern that users can rely on throughout their interaction with the application.