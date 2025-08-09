import { ResponsivePanel } from '@/shared/components/generic/ResponsivePanel'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import { Badge } from '@/shared/ui/ui/badge'
import { H3 } from '@/shared/ui/ui/typography'
import type { Race } from '../../types'
import { CategoryBadge, RaceAvatar } from '../atomic'
import { RaceEffectsDisplay, RaceKeywordsDisplay, RaceStatsDisplay } from './'

interface RaceDetailsSheetProps {
  race: Race | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function RaceDetailsSheet({
  race,
  isOpen,
  onOpenChange,
}: RaceDetailsSheetProps) {
  if (!race) return null

  return (
    <ResponsivePanel
      open={isOpen}
      onOpenChange={onOpenChange}
      side="right"
      className="w-[400px] sm:w-[700px] lg:w-[800px] max-w-[800px] p-0 overflow-y-auto bg-background"
    >
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-start gap-4">
            <RaceAvatar raceName={race.name} size="4xl" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{race.name}</h2>
              <div className="flex items-center gap-2 mb-2">
                <CategoryBadge
                  category={race.category as 'Human' | 'Elf' | 'Beast'}
                  size="sm"
                />
                <AddToBuildSwitchSimple
                  itemId={race.edid}
                  itemType="race"
                  itemName={race.name}
                />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {race.description}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Starting Stats */}
          {race.startingStats && (
            <div>
              <H3 className="text-lg font-semibold mb-3">Starting Stats</H3>
              <RaceStatsDisplay
                stats={race.startingStats}
                regeneration={race.regeneration}
                title=""
                compact={false}
              />
            </div>
          )}

          {/* Starting Skills */}
          {race.skillBonuses && race.skillBonuses.length > 0 && (
            <div>
              <H3 className="text-lg font-semibold mb-3">Starting Skills</H3>
              <div className="space-y-2">
                {race.skillBonuses.map((bonus, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-muted/50 border flex items-center justify-between"
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

          {/* Racial Abilities */}
          {race.racialSpells && race.racialSpells.length > 0 && (
            <div>
              <H3 className="text-lg font-semibold mb-3">Racial Abilities</H3>
              <RaceEffectsDisplay
                effects={race.racialSpells.map(spell => ({
                  name: spell.name,
                  description: spell.description,
                }))}
                title=""
                showDescriptions={true}
              />
            </div>
          )}

          {/* Keywords */}
          {race.keywords && race.keywords.length > 0 && (
            <div>
              <H3 className="text-lg font-semibold mb-3">Keywords</H3>
              <RaceKeywordsDisplay
                keywords={race.keywords.map(k => k.edid)}
                title=""
                maxDisplay={10}
              />
            </div>
          )}
        </div>
      </div>
    </ResponsivePanel>
  )
}
