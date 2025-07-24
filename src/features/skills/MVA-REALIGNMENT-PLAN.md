# Skills Feature MVA Realignment Plan

## 📋 Overview

This document realigns our current MVA implementation to follow the standard **Model-View-Adapter (MVA)** refactor template. Our current implementation has good foundations but needs restructuring to match the template's architecture patterns.

---

## 🔍 Current State vs Template Analysis

### ✅ What We Have Right
- **Model Layer**: Pure business logic in `models/` directory
- **Adapter Layer**: Data transformation in `adapters/` directory  
- **View Layer**: React components in `views/` directory
- **Separation of Concerns**: Clear boundaries between layers
- **Testing**: Comprehensive test coverage (87 tests)

### ❌ What Needs Realignment

#### 1. **File Structure Mismatch**
**Current Structure:**
```
src/features/skills/
├── models/                    # ✅ Good
├── adapters/                  # ✅ Good
├── views/                     # ❌ Should be components/view/
├── utils/                     # ✅ Good
└── pages/                     # ❌ Should be simplified
```

**Template Structure:**
```
src/features/skills/
├── model/                     # 🆕 Rename to singular
├── adapters/                  # ✅ Keep
├── views/                     # 🆕 Move to components/view/
├── components/                # 🆕 New atomic/composition structure
│   ├── atomic/               # 🆕 Pure presentational components
│   ├── composition/          # 🆕 Components that compose atomic
│   └── view/                 # 🆕 High-level view components
├── pages/                     # 🆕 Simplified entry points
└── utils/                     # ✅ Keep
```

#### 2. **Component Architecture Issues**
**Current Issues:**
- `SkillCardMVA` is a high-level view component in `views/`
- Missing atomic components (pure presentational)
- Missing composition components
- No clear component hierarchy

**Template Requirements:**
- **Atomic Components**: Pure presentational (`SkillItem`, `SkillBadge`, etc.)
- **Composition Components**: Combine atomic components (`SkillList`, `SkillGrid`, etc.)
- **View Components**: High-level components that consume adapters

#### 3. **Adapter Pattern Mismatch**
**Current Issues:**
- `UnifiedAdapter` class instead of hooks
- Missing specific adapters for different views
- No clear adapter specialization

**Template Requirements:**
- **Hook-based adapters**: `useSkillData()`, `useSkillState()`, etc.
- **Specialized adapters**: One adapter per view type
- **Clear data flow**: Model → Adapter → View

---

## 🎯 Realignment Strategy

### Phase 1: Restructure File Organization (Day 1)

#### 1.1 Create New Directory Structure
```bash
# Create new structure
mkdir -p src/features/skills/components/atomic
mkdir -p src/features/skills/components/composition
mkdir -p src/features/skills/components/view

# Rename models directory
mv src/features/skills/models src/features/skills/model
```

#### 1.2 Move Components to Correct Locations
```bash
# Move view components to components/view/
mv src/features/skills/views/SkillCardMVA.tsx src/features/skills/components/view/
mv src/features/skills/views/SkillsPage.tsx src/features/skills/components/view/SkillsPageView.tsx

# Create new entry point
touch src/features/skills/pages/SkillsPage.tsx
```

### Phase 2: Extract Atomic Components (Day 2)

#### 2.1 Create Atomic Components
**File**: `src/features/skills/components/atomic/SkillItem.tsx`
```typescript
// Pure presentational component for individual skill display
interface SkillItemProps {
  name: string
  description: string
  category: string
  assignmentType: 'major' | 'minor' | 'none'
  perkCount: string
  onSelect: () => void
  className?: string
}

export function SkillItem({
  name,
  description,
  category,
  assignmentType,
  perkCount,
  onSelect,
  className,
}: SkillItemProps) {
  return (
    <div className={cn("p-4 border rounded-lg cursor-pointer", className)} onClick={onSelect}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{name}</h3>
        <SkillAssignmentBadge type={assignmentType} />
      </div>
      <p className="text-sm text-muted-foreground mb-2">{description}</p>
      <div className="flex gap-2">
        <SkillCategoryBadge category={category} />
        <SkillPerkCountBadge count={perkCount} />
      </div>
    </div>
  )
}
```

