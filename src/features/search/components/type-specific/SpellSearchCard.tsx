import React from 'react'
import type { SearchableItem } from '../../model/SearchModel'
import type { SpellWithComputed } from '@/features/spells/types'
import { SpellAccordionCard } from '@/features/spells/components/atomic/SpellAccordionCard'
import { SpellGrid } from '@/features/spells/components/composition/SpellGrid'
import { SpellList } from '@/features/spells/components/composition/SpellList'
import type { ViewMode } from '../../model/TypeSpecificComponents'

interface SpellSearchCardProps {
  item: SearchableItem
  className?: string
  isExpanded?: boolean
  onToggle?: () => void
  viewMode?: 'grid' | 'list' | ViewMode
}

export const SpellSearchCard: React.FC<SpellSearchCardProps> = ({
  item,
  className,
  isExpanded = false,
  onToggle,
  viewMode = 'card',
}) => {
  console.log('SpellSearchCard props:', { isExpanded, onToggle: !!onToggle, viewMode })
  const spellData = item.originalData as SpellWithComputed

  if (!spellData) {
    return (
      <div className="p-4 border rounded-lg bg-muted">
        <h3 className="font-semibold">Spell not found</h3>
        <p className="text-sm text-muted-foreground">{item.name}</p>
      </div>
    )
  }

  // For grid and list views, we need to render the full component
  if (viewMode === 'grid') {
    return (
      <SpellGrid
        spells={[spellData]}
        variant="default"
        columns={1}
        className="w-full"
      />
    )
  }

  if (viewMode === 'list') {
    return (
      <SpellList
        spells={[spellData]}
        variant="default"
        className="w-full"
      />
    )
  }

  // For card, accordion, and compact views, use the accordion card
  const handleToggle = () => {
    console.log('SpellSearchCard handleToggle called, isExpanded:', isExpanded)
    onToggle?.()
  }

  return (
    <SpellAccordionCard
      spell={spellData}
      isExpanded={isExpanded}
      onToggle={handleToggle}
      className={className}
    />
  )
} 