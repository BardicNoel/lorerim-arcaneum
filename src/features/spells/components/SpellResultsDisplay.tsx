import type { SpellWithComputed } from '../types'
import { SpellGrid, SpellList, SpellAccordion } from './composition'

interface SpellResultsDisplayProps {
  spells: SpellWithComputed[]
  viewMode: 'grid' | 'list' | 'accordion'
  onSpellSelect?: (spell: SpellWithComputed) => void
  className?: string
}

export function SpellResultsDisplay({ 
  spells, 
  viewMode, 
  onSpellSelect, 
  className = '' 
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
          showEffects={true}
          showTags={true}
          columns={3}
          onSpellSelect={onSpellSelect}
        />
      )}
      
      {viewMode === 'list' && (
        <SpellList 
          spells={spells} 
          variant="default"
          showEffects={true}
          showTags={true}
          onSpellSelect={onSpellSelect}
        />
      )}
      
      {viewMode === 'accordion' && (
        <SpellAccordion 
          spells={spells} 
          groupBy="school"
          variant="default"
          showEffects={true}
          showTags={true}
          onSpellSelect={onSpellSelect}
        />
      )}
    </div>
  )
}