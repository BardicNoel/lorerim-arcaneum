# Attribute Assignment Tracking Feature Plan

## Overview

This feature will track attribute assignments (Health, Stamina, Magicka) that players make each level. Players can increase one of these three attributes every level, and we need to track the total increases, allow users to set assignments, and display the ratio of assigned attributes over character levels.

## Current Architecture Analysis

Based on the deep analysis and codebase exploration:

### State Management
- **Zustand store** (`characterStore.ts`) manages character build state
- **BuildState interface** (`build.ts`) defines the character data structure
- **useCharacterBuild hook** provides state management utilities

### UI Components
- **StatBar component** (`StatBar.tsx`) provides visual attribute bars
- **Generic components** pattern for consistent UI
- **Feature-based organization** with clear separation of concerns

### Visual Patterns
- **Race cards** use StatBar for displaying Health/Magicka/Stamina
- **Build summary** shows character selections
- **Accordion patterns** for expandable content

## Feature Requirements

### Core Functionality
1. **Track attribute assignments per level**
2. **Allow users to set assignments for multiple levels**
3. **Display total attribute increases**
4. **Show ratio of assigned attributes over character levels**
5. **Integrate with existing character build system**

### Data Structure

```typescript
// Add to BuildState interface
interface BuildState {
  // ... existing properties
  attributeAssignments: {
    health: number    // Total health increases
    stamina: number   // Total stamina increases  
    magicka: number   // Total magicka increases
    level: number     // Current character level
  }
}
```

### UI Components Needed

1. **AttributeAssignmentCard** - Main component for the build page
2. **AttributeAssignmentControls** - Controls for setting assignments
3. **AttributeSummaryDisplay** - Visual display of current totals
4. **LevelAssignmentGrid** - Grid for assigning attributes per level
5. **AttributeRatioDisplay** - Shows ratio of assignments over levels

## Implementation Plan

### Phase 1: Data Structure & State Management

#### 1.1 Update BuildState Interface
- Add `attributeAssignments` to `BuildState`
- Update `DEFAULT_BUILD` with initial values
- Add validation for attribute assignment limits

#### 1.2 Extend Character Store
- Add methods for updating attribute assignments
- Add validation logic for assignment limits
- Add computed properties for totals and ratios

#### 1.3 Create Attribute Assignment Hook
- `useAttributeAssignments` hook for state management
- Methods for adding/removing assignments
- Validation and error handling

### Phase 2: Core Components

#### 2.1 AttributeAssignmentCard
```typescript
interface AttributeAssignmentCardProps {
  className?: string
  showControls?: boolean
  showSummary?: boolean
}
```

**Features:**
- Reuse existing StatBar components for visual display
- Show current attribute totals vs. base values
- Display assignment ratio over character level
- Integrate with existing card patterns

#### 2.2 AttributeAssignmentControls
```typescript
interface AttributeAssignmentControlsProps {
  onAssignmentChange: (level: number, attribute: 'health' | 'stamina' | 'magicka') => void
  currentAssignments: Record<number, 'health' | 'stamina' | 'magicka'>
  maxLevel: number
}
```

**Features:**
- Grid layout for level-by-level assignment
- Visual indicators for assigned attributes
- Quick assignment tools (bulk assign, clear all)
- Validation feedback

#### 2.3 AttributeSummaryDisplay
```typescript
interface AttributeSummaryDisplayProps {
  baseStats: { health: number; stamina: number; magicka: number }
  assignments: { health: number; stamina: number; magicka: number }
  level: number
}
```

**Features:**
- Reuse StatBar components for visual display
- Show base + assignment totals
- Display assignment ratios
- Color-coded attribute bars

### Phase 3: Integration & UI

#### 3.1 Build Page Integration
- Add `AttributeAssignmentCard` to Build page
- Position after race/birthsign/traits section
- Integrate with existing tab structure

#### 3.2 Visual Design
- Reuse existing StatBar color scheme:
  - Health: Red (`bg-red-500`)
  - Stamina: Green (`bg-green-500`) 
  - Magicka: Blue (`bg-blue-500`)
- Follow existing card patterns and spacing
- Use consistent typography and icons

