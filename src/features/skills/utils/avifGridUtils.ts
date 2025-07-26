import type { Position } from '../types'

export interface GridConfig {
  cellWidth: number
  cellHeight: number
  nodeWidth: number
  nodeHeight: number
  padding: number
  gridGap: number
}

export interface GridBounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export interface CanvasPosition {
  x: number
  y: number
  gridX: number
  gridY: number
  horizontal: number
  vertical: number
}

export interface ConnectionPoint {
  x: number
  y: number
}

/**
 * Calculate grid bounds from a collection of positions
 */
export function calculateGridBounds(positions: Position[]): GridBounds {
  if (positions.length === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  }

  return positions.reduce(
    (bounds, pos) => ({
      minX: Math.min(bounds.minX, pos.x),
      maxX: Math.max(bounds.maxX, pos.x),
      minY: Math.min(bounds.minY, pos.y),
      maxY: Math.max(bounds.maxY, pos.y),
    }),
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
  )
}

/**
 * Convert AVIF grid coordinates to canvas pixel coordinates
 */
export function avifToCanvasPosition(
  position: Position,
  bounds: GridBounds,
  config: GridConfig
): CanvasPosition {
  const { x: gridX, y: gridY, horizontal, vertical } = position

  // Calculate base position (center of grid cell)
  const baseX =
    (gridX - bounds.minX) * config.cellWidth +
    (gridX - bounds.minX) * config.gridGap +
    config.padding +
    config.cellWidth / 2

  const baseY =
    (gridY - bounds.minY) * config.cellHeight +
    (gridY - bounds.minY) * config.gridGap +
    config.padding +
    config.cellHeight / 2

  // Apply sub-cell offset using Horizontal/Vertical values
  const offsetX = horizontal * (config.cellWidth / 2 - config.nodeWidth / 2)
  const offsetY = vertical * (config.cellHeight / 2 - config.nodeHeight / 2)

  const finalX = baseX + offsetX
  const finalY = baseY + offsetY

  return {
    x: finalX,
    y: finalY,
    gridX,
    gridY,
    horizontal,
    vertical,
  }
}

/**
 * Calculate canvas dimensions needed for a grid
 */
export function calculateCanvasDimensions(
  bounds: GridBounds,
  config: GridConfig
): { width: number; height: number } {
  const gridWidth = bounds.maxX - bounds.minX + 1
  const gridHeight = bounds.maxY - bounds.minY + 1

  const width =
    gridWidth * config.cellWidth +
    (gridWidth - 1) * config.gridGap +
    2 * config.padding

  const height =
    gridHeight * config.cellHeight +
    (gridHeight - 1) * config.gridGap +
    2 * config.padding

  return { width, height }
}

/**
 * Calculate connection point on the edge of a node closest to another node
 */
export function calculateConnectionPoint(
  from: CanvasPosition,
  to: CanvasPosition,
  config: GridConfig
): ConnectionPoint {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const angle = Math.atan2(dy, dx)

  const xOffset = (config.nodeWidth / 2) * Math.cos(angle)
  const yOffset = (config.nodeHeight / 2) * Math.sin(angle)

  return {
    x: from.x + xOffset,
    y: from.y + yOffset,
  }
}

/**
 * Check if a point is inside a node rectangle
 */
export function isPointInNode(
  point: { x: number; y: number },
  node: CanvasPosition,
  config: GridConfig
): boolean {
  return (
    point.x >= node.x &&
    point.x <= node.x + config.nodeWidth &&
    point.y >= node.y &&
    point.y <= node.y + config.nodeHeight
  )
}

/**
 * Convert canvas coordinates to grid coordinates
 */
export function canvasToGridPosition(
  canvasX: number,
  canvasY: number,
  bounds: GridBounds,
  config: GridConfig
): { gridX: number; gridY: number } | null {
  // Remove padding offset
  const adjustedX = canvasX - config.padding
  const adjustedY = canvasY - config.padding

  // Calculate grid position
  const gridX = Math.floor(adjustedX / (config.cellWidth + config.gridGap))
  const gridY = Math.floor(adjustedY / (config.cellHeight + config.gridGap))

  // Check if within bounds
  if (
    gridX >= bounds.minX &&
    gridX <= bounds.maxX &&
    gridY >= bounds.minY &&
    gridY <= bounds.maxY
  ) {
    return { gridX, gridY }
  }

  return null
}

/**
 * Calculate sub-cell offset from canvas position
 */
export function calculateSubCellOffset(
  canvasX: number,
  canvasY: number,
  gridX: number,
  gridY: number,
  bounds: GridBounds,
  config: GridConfig
): { horizontal: number; vertical: number } {
  // Calculate base position for this grid cell
  const baseX =
    (gridX - bounds.minX) * config.cellWidth +
    (gridX - bounds.minX) * config.gridGap +
    config.padding +
    config.cellWidth / 2

  const baseY =
    (gridY - bounds.minY) * config.cellHeight +
    (gridY - bounds.minY) * config.gridGap +
    config.padding +
    config.cellHeight / 2

  // Calculate offset from base position
  const offsetX = canvasX - baseX
  const offsetY = canvasY - baseY

  // Convert to normalized sub-cell coordinates
  const maxOffsetX = config.cellWidth / 2 - config.nodeWidth / 2
  const maxOffsetY = config.cellHeight / 2 - config.nodeHeight / 2

  const horizontal = Math.max(-1, Math.min(1, offsetX / maxOffsetX))
  const vertical = Math.max(-1, Math.min(1, offsetY / maxOffsetY))

  return { horizontal, vertical }
}

/**
 * Default grid configuration
 */
export const DEFAULT_GRID_CONFIG: GridConfig = {
  cellWidth: 200,
  cellHeight: 120,
  nodeWidth: 140,
  nodeHeight: 80,
  padding: 50,
  gridGap: 20,
}

/**
 * Compact grid configuration for dense layouts
 */
export const COMPACT_GRID_CONFIG: GridConfig = {
  cellWidth: 160,
  cellHeight: 100,
  nodeWidth: 120,
  nodeHeight: 70,
  padding: 30,
  gridGap: 15,
}

/**
 * Spacious grid configuration for clear layouts
 */
export const SPACIOUS_GRID_CONFIG: GridConfig = {
  cellWidth: 250,
  cellHeight: 150,
  nodeWidth: 160,
  nodeHeight: 90,
  padding: 75,
  gridGap: 30,
}
