export interface TextFormattingOptions {
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

export function parseFormattedText(
  text: string,
  options: TextFormattingOptions = {}
): FormattedTextSegment[] {
  if (!text) return []

  const { customPatterns = [] } = options

  // Find all matches from all patterns and sort them by position
  const allMatches: Array<{
    start: number
    end: number
    text: string
    pattern: (typeof customPatterns)[0]
  }> = []

  for (const customPattern of customPatterns) {
    // Ensure the pattern has the global flag for matchAll
    const globalPattern = customPattern.pattern.global
      ? customPattern.pattern
      : new RegExp(
          customPattern.pattern.source,
          customPattern.pattern.flags + 'g'
        )

    const matches = [...text.matchAll(globalPattern)]

    for (const match of matches) {
      const matchText = match[0]
      const startIndex = match.index!

      allMatches.push({
        start: startIndex,
        end: startIndex + matchText.length,
        text: matchText,
        pattern: customPattern,
      })
    }
  }

  // Sort matches by start position
  allMatches.sort((a, b) => a.start - b.start)

  // Build segments from the sorted matches
  const segments: FormattedTextSegment[] = []
  let lastEnd = 0
  let segmentIndex = 0

  for (const match of allMatches) {
    // Add text before this match
    if (match.start > lastEnd) {
      const beforeText = text.substring(lastEnd, match.start)
      if (beforeText) {
        segments.push({
          text: beforeText,
          key: `text-${segmentIndex++}`,
        })
      }
    }

    // Add the matched text with formatting
    const transformedText = match.pattern.transform
      ? match.pattern.transform(match.text)
      : match.text

    const className =
      typeof match.pattern.className === 'function'
        ? match.pattern.className(match.text)
        : match.pattern.className

    segments.push({
      text: transformedText,
      className,
      key: `custom-${segmentIndex++}`,
    })

    lastEnd = match.end
  }

  // Add any remaining text
  if (lastEnd < text.length) {
    const remainingText = text.substring(lastEnd)
    if (remainingText) {
      segments.push({
        text: remainingText,
        key: `text-${segmentIndex++}`,
      })
    }
  }

  return segments
}
