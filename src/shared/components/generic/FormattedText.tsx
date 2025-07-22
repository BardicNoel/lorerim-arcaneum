import { useMemo, type ElementType } from 'react'
import {
  parseFormattedText,
  type TextFormattingOptions,
} from '../../utils/textFormatting'
import { getGameTextFormattingOptions } from '../../utils/gameTextFormatting'

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
  const defaultOptions = useMemo(() => getGameTextFormattingOptions(), [])
  const segments = useMemo(() => {
    if (!text) return []
    return parseFormattedText(text, options || defaultOptions)
  }, [text, options, defaultOptions])

  if (!text) return null

  // Check if className contains line-clamp
  const hasLineClamp = className.includes('line-clamp')

  if (hasLineClamp) {
    // For line-clamp, we need to handle it differently since spans break line-clamp
    // Extract line-clamp classes and apply them to the container
    const lineClampClasses = className.match(/line-clamp-\d+/g) || []
    const otherClasses = className.replace(/line-clamp-\d+/g, '').trim()

    return (
      <Component className={otherClasses}>
        <div className={`${lineClampClasses.join(' ')} overflow-hidden`}>
          {segments.map(segment => (
            <span key={segment.key} className={segment.className}>
              {segment.text}
            </span>
          ))}
        </div>
      </Component>
    )
  }

  return (
    <Component className={className}>
      {segments.map(segment => (
        <span key={segment.key} className={segment.className}>
          {segment.text}
        </span>
      ))}
    </Component>
  )
}
