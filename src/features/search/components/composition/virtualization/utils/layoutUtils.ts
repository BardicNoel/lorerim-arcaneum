import type { ColumnLayout, ItemPosition } from '../types/virtualization'

/**
 * Calculate responsive column count based on container width
 */
export function calculateResponsiveColumns(
  containerWidth: number,
  maxColumnWidth: number,
  defaultColumns: number
): number {
  if (maxColumnWidth && containerWidth > 0) {
    return Math.max(1, Math.floor(containerWidth / maxColumnWidth))
  }
  return defaultColumns
}

/**
 * Distribute items across columns for masonry layout
 */
export function distributeItemsAcrossColumns(
  totalItems: number,
  columns: number
): number[][] {
  const columnArrays: number[][] = Array.from({ length: columns }, () => [])
  
  for (let i = 0; i < totalItems; i++) {
    const columnIndex = i % columns
    columnArrays[columnIndex].push(i)
  }
  
  return columnArrays
}

/**
 * Calculate column heights based on item positions
 */
export function calculateColumnHeights(
  itemPositions: Map<string, ItemPosition>,
  columns: number
): ColumnLayout[] {
  const columnLayouts: ColumnLayout[] = Array.from(
    { length: columns },
    (_, index) => ({
      columnIndex: index,
      height: 0,
      items: []
    })
  )

  // Group items by column and calculate heights
  itemPositions.forEach((position, key) => {
    const column = columnLayouts[position.column]
    if (column) {
      column.items.push(position.index)
      column.height = Math.max(column.height, position.top + position.height)
    }
  })

  return columnLayouts
}

/**
 * Find the shortest column for optimal item placement
 */
export function findShortestColumn(columnLayouts: ColumnLayout[]): number {
  return columnLayouts.reduce(
    (shortest, current, index) =>
      current.height < columnLayouts[shortest].height ? index : shortest,
    0
  )
}

/**
 * Calculate item width based on columns and gap
 */
export function calculateItemWidth(
  containerWidth: number,
  columns: number,
  gap: number
): number {
  return (containerWidth - (columns - 1) * gap) / columns
}

/**
 * Calculate total container height for virtual scrolling
 */
export function calculateTotalHeight(columnLayouts: ColumnLayout[]): number {
  return Math.max(...columnLayouts.map(col => col.height), 0)
}

/**
 * Get column index for a given item index
 */
export function getColumnIndex(itemIndex: number, columns: number): number {
  return itemIndex % columns
}

/**
 * Calculate item position in masonry layout
 */
export function calculateItemPosition(
  itemIndex: number,
  columns: number,
  itemHeight: number,
  gap: number,
  columnHeights: number[]
): ItemPosition {
  const columnIndex = getColumnIndex(itemIndex, columns)
  const top = columnHeights[columnIndex] || 0
  
  return {
    top,
    height: itemHeight,
    column: columnIndex,
    index: itemIndex
  }
}

