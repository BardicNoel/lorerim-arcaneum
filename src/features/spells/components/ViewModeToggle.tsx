import { Grid3X3, List, ChevronDown } from 'lucide-react'

interface ViewModeToggleProps {
  viewMode: 'grid' | 'list' | 'accordion'
  onViewModeChange: (mode: 'grid' | 'list' | 'accordion') => void
  className?: string
}

export function ViewModeToggle({ viewMode, onViewModeChange, className = '' }: ViewModeToggleProps) {
  return (
    <div className={`flex border rounded-lg p-1 bg-muted ${className}`}>
      <button
        onClick={() => onViewModeChange('grid')}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
          viewMode === 'grid' 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        }`}
        title="Grid view"
      >
        <Grid3X3 className="h-4 w-4" />
        Grid
      </button>
      <button
        onClick={() => onViewModeChange('list')}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
          viewMode === 'list' 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        }`}
        title="List view"
      >
        <List className="h-4 w-4" />
        List
      </button>
      <button
        onClick={() => onViewModeChange('accordion')}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
          viewMode === 'accordion' 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        }`}
        title="Accordion view"
      >
        <ChevronDown className="h-4 w-4" />
        Accordion
      </button>
    </div>
  )
}