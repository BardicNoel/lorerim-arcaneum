import React from 'react'
import { ChartContainer } from '../atomic/ChartContainer'
import { Badge } from '@/shared/ui/ui/badge'
import { cn } from '@/lib/utils'

interface ItemTypeDistributionProps {
  data: Array<{ name: string; value: number }>
  total: number
  className?: string
}

export function ItemTypeDistribution({ data, total, className }: ItemTypeDistributionProps) {
  if (!data || data.length === 0) {
    return (
      <ChartContainer
        title="Item Type Distribution"
        description="Distribution of items that can be enchanted"
        className={className}
        error="No data available"
      />
    )
  }

  const maxValue = Math.max(...data.map(item => item.value))

  return (
    <ChartContainer
      title="Item Type Distribution"
      description="Distribution of items that can be enchanted"
      className={className}
      height="h-80"
    >
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0
          const barWidth = maxValue > 0 ? (item.value / maxValue) * 100 : 0

          return (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium truncate">{item.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {item.value}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    'bg-gradient-to-r from-purple-500 to-purple-600'
                  )}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </ChartContainer>
  )
}

