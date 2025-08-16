# Phase 1 Task 06: Derived Stats Table Component

## 📋 Task Overview

Create a React component that displays all 11 derived stats in a clean, organized table format. This component will show the calculated derived stats with appropriate icons, values, and formatting.

## 🎯 Objectives

- [ ] Create derived stats table component
- [ ] Display all 11 derived stats with icons
- [ ] Format values correctly (percentages vs points)
- [ ] Implement proper styling and layout
- [ ] Add category-based organization

## 📁 Files to Create

### 1. Derived Stats Table Component

**Path:** `src/features/derived-stats/views/DerivedStatsTable.tsx`

**Content:**

```typescript
import { DerivedStat } from '../types'
import {
  Shield,
  Zap,
  Heart,
  Target,
  Move,
  Package,
  Crosshair,
  Sword,
  Hand
} from 'lucide-react'

interface DerivedStatsTableProps {
  stats: DerivedStat[]
}

const statIcons: Record<string, React.ComponentType> = {
  magicResist: Shield,
  magickaRegen: Zap,
  diseaseResist: Heart,
  poisonResist: Shield,
  staminaRegen: Zap,
  moveSpeed: Move,
  carryWeight: Package,
  rangedDamage: Crosshair,
  oneHandDamage: Sword,
  twoHandDamage: Sword,
  unarmedDamage: Hand,
}

const categoryOrder = ['combat', 'survival', 'movement', 'magic'] as const
const categoryLabels: Record<string, string> = {
  combat: 'Combat',
  survival: 'Survival',
  movement: 'Movement',
  magic: 'Magic',
}

export function DerivedStatsTable({ stats }: DerivedStatsTableProps) {
  // Group stats by category
  const statsByCategory = stats.reduce((acc, stat) => {
    if (!acc[stat.category]) {
      acc[stat.category] = []
    }
    acc[stat.category].push(stat)
    return acc
  }, {} as Record<string, DerivedStat[]>)

  const formatValue = (stat: DerivedStat) => {
    if (stat.value === 0) {
      return `+0${stat.isPercentage ? '%' : ''}`
    }
    return `+${stat.value}${stat.isPercentage ? '%' : ''}`
  }

  return (
    <div className="space-y-4">
      {categoryOrder.map(category => {
        const categoryStats = statsByCategory[category]
        if (!categoryStats?.length) return null

        return (
          <div key={category} className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              {categoryLabels[category]}
            </h4>
            <div className="space-y-1">
              {categoryStats.map((stat) => {
                const Icon = statIcons[stat.name.toLowerCase().replace(/\s+/g, '')] || Shield
                const value = formatValue(stat)

                return (
                  <div
                    key={stat.name}
                    className="flex items-center justify-between p-3 bg-background border rounded hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-medium">{stat.name}</span>
                        <span className="text-xs text-muted-foreground">{stat.description}</span>
                      </div>
                    </div>
                    <span className="font-bold text-primary">{value}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

### 2. Update Views Index File

**Path:** `src/features/derived-stats/views/index.ts`

**Content:**

```typescript
export { BaseAttributesDisplay } from './BaseAttributesDisplay'
export { DerivedStatsTable } from './DerivedStatsTable'
```

## ✅ Acceptance Criteria

- [ ] Component displays all 11 derived stats correctly
- [ ] Stats are grouped by category (combat, survival, movement, magic)
- [ ] Icons are appropriate for each stat type
- [ ] Values are formatted correctly (percentages vs points)
- [ ] Zero values show as "+0%" or "+0"
- [ ] Layout is clean and organized
- [ ] Hover effects work properly
- [ ] Component is properly typed
- [ ] No TypeScript compilation errors

## 🔧 Implementation Steps

1. Create `DerivedStatsTable.tsx` with the component
2. Update `views/index.ts` to export the new component
3. Test component with different stat values
4. Verify category grouping works correctly
5. Test formatting for different stat types
6. Verify hover effects and styling

## 🎨 Design Specifications

### Layout

- **Categories**: Grouped by stat category
- **Spacing**: Consistent spacing between elements
- **Padding**: 3 units for stat items
- **Borders**: Subtle borders for separation

### Icons

- **Combat**: Sword, Crosshair, Hand
- **Survival**: Shield, Heart, Package
- **Movement**: Move, Zap
- **Magic**: Zap, Shield

### Value Formatting

- **Percentages**: Show "+X%" (e.g., "+15%")
- **Points**: Show "+X" (e.g., "+25")
- **Zero values**: Show "+0%" or "+0"

### Categories

1. **Combat** (4 stats): Ranged Damage, One-Hand Damage, Two-Hand Damage, Unarmed Damage
2. **Survival** (4 stats): Magic Resist, Disease Resist, Poison Resist, Carry Weight
3. **Movement** (2 stats): Stamina Regen, Move Speed
4. **Magic** (1 stat): Magicka Regen

## 📊 Stat Mapping

| Stat Name       | Icon      | Category | Format     |
| --------------- | --------- | -------- | ---------- |
| Magic Resist    | Shield    | Survival | Percentage |
| Magicka Regen   | Zap       | Magic    | Percentage |
| Disease Resist  | Heart     | Survival | Percentage |
| Poison Resist   | Shield    | Survival | Percentage |
| Stamina Regen   | Zap       | Movement | Percentage |
| Move Speed      | Move      | Movement | Percentage |
| Carry Weight    | Package   | Survival | Points     |
| Ranged Damage   | Crosshair | Combat   | Percentage |
| One-Hand Damage | Sword     | Combat   | Percentage |
| Two-Hand Damage | Sword     | Combat   | Percentage |
| Unarmed Damage  | Hand      | Combat   | Points     |

## 📝 Notes

- Use consistent icon mapping for stat types
- Group stats logically by category
- Provide clear visual hierarchy
- Include descriptions for context
- Use hover effects for interactivity
- Ensure proper TypeScript typing

## ⏱️ Estimated Time

**45 minutes**

## 🔗 Dependencies

- [Phase 1 Task 01: Core Types and Interfaces](./phase1-task-01-types-and-interfaces.md)
- [Phase 1 Task 05: Base Attributes Display Component](./phase1-task-05-base-attributes-display.md)

## 🚀 Next Task

[Phase 1 Task 07: Main Derived Stats Card](./phase1-task-07-main-card.md)

