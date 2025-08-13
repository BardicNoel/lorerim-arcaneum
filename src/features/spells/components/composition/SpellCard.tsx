import { Card } from '@/shared/ui/ui/card'
import { H3, Small } from '@/shared/ui/ui/typography'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'
import type { SpellWithComputed } from '../../types'
import {
  SpellSchoolIcon,
  SpellSchoolBadge,
  SpellLevelBadge,
  SpellCostBadge,
} from '../atomic'

interface SpellCardProps {
  spell: SpellWithComputed
  onClick?: () => void
  className?: string
  // Context-specific properties
  compact?: boolean
}

export function SpellCard({
  spell,
  onClick,
  className,
  compact = false,
}: SpellCardProps) {
  return (
    <Card 
      className={cn(
        "p-6 cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      onClick={onClick}
    >
      {/* Header: Icon + Name + Badges */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <SpellSchoolIcon school={spell.school} size="2xl" />
          <div className="flex flex-col gap-2">
            <H3 className="text-foreground font-semibold">{spell.name}</H3>
            {/* School, Level, and Cost badges */}
            <div className="flex items-center gap-2">
              <SpellSchoolBadge school={spell.school} size="sm" />
              <SpellLevelBadge level={spell.level} size="sm" />
              <SpellCostBadge cost={spell.magickaCost} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Effects: Always visible */}
      {spell.effects && spell.effects.length > 0 && (
        <div>
          <Small className="text-muted-foreground mb-2">Effects</Small>
          <div className="space-y-2">
            {spell.effects.map((effect, index) => (
              <div
                key={index}
                className="p-2 rounded bg-muted border text-sm"
              >
                <div className="text-muted-foreground">
                  {effect.description}
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                  {effect.magnitude > 0 && (
                    <span>Magnitude: {effect.magnitude}</span>
                  )}
                  {effect.duration > 0 && (
                    <span>Duration: {effect.duration}s</span>
                  )}
                  {effect.area > 0 && <span>Area: {effect.area}ft</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
