import { GenericAccordionCard } from '@/shared/components/generic'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { Button } from '@/shared/ui/ui/button'
import { H3, P } from '@/shared/ui/ui/typography'
import { ExternalLink, Heart, Shield, Star, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Birthsign } from '../types'
import { BirthsignAvatar, BirthsignEffectsDisplay } from './'

interface BirthsignCardProps {
  item?: PlayerCreationItem
  originalBirthsign?: Birthsign
  isExpanded?: boolean
  onToggle?: () => void
  onClick?: () => void
  className?: string
  // Context-specific properties
  showViewAllButton?: boolean
  showToggle?: boolean
  viewAllButtonText?: string
  viewAllButtonRoute?: string
}

export function BirthsignCard({
  item,
  originalBirthsign,
  isExpanded = false,
  onToggle,
  onClick,
  className,
  showViewAllButton = false,
  showToggle = true,
  viewAllButtonText = 'View All',
  viewAllButtonRoute = '/birthsigns',
}: BirthsignCardProps) {
  const navigate = useNavigate()

  const handleNavigateToBirthsignPage = () => {
    navigate(viewAllButtonRoute)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on the switch or view all button
    if ((e.target as HTMLElement).closest('[data-no-click]')) {
      return
    }
    onClick?.()
  }

  // Use originalBirthsign data if item is not provided
  const displayName =
    item?.name || originalBirthsign?.name || 'Unknown Birthsign'
  const displayDescription =
    item?.description || originalBirthsign?.description || ''
  const displayGroup = item?.category || originalBirthsign?.group || ''
  const displayEffects = item?.effects || []
  const displaySummary = item?.summary || originalBirthsign?.description || ''

  // Extract stat modifications for the stat pills
  const getStatModifications = () => {
    if (!originalBirthsign?.stat_modifications)
      return { health: 0, magicka: 0, stamina: 0 }

    const stats = { health: 0, magicka: 0, stamina: 0 }
    originalBirthsign.stat_modifications.forEach(stat => {
      const value = stat.type === 'bonus' ? stat.value : -stat.value
      if (stat.stat.toLowerCase().includes('health')) stats.health += value
      else if (stat.stat.toLowerCase().includes('magicka'))
        stats.magicka += value
      else if (stat.stat.toLowerCase().includes('stamina'))
        stats.stamina += value
    })
    return stats
  }

  // Get all effects for the effects count
  const getAllEffects = () => {
    if (!originalBirthsign) return []

    const effects = []
    if (originalBirthsign.powers)
      effects.push(
        ...originalBirthsign.powers.map(p => ({ name: p.name, type: 'power' }))
      )
    if (originalBirthsign.conditional_effects)
      effects.push(
        ...originalBirthsign.conditional_effects.map(e => ({
          name: e.stat,
          type: 'conditional',
        }))
      )
    if (originalBirthsign.mastery_effects)
      effects.push(
        ...originalBirthsign.mastery_effects.map(e => ({
          name: e.stat,
          type: 'mastery',
        }))
      )
    return effects
  }

  // Get pill styling based on group
  const getGroupPillStyle = (group: string) => {
    const groupLower = group.toLowerCase()
    if (groupLower === 'warrior') {
      return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
    } else if (groupLower === 'mage') {
      return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
    } else if (groupLower === 'thief') {
      return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
    }
    // Default fallback
    return 'bg-skyrim-gold/10 text-skyrim-gold border-skyrim-gold/30'
  }

  const statMods = getStatModifications()
  const allEffects = getAllEffects()

  const cardContent = (
    <GenericAccordionCard
      isExpanded={isExpanded}
      onToggle={onToggle || (() => {})}
      className={className}
    >
      {/* Header Content */}
      <div className="flex items-start justify-between p-4">
        {/* Left side: Avatar + Name + Badge */}
        <div className="flex items-start gap-3">
          <BirthsignAvatar birthsignName={displayName} size="2xl" />
          <div className="flex flex-col gap-1">
            <H3 className="text-primary font-semibold">{displayName}</H3>
            {/* Birthsign group tag and stat pills */}
            <div className="flex items-center gap-2">
              {displayGroup && (
                <div
                  className={`inline-flex items-center justify-center px-2 py-1 border rounded-full text-xs font-medium w-16 ${getGroupPillStyle(displayGroup)}`}
                >
                  {displayGroup}
                </div>
              )}
              {/* Stat Pills */}
              {(statMods.health !== 0 ||
                statMods.magicka !== 0 ||
                statMods.stamina !== 0) && (
                <div className="flex gap-1">
                  {statMods.health !== 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-full text-xs font-medium">
                      <Heart className="h-3 w-3" />
                      <span>
                        {statMods.health > 0 ? '+' : ''}
                        {statMods.health}
                      </span>
                    </div>
                  )}
                  {statMods.magicka !== 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-full text-xs font-medium">
                      <Zap className="h-3 w-3" />
                      <span>
                        {statMods.magicka > 0 ? '+' : ''}
                        {statMods.magicka}
                      </span>
                    </div>
                  )}
                  {statMods.stamina !== 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 rounded-full text-xs font-medium">
                      <Shield className="h-3 w-3" />
                      <span>
                        {statMods.stamina > 0 ? '+' : ''}
                        {statMods.stamina}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Effects Count + Switch + Optional View All Button */}
        <div className="flex items-center gap-3">
          {/* Effects count */}
          {allEffects.length > 0 && (
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span>{allEffects.length} effects</span>
              </div>
            </div>
          )}

          {/* Optional View All Button */}
          {showViewAllButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleNavigateToBirthsignPage}
              className="text-xs"
              data-no-click
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              {viewAllButtonText}
            </Button>
          )}

          {/* Switch */}
          {showToggle && (
            <div data-no-click>
              <AddToBuildSwitchSimple
                itemId={originalBirthsign?.edid || item?.id || ''}
                itemType="stone"
                itemName={displayName}
              />
            </div>
          )}
        </div>
      </div>

      {/* Collapsed Content */}
      <div className="space-y-3 px-4 pb-4">
        {/* Description */}
        <div>
          <P className="text-sm text-muted-foreground">{displaySummary}</P>
        </div>

        {/* Quick effects preview */}
        <BirthsignEffectsDisplay
          birthsign={originalBirthsign}
          maxDisplay={3}
          compact={true}
        />
      </div>
    </GenericAccordionCard>
  )

  // Wrap in clickable div if onClick is provided
  if (onClick) {
    return (
      <div
        className="cursor-pointer hover:shadow-lg transition-shadow"
        onClick={handleCardClick}
      >
        {cardContent}
      </div>
    )
  }

  return cardContent
}
