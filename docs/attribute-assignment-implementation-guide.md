# Attribute Assignment Implementation Guide

## Phase 1: Data Structure & State Management

### Step 1.1: Update BuildState Interface

First, we need to extend the existing `BuildState` interface to include attribute assignments:

```typescript
// src/shared/types/build.ts
export interface BuildState {
  v: number
  name: string
  notes: string
  race: string | null
  stone: string | null
  religion: string | null
  traits: {
    regular: string[]
    bonus: string[]
  }
  traitLimits: {
    regular: number
    bonus: number
  }
  skills: {
    major: string[]
    minor: string[]
  }
  perks: {
    selected: Record<string, string[]>
    ranks: Record<string, number>
  }
  skillLevels: Record<string, number>
  equipment: string[]
  userProgress: {
    unlocks: string[]
  }
  destinyPath: string[]
  // NEW: Attribute assignments
  attributeAssignments: {
    health: number    // Total health increases
    stamina: number   // Total stamina increases
    magicka: number   // Total magicka increases
    level: number     // Current character level
    assignments: Record<number, 'health' | 'stamina' | 'magicka'> // Level -> attribute mapping
  }
}
```

### Step 1.2: Update DEFAULT_BUILD

```typescript
// src/shared/types/build.ts
export const DEFAULT_BUILD: BuildState = {
  v: 1,
  name: '',
  notes: '',
  race: null,
  stone: null,
  religion: null,
  traits: {
    regular: [],
    bonus: [],
  },
  traitLimits: {
    regular: 2,
    bonus: 1,
  },
  skills: {
    major: [],
    minor: [],
  },
  perks: {
    selected: {},
    ranks: {},
  },
  skillLevels: {},
  equipment: [],
  userProgress: {
    unlocks: [],
  },
  destinyPath: [],
  // NEW: Default attribute assignments
  attributeAssignments: {
    health: 0,
    stamina: 0,
    magicka: 0,
    level: 1,
    assignments: {},
  },
}
```

### Step 1.3: Create Attribute Types

```typescript
// src/features/attributes/types/index.ts
export type AttributeType = 'health' | 'stamina' | 'magicka'

export interface AttributeAssignments {
  health: number
  stamina: number
  magicka: number
  level: number
  assignments: Record<number, AttributeType>
}

export interface AttributeStats {
  base: number
  assigned: number
  total: number
  ratio: number
}

export interface AttributeDisplayData {
  health: AttributeStats
  stamina: AttributeStats
  magicka: AttributeStats
}
```

### Step 1.4: Extend Character Store

```typescript
// src/shared/stores/characterStore.ts
import { DEFAULT_BUILD, type BuildState } from '@/shared/types/build'
import { create } from 'zustand'
import type { AttributeType } from '@/features/attributes/types'

interface CharacterStore {
  build: BuildState
  updateBuild: (updates: Partial<BuildState>) => void
  setBuild: (build: BuildState) => void
  resetBuild: () => void
  // NEW: Attribute assignment methods
  setAttributeAssignment: (level: number, attribute: AttributeType) => void
  clearAttributeAssignment: (level: number) => void
  clearAllAttributeAssignments: () => void
  updateAttributeLevel: (level: number) => void
}

export const useCharacterStore = create<CharacterStore>((set, get) => ({
  build: DEFAULT_BUILD,
  updateBuild: updates =>
    set(state => ({
      build: { ...state.build, ...updates },
    })),
  setBuild: build => set({ build }),
  resetBuild: () => set({ build: DEFAULT_BUILD }),
  
  // NEW: Attribute assignment methods
  setAttributeAssignment: (level: number, attribute: AttributeType) => {
    set(state => {
      const currentAssignments = { ...state.build.attributeAssignments.assignments }
      const currentTotals = { ...state.build.attributeAssignments }
      
      // Remove previous assignment for this level if it exists
      const previousAssignment = currentAssignments[level]
      if (previousAssignment) {
        currentTotals[previousAssignment] = Math.max(0, currentTotals[previousAssignment] - 1)
      }
      
      // Add new assignment
      currentAssignments[level] = attribute
      currentTotals[attribute] += 1
      
      return {
        build: {
          ...state.build,
          attributeAssignments: {
            ...state.build.attributeAssignments,
            ...currentTotals,
            assignments: currentAssignments,
          },
        },
      }
    })
  },
  
  clearAttributeAssignment: (level: number) => {
    set(state => {
      const currentAssignments = { ...state.build.attributeAssignments.assignments }
      const currentTotals = { ...state.build.attributeAssignments }
      
      const assignment = currentAssignments[level]
      if (assignment) {
        currentTotals[assignment] = Math.max(0, currentTotals[assignment] - 1)
        delete currentAssignments[level]
      }
      
      return {
        build: {
          ...state.build,
          attributeAssignments: {
            ...state.build.attributeAssignments,
            ...currentTotals,
            assignments: currentAssignments,
          },
        },
      }
    })
  },
  
  clearAllAttributeAssignments: () => {
    set(state => ({
      build: {
        ...state.build,
        attributeAssignments: {
          health: 0,
          stamina: 0,
          magicka: 0,
          level: state.build.attributeAssignments.level,
          assignments: {},
        },
      },
    }))
  },
  
  updateAttributeLevel: (level: number) => {
    set(state => ({
      build: {
        ...state.build,
        attributeAssignments: {
          ...state.build.attributeAssignments,
          level: Math.max(1, level),
        },
      },
    }))
  },
}))
```

