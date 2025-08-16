# Phase 1 Task 01: Core Types and Interfaces

## 📋 Task Overview

Create the foundational TypeScript types and interfaces for the derived stats system. This establishes the data structures that will be used throughout the entire derived stats feature.

## 🎯 Objectives

- [ ] Define base attributes interface
- [ ] Define derived stat interface
- [ ] Define configuration interface
- [ ] Define calculation result interface
- [ ] Export all types from index file

## 📁 Files to Create

### 1. Core Types File

**Path:** `src/features/derived-stats/types/index.ts`

**Content:**

```typescript
export interface BaseAttributes {
  health: number
  stamina: number
  magicka: number
}

export interface DerivedStat {
  name: string
  value: number
  isPercentage: boolean
  formula: string
  description: string
  category: 'combat' | 'survival' | 'movement' | 'magic'
}

export interface DerivedStatConfig {
  name: string
  isPercentage: boolean
  prefactor: number
  threshold: number
  weights: {
    health: number
    magicka: number
    stamina: number
  }
  description: string
  category: 'combat' | 'survival' | 'movement' | 'magic'
}

export interface DerivedStatsCalculation {
  baseAttributes: BaseAttributes
  derivedStats: DerivedStat[]
  sources: {
    race: string
    birthsign: string
    traits: string[]
    equipment: string[]
    religion: string
    destinyPath: string[]
    attributeAssignments: number
  }
}

export interface DataSources {
  races?: any[] // Will be properly typed when we add race data
}
```

## ✅ Acceptance Criteria

- [ ] All interfaces are properly defined with correct types
- [ ] Categories are restricted to valid values
- [ ] All numeric fields use appropriate number types
- [ ] Types are exported from index file
- [ ] No TypeScript compilation errors
- [ ] Types follow project naming conventions

## 🔧 Implementation Steps

1. Create the `src/features/derived-stats/types/` directory
2. Create `index.ts` with all type definitions
3. Verify types compile correctly
4. Test type exports work as expected

## 📝 Notes

- Keep types simple for Phase 1 - we can extend them in Phase 2
- Focus on the core data structures needed for basic calculations
- Ensure types are compatible with existing build state structure
- Use strict typing to prevent runtime errors

## ⏱️ Estimated Time

**30 minutes**

## 🔗 Dependencies

- None (foundational task)

## 🚀 Next Task

[Phase 1 Task 02: Derived Stats Configuration](../phase1-task-02-configuration.md)

