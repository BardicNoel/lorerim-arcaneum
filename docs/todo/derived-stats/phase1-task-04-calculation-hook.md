# Phase 1 Task 04: React Calculation Hook

## 📋 Task Overview

Create a React hook that connects the calculation engine to the UI components. This hook will handle data fetching, memoization, and provide real-time updates when the character build changes.

## 🎯 Objectives

- [ ] Create hook for derived stats calculations
- [ ] Integrate with existing character build state
- [ ] Fetch race data from stores
- [ ] Implement memoization for performance
- [ ] Provide real-time updates on build changes

## 📁 Files to Create

### 1. Calculation Hook

**Path:** `src/features/derived-stats/adapters/useDerivedStatsCalculation.ts`

**Content:**

```typescript
import { useMemo } from 'react'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { useRacesStore } from '@/shared/stores/racesStore'
import { DerivedStatsCalculator } from '../model/DerivedStatsCalculator'
import { DERIVED_STATS_CONFIG } from '../config/derivedStatsConfig'
import { DerivedStatsCalculation, DataSources } from '../types'

export function useDerivedStatsCalculation(): DerivedStatsCalculation {
  const { build } = useCharacterBuild()
  const { data: races } = useRacesStore()

  const calculation = useMemo(() => {
    const dataSources: DataSources = {
      races,
    }

    const baseAttributes = DerivedStatsCalculator.calculateBaseAttributes(
      build,
      dataSources
    )

    const derivedStats = DerivedStatsCalculator.calculateAllDerivedStats(
      baseAttributes,
      DERIVED_STATS_CONFIG
    )

    return {
      baseAttributes,
      derivedStats,
      sources: {
        race: build.race || 'None',
        birthsign: build.stone || 'None',
        traits: [
          ...(build.traits?.regular || []),
          ...(build.traits?.bonus || []),
        ],
        equipment: build.equipment || [],
        religion: build.religion || 'None',
        destinyPath: build.destinyPath || [],
        attributeAssignments: build.attributeAssignments?.level || 0,
      },
    }
  }, [build, races])

  return calculation
}
```

### 2. Adapters Index File

**Path:** `src/features/derived-stats/adapters/index.ts`

**Content:**

```typescript
export { useDerivedStatsCalculation } from './useDerivedStatsCalculation'
```

## ✅ Acceptance Criteria

- [ ] Hook returns correct calculation results
- [ ] Real-time updates when build changes
- [ ] Proper memoization prevents unnecessary recalculations
- [ ] Integration with existing character build state
- [ ] Race data is fetched correctly
- [ ] Sources tracking works properly
- [ ] No TypeScript compilation errors
- [ ] Performance is optimized with useMemo

## 🔧 Implementation Steps

1. Create the `src/features/derived-stats/adapters/` directory
2. Create `useDerivedStatsCalculation.ts` with the hook
3. Create `index.ts` for exports
4. Test hook with different build states
5. Verify memoization works correctly
6. Test integration with existing stores

## 🔗 Dependencies

The hook depends on these existing stores and hooks:

- `useCharacterBuild()` - Provides current build state
- `useRacesStore()` - Provides race data
- `DerivedStatsCalculator` - Calculation engine
- `DERIVED_STATS_CONFIG` - Stat configurations

## 📊 Hook Behavior

### Input Dependencies

- `build` - Character build state (race, attribute assignments, etc.)
- `races` - Race data from store

### Output

- `baseAttributes` - Calculated health, stamina, magicka
- `derivedStats` - Array of all 11 derived stats
- `sources` - Tracking of data sources used

### Memoization

The hook uses `useMemo` to prevent unnecessary recalculations when:

- Build state changes (race, attributes, etc.)
- Race data changes
- Other dependencies remain the same

## 📝 Notes

- Use optional chaining (`?.`) for safe property access
- Provide fallback values for missing data
- Track all sources for debugging and future features
- Keep the hook simple for Phase 1
- Ensure proper TypeScript typing throughout

## ⏱️ Estimated Time

**45 minutes**

## 🔗 Dependencies

- [Phase 1 Task 01: Core Types and Interfaces](./phase1-task-01-types-and-interfaces.md)
- [Phase 1 Task 02: Derived Stats Configuration](./phase1-task-02-configuration.md)
- [Phase 1 Task 03: Calculation Engine](./phase1-task-03-calculation-engine.md)

## 🚀 Next Task

[Phase 1 Task 05: Base Attributes Display Component](./phase1-task-05-base-attributes-display.md)