## Phase 2: Core Components

### Step 2.1: Create Attribute Assignment Hook

```typescript
// src/features/attributes/hooks/useAttributeAssignments.ts
import { useMemo } from 'react'
import { useCharacterStore } from '@/shared/stores/characterStore'
import type { AttributeType, AttributeDisplayData } from '../types'

export function useAttributeAssignments() {
  const { build, setAttributeAssignment, clearAttributeAssignment, clearAllAttributeAssignments, updateAttributeLevel } = useCharacterStore()
  
  const assignments = build.attributeAssignments
  
  // Calculate display data
  const displayData = useMemo((): AttributeDisplayData => {
    const level = assignments.level || 1
    const totalAssignments = assignments.health + assignments.stamina + assignments.magicka
    
    return {
      health: {
        base: 100, // Base health - could come from race data
        assigned: assignments.health,
        total: 100 + assignments.health,
        ratio: level > 0 ? (assignments.health / level) * 100 : 0,
      },
      stamina: {
        base: 100, // Base stamina - could come from race data
        assigned: assignments.stamina,
        total: 100 + assignments.stamina,
        ratio: level > 0 ? (assignments.stamina / level) * 100 : 0,
      },
      magicka: {
        base: 100, // Base magicka - could come from race data
        assigned: assignments.magicka,
        total: 100 + assignments.magicka,
        ratio: level > 0 ? (assignments.magicka / level) * 100 : 0,
      },
    }
  }, [assignments])
  
  // Validation helpers
  const canAssignAtLevel = (level: number) => {
    return level > 0 && level <= assignments.level
  }
  
  const getAssignmentAtLevel = (level: number): AttributeType | null => {
    return assignments.assignments[level] || null
  }
  
  const getTotalAssignments = () => {
    return assignments.health + assignments.stamina + assignments.magicka
  }
  
  const getUnassignedLevels = () => {
    const assignedLevels = Object.keys(assignments.assignments).map(Number)
    const unassigned = []
    
    for (let i = 2; i <= assignments.level; i++) { // Start at level 2 (level 1 has no assignment)
      if (!assignedLevels.includes(i)) {
        unassigned.push(i)
      }
    }
    
    return unassigned
  }
  
  return {
    // State
    assignments,
    displayData,
    level: assignments.level,
    
    // Actions
    setAttributeAssignment,
    clearAttributeAssignment,
    clearAllAttributeAssignments,
    updateAttributeLevel,
    
    // Computed
    canAssignAtLevel,
    getAssignmentAtLevel,
    getTotalAssignments,
    getUnassignedLevels,
  }
}
```

### Step 2.2: Create Attribute Summary Display Component

