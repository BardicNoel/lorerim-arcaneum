# 📄 Technical Specification: Upward-Branching Perk Tree Layout Engine

## 🎯 Objective

Transform Skyrim **PERK records** (with Position and Connection data) into a clean, non-overlapping layout suitable for React Flow visualization. The tree layout grows **upward** from roots at the bottom.

## 📦 Input Data Model

```ts
type PerkRecord = {
  edid: string
  name: string
  position: {
    x: number // X grid + offset
    y: number // Y grid + offset
    horizontal: number
    vertical: number
  }
  connection: {
    parents: string[]
    children: string[]
  }
}
```

## 📦 Output Data Model

```ts
type LayoutNode = {
  id: string
  x: number // Canvas X position (px)
  y: number // Canvas Y position (px)
  width: number // Computed from name length + padding
  height: number // Fixed height
  originalX: number // Grid-mapped X before forces
  originalY: number // Grid-mapped Y before forces
}
```

## 🪜 Functional Pipeline

### 1️⃣ Measure Node Sizes

```ts
function measureNodeSizes(
  perks: PerkRecord[],
  font: string,
  textPadding: number
): Map<string, number>
```

- Calculates `textWidth + textPadding` per perk name.
- Returns `Map<edid, width>`.
- **Pure**: can mock text width in tests.

### 2️⃣ Scale Positions (Grid → Canvas)

```ts
function scalePositions(
  perks: PerkRecord[],
  sizes: Map<string, number>,
  config: LayoutConfig
): LayoutNode[]
```

For each perk:

```
canvasX = position.x * gridScaleX
canvasY = (maxY - position.y) * gridScaleY
```

- Inverts Y so roots appear at bottom.

### 3️⃣ Build Tree Map

```ts
function buildTreeMap(perks: PerkRecord[]): Map<string, string[]> // parent EDID → children EDIDs
```

Builds explicit parent → children mapping from `connection.children`.

### 4️⃣ Parent-Centering Layout

```ts
function centerSubtrees(
  nodes: LayoutNode[],
  tree: Map<string, string[]>,
  config: LayoutConfig
): LayoutNode[]
```

- Recursively centers parent nodes under their child subtrees.

### 5️⃣ Force-Field Collision Resolver

```ts
function resolveCollisions(
  nodes: LayoutNode[],
  config: LayoutConfig
): LayoutNode[]
```

- Detects overlapping nodes and pushes them apart.
- Gently pulls nodes back toward original grid positions.

### 6️⃣ Final Row Alignment

```ts
function snapYToGrid(nodes: LayoutNode[], config: LayoutConfig): LayoutNode[]
```

Snaps Y positions to multiples of `gridScaleY` for neat rows.

### 📦 Full Layout Function

```ts
function layoutPerkTree(perks: PerkRecord[], config: LayoutConfig): LayoutNode[]
```

Pipeline:

```
measureNodeSizes
→ scalePositions
→ buildTreeMap
→ centerSubtrees
→ resolveCollisions
→ snapYToGrid
```

## 🔥 Functional Design Principles

✅ Pure functions (no mutation)  
✅ Deterministic outputs for same inputs  
✅ Fully unit testable  
✅ Composable stages

## 🧪 Testable Properties

- Roots are at lowest Y (canvas bottom)
- Parent X is within min/max X of children
- No overlaps after collision resolution
- Children Y are above parent (spacing by gridScaleY)

## 📖 Summary

This design produces an upward-branching, Skyrim-style perk tree layout:

- Roots at bottom
- Branches growing upward
- Supports variable-width nodes
- Ready for React Flow visualization
