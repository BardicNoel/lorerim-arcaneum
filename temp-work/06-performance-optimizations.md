# Unit of Work: Performance Optimizations

## 📋 Overview

Implement comprehensive performance optimizations for the birthsigns feature to improve rendering speed, reduce unnecessary re-renders, and optimize data processing.

## 🎯 Objective

Enhance user experience by reducing loading times, improving responsiveness, and optimizing memory usage throughout the birthsigns feature.

## 📊 Current Issues

- **No memoization** of expensive computations
- **Unnecessary re-renders** due to missing React.memo
- **Large component trees** without virtualization
- **Expensive text parsing** on every render
- **Inefficient filtering** without proper caching
- **No lazy loading** for heavy components
- **Large bundle size** due to unused imports

## 🔧 Proposed Changes

### 1. Component Memoization

#### `src/features/birthsigns/components/BirthsignAccordion.tsx`

```typescript
import React, { memo, useMemo, useCallback } from 'react'

// Memoize the entire component
export const BirthsignAccordion = memo(function BirthsignAccordion({
  item,
  originalBirthsign,
  isExpanded = false,
  onToggle,
  className,
  showStats = true,
  showPowers = true,
  showSkills = true,
  showEffects = true,
}: BirthsignAccordionProps) {
  // Memoize expensive computations
  const parsedDescription = useMemo(() => {
    if (!originalBirthsign?.description) return ''
    return parseDescription(originalBirthsign.description)
  }, [originalBirthsign?.description])

  const effectIcon = useMemo(() => {
    return (effectType: string) => {
      const config = getBirthsignEffectIcon(effectType)
      return <config.icon className={`h-4 w-4 ${config.color}`} />
    }
  }, [])

  const effectTypeColor = useMemo(() => {
    return (type: 'bonus' | 'penalty' | 'conditional' | 'mastery') => {
      return getBirthsignEffectTypeColor(type)
    }
  }, [])

  // Memoize callback functions
  const handleToggle = useCallback(() => {
    onToggle?.()
  }, [onToggle])

  // Memoize conditional rendering
  const shouldShowStats = useMemo(() => {
    return showStats && originalBirthsign?.stat_modifications.length > 0
  }, [showStats, originalBirthsign?.stat_modifications.length])

  const shouldShowPowers = useMemo(() => {
    return showPowers && originalBirthsign?.powers.length > 0
  }, [showPowers, originalBirthsign?.powers.length])

  const shouldShowSkills = useMemo(() => {
    return showSkills && originalBirthsign?.skill_bonuses.length > 0
  }, [showSkills, originalBirthsign?.skill_bonuses.length])

  const shouldShowEffects = useMemo(() => {
    return showEffects && (
      (originalBirthsign?.conditional_effects?.length > 0) ||
      (originalBirthsign?.mastery_effects?.length > 0)
    )
  }, [showEffects, originalBirthsign?.conditional_effects?.length, originalBirthsign?.mastery_effects?.length])

  // Rest of component implementation
})
```

#### `src/features/birthsigns/components/BirthsignCard.tsx`

```typescript
import React, { memo, useMemo, useCallback } from 'react'

export const BirthsignCard = memo(function BirthsignCard({
  birthsign,
  item,
  isSelected = false,
  onClick,
}: BirthsignCardProps) {
  // Memoize expensive computations
  const groupColor = useMemo(() => {
    return getBirthsignGroupColor(birthsign.group)
  }, [birthsign.group])

  const parsedDescription = useMemo(() => {
    return parseDescription(birthsign.description)
  }, [birthsign.description])

  const tags = useMemo(() => {
    return [
      birthsign.group,
      ...birthsign.stat_modifications.slice(0, 2).map(stat => stat.stat),
      ...birthsign.powers.slice(0, 1).map(power => power.name),
    ].filter((tag, index, arr) => arr.indexOf(tag) === index)
  }, [birthsign.group, birthsign.stat_modifications, birthsign.powers])

  const handleClick = useCallback(() => {
    onClick?.()
  }, [onClick])

  // Rest of component implementation
})
```

### 2. Optimize Text Formatting with Memoization

#### `src/shared/utils/textFormatting.ts`

```typescript
import { memoize } from 'lodash-es'

// Memoize the parsing function to avoid repeated computations
export const parseFormattedText = memoize(
  (
    text: string,
    options: TextFormattingOptions = {}
  ): FormattedTextSegment[] => {
    // Implementation with memoization
  },
  (text, options) => `${text}-${JSON.stringify(options)}` // Custom cache key
)

// Clear cache when needed (e.g., on theme change)
export function clearTextFormattingCache() {
  parseFormattedText.cache.clear()
}
```

#### `src/features/birthsigns/components/BirthsignFormattedText.tsx`

```typescript
import React, { memo, useMemo } from 'react'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { getBirthsignTextFormattingOptions } from '@/shared/utils/birthsignTextFormatting'

export const BirthsignFormattedText = memo(function BirthsignFormattedText({
  text,
  className,
  as,
}: BirthsignFormattedTextProps) {
  // Memoize options to prevent unnecessary re-renders
  const options = useMemo(() => getBirthsignTextFormattingOptions(), [])

  return (
    <FormattedText
      text={text}
      options={options}
      className={className}
      as={as}
    />
  )
})
```

