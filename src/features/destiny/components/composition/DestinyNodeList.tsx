import React, { useState } from 'react'
import { DestinyListItem } from '../atomic/DestinyListItem'
import { useDestinyNodes } from '../../adapters/useDestinyNodes'
import type { DestinyNode } from '../../types'

interface DestinyNodeListProps {
  variant?: 'default' | 'compact'
  showPrerequisites?: boolean
  showNextNodes?: boolean
  filterByTags?: string[]
  searchTerm?: string
  sortBy?: 'name' | 'category' | 'prerequisites'
  className?: string
}

export function DestinyNodeList({
  variant = 'default',
  showPrerequisites = false,
  showNextNodes = false,
  filterByTags = [],
  searchTerm = '',
  sortBy = 'name',
  className = '',
}: DestinyNodeListProps) {
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

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse"
          >
            <div className="h-20 bg-muted rounded-lg" />
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
    <div className={`space-y-2 ${className}`}>
      {filteredNodes.map((node) => (
        <DestinyListItem
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