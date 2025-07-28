import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Button } from '@/shared/ui/ui/button'
import { Input } from '@/shared/ui/ui/input'
import { Label } from '@/shared/ui/ui/label'
import { ChevronDown, ChevronUp, Settings, Plus, Minus } from 'lucide-react'
import { AttributeSummaryDisplay } from './AttributeSummaryDisplay'
import { AttributeAssignmentControls } from './AttributeAssignmentControls'
import { useAttributeAssignments } from '../../hooks/useAttributeAssignments'

interface AttributeAssignmentCardProps {
  className?: string
  showControls?: boolean
  showSummary?: boolean
  compact?: boolean
}

export function AttributeAssignmentCard({
  className,
  showControls = true,
  showSummary = true,
  compact = false,
}: AttributeAssignmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(true) // Changed to true by default
  const {
    assignments,
    displayData,
    level,
    setAttributeAssignment,
    clearAttributeAssignment,
    clearAllAttributeAssignments,
    updateAttributeLevel,
  } = useAttributeAssignments()
  
  const handleAssignmentChange = (level: number, attribute: 'health' | 'stamina' | 'magicka') => {
    setAttributeAssignment(level, attribute)
  }
  
  const handleClearAssignment = (level: number) => {
    clearAttributeAssignment(level)
  }
  
  const handleClearAll = () => {
    clearAllAttributeAssignments()
  }

  const handleLevelChange = (newLevel: number) => {
    updateAttributeLevel(Math.max(1, Math.min(50, newLevel))) // Limit to 1-50
  }

  const handleLevelIncrement = () => {
    handleLevelChange(level + 1)
  }

  const handleLevelDecrement = () => {
    handleLevelChange(level - 1)
  }
  
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Attribute Assignments
          </CardTitle>
          {showControls && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Level Control */}
        {showControls && (
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Label htmlFor="character-level" className="text-sm font-medium">
              Character Level:
            </Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLevelDecrement}
                disabled={level <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                id="character-level"
                type="number"
                value={level}
                onChange={(e) => handleLevelChange(parseInt(e.target.value) || 1)}
                className="w-16 text-center"
                min={1}
                max={50}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleLevelIncrement}
                disabled={level >= 50}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Assign attributes for levels 2-{level}
            </div>
          </div>
        )}

        {/* Summary Display */}
        {showSummary && (
          <AttributeSummaryDisplay
            displayData={displayData}
            level={level}
            compact={compact}
          />
        )}
        
        {/* Assignment Controls */}
        {showControls && isExpanded && (
          <AttributeAssignmentControls
            level={level}
            assignments={assignments.assignments}
            onAssignmentChange={handleAssignmentChange}
            onClearAssignment={handleClearAssignment}
            onClearAll={handleClearAll}
          />
        )}

        {/* Instructions */}
        {showControls && isExpanded && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">How to assign attributes:</p>
              <ul className="text-xs space-y-1">
                <li>• Click on any level button (2-{level}) to cycle through Health → Stamina → Magicka</li>
                <li>• Click again to clear the assignment</li>
                <li>• Use "Clear All" to reset all assignments</li>
                <li>• Adjust character level above to see more assignment options</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 