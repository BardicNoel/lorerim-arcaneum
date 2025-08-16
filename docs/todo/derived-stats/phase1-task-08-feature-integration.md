# Phase 1 Task 08: Feature Integration

## 📋 Task Overview

Integrate the derived stats feature into the existing build page by adding the main derived stats card to the build cards array and updating the feature exports. This completes the Phase 1 implementation.

## 🎯 Objectives

- [ ] Add derived stats card to build page
- [ ] Update feature exports
- [ ] Test integration with existing build system
- [ ] Verify real-time updates work
- [ ] Ensure no breaking changes

## 📁 Files to Modify

### 1. Feature Index File

**Path:** `src/features/derived-stats/index.ts`

**Content:**

```typescript
// Main component export
export { DerivedStatsCard } from './views/DerivedStatsCard'

// Hook export
export { useDerivedStatsCalculation } from './adapters/useDerivedStatsCalculation'

// Type exports
export type {
  DerivedStat,
  BaseAttributes,
  DerivedStatsCalculation,
} from './types'

// Model exports
export { DerivedStatsCalculator } from './model/DerivedStatsCalculator'

// Configuration exports
export { DERIVED_STATS_CONFIG } from './config/derivedStatsConfig'
```

### 2. Build Page Integration

**Path:** `src/pages/BuildPage.tsx`

**Modifications:**

```typescript
// Add to imports
import { DerivedStatsCard } from '@/features/derived-stats'

// Add to buildCards array (after attributes card)
const buildCards = [
  // ... existing cards
  {
    id: 'attributes',
    component: <AttributeAssignmentCard />,
    size: 'full',
  },
  {
    id: 'derived-stats',
    component: <DerivedStatsCard />,
    size: 'full',
  },
  // ... rest of cards
]
```

## ✅ Acceptance Criteria

- [ ] Derived stats card appears on build page
- [ ] Card updates in real-time when build changes
- [ ] No TypeScript compilation errors
- [ ] No breaking changes to existing functionality
- [ ] Feature exports work correctly
- [ ] Integration is seamless with existing UI

## 🔧 Implementation Steps

1. Create `src/features/derived-stats/index.ts` with all exports
2. Update `src/pages/BuildPage.tsx` to import and add the card
3. Test the integration with different build states
4. Verify real-time updates work correctly
5. Test that existing functionality is not broken
6. Verify all exports work as expected

## 📍 Integration Points

### Build Page Location

The derived stats card should be placed after the attributes card in the build flow:

1. Race Selection
2. Birthsign Selection
3. **Attribute Assignment** ← Place after this
4. **Derived Stats** ← New card here
5. Traits Selection
6. Equipment Selection
7. Religion Selection
8. Destiny Path Selection

### Card Configuration

```typescript
{
  id: 'derived-stats',
  component: <DerivedStatsCard />,
  size: 'full', // Full width like attributes card
}
```

## 🔗 Dependencies

The integration depends on:

- All previous Phase 1 tasks completed
- Existing build page structure
- Build state management
- Race data stores

## 📝 Notes

- Place card logically in the build flow
- Use full width to match attributes card
- Ensure proper import paths
- Test with various build states
- Verify no performance issues
- Check accessibility compliance

## ⏱️ Estimated Time

**30 minutes**

## 🔗 Dependencies

- [Phase 1 Task 01: Core Types and Interfaces](./phase1-task-01-types-and-interfaces.md)
- [Phase 1 Task 02: Derived Stats Configuration](./phase1-task-02-configuration.md)
- [Phase 1 Task 03: Calculation Engine](./phase1-task-03-calculation-engine.md)
- [Phase 1 Task 04: React Calculation Hook](./phase1-task-04-calculation-hook.md)
- [Phase 1 Task 05: Base Attributes Display Component](./phase1-task-05-base-attributes-display.md)
- [Phase 1 Task 06: Derived Stats Table Component](./phase1-task-06-derived-stats-table.md)
- [Phase 1 Task 07: Main Derived Stats Card](./phase1-task-07-main-card.md)

## 🎉 Phase 1 Complete

This completes Phase 1 of the derived stats implementation. The feature now provides:

- ✅ 11 derived stats calculations
- ✅ Real-time updates
- ✅ Clean UI integration
- ✅ Performance optimization
- ✅ Type safety
- ✅ Accessibility compliance

## 🚀 Next Phase

Phase 2 will add additional data sources (birthsigns, traits, religion, destiny) and advanced calculation features.

