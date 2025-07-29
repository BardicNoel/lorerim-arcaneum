import React from 'react'
import type { SearchResult } from '../../model/SearchModel'
import type { SpellWithComputed } from '@/features/spells/types'
import { SpellAccordionCard } from '@/features/spells/components/atomic/SpellAccordionCard'

interface SpellSearchCardProps {
  result: SearchResult
  isSelected?: boolean
  onClick?: () => void
  compact?: boolean
}

export const SpellSearchCard: React.FC<SpellSearchCardProps> = ({
  result,
  isSelected,
  onClick,
  compact = false,
}) => {
  const spellData = result.item.originalData as SpellWithComputed

  if (!spellData) {
    return (
      <div className="p-4 border rounded-lg bg-muted">
        <h3 className="font-semibold">Spell not found</h3>
        <p className="text-sm text-muted-foreground">{result.item.name}</p>
      </div>
    )
  }

  return (
    <SpellAccordionCard
      spell={spellData}
      isExpanded={isSelected}
      onToggle={onClick}
      disableHover={compact}
      className={compact ? 'text-sm' : ''}
    />
  )
} 