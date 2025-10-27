import { cn } from '@/lib/utils'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { Card } from '@/shared/ui/ui/card'
import { H3 } from '@/shared/ui/ui/typography'
import { getGameTextFormattingOptions } from '@/shared/utils/gameTextFormatting'
import type { SpellWithComputed } from '../../types'
import {
  SpellCostBadge,
  SpellLevelBadge,
  SpellSchoolBadge,
  SpellSchoolIcon,
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
        'p-6 cursor-pointer hover:shadow-md transition-shadow h-full',
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

      {/* Spell Message */}
      {spell.message && (
        <div className="mt-4">
          <FormattedText
            text={spell.message}
            options={getGameTextFormattingOptions()}
            className="text-base text-muted-foreground"
          />
        </div>
      )}
    </Card>
  )
}