### 3. Optimize Data Processing with Caching

#### `src/features/birthsigns/hooks/useFuzzySearch.ts`

```typescript
import { useMemo, useCallback } from 'react'
import Fuse from 'fuse.js'
import { memoize } from 'lodash-es'

// Memoize searchable birthsign creation
const createSearchableBirthsigns = memoize((birthsigns: Birthsign[]) => {
  return birthsigns.map(birthsign => ({
    id: birthsign.name.toLowerCase().replace(/\s+/g, '-'),
    name: birthsign.name,
    description: birthsign.description,
    group: birthsign.group,
    statModifications: birthsign.stat_modifications.map(
      stat =>
        `${stat.stat} ${stat.type} ${stat.value}${stat.value_type === 'percentage' ? '%' : ''}`
    ),
    skillBonuses: birthsign.skill_bonuses.map(
      skill =>
        `${skill.stat} +${skill.value}${skill.value_type === 'percentage' ? '%' : ''}`
    ),
    powers: birthsign.powers.map(power => `${power.name} ${power.description}`),
    conditionalEffects:
      birthsign.conditional_effects?.map(
        effect =>
          `${effect.stat} ${effect.description} ${effect.condition || ''}`
      ) || [],
    masteryEffects:
      birthsign.mastery_effects?.map(
        effect =>
          `${effect.stat} ${effect.description} ${effect.condition || ''}`
      ) || [],
    originalBirthsign: birthsign,
  }))
})

// Memoize Fuse instance creation
const createFuseInstance = memoize(
  (searchableBirthsigns: SearchableBirthsign[]) => {
    const fuseOptions = {
      keys: [
        { name: 'name', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'powers', weight: 0.2 },
        { name: 'statModifications', weight: 0.15 },
        { name: 'skillBonuses', weight: 0.15 },
        { name: 'conditionalEffects', weight: 0.1 },
        { name: 'masteryEffects', weight: 0.1 },
        { name: 'group', weight: 0.1 },
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true,
    }

    return new Fuse(searchableBirthsigns, fuseOptions)
  }
)

export function useFuzzySearch(birthsigns: Birthsign[], searchQuery: string) {
  // Memoize searchable birthsigns
  const searchableBirthsigns = useMemo(() => {
    return createSearchableBirthsigns(birthsigns)
  }, [birthsigns])

  // Memoize Fuse instance
  const fuse = useMemo(() => {
    return createFuseInstance(searchableBirthsigns)
  }, [searchableBirthsigns])

  // Memoize search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return searchableBirthsigns.map(birthsign => ({
        item: birthsign,
        score: 0,
        matches: [],
      }))
    }
    return fuse.search(searchQuery)
  }, [fuse, searchQuery, searchableBirthsigns])

  // Memoize filtered birthsigns
  const filteredBirthsigns = useMemo(() => {
    return searchResults.map(result => result.item.originalBirthsign)
  }, [searchResults])

  return {
    filteredBirthsigns,
    searchResults,
    searchableBirthsigns,
  }
}
```

### 4. Implement Virtual Scrolling for Large Lists

#### `src/features/birthsigns/components/VirtualizedBirthsignList.tsx`

```typescript
import React, { memo } from 'react'
import { FixedSizeList as List } from 'react-window'
import { BirthsignAccordion } from './BirthsignAccordion'
import type { Birthsign, PlayerCreationItem } from '../types'

interface VirtualizedBirthsignListProps {
  items: PlayerCreationItem[]
  birthsigns: Birthsign[]
  expandedBirthsigns: Set<string>
  onToggle: (id: string) => void
  showStats: boolean
  showPowers: boolean
  showSkills: boolean
  showEffects: boolean
}

const ITEM_HEIGHT = 200 // Adjust based on actual item height

export const VirtualizedBirthsignList = memo(function VirtualizedBirthsignList({
  items,
  birthsigns,
  expandedBirthsigns,
  onToggle,
  showStats,
  showPowers,
  showSkills,
  showEffects,
}: VirtualizedBirthsignListProps) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = items[index]
    const originalBirthsign = birthsigns.find(birthsign =>
      birthsign.name.toLowerCase().replace(/\s+/g, '-') === item.id
    )
    const isExpanded = expandedBirthsigns.has(item.id)

    return (
      <div style={style}>
        <BirthsignAccordion
          item={item}
          originalBirthsign={originalBirthsign}
          isExpanded={isExpanded}
          onToggle={() => onToggle(item.id)}
          showStats={showStats}
          showPowers={showPowers}
          showSkills={showSkills}
          showEffects={showEffects}
        />
      </div>
    )
  }

  return (
    <List
      height={800} // Adjust based on container height
      itemCount={items.length}
      itemSize={ITEM_HEIGHT}
      width="100%"
    >
      {Row}
    </List>
  )
})
```

### 5. Lazy Load Heavy Components

#### `src/features/birthsigns/components/LazyBirthsignDetailPanel.tsx`

