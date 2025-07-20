# Unit of Work: Text Formatting Utility Extraction

## 📋 Overview

Extract the complex `FormattedText` component from `BirthsignAccordion` into a reusable shared utility that can be used across all features for consistent text formatting.

## 🎯 Objective

Create a performant, reusable text formatting utility that handles birthsign-specific formatting patterns while being generic enough for other features.

## 📊 Current Issues

- **100+ line FormattedText component** embedded in BirthsignAccordion
- **Complex regex operations** performed on every render
- **Hardcoded attribute/skill lists** not reusable
- **No memoization** of expensive parsing operations
- **Birthsign-specific logic** mixed with generic formatting

## 🔧 Proposed Changes

### 1. Create Shared Text Formatting Utility

#### `src/shared/utils/textFormatting.ts`

```typescript
export interface TextFormattingOptions {
  highlightBrackets?: boolean
  highlightAttributes?: boolean
  highlightSkills?: boolean
  highlightNumbers?: boolean
  customPatterns?: Array<{
    pattern: RegExp
    className: string
    transform?: (match: string) => string
  }>
}

export interface FormattedTextSegment {
  text: string
  className?: string
  key: string
}

export function parseFormattedText(
  text: string,
  options: TextFormattingOptions = {}
): FormattedTextSegment[] {
  // Implementation with memoization
}
```

#### `src/shared/utils/birthsignTextFormatting.ts`

```typescript
import {
  parseFormattedText,
  type TextFormattingOptions,
} from './textFormatting'

// Birthsign-specific configuration
const BIRTHSIGN_ATTRIBUTES = [
  'health',
  'magicka',
  'stamina',
  'health regeneration',
  'magicka regeneration',
  'stamina regeneration',
  // ... full list
] as const

const BIRTHSIGN_SKILLS = [
  'one-handed',
  'two-handed',
  'archery',
  'block',
  'heavy armor',
  'light armor',
  'smithing',
  'alchemy',
  // ... full list
] as const

const BIRTHSIGN_COMBAT_STATS = [
  'weapon damage',
  'armor rating',
  'armor penetration',
  'unarmed damage',
  'movement speed',
  'sprint speed',
  // ... full list
] as const

export function getBirthsignTextFormattingOptions(): TextFormattingOptions {
  return {
    highlightBrackets: true,
    highlightAttributes: true,
    highlightSkills: true,
    highlightNumbers: true,
    customPatterns: [
      {
        pattern: /<(\d+)>/g,
        className: 'font-bold italic text-skyrim-gold',
        transform: match => match.slice(1, -1), // Remove brackets
      },
      {
        pattern: new RegExp(`\\b(${BIRTHSIGN_ATTRIBUTES.join('|')})\\b`, 'gi'),
        className: 'font-semibold text-primary',
      },
      {
        pattern: new RegExp(`\\b(${BIRTHSIGN_SKILLS.join('|')})\\b`, 'gi'),
        className: 'font-semibold text-primary',
      },
      {
        pattern: /^[+-]?\d+(?:\.\d+)?%?$/,
        className: match => {
          const numericValue = parseFloat(match)
          const isPositive = match.startsWith('+') || numericValue > 0
          const isNegative = match.startsWith('-') || numericValue < 0

          if (isPositive) return 'font-bold text-green-600'
          if (isNegative) return 'font-bold text-red-600'
          return 'font-bold text-skyrim-gold'
        },
      },
    ],
  }
}
```

### 2. Create Reusable FormattedText Component

#### `src/shared/components/generic/FormattedText.tsx`

```typescript
import React, { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { parseFormattedText, type TextFormattingOptions } from '@/shared/utils/textFormatting'

interface FormattedTextProps {
  text: string
  options?: TextFormattingOptions
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function FormattedText({
  text,
  options,
  className = 'text-sm text-muted-foreground',
  as: Component = 'div',
}: FormattedTextProps) {
  const segments = useMemo(() => {
    if (!text) return []
    return parseFormattedText(text, options)
  }, [text, options])

  if (!text) return null

  return (
    <Component className={className}>
      {segments.map((segment) => (
        <span key={segment.key} className={segment.className}>
          {segment.text}
        </span>
      ))}
    </Component>
  )
}
```

### 3. Create Birthsign-Specific Wrapper

#### `src/features/birthsigns/components/BirthsignFormattedText.tsx`

```typescript
import React from 'react'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { getBirthsignTextFormattingOptions } from '@/shared/utils/birthsignTextFormatting'

interface BirthsignFormattedTextProps {
  text: string
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function BirthsignFormattedText({
  text,
  className,
  as,
}: BirthsignFormattedTextProps) {
  const options = useMemo(() => getBirthsignTextFormattingOptions(), [])

  return (
    <FormattedText
      text={text}
      options={options}
      className={className}
      as={as}
    />
  )
}
```

### 4. Update BirthsignAccordion

#### `src/features/birthsigns/components/BirthsignAccordion.tsx`

```typescript
// Remove the FormattedText component (100+ lines)
// Replace with:
import { BirthsignFormattedText } from './BirthsignFormattedText'

// Usage:
<BirthsignFormattedText
  text={parsedDescription}
  className="text-sm text-muted-foreground leading-relaxed"
/>
```

### 5. Create Generic Text Formatting Hooks

#### `src/shared/hooks/useTextFormatting.ts`

```typescript
import { useMemo } from 'react'
import {
  parseFormattedText,
  type TextFormattingOptions,
} from '@/shared/utils/textFormatting'

export function useTextFormatting(
  text: string,
  options?: TextFormattingOptions
) {
  return useMemo(() => {
    if (!text) return []
    return parseFormattedText(text, options)
  }, [text, options])
}
```

## 📁 Files to Create/Modify

### New Files

- `src/shared/utils/textFormatting.ts`
- `src/shared/utils/birthsignTextFormatting.ts`
- `src/shared/components/generic/FormattedText.tsx`
- `src/features/birthsigns/components/BirthsignFormattedText.tsx`
- `src/shared/hooks/useTextFormatting.ts`

### Modified Files

- `src/features/birthsigns/components/BirthsignAccordion.tsx` - Remove FormattedText component
- `src/shared/components/generic/index.ts` - Export FormattedText
- `src/features/birthsigns/components/index.ts` - Export BirthsignFormattedText

## 🧪 Testing Strategy

- Unit tests for text parsing logic
- Unit tests for birthsign-specific patterns
- Component tests for FormattedText
- Performance tests for memoization
- Integration tests for birthsign formatting

## 📈 Benefits

- **Reusability**: Text formatting can be used across all features
- **Performance**: Memoized parsing prevents unnecessary re-computations
- **Maintainability**: Centralized formatting logic
- **Consistency**: Uniform text formatting across the application
- **Extensibility**: Easy to add new formatting patterns

## ⚠️ Risks

- **Breaking Changes**: Existing text formatting behavior must be preserved
- **Performance**: Need to ensure memoization works correctly
- **Complexity**: Parsing logic can be complex to debug

## 🎯 Success Criteria

- [ ] FormattedText component extracted and working
- [ ] BirthsignAccordion reduced by 100+ lines
- [ ] Text formatting performance improved
- [ ] All existing formatting preserved
- [ ] Unit tests for all formatting logic
- [ ] Generic utility ready for other features

## 📅 Estimated Effort

- **Development**: 2 days
- **Testing**: 1 day
- **Total**: 3 days
