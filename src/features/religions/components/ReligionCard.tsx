import { cn } from '@/lib/utils'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import { Button } from '@/shared/ui/ui/button'
import { H3 } from '@/shared/ui/ui/typography'
import { ExternalLink, Heart, Shield, Star } from 'lucide-react'
import React, { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { Religion } from '../types'
import { ReligionAvatar, ReligionCategoryBadge } from './atomic'

interface ReligionCardProps {
  item?: PlayerCreationItem
  originalReligion?: Religion
  className?: string
  onClick?: () => void
  // Context-specific properties
  showViewAllButton?: boolean
  showToggle?: boolean
  viewAllButtonText?: string
  viewAllButtonRoute?: string
  onOpenDetails?: (id: string) => void
}

export function ReligionCard({
  item,
  originalReligion,
  className,
  onClick,
  showViewAllButton = false,
  showToggle = true,
  viewAllButtonText = 'View All',
  viewAllButtonRoute = '/religions',
  onOpenDetails,
}: ReligionCardProps) {
  const navigate = useNavigate()

  const handleNavigateToReligionPage = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(viewAllButtonRoute)
    // Scroll to top when navigating to religions page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onOpenDetails) {
      onOpenDetails(originalReligion?.name || item?.id || '')
    }
  }

  // Use originalReligion data if item is not provided
  const displayName = item?.name || originalReligion?.name || 'Unknown Religion'
  const displayDescription =
    item?.description || originalReligion?.tenet?.description || ''
  const displayCategory = item?.category || originalReligion?.type || ''
  const displayEffects = item?.effects || []
  const displaySummary =
    item?.summary || originalReligion?.tenet?.description || ''

  // Calculate effects count
  const effectsCount =
    (originalReligion?.blessing?.effects?.length || 0) +
    (originalReligion?.tenet?.effects?.length || 0) +
    (originalReligion?.boon1?.effects?.length || 0) +
    (originalReligion?.boon2?.effects?.length || 0)

  // Get blessing summary (memoized)
  const blessingSummary = useMemo(
    () => originalReligion?.blessing?.effects?.[0]?.effectName || 'Blessing',
    [originalReligion]
  )

  // Get tenets for chips
  const tenets = originalReligion?.tenet?.description
    ? originalReligion.tenet.description
        .split('.')
        .filter(sentence => sentence.trim().length > 0)
        .slice(0, 4)
        .map(tenet => ({
          id: tenet.trim(),
          title: tenet.trim(),
          short: tenet.trim(),
          full: tenet.trim(),
        }))
    : []

  return (
    <div
      className={cn(
        'p-4 border rounded-2xl bg-card hover:bg-accent/50 transition-colors cursor-pointer',
        'hover:shadow-md hover:border-primary/50 hover:scale-[1.02] transition-all duration-200',
        className
      )}
      onClick={e => {
        // Call the parent's onClick if provided
        if (onClick) {
          onClick()
        }
        // Also open details if onOpenDetails is provided
        if (onOpenDetails) {
          const id = originalReligion?.name || item?.id || ''
          onOpenDetails(id)
        }
      }}
    >
      {/* Header Row */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <ReligionAvatar religionName={displayName} size="2xl" />

        {/* Title and Category */}
        <div className="flex-1 min-w-0">
          <H3 className="text-lg font-semibold text-primary truncate">
            {displayName}
          </H3>
          {displayCategory && (
            <ReligionCategoryBadge
              category={displayCategory}
              size="sm"
              className="mt-1"
            />
          )}
        </div>

        {/* Toggle */}
        {showToggle && (
          <div onClick={e => e.stopPropagation()}>
            <AddToBuildSwitchSimple
              itemId={originalReligion?.name?.toLowerCase().replace(/\s+/g, '-') || item?.id || ''}
              itemType="religion"
              itemName={displayName}
            />
          </div>
        )}
      </div>

      {/* Meta Row */}
      <div className="flex items-center gap-2 mb-3">
        {/* Effects Pill */}
        {effectsCount > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-full text-xs">
            <Star className="h-3 w-3 text-yellow-500" />
            <span className="font-medium">{effectsCount} effects</span>
          </div>
        )}

        {/* Favored Races Chips */}
        {originalReligion?.favoredRaces &&
          originalReligion.favoredRaces.length > 0 && (
            <div className="flex items-center gap-1">
              {originalReligion.favoredRaces.slice(0, 2).map((race, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 bg-skyrim-gold/20 text-skyrim-gold border border-skyrim-gold/30 rounded-full text-xs font-medium"
                >
                  <Star className="h-3 w-3" />
                  {race}
                </div>
              ))}
              {originalReligion.favoredRaces.length > 2 && (
                <div className="px-2 py-1 bg-muted/50 rounded-full text-xs font-medium">
                  +{originalReligion.favoredRaces.length - 2}
                </div>
              )}
            </div>
          )}
      </div>

      {/* Description Row */}
      {displayDescription && (
        <div className="mb-3">
          <div className="text-sm text-muted-foreground leading-relaxed">
            {displayDescription}
          </div>
        </div>
      )}

      {/* Key Ability Row */}
      <div className="mb-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg">
          <Heart className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium">{blessingSummary}</span>
        </div>
      </div>

      {/* Tenets Row */}
      {tenets.length > 0 && (
        <div className="mb-3">
          <div className="space-y-1">
            {tenets.slice(0, 4).map((tenet, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-2 bg-muted/30 rounded-lg text-xs"
              >
                <Shield className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  {tenet.title}
                </span>
              </div>
            ))}
            {tenets.length > 4 && (
              <div className="px-2 py-1 bg-muted/50 rounded-full text-xs font-medium text-center">
                +{tenets.length - 4} more tenets
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions Row */}
      {showViewAllButton && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNavigateToReligionPage}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