**File**: `src/features/skills/components/atomic/SkillAssignmentBadge.tsx`
```typescript
// Pure presentational component for assignment status
interface SkillAssignmentBadgeProps {
  type: 'major' | 'minor' | 'none'
  size?: 'sm' | 'md' | 'lg'
}

export function SkillAssignmentBadge({ type, size = 'sm' }: SkillAssignmentBadgeProps) {
  const styles = {
    major: 'bg-blue-600 text-white',
    minor: 'bg-green-600 text-white', 
    none: 'bg-gray-100 text-gray-800 border'
  }
  
  const labels = {
    major: 'Major',
    minor: 'Minor',
    none: 'Unassigned'
  }
  
  return (
    <Badge className={cn(styles[type], sizeClasses[size])}>
      {labels[type]}
    </Badge>
  )
}
```

**File**: `src/features/skills/components/atomic/SkillCategoryBadge.tsx`
```typescript
// Pure presentational component for category display
interface SkillCategoryBadgeProps {
  category: string
  size?: 'sm' | 'md' | 'lg'
}

export function SkillCategoryBadge({ category, size = 'sm' }: SkillCategoryBadgeProps) {
  const categoryStyles = {
    Combat: 'bg-red-100 text-red-800 border-red-200',
    Magic: 'bg-blue-100 text-blue-800 border-blue-200',
    Stealth: 'bg-green-100 text-green-800 border-green-200',
  }
  
  return (
    <Badge 
      variant="outline" 
      className={cn(categoryStyles[category] || 'bg-gray-100 text-gray-800', sizeClasses[size])}
    >
      {category}
    </Badge>
  )
}
```

#### 2.2 Create Composition Components
**File**: `src/features/skills/components/composition/SkillGrid.tsx`
```typescript
// Component that composes multiple SkillItem components
interface SkillGridProps {
  skills: Array<{
    id: string
    name: string
    description: string
    category: string
    assignmentType: 'major' | 'minor' | 'none'
    perkCount: string
  }>
  onSkillSelect: (skillId: string) => void
  selectedSkillId?: string
  className?: string
}

export function SkillGrid({ 
  skills, 
  onSkillSelect, 
  selectedSkillId, 
  className 
}: SkillGridProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {skills.map((skill) => (
        <SkillItem
          key={skill.id}
          name={skill.name}
          description={skill.description}
          category={skill.category}
          assignmentType={skill.assignmentType}
          perkCount={skill.perkCount}
          onSelect={() => onSkillSelect(skill.id)}
          className={selectedSkillId === skill.id ? "ring-2 ring-primary" : ""}
        />
      ))}
    </div>
  )
}
```

**File**: `src/features/skills/components/composition/SkillSearch.tsx`
```typescript
// Component for skill search functionality
interface SkillSearchProps {
  query: string
  onQueryChange: (query: string) => void
  placeholder?: string
  className?: string
}

export function SkillSearch({ 
  query, 
  onQueryChange, 
  placeholder = "Search skills...",
  className 
}: SkillSearchProps) {
  return (
    <div className={cn("mb-6", className)}>
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="max-w-md"
      />
    </div>
  )
}
```

### Phase 3: Refactor Adapters to Template Pattern (Day 3)

#### 3.1 Replace UnifiedAdapter with Hook-Based Adapters

**File**: `src/features/skills/adapters/useSkillData.ts`
```typescript
// Adapter for skill data loading and caching
export function useSkillData() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const loadSkills = async () => {
      try {
        setLoading(true)
        const data = await fetchSkills()
        setSkills(data)
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

**File**: `src/features/skills/adapters/useSkillState.ts`
```typescript
// Adapter for skill state management
export function useSkillState() {
  const [majorSkills, setMajorSkills] = useState<string[]>([])
  const [minorSkills, setMinorSkills] = useState<string[]>([])
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null)
  
  const assignSkill = useCallback((skillId: string, type: 'major' | 'minor') => {
    if (type === 'major') {
      setMajorSkills(prev => [...prev, skillId])
    } else {
      setMinorSkills(prev => [...prev, skillId])
    }
  }, [])
  
  const unassignSkill = useCallback((skillId: string) => {
    setMajorSkills(prev => prev.filter(id => id !== skillId))
    setMinorSkills(prev => prev.filter(id => id !== skillId))
  }, [])
  
  return {
    majorSkills,
    minorSkills,
    selectedSkillId,
    setSelectedSkillId,
    assignSkill,
    unassignSkill,
  }
}
```

**File**: `src/features/skills/adapters/useSkillFilters.ts`
```typescript
// Adapter for skill filtering and search
export function useSkillFilters(skills: Skill[]) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           skill.category.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = !selectedCategory || skill.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [skills, searchQuery, selectedCategory])
  
  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredSkills,
  }
}
```

**File**: `src/features/skills/adapters/useSkillComputed.ts`
```typescript
// Adapter for computed skill data
export function useSkillComputed(skills: Skill[], majorSkills: string[], minorSkills: string[]) {
  const skillSummary = useMemo(() => {
    const majorCount = majorSkills.length
    const minorCount = minorSkills.length
    
    return {
      majorCount,
      minorCount,
      majorLimit: 3,
      minorLimit: 6,
      canAssignMajor: majorCount < 3,
      canAssignMinor: minorCount < 6,
    }
  }, [majorSkills, minorSkills])
  
  const skillsWithAssignment = useMemo(() => {
    return skills.map(skill => ({
      ...skill,
      assignmentType: majorSkills.includes(skill.id) ? 'major' as const :
                     minorSkills.includes(skill.id) ? 'minor' as const : 'none' as const,
      canAssignMajor: skillSummary.canAssignMajor,
      canAssignMinor: skillSummary.canAssignMinor,
    }))
  }, [skills, majorSkills, minorSkills, skillSummary])
  
  return {
    skillSummary,
    skillsWithAssignment,
  }
}
```

### Phase 4: Refactor View Components (Day 4)

#### 4.1 Create High-Level View Components

**File**: `src/features/skills/components/view/SkillsPageView.tsx`
```typescript
// High-level view component that consumes adapters
interface SkillsPageViewProps {
  skills: Skill[]
  loading: boolean
  error: string | null
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedSkillId: string | null
  onSkillSelect: (skillId: string) => void
  onSkillAssignment: (skillId: string, type: 'major' | 'minor' | 'none') => void
  skillSummary: {
    majorCount: number
    minorCount: number
    majorLimit: number
    minorLimit: number
  }
}

