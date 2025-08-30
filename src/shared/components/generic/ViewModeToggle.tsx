import React from 'react'
import { Button } from '@/shared/ui/ui/button'
import { Grid3X3, List } from 'lucide-react'

export type ViewMode = 'grid' | 'list'

interface ViewModeToggleProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  className?: string
}

export function ViewModeToggle({
  viewMode,
  onViewModeChange,
  className = '',
}: ViewModeToggleProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant={viewMode === 'grid' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewModeChange('grid')}
        className="flex items-center gap-2"
      >
        <Grid3X3 className="h-4 w-4" />
        Grid
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewModeChange('list')}
        className="flex items-center gap-2"
      >
        <List className="h-4 w-4" />
        List
      </Button>
    </div>
  )
}
