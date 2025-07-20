# Birthsign Avatar System

## Overview

The birthsign avatar system provides consistent avatar display for birthsigns across the application, similar to how race avatars work. It uses the generic `EntityAvatar` component with fallback behavior.

## Components

### BirthsignAvatar

- **Location**: `src/features/birthsigns/components/BirthsignAvatar.tsx`
- **Purpose**: Birthsign-specific wrapper around the generic `EntityAvatar`
- **Usage**: `<BirthsignAvatar birthsignName="Apprentice" size="md" />`

### EntityAvatar

- **Location**: `src/shared/components/generic/EntityAvatar.tsx`
- **Purpose**: Generic avatar component that handles multiple entity types
- **Supports**: race, religion, trait, destiny, birthsign

## Avatar Mapping

### Current Birthsigns

The system currently supports 17 birthsigns:

1. **Warrior** - Warrior group
2. **Lady** - Warrior group
3. **Lord** - Warrior group
4. **Steed** - Warrior group
5. **Mage** - Mage group
6. **Apprentice** - Mage group ✅ (has avatar: `apprentice.svg`)
7. **Atronach** - Mage group
8. **Ritual** - Mage group
9. **Blessed Fire** - Mage group
10. **Dead Horde** - Mage group
11. **Thief** - Thief group
12. **Lover** - Thief group
13. **Shadow** - Thief group
14. **Moonshadow** - Thief group
15. **Tower** - Thief group
16. **Serpent** - Serpent group
17. **Serpent's Curse** - Serpent group

### Avatar Files

- **Location**: `public/assets/sign-avatar/`
- **Format**: SVG or PNG recommended
- **Naming**: Use the exact birthsign name (e.g., `apprentice.svg`)

## Fallback Behavior

When a birthsign doesn't have a corresponding avatar file:

1. The system displays a circular badge with the first letter of the birthsign name
2. Uses muted background and foreground colors
3. Maintains consistent sizing across all birthsigns

## Adding New Avatars

1. **Add the avatar file** to `public/assets/sign-avatar/`
2. **Update the mapping** in `EntityAvatar.tsx`:
   ```typescript
   birthsign: {
     Apprentice: 'apprentice.svg',
     Warrior: 'warrior.svg', // Add new mapping
     // ... other birthsigns
   }
   ```

## Usage in Components

### BirthsignCard

- Uses `BirthsignAvatar` in the card header
- Replaces the old emoji-based group icons

### BirthsignDetailPanel

- Uses `BirthsignAvatar` in the detail panel header
- Larger size (`lg`) for better visibility

### BirthsignAccordion

- Uses `BirthsignAvatar` in the accordion header
- Medium size (`md`) for consistent layout

## Benefits

1. **Consistency**: All birthsigns use the same avatar system
2. **Scalability**: Easy to add new avatars
3. **Fallback**: Graceful degradation when avatars are missing
4. **Maintainability**: Centralized avatar management
5. **Performance**: Lazy loading and error handling built-in
