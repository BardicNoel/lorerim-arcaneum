# Generic Accordion Card - Slot-Based Pattern

The `GenericAccordionCard` uses a **slot-based pattern** similar to Dialog components, which is much cleaner and more intuitive than render callbacks.

## Why Slot-Based Pattern?

### ❌ Problems with Render Callbacks

- **Complex API** - Many render props make the component hard to use
- **Type Safety Issues** - Generic types can be confusing
- **Verbose Usage** - Lots of function definitions
- **Hard to Read** - Callbacks obscure the actual content structure

### ✅ Benefits of Slot-Based Pattern

- **Intuitive** - Children are slotted into specific areas
- **Type Safe** - No complex generics needed
- **Readable** - Content structure is clear in JSX
- **Flexible** - Easy to add/remove sections
- **Composable** - Can mix and match slot components

## Usage Examples

### Basic Usage

```tsx
import {
  GenericAccordionCard,
  AccordionLeftControls,
  AccordionHeader,
  AccordionCollapsedContentSlot,
  AccordionExpandedContentSlot,
} from "@/shared/components/generic";

<GenericAccordionCard isExpanded={isExpanded} onToggle={onToggle}>
  {/* Left Controls */}
  <AccordionLeftControls>
    <AddToBuildSwitchSimple itemId={item.id} itemType="race" />
  </AccordionLeftControls>

  {/* Header Content */}
  <AccordionHeader>
    <div className="flex items-center gap-3">
      <span className="text-2xl">🏃</span>
      <H3>{item.name}</H3>
    </div>
  </AccordionHeader>

  {/* Collapsed Content */}
  <AccordionCollapsedContentSlot>
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{item.summary}</p>
    </div>
  </AccordionCollapsedContentSlot>

  {/* Expanded Content */}
  <AccordionExpandedContentSlot>
    <div className="space-y-4">
      <p>{item.description}</p>
      {/* More detailed content */}
    </div>
  </AccordionExpandedContentSlot>
</GenericAccordionCard>;
```

### Optional Sections

You can omit any slot - the accordion will work without them:

```tsx
<GenericAccordionCard isExpanded={isExpanded} onToggle={onToggle}>
  {/* Only header - no left controls, no collapsed/expanded content */}
  <AccordionHeader>
    <H3>{item.name}</H3>
  </AccordionHeader>
</GenericAccordionCard>
```

### Complex Header with Badges

```tsx
<AccordionHeader>
  <div className="flex items-center gap-3">
    <span className="text-2xl">🏃</span>
    <div className="flex-1">
      <H3 className="text-primary font-semibold">{item.name}</H3>
    </div>
  </div>

  {/* Right side badges */}
  <div className="flex items-center gap-3">
    <Badge variant="outline">{item.category}</Badge>
    <Badge variant="outline">{item.effects.length} effects</Badge>
  </div>
</AccordionHeader>
```

## Slot Components

### `AccordionLeftControls`

- **Purpose**: Left column for controls (switches, buttons)
- **Position**: Left side of header
- **Styling**: Vertical layout with gap

### `AccordionHeader`

- **Purpose**: Main header content (title, badges, info)
- **Position**: Center of header
- **Styling**: Horizontal layout with flex-1

### `AccordionCollapsedContentSlot`

- **Purpose**: Content shown when accordion is collapsed
- **Position**: Below header when collapsed
- **Styling**: Space-y-3 wrapper

### `AccordionExpandedContentSlot`

- **Purpose**: Detailed content shown when expanded
- **Position**: Below header when expanded
- **Styling**: Space-y-4 wrapper

## Migration from Render Callbacks

### Before (Render Callbacks)

```tsx
<GenericAccordionCard
  item={item}
  isExpanded={isExpanded}
  onToggle={onToggle}
  renderHeader={(item) => renderRaceHeader(item, originalRace)}
  renderCollapsedContent={(item) =>
    renderRaceCollapsedContent(item, originalRace)
  }
  renderExpandedContent={(item) =>
    renderRaceExpandedContent(item, originalRace)
  }
  renderLeftControls={(item) => renderRaceLeftControls(item)}
/>
```

### After (Slot-Based)

```tsx
<GenericAccordionCard isExpanded={isExpanded} onToggle={onToggle}>
  <AccordionLeftControls>
    <AddToBuildSwitchSimple itemId={item.id} itemType="race" />
  </AccordionLeftControls>

  <AccordionHeader>
    <H3>{item.name}</H3>
  </AccordionHeader>

  <AccordionCollapsedContentSlot>
    <p>{item.summary}</p>
  </AccordionCollapsedContentSlot>

  <AccordionExpandedContentSlot>
    <p>{item.description}</p>
  </AccordionExpandedContentSlot>
</GenericAccordionCard>
```

## Benefits

1. **Cleaner API** - No render callbacks or complex generics
2. **Better Readability** - Content structure is visible in JSX
3. **Type Safety** - No generic type parameters needed
4. **Flexibility** - Easy to add/remove sections
5. **Consistency** - Follows established patterns (Dialog, etc.)
6. **Maintainability** - Easier to understand and modify

This pattern makes the accordion component much more intuitive and easier to use while maintaining all the flexibility of the render callback approach.
