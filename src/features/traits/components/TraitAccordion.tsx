import { cn } from '@/lib/utils'
import { AccordionCard } from '@/shared/components/generic/AccordionCard'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { H3, P } from '@/shared/ui/ui/typography'
import { Heart, Shield, Star, Zap } from 'lucide-react'
import type { Trait } from '../types'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { useEffect } from 'react'

interface TraitAccordionProps {
  item: PlayerCreationItem & { originalTrait: Trait }
  isExpanded?: boolean
  onToggle?: () => void
  className?: string
  showToggle?: boolean
  allTraitIds?: string[] // Add this prop to pass all valid trait IDs
}

export function TraitAccordion({
  item,
  isExpanded = false,
  onToggle,
  className,
  allTraitIds,
}: TraitAccordionProps) {
  const originalTrait = item.originalTrait
  const {
    hasRegularTrait,
    hasBonusTrait,
    addRegularTrait,
    addBonusTrait,
    removeTrait,
    canAddRegularTrait,
    canAddBonusTrait,
    getRegularTraitCount,
    getBonusTraitCount,
    getRegularTraitLimit,
    getBonusTraitLimit,
    build,
  } = useCharacterBuild()

  // Determine current trait level
  const getTraitLevel = (): 'primary' | 'secondary' | 'none' => {
    if (hasRegularTrait(item.id)) return 'primary'
    if (hasBonusTrait(item.id)) return 'secondary'
    return 'none'
  }

  const traitLevel = getTraitLevel()

  const handleTraitSelect = (type: 'primary' | 'secondary') => {
    if (traitLevel === type) {
      // Toggle off if already selected
      removeTrait(item.id)
    } else {
      // Remove any existing trait first
      removeTrait(item.id)

      if (type === 'primary' && canAddRegularTrait()) {
        addRegularTrait(item.id)
      } else if (type === 'secondary' && canAddBonusTrait()) {
        addBonusTrait(item.id)
      }
    }
  }

  const isRegularLimitReached = !canAddRegularTrait() && traitLevel !== 'primary'
  const isBonusLimitReached = !canAddBonusTrait() && traitLevel !== 'secondary'

  // Define card theming based on selection state
  const getCardTheming = () => {
    if (traitLevel === 'primary') {
      return 'border-yellow-500 bg-yellow-50/50 shadow-yellow-500/20'
    }
    if (traitLevel === 'secondary') {
      return 'border-gray-400 bg-gray-50/50 shadow-gray-400/20'
    }
    return ''
  }

  useEffect(() => {
    if (allTraitIds) {
      // Clean up invalid traits from the build
      const regularTraits = build?.traits?.regular || []
      const bonusTraits = build?.traits?.bonus || []
      const currentTraitIds = [...regularTraits, ...bonusTraits]
      
      const traitsToRemove = currentTraitIds.filter((id: string) => !allTraitIds.includes(id))
      traitsToRemove.forEach((id: string) => removeTrait(id))
    }
  }, [allTraitIds, build?.traits, removeTrait])

  return (
    <AccordionCard expanded={isExpanded} onToggle={onToggle} className={cn(className, getCardTheming())}>
      <AccordionCard.Header>
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-black" />
          <H3 className="text-primary font-semibold">{item.name}</H3>
        </div>
      </AccordionCard.Header>
      <AccordionCard.Summary>
          <FormattedText
            text={item.description}
            className={cn(
              "text-base text-muted-foreground",
              isExpanded ? "" : "line-clamp-2"
            )}
          />
        </AccordionCard.Summary>
      <AccordionCard.Footer>
        
        {/* Trait Selection Controls */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={traitLevel === 'primary' ? 'default' : 'outline'}
            disabled={isRegularLimitReached}
            className={cn(
              'flex-1 text-xs',
              traitLevel === 'primary' && 'bg-skyrim-gold text-skyrim-dark hover:bg-skyrim-gold/90'
            )}
            onClick={(e) => {
              e.stopPropagation()
              handleTraitSelect('primary')
            }}
          >
            {traitLevel === 'primary' ? 'Remove Trait' : 'Starting Trait'}
          </Button>
          <Button
            size="sm"
            variant={traitLevel === 'secondary' ? 'default' : 'outline'}
            disabled={isBonusLimitReached}
            className={cn(
              'flex-1 text-xs',
              traitLevel === 'secondary' && 'bg-skyrim-gold text-skyrim-dark hover:bg-skyrim-gold/90'
            )}
            onClick={(e) => {
              e.stopPropagation()
              handleTraitSelect('secondary')
            }}
          >
            {traitLevel === 'secondary' ? 'Remove Trait' : 'Late Game Trait'}
          </Button>
        </div>
        
      </AccordionCard.Footer>
     
    </AccordionCard>
  )
}
