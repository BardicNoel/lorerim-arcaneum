import React from 'react'
import { SpellGrid } from '@/features/spells/components/composition/SpellGrid'
import type { SearchResult } from '../../model/SearchModel'
import type { SpellWithComputed } from '@/features/spells/types'

interface SpellGridWrapperProps {
  results: SearchResult[]
  className?: string
}

export const SpellGridWrapper: React.FC<SpellGridWrapperProps> = ({ 
  results, 
  className = '' 
}) => {
  // Extract spell data from search results
  const spells: SpellWithComputed[] = results
    .map(result => result.item.originalData as SpellWithComputed)
    .filter(Boolean)

  if (spells.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground">No spells found</p>
      </div>
    )
  }

  return (
    <SpellGrid
      spells={spells}
      variant="default"
      columns={3}
      className={className}
    />
  )
} 