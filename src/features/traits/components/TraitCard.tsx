import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { Card, CardContent, CardHeader } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { cn } from '@/lib/utils'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { Dna } from 'lucide-react'

interface TraitCardProps {
  item: PlayerCreationItem
}

export function TraitCard({ item }: TraitCardProps) {
  const {
    hasRegularTrait,
    hasBonusTrait,
    addRegularTrait,
    addBonusTrait,
    removeTrait,
    getRegularTraitLimit,
    getBonusTraitLimit,
    canAddRegularTrait,
    canAddBonusTrait,
  } = useCharacterBuild()

  // Determine current trait level
  const getTraitLevel = (): 'primary' | 'secondary' | 'none' => {
    if (hasRegularTrait(item.id)) return 'primary'
    if (hasBonusTrait(item.id)) return 'secondary'
    return 'none'
  }

  const traitLevel = getTraitLevel()
  const regularLimit = getRegularTraitLimit()
  const bonusLimit = getBonusTraitLimit()

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

  const isRegularLimitReached =
    !canAddRegularTrait() && traitLevel !== 'primary'
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

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md min-w-[320px]',
        getCardTheming(),
        'hover:scale-[1.02]'
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-skyrim-gold/20 flex items-center justify-center">
              <Dna className="h-8 w-8 text-skyrim-gold" />
            </div>
            <h3 className="font-semibold text-lg">{item.name}</h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex flex-col h-full">
        <div className="flex-1">
          <FormattedText
            text={item.description}
            className="text-base text-muted-foreground line-clamp-3"
          />
        </div>

        {/* Selection Controls - Pushed to bottom */}
        <div className="mt-auto pt-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={traitLevel === 'primary' ? 'default' : 'outline'}
              disabled={isRegularLimitReached}
              className={cn(
                'flex-1 text-xs',
                traitLevel === 'primary' &&
                  'bg-skyrim-gold text-skyrim-dark hover:bg-skyrim-gold/90'
              )}
              onClick={() => handleTraitSelect('primary')}
            >
              {traitLevel === 'primary' ? '- Regular' : '+ Regular'}
            </Button>
            <Button
              size="sm"
              variant={traitLevel === 'secondary' ? 'default' : 'outline'}
              disabled={isBonusLimitReached}
              className={cn(
                'flex-1 text-xs',
                traitLevel === 'secondary' &&
                  'bg-skyrim-gold text-skyrim-dark hover:bg-skyrim-gold/90'
              )}
              onClick={() => handleTraitSelect('secondary')}
            >
              {traitLevel === 'secondary' ? '- Extra Unlock' : '+ Extra Unlock'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
