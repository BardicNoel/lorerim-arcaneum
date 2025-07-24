# Skills Feature MVA Migration Plan (Including Perks)

## 📋 Overview

This document outlines the migration plan for the skills feature to a clean Model-View-Adapter (MVA) architecture. Since perks are a subset of skills (as evidenced by `/build/perks` route rendering `UnifiedSkillsPage`), we will consolidate everything into the skills feature and remove the separate perks feature.

---

## 🔍 Current State Analysis

### Current Architecture Issues

1. **Separate Features**: Perks and skills are incorrectly separated into different features
2. **Fat Components**: `UnifiedSkillsPage.tsx` and `UnifiedPerksPage.tsx` mix state management, data fetching, and UI rendering
3. **Mixed Responsibilities**: `PerkNode.tsx` contains both UI logic and business logic (rank cycling, selection state)
4. **Complex State Management**: `usePerks.ts` contains multiple hooks with intertwined responsibilities
5. **UI Logic in Business Layer**: Layout calculations and visual state management mixed with data logic
6. **Redundant Components**: Both features have similar tree visualization components

### Current File Structure
```
src/features/perks/                    # ❌ Should be removed
├── components/
│   ├── PerkNode.tsx                    # ❌ Mixed UI + business logic
│   └── PerkTreeCanvas/
│       ├── PerkTreeCanvas.tsx          # ❌ Complex UI + state management
│       ├── PerkTreeCanvasII.tsx        # ❌ UI + layout logic (too granular)
│       ├── perkTreeLayout.ts           # ✅ Pure layout logic (good)
│       ├── perkTreeLayoutUtils.ts      # ✅ Pure utilities (good)
│       └── PerkTreeLayoutTypes.ts      # ✅ Types (good)
├── hooks/
│   └── usePerks.ts                     # ❌ Multiple hooks, mixed concerns
├── pages/
│   └── UnifiedPerksPage.tsx            # ❌ Fat component (legacy)
├── types.ts                            # ✅ Good separation
└── utils.ts                            # ✅ Good separation

src/features/skills/                    # ✅ Main feature
├── components/
│   ├── PerkTreeView.tsx                # ❌ Uses perks components directly
│   ├── SkillCard.tsx                   # ❌ Mixed concerns
│   └── ... (other skills components)
├── hooks/
│   └── useUnifiedSkills.ts             # ❌ Imports perks hooks directly
└── pages/
    └── UnifiedSkillsPage.tsx           # ❌ Fat component with perks integration
```

---

## 🎯 Target MVA Architecture

### New File Structure
```
src/features/skills/                    # ✅ Consolidated skills feature
├── components/
│   └── view/                           # 🆕 Pure view components
│       ├── SkillCardView.tsx           # 🆕 Pure UI component
│       ├── SkillsGridView.tsx          # 🆕 Pure grid layout
│       ├── PerkNodeView.tsx            # 🆕 Pure perk node UI
│       ├── PerkTreeView.tsx            # 🆕 Includes canvas functionality
│       ├── SkillsPageView.tsx          # 🆕 Main page layout
│       └── PerkTreeDrawerView.tsx      # 🆕 Drawer wrapper for tree
├── adapters/                           # 🆕 Adapter layer
│   ├── useSkillCardAdapter.ts
│   ├── useSkillsGridAdapter.ts
│   ├── usePerkNodeAdapter.ts
│   ├── usePerkTreeAdapter.ts
│   ├── useSkillsPageAdapter.ts
│   └── index.ts
├── models/                             # 🆕 Model layer
│   ├── types.ts                        # Combined skills + perks types
│   ├── skillState.ts                   # 🆕 Skills state management
│   ├── perkState.ts                    # 🆕 Perks state management
│   ├── skillData.ts                    # 🆕 Skills data fetching
│   ├── perkData.ts                     # 🆕 Perks data fetching
│   └── skillLogic.ts                   # 🆕 Combined business logic
├── utils/                              # 🆕 Utilities
│   ├── layout.ts                       # Move from perks PerkTreeCanvas/
│   ├── layoutUtils.ts                  # Move from perks PerkTreeCanvas/
│   └── index.ts
├── pages/
│   └── UnifiedSkillsPage.tsx           # ✅ Simplified entry point
└── index.ts

src/features/perks/                     # ❌ Remove entire directory
```

