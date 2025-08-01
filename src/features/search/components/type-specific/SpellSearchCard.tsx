import React from 'react'
import type { SearchableItem } from '../../model/SearchModel'
import type { SpellWithComputed } from '@/features/spells/types'
import { SpellAccordionCard } from '@/features/spells/components/atomic/SpellAccordionCard'
import type { ViewMode } from '../../model/TypeSpecificComponents'

interface SpellSearchCardProps {
  item: SearchableItem
  className?: string
  isExpanded?: boolean
  onToggle?: () => void
  viewMode?: 'grid' | 'list' | 'masonry' | ViewMode
}

export const SpellSearchCard: React.FC<SpellSearchCardProps> = ({
  item,
  className,
  isExpanded = false,
  onToggle,
  viewMode = 'card',
}) => {
  const spellData = item.originalData as SpellWithComputed

  if (!spellData) {
    console.warn('SpellSearchCard: Missing spell data for item:', item)
    return (
      <div className="p-4 border rounded-lg bg-muted">
        <h3 className="font-semibold">Spell not found</h3>
        <p className="text-sm text-muted-foreground">{item.name}</p>
      </div>
    )
  }

  // Validate spell data structure
  if (!spellData.name || !spellData.editorId) {
    console.warn('SpellSearchCard: Invalid spell data structure:', spellData)
    return (
      <div className="p-4 border rounded-lg bg-muted">
        <h3 className="font-semibold">Invalid spell data</h3>
        <p className="text-sm text-muted-foreground">{item.name}</p>
      </div>
    )
  }

  // For all view modes, use the same SpellAccordionCard component
  // This ensures consistent behavior and detailed content across all views
  const handleToggle = React.useCallback(() => {
    if (onToggle) {
      onToggle()
    }
  }, [onToggle])

  return (
    <SpellAccordionCard
      spell={spellData}
      isExpanded={isExpanded}
      onToggle={handleToggle}
      className={className}
    />
  )
} 