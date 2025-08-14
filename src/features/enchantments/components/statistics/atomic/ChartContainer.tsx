import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { cn } from '@/lib/utils'

interface ChartContainerProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  isLoading?: boolean
  error?: string
  height?: string
}

export function ChartContainer({
  title,
  description,
  children,
  className,
  isLoading = false,
  error,
  height = 'h-64',
}: ChartContainerProps) {
  return (
    <Card className={cn('transition-all duration-200', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className={cn('w-full', height)}>
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span className="text-sm text-muted-foreground">Loading chart...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </CardContent>
    </Card>
  )
}