---

## 🔧 Migration Steps

### Phase 1: Consolidate Models (Day 1)

#### 1.1 Create Model Layer in Skills
```bash
mkdir src/features/skills/models
mkdir src/features/skills/utils
mkdir src/features/skills/adapters
mkdir src/features/skills/components/view
```

#### 1.2 Move and Consolidate Types
**File**: `src/features/skills/models/types.ts`
```typescript
// Combined skills + perks types
export interface Skill {
  edid: string
  name: string
  description: string
  // ... existing skill properties
}

export interface PerkTree {
  treeId: string
  treeName: string
  treeDescription: string
  perks: Perk[]
}

export interface Perk {
  edid: string
  perkId: string
  name: string
  description: string
  totalRanks: number
  ranks: PerkRank[]
  prerequisites?: Prerequisites
}

// ... other types moved from perks/types.ts
```

#### 1.3 Extract Skills State Management
**File**: `src/features/skills/models/skillState.ts`
```typescript
// Pure skills state management - no UI dependencies
export interface SkillState {
  majorSkills: string[]
  minorSkills: string[]
  selectedSkill: string | null
}

export const createSkillState = (): SkillState => ({
  majorSkills: [],
  minorSkills: [],
  selectedSkill: null,
})
```

#### 1.4 Extract Perks State Management
**File**: `src/features/skills/models/perkState.ts`
```typescript
// Pure perks state management - no UI dependencies
export interface PerkState {
  selectedPerks: Record<string, string[]> // skillId -> perkIds
  perkRanks: Record<string, number>       // perkId -> rank
}

export const createPerkState = (): PerkState => ({
  selectedPerks: {},
  perkRanks: {},
})
```

#### 1.5 Extract Data Layer
**File**: `src/features/skills/models/skillData.ts`
```typescript
// Pure data fetching - no UI dependencies
export async function fetchSkills(): Promise<Skill[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/skills.json`)
  if (!response.ok) {
    throw new Error('Failed to load skills data')
  }
  const data = await response.json()
  return (data.skills || []).sort((a: Skill, b: Skill) =>
    a.name.localeCompare(b.name)
  )
}

