import { useDerivedStatsCalculation } from '@/features/derived-stats'
import type { DerivedStat } from '@/features/derived-stats/types'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/ui/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { ChevronDown, ChevronUp, Settings } from 'lucide-react'
import { useState } from 'react'
import { useAttributeAssignments } from '../../hooks/useAttributeAssignments'
import { AttributeAssignmentControls } from './AttributeAssignmentControls'
import { AttributeSummaryDisplay } from './AttributeSummaryDisplay'

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
    setAttributePoints,
    clearAllAttributeAssignments,
    updateAttributeLevel,
    getTotalAssignments,
    getMaxPossibleAssignments,
    getRemainingAssignments,
  } = useAttributeAssignments()

  // Get derived stats calculation
  const derivedStatsCalculation = useDerivedStatsCalculation()

  const handleAttributeChange = (
    attribute: 'health' | 'stamina' | 'magicka',
    points: number
  ) => {
    setAttributePoints(attribute, points)
  }

  const handleClearAll = () => {
    clearAllAttributeAssignments()
  }

  // Group derived stats by category
  const statsByCategory = derivedStatsCalculation.derivedStats.reduce(
    (acc, stat) => {
      if (!acc[stat.category]) {
        acc[stat.category] = []
      }
      acc[stat.category].push(stat)
      return acc
    },
    {} as Record<string, DerivedStat[]>
  )

  const categoryOrder = ['combat', 'survival', 'movement', 'magic']

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Attributes & Derived Stats
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

      <CardContent className="space-y-6">
        {/* Top Section: Assignment Controls */}
        {showControls && isExpanded && (
          <AttributeAssignmentControls
            level={level}
            assignments={assignments}
            onAttributeChange={handleAttributeChange}
            onClearAll={handleClearAll}
            onUpdateAttributeLevel={updateAttributeLevel}
            getTotalAssignments={getTotalAssignments}
            getMaxPossibleAssignments={getMaxPossibleAssignments}
            getRemainingAssignments={getRemainingAssignments}
          />
        )}

        {/* Middle Section: Attribute Summary */}
        {showSummary && (
          <AttributeSummaryDisplay
            displayData={displayData}
            level={level}
            compact={compact}
            selectedRace={selectedRace}
          />
        )}

        {/* Bottom Section: Derived Stats Grid */}
        {showSummary && (
          <div className="space-y-4">
            <div className="text-lg font-medium text-foreground">
              Derived Stats
            </div>

            {/* Grid Layout for Derived Stats by Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryOrder.map(category => {
                const stats = statsByCategory[category]
                if (!stats || stats.length === 0) return null

                return (
                  <div key={category} className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium mb-3 capitalize">
                      {category} Stats
                    </div>
                    <div className="space-y-2">
                      {stats.map(stat => (
                        <div
                          key={stat.name}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-muted-foreground">
                            {stat.name}
                          </span>
                          <span className="font-medium">
                            {stat.isPercentage ? `${stat.value}%` : stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
