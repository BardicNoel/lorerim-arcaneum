# ReligionCard Migration Guide

## Overview

The ReligionCard component has been refactored to follow the RaceCard pattern, providing a more compact, scan-friendly design that's consistent across desktop and mobile devices.

## Key Changes

### Before (ReligionAccordion)

- Stacked text layout
- Expandable accordion design
- Long paragraphs visible in collapsed state
- Inconsistent spacing and typography

### After (ReligionCard)

- Compact card layout with clear sections
- Icon-forward design with religion avatars
- Consistent spacing, typography, and hover effects
- Details moved to a separate sheet component

## Component Structure

### ReligionCard Sections

1. **Header Row**
   - Religion avatar (32-40px circle)
   - Religion name (truncated to 1 line)
   - Category badge (Divine, Daedric, Tribunal, Ancestor)
   - Enable/Track toggle

2. **Meta Row**
   - Effects pill (e.g., "● 3 effects")
   - Favored races chips (max 2 inline + overflow)

3. **Key Ability Row**
   - Blessing summary (single line)
   - Icon + short description

4. **Tenets Row**
   - Tenet chips (up to 4 visible + overflow)
   - Tooltip on hover/long-press

5. **Actions Row**
   - "Details" button (opens sheet)
   - Optional "View All" button

### ReligionSheet

- Full religion details in a side panel
- Scrollable content with sticky header
- Sections: Hero, Blessing, Favored Races, Tenets, Boons

## Usage

### Basic ReligionCard

```tsx
import {
  ReligionCard,
  ReligionSheet,
} from '@/features/religions/components/composition'
import { mapSharedReligionToFeatureReligion } from '@/features/religions/utils/religionMapper'

function MyComponent() {
  const [selectedReligion, setSelectedReligion] = useState(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleOpenDetails = (id: string) => {
    // Find religion by id and open sheet
    setSelectedReligion(religion)
    setIsSheetOpen(true)
  }

  return (
    <div>
      <ReligionCard
        originalReligion={religion}
        onOpenDetails={handleOpenDetails}
        showToggle={true}
      />
      <ReligionSheet
        religion={selectedReligion}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </div>
  )
}
```

### Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {religions.map(religion => (
    <ReligionCard
      key={religion.name}
      originalReligion={religion}
      onOpenDetails={handleOpenDetails}
      showToggle={true}
      className="h-full"
    />
  ))}
</div>
```

### List Layout

```tsx
<div className="space-y-4">
  {religions.map(religion => (
    <ReligionCard
      key={religion.name}
      originalReligion={religion}
      onOpenDetails={handleOpenDetails}
      showToggle={true}
      className="w-full"
    />
  ))}
</div>
```

## Data Mapping

The `religionMapper.ts` utility provides functions to convert between data formats:

```tsx
import { mapSharedReligionToFeatureReligion } from '@/features/religions/utils/religionMapper'

// Convert shared Religion to feature Religion
const featureReligion = mapSharedReligionToFeatureReligion(sharedReligion)

// Map to card format (if needed)
const cardData = mapReligionToCardFormat(featureReligion)
```

## Shared Components

The ReligionCard uses several shared components:

- **EntityAvatar**: Generic avatar component for religions
- **CategoryBadge**: Generic category badges with religion-specific styling
- **AddToBuildSwitchSimple**: Toggle component for tracking religions

## Styling

### Category Colors

- **Divine**: Purple (`bg-purple-100 text-purple-800`)
- **Daedric**: Red (`bg-red-100 text-red-800`)
- **Tribunal**: Blue (`bg-blue-100 text-blue-800`)
- **Ancestor**: Orange (`bg-orange-100 text-orange-800`)

### Consistent Tokens

- Card radius: `rounded-2xl`
- Padding: `p-4`
- Gap: `gap-3`
- Typography: Title `text-lg/semibold`, secondary `text-sm`, chips `text-xs`

## Migration Checklist

- [x] Create ReligionAvatar component
- [x] Create ReligionCategoryBadge component
- [x] Update CategoryBadge with religion categories
- [x] Create ReligionCard component
- [x] Create ReligionSheet component
- [x] Create religion mapper utilities
- [x] Update ReligionSearchCard to use new components
- [x] Create demo page
- [x] Add documentation

## Benefits

1. **Consistency**: Matches RaceCard pattern for unified UX
2. **Performance**: Faster scanning with compact layout
3. **Mobile-friendly**: Better touch targets and responsive design
4. **Accessibility**: Improved keyboard navigation and screen reader support
5. **Maintainability**: Uses shared components and consistent patterns

## Future Enhancements

- Add religion-specific icons for different categories
- Implement religion avatar assets
- Add filtering by favored races
- Add comparison functionality
- Add favorite/bookmark functionality
