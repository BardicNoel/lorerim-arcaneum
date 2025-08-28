import React from 'react'
import { cn } from '@/lib/utils'
import { H5 } from '@/shared/ui/ui/typography'
import { Badge } from '@/shared/ui/ui/badge'
import { extractUnperkedAbilities } from '../../utils/raceToPlayerCreationItem'
import type { Race } from '../../types'

interface RaceUnperkedAbilitiesDisplayProps {
  race: Race
  title?: string
  className?: string
  showCount?: boolean
}

export function RaceUnperkedAbilitiesDisplay({
  race,
  title = 'Unperked Abilities',
  className,
  showCount = true,
}: RaceUnperkedAbilitiesDisplayProps) {
  const unperkedAbilities = extractUnperkedAbilities(race)

  if (!unperkedAbilities || unperkedAbilities.length === 0) return null

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        {title && <H5 className="text-lg font-medium text-foreground">{title}</H5>}
        {showCount && (
          <span className="text-xs text-muted-foreground">
            {unperkedAbilities.length} {unperkedAbilities.length === 1 ? 'ability' : 'abilities'}
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        {unperkedAbilities.map((ability, index) => (
          <div
            key={index}
            className="p-3 rounded-lg bg-muted/50 border flex items-center justify-between"
          >
            <span className="font-medium">{ability}</span>
            <Badge variant="secondary" className="text-xs">
              Unperked
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
