# 🎯 Perks Migration Plan - Consolidate into Skills Feature

## 📋 Overview

This document outlines the plan to migrate and consolidate the standalone **Perks feature** into the **Skills feature**, following the established Model-View-Adapter (MVA) architecture pattern. This consolidation will eliminate code duplication, improve maintainability, and create a unified skills and perks system.

## 🎯 Migration Goals

### Primary Objectives

- ✅ **Consolidate Features**: Merge perks functionality into skills feature
- ✅ **Eliminate Duplication**: Remove duplicate components and utilities
- ✅ **Maintain Functionality**: Preserve all existing perks features
- ✅ **Follow MVA Pattern**: Ensure proper separation of concerns
- ✅ **Improve Maintainability**: Single source of truth for skills/perks logic

### Success Criteria

- [ ] All perks functionality works within skills feature
- [ ] No breaking changes to existing user experience
- [ ] Reduced codebase complexity and size
- [ ] Improved performance through shared components
- [ ] Consistent architecture across features

## 📊 Current State Analysis

### Existing Perks Feature (`src/features/perks/`)

```
src/features/perks/
├── components/
│   ├── PerkTreeCanvas/
│   │   ├── PerkTreeCanvasII.tsx      # Main canvas component
│   │   ├── PerkNode.tsx              # Individual perk node
│   │   ├── perkTreeLayout.ts         # Layout utilities
│   │   ├── perkTreeLayoutUtils.ts    # Layout helper functions
│   │   └── PerkTreeLayoutTypes.ts    # Layout type definitions
│   └── index.ts
├── hooks/
│   └── usePerks.ts                   # Perk data loading
├── pages/
│   └── UnifiedPerksPage.tsx          # Main perks page
├── types.ts                          # Perk type definitions
└── utils.ts                          # Data utilities
```

### Current Skills Feature (`src/features/skills/`)

```
src/features/skills/
├── adapters/                         # MVA adapters
├── components/
│   ├── view/
│   │   ├── SkillPerkTreeDrawer.tsx   # Already uses perks components
│   │   └── SkillsPageView.tsx
│   └── index.ts
├── model/                            # MVA models
├── pages/
│   └── SkillsPage.tsx
└── types.ts
```

## 🏗️ Migration Architecture

### Target Structure (Post-Migration)

```
src/features/skills/
├── adapters/
│   ├── useSkillData.ts               # Skills data loading
│   ├── useSkillState.ts              # Skills state management
│   ├── useSkillFilters.ts            # Skills filtering
│   ├── useSkillComputed.ts           # Skills computed values
│   ├── usePerkData.ts                # Perks data loading (moved)
│   └── index.ts
├── components/
│   ├── view/
│   │   ├── SkillsPageView.tsx        # Main skills view
│   │   ├── SkillPerkTreeDrawer.tsx   # Perk tree drawer
│   │   ├── PerkTreeCanvasII.tsx      # Moved from perks
│   │   ├── PerkNode.tsx              # Moved from perks
│   │   └── index.ts
│   └── index.ts
├── model/
│   ├── skillState.ts                 # Skills business logic
│   ├── perkState.ts                  # Perks business logic (moved)
│   ├── skillLogic.ts                 # Skills validation
│   ├── skillData.ts                  # Skills data fetching
│   └── types.ts                      # Consolidated types
├── utils/
│   ├── perkTreeLayout.ts             # Moved from perks
│   ├── perkTreeLayoutUtils.ts        # Moved from perks
│   ├── PerkTreeLayoutTypes.ts        # Moved from perks
│   └── perkData.ts                   # Moved from perks
├── pages/
│   └── SkillsPage.tsx                # Main entry point
└── index.ts
```

## 📅 Migration Phases

### Phase 1: Move Perk Components (Day 1)

**Duration**: 1 day  
**Priority**: Critical

#### 1.1 Move PerkTreeCanvas Components

