import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/ui/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/ui/tooltip'
import type { AttributeType } from '../../types'

interface LevelAssignmentButtonProps {
  level: number
  currentAssignment: AttributeType | null
  onAssignmentChange: (level: number, attribute: AttributeType) => void
  onClear: (level: number) => void
  disabled?: boolean
  className?: string
}

const attributeColors = {
  health: 'bg-red-500 hover:bg-red-600 border-red-500',
  stamina: 'bg-green-500 hover:bg-green-600 border-green-500',
  magicka: 'bg-blue-500 hover:bg-blue-600 border-blue-500',
}

const attributeLabels = {
  health: 'H',
  stamina: 'S',
  magicka: 'M',
}

const attributeNames = {
  health: 'Health',
  stamina: 'Stamina',
  magicka: 'Magicka',
}

export function LevelAssignmentButton({
  level,
  currentAssignment,
  onAssignmentChange,
  onClear,
  disabled = false,
  className,
}: LevelAssignmentButtonProps) {
  const handleClick = () => {
    if (currentAssignment) {
      onClear(level)
    } else {
      // Start with health when no assignment exists
      onAssignmentChange(level, 'health')
    }
  }

  const getTooltipText = () => {
    if (currentAssignment) {
      return `Level ${level}: ${attributeNames[currentAssignment]} (click to clear)`
    }
    return `Level ${level}: Click to assign Health`
  }

  const getNextAssignment = () => {
    if (!currentAssignment) return 'Health'
    const attributes: AttributeType[] = ['health', 'stamina', 'magicka']
    const currentIndex = attributes.indexOf(currentAssignment)
    const nextIndex = (currentIndex + 1) % attributes.length
    return attributeNames[attributes[nextIndex]]
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('flex flex-col items-center gap-1', className)}>
            <Button
              variant={currentAssignment ? "default" : "outline"}
              size="sm"
              onClick={handleClick}
              disabled={disabled}
              className={cn(
                'h-8 w-8 p-0 text-xs font-bold transition-all duration-200',
                currentAssignment && attributeColors[currentAssignment],
                currentAssignment && 'text-white shadow-md',
                !currentAssignment && 'hover:bg-muted hover:border-primary',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {currentAssignment ? attributeLabels[currentAssignment] : level}
            </Button>
            <span className={cn(
              "text-xs",
              currentAssignment ? "text-foreground font-medium" : "text-muted-foreground"
            )}>
              L{level}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
          {currentAssignment && (
            <p className="text-xs text-muted-foreground mt-1">
              Next: {getNextAssignment()}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 