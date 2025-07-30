import React from 'react'
import { Button } from '@/shared/ui/ui/button'
import { Grid3X3, List } from 'lucide-react'

export type ViewMode = 'grid' | 'list'

interface ViewModeToggleProps {
  currentMode: ViewMode
  onModeChange: (mode: ViewMode) => void
  className?: string
}

export function ViewModeToggle({
  currentMode,
  onModeChange,
  className,
}: ViewModeToggleProps) {
  return (
    <div className={`flex border rounded-lg p-1 bg-muted ${className || ''}`}>
      <Button
        variant={currentMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('list')}
        className="h-8 px-3"
        title="List view"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={currentMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('grid')}
        className="h-8 px-3"
        title="Grid view"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
    </div>
  )
} 