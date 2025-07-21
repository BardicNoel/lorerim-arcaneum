import React, { useMemo, type ElementType } from 'react'
import { cn } from '../../../lib/utils'
import { parseFormattedText, type TextFormattingOptions } from '../../utils/textFormatting'

interface FormattedTextProps {
  text: string
  options?: TextFormattingOptions
  className?: string
  as?: ElementType
}

export function FormattedText({
  text,
  options,
  className = 'text-sm text-muted-foreground',
  as: Component = 'div',
}: FormattedTextProps) {
  const segments = useMemo(() => {
    if (!text) return []
    return parseFormattedText(text, options)
  }, [text, options])

  if (!text) return null

  return (
    <Component className={className}>
      {segments.map((segment) => (
        <span key={segment.key} className={segment.className}>
          {segment.text}
        </span>
      ))}
    </Component>
  )
} 