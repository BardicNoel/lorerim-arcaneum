import type { SpellWithComputed } from '../types'
import { SpellGrid, SpellList } from './composition'

interface SpellResultsDisplayProps {
  spells: SpellWithComputed[]
  viewMode: 'grid' | 'list'
  onSpellSelect?: (spell: SpellWithComputed) => void
  className?: string
  expandedCards?: Set<string>
  onToggleExpansion?: (spellId: string) => void
}

export function SpellResultsDisplay({ 
  spells, 
  viewMode, 
  onSpellSelect, 
  className = '',
  expandedCards = new Set(),
  onToggleExpansion
}: SpellResultsDisplayProps) {
  if (spells.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground">
          No spells found matching your criteria.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search or filters.
        </p>
      </div>
    )
  }
  
  return (
    <div className={className}>
      {viewMode === 'grid' && (
        <SpellGrid 
          spells={spells} 
          variant="default"
          columns={3}
          onSpellSelect={onSpellSelect}
          expandedCards={expandedCards}
          onToggleExpansion={onToggleExpansion}
        />
      )}
      
      {viewMode === 'list' && (
        <SpellList 
          spells={spells} 
          variant="default"
          onSpellSelect={onSpellSelect}
          expandedCards={expandedCards}
          onToggleExpansion={onToggleExpansion}
        />
      )}
    </div>
  )
}