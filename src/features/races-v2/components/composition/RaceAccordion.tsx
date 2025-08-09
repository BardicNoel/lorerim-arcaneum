import { cn } from '@/lib/utils'
import { AccordionCard } from '@/shared/components/generic/AccordionCard'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { Badge } from '@/shared/ui/ui/badge'
import { H3 } from '@/shared/ui/ui/typography'
import type { Race } from '../../types'
import { RaceAvatar } from '../atomic'
import { RaceEffectsDisplay } from './RaceEffectsDisplay'
import { RaceStatsDisplay } from './RaceStatsDisplay'

interface RaceAccordionProps {
  item: PlayerCreationItem & { originalRace: Race }
  className?: string
  showToggle?: boolean
  isExpanded?: boolean
  onToggle?: () => void
  disableHover?: boolean
}

export function RaceAccordion({
  item,
  className,
  showToggle = true,
  isExpanded = false,
  onToggle,
  disableHover = false,
}: RaceAccordionProps) {
  const originalRace = item.originalRace

  return (
    <AccordionCard
      className={className}
      expanded={isExpanded}
      onToggle={onToggle}
      disableHover={disableHover}
    >
      <AccordionCard.Header>
        <div className="flex items-start justify-between w-full">
          <div className="flex items-start gap-3">
            <RaceAvatar raceName={item.name} size="2xl" />
            <div className="flex flex-col gap-1">
              <H3 className="text-primary font-semibold">{item.name}</H3>
              {item.category && (
                <Badge
                  variant="outline"
                  className={cn(
                    'bg-skyrim-gold/10 text-skyrim-gold border-skyrim-gold/30 hover:bg-skyrim-gold/20',
                    'text-xs font-medium transition-colors'
                  )}
                >
                  {item.category}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {showToggle && (
              <AddToBuildSwitchSimple
                itemId={originalRace?.edid || item.id}
                itemType="race"
                itemName={item.name}
              />
            )}
          </div>
        </div>
      </AccordionCard.Header>

      <AccordionCard.Summary>
        <div className="line-clamp-2">
          <FormattedText
            text={item.summary || item.description}
            className="text-sm text-muted-foreground line-clamp-2"
          />
        </div>
      </AccordionCard.Summary>

      <AccordionCard.Details>
        {/* Full Description */}
        <div>
          <FormattedText
            text={item.description}
            className="text-sm text-muted-foreground leading-relaxed"
          />
        </div>

        {/* Starting Attributes */}
        {originalRace?.startingStats && (
          <RaceStatsDisplay
            stats={originalRace.startingStats}
            regeneration={originalRace.regeneration}
            title="Starting Attributes"
            showRegeneration={false}
            compact={false}
          />
        )}

        {/* Starting Skills */}
        {originalRace?.skillBonuses && originalRace.skillBonuses.length > 0 && (
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">
              Starting Skills
            </h5>
            <div className="space-y-2">
              {originalRace.skillBonuses.map((bonus, index) => (
                <div
                  key={index}
                  className="p-2 rounded bg-muted border text-sm flex items-center justify-between"
                >
                  <span className="font-medium">
                    {bonus.skill} +{bonus.bonus}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    Starting Bonus
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quirks (Racial Abilities) */}
        {originalRace?.racialSpells && originalRace.racialSpells.length > 0 && (
          <RaceEffectsDisplay
            effects={originalRace.racialSpells.map(spell => ({
              name: spell.name,
              description: spell.description,
            }))}
            title="Quirks"
            showDescriptions={true}
          />
        )}
      </AccordionCard.Details>
    </AccordionCard>
  )
}
