# Phase 1 Task 03: Calculation Engine

## 📋 Task Overview

Create the core calculation engine that transforms base attributes into derived stats. This engine will handle the mathematical formulas and provide the foundation for all derived stats calculations.

## 🎯 Objectives

- [ ] Implement base attributes calculation from race and level
- [ ] Implement single derived stat calculation
- [ ] Implement all derived stats calculation
- [ ] Add proper error handling and validation
- [ ] Create comprehensive calculation service

## 📁 Files to Create

### 1. Calculation Engine

**Path:** `src/features/derived-stats/model/DerivedStatsCalculator.ts`

**Content:**

```typescript
import {
  BaseAttributes,
  DerivedStat,
  DerivedStatConfig,
  DataSources,
} from '../types'
import { BuildState } from '@/shared/types/build'

export class DerivedStatsCalculator {
  /**
   * Calculate base attributes from core sources (Phase 1)
   * Uses race starting stats + attribute assignments
   */
  static calculateBaseAttributes(
    build: BuildState,
    dataSources: DataSources
  ): BaseAttributes {
    const base = { health: 100, stamina: 100, magicka: 100 }

    // Add race starting stats
    if (build.race && dataSources.races) {
      const race = dataSources.races.find((r: any) => r.edid === build.race)
      if (race?.startingStats) {
        base.health += race.startingStats.health || 0
        base.stamina += race.startingStats.stamina || 0
        base.magicka += race.startingStats.magicka || 0
      }
    }

    // Add attribute assignments (5 points per level)
    base.health += build.attributeAssignments.health || 0
    base.stamina += build.attributeAssignments.stamina || 0
    base.magicka += build.attributeAssignments.magicka || 0

    return base
  }

  /**
   * Calculate a single derived stat using the formula:
   * value = prefactor * sqrt(weightedSum - threshold) if weightedSum > threshold
   * value = 0 otherwise
   */
  static calculateDerivedStat(
    baseAttributes: BaseAttributes,
    config: DerivedStatConfig
  ): number {
    const weightedSum =
      baseAttributes.health * config.weights.health +
      baseAttributes.magicka * config.weights.magicka +
      baseAttributes.stamina * config.weights.stamina

    if (weightedSum > config.threshold) {
      const bonus = config.prefactor * Math.sqrt(weightedSum - config.threshold)
      return Math.floor(bonus)
    }

    return 0
  }

  /**
   * Calculate all derived stats from base attributes
   */
  static calculateAllDerivedStats(
    baseAttributes: BaseAttributes,
    config: Record<string, DerivedStatConfig>
  ): DerivedStat[] {
    return Object.entries(config).map(([key, statConfig]) => ({
      name: statConfig.name,
      value: this.calculateDerivedStat(baseAttributes, statConfig),
      isPercentage: statConfig.isPercentage,
      formula: `${statConfig.prefactor} * sqrt(weightedSum - ${statConfig.threshold})`,
      description: statConfig.description,
      category: statConfig.category,
    }))
  }

  /**
   * Validate base attributes are within reasonable bounds
   */
  static validateBaseAttributes(attributes: BaseAttributes): boolean {
    return (
      attributes.health >= 0 &&
      attributes.stamina >= 0 &&
      attributes.magicka >= 0 &&
      attributes.health <= 1000 &&
      attributes.stamina <= 1000 &&
      attributes.magicka <= 1000
    )
  }

  /**
   * Get calculation breakdown for debugging
   */
  static getCalculationBreakdown(
    baseAttributes: BaseAttributes,
    config: DerivedStatConfig
  ): {
    weightedSum: number
    threshold: number
    difference: number
    prefactor: number
    result: number
  } {
    const weightedSum =
      baseAttributes.health * config.weights.health +
      baseAttributes.magicka * config.weights.magicka +
      baseAttributes.stamina * config.weights.stamina

    const difference = weightedSum - config.threshold
    const result =
      difference > 0 ? Math.floor(config.prefactor * Math.sqrt(difference)) : 0

    return {
      weightedSum,
      threshold: config.threshold,
      difference,
      prefactor: config.prefactor,
      result,
    }
  }
}
```

### 2. Model Index File

**Path:** `src/features/derived-stats/model/index.ts`

**Content:**

```typescript
export { DerivedStatsCalculator } from './DerivedStatsCalculator'
```

## ✅ Acceptance Criteria

- [ ] Base attributes calculation works correctly
- [ ] Single derived stat calculation uses correct formula
- [ ] All derived stats calculation processes all configs
- [ ] Error handling for invalid inputs
- [ ] Validation functions work correctly
- [ ] Debug breakdown function provides useful information
- [ ] No TypeScript compilation errors
- [ ] Calculations are mathematically accurate

## 🔧 Implementation Steps

1. Create the `src/features/derived-stats/model/` directory
2. Create `DerivedStatsCalculator.ts` with all calculation methods
3. Create `index.ts` for exports
4. Test calculations with sample data
5. Verify mathematical accuracy
6. Add error handling and validation

## 🧮 Calculation Formula

The core formula for derived stats is:

```
value = prefactor * sqrt(weightedSum - threshold)
```

Where:

- `weightedSum = health * healthWeight + magicka * magickaWeight + stamina * staminaWeight`
- If `weightedSum <= threshold`, then `value = 0`
- `prefactor` scales the final result
- `threshold` sets the minimum required weighted sum

## 📊 Example Calculations

### Example 1: Magic Resist

- Base: Health=120, Magicka=180, Stamina=100
- Config: weights={health:0, magicka:1, stamina:0}, threshold=150, prefactor=1.0
- WeightedSum = 120*0 + 180*1 + 100\*0 = 180
- Difference = 180 - 150 = 30
- Result = 1.0 \* sqrt(30) = 5.48 → 5%

### Example 2: Carry Weight

- Base: Health=150, Magicka=100, Stamina=120
- Config: weights={health:0.8, magicka:0, stamina:0.2}, threshold=110, prefactor=4.0
- WeightedSum = 150*0.8 + 100*0 + 120\*0.2 = 120 + 24 = 144
- Difference = 144 - 110 = 34
- Result = 4.0 \* sqrt(34) = 23.32 → 23 points

## 📝 Notes

- Use `Math.floor()` to ensure integer results
- Validate inputs to prevent calculation errors
- Keep calculations simple for Phase 1
- Add debug functions for troubleshooting
- Ensure all edge cases are handled

## ⏱️ Estimated Time

**1 hour**

## 🔗 Dependencies

- [Phase 1 Task 01: Core Types and Interfaces](./phase1-task-01-types-and-interfaces.md)
- [Phase 1 Task 02: Derived Stats Configuration](./phase1-task-02-configuration.md)

## 🚀 Next Task

[Phase 1 Task 04: React Calculation Hook](./phase1-task-04-calculation-hook.md)

