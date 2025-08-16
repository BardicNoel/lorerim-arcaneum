# Phase 1 Task 07: Main Derived Stats Card

## 📋 Task Overview

Create the main derived stats card component that combines the calculation hook, base attributes display, and derived stats table into a single, cohesive UI component. This will be the primary component integrated into the build page.

## 🎯 Objectives

- [ ] Create main derived stats card component
- [ ] Integrate calculation hook
- [ ] Combine base attributes and derived stats displays
- [ ] Add proper card styling and layout
- [ ] Ensure real-time updates work correctly

## 📁 Files to Create

### 1. Main Derived Stats Card Component

**Path:** `src/features/derived-stats/views/DerivedStatsCard.tsx`

**Content:**

```typescript
import { useDerivedStatsCalculation } from '../adapters/useDerivedStatsCalculation'
import { BaseAttributesDisplay } from './BaseAttributesDisplay'
import { DerivedStatsTable } from './DerivedStatsTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Calculator } from 'lucide-react'

export function DerivedStatsCard() {
  const { baseAttributes, derivedStats } = useDerivedStatsCalculation()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Derived Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
            Base Attributes
          </h4>
          <BaseAttributesDisplay attributes={baseAttributes} />
        </div>

        <div>
          <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
            Derived Attributes
          </h4>
          <DerivedStatsTable stats={derivedStats} />
        </div>
      </CardContent>
    </Card>
  )
}
```

### 2. Update Views Index File

**Path:** `src/features/derived-stats/views/index.ts`

**Content:**

```typescript
export { BaseAttributesDisplay } from './BaseAttributesDisplay'
export { DerivedStatsTable } from './DerivedStatsTable'
export { DerivedStatsCard } from './DerivedStatsCard'
```

## ✅ Acceptance Criteria

- [ ] Component displays both base attributes and derived stats
- [ ] Real-time updates when build changes
- [ ] Proper card styling and layout
- [ ] Clear section headers
- [ ] Integration with calculation hook works
- [ ] Component is properly typed
- [ ] No TypeScript compilation errors
- [ ] Component exports correctly

## 🔧 Implementation Steps

1. Create `DerivedStatsCard.tsx` with the main component
2. Update `views/index.ts` to export the new component
3. Test component with different build states
4. Verify real-time updates work
5. Test integration with existing UI components
6. Verify styling and layout

## 🎨 Design Specifications

### Layout

- **Card structure**: Standard card with header and content
- **Sections**: Two main sections (Base Attributes, Derived Attributes)
- **Spacing**: 6 units between sections, 3 units for headers
- **Padding**: Standard card padding

### Header

- **Icon**: Calculator icon
- **Title**: "Derived Stats"
- **Style**: Consistent with other cards

### Sections

- **Base Attributes**: Shows health, stamina, magicka
- **Derived Attributes**: Shows all 11 derived stats
- **Headers**: Small, muted, uppercase text

### Styling

- **Card**: Standard card component
- **Typography**: Consistent with project theme
- **Colors**: Follow project color scheme
- **Spacing**: Consistent spacing throughout

## 📊 Component Structure

```
DerivedStatsCard
├── CardHeader
│   ├── Calculator Icon
│   └── "Derived Stats" Title
└── CardContent
    ├── Base Attributes Section
    │   ├── Section Header
    │   └── BaseAttributesDisplay
    └── Derived Attributes Section
        ├── Section Header
        └── DerivedStatsTable
```

## 🔗 Dependencies

The component depends on:

- `useDerivedStatsCalculation` - Calculation hook
- `BaseAttributesDisplay` - Base attributes component
- `DerivedStatsTable` - Derived stats component
- `Card` components - UI components
- `Calculator` icon - Lucide React

## 📝 Notes

- Use existing card components for consistency
- Ensure proper spacing and typography
- Keep component simple and focused
- Use semantic HTML structure
- Follow project design patterns
- Ensure accessibility compliance

## ⏱️ Estimated Time

**30 minutes**

## 🔗 Dependencies

- [Phase 1 Task 01: Core Types and Interfaces](./phase1-task-01-types-and-interfaces.md)
- [Phase 1 Task 04: React Calculation Hook](./phase1-task-04-calculation-hook.md)
- [Phase 1 Task 05: Base Attributes Display Component](./phase1-task-05-base-attributes-display.md)
- [Phase 1 Task 06: Derived Stats Table Component](./phase1-task-06-derived-stats-table.md)

## 🚀 Next Task

[Phase 1 Task 08: Feature Integration](./phase1-task-08-feature-integration.md)