```bash
# Move the entire PerkTreeCanvas directory
mv src/features/perks/components/PerkTreeCanvas/* src/features/skills/components/view/
```

#### 1.2 Move PerkNode Component

```bash
# Move PerkNode to skills view components
mv src/features/perks/components/PerkNode.tsx src/features/skills/components/view/
```

#### 1.3 Update Component Imports

- Update `SkillPerkTreeDrawer.tsx` to import from new location
- Update any other files importing from perks
- Update component exports in `src/features/skills/components/view/index.ts`

### Phase 2: Consolidate Types (Day 1)

**Duration**: 1 day  
**Priority**: Critical

#### 2.1 Merge Perk Types into Skills Types

**File**: `src/features/skills/types.ts`

```typescript
// Existing skill types
export interface UnifiedSkill {
  id: string
  name: string
  category: string
  description: string
  keyAbilities: string[]
  metaTags: string[]
  assignmentType: 'major' | 'minor' | 'none'
  canAssignMajor: boolean
  canAssignMinor: boolean
  level: number
  totalPerks: number
  selectedPerksCount: number
  selectedPerks: Array<{ currentRank: number }>
  isSelected: boolean
}

// Add perk types from perks/types.ts
export interface PerkTree {
  treeId: string
  treeName: string
  treeDescription: string
  category: string
  perks: PerkNode[]
}

export interface PerkNode {
  edid: string
  name: string
  description: string
  totalRanks: number
  ranks: PerkRank[]
  connections: Connections
  position: Position
  isRoot: boolean
}

export interface PerkRank {
  rank: number
  description: string
  requirements: string[]
}

export interface Connections {
  parents: string[]
  children: string[]
}

export interface Position {
  x: number
  y: number
}

// Add any other perk-related types
```

### Phase 3: Move Utilities (Day 1)

**Duration**: 1 day  
**Priority**: High

#### 3.1 Move Layout Utilities

```bash
# Move layout utilities to skills utils
mv src/features/perks/components/PerkTreeCanvas/perkTreeLayout.ts src/features/skills/utils/
mv src/features/perks/components/PerkTreeCanvas/perkTreeLayoutUtils.ts src/features/skills/utils/
mv src/features/perks/components/PerkTreeCanvas/PerkTreeLayoutTypes.ts src/features/skills/utils/
```

#### 3.2 Move Data Utilities

```bash
# Move data loading utilities
mv src/features/perks/utils.ts src/features/skills/utils/perkData.ts
```

#### 3.3 Update Utility Imports

- Update all imports in moved components
- Update utility exports in `src/features/skills/utils/index.ts`

### Phase 4: Update Skills Adapters (Day 2)

**Duration**: 1 day  
**Priority**: High

#### 4.1 Enhance usePerkData Adapter

**File**: `src/features/skills/adapters/usePerkData.ts`

```typescript
// Update to use consolidated types and utilities
import type { PerkTree, PerkNode } from '../types'
import { validatePerkTreeSafe } from '../utils/perkData'

// ... rest of the adapter stays the same
```

#### 4.2 Update Skills Adapter Exports

**File**: `src/features/skills/adapters/index.ts`

```typescript
// Export all adapters including perk-related ones
export { useSkillData } from './useSkillData'
export { useSkillState } from './useSkillState'
export { useSkillFilters } from './useSkillFilters'
export { useSkillComputed } from './useSkillComputed'
export { usePerkData } from './usePerkData'

// Export consolidated types
export type {
  Skill,
  UnifiedSkill,
  PerkTree,
  PerkNode,
  PerkRank,
  Connections,
  Position,
} from '../types'
```

### Phase 5: Update Skills Components (Day 2)

**Duration**: 1 day  
**Priority**: High

#### 5.1 Update SkillPerkTreeDrawer

**File**: `src/features/skills/components/view/SkillPerkTreeDrawer.tsx`

