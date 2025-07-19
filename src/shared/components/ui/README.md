# Reusable UI Components

This directory contains composable, reusable UI components designed to eliminate code duplication and create consistent patterns across the application.

## Components

### SwitchCard

A reusable card component with a switch control, used for toggle-based settings.

```tsx
import { SwitchCard } from "@/shared/components/ui";

<SwitchCard
  title="Show Blessings"
  description="Display deity blessings and effects"
  checked={showBlessings}
  onCheckedChange={setShowBlessings}
/>;
```

**Props:**

- `title: string` - The card title
- `description?: string` - Optional description text
- `checked: boolean` - Switch state
- `onCheckedChange: (checked: boolean) => void` - Switch change handler
- `className?: string` - Additional CSS classes
- `disabled?: boolean` - Disable the card
- `onClick?: () => void` - Custom click handler (overrides default)
- `showSwitch?: boolean` - Show/hide the switch (default: true)

### DisplayCustomizeTools

An accordion component for organizing customization controls.

```tsx
import { DisplayCustomizeTools } from "@/shared/components/ui";

<DisplayCustomizeTools
  title="Customize Display"
  description="Configure what to show"
>
  <SwitchCard
    title="Show Stats"
    checked={showStats}
    onCheckedChange={setShowStats}
  />
  <SwitchCard
    title="Show Powers"
    checked={showPowers}
    onCheckedChange={setShowPowers}
  />
</DisplayCustomizeTools>;
```

**Props:**

- `children: React.ReactNode` - Child components (the controls)
- `title?: string` - Accordion title (default: "Customize Display")
- `description?: string` - Accordion description (default: "Configure what information to show")
- `defaultOpen?: boolean` - Start expanded (default: false)
- `className?: string` - Additional CSS classes

### ControlGrid

A responsive grid layout for organizing controls.

```tsx
import { ControlGrid } from "@/shared/components/ui";

<ControlGrid columns={3} gap="md">
  <SwitchCard title="Option 1" checked={option1} onCheckedChange={setOption1} />
  <SwitchCard title="Option 2" checked={option2} onCheckedChange={setOption2} />
  <SwitchCard title="Option 3" checked={option3} onCheckedChange={setOption3} />
</ControlGrid>;
```

**Props:**

- `children: React.ReactNode` - Grid items
- `columns?: 1 | 2 | 3 | 4` - Number of columns (default: 2)
- `gap?: 'sm' | 'md' | 'lg'` - Gap between items (default: 'md')
- `className?: string` - Additional CSS classes

### SectionHeader

A consistent header component for sections.

```tsx
import { SectionHeader } from "@/shared/components/ui";

<SectionHeader
  title="Religion Settings"
  description="Configure religion display options"
/>;
```

**Props:**

- `title: string` - Section title
- `description?: string` - Optional description
- `className?: string` - Additional CSS classes
- `titleClassName?: string` - Title-specific CSS classes
- `descriptionClassName?: string` - Description-specific CSS classes

## Usage Patterns

### Complete Customize Section

```tsx
import {
  DisplayCustomizeTools,
  ControlGrid,
  SwitchCard,
} from "@/shared/components/ui";

function MyPage() {
  const [showStats, setShowStats] = useState(true);
  const [showPowers, setShowPowers] = useState(true);
  const [showEffects, setShowEffects] = useState(false);

  return (
    <DisplayCustomizeTools>
      {/* Toggle All Control */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted/30">
        <Switch
          checked={showStats && showPowers && showEffects}
          onCheckedChange={(checked) => {
            setShowStats(checked);
            setShowPowers(checked);
            setShowEffects(checked);
          }}
        />
        <span className="text-sm font-medium">Toggle All</span>
      </div>

      {/* Individual Controls */}
      <ControlGrid columns={3}>
        <SwitchCard
          title="Show Stats"
          description="Display stat modifications"
          checked={showStats}
          onCheckedChange={setShowStats}
        />
        <SwitchCard
          title="Show Powers"
          description="Display special powers"
          checked={showPowers}
          onCheckedChange={setShowPowers}
        />
        <SwitchCard
          title="Show Effects"
          description="Display conditional effects"
          checked={showEffects}
          onCheckedChange={setShowEffects}
        />
      </ControlGrid>
    </DisplayCustomizeTools>
  );
}
```

## Benefits

1. **Consistency** - All customize sections look and behave the same
2. **Reusability** - Components can be used across different features
3. **Maintainability** - Changes to styling/behavior happen in one place
4. **Composability** - Components can be combined in different ways
5. **Type Safety** - Full TypeScript support with proper prop types

## Migration Guide

To migrate existing customize sections:

1. Replace the accordion structure with `DisplayCustomizeTools`
2. Replace individual switch cards with `SwitchCard`
3. Wrap multiple controls in `ControlGrid`
4. Remove duplicate styling and markup
5. Update imports to use the new components

This creates a more maintainable and consistent codebase while reducing duplication.