#### 3.3 Responsive Design
- Mobile-friendly assignment controls
- Collapsible sections for smaller screens
- Touch-friendly interaction patterns

### Phase 4: Advanced Features

#### 4.1 Level Progression
- Automatic level calculation based on skill levels
- Validation against maximum level limits
- Integration with skill system for level requirements

#### 4.2 Assignment Presets
- Common assignment patterns (warrior, mage, thief)
- Quick assignment templates
- Save/load assignment patterns

#### 4.3 Export/Import
- Include attribute assignments in build export
- URL parameter support for sharing builds
- Build validation and error handling

## Technical Implementation Details

### File Structure
```
src/features/attributes/
├── components/
│   ├── atomic/
│   │   ├── AttributeBar.tsx
│   │   ├── LevelAssignmentButton.tsx
│   │   └── index.ts
│   ├── composition/
│   │   ├── AttributeAssignmentCard.tsx
│   │   ├── AttributeAssignmentControls.tsx
│   │   ├── AttributeSummaryDisplay.tsx
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── useAttributeAssignments.ts
│   └── index.ts
├── types/
│   └── index.ts
├── utils/
│   ├── attributeCalculations.ts
│   └── index.ts
└── index.ts
```

### State Management Pattern
```typescript
// Follow existing patterns from other features
interface AttributeAssignments {
  health: number
  stamina: number
  magicka: number
  level: number
}

// Add to character store
interface CharacterStore {
  // ... existing properties
  updateAttributeAssignments: (assignments: Partial<AttributeAssignments>) => void
  setAttributeAssignment: (level: number, attribute: 'health' | 'stamina' | 'magicka') => void
  clearAttributeAssignments: () => void
}
```

### Component Patterns
- Follow existing generic component patterns
- Use named child component slots over render props
- Implement consistent prop interfaces
- Follow existing styling patterns

### Validation Rules
1. **Level Limits**: Cannot assign beyond current character level
2. **Assignment Limits**: One assignment per level
3. **Total Limits**: Cannot exceed maximum attribute values
4. **Skill Integration**: Level must match skill requirements

## Testing Strategy

### Unit Tests
- Attribute calculation utilities
- State management logic
- Component rendering and interactions
- Validation rules

### Integration Tests
- Build page integration
- State persistence
- URL parameter handling
- Export/import functionality

### Visual Tests
- Responsive design verification
- Accessibility compliance
- Cross-browser compatibility

## Migration Considerations

### Backward Compatibility
- Existing builds without attribute assignments should work
- Default values for missing assignment data
- Graceful degradation for older build versions

### Data Migration
- Update existing build data to include attribute assignments
- Handle missing assignment data in existing builds
- Preserve existing build URLs and sharing

## Success Metrics

### Functionality
- ✅ Users can assign attributes for each level
- ✅ Total attribute increases are tracked correctly
- ✅ Assignment ratios are displayed accurately
- ✅ Integration with existing build system works

### User Experience
- ✅ Intuitive assignment interface
- ✅ Clear visual feedback
- ✅ Responsive design works on all devices
- ✅ Performance remains acceptable

### Technical Quality
- ✅ Follows existing architectural patterns
- ✅ Comprehensive test coverage
- ✅ Proper error handling
- ✅ Accessibility compliance

## Next Steps

1. **Create feature branch** for attribute assignment tracking
2. **Implement Phase 1** (data structure and state management)
3. **Build core components** following existing patterns
4. **Integrate with build page** and test thoroughly
5. **Add advanced features** based on user feedback
6. **Document and deploy** the feature

## Dependencies

### Existing Components to Reuse
- `StatBar` component for visual display
- `GenericAccordionCard` for expandable content
- `Card`, `CardHeader`, `CardContent` for layout
- `Button`, `Badge` for interactive elements

### Existing Patterns to Follow
- Feature-based organization structure
- Zustand state management patterns
- Generic component composition patterns
- Build page integration patterns

### Existing Utilities to Leverage
- `cn` utility for class name composition
- `buildSpacing` for consistent spacing
- `buildColors` for consistent theming
- `useCharacterBuild` hook patterns 