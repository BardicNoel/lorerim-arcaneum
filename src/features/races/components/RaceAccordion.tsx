import { cn } from '@/lib/utils'
import { AccordionCard } from '@/shared/components/generic/AccordionCard'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { Badge } from '@/shared/ui/ui/badge'
import { H3, P } from '@/shared/ui/ui/typography'
import { AttributeProgressBars } from './AttributeProgressBars'
import { RaceAvatar } from './RaceAvatar'
import type { Race } from '../types'

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
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {showToggle && (
              <AddToBuildSwitchSimple
                itemId={originalRace?.edid || item.id}
                itemType="race"
                itemName={item.name}
              />
            )}
            <RaceAvatar raceName={item.name} size="md" />
            <H3 className="text-primary font-semibold">{item.name}</H3>
          </div>
          <div className="flex items-center gap-3">
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
      </AccordionCard.Header>
      <AccordionCard.Summary>
        <div className="line-clamp-2">
          <P className="text-sm text-muted-foreground">
            {item.summary || item.description}
          </P>
        </div>
      </AccordionCard.Summary>
      <AccordionCard.Details>
        {/* Full Description */}
        <div>
          <P className="text-sm text-muted-foreground leading-relaxed">
            {item.description}
          </P>
        </div>
        {/* Starting Attributes */}
        {originalRace?.startingStats && (
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">
              Starting Attributes
            </h5>
            <AttributeProgressBars
              health={originalRace.startingStats.health}
              stamina={originalRace.startingStats.stamina}
              magicka={originalRace.startingStats.magicka}
              showTitle={false}
            />
            {/* Carry Weight - shown separately since it's not part of the progress bars */}
            <div className="mt-3 p-3 rounded-lg border bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="font-medium">Carry Weight</span>
                <span className="font-bold text-green-600">
                  {originalRace.startingStats.carryWeight}
                </span>
              </div>
            </div>
          </div>
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
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">Quirks</h5>
            <div className="space-y-2">
              {originalRace.racialSpells.map((spell, index) => (
                <div
                  key={index}
                  className="p-3 bg-muted/50 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      className="h-4 w-4 text-yellow-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 17.75L18.2 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.44 4.73L5.8 21z"
                      />
                    </svg>
                    <span className="font-medium text-sm">{spell.name}</span>
                  </div>
                  <div className="border-t border-border my-2" />
                  <div className="text-sm text-muted-foreground">
                    {spell.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </AccordionCard.Details>
    </AccordionCard>
  )
}
