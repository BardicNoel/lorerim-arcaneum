import type { PerkTree } from '../types'

export interface SavedNodePosition {
  perkId: string
  x: number
  y: number
  gridX: number
  gridY: number
  horizontal: number
  vertical: number
}

export interface SavedTreePositions {
  treeId: string
  treeName: string
  positions: SavedNodePosition[]
  version: string
  createdAt: string
  updatedAt: string
}

/**
 * Save node positions to a JSON file
 */
export function saveTreePositions(
  tree: PerkTree,
  positions: Map<
    string,
    {
      x: number
      y: number
      gridX: number
      gridY: number
      horizontal: number
      vertical: number
    }
  >
): SavedTreePositions {
  const savedPositions: SavedNodePosition[] = Array.from(
    positions.entries()
  ).map(([perkId, pos]) => ({
    perkId,
    x: pos.x,
    y: pos.y,
    gridX: pos.gridX,
    gridY: pos.gridY,
    horizontal: pos.horizontal,
    vertical: pos.vertical,
  }))

  return {
    treeId: tree.treeId,
    treeName: tree.treeName,
    positions: savedPositions,
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Load node positions from a JSON file
 */
export function loadTreePositions(
  treeId: string,
  savedData: SavedTreePositions
): Map<
  string,
  {
    x: number
    y: number
    gridX: number
    gridY: number
    horizontal: number
    vertical: number
  }
> {
  const positions = new Map<
    string,
    {
      x: number
      y: number
      gridX: number
      gridY: number
      horizontal: number
      vertical: number
    }
  >()

  savedData.positions.forEach(pos => {
    positions.set(pos.perkId, {
      x: pos.x,
      y: pos.y,
      gridX: pos.gridX,
      gridY: pos.gridY,
      horizontal: pos.horizontal,
      vertical: pos.vertical,
    })
  })

  return positions
}

/**
 * Download positions as JSON file
 */
export function downloadPositionsAsJson(data: SavedTreePositions): void {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${data.treeId}-positions.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Convert AVIF position to saved position format
 */
export function avifPositionToSaved(
  perkId: string,
  position: {
    x: number
    y: number
    gridX: number
    gridY: number
    horizontal: number
    vertical: number
  }
): SavedNodePosition {
  return {
    perkId,
    x: position.x,
    y: position.y,
    gridX: position.gridX,
    gridY: position.gridY,
    horizontal: position.horizontal,
    vertical: position.vertical,
  }
}

/**
 * Convert saved position back to AVIF format
 */
export function savedPositionToAvif(saved: SavedNodePosition): {
  x: number
  y: number
  gridX: number
  gridY: number
  horizontal: number
  vertical: number
} {
  return {
    x: saved.x,
    y: saved.y,
    gridX: saved.gridX,
    gridY: saved.gridY,
    horizontal: saved.horizontal,
    vertical: saved.vertical,
  }
}
