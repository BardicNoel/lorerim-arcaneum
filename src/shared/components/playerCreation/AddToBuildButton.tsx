import React from 'react'
import { Button } from '@/shared/ui/ui/button'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { cn } from '@/lib/utils'

interface AddToBuildButtonProps {
  itemId: string
  itemType: 'race' | 'stone' | 'religion' | 'trait' | 'skill' | 'equipment'
  itemName: string
  isInBuild?: boolean
  className?: string
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export function AddToBuildButton({
  itemId,
  itemType,
  itemName,
  isInBuild = false,
  className,
  size = 'sm',
  variant = 'default',
  onClick
}: AddToBuildButtonProps) {
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
    build
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
        return build.skills.major.includes(itemId) || build.skills.minor.includes(itemId)
      case 'equipment':
        return build.equipment.includes(itemId)
      default:
        return false
    }
  }

  const currentIsInBuild = isInBuild || checkIsInBuild()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    
    // Call custom onClick handler if provided
    if (onClick) {
      onClick(e)
      return
    }
    
    // Default build state management
    switch (itemType) {
      case 'race':
        setRace(currentIsInBuild ? null : itemId)
        break
      case 'stone':
        setStone(currentIsInBuild ? null : itemId)
        break
      case 'religion':
        setReligion(currentIsInBuild ? null : itemId)
        break
      case 'trait':
        if (currentIsInBuild) {
          removeTrait(itemId)
        } else {
          addTrait(itemId)
        }
        break
      case 'skill':
        // For skills, we need to determine if it's major or minor
        // For now, we'll add to major skills
        if (currentIsInBuild) {
          removeMajorSkill(itemId)
          removeMinorSkill(itemId)
        } else {
          addMajorSkill(itemId)
        }
        break
      case 'equipment':
        if (currentIsInBuild) {
          removeEquipment(itemId)
        } else {
          addEquipment(itemId)
        }
        break
    }
  }

  const getButtonText = () => {
    if (currentIsInBuild) {
      switch (itemType) {
        case 'race':
          return 'In Build'
        case 'stone':
          return 'In Build'
        case 'religion':
          return 'In Build'
        case 'trait':
          return 'In Build'
        case 'skill':
          return 'In Build'
        case 'equipment':
          return 'In Build'
        default:
          return 'In Build'
      }
    } else {
      switch (itemType) {
        case 'race':
          return 'Add to Build'
        case 'stone':
          return 'Add to Build'
        case 'religion':
          return 'Add to Build'
        case 'trait':
          return 'Add to Build'
        case 'skill':
          return 'Add to Build'
        case 'equipment':
          return 'Add to Build'
        default:
          return 'Add to Build'
      }
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
    <Button
      onClick={handleClick}
      size={size}
      variant={currentIsInBuild ? 'default' : variant}
      className={cn(
        'transition-all duration-200 group relative overflow-hidden',
        currentIsInBuild 
          ? 'bg-skyrim-gold text-skyrim-dark hover:bg-skyrim-gold/90 hover:shadow-lg hover:scale-105' 
          : 'hover:bg-primary hover:text-primary-foreground hover:shadow-md hover:scale-105 hover:border-primary',
        className
      )}
      title={getTooltip()}
    >
      <span className="relative z-10 transition-transform duration-200 group-hover:scale-105">
        {getButtonText()}
      </span>
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />
    </Button>
  )
} 