```typescript
// src/features/attributes/components/composition/AttributeSummaryDisplay.tsx
import React from 'react'
import { cn } from '@/lib/utils'
import { H5 } from '@/shared/ui/ui/typography'
import { StatBar } from '@/features/races-v2/components/atomic'
import type { AttributeDisplayData } from '../../types'

interface AttributeSummaryDisplayProps {
  displayData: AttributeDisplayData
  level: number
  className?: string
  showRatios?: boolean
  compact?: boolean
}

export function AttributeSummaryDisplay({
  displayData,
  level,
  className,
  showRatios = true,
  compact = false,
}: AttributeSummaryDisplayProps) {
  if (compact) {
    return (
      <div className={cn('space-y-3', className)}>
        <H5 className="text-lg font-medium text-foreground">Attribute Assignments</H5>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded">
            <div className="text-sm text-muted-foreground">Health</div>
            <div className="font-medium text-lg">{displayData.health.total}</div>
            <div className="text-xs text-muted-foreground">
              +{displayData.health.assigned}
            </div>
          </div>
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded">
            <div className="text-sm text-muted-foreground">Stamina</div>
            <div className="font-medium text-lg">{displayData.stamina.total}</div>
            <div className="text-xs text-muted-foreground">
              +{displayData.stamina.assigned}
            </div>
          </div>
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded">
            <div className="text-sm text-muted-foreground">Magicka</div>
            <div className="font-medium text-lg">{displayData.magicka.total}</div>
            <div className="text-xs text-muted-foreground">
              +{displayData.magicka.assigned}
            </div>
          </div>
        </div>
        
        {showRatios && (
          <div className="text-xs text-muted-foreground text-center">
            Level {level} • {displayData.health.assigned + displayData.stamina.assigned + displayData.magicka.assigned} assignments
          </div>
        )}
      </div>
    )
  }
  
  return (
    <div className={cn('space-y-4', className)}>
      <H5 className="text-lg font-medium text-foreground">Attribute Assignments</H5>
      
      <div className="space-y-3">
        <StatBar 
          value={displayData.health.total} 
          maxValue={200} 
          label="Health" 
          color="red" 
          size="sm"
          showValue={true}
        />
        <StatBar 
          value={displayData.stamina.total} 
          maxValue={200} 
          label="Stamina" 
          color="green" 
          size="sm"
          showValue={true}
        />
        <StatBar 
          value={displayData.magicka.total} 
          maxValue={200} 
          label="Magicka" 
          color="blue" 
          size="sm"
          showValue={true}
        />
      </div>
      
      {showRatios && (
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-medium">Health</div>
            <div className="text-muted-foreground">
              {displayData.health.ratio.toFixed(1)}%
            </div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-medium">Stamina</div>
            <div className="text-muted-foreground">
              {displayData.stamina.ratio.toFixed(1)}%
            </div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-medium">Magicka</div>
            <div className="text-muted-foreground">
              {displayData.magicka.ratio.toFixed(1)}%
            </div>
          </div>
        </div>
      )}
      
      <div className="text-sm text-muted-foreground text-center">
        Level {level} • {displayData.health.assigned + displayData.stamina.assigned + displayData.magicka.assigned} assignments made
      </div>
    </div>
  )
}
```

### Step 2.3: Create Level Assignment Button Component

```typescript
// src/features/attributes/components/atomic/LevelAssignmentButton.tsx
import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/ui/ui/button'
import { Badge } from '@/shared/ui/ui/badge'
import type { AttributeType } from '../../types'

interface LevelAssignmentButtonProps {
  level: number
  currentAssignment: AttributeType | null
  onAssignmentChange: (level: number, attribute: AttributeType) => void
  onClear: (level: number) => void
  disabled?: boolean
  className?: string
}

const attributeColors = {
  health: 'bg-red-500 hover:bg-red-600',
  stamina: 'bg-green-500 hover:bg-green-600',
  magicka: 'bg-blue-500 hover:bg-blue-600',
}

const attributeLabels = {
  health: 'H',
  stamina: 'S',
  magicka: 'M',
}

export function LevelAssignmentButton({
  level,
  currentAssignment,
  onAssignmentChange,
  onClear,
  disabled = false,
  className,
}: LevelAssignmentButtonProps) {
  const handleClick = () => {
    if (currentAssignment) {
      onClear(level)
    } else {
      // Cycle through attributes: health -> stamina -> magicka
      const attributes: AttributeType[] = ['health', 'stamina', 'magicka']
      const nextIndex = (attributes.indexOf(currentAssignment || 'magicka') + 1) % attributes.length
      onAssignmentChange(level, attributes[nextIndex])
    }
  }
  
  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          'h-8 w-8 p-0 text-xs font-bold',
          currentAssignment && attributeColors[currentAssignment],
          currentAssignment && 'text-white border-0'
        )}
      >
        {currentAssignment ? attributeLabels[currentAssignment] : level}
      </Button>
      <span className="text-xs text-muted-foreground">L{level}</span>
    </div>
  )
}
```

### Step 2.4: Create Attribute Assignment Controls Component

