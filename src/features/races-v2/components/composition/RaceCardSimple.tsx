import { cn } from '@/lib/utils'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { Button } from '@/shared/ui/ui/button'

import { H3 } from '@/shared/ui/ui/typography'
import { ExternalLink, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Race } from '../../types'
import { CategoryBadge, RaceAvatar } from '../atomic'
import { extractUnperkedAbilities } from '../../utils/raceToPlayerCreationItem'

interface RaceCardSimpleProps {
  item?: PlayerCreationItem
  originalRace?: Race
  className?: string
  onClick?: () => void
  // Context-specific properties
  showViewAllButton?: boolean
  showToggle?: boolean
  viewAllButtonText?: string
  viewAllButtonRoute?: string
}

export function RaceCardSimple({
  item,
  originalRace,
  className,
  onClick,
  showViewAllButton = false,
  showToggle = true,
  viewAllButtonText = 'View All',
  viewAllButtonRoute = '/race',
}: RaceCardSimpleProps) {
  const navigate = useNavigate()

  const handleNavigateToRacePage = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(viewAllButtonRoute)
  }

  // Use originalRace data if item is not provided
  const displayName = item?.name || originalRace?.name || 'Unknown Race'
  const displayDescription =
    item?.description || originalRace?.description || ''
  const displayCategory = item?.category || originalRace?.category || ''
  const displayEffects = item?.effects || []
  const displaySummary = item?.summary || originalRace?.description || ''

  // Extract unperked abilities
  const unperkedAbilities = originalRace ? extractUnperkedAbilities(originalRace) : []

  return (
    <div
      className={cn(
        'p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors cursor-pointer',
        'hover:shadow-md hover:border-primary/50 hover:scale-[1.02] transition-all duration-200',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Left Section: Avatar */}
        <RaceAvatar raceName={displayName} size="2xl" />

        {/* Right Section: Content */}
        <div className="flex-1 min-w-0">
          {/* Top Row: Name, Category, Stats, Toggle */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <H3 className="text-primary font-semibold truncate">
                {displayName}
              </H3>
              <div className="flex items-center gap-2 mt-1">
                {displayCategory && (
                  <CategoryBadge
                    category={displayCategory as 'Human' | 'Elf' | 'Beast'}
                    size="sm"
                  />
                )}
                {/* Mini Stat Pills */}
                {originalRace?.startingStats && (
                  <div className="flex gap-1">
                    <div className="inline-flex items-center justify-center px-2 py-1 bg-red-500/20 text-red-700 dark:text-red-400 rounded-full text-xs font-medium whitespace-nowrap">
                      ❤️ {originalRace.startingStats.health}
                    </div>
                    <div className="inline-flex items-center justify-center px-2 py-1 bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium whitespace-nowrap">
                      🔷 {originalRace.startingStats.magicka}
                    </div>
                    <div className="inline-flex items-center justify-center px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-full text-xs font-medium whitespace-nowrap">
                      💚 {originalRace.startingStats.stamina}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right side: Effects count + Toggle */}
            <div className="flex items-center gap-2 ml-2">
              {originalRace?.racialSpells &&
                originalRace.racialSpells.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-muted-foreground">
                      {originalRace.racialSpells.length} effects
                    </span>
                  </div>
                )}
              {showToggle && (
                <div onClick={e => e.stopPropagation()}>
                  <AddToBuildSwitchSimple
                    itemId={originalRace?.edid || item?.id || ''}
                    itemType="race"
                    itemName={displayName}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row: Skills */}
          <div className="space-y-2">
            {/* Key Skill Badges */}
            {originalRace?.skillBonuses &&
              originalRace.skillBonuses.length > 0 && (
                <div className="grid grid-cols-3 gap-1 justify-items-center">
                  {originalRace.skillBonuses.map((bonus, index) => (
                    <div
                      key={index}
                      className="px-2 py-1 bg-muted/50 text-muted-foreground rounded text-xs font-medium text-left w-full"
                    >
                      {bonus.skill} +{bonus.bonus}
                    </div>
                  ))}
                </div>
              )}

            {/* Racial Ability Chips */}
            {originalRace?.racialSpells &&
              originalRace.racialSpells.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {originalRace.racialSpells.map((spell, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-2 py-1 bg-skyrim-gold/20 text-skyrim-gold border border-skyrim-gold/30 rounded-full text-xs font-medium"
                    >
                      <Star className="h-3 w-3" />
                      {spell.name}
                    </div>
                  ))}
                </div>
              )}

            {/* Unperked Abilities */}
            {unperkedAbilities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {unperkedAbilities.map((ability, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 bg-muted/50 text-muted-foreground border rounded-full text-xs font-medium"
                  >
                    ⚡ {ability}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View All Button */}
      {showViewAllButton && (
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3"
          onClick={handleNavigateToRacePage}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          {viewAllButtonText}
        </Button>
      )}
    </div>
  )
}
