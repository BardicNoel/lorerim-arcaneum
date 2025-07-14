import React from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/shared/ui/ui/badge'
import type { SelectedTag } from './types'

interface SelectedTagsProps {
  tags: SelectedTag[]
  onRemove: (tagId: string) => void
  className?: string
}

export function SelectedTags({ tags, onRemove, className = "" }: SelectedTagsProps) {
  if (tags.length === 0) {
    return null
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant="secondary"
          className="flex items-center gap-1 px-3 py-1 text-sm"
        >
          <span className="text-xs text-muted-foreground">{tag.category}:</span>
          <span>{tag.label}</span>
          <button
            onClick={() => onRemove(tag.id)}
            className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  )
} 