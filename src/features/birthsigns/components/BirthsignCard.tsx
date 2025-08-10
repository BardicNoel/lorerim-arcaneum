import { cn } from '@/lib/utils'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { Button } from '@/shared/ui/ui/button'
import { H3, H5 } from '@/shared/ui/ui/typography'
import { ExternalLink, Heart, Shield, Star, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Birthsign } from '../types'
import { BirthsignAvatar } from './'

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
    <div
      className={cn(
        'rounded-lg border bg-background shadow-sm transition-all',
        className
      )}
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

      {/* Content - Always show both collapsed and expanded content when isExpanded is true */}
      <div className="space-y-3 px-4 pb-4">
        {/* Description */}
        <div>
          <FormattedText text={displaySummary} />
        </div>

        {/* Quick effects preview */}
        {originalBirthsign && (
          <div className="flex flex-wrap gap-2">
            {originalBirthsign.powers?.slice(0, 3).map((power, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-2 py-1 bg-skyrim-gold/20 text-skyrim-gold border border-skyrim-gold/30 rounded-full text-xs font-medium"
              >
                <Star className="h-3 w-3" />
                {power.name}
              </div>
            ))}
            {originalBirthsign.conditional_effects
              ?.slice(0, 3)
              .map((effect, index) => (
                <div
                  key={`conditional-${index}`}
                  className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-full text-xs font-medium"
                >
                  <Shield className="h-3 w-3" />
                  {effect.stat}
                </div>
              ))}
            {originalBirthsign.mastery_effects
              ?.slice(0, 3)
              .map((effect, index) => (
                <div
                  key={`mastery-${index}`}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-full text-xs font-medium"
                >
                  <Star className="h-3 w-3" />
                  {effect.stat}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Show expanded content when isExpanded is true */}
      {isExpanded && originalBirthsign && (
        <div className="space-y-4 px-4 pb-4">
          {/* Stat Modifications Section */}
          {originalBirthsign.stat_modifications &&
            originalBirthsign.stat_modifications.length > 0 && (
              <div className="space-y-3">
                <H5 className="text-lg font-medium text-foreground">
                  Stat Modifications
                </H5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {originalBirthsign.stat_modifications.map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg border bg-muted/30"
                    >
                      <span className="text-sm font-medium capitalize">
                        {stat.stat}
                      </span>
                      <span
                        className={cn(
                          'font-bold',
                          stat.type === 'bonus'
                            ? 'text-green-600'
                            : 'text-red-600'
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

          {/* Skill Bonuses Section */}
          {originalBirthsign.skill_bonuses &&
            originalBirthsign.skill_bonuses.length > 0 && (
              <div className="space-y-3">
                <H5 className="text-lg font-medium text-foreground">
                  Skill Bonuses
                </H5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {originalBirthsign.skill_bonuses.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg border bg-muted/30"
                    >
                      <span className="text-sm font-medium capitalize">
                        {skill.stat}
                      </span>
                      <span className="font-bold text-green-600">
                        +{skill.value}
                        {skill.value_type === 'percentage' ? '%' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Powers Section */}
          {originalBirthsign.powers && originalBirthsign.powers.length > 0 && (
            <div className="space-y-3">
              <H5 className="text-lg font-medium text-foreground flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Powers
              </H5>
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
                    <FormattedText text={power.description} />
                    {(power.magnitude || power.duration) && (
                      <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                        {power.magnitude && (
                          <div>
                            <span className="font-medium">Magnitude:</span>{' '}
                            {power.magnitude}
                          </div>
                        )}
                        {power.duration && (
                          <div>
                            <span className="font-medium">Duration:</span>{' '}
                            {power.duration}s
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conditional Effects Section */}
          {originalBirthsign.conditional_effects &&
            originalBirthsign.conditional_effects.length > 0 && (
              <div className="space-y-3">
                <H5 className="text-lg font-medium text-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-500" />
                  Conditional Effects
                </H5>
                <div className="space-y-2">
                  {originalBirthsign.conditional_effects.map(
                    (effect, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg border bg-muted/30"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm capitalize">
                            {effect.stat}
                          </span>
                        </div>
                        <FormattedText text={effect.description} />
                        <p className="text-xs text-muted-foreground mt-1">
                          <strong>Condition:</strong> {effect.condition}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {/* Mastery Effects Section */}
          {originalBirthsign.mastery_effects &&
            originalBirthsign.mastery_effects.length > 0 && (
              <div className="space-y-3">
                <H5 className="text-lg font-medium text-foreground flex items-center gap-2">
                  <Star className="h-4 w-4 text-blue-500" />
                  Mastery Effects
                </H5>
                <div className="space-y-2">
                  {originalBirthsign.mastery_effects.map((effect, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border bg-muted/30"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium text-sm">
                          Mastery Effect
                        </span>
                      </div>
                      <div className="text-sm font-medium capitalize">
                        {effect.stat}
                      </div>
                      <FormattedText text={effect.description} />
                      {effect.condition && (
                        <p className="text-xs text-muted-foreground mt-1">
                          <strong>Requirement:</strong> {effect.condition}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
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
