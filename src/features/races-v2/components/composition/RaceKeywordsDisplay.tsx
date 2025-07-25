import React from 'react'
import { cn } from '@/lib/utils'
import { H5 } from '@/shared/ui/ui/typography'
import { KeywordTag } from '../atomic'

interface RaceKeywordsDisplayProps {
  keywords: string[]
  title?: string
  className?: string
  maxDisplay?: number
  showCount?: boolean
}

export function RaceKeywordsDisplay({
  keywords,
  title = 'Keywords',
  className,
  maxDisplay,
  showCount = true,
}: RaceKeywordsDisplayProps) {
  if (!keywords || keywords.length === 0) return null

  const displayKeywords = maxDisplay ? keywords.slice(0, maxDisplay) : keywords
  const hasMore = maxDisplay && keywords.length > maxDisplay

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        {title && <H5 className="text-lg font-medium text-foreground">{title}</H5>}
        {showCount && (
          <span className="text-xs text-muted-foreground">
            {keywords.length} keyword{keywords.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {displayKeywords.map((keyword, index) => (
          <KeywordTag
            key={index}
            keyword={keyword}
            size="sm"
          />
        ))}
        {hasMore && (
          <span className="text-xs text-muted-foreground px-2 py-1">
            +{keywords.length - maxDisplay!} more
          </span>
        )}
      </div>
    </div>
  )
} 