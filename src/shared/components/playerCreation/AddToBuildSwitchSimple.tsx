import { cn } from '@/lib/utils'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { Switch } from '@/shared/ui/ui/switch'

interface AddToBuildSwitchSimpleProps {
  itemId: string
  itemType: 'race' | 'stone' | 'religion' | 'trait' | 'skill' | 'equipment'
  itemName: string
  isInBuild?: boolean
  className?: string
  onCheckedChange?: (checked: boolean) => void
}

export function AddToBuildSwitchSimple({
  itemId,
  itemType,
  itemName,
  isInBuild = false,
  className,
  onCheckedChange,
}: AddToBuildSwitchSimpleProps) {
  const {
    setRace,
    setStone,
    setReligion,
    addTrait,
    addRegularTrait,
    addBonusTrait,
    removeTrait,
    addMajorSkill,
    removeMajorSkill,
    addMinorSkill,
    removeMinorSkill,
    addEquipment,
    removeEquipment,
    build,
  } = useCharacterBuild()

  // Check if item is currently in build
  const checkIsInBuild = () => {
    switch (itemType) {
      case 'race':
        return build.race === itemId
      case 'stone':
        return build.stone === itemId
      case 'religion':
        return build.religion === itemId
      case 'trait':
        return (
          build.traits.regular.includes(itemId) ||
          build.traits.bonus.includes(itemId)
        )
      case 'skill':
        return (
          build.skills.major.includes(itemId) ||
          build.skills.minor.includes(itemId)
        )
      case 'equipment':
        return build.equipment.includes(itemId)
      default:
        return false
    }
  }

  const currentIsInBuild = isInBuild || checkIsInBuild()

  const handleCheckedChange = (checked: boolean) => {
    // Call custom onCheckedChange handler if provided
    if (onCheckedChange) {
      onCheckedChange(checked)
      return
    }

    // Default build state management
    switch (itemType) {
      case 'race':
        setRace(checked ? itemId : null)
        break
      case 'stone':
        setStone(checked ? itemId : null)
        break
      case 'religion':
        setReligion(checked ? itemId : null)
        break
      case 'trait':
        if (checked) {
          // Check if we can add a trait
          if (build.traits.regular.length < 2) {
            addRegularTrait(itemId)
          } else if (build.traits.bonus.length < 1) {
            addBonusTrait(itemId)
          }
          // If both are full, don't add (UI should prevent this)
        } else {
          removeTrait(itemId)
        }
        break
      case 'skill':
        // For skills, we need to determine if it's major or minor
        // For now, we'll add to major skills
        if (checked) {
          addMajorSkill(itemId)
        } else {
          removeMajorSkill(itemId)
          removeMinorSkill(itemId)
        }
        break
      case 'equipment':
        if (checked) {
          addEquipment(itemId)
        } else {
          removeEquipment(itemId)
        }
        break
    }
  }

  const getTooltip = () => {
    if (currentIsInBuild) {
      return `This ${itemType} is currently in your build`
    } else {
      return `Add this ${itemType} to your character build`
    }
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center p-2 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-muted/50',
        currentIsInBuild
          ? 'border-[#d4af37] bg-[#d4af37]/20 shadow-md'
          : 'border-border',
        className
      )}
      onClick={e => {
        e.stopPropagation()
        handleCheckedChange(!currentIsInBuild)
      }}
      title={getTooltip()}
    >
      <Switch
        checked={currentIsInBuild}
        onCheckedChange={handleCheckedChange}
        className={cn(
          'transition-all duration-200',
          currentIsInBuild ? 'data-[state=checked]:bg-[#d4af37]' : ''
        )}
      />
    </div>
  )
}
