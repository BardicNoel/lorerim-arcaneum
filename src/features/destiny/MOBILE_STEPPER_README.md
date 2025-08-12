# Destiny Mobile Stepper Implementation

## Overview

The Destiny Mobile Stepper is a responsive, step-by-step interface for building destiny paths on mobile devices. It replaces the hover-heavy desktop interface with a tap-first approach optimized for touch interactions.

## Features

### Core Functionality
- **Step-by-step progression**: Users select from available choices at each step
- **Path overview**: Jump to any previous step to change direction
- **Details view**: Comprehensive information about each destiny node
- **Completion state**: Clear indication when a path is complete
- **URL state management**: Shareable and undoable paths

### Responsive Design
- **Mobile (< 1024px)**: Full stepper interface with bottom sheets
- **Desktop (≥ 1024px)**: Traditional breadcrumb-based path builder
- **Automatic switching**: Based on screen size using `useMediaQuery`

## Component Architecture

### Main Components
- `DestinyMobileStepper`: Main orchestrator component
- `DestinyResponsivePathBuilder`: Responsive wrapper that switches between mobile/desktop
- `DestinyStepperHeader`: Navigation header with progress indicator
- `DestinyCurrentStepCard`: Shows the currently selected step
- `DestinyChoiceCard`: Displays available choices with select button
- `DestinyBottomStepperBar`: Bottom navigation controls
- `DestinyPathOverviewSheet`: Full-screen path overview
- `DestinyDetailsSheet`: Detailed node information
- `DestinyCompletionCard`: Completion state with actions

### State Management
- `useDestinyStepperStore`: Zustand store for stepper state
- `PathStep`: Interface for step data structure
- URL synchronization for shareable paths

## Usage

### Basic Implementation
```tsx
import { DestinyResponsivePathBuilder } from '@/features/destiny'

function MyPage() {
  return (
    <DestinyResponsivePathBuilder
      onPathChange={(path) => console.log('Path changed:', path)}
      onPathComplete={(path) => console.log('Path complete:', path)}
    />
  )
}
```

### Mobile-Only Implementation
```tsx
import { DestinyMobileStepper } from '@/features/destiny'

function MobilePage() {
  return <DestinyMobileStepper />
}
```

## State Structure

```typescript
interface PathStep {
  id: string
  name: string
  summary: string
  meta: Record<string, any>
  node: DestinyNode
}

interface DestinyStepperStore {
  steps: PathStep[]
  currentIndex: number
  nextChoices: DestinyNode[]
  
  selectChoice: (choiceId: string) => void
  jumpTo: (index: number) => void
  clear: () => void
  setNextChoices: (choices: DestinyNode[]) => void
  hydrateFromQuery: (query: string) => void
  toQuery: () => string
}
```

## User Flow

1. **Start**: User sees available root nodes
2. **Select**: User taps a choice to add to path
3. **Progress**: Next choices are computed based on prerequisites
4. **Details**: User can view comprehensive node information
5. **Navigate**: User can jump back to any previous step
6. **Complete**: Path is complete when no more choices available
7. **Share**: Path can be shared via URL

## Accessibility

- **Touch targets**: Minimum 44px for all interactive elements
- **Screen reader**: ARIA labels and semantic HTML
- **Keyboard navigation**: Full keyboard support
- **Focus management**: Proper focus handling in sheets/dialogs

## Performance

- **Virtualization**: Long lists are virtualized
- **Preloading**: Details preloaded for visible choices
- **Transitions**: Smooth 200-250ms transitions
- **Debouncing**: URL updates debounced to 150ms

## Future Enhancements

- [ ] Advanced filtering in choice cards
- [ ] Path comparison features
- [ ] Offline support
- [ ] Advanced sharing options
- [ ] Path templates/presets
- [ ] Analytics and usage tracking
