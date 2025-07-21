import { cn } from '@/lib/utils'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { Badge } from '@/shared/ui/ui/badge'
import { Switch } from '@/shared/ui/ui/switch'

interface TraitSelectionControlProps {
  itemId: string
  itemName: string
  className?: string
}

export function TraitSelectionControl({
  itemId,
  className,
}: TraitSelectionControlProps) {
  const {
    hasTrait,

    getTraitType,
    addRegularTrait,
    addBonusTrait,
    removeTrait,
    getRegularTraitCount,
    getBonusTraitCount,
    canAddRegularTrait,
    canAddBonusTrait,
    isAllTraitsFull,
  } = useCharacterBuild()

  const isInBuild = hasTrait(itemId)
  const traitType = getTraitType(itemId)
  const regularCount = getRegularTraitCount()
  const bonusCount = getBonusTraitCount()

  const handleCheckedChange = (checked: boolean) => {
    if (checked) {
      // Try to add as regular trait first, then extra unlock
      if (canAddRegularTrait()) {
        addRegularTrait(itemId)
      } else if (canAddBonusTrait()) {
        addBonusTrait(itemId)
      }
      // If both are full, don't add (UI should prevent this)
    } else {
      removeTrait(itemId)
    }
  }

  const getTooltip = () => {
    if (isInBuild) {
      return `This trait is currently in your build as a ${traitType} trait`
    } else if (isAllTraitsFull()) {
      return 'Maximum traits reached (2 starting + 1 late game)'
    } else {
      return `Add this trait to your character build (${regularCount}/2 starting, ${bonusCount}/1 late game)`
    }
  }

  const getStatusText = () => {
    if (isInBuild) {
      return traitType === 'regular' ? 'Starting Trait' : 'Late Game Trait'
    } else if (isAllTraitsFull()) {
      return 'Max Reached'
    } else {
      return 'Add Trait'
    }
  }

  const getStatusColor = () => {
    if (isInBuild) {
      return traitType === 'regular' ? 'bg-blue-500' : 'bg-gray-400'
    } else if (isAllTraitsFull()) {
      return 'bg-gray-500'
    } else {
      return 'bg-green-500'
    }
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-muted/50',
        isInBuild
          ? 'border-[#d4af37] bg-[#d4af37]/20 shadow-md'
          : 'border-border',
        isAllTraitsFull() && !isInBuild && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={e => {
        e.stopPropagation()
        if (!isAllTraitsFull() || isInBuild) {
          handleCheckedChange(!isInBuild)
        }
      }}
      title={getTooltip()}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-sm font-medium transition-colors duration-200',
              isInBuild ? 'text-[#d4af37]' : 'text-foreground'
            )}
          >
            {getStatusText()}
          </span>
          <Badge
            variant="secondary"
            className={cn('text-xs', getStatusColor())}
          >
            {traitType === 'regular' ? 'R' : traitType === 'bonus' ? 'B' : ''}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          {regularCount}/2 starting, {bonusCount}/1 late game
        </div>
      </div>
      <Switch
        checked={isInBuild}
        onCheckedChange={handleCheckedChange}
        disabled={
          (isAllTraitsFull() && !isInBuild) ||
          (getRegularTraitCount() >= 2 && !isInBuild)
        }
        className={cn(
          'transition-all duration-200',
          isInBuild ? 'data-[state=checked]:bg-[#d4af37]' : '',
          isAllTraitsFull() && !isInBuild && 'opacity-50',
          getRegularTraitCount() >= 2 && !isInBuild && 'opacity-50'
        )}
      />
    </div>
  )
}
