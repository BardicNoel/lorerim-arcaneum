import { SpellItem } from '../atomic/SpellItem'
import type { SpellWithComputed } from '../../types'

interface SpellGridProps {
  spells: SpellWithComputed[]
  variant?: 'default' | 'compact' | 'detailed'
  showEffects?: boolean
  showTags?: boolean
  columns?: 1 | 2 | 3 | 4
  className?: string
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
  className = ''
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