export function SkillsPageView({
  skills,
  loading,
  error,
  searchQuery,
  onSearchChange,
  selectedSkillId,
  onSkillSelect,
  onSkillAssignment,
  skillSummary,
}: SkillsPageViewProps) {
  if (loading) {
    return <LoadingView />
  }
  
  if (error) {
    return <ErrorView error={error} />
  }
  
  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Skills & Perks" description="Manage your character's skills" />
      
      <BuildSummaryCard summary={skillSummary} />
      
      <SkillSearch 
        query={searchQuery} 
        onQueryChange={onSearchChange} 
      />
      
      <SkillGrid
        skills={skills}
        onSkillSelect={onSkillSelect}
        selectedSkillId={selectedSkillId}
      />
    </div>
  )
}
```

#### 4.2 Create Pure Loading/Error Views

**File**: `src/features/skills/components/atomic/LoadingView.tsx`
```typescript
// Pure loading component
export function LoadingView() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Loading Skills...</h1>
        <p>Initializing skill and perk data...</p>
      </div>
    </div>
  )
}
```

**File**: `src/features/skills/components/atomic/ErrorView.tsx`
```typescript
// Pure error component
interface ErrorViewProps {
  error: string
}

export function ErrorView({ error }: ErrorViewProps) {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center text-red-600">
        <h1 className="text-2xl font-bold mb-4">Error Loading Skills</h1>
        <p>{error}</p>
      </div>
    </div>
  )
}
```

### Phase 5: Create Simplified Entry Point (Day 5)

#### 5.1 New Skills Page Entry Point

**File**: `src/features/skills/pages/SkillsPage.tsx`
```typescript
// Simplified entry point that composes adapters and views
export function SkillsPage() {
  // Use adapters for data and state management
  const { skills, loading, error } = useSkillData()
  const { 
    majorSkills, 
    minorSkills, 
    selectedSkillId, 
    setSelectedSkillId, 
    assignSkill, 
    unassignSkill 
  } = useSkillState()
  const { 
    searchQuery, 
    setSearchQuery, 
    filteredSkills 
  } = useSkillFilters(skills)
  const { 
    skillSummary, 
    skillsWithAssignment 
  } = useSkillComputed(filteredSkills, majorSkills, minorSkills)
  
  // Handle skill assignment
  const handleSkillAssignment = useCallback((skillId: string, type: 'major' | 'minor' | 'none') => {
    if (type === 'none') {
      unassignSkill(skillId)
    } else {
      assignSkill(skillId, type)
    }
  }, [assignSkill, unassignSkill])
  
  // Pass everything to pure view
  return (
    <SkillsPageView
      skills={skillsWithAssignment}
      loading={loading}
      error={error}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedSkillId={selectedSkillId}
      onSkillSelect={setSelectedSkillId}
      onSkillAssignment={handleSkillAssignment}
      skillSummary={skillSummary}
    />
  )
}
```

### Phase 6: Update Exports and Imports (Day 6)

#### 6.1 Update Index Files

**File**: `src/features/skills/components/index.ts`
```typescript
// Export all components
export * from './atomic'
export * from './composition'
export * from './view'
```

**File**: `src/features/skills/components/atomic/index.ts`
```typescript
// Export atomic components
export { SkillItem } from './SkillItem'
export { SkillAssignmentBadge } from './SkillAssignmentBadge'
export { SkillCategoryBadge } from './SkillCategoryBadge'
export { SkillPerkCountBadge } from './SkillPerkCountBadge'
export { LoadingView } from './LoadingView'
export { ErrorView } from './ErrorView'
```

**File**: `src/features/skills/components/composition/index.ts`
```typescript
// Export composition components
export { SkillGrid } from './SkillGrid'
export { SkillSearch } from './SkillSearch'
export { SkillFilters } from './SkillFilters'
```

**File**: `src/features/skills/components/view/index.ts`
```typescript
// Export view components
export { SkillsPageView } from './SkillsPageView'
export { PerkTreeView } from './PerkTreeView'
```

#### 6.2 Update Main Feature Index

**File**: `src/features/skills/index.ts`
```typescript
// Export main entry point
export { SkillsPage } from './pages/SkillsPage'

