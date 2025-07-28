import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/ui/ui/button'
import { H5 } from '@/shared/ui/ui/typography'
import { RotateCcw, Zap } from 'lucide-react'
import { LevelAssignmentButton } from '../atomic/LevelAssignmentButton'
import type { AttributeType } from '../../types'

interface AttributeAssignmentControlsProps {
  level: number
  assignments: Record<number, AttributeType>
  onAssignmentChange: (level: number, attribute: AttributeType) => void
  onClearAssignment: (level: number) => void
  onClearAll: () => void
  className?: string
}

export function AttributeAssignmentControls({
  level,
  assignments,
  onAssignmentChange,
  onClearAssignment,
  onClearAll,
  className,
}: AttributeAssignmentControlsProps) {
  const maxDisplayLevels = 20 // Show up to level 20 in the grid
  
  const renderLevelButtons = () => {
    const buttons = []
    
    for (let i = 2; i <= Math.min(level, maxDisplayLevels); i++) {
      buttons.push(
        <LevelAssignmentButton
          key={i}
          level={i}
          currentAssignment={assignments[i] || null}
          onAssignmentChange={onAssignmentChange}
          onClear={onClearAssignment}
        />
      )
    }
    
    return buttons
  }

  const handleQuickAssign = (attribute: AttributeType) => {
    // Find unassigned levels and assign the specified attribute
    for (let i = 2; i <= level; i++) {
      if (!assignments[i]) {
        onAssignmentChange(i, attribute)
        break // Only assign one at a time
      }
    }
  }

  const getUnassignedCount = () => {
    let count = 0
    for (let i = 2; i <= level; i++) {
      if (!assignments[i]) count++
    }
    return count
  }
  
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <H5 className="text-lg font-medium text-foreground">Level Assignments</H5>
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

      {/* Quick Assignment Buttons */}
      {getUnassignedCount() > 0 && (
        <div className="p-3 bg-muted/30 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium">Quick Assign</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAssign('health')}
              className="text-xs bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
            >
              + Health
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAssign('stamina')}
              className="text-xs bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
            >
              + Stamina
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAssign('magicka')}
              className="text-xs bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
            >
              + Magicka
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {getUnassignedCount()} level{getUnassignedCount() !== 1 ? 's' : ''} remaining
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-10 gap-2">
        {renderLevelButtons()}
      </div>
      
      {level > maxDisplayLevels && (
        <div className="text-sm text-muted-foreground text-center">
          Showing levels 2-{maxDisplayLevels} of {level}
        </div>
      )}
      
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Health</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Stamina</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Magicka</span>
        </div>
      </div>
    </div>
  )
} 