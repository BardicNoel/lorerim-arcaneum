import React from 'react'
import { cn } from '@/lib/utils'
import { H5 } from '@/shared/ui/ui/typography'
import { StatBar } from '@/features/races-v2/components/atomic'
import type { AttributeDisplayData } from '../../types'

interface AttributeSummaryDisplayProps {
  displayData: AttributeDisplayData
  level: number
  className?: string
  showRatios?: boolean
  compact?: boolean
}

export function AttributeSummaryDisplay({
  displayData,
  level,
  className,
  showRatios = true,
  compact = false,
}: AttributeSummaryDisplayProps) {
  if (compact) {
    return (
      <div className={cn('space-y-3', className)}>
        <H5 className="text-lg font-medium text-foreground">Attribute Assignments</H5>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded">
            <div className="text-sm text-muted-foreground">Health</div>
            <div className="font-medium text-lg">{displayData.health.total}</div>
            <div className="text-xs text-muted-foreground">
              +{displayData.health.assigned}
            </div>
          </div>
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded">
            <div className="text-sm text-muted-foreground">Stamina</div>
            <div className="font-medium text-lg">{displayData.stamina.total}</div>
            <div className="text-xs text-muted-foreground">
              +{displayData.stamina.assigned}
            </div>
          </div>
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded">
            <div className="text-sm text-muted-foreground">Magicka</div>
            <div className="font-medium text-lg">{displayData.magicka.total}</div>
            <div className="text-xs text-muted-foreground">
              +{displayData.magicka.assigned}
            </div>
          </div>
        </div>
        
        {showRatios && (
          <div className="text-xs text-muted-foreground text-center">
            Level {level} • {displayData.health.assigned + displayData.stamina.assigned + displayData.magicka.assigned} assignments
          </div>
        )}
      </div>
    )
  }
  
  return (
    <div className={cn('space-y-4', className)}>
      <H5 className="text-lg font-medium text-foreground">Attribute Assignments</H5>
      
      <div className="space-y-3">
        <StatBar 
          value={displayData.health.total} 
          maxValue={200} 
          label="Health" 
          color="red" 
          size="sm"
          showValue={true}
        />
        <StatBar 
          value={displayData.stamina.total} 
          maxValue={200} 
          label="Stamina" 
          color="green" 
          size="sm"
          showValue={true}
        />
        <StatBar 
          value={displayData.magicka.total} 
          maxValue={200} 
          label="Magicka" 
          color="blue" 
          size="sm"
          showValue={true}
        />
      </div>
      
      {showRatios && (
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-medium">Health</div>
            <div className="text-muted-foreground">
              {displayData.health.ratio.toFixed(1)}%
            </div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-medium">Stamina</div>
            <div className="text-muted-foreground">
              {displayData.stamina.ratio.toFixed(1)}%
            </div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-medium">Magicka</div>
            <div className="text-muted-foreground">
              {displayData.magicka.ratio.toFixed(1)}%
            </div>
          </div>
        </div>
      )}
      
      <div className="text-sm text-muted-foreground text-center">
        Level {level} • {displayData.health.assigned + displayData.stamina.assigned + displayData.magicka.assigned} assignments made
      </div>
    </div>
  )
} 