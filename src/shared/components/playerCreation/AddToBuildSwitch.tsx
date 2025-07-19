import React from 'react'
import { Switch } from '@/shared/ui/ui/switch'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { cn } from '@/lib/utils'

interface AddToBuildSwitchProps {
  itemId: string
  itemType: 'race' | 'stone' | 'religion' | 'trait' | 'skill' | 'equipment'
  itemName: string
  isInBuild?: boolean
  className?: string
  onCheckedChange?: (checked: boolean) => void
}

export function AddToBuildSwitch({
  itemId,
  itemType,
  itemName,
  isInBuild = false,
  className,
  onCheckedChange,
}: AddToBuildSwitchProps) {
  const {
    setRace,
    setStone,
    setReligion,
    addTrait,
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
        return build.traits.includes(itemId)
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
          addTrait(itemId)
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
        'flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm cursor-pointer hover:bg-muted/50 transition-colors w-40',
        currentIsInBuild ? 'border-[#d4af37] bg-[#d4af37]/20 shadow-md' : '',
        className
      )}
      onClick={e => {
        e.stopPropagation()
        handleCheckedChange(!currentIsInBuild)
      }}
      title={getTooltip()}
    >
      <div className="space-y-0.5">
        <span
          className={cn(
            'text-sm font-medium transition-colors duration-200',
            currentIsInBuild ? 'text-[#d4af37]' : 'text-foreground'
          )}
        >
          {currentIsInBuild ? 'In Build' : 'Add to Build'}
        </span>
      </div>
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
