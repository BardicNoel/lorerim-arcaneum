import { X } from 'lucide-react'
import type { SelectedTag } from '@/shared/components/playerCreation/types'

interface SelectedTagsDisplayProps {
  tags: SelectedTag[]
  onTagRemove: (tagId: string) => void
  onClearAll: () => void
  className?: string
}

export function SelectedTagsDisplay({ 
  tags, 
  onTagRemove, 
  onClearAll, 
  className = '' 
}: SelectedTagsDisplayProps) {
  if (tags.length === 0) return null
  
  return (
    <div className={`flex flex-wrap gap-2 items-center ${className}`}>
      {/* Clear All Button */}
      <button
        onClick={onClearAll}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200 border border-border/50 hover:border-border cursor-pointer group"
        title="Clear all filters"
      >
        <X className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-200" />
        Clear All
      </button>

      {/* Individual Tags */}
      {tags.map(tag => (
        <span
          key={tag.id}
          className="inline-flex items-center px-3 py-1.5 rounded-full bg-skyrim-gold/20 border border-skyrim-gold/30 text-sm font-medium text-skyrim-gold hover:bg-skyrim-gold/30 transition-colors duration-200 cursor-pointer group"
          onClick={() => onTagRemove(tag.id)}
          title="Click to remove"
        >
          {tag.label}
          <span className="ml-2 text-skyrim-gold/70 group-hover:text-skyrim-gold transition-colors duration-200">
            ×
          </span>
        </span>
      ))}
    </div>
  )
}