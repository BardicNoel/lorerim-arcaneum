import { SpellAccordionCard } from '../atomic/SpellAccordionCard'
import type { SpellWithComputed } from '../../types'

interface SpellGridProps {
  spells: SpellWithComputed[]
  variant?: 'default' | 'compact' | 'detailed'
  showEffects?: boolean
  showTags?: boolean
  columns?: 1 | 2 | 3 | 4
  className?: string
  expandedCards?: Set<string>
  onToggleExpansion?: (spellId: string) => void
}

const gridColumns = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
}

export function SpellGrid({ 
  spells, 
  variant = 'default',
  showEffects = true,
  showTags = true,
  columns = 3,
  className = '',
  expandedCards = new Set(),
  onToggleExpansion
}: SpellGridProps) {
  if (spells.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No spells found</p>
      </div>
    )
  }

  return (
    <div className={`grid gap-4 ${gridColumns[columns]} ${className}`}>
      {spells.map((spell) => (
        <SpellAccordionCard
          key={spell.editorId}
          spell={spell}
          isExpanded={expandedCards.has(spell.editorId)}
          onToggle={() => onToggleExpansion?.(spell.editorId)}
        />
      ))}
    </div>
  )
} 