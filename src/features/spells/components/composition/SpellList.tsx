import { SpellItem } from '../atomic/SpellItem'
import type { SpellWithComputed } from '../../types'

interface SpellListProps {
  spells: SpellWithComputed[]
  variant?: 'default' | 'compact' | 'detailed'
  showEffects?: boolean
  showTags?: boolean
  className?: string
}

export function SpellList({ 
  spells, 
  variant = 'default',
  showEffects = true,
  showTags = true,
  className = ''
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
      {spells.map((spell) => (
        <SpellItem
          key={spell.editorId}
          spell={spell}
          variant={variant}
          showEffects={showEffects}
          showTags={showTags}
        />
      ))}
    </div>
  )
} 