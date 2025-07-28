import React from 'react'
import type { SearchHighlight } from '../model/SearchModel'

interface HighlightedTextProps {
  text: string
  highlights?: SearchHighlight[]
  field?: string
  className?: string
}

export function HighlightedText({
  text,
  highlights = [],
  field,
  className,
}: HighlightedTextProps) {
  // If no highlights or field doesn't match, return plain text
  if (!highlights.length || !field) {
    return <span className={className}>{text}</span>
  }

  // Filter highlights for this specific field
  const fieldHighlights = highlights.filter(h => h.field === field)

  if (!fieldHighlights.length) {
    return <span className={className}>{text}</span>
  }

  // Sort highlights by start index
  const sortedHighlights = fieldHighlights.sort(
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
        className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded"
      >
        {highlight.snippet}
      </mark>
    )

    lastIndex = highlight.endIndex
  })

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push(<span key="text-end">{text.slice(lastIndex)}</span>)
  }

  return <span className={className}>{segments}</span>
}

// Component for highlighting text with custom highlight component
interface CustomHighlightedTextProps {
  text: string
  highlights?: SearchHighlight[]
  field?: string
  className?: string
  highlightComponent?: React.ComponentType<{ children: React.ReactNode }>
}

export function CustomHighlightedText({
  text,
  highlights = [],
  field,
  className,
  highlightComponent: HighlightComponent = ({ children }) => (
    <mark className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
      {children}
    </mark>
  ),
}: CustomHighlightedTextProps) {
  // If no highlights or field doesn't match, return plain text
  if (!highlights.length || !field) {
    return <span className={className}>{text}</span>
  }

  // Filter highlights for this specific field
  const fieldHighlights = highlights.filter(h => h.field === field)

  if (!fieldHighlights.length) {
    return <span className={className}>{text}</span>
  }

  // Sort highlights by start index
  const sortedHighlights = fieldHighlights.sort(
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
      <HighlightComponent key={`highlight-${index}`}>
        {highlight.snippet}
      </HighlightComponent>
    )

    lastIndex = highlight.endIndex
  })

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push(<span key="text-end">{text.slice(lastIndex)}</span>)
  }

  return <span className={className}>{segments}</span>
}

// Hook for getting highlighted text for a specific field
export function useHighlightedText(
  text: string,
  highlights: SearchHighlight[],
  field: string
): React.ReactNode {
  return React.useMemo(() => {
    return <HighlightedText text={text} highlights={highlights} field={field} />
  }, [text, highlights, field])
}
