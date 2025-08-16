# Phase 1 Task 05: Base Attributes Display Component

## 📋 Task Overview

Create a React component that displays the calculated base attributes (Health, Stamina, Magicka) in a clean, visually appealing format. This component will show the foundation stats that drive all derived calculations.

## 🎯 Objectives

- [ ] Create base attributes display component
- [ ] Use appropriate icons for each attribute
- [ ] Implement responsive grid layout
- [ ] Add proper styling and theming
- [ ] Ensure accessibility compliance

## 📁 Files to Create

### 1. Base Attributes Display Component

**Path:** `src/features/derived-stats/views/BaseAttributesDisplay.tsx`

**Content:**

```typescript
import { BaseAttributes } from '../types'
import { Heart, Zap, Activity } from 'lucide-react'

interface BaseAttributesDisplayProps {
  attributes: BaseAttributes
}

export function BaseAttributesDisplay({ attributes }: BaseAttributesDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2 p-3 bg-background rounded border">
        <Heart className="w-5 h-5 text-red-500" />
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Health</span>
          <span className="text-lg font-bold text-red-600">{attributes.health}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 bg-background rounded border">
        <Zap className="w-5 h-5 text-blue-500" />
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Magicka</span>
          <span className="text-lg font-bold text-blue-600">{attributes.magicka}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 bg-background rounded border">
        <Activity className="w-5 h-5 text-green-500" />
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Stamina</span>
          <span className="text-lg font-bold text-green-600">{attributes.stamina}</span>
        </div>
      </div>
    </div>
  )
}
```

### 2. Views Index File

**Path:** `src/features/derived-stats/views/index.ts`

**Content:**

```typescript
export { BaseAttributesDisplay } from './BaseAttributesDisplay'
```

## ✅ Acceptance Criteria

- [ ] Component displays all three base attributes correctly
- [ ] Icons are appropriate and visually distinct
- [ ] Layout is responsive (1 column on mobile, 3 on desktop)
- [ ] Styling follows project theme
- [ ] Colors are accessible and meaningful
- [ ] Component is properly typed
- [ ] No TypeScript compilation errors
- [ ] Component exports correctly

## 🔧 Implementation Steps

1. Create the `src/features/derived-stats/views/` directory
2. Create `BaseAttributesDisplay.tsx` with the component
3. Create `index.ts` for exports
4. Test component with different attribute values
5. Verify responsive behavior
6. Test accessibility features

## 🎨 Design Specifications

### Layout

- **Mobile**: Single column stack
- **Desktop**: Three-column grid
- **Spacing**: Consistent 4-unit gaps
- **Padding**: 4 units around content

### Colors

- **Health**: Red theme (`text-red-500`, `text-red-600`)
- **Magicka**: Blue theme (`text-blue-500`, `text-blue-600`)
- **Stamina**: Green theme (`text-green-500`, `text-green-600`)
- **Background**: Muted background with border

### Icons

- **Health**: Heart icon (red)
- **Magicka**: Zap icon (blue)
- **Stamina**: Activity icon (green)

### Typography

- **Labels**: Small, muted text
- **Values**: Large, bold text
- **Hierarchy**: Clear visual hierarchy

## 📱 Responsive Behavior

```css
/* Mobile (default) */
grid-cols-1

/* Medium screens and up */
md:grid-cols-3
```

## ♿ Accessibility Features

- **Semantic structure**: Proper heading hierarchy
- **Color contrast**: High contrast colors for readability
- **Icon labels**: Descriptive text labels
- **Keyboard navigation**: Focusable elements
- **Screen readers**: Proper ARIA labels

## 📝 Notes

- Use Lucide React icons for consistency
- Follow Tailwind CSS patterns for styling
- Ensure colors work with both light and dark themes
- Keep component simple and focused
- Use proper TypeScript typing

## ⏱️ Estimated Time

**30 minutes**

## 🔗 Dependencies

- [Phase 1 Task 01: Core Types and Interfaces](./phase1-task-01-types-and-interfaces.md)

## 🚀 Next Task

[Phase 1 Task 06: Derived Stats Table Component](./phase1-task-06-derived-stats-table.md)

