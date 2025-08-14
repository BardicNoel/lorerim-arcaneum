/**
 * Highlights search terms in text by wrapping them in HTML spans
 */
export function highlightText(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) {
    return text
  }

  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>')
}

/**
 * Extracts search terms from a query string
 */
export function extractSearchTerms(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(term => term.length > 0)
}

/**
 * Calculates relevance score for search results
 */
export function calculateRelevanceScore(
  text: string,
  searchTerms: string[],
  fieldWeights: Record<string, number> = {}
): number {
  const lowerText = text.toLowerCase()
  let score = 0

  searchTerms.forEach(term => {
    if (lowerText.includes(term)) {
      score += 1
      // Bonus for exact matches
      if (lowerText === term) {
        score += 2
      }
      // Bonus for word boundaries
      const wordBoundaryRegex = new RegExp(`\\b${term}\\b`, 'i')
      if (wordBoundaryRegex.test(text)) {
        score += 1
      }
    }
  })

  return score
}

