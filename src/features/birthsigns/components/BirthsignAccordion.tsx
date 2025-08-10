import { cn } from '@/lib/utils'
import { AccordionCard } from '@/shared/components/generic/AccordionCard'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { Badge } from '@/shared/ui/ui/badge'
import { H3 } from '@/shared/ui/ui/typography'
import { Star } from 'lucide-react'
import { getBirthsignGroupStyle } from '../config/birthsignConfig'
import type { Birthsign } from '../types'
import { BirthsignAvatar } from './BirthsignAvatar'

interface BirthsignAccordionProps {
  item: PlayerCreationItem & { originalBirthsign: Birthsign }
  className?: string
  showAddToBuild?: boolean
  isExpanded?: boolean
  onToggle?: () => void
  disableHover?: boolean
}

export function BirthsignAccordion({
  item,
  className,
  showAddToBuild = true,
  isExpanded = false,
  onToggle,
  disableHover = false,
}: BirthsignAccordionProps) {
  const originalBirthsign = item.originalBirthsign
  if (!originalBirthsign) return null

  return (
    <AccordionCard
      className={className}
      expanded={isExpanded}
      onToggle={onToggle}
      disableHover={disableHover}
    >
      <AccordionCard.Header>
        {showAddToBuild && (
          <AddToBuildSwitchSimple
            itemId={item.id}
            itemType="stone"
            itemName={item.name}
          />
        )}
        <BirthsignAvatar birthsignName={originalBirthsign.name} size="2xl" />
        <H3 className="text-primary font-semibold">{originalBirthsign.name}</H3>
        <div className="flex items-center gap-3 ml-auto">
          {originalBirthsign.group && (
            <Badge
              variant="outline"
              className={cn(
                getBirthsignGroupStyle(originalBirthsign.group) ||
                  'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
                'text-xs font-medium transition-colors'
              )}
            >
              {originalBirthsign.group}
            </Badge>
          )}
        </div>
      </AccordionCard.Header>
      <AccordionCard.Summary>
        <FormattedText
          text={originalBirthsign.description}
          className="text-base text-muted-foreground"
        />
      </AccordionCard.Summary>
      <AccordionCard.Details>
        {/* Stat Modifications */}
        {originalBirthsign.stat_modifications.length > 0 && (
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">
              Stat Modifications
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {originalBirthsign.stat_modifications.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                >
                  <span className="font-medium capitalize">{stat.stat}</span>
                  <span
                    className={cn(
                      'font-bold',
                      stat.type === 'bonus' ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {stat.type === 'bonus' ? '+' : '-'}
                    {stat.value}
                    {stat.value_type === 'percentage' ? '%' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Powers */}
        {originalBirthsign.powers.length > 0 && (
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">Powers</h5>
            <div className="space-y-2">
              {originalBirthsign.powers.map((power, index) => (
                <div
                  key={index}
                  className="p-3 bg-muted/50 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-sm">{power.name}</span>
                  </div>
                  <div className="border-t border-border my-2" />
                  <FormattedText
                    text={power.description}
                    className="text-sm text-muted-foreground"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Skill Bonuses */}
        {originalBirthsign.skill_bonuses.length > 0 && (
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">
              Skill Bonuses
            </h5>
            <div className="space-y-2">
              {originalBirthsign.skill_bonuses.map((bonus, index) => (
                <div
                  key={index}
                  className="p-2 rounded bg-muted border text-sm flex items-center justify-between"
                >
                  <span className="font-medium">
                    {bonus.stat} +{bonus.value}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    Starting Bonus
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Special Effects (Conditional/Mastery) */}
        {(originalBirthsign.conditional_effects?.length > 0 ||
          originalBirthsign.mastery_effects?.length > 0) && (
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">
              Special Effects
            </h5>
            <div className="space-y-3">
              {originalBirthsign.conditional_effects?.map((effect, index) => (
                <div
                  key={`conditional-${index}`}
                  className="p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      Conditional Effect
                    </span>
                  </div>
                  <div className="border-t border-border my-2" />
                  <div className="text-sm font-medium">{effect.stat}</div>
                  <FormattedText
                    text={effect.description}
                    className="text-sm text-muted-foreground"
                  />
                </div>
              ))}
              {originalBirthsign.mastery_effects?.map((effect, index) => (
                <div
                  key={`mastery-${index}`}
                  className="p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-sm">Mastery Effect</span>
                  </div>
                  <div className="border-t border-border my-2" />
                  <div className="text-sm font-medium">{effect.stat}</div>
                  <FormattedText
                    text={effect.description}
                    className="text-sm text-muted-foreground"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </AccordionCard.Details>
    </AccordionCard>
  )
}
