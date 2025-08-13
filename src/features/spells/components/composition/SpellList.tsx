import { SpellCard } from './SpellCard'
import type { SpellWithComputed } from '../../types'

interface SpellListProps {
  spells: SpellWithComputed[]
  variant?: 'default' | 'compact' | 'detailed'
  showEffects?: boolean
  showTags?: boolean
  className?: string
  expandedCards?: Set<string>
  onToggleExpansion?: (spellId: string) => void
  onSpellClick?: (spell: SpellWithComputed) => void
}

export function SpellList({ 
  spells, 
  variant = 'default',
  showEffects = true,
  showTags = true,
  className = '',
  expandedCards = new Set(),
  onToggleExpansion,
  onSpellClick
}: SpellListProps) {
  if (spells.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No spells found</p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {spells.map((spell, index) => (
        <SpellCard
          key={`${spell.name}-${spell.editorId}-${index}`}
          spell={spell}
          isExpanded={expandedCards.has(`${spell.name}-${spell.editorId}-${index}`)}
          onToggle={() => onToggleExpansion?.(`${spell.name}-${spell.editorId}-${index}`)}
          onClick={() => onSpellClick?.(spell)}
          compact={variant === 'compact'}
        />
      ))}
    </div>
  )
} 