# SkillCard Component

A reusable card component for displaying and managing skill levels in the Skyrim-themed Lorerim Arcaneum application using **inline pill controls** for discrete, mutually exclusive actions.

## Features

- **Small raised cards** with modern styling similar to Customize UI Toggles
- **Inline pill controls** for Major/Minor/Clear actions (no state cycling)
- **Build limits enforcement** with tooltips for disabled states
- **Visual theming** with gold trim for majors, silver for minors, and standard for none
- **Category icons** and badges for easy identification
- **Responsive design** with compact mode support
- **Customizable display** options for categories and abbreviations

## Usage

```tsx
import { SkillCard } from '@/shared/components/ui'
import type { SkillLevel } from '@/shared/components/ui'

const [skillLevels, setSkillLevels] = useState<Record<string, SkillLevel>>({
  OneHanded: 'major',
  Destruction: 'minor',
  Sneak: 'none',
})

const majorCount = Object.values(skillLevels).filter(
  level => level === 'major'
).length
const minorCount = Object.values(skillLevels).filter(
  level => level === 'minor'
).length

const handleSkillLevelChange = (skillId: string, level: SkillLevel) => {
  setSkillLevels(prev => ({
    ...prev,
    [skillId]: level,
  }))
}

;<SkillCard
  skill={skill}
  skillLevel={skillLevels[skill.edid] || 'none'}
  onSkillLevelChange={handleSkillLevelChange}
  majorCount={majorCount}
  minorCount={minorCount}
  maxMajors={3}
  maxMinors={3}
  showCategory={true}
  showAbbreviation={true}
  compact={false}
/>
```

## Props

| Prop                 | Type                                           | Default | Description                             |
| -------------------- | ---------------------------------------------- | ------- | --------------------------------------- |
| `skill`              | `Skill`                                        | -       | The skill data object                   |
| `skillLevel`         | `'major' \| 'minor' \| 'none'`                 | -       | Current skill level                     |
| `onSkillLevelChange` | `(skillId: string, level: SkillLevel) => void` | -       | Callback when skill level changes       |
| `majorCount`         | `number`                                       | `0`     | Current number of major skills assigned |
| `minorCount`         | `number`                                       | `0`     | Current number of minor skills assigned |
| `maxMajors`          | `number`                                       | `3`     | Maximum allowed major skills            |
| `maxMinors`          | `number`                                       | `3`     | Maximum allowed minor skills            |
| `className`          | `string`                                       | -       | Additional CSS classes                  |
| `showCategory`       | `boolean`                                      | `true`  | Show category badge                     |
| `showAbbreviation`   | `boolean`                                      | `true`  | Show skill abbreviation                 |
| `compact`            | `boolean`                                      | `false` | Use compact styling                     |

## Inline Pill Controls

### Button Types

- **+ Major**: Gold outline, fills gold when active
- **+ Minor**: Silver outline, fills silver when active
- **⨉ Clear**: Ghost button, only visible when skill is assigned

### Interaction Rules

- **Mutually Exclusive**: Skills can only be Major OR Minor, not both
- **Build Limits**: Buttons disable when limits reached (3 Majors, 3 Minors)
- **Tooltips**: Show "Max X Major/Minor skills" when disabled
- **Clear Action**: Removes skill completely from build

### Visual States

- **Active Major**: Gold fill with dark text
- **Active Minor**: Silver fill with white text
- **Inactive**: Outline style with hover effects
- **Disabled**: Grayed out with tooltip explanation

## Visual Styling

### Skill Levels

- **Major**: Gold border and background with `skyrim-gold` theming
- **Minor**: Silver/gray border and background with subtle styling
- **None**: Standard border with hover effects

### Category Icons

- ⚔️ Combat (red theme)
- 🔮 Magic (blue theme)
- 🗡️ Stealth (green theme)
- ⭐ Default for unknown categories

### Responsive Design

- **Standard mode**: Full padding and category display
- **Compact mode**: Reduced padding, optional category hiding
- **Grid layout**: Works with CSS Grid for organized display

## Build Limits Integration

The component integrates with build management systems:

```tsx
// Example: Build limits counter
<div className="flex gap-6 p-4 rounded-lg border bg-muted/30">
  <div className="text-center">
    <div className="text-lg font-bold text-skyrim-gold">
      {majorCount}/{maxMajors}
    </div>
    <div className="text-sm text-muted-foreground">Major Skills</div>
  </div>
  <div className="text-center">
    <div className="text-lg font-bold text-gray-600">
      {minorCount}/{maxMinors}
    </div>
    <div className="text-sm text-muted-foreground">Minor Skills</div>
  </div>
</div>
```

## Integration

The component integrates seamlessly with:

- **Build Management**: Automatic limit enforcement
- **Character Build System**: Direct skill level management
- **Search and Filter**: For skill discovery
- **Responsive Layouts**: CSS Grid and Flexbox support

## Demo

Visit `/skill-card-demo` to see the component in action with:

- Build limits enforcement
- Tooltip explanations
- Different display configurations
- Real-time skill level management

## Accessibility

- Full keyboard navigation support
- Screen reader compatible with proper ARIA labels
- Tooltip accessibility for disabled states
- High contrast color schemes
- Focus management for pill buttons
