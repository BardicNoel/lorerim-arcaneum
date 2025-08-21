import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DataTableColumn<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: T[keyof T], item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  title: string
  description?: string
  data: T[]
  columns: DataTableColumn<T>[]
  className?: string
  maxRows?: number
  sortBy?: keyof T
  sortDirection?: 'asc' | 'desc'
  onSort?: (key: keyof T) => void
}

export function DataTable<T extends Record<string, any>>({
  title,
  description,
  data,
  columns,
  className,
  maxRows,
  sortBy,
  sortDirection,
  onSort,
}: DataTableProps<T>) {
  const [internalSortBy, setInternalSortBy] = useState<keyof T | null>(null)
  const [internalSortDirection, setInternalSortDirection] = useState<'asc' | 'desc'>('desc')

  const handleSort = (key: keyof T) => {
    if (onSort) {
      onSort(key)
    } else {
      if (internalSortBy === key) {
        setInternalSortDirection(internalSortDirection === 'asc' ? 'desc' : 'asc')
      } else {
        setInternalSortBy(key)
        setInternalSortDirection('desc')
      }
    }
  }

  const sortedData = useMemo(() => {
    const currentSortBy = sortBy || internalSortBy
    const currentSortDirection = sortDirection || internalSortDirection

    if (!currentSortBy) return data

    return [...data].sort((a, b) => {
      const aValue = a[currentSortBy]
      const bValue = b[currentSortBy]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue)
        return currentSortDirection === 'asc' ? comparison : -comparison
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return currentSortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }

      return 0
    })
  }, [data, sortBy, internalSortBy, sortDirection, internalSortDirection])

  const displayData = maxRows ? sortedData.slice(0, maxRows) : sortedData

  const getSortIcon = (key: keyof T) => {
    const currentSortBy = sortBy || internalSortBy
    const currentSortDirection = sortDirection || internalSortDirection

    if (currentSortBy !== key) {
      return <ArrowUpDown className="h-4 w-4" />
    }

    return currentSortDirection === 'asc' ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    )
  }

  const renderCell = (item: T, column: DataTableColumn<T>) => {
    const value = item[column.key]

    if (column.render) {
      return column.render(value, item)
    }

    if (typeof value === 'number') {
      return value.toLocaleString()
    }

    if (typeof value === 'string') {
      return value
    }

    return String(value)
  }

  return (
    <Card className={cn('transition-all duration-200', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={cn(
                      'px-4 py-2 text-left text-sm font-medium text-muted-foreground',
                      column.sortable && 'cursor-pointer hover:text-foreground',
                      column.className
                    )}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      {column.sortable && getSortIcon(column.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={cn('px-4 py-3 text-sm', column.className)}
                    >
                      {renderCell(item, column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {maxRows && data.length > maxRows && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Showing {maxRows} of {data.length} items
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