```typescript
// Update imports to use new locations
import { PerkTreeCanvasII } from './PerkTreeCanvasII'
import type { PerkTree } from '../../types'
```

#### 5.2 Update Skills Component Exports

**File**: `src/features/skills/components/view/index.ts`

```typescript
// Export all view components including perk-related ones
export { SkillsPageView } from './SkillsPageView'
export { SkillPerkTreeDrawer } from './SkillPerkTreeDrawer'
export { PerkTreeCanvasII } from './PerkTreeCanvasII'
export { PerkNode } from './PerkNode'
```

### Phase 6: Update Router and Remove Perks (Day 3)

**Duration**: 1 day  
**Priority**: Medium

#### 6.1 Update Router

**File**: `src/app/router.tsx`

```typescript
// Remove perks routes, keep only skills route
// The /perks route should redirect to /skills or be removed
```

#### 6.2 Remove Perks Directory

```bash
# Remove the entire perks feature
rm -rf src/features/perks/
```

#### 6.3 Update Any Remaining Imports

- Search for any remaining imports from `@/features/perks`
- Update them to use `@/features/skills`

### Phase 7: Update Skills Feature Exports (Day 3)

**Duration**: 1 day  
**Priority**: Medium

#### 7.1 Update Main Skills Index

**File**: `src/features/skills/index.ts`

```typescript
// Export everything from consolidated feature
export { SkillsPage } from './pages/SkillsPage'
export * from './components'
export * from './adapters'
export * from './types'
export * from './utils'
```

## 📋 Migration Checklist

### Day 1: Move Components and Types

- [ ] Move `PerkTreeCanvas/` directory to skills
- [ ] Move `PerkNode.tsx` to skills
- [ ] Merge perk types into skills types
- [ ] Move layout utilities to skills utils
- [ ] Move data utilities to skills utils
- [ ] Update all component imports
- [ ] Update component exports

### Day 2: Update Adapters and Components

- [ ] Update `usePerkData` to use consolidated types
- [ ] Update `SkillPerkTreeDrawer` imports
- [ ] Update component exports
- [ ] Update adapter exports
- [ ] Test perk tree functionality

### Day 3: Cleanup and Remove Perks

- [ ] Update router to remove perks routes
- [ ] Remove `src/features/perks/` directory
- [ ] Update any remaining imports
- [ ] Update main skills exports
- [ ] Test everything works
- [ ] Update documentation

## 🔧 Technical Implementation Details

### Import Path Updates

#### Before Migration

```typescript
// Old import paths
import { PerkTreeCanvasII } from '@/features/perks/components/PerkTreeCanvas/PerkTreeCanvasII'
import { PerkNode } from '@/features/perks/components/PerkNode'
import type { PerkTree } from '@/features/perks/types'
import { perkTreeLayout } from '@/features/perks/components/PerkTreeCanvas/perkTreeLayout'
```

#### After Migration

```typescript
// New import paths
import { PerkTreeCanvasII } from '@/features/skills/components/view/PerkTreeCanvasII'
import { PerkNode } from '@/features/skills/components/view/PerkNode'
import type { PerkTree } from '@/features/skills/types'
import { perkTreeLayout } from '@/features/skills/utils/perkTreeLayout'
```

### Type Consolidation Strategy

#### Skills Types (Existing)

```typescript
export interface UnifiedSkill {
  id: string
  name: string
  category: string
  description: string
  keyAbilities: string[]
  metaTags: string[]
  assignmentType: 'major' | 'minor' | 'none'
  canAssignMajor: boolean
  canAssignMinor: boolean
  level: number
  totalPerks: number
  selectedPerksCount: number
  selectedPerks: Array<{ currentRank: number }>
  isSelected: boolean
}
```

#### Perks Types (To Add)

