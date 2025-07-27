import { cn } from '@/lib/utils'
import React from 'react'

interface SearchHighlightProps {
  text: string
  highlights: Array<{
    field: string
    snippet: string
    startIndex: number
    endIndex: number
  }>
  className?: string
}

export function SearchHighlight({
  text,
  highlights,
  className,
}: SearchHighlightProps) {
  if (!highlights || highlights.length === 0) {
    return <span className={className}>{text}</span>
  }

  // Sort highlights by start index
  const sortedHighlights = [...highlights].sort(
    (a, b) => a.startIndex - b.startIndex
  )

  // Create highlighted text segments
  const segments: React.ReactNode[] = []
  let lastIndex = 0

  sortedHighlights.forEach((highlight, index) => {
    // Add text before highlight
    if (highlight.startIndex > lastIndex) {
      segments.push(
        <span key={`text-${index}`}>
          {text.slice(lastIndex, highlight.startIndex)}
        </span>
      )
    }

    // Add highlighted text
    segments.push(
      <mark
        key={`highlight-${index}`}
        className={cn(
          'bg-yellow-200 dark:bg-yellow-800',
          'px-0.5 rounded-sm',
          'font-medium',
          className
        )}
      >
        {text.slice(highlight.startIndex, highlight.endIndex + 1)}
      </mark>
    )

    lastIndex = highlight.endIndex + 1
  })

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push(<span key="text-end">{text.slice(lastIndex)}</span>)
  }

  return <>{segments}</>
}
