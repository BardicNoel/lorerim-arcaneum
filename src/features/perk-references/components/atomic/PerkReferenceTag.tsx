import React from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * PerkReferenceTag component for displaying filter tags with remove functionality
 */
interface PerkReferenceTagProps {
  label: string
  category?: string
  onRemove?: () => void
  size?: 'sm' | 'md'
  className?: string
}

export function PerkReferenceTag({
  label,
  category,
  onRemove,
  size = 'sm',
  className,
}: PerkReferenceTagProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  }

  return (
    <Badge
      variant="secondary"
      className={cn(
        'flex items-center gap-1 font-medium transition-colors',
        sizeClasses[size],
        className
      )}
    >
      {category && (
        <span className="text-xs text-muted-foreground">{category}:</span>
      )}
      <span>{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  )
} 