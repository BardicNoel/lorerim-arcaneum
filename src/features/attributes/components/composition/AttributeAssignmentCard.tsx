import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Button } from '@/shared/ui/ui/button'
import { ChevronDown, ChevronUp, Settings } from 'lucide-react'
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
    selectedRace,
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
        {/* Summary Display */}
        {showSummary && (
          <AttributeSummaryDisplay
            displayData={displayData}
            level={level}
            compact={compact}
            selectedRace={selectedRace}
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
            onUpdateAttributeLevel={updateAttributeLevel}
          />
        )}
      </CardContent>
    </Card>
  )
} 