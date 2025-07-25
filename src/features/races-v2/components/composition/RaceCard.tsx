import React from 'react'
import { cn } from '@/lib/utils'
import { GenericAccordionCard } from '@/shared/components/generic'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { Button } from '@/shared/ui/ui/button'
import { H3, P } from '@/shared/ui/ui/typography'
import { ExternalLink, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Race } from '../../types'
import { RaceAvatar, CategoryBadge } from '../atomic'
import { RaceStatsDisplay } from './RaceStatsDisplay'
import { RaceEffectsDisplay } from './RaceEffectsDisplay'
import { RaceKeywordsDisplay } from './RaceKeywordsDisplay'

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
            <CategoryBadge 
              category={displayCategory as 'Human' | 'Elf' | 'Beast'} 
              size="sm" 
            />
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
              description: spell.description
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