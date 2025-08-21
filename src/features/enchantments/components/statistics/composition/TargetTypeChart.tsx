import React from 'react'
import { ChartContainer } from '../atomic/ChartContainer'
import { Badge } from '@/shared/ui/ui/badge'
import { cn } from '@/lib/utils'

interface TargetTypeChartProps {
  data: Array<{ name: string; value: number }>
  total: number
  className?: string
}

const COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-cyan-500',
]

export function TargetTypeChart({ data, total, className }: TargetTypeChartProps) {
  if (!data || data.length === 0) {
    return (
      <ChartContainer
        title="Target Type Distribution"
        description="Distribution of enchantments by target type"
        className={className}
        error="No data available"
      />
    )
  }

  return (
    <ChartContainer
      title="Target Type Distribution"
      description="Distribution of enchantments by target type"
      className={className}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Simple pie chart representation */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4">
            {data.map((item, index) => {
              const percentage = total > 0 ? (item.value / total) * 100 : 0
              const color = COLORS[index % COLORS.length]

              return (
                <div key={item.name} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className={cn('w-4 h-4 rounded-full', color)} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.value} ({percentage.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:w-48 space-y-3">
          <div className="text-center p-4 rounded-lg bg-muted">
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-sm text-muted-foreground">Total Enchantments</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted">
            <div className="text-2xl font-bold">{data.length}</div>
            <div className="text-sm text-muted-foreground">Target Types</div>
          </div>
        </div>
      </div>
    </ChartContainer>
  )
}

