import { GenericAccordionCard } from '@/shared/components/generic'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { Button } from '@/shared/ui/ui/button'
import { H3, P } from '@/shared/ui/ui/typography'
import { ExternalLink, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Race } from '../../types'
import { CategoryBadge, RaceAvatar } from '../atomic'
import { RaceEffectsDisplay } from './RaceEffectsDisplay'
import { RaceKeywordsDisplay } from './RaceKeywordsDisplay'
import { RaceStatsDisplay } from './RaceStatsDisplay'

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
      {/* Header Content */}
      <div className="flex items-start justify-between">
        {/* Left side: Avatar + Name + Badge */}
        <div className="flex items-start gap-3">
          <RaceAvatar raceName={displayName} size="2xl" />
          <div className="flex flex-col gap-1">
            <H3 className="text-primary font-semibold">{displayName}</H3>
            {/* Race type tag */}
            {displayCategory && (
              <CategoryBadge
                category={displayCategory as 'Human' | 'Elf' | 'Beast'}
                size="sm"
              />
            )}
          </div>
        </div>

        {/* Right side: Switch + Effects + Optional View All Button */}
        <div className="flex items-center gap-3">
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

          {/* Switch */}
          {showToggle && (
            <AddToBuildSwitchSimple
              itemId={originalRace?.edid || item?.id || ''}
              itemType="race"
              itemName={displayName}
            />
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
        <RaceEffectsDisplay
          effects={displayEffects}
          maxDisplay={2}
          compact={true}
        />
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
          <RaceStatsDisplay
            stats={originalRace.startingStats}
            regeneration={originalRace.regeneration}
            title="Starting Stats"
          />
        )}

        {/* Race Effects */}
        {originalRace?.racialSpells && originalRace.racialSpells.length > 0 && (
          <RaceEffectsDisplay
            effects={originalRace.racialSpells.map(spell => ({
              name: spell.name,
              description: spell.description,
            }))}
            title="Racial Abilities"
          />
        )}

        {/* Race Keywords */}
        {originalRace?.keywords && originalRace.keywords.length > 0 && (
          <RaceKeywordsDisplay
            keywords={originalRace.keywords.map(k => k.edid)}
            title="Keywords"
          />
        )}
      </div>
    </GenericAccordionCard>
  )
}
