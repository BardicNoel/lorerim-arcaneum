import React from 'react'
import { DestinyPossiblePathItem } from '../atomic/DestinyPossiblePathItem'
import { useDestinyNodes } from '../../adapters/useDestinyNodes'
import type { DestinyNode } from '../../types'

interface PredictivePath {
  path: DestinyNode[]
  isComplete: boolean
  endNode: DestinyNode
}

interface DestinyPossiblePathsListProps {
  possiblePaths: PredictivePath[]
  selectedPathLength: number
  onPathClick: (path: DestinyNode[], clickedIndex: number) => void
  variant?: 'default' | 'compact'
  className?: string
}

export function DestinyPossiblePathsList({
  possiblePaths,
  selectedPathLength,
  onPathClick,
  variant = 'default',
  className = '',
}: DestinyPossiblePathsListProps) {
  const { nodes } = useDestinyNodes()

  if (possiblePaths.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-muted-foreground">
          No possible paths available.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          You may have reached the end of available destiny paths.
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {possiblePaths.map((predictivePath, pathIndex) => (
        <DestinyPossiblePathItem
          key={pathIndex}
          path={predictivePath.path}
          allNodes={nodes}
          selectedPathLength={selectedPathLength}
          isComplete={predictivePath.isComplete}
          endNode={predictivePath.endNode}
          onPathClick={onPathClick}
          variant={variant}
        />
      ))}
    </div>
  )
} 