```typescript
import React, { Suspense, lazy } from 'react'
import { Skeleton } from '@/shared/ui/ui/skeleton'

// Lazy load the heavy detail panel
const BirthsignDetailPanel = lazy(() =>
  import('./BirthsignDetailPanel').then(module => ({
    default: module.BirthsignDetailPanel
  }))
)

interface LazyBirthsignDetailPanelProps {
  birthsign: Birthsign
  item: PlayerCreationItem
}

export function LazyBirthsignDetailPanel({
  birthsign,
  item,
}: LazyBirthsignDetailPanelProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      }
    >
      <BirthsignDetailPanel birthsign={birthsign} item={item} />
    </Suspense>
  )
}
```

### 6. Optimize Bundle Size

#### `src/features/birthsigns/components/index.ts`

```typescript
// Use dynamic imports for heavy components
export const BirthsignDetailPanel = lazy(() =>
  import('./BirthsignDetailPanel').then(module => ({
    default: module.BirthsignDetailPanel,
  }))
)

// Export lighter components directly
export { BirthsignCard } from './BirthsignCard'
export { BirthsignAccordion } from './BirthsignAccordion'
export { BirthsignAvatar } from './BirthsignAvatar'
```

### 7. Implement Debounced Search

#### `src/features/birthsigns/hooks/useDebouncedSearch.ts`

```typescript
import { useState, useEffect, useCallback } from 'react'
import { debounce } from 'lodash-es'

export function useDebouncedSearch(searchQuery: string, delay: number = 300) {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)

  const debouncedSetQuery = useCallback(
    debounce((query: string) => {
      setDebouncedQuery(query)
    }, delay),
    [delay]
  )

  useEffect(() => {
    debouncedSetQuery(searchQuery)
  }, [searchQuery, debouncedSetQuery])

  return debouncedQuery
}
```

### 8. Optimize Image Loading

#### `src/shared/components/generic/EntityAvatar.tsx`

```typescript
import React, { memo, useState, useCallback } from 'react'

export const EntityAvatar = memo(function EntityAvatar({
  entityName,
  entityType,
  size = 'md',
  className,
}: EntityAvatarProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const avatarFileName = getAvatarFileName(entityType, entityName)

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
  }, [])

  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])

  // Fallback to first letter avatar if no image or error
  if (!avatarFileName || imageError) {
    return (
      <div
        className={cn(
          'bg-muted rounded-full flex items-center justify-center font-bold text-muted-foreground',
          sizeClasses[size],
          className
        )}
      >
        <span className={cn(textSizeClasses[size])}>
          {entityName.charAt(0)}
        </span>
      </div>
    )
  }

  // Return image avatar with loading state
  return (
    <div
      className={cn(
        'rounded-full overflow-hidden bg-muted flex items-center justify-center',
        sizeClasses[size],
        className
      )}
    >
      {!imageLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        src={`${import.meta.env.BASE_URL}assets/${entityType === 'birthsign' ? 'sign-avatar' : `${entityType}-avatar`}/${avatarFileName}`}
        alt={`${entityName} avatar`}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-200',
          imageLoaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  )
})
```

## 📁 Files to Create/Modify

### New Files

- `src/features/birthsigns/components/VirtualizedBirthsignList.tsx`
- `src/features/birthsigns/components/LazyBirthsignDetailPanel.tsx`
- `src/features/birthsigns/hooks/useDebouncedSearch.ts`

### Modified Files

- `src/features/birthsigns/components/BirthsignAccordion.tsx` - Add memoization
- `src/features/birthsigns/components/BirthsignCard.tsx` - Add memoization
- `src/shared/utils/textFormatting.ts` - Add memoization
- `src/features/birthsigns/components/BirthsignFormattedText.tsx` - Add memoization
- `src/features/birthsigns/hooks/useFuzzySearch.ts` - Add caching
- `src/shared/components/generic/EntityAvatar.tsx` - Optimize image loading
- `src/features/birthsigns/components/index.ts` - Add lazy loading

## 🧪 Testing Strategy

- Performance benchmarks for rendering speed
- Memory usage tests
- Bundle size analysis
- Search performance tests
- Image loading performance tests

## 📈 Benefits

- **Faster Rendering**: Reduced re-renders and optimized computations
- **Better UX**: Smoother interactions and faster search
- **Lower Memory Usage**: Efficient caching and lazy loading
- **Smaller Bundle**: Code splitting and tree shaking
- **Scalability**: Virtual scrolling for large datasets

## ⚠️ Risks

- **Complexity**: Memoization can add complexity
- **Memory**: Caching can increase memory usage
- **Bundle Size**: Additional dependencies for optimization
- **Debugging**: Memoized components can be harder to debug

## 🎯 Success Criteria

- [ ] Component re-renders reduced by 50%+
- [ ] Search performance improved by 30%+
- [ ] Bundle size reduced by 20%+
- [ ] Memory usage optimized
- [ ] Virtual scrolling working for large lists
- [ ] Image loading optimized
- [ ] Performance benchmarks passing

## 📅 Estimated Effort

- **Development**: 3 days
- **Testing**: 1 day
- **Performance Analysis**: 1 day
- **Total**: 5 days
