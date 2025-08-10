export interface TextFormattingOptions {
  highlightBrackets?: boolean
  highlightAttributes?: boolean
  highlightSkills?: boolean
  highlightNumbers?: boolean
  customPatterns?: Array<{
    pattern: RegExp
    className: string | ((match: string) => string)
    transform?: (match: string) => string
  }>
}

export interface FormattedTextSegment {
  text: string
  className?: string
  key: string
}

const memoCache = new Map<string, FormattedTextSegment[]>()

// Clear cache when patterns change (for development)
export function clearTextFormattingCache() {
  memoCache.clear()
}

// Clear cache on module load to ensure fresh patterns
clearTextFormattingCache()

export function parseFormattedText(
  text: string,
  options: TextFormattingOptions = {}
): FormattedTextSegment[] {
  if (!text) return []
  const cacheKey = JSON.stringify({ text, options })
  if (memoCache.has(cacheKey)) return memoCache.get(cacheKey)!

  // Basic implementation: apply custom patterns in order, splitting text
  let segments: FormattedTextSegment[] = [{ text, key: '0' }]
  if (options.customPatterns && options.customPatterns.length > 0) {
    options.customPatterns.forEach((patternObj, i) => {
      const newSegments: FormattedTextSegment[] = []
      segments.forEach(segment => {
        if (!segment.className) {
          let lastIndex = 0
          let match: RegExpExecArray | null
          const regex = new RegExp(
            patternObj.pattern,
            patternObj.pattern.flags.includes('g')
              ? patternObj.pattern.flags
              : patternObj.pattern.flags + 'g'
          )
          regex.lastIndex = 0
          let keyIndex = 0
          while ((match = regex.exec(segment.text)) !== null) {
            if (match.index > lastIndex) {
              newSegments.push({
                text: segment.text.slice(lastIndex, match.index),
                key: `${segment.key}-${keyIndex++}`,
              })
            }
            let matchedText = match[0]
            const className =
              typeof patternObj.className === 'function'
                ? patternObj.className(match[0]) // Pass original match for className
                : patternObj.className
            if (patternObj.transform) {
              matchedText = patternObj.transform(matchedText)
            }
            newSegments.push({
              text: matchedText,
              className,
              key: `${segment.key}-${keyIndex++}`,
            })
            lastIndex = regex.lastIndex
          }
          if (lastIndex < segment.text.length) {
            newSegments.push({
              text: segment.text.slice(lastIndex),
              key: `${segment.key}-${keyIndex++}`,
            })
          }
        } else {
          newSegments.push(segment)
        }
      })
      segments = newSegments
    })
  }
  // Assign unique keys if not already
  segments = segments.map((seg, idx) => ({
    ...seg,
    key: seg.key || String(idx),
  }))
  memoCache.set(cacheKey, segments)
  return segments
}
