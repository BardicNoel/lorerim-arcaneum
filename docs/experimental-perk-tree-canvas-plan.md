# 🧪 Experimental Perk Tree Canvas - AVIF Grid System

## 📋 Overview

This document outlines the experimental implementation of a new perk tree visualization system that uses the AVIF coordinate system (`X`, `Y`, `Horizontal`, `Vertical`) instead of the current React Flow-based automatic layout algorithm.

## 🎯 Goals

1. **Direct AVIF Coordinate Usage**: Use the exact positioning data from AVIF without algorithmic interpretation
2. **Grid-Based Layout**: Implement a logical grid system that respects the original design intent
3. **Experimental Canvas**: Create a separate implementation that doesn't interfere with existing functionality
4. **Performance**: Explore potential performance benefits of canvas-based rendering vs React Flow
5. **Customization**: Enable fine-grained control over node positioning and connections

## 🏗️ Architecture

### Core Components

1. **PerkTreeCanvasExperimental** (`src/features/skills/components/view/PerkTreeCanvasExperimental.tsx`)
   - HTML5 Canvas-based rendering
   - AVIF coordinate system implementation
   - Custom connection point calculation
   - Click interaction handling

2. **SkillsPageExperimental** (`src/features/skills/pages/SkillsPageExperimental.tsx`)
   - Experimental page wrapper
   - Debug information display
   - Same data flow as existing SkillsPage

### Grid System

```typescript
interface GridConfig {
  cellWidth: number // Width of each grid cell (200px)
  cellHeight: number // Height of each grid cell (120px)
  nodeWidth: number // Width of perk nodes (140px)
  nodeHeight: number // Height of perk nodes (80px)
  padding: number // Canvas padding (50px)
  gridGap: number // Gap between grid cells (20px)
}
```

### Positioning Algorithm

```typescript
// Base position (center of grid cell)
const baseX =
  (gridX - minX) * cellWidth +
  (gridX - minX) * gridGap +
  padding +
  cellWidth / 2
const baseY =
  (gridY - minY) * cellHeight +
  (gridY - minY) * gridGap +
  padding +
  cellHeight / 2

// Sub-cell offset using Horizontal/Vertical values
const offsetX = horizontal * (cellWidth / 2 - nodeWidth / 2)
const offsetY = vertical * (cellHeight / 2 - nodeHeight / 2)

// Final position
const finalX = baseX + offsetX
const finalY = baseY + offsetY
```

## 🔗 Connection System

### Edge Connection Points

The system calculates optimal connection points using trigonometry:

```typescript
const getConnectionPoint = (from: NodePosition, to: NodePosition): Point => {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const angle = Math.atan2(dy, dx)

  const xOffset = (nodeWidth / 2) * Math.cos(angle)
  const yOffset = (nodeHeight / 2) * Math.sin(angle)

  return {
    x: from.x + xOffset,
    y: from.y + yOffset,
  }
}
```

This ensures connections originate/terminate at the edge of nodes closest to the connected node.

## 🎨 Rendering Features

### Visual Elements

1. **Nodes**: Rectangular perk nodes with:
   - Background color (selected/unselected states)
   - Border styling
   - Perk name text (truncated if too long)
   - Rank display for selected perks
   - Grid coordinates for debugging

2. **Connections**: Golden lines connecting parent-child relationships
   - Proper edge-to-edge connection points
   - Consistent styling with existing system

3. **Grid Background**: Optional grid lines for debugging (low opacity)

### Interaction

- **Click to Select**: Click on nodes to toggle selection
- **Canvas Scaling**: Automatic canvas sizing based on content
- **Scroll Support**: Container supports scrolling for large trees

## 🧪 Testing & Validation

### Test Cases

1. **Coordinate Accuracy**: Verify nodes appear at correct AVIF coordinates
2. **Connection Integrity**: Ensure all parent-child relationships are properly connected
3. **Selection State**: Test perk selection/deselection functionality
4. **Rank Display**: Verify rank information shows correctly
5. **Performance**: Compare rendering performance with React Flow

### Debug Features

- Grid coordinate display on each node
- Debug information panel showing:
  - Selected skill and tree name
  - Perk counts (total, selected, available)
  - Sample position data
- Visual grid overlay (optional)

## 🚀 Implementation Status

### ✅ Completed

- [x] Basic canvas implementation
- [x] AVIF coordinate positioning system
- [x] Connection point calculation
- [x] Node rendering with selection states
- [x] Click interaction handling
- [x] Experimental page integration
- [x] Router configuration (`/skills-experimental`)

### 🔄 In Progress

- [ ] Performance optimization
- [ ] Enhanced visual styling
- [ ] Zoom and pan functionality
- [ ] Accessibility improvements

### 📋 Planned

- [ ] Grid customization controls
- [ ] Export functionality
- [ ] Animation support
- [ ] Mobile responsiveness
- [ ] Advanced interaction modes

## 🔧 Configuration Options

### Grid Customization

The system supports easy customization through the `GridConfig` interface:

```typescript
const CUSTOM_GRID_CONFIG: GridConfig = {
  cellWidth: 250, // Larger cells for more spacing
  cellHeight: 150, // Taller cells
  nodeWidth: 160, // Larger nodes
  nodeHeight: 90, // Taller nodes
  padding: 75, // More padding
  gridGap: 30, // Larger gaps
}
```

### Visual Customization

- Node colors and styling
- Connection line styles
- Text formatting
- Background patterns

## 📊 Comparison with Existing System

| Feature           | React Flow (Current)     | Canvas Experimental          |
| ----------------- | ------------------------ | ---------------------------- |
| **Positioning**   | Algorithmic layout       | Direct AVIF coordinates      |
| **Performance**   | React component overhead | Direct canvas rendering      |
| **Customization** | Limited by React Flow    | Full control                 |
| **Dependencies**  | React Flow library       | Native canvas API            |
| **File Size**     | Larger bundle            | Smaller bundle               |
| **Interactivity** | Built-in drag/zoom       | Custom implementation needed |
| **Accessibility** | Built-in support         | Manual implementation needed |

## 🎯 Next Steps

1. **Performance Testing**: Benchmark against existing React Flow implementation
2. **User Testing**: Gather feedback on visual clarity and usability
3. **Feature Parity**: Implement missing features (zoom, pan, accessibility)
4. **Integration Decision**: Decide whether to replace or complement existing system
5. **Documentation**: Create comprehensive usage documentation

## 🔗 Related Files

- **Implementation**: `src/features/skills/components/view/PerkTreeCanvasExperimental.tsx`
- **Page**: `src/features/skills/pages/SkillsPageExperimental.tsx`
- **Router**: `src/app/router.tsx` (route: `/skills-experimental`)
- **Design Spec**: `.temp/perk-graph-grid-design.mdc`

## 🎨 Usage

To test the experimental canvas:

1. Navigate to `/skills-experimental`
2. Select a skill from the accordion
3. Observe the perk tree rendered using AVIF coordinates
4. Click nodes to test selection functionality
5. Review debug information for coordinate validation

The experimental system provides a foundation for exploring alternative perk tree visualization approaches while maintaining full compatibility with existing data structures and user workflows.
