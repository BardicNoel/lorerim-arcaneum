import React from 'react'
import { DataTable } from '../atomic/DataTable'
import { Badge } from '@/shared/ui/ui/badge'
import { cn } from '@/lib/utils'

interface EffectsAnalysisProps {
  data: Array<{ name: string; count: number }>
  total: number
  className?: string
}

export function EffectsAnalysis({ data, total, className }: EffectsAnalysisProps) {
  if (!data || data.length === 0) {
    return (
      <DataTable
        title="Top Effects"
        description="Most common enchantment effects"
        data={[]}
        columns={[]}
        className={className}
        error="No data available"
      />
    )
  }

  const columns = [
    {
      key: 'name' as const,
      label: 'Effect Name',
      sortable: true,
    },
    {
      key: 'count' as const,
      label: 'Occurrences',
      sortable: true,
      render: (value: number) => (
        <Badge variant="secondary">
          {value.toLocaleString()}
        </Badge>
      ),
    },
    {
      key: 'percentage' as const,
      label: 'Percentage',
      sortable: true,
      render: (value: number, item: { name: string; count: number }) => {
        const percentage = total > 0 ? (item.count / total) * 100 : 0
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-muted rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-600"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {percentage.toFixed(1)}%
            </span>
          </div>
        )
      },
    },
  ]

  // Add percentage to data for sorting
  const tableData = data.map(item => ({
    ...item,
    percentage: total > 0 ? (item.count / total) * 100 : 0,
  }))

  return (
    <DataTable
      title="Top Effects"
      description="Most common enchantment effects"
      data={tableData}
      columns={columns}
      className={className}
      maxRows={10}
    />
  )
}

