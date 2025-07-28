import React from 'react'
import { Button } from '@/shared/ui/ui/button'
import { Grid3X3, List } from 'lucide-react'
import type { PerkReferenceViewMode } from '../../types'

interface PerkReferenceViewToggleProps {
  viewMode: PerkReferenceViewMode
  onViewModeChange: (mode: PerkReferenceViewMode) => void
  className?: string
}

export function PerkReferenceViewToggle({
  viewMode,
  onViewModeChange,
  className,
}: PerkReferenceViewToggleProps) {
  return (
    <div className={`flex border rounded-lg p-1 bg-muted ${className}`}>
      <Button
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('grid')}
        className="h-8 px-3"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('list')}
        className="h-8 px-3"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === 'accordion' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('accordion')}
        className="h-8 px-3"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      </Button>
    </div>
  )
} 