// Export components for reuse
export * from './components'

// Export adapters for testing
export * from './adapters'

// Export models for testing
export * from './model'
```

---

## 📊 Realignment Checklist

### Phase 1: Restructure File Organization
- [ ] Create new directory structure
- [ ] Move components to correct locations
- [ ] Rename models directory to model
- [ ] Update import paths

### Phase 2: Extract Atomic Components
- [ ] Create `SkillItem.tsx`
- [ ] Create `SkillAssignmentBadge.tsx`
- [ ] Create `SkillCategoryBadge.tsx`
- [ ] Create `SkillPerkCountBadge.tsx`
- [ ] Create `LoadingView.tsx`
- [ ] Create `ErrorView.tsx`
- [ ] Create atomic index file

### Phase 3: Refactor Adapters
- [ ] Create `useSkillData.ts`
- [ ] Create `useSkillState.ts`
- [ ] Create `useSkillFilters.ts`
- [ ] Create `useSkillComputed.ts`
- [ ] Remove `UnifiedAdapter` class
- [ ] Update adapter index file

### Phase 4: Refactor View Components
- [ ] Create `SkillsPageView.tsx`
- [ ] Create `PerkTreeView.tsx`
- [ ] Update view components to use atomic components
- [ ] Create view index file

### Phase 5: Create Entry Point
- [ ] Create `SkillsPage.tsx` entry point
- [ ] Update router to use new entry point
- [ ] Remove old `SkillsPage.tsx`

### Phase 6: Update Exports
- [ ] Update all index files
- [ ] Update imports throughout codebase
- [ ] Update tests to use new structure
- [ ] Update documentation

---

## 🎯 Benefits After Realignment

1. **Template Compliance**: Follows standard MVA refactor template
2. **Component Reusability**: Atomic components can be reused across features
3. **Clear Hierarchy**: Atomic → Composition → View → Page structure
4. **Hook-Based Adapters**: More React-idiomatic approach
5. **Better Testing**: Each layer can be tested independently
6. **Consistency**: Standardized patterns across the codebase

---

## ⚠️ Migration Risks and Mitigation

### Technical Risks
- **Breaking Changes**: Implement incrementally with feature flags
- **Import Chaos**: Use automated refactoring tools
- **Test Failures**: Update tests alongside implementation

### Timeline Risks
- **Scope Creep**: Stick to defined phases
- **Dependencies**: Parallel implementation where possible
- **Complexity**: Maintain clear documentation

---

## 📅 Timeline

- **Day 1**: Restructure File Organization (4 hours)
- **Day 2**: Extract Atomic Components (6 hours)
- **Day 3**: Refactor Adapters (6 hours)
- **Day 4**: Refactor View Components (6 hours)
- **Day 5**: Create Entry Point (4 hours)
- **Day 6**: Update Exports and Imports (4 hours)
- **Total**: 30 hours (5-6 days)

---

## 🚀 Next Steps

1. **Review and Approve**: Get approval for this realignment plan
2. **Create Feature Branch**: `feature/skills-mva-realignment`
3. **Implement Incrementally**: Follow the phase-based approach
4. **Update Tests**: Ensure all tests pass after each phase
5. **Document Patterns**: Create documentation for other features to follow

This realignment will bring our MVA implementation in line with the standard template while preserving all existing functionality and improving maintainability. 