export async function fetchPerkTrees(): Promise<PerkTree[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/perk-trees.json`)
  if (!response.ok) {
    throw new Error('Failed to load perk trees data')
  }
  return response.json()
}
```

#### 1.6 Extract Business Logic
**File**: `src/features/skills/models/skillLogic.ts`
```typescript
// Pure business logic - no UI dependencies
export function canAssignSkill(
  skillId: string,
  type: 'major' | 'minor',
  currentState: SkillState
): boolean {
  if (type === 'major') {
    return currentState.majorSkills.length < 5
  }
  return currentState.minorSkills.length < 5
}

export function getAllPrerequisites(
  perkId: string,
  tree: PerkTree,
  visited = new Set<string>()
): string[] {
  // Move logic from perks usePerks.ts
}

export function canSelectPerk(
  perkId: string,
  tree: PerkTree,
  perkState: PerkState
): boolean {
  // Pure validation logic
}
```

### Phase 2: Create Adapters (Day 2)

#### 2.1 Skills Grid Adapter
**File**: `src/features/skills/adapters/useSkillsGridAdapter.ts`
```typescript
// Adapter for skills grid - handles skills assignment and selection
export function useSkillsGridAdapter() {
  const { majorSkills, minorSkills, addMajorSkill, removeMajorSkill, addMinorSkill, removeMinorSkill } = useCharacterBuild()
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  
  const handleSkillAssignment = useCallback((skillId: string, type: 'major' | 'minor' | 'none') => {
    if (type === 'major') {
      addMajorSkill(skillId)
    } else if (type === 'minor') {
      addMinorSkill(skillId)
    } else {
      removeMajorSkill(skillId)
      removeMinorSkill(skillId)
    }
  }, [addMajorSkill, addMinorSkill, removeMajorSkill, removeMinorSkill])
  
  return {
    majorSkills,
    minorSkills,
    selectedSkill,
    setSelectedSkill,
    handleSkillAssignment,
  }
}
```

#### 2.2 Perk Tree Adapter
**File**: `src/features/skills/adapters/usePerkTreeAdapter.ts`
```typescript
// Adapter for perk tree - handles perk selection and ranking
export function usePerkTreeAdapter(selectedSkill: string | null) {
  const { 
    addPerk, 
    removePerk, 
    setPerkRank, 
    clearSkillPerks, 
    getSkillPerks, 
    getPerkRank 
  } = useCharacterBuild()

  const selectedPerks = selectedSkill ? getSkillPerks(selectedSkill) : []

  const handleTogglePerk = useCallback((perkId: string) => {
    if (!selectedSkill) return
    const isSelected = selectedPerks.includes(perkId)
    if (isSelected) {
      removePerk(selectedSkill, perkId)
    } else {
      addPerk(selectedSkill, perkId)
    }
  }, [selectedSkill, selectedPerks, removePerk, addPerk])

  const handleRankChange = useCallback((perkId: string, newRank: number) => {
    setPerkRank(perkId, newRank)
  }, [setPerkRank])

  return {
    selectedPerks,
    handleTogglePerk,
    handleRankChange,
    clearSkillPerks: () => selectedSkill && clearSkillPerks(selectedSkill),
  }
}
```

#### 2.3 Skills Page Adapter
**File**: `src/features/skills/adapters/useSkillsPageAdapter.ts`
```typescript
// Adapter for main skills page - handles data loading and page state
export function useSkillsPageAdapter() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [perkTrees, setPerkTrees] = useState<PerkTree[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [skillsData, perksData] = await Promise.all([
          fetchSkills(),
          fetchPerkTrees()
        ])
        setSkills(skillsData)
        setPerkTrees(perksData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])
  
  return {
    skills,
    perkTrees,
    loading,
    error,
    drawerOpen,
    setDrawerOpen,
  }
}
```

### Phase 3: Extract Views (Day 3)

#### 3.1 Skill Card View
**File**: `src/features/skills/components/view/SkillCardView.tsx`
```typescript
// Pure view component for skill cards
interface SkillCardViewProps {
  skill: Skill
  isMajor: boolean
  isMinor: boolean
  totalPerks: number
  selectedPerks: number
  onAssignmentChange: (type: 'major' | 'minor' | 'none') => void
  onSelect: () => void
}

export function SkillCardView({
  skill,
  isMajor,
  isMinor,
  totalPerks,
  selectedPerks,
  onAssignmentChange,
  onSelect,
}: SkillCardViewProps) {
  // Pure UI rendering - no hooks, no state management
  return (
    <Card onClick={onSelect}>
      <CardHeader>
        <CardTitle>{skill.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{skill.description}</p>
        <div className="flex gap-2 mt-4">
          <Button
            variant={isMajor ? "default" : "outline"}
            onClick={() => onAssignmentChange(isMajor ? 'none' : 'major')}
          >
            Major
          </Button>
          <Button
            variant={isMinor ? "default" : "outline"}
            onClick={() => onAssignmentChange(isMinor ? 'none' : 'minor')}
          >
            Minor
          </Button>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          {selectedPerks}/{totalPerks} perks selected
        </div>
      </CardContent>
    </Card>
  )
}
```

#### 3.2 Perk Node View
**File**: `src/features/skills/components/view/PerkNodeView.tsx`
```typescript
// Pure view component for perk nodes
interface PerkNodeViewProps {
  perk: Perk
  isSelected: boolean
  currentRank: number
  canSelect: boolean
  onToggle: () => void
  onRankChange: (rank: number) => void
}

export function PerkNodeView({
  perk,
  isSelected,
  currentRank,
  canSelect,
  onToggle,
  onRankChange,
}: PerkNodeViewProps) {
  // Pure UI rendering - no hooks, no state management
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          style={getNodeStyle(isSelected, canSelect)}
          onClick={onToggle}
          onMouseDown={e => e.stopPropagation()}
        >
          {/* Pure JSX */}
        </div>
      </HoverCardTrigger>
    </HoverCard>
  )
}
```

#### 3.3 Perk Tree View
**File**: `src/features/skills/components/view/PerkTreeView.tsx`
```typescript
// Pure view component for perk tree visualization
interface PerkTreeViewProps {
  tree: PerkTree
  selectedPerks: string[]
  onPerkToggle: (perkId: string) => void
  onRankChange: (perkId: string, rank: number) => void
  className?: string
}

export function PerkTreeView({
  tree,
  selectedPerks,
  onPerkToggle,
  onRankChange,
  className,
}: PerkTreeViewProps) {
  // Include canvas functionality directly - no separate canvas component
  const nodes = useMemo(() => {
    // Layout logic moved from PerkTreeCanvasII
  }, [tree, selectedPerks])
  
  const edges = useMemo(() => {
    // Edge creation logic
  }, [tree])
  
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={{ perkNode: PerkNodeView }}
      className={className}
      // Pure props, no state management
    />
  )
}
```

#### 3.4 Skills Page View
**File**: `src/features/skills/components/view/SkillsPageView.tsx`
```typescript
// Pure view component for the main page
interface SkillsPageViewProps {
  skills: Skill[]
  perkTrees: PerkTree[]
  selectedSkill: string | null
  selectedPerkTree: PerkTree | undefined
  loading: boolean
  error: string | null
  drawerOpen: boolean
  onSkillSelect: (skillId: string) => void
  onDrawerOpenChange: (open: boolean) => void
  onSkillAssignmentChange: (skillId: string, type: 'major' | 'minor' | 'none') => void
  selectedPerks: string[]
  onPerkToggle: (perkId: string) => void
  onRankChange: (perkId: string, rank: number) => void
}

export function SkillsPageView({
  skills,
  perkTrees,
  selectedSkill,
  selectedPerkTree,
  loading,
  error,
  drawerOpen,
  onSkillSelect,
  onDrawerOpenChange,
  onSkillAssignmentChange,
  selectedPerks,
  onPerkToggle,
  onRankChange,
}: SkillsPageViewProps) {
  if (loading) return <LoadingView />
  if (error) return <ErrorView error={error} />
  
  return (
    <BuildPageShell title="Skills & Perks">
      <SkillsGridView
        skills={skills}
        perkTrees={perkTrees}
        onSkillSelect={onSkillSelect}
        onSkillAssignmentChange={onSkillAssignmentChange}
      />
      
      <Drawer open={drawerOpen} onOpenChange={onDrawerOpenChange}>
        <DrawerContent>
          {selectedPerkTree && (
            <PerkTreeView
              tree={selectedPerkTree}
              selectedPerks={selectedPerks}
              onPerkToggle={onPerkToggle}
              onRankChange={onRankChange}
            />
          )}
        </DrawerContent>
      </Drawer>
    </BuildPageShell>
  )
}
```

### Phase 4: Refactor Entry Point (Day 4)

#### 4.1 Simplified Skills Page
**File**: `src/features/skills/pages/UnifiedSkillsPage.tsx`
```typescript
// Simplified entry point - only adapters and view composition
export function UnifiedSkillsPage() {
  // Use adapters for state management
  const {
    skills,
    perkTrees,
    loading,
    error,
    drawerOpen,
    setDrawerOpen,
  } = useSkillsPageAdapter()
  
  const {
    majorSkills,
    minorSkills,
    selectedSkill,
    setSelectedSkill,
    handleSkillAssignment,
  } = useSkillsGridAdapter()
  
  const {
    selectedPerks,
    handleTogglePerk,
    handleRankChange,
    clearSkillPerks,
  } = usePerkTreeAdapter(selectedSkill)
  
  const selectedPerkTree = perkTrees.find(tree => tree.treeId === selectedSkill)
  
  // Pass everything to pure view
  return (
    <SkillsPageView
      skills={skills}
      perkTrees={perkTrees}
      selectedSkill={selectedSkill}
      selectedPerkTree={selectedPerkTree}
      loading={loading}
      error={error}
      drawerOpen={drawerOpen}
      onSkillSelect={setSelectedSkill}
      onDrawerOpenChange={setDrawerOpen}
      onSkillAssignmentChange={handleSkillAssignment}
      selectedPerks={selectedPerks}
      onPerkToggle={handleTogglePerk}
      onRankChange={handleRankChange}
    />
  )
}
```

### Phase 5: Remove Perks Feature (Day 5)

#### 5.1 Update Router
**File**: `src/app/router.tsx`
```typescript
// Remove UnifiedPerksPage import and route
// Keep only the skills route for perks
<Route path="perks" element={<UnifiedSkillsPage />} />
// Remove legacy /perks route
```

#### 5.2 Remove Perks Directory
```bash
rm -rf src/features/perks/
```

---

## 📊 Migration Checklist

### Phase 1: Consolidate Models ✅
- [x] Create `src/features/skills/models/` directory
- [x] Move and consolidate types from perks to skills
- [x] Extract `skillState.ts` from character build
- [x] Extract `perkState.ts` from character build
- [x] Extract `skillData.ts` from hooks
- [x] Extract `perkData.ts` from hooks
- [x] Extract `skillLogic.ts` from hooks
- [x] Move layout utilities from perks to skills utils
- [x] Add global skill constants (MAJOR: 3, MINOR: 6)
- [x] Create models index file with proper exports

### Phase 2: Create Adapters ✅
- [ ] Create `src/features/skills/adapters/` directory
- [ ] Create `useSkillsGridAdapter.ts`
- [ ] Create `usePerkTreeAdapter.ts`
- [ ] Create `useSkillsPageAdapter.ts`
- [ ] Create `adapters/index.ts`

### Phase 3: Extract Views ✅
- [ ] Create `src/features/skills/components/view/` directory
- [ ] Extract `SkillCardView.tsx`
- [ ] Extract `SkillsGridView.tsx`
- [ ] Extract `PerkNodeView.tsx`
- [ ] Extract `PerkTreeView.tsx` (with canvas functionality)
- [ ] Extract `SkillsPageView.tsx`
- [ ] Create pure loading/error views

### Phase 4: Integration ✅
- [ ] Refactor `UnifiedSkillsPage.tsx`
- [ ] Update imports throughout skills feature
- [ ] Remove old fat components
- [ ] Update `index.ts` exports
- [ ] Add tests for adapters and models

### Phase 5: Remove Perks Feature ✅
- [ ] Update router to remove perks routes
- [ ] Remove `src/features/perks/` directory
- [ ] Update any remaining imports
- [ ] Clean up build configuration

### Phase 6: Testing ✅
- [ ] Unit tests for models
- [ ] Unit tests for adapters
- [ ] Integration tests for views
- [ ] E2E tests for complete flow

---

## 🎯 Benefits After Migration

1. **Unified Architecture**: Skills and perks properly consolidated
2. **Separation of Concerns**: Clear boundaries between data, logic, and UI
3. **Testability**: Each layer can be tested independently
4. **Maintainability**: Single feature to maintain for skills+perks
5. **Performance**: Better memoization opportunities with pure components
6. **Consistency**: Single source of truth for skills and perks logic

---

## ⚠️ Key Architectural Decisions

### 1. Feature Consolidation
- **Decision**: Remove separate perks feature, consolidate into skills
- **Rationale**: Perks are a subset of skills, not a separate domain
- **Result**: Cleaner architecture with single responsibility

### 2. Canvas Integration
- **Decision**: `PerkTreeCanvasII` functionality moves into `PerkTreeView`
- **Rationale**: Canvas is too granular and tightly coupled to tree visualization
- **Result**: Single, cohesive tree view component

### 3. State Management
- **Decision**: Use character build state for both skills and perks
- **Rationale**: Skills and perks are part of the same character build
- **Result**: Consistent state management across the feature

---

## ⚠️ Risks and Mitigation

### Technical Risks
- **Breaking Changes**: Implement incrementally with feature flags
- **Performance Regression**: Benchmark before/after
- **Complexity Increase**: Maintain clear documentation

### Timeline Risks
- **Scope Creep**: Stick to defined phases
- **Dependencies**: Parallel implementation where possible
- **Testing Overhead**: Automated testing pipeline

---

## 📅 Timeline

- **Day 1**: Consolidate Models (6-8 hours)
- **Day 2**: Create Adapters (4-6 hours)
- **Day 3**: Extract Views (6-8 hours)
- **Day 4**: Integration (4-6 hours)
- **Day 5**: Remove Perks Feature (2-4 hours)
- **Total**: 22-32 hours (4-5 days)

---

## 🚀 Next Steps

1. Review and approve this migration plan
2. Start with Phase 1 (Model consolidation)
3. Create feature branch for migration
4. Implement incrementally with tests
5. Document new patterns for other features 