import { cn } from '@/lib/utils'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { Button } from '@/shared/ui/ui/button'
import { H3, H5 } from '@/shared/ui/ui/typography'
import { ExternalLink, Heart, Shield, Star, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getBirthsignGroupStyle } from '../config/birthsignConfig'
import type { Birthsign } from '../types'
import { BirthsignAvatar } from './'
import { sanitizeStatName, sanitizeSkillName } from '../utils/stringSanitizer'

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
    const style = getBirthsignGroupStyle(group)
    return `${style.background} ${style.text} ${style.border}`
  }

  // Get stat pill styling based on stat type
  const getStatPillStyle = (statType: 'health' | 'magicka' | 'stamina') => {
    switch (statType) {
      case 'health':
        return 'bg-red-200 text-red-800 border-red-300'
      case 'magicka':
        return 'bg-blue-200 text-blue-800 border-blue-300'
      case 'stamina':
        return 'bg-green-200 text-green-800 border-green-300'
      default:
        return 'bg-skyrim-gold/10 text-skyrim-gold border-skyrim-gold/30'
    }
  }

  const statMods = getStatModifications()
  const allEffects = getAllEffects()

  return (
    <div
      className={cn(
        'rounded-lg border bg-background shadow-sm transition-all h-full flex flex-col',
        onClick &&
          'cursor-pointer hover:shadow-md hover:bg-accent/50 hover:border-primary/50 hover:scale-[1.02] transition-all duration-200',
        className
      )}
      onClick={onClick ? handleCardClick : undefined}
    >
      {/* Header Content - Fixed height */}
      <div className="flex items-start justify-between p-4 flex-shrink-0">
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
                    <div
                      className={`flex items-center gap-1 px-2 py-1 border rounded-full text-xs font-medium ${getStatPillStyle('health')}`}
                    >
                      <Heart className="h-3 w-3" />
                      <span>
                        {statMods.health > 0 ? '+' : ''}
                        {statMods.health}
                      </span>
                    </div>
                  )}
                  {statMods.magicka !== 0 && (
                    <div
                      className={`flex items-center gap-1 px-2 py-1 border rounded-full text-xs font-medium ${getStatPillStyle('magicka')}`}
                    >
                      <Zap className="h-3 w-3" />
                      <span>
                        {statMods.magicka > 0 ? '+' : ''}
                        {statMods.magicka}
                      </span>
                    </div>
                  )}
                  {statMods.stamina !== 0 && (
                    <div
                      className={`flex items-center gap-1 px-2 py-1 border rounded-full text-xs font-medium ${getStatPillStyle('stamina')}`}
                    >
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

      {/* Content - Takes remaining space */}
      <div className="flex-1 px-4 pb-4 min-h-0">
        <div className="space-y-3">
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
                    className="flex items-center gap-1 px-2 py-1 bg-purple-200 text-purple-800 border border-purple-300 rounded-full text-xs font-medium"
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
                    className="flex items-center gap-1 px-2 py-1 bg-blue-200 text-blue-800 border border-blue-300 rounded-full text-xs font-medium"
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
          <div className="space-y-4 mt-4">
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
                          {sanitizeStatName(stat.stat)}
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
                          {sanitizeSkillName(skill.stat)}
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
            {originalBirthsign.powers &&
              originalBirthsign.powers.length > 0 && (
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
                          <span className="font-medium text-sm">
                            {power.name}
                          </span>
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
    </div>
  )
}
