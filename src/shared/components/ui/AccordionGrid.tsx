import { cn } from '@/lib/utils'
import React from 'react'

interface AccordionGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AccordionGrid({
  children,
  columns = 2,
  gap = 'md',
  className,
}: AccordionGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  }

  return (
    <div className={cn('grid', gridCols[columns], gapClasses[gap], className)}>
      {children}
    </div>
  )
}
