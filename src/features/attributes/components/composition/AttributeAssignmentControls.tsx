import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/ui/ui/button'
import { Input } from '@/shared/ui/ui/input'
import { H5 } from '@/shared/ui/ui/typography'
import { RotateCcw, Plus, Minus } from 'lucide-react'
import type { AttributeType } from '../../types'

interface AttributeAssignmentControlsProps {
  level: number
  assignments: Record<number, AttributeType>
  onAssignmentChange: (level: number, attribute: AttributeType) => void
  onClearAssignment: (level: number) => void
  onClearAll: () => void
  onUpdateAttributeLevel: (level: number) => void
  className?: string
}

export function AttributeAssignmentControls({
  level,
  assignments,
  onAssignmentChange,
  onClearAssignment,
  onClearAll,
  onUpdateAttributeLevel,
  className,
}: AttributeAssignmentControlsProps) {
  // Calculate current totals
  const getAttributeTotal = (attribute: AttributeType) => {
    return Object.values(assignments).filter(a => a === attribute).length
  }

  const healthTotal = getAttributeTotal('health')
  const staminaTotal = getAttributeTotal('stamina')
  const magickaTotal = getAttributeTotal('magicka')
  const totalAssigned = healthTotal + staminaTotal + magickaTotal

  // Derive level from total attributes (level = total + 1, since level 1 has no assignment)
  const derivedLevel = totalAssigned + 1

  const handleAttributeChange = (attribute: AttributeType, newValue: number) => {
    const currentTotal = getAttributeTotal(attribute)
    const difference = newValue - currentTotal

    if (difference > 0) {
      // Add points
      for (let i = 0; i < difference; i++) {
        // Find the next available level to assign
        const nextLevel = Math.max(2, totalAssigned + 2 + i)
        onAssignmentChange(nextLevel, attribute)
      }
    } else if (difference < 0) {
      // Remove points
      for (let i = 0; i < Math.abs(difference); i++) {
        // Find the last assigned level for this attribute and clear it
        for (let j = level; j >= 2; j--) {
          if (assignments[j] === attribute) {
            onClearAssignment(j)
            break
          }
        }
      }
    }

    // Update the level based on new total
    const newTotal = totalAssigned + difference
    onUpdateAttributeLevel(newTotal + 1)
  }

  const handleIncrement = (attribute: AttributeType) => {
    handleAttributeChange(attribute, getAttributeTotal(attribute) + 1)
  }

  const handleDecrement = (attribute: AttributeType) => {
    const currentTotal = getAttributeTotal(attribute)
    if (currentTotal > 0) {
      handleAttributeChange(attribute, currentTotal - 1)
    }
  }
  
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <H5 className="text-lg font-medium text-foreground">Attribute Points</H5>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Level Display with Integrated Controls */}
      <div className="p-3 bg-muted/30 rounded-lg border">
        <div className="text-sm text-muted-foreground mb-3">
          Character Level: {derivedLevel} (derived from {totalAssigned} attribute points)
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Health */}
          <div className="flex flex-col items-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="font-medium text-red-700 dark:text-red-300 mb-3">Health</div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDecrement('health')}
                disabled={healthTotal <= 0}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={healthTotal}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value) || 0
                  if (newValue >= 0) {
                    handleAttributeChange('health', newValue)
                  }
                }}
                className="w-16 text-center text-lg font-bold text-red-700 dark:text-red-300 bg-white dark:bg-gray-800 border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500"
                min={0}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleIncrement('health')}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stamina */}
          <div className="flex flex-col items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="font-medium text-green-700 dark:text-green-300 mb-3">Stamina</div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDecrement('stamina')}
                disabled={staminaTotal <= 0}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={staminaTotal}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value) || 0
                  if (newValue >= 0) {
                    handleAttributeChange('stamina', newValue)
                  }
                }}
                className="w-16 text-center text-lg font-bold text-green-700 dark:text-green-300 bg-white dark:bg-gray-800 border-green-300 dark:border-green-600 focus:border-green-500 focus:ring-green-500"
                min={0}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleIncrement('stamina')}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Magicka */}
          <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="font-medium text-blue-700 dark:text-blue-300 mb-3">Magicka</div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDecrement('magicka')}
                disabled={magickaTotal <= 0}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={magickaTotal}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value) || 0
                  if (newValue >= 0) {
                    handleAttributeChange('magicka', newValue)
                  }
                }}
                className="w-16 text-center text-lg font-bold text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 border-blue-300 dark:border-blue-600 focus:border-blue-500 focus:ring-blue-500"
                min={0}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleIncrement('magicka')}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  )
} 