```typescript
// src/features/attributes/components/composition/AttributeAssignmentControls.tsx
import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/ui/ui/button'
import { H5 } from '@/shared/ui/ui/typography'
import { RotateCcw, Zap } from 'lucide-react'
import { LevelAssignmentButton } from '../atomic'
import type { AttributeType } from '../../types'

interface AttributeAssignmentControlsProps {
  level: number
  assignments: Record<number, AttributeType>
  onAssignmentChange: (level: number, attribute: AttributeType) => void
  onClearAssignment: (level: number) => void
  onClearAll: () => void
  className?: string
}

export function AttributeAssignmentControls({
  level,
  assignments,
  onAssignmentChange,
  onClearAssignment,
  onClearAll,
  className,
}: AttributeAssignmentControlsProps) {
  const maxDisplayLevels = 20 // Show up to level 20 in the grid
  
  const renderLevelButtons = () => {
    const buttons = []
    
    for (let i = 2; i <= Math.min(level, maxDisplayLevels); i++) {
      buttons.push(
        <LevelAssignmentButton
          key={i}
          level={i}
          currentAssignment={assignments[i] || null}
          onAssignmentChange={onAssignmentChange}
          onClear={onClearAssignment}
        />
      )
    }
    
    return buttons
  }
  
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <H5 className="text-lg font-medium text-foreground">Level Assignments</H5>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-10 gap-2">
        {renderLevelButtons()}
      </div>
      
      {level > maxDisplayLevels && (
        <div className="text-sm text-muted-foreground text-center">
          Showing levels 2-{maxDisplayLevels} of {level}
        </div>
      )}
      
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Health</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Stamina</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Magicka</span>
        </div>
      </div>
    </div>
  )
}
```

## Phase 3: Main Component Integration

### Step 3.1: Create Attribute Assignment Card

```typescript
// src/features/attributes/components/composition/AttributeAssignmentCard.tsx
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Button } from '@/shared/ui/ui/button'
import { ChevronDown, ChevronUp, Settings } from 'lucide-react'
import { AttributeSummaryDisplay } from './AttributeSummaryDisplay'
import { AttributeAssignmentControls } from './AttributeAssignmentControls'
import { useAttributeAssignments } from '../../hooks/useAttributeAssignments'

interface AttributeAssignmentCardProps {
  className?: string
  showControls?: boolean
  showSummary?: boolean
  compact?: boolean
}

export function AttributeAssignmentCard({
  className,
  showControls = true,
  showSummary = true,
  compact = false,
}: AttributeAssignmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const {
    assignments,
    displayData,
    level,
    setAttributeAssignment,
    clearAttributeAssignment,
    clearAllAttributeAssignments,
  } = useAttributeAssignments()
  
  const handleAssignmentChange = (level: number, attribute: 'health' | 'stamina' | 'magicka') => {
    setAttributeAssignment(level, attribute)
  }
  
  const handleClearAssignment = (level: number) => {
    clearAttributeAssignment(level)
  }
  
  const handleClearAll = () => {
    clearAllAttributeAssignments()
  }
  
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Attribute Assignments
          </CardTitle>
          {showControls && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Summary Display */}
        {showSummary && (
          <AttributeSummaryDisplay
            displayData={displayData}
            level={level}
            compact={compact}
          />
        )}
        
        {/* Assignment Controls */}
        {showControls && isExpanded && (
          <AttributeAssignmentControls
            level={level}
            assignments={assignments.assignments}
            onAssignmentChange={handleAssignmentChange}
            onClearAssignment={handleClearAssignment}
            onClearAll={handleClearAll}
          />
        )}
      </CardContent>
    </Card>
  )
}
```

### Step 3.2: Create Feature Index Files

```typescript
// src/features/attributes/index.ts
export { AttributeAssignmentCard } from './components/composition/AttributeAssignmentCard'
export { useAttributeAssignments } from './hooks/useAttributeAssignments'
export type { AttributeType, AttributeAssignments, AttributeDisplayData } from './types'
```

```typescript
// src/features/attributes/components/index.ts
export { AttributeAssignmentCard } from './composition/AttributeAssignmentCard'
export { AttributeSummaryDisplay } from './composition/AttributeSummaryDisplay'
export { AttributeAssignmentControls } from './composition/AttributeAssignmentControls'
export { LevelAssignmentButton } from './atomic/LevelAssignmentButton'
```

```typescript
// src/features/attributes/components/atomic/index.ts
export { LevelAssignmentButton } from './LevelAssignmentButton'
```

```typescript
// src/features/attributes/components/composition/index.ts
export { AttributeAssignmentCard } from './AttributeAssignmentCard'
export { AttributeSummaryDisplay } from './AttributeSummaryDisplay'
export { AttributeAssignmentControls } from './AttributeAssignmentControls'
```

```typescript
// src/features/attributes/hooks/index.ts
export { useAttributeAssignments } from './useAttributeAssignments'
```

## Phase 4: Build Page Integration

### Step 4.1: Update Build Page

