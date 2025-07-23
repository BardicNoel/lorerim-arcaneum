import React from 'react'
import { DestinyNodeCard } from './DestinyNodeCard'
import { useDestinyNodes } from '../../adapters/useDestinyNodes'
import type { DestinyNode } from '../../types'

interface DestinyNodeGridProps {
  variant?: 'default' | 'compact' | 'detailed'
  showPrerequisites?: boolean
  showNextNodes?: boolean
  filterByTags?: string[]
  searchTerm?: string
  sortBy?: 'name' | 'category' | 'prerequisites'
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function DestinyNodeGrid({
  variant = 'default',
  showPrerequisites = false,
  showNextNodes = false,
  filterByTags = [],
  searchTerm = '',
  sortBy = 'name',
  columns = 3,
  className = '',
}: DestinyNodeGridProps) {
  const {
    nodes,
    filteredNodes,
    isLoading,
    error,
  } = useDestinyNodes({
    filterByTags,
    searchTerm,
    sortBy,
  })

  const getGridColumns = () => {
    switch (columns) {
      case 1: return 'grid-cols-1'
      case 2: return 'grid-cols-1 sm:grid-cols-2'
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    }
  }

  if (isLoading) {
    return (
      <div className={`grid gap-4 ${getGridColumns()} ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse"
          >
            <div className="h-32 bg-muted rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-4 text-center ${className}`}>
        <p className="text-destructive">Error loading destiny nodes: {error}</p>
      </div>
    )
  }

  if (filteredNodes.length === 0) {
    return (
      <div className={`p-4 text-center ${className}`}>
        <p className="text-muted-foreground">
          {searchTerm || filterByTags.length > 0
            ? 'No destiny nodes match your filters.'
            : 'No destiny nodes available.'}
        </p>
      </div>
    )
  }

  return (
    <div className={`grid gap-4 ${getGridColumns()} ${className}`}>
      {filteredNodes.map((node) => (
        <DestinyNodeCard
          key={node.id}
          node={node}
          variant={variant}
          showPrerequisites={showPrerequisites}
          showNextNodes={showNextNodes}
          allNodes={nodes}
        />
      ))}
    </div>
  )
} 