import { cn } from '@/lib/utils'
import { Tag } from 'lucide-react'

interface SpellTagsDisplayProps {
  tags: string[]
  title?: string
  compact?: boolean
  maxDisplay?: number
  className?: string
}

export function SpellTagsDisplay({ 
  tags, 
  title = 'Tags',
  compact = false,
  maxDisplay = 5,
  className 
}: SpellTagsDisplayProps) {
  if (!tags || tags.length === 0) {
    return null
  }

  const displayTags = tags.slice(0, maxDisplay)
  const hasMore = tags.length > maxDisplay

  return (
    <div className={cn('space-y-2', className)}>
      {title && (
        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Tag className="h-4 w-4" />
          {title}
          {tags.length > 1 && (
            <span className="text-xs text-muted-foreground/70">
              ({tags.length})
            </span>
          )}
        </h4>
      )}
      
      <div className="flex flex-wrap gap-1">
        {displayTags.map((tag, index) => (
          <span
            key={index}
            className={cn(
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
              'bg-muted text-muted-foreground border border-border/50',
              compact ? 'text-xs' : 'text-sm'
            )}
          >
            {tag}
          </span>
        ))}
        
        {hasMore && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground/70">
            +{tags.length - maxDisplay}
          </span>
        )}
      </div>
    </div>
  )
}