```typescript
// src/pages/BuildPage.tsx
import { AttributeAssignmentCard } from '@/features/attributes'
// ... existing imports

export function BuildPage() {
  // ... existing code

  return (
    <BuildPageShell title="Character Builder">
      {/* Build Controls Area */}
      <BuildControls onReset={() => setShowConfirm(true)} build={build} />

      {/* Confirmation Dialog */}
      <BuildResetConfirmDialog
        open={showConfirm}
        onConfirm={() => {
          resetBuild()
          setShowConfirm(false)
        }}
        onCancel={() => setShowConfirm(false)}
      />

      <Tabs defaultValue="build" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="build">Build</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
        </TabsList>
        <TabsContent value="build">
          {/* Basic Information */}
          <BasicInfoCard
            name={build.name}
            notes={build.notes}
            onNameChange={setBuildName}
            onNotesChange={setBuildNotes}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Race Selection and Display */}
            <RaceSelectionCard />
            {/* Birth Sign Selection and Display */}
            <BirthsignSelectionCard />
            {/* Trait Selection and Display */}
            <TraitSelectionCard />
            {/* Religion Selection and Display */}
            <ReligionSelectionCard />
          </div>

          {/* NEW: Attribute Assignment Card */}
          <div className="mb-6">
            <AttributeAssignmentCard />
          </div>

          {/* Skill Selection and Display - Double Wide */}
          <div className="mb-6">
            <BuildPageSkillCard />
          </div>

          {/* Destiny Section */}
          <BuildPageDestinyCard navigate={navigate} />

          {/* Build Summary */}
          <BuildSummaryCard build={build} />
        </TabsContent>
        <TabsContent value="config">
          {/* Trait Limits Configuration */}
          <TraitLimitConfigCard
            regularLimit={traitLimits.regularLimit}
            bonusLimit={traitLimits.bonusLimit}
            onRegularLimitChange={traitLimits.handleRegularLimitChange}
            onBonusLimitChange={traitLimits.handleBonusLimitChange}
            currentRegularCount={traitLimits.currentRegularCount}
            currentBonusCount={traitLimits.currentBonusCount}
          />
        </TabsContent>
      </Tabs>
    </BuildPageShell>
  )
}
```

## Testing Strategy

### Unit Tests

```typescript
// src/features/attributes/hooks/__tests__/useAttributeAssignments.test.tsx
import { renderHook, act } from '@testing-library/react'
import { useAttributeAssignments } from '../useAttributeAssignments'
import { useCharacterStore } from '@/shared/stores/characterStore'

describe('useAttributeAssignments', () => {
  beforeEach(() => {
    useCharacterStore.getState().resetBuild()
  })
  
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAttributeAssignments())
    
    expect(result.current.level).toBe(1)
    expect(result.current.assignments.health).toBe(0)
    expect(result.current.assignments.stamina).toBe(0)
    expect(result.current.assignments.magicka).toBe(0)
  })
  
  it('should set attribute assignment correctly', () => {
    const { result } = renderHook(() => useAttributeAssignments())
    
    act(() => {
      result.current.setAttributeAssignment(2, 'health')
    })
    
    expect(result.current.assignments.health).toBe(1)
    expect(result.current.getAssignmentAtLevel(2)).toBe('health')
  })
  
  it('should clear attribute assignment correctly', () => {
    const { result } = renderHook(() => useAttributeAssignments())
    
    act(() => {
      result.current.setAttributeAssignment(2, 'health')
      result.current.clearAttributeAssignment(2)
    })
    
    expect(result.current.assignments.health).toBe(0)
    expect(result.current.getAssignmentAtLevel(2)).toBeNull()
  })
})
```

## Migration Notes

### Backward Compatibility

1. **Default Values**: Existing builds without attribute assignments will get default values
2. **URL Parameters**: Old URLs will work but won't include attribute data
3. **Export/Import**: Existing build exports won't include attribute data until updated

### Data Migration

```typescript
// Migration utility for existing builds
export function migrateBuildToIncludeAttributes(build: any): BuildState {
  if (!build.attributeAssignments) {
    return {
      ...build,
      attributeAssignments: {
        health: 0,
        stamina: 0,
        magicka: 0,
        level: 1,
        assignments: {},
      },
    }
  }
  return build
}
```

## Next Steps

1. **Implement Phase 1** - Data structure and state management
2. **Build core components** - Start with AttributeSummaryDisplay
3. **Add integration** - Integrate with build page
4. **Add tests** - Unit and integration tests
5. **Polish UI** - Responsive design and accessibility
6. **Add advanced features** - Presets, validation, etc. 