```typescript
export interface PerkTree {
  treeId: string
  treeName: string
  treeDescription: string
  category: string
  perks: PerkNode[]
}

export interface PerkNode {
  edid: string
  name: string
  description: string
  totalRanks: number
  ranks: PerkRank[]
  connections: Connections
  position: Position
  isRoot: boolean
}

// ... additional perk types
```

## 🧪 Testing Strategy

### Unit Tests

- [ ] Test all moved components in isolation
- [ ] Test consolidated types
- [ ] Test utility functions
- [ ] Test adapter hooks

### Integration Tests

- [ ] Test perk tree drawer functionality
- [ ] Test skills page with perk integration
- [ ] Test data loading and transformation
- [ ] Test component interactions

### End-to-End Tests

- [ ] Test complete skills → perks workflow
- [ ] Test perk selection and persistence
- [ ] Test build state integration
- [ ] Test URL state management

## 🚨 Risk Mitigation

### High Risk Items

1. **Breaking Changes**: Ensure all existing functionality is preserved
2. **Import Paths**: Update all references to moved components
3. **Type Conflicts**: Resolve any type naming conflicts
4. **Build Errors**: Ensure no TypeScript compilation errors

### Mitigation Strategies

1. **Incremental Migration**: Move one component at a time
2. **Comprehensive Testing**: Test each change thoroughly
3. **Rollback Plan**: Keep original components until migration is complete
4. **Documentation**: Update all relevant documentation

## 📚 Documentation Updates

### Required Updates

- [ ] **Feature Documentation**: Update `skills-feature-doc.md` with consolidated capabilities
- [ ] **API Documentation**: Document new consolidated types and interfaces
- [ ] **Component Documentation**: Update component props and interfaces
- [ ] **Migration Guide**: Create guide for the consolidation process

### Files to Update

- `docs/skills-feature-documentation.md`
- `src/features/skills/README.md`
- `docs/MVA-REALIGNMENT-PLAN.md`
- Any other relevant documentation

## 🎯 Success Criteria

### Functional Requirements

- [ ] All perks functionality works within skills feature
- [ ] Perk tree drawer opens and functions correctly
- [ ] Perk selection and persistence works
- [ ] Skills assignment and perk integration works
- [ ] No breaking changes to existing user experience

### Technical Requirements

- [ ] No TypeScript compilation errors
- [ ] All imports resolve correctly
- [ ] No console errors or warnings
- [ ] Performance remains acceptable
- [ ] Bundle size is reduced

### Quality Requirements

- [ ] All tests pass
- [ ] Code follows established patterns
- [ ] Documentation is updated
- [ ] No dead code remains

## 🚀 Post-Migration Benefits

### Immediate Benefits

- ✅ **Reduced Complexity**: Single feature for skills and perks
- ✅ **Eliminated Duplication**: No duplicate components or utilities
- ✅ **Improved Maintainability**: Single source of truth
- ✅ **Better Architecture**: Consistent MVA pattern

### Long-term Benefits

- ✅ **Easier Feature Development**: Unified codebase
- ✅ **Better Performance**: Shared components and utilities
- ✅ **Simplified Testing**: Single feature to test
- ✅ **Clearer Documentation**: Consolidated feature docs

## 📝 Notes

### Key Decisions Made

- **Consolidation Strategy**: Move perks into skills rather than create new unified feature
- **Type Strategy**: Merge perk types into skills types file
- **Component Strategy**: Move perk components to skills view directory
- **Utility Strategy**: Move perk utilities to skills utils directory

### Dependencies

- **Existing**: Skills MVA architecture must be stable
- **Existing**: Perk tree functionality must be working
- **New**: Consolidated types and interfaces
- **New**: Updated import paths throughout codebase

### Timeline

- **Total Duration**: 3 days
- **Risk Level**: Medium (due to import path changes)
- **Complexity**: Medium (well-defined scope)

---

**Status**: 🟡 Planning Complete - Ready for Implementation  
**Next Step**: Begin Phase 1 - Move Perk Components  
**Estimated Completion**: 3 days
