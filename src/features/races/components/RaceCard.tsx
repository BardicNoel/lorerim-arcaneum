import { cn } from '@/lib/utils'
import { GenericAccordionCard } from '@/shared/components/generic'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { H3, P } from '@/shared/ui/ui/typography'
import { ExternalLink, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Race } from '../types'
import { RaceAvatar } from './RaceAvatar'

interface RaceCardProps {
  item?: PlayerCreationItem
  originalRace?: Race
  isExpanded?: boolean
  onToggle?: () => void
  className?: string
  // Context-specific properties
  showViewAllButton?: boolean
  showToggle?: boolean
  viewAllButtonText?: string
  viewAllButtonRoute?: string
}

export function RaceCard({
  item,
  originalRace,
  isExpanded = false,
  onToggle,
  className,
  showViewAllButton = false,
  showToggle = true,
  viewAllButtonText = 'View All',
  viewAllButtonRoute = '/race',
}: RaceCardProps) {
  const navigate = useNavigate()

  const handleNavigateToRacePage = () => {
    navigate(viewAllButtonRoute)
  }

  // Use originalRace data if item is not provided
  const displayName = item?.name || originalRace?.name || 'Unknown Race'
  const displayDescription =
    item?.description || originalRace?.description || ''
  const displayCategory = item?.category || originalRace?.category || ''
  const displayEffects = item?.effects || []
  const displaySummary = item?.summary || originalRace?.description || ''

  return (
    <GenericAccordionCard
      isExpanded={isExpanded}
      onToggle={onToggle || (() => {})}
      className={className}
    >
      {/* Left Controls */}
      <div className="flex items-center gap-3">
        {showToggle && (
          <AddToBuildSwitchSimple
            itemId={originalRace?.edid || item?.id || ''}
            itemType="race"
            itemName={displayName}
          />
        )}
      </div>

      {/* Header Content */}
      <div className="flex items-center gap-3">
        {/* Left side: Avatar + Name */}
        <div className="flex items-center gap-3">
          <RaceAvatar raceName={displayName} size="md" />
          <H3 className="text-primary font-semibold">{displayName}</H3>
        </div>

        {/* Right side: Classification + Effects + Optional View All Button */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Race type tag */}
          {displayCategory && (
            <Badge
              variant="outline"
              className={cn(
                'bg-skyrim-gold/10 text-skyrim-gold border-skyrim-gold/30 hover:bg-skyrim-gold/20',
                'text-xs font-medium transition-colors'
              )}
            >
              {displayCategory}
            </Badge>
          )}

          {/* Quick effects preview */}
          {displayEffects && displayEffects.length > 0 && (
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span>{displayEffects.length} effects</span>
              </div>
            </div>
          )}

          {/* Optional View All Button */}
          {showViewAllButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleNavigateToRacePage}
              className="text-xs"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              {viewAllButtonText}
            </Button>
          )}
        </div>
      </div>

      {/* Collapsed Content */}
      <div className="space-y-3">
        {/* Description */}
        <div className="line-clamp-2">
          <P className="text-sm text-muted-foreground">{displaySummary}</P>
        </div>

        {/* Quick effects */}
        <div className="flex flex-wrap gap-2">
          {displayEffects?.slice(0, 2).map((effect, index) => (
            <div
              key={index}
              className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded text-xs"
              title={effect.description}
            >
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="font-medium">{effect.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Content */}
      <div className="space-y-4">
        {/* Description */}
        <div>
          <P className="text-sm text-muted-foreground leading-relaxed">
            {displayDescription}
          </P>
        </div>

        {/* Race Stats */}
        {originalRace?.startingStats && (
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">
              Starting Stats
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span className="text-sm text-muted-foreground">Health</span>
                <span className="font-medium">
                  {originalRace.startingStats.health}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span className="text-sm text-muted-foreground">Magicka</span>
                <span className="font-medium">
                  {originalRace.startingStats.magicka}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span className="text-sm text-muted-foreground">Stamina</span>
                <span className="font-medium">
                  {originalRace.startingStats.stamina}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span className="text-sm text-muted-foreground">
                  Carry Weight
                </span>
                <span className="font-medium">
                  {originalRace.startingStats.carryWeight}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Regeneration Stats */}
        {originalRace?.regeneration && (
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">
              Regeneration
            </h5>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-medium">Health</div>
                <div className="text-muted-foreground">
                  {originalRace.regeneration.health.base}/s
                </div>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-medium">Magicka</div>
                <div className="text-muted-foreground">
                  {originalRace.regeneration.magicka.base}/s
                </div>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-medium">Stamina</div>
                <div className="text-muted-foreground">
                  {originalRace.regeneration.stamina.base}/s
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Combat Stats */}
        {originalRace?.combat && (
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">Combat</h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-medium">Unarmed Damage</div>
                <div className="text-muted-foreground">
                  {originalRace.combat.unarmedDamage}
                </div>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-medium">Unarmed Reach</div>
                <div className="text-muted-foreground">
                  {originalRace.combat.unarmedReach}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Racial Spells */}
        {originalRace?.racialSpells && originalRace.racialSpells.length > 0 && (
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">
              Racial Abilities
            </h5>
            <div className="space-y-2">
              {originalRace.racialSpells.map((spell, index) => (
                <div
                  key={index}
                  className="p-2 rounded bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800 text-sm"
                >
                  <div className="font-medium">{spell.name}</div>
                  <div className="text-muted-foreground">
                    {spell.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skill Bonuses */}
        {originalRace?.skillBonuses && originalRace.skillBonuses.length > 0 && (
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">
              Skill Bonuses
            </h5>
            <div className="space-y-2">
              {originalRace.skillBonuses.map((bonus, index) => (
                <div
                  key={index}
                  className="p-2 rounded bg-muted border text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {bonus.skill} +{bonus.bonus}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      Starting Bonus
                    </Badge>
                  </div>
                  <div className="text-muted-foreground">
                    Starting bonus to {bonus.skill}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </GenericAccordionCard>
  )
}
