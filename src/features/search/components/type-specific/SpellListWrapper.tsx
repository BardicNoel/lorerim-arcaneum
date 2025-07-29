import React from 'react'
import { SpellList } from '@/features/spells/components/composition/SpellList'
import type { SearchResult } from '../../model/SearchModel'
import type { SpellWithComputed } from '@/features/spells/types'

interface SpellListWrapperProps {
  results: SearchResult[]
  className?: string
}

export const SpellListWrapper: React.FC<SpellListWrapperProps> = ({ 
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
    <SpellList
      spells={spells}
      variant="default"
      className={className}
    />
  )
} 