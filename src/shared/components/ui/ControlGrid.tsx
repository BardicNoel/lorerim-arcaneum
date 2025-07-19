import React from 'react'
import { cn } from '@/lib/utils'

interface ControlGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ControlGrid({
  children,
  columns = 2,
  gap = 'md',
  className,
}: ControlGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  }

  return (
    <div className={cn('grid', gridCols[columns], gapClasses[gap], className)}>
      {children}
    </div>
  )
}
