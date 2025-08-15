import type { SearchableItem } from '../../../model/SearchModel'

export interface HeightEstimate {
  minHeight: number
  maxHeight: number
  estimatedHeight: number
  confidence: number // 0-1, how confident we are in this estimate
}

export interface ContentCharacteristics {
  hasDescription: boolean
  hasEffects: boolean
  hasTags: boolean
  descriptionLength: number
  effectsCount: number
  tagsCount: number
  type: string
}

/**
 * Analyze content characteristics to estimate height
 */
export function analyzeContent(item: SearchableItem): ContentCharacteristics {
  const description = item.description || ''
  const tags = item.tags || []
  
  // Try to extract effects from original data if available
  let effectsCount = 0
  if (item.originalData && typeof item.originalData === 'object') {
    const effects = (item.originalData as any).effects
    if (Array.isArray(effects)) {
      effectsCount = effects.length
    }
  }

  return {
    hasDescription: description.length > 0,
    hasEffects: effectsCount > 0,
    hasTags: tags.length > 0,
    descriptionLength: description.length,
    effectsCount,
    tagsCount: tags.length,
    type: item.type
  }
}

/**
 * Get height estimate based on content type and characteristics
 */
export function estimateHeight(item: SearchableItem): HeightEstimate {
  const characteristics = analyzeContent(item)
  
  // Base heights for different content types
  const baseHeights: Record<string, { min: number; max: number; base: number }> = {
    destiny: { min: 120, max: 200, base: 140 }, // Compact destiny cards
    race: { min: 200, max: 350, base: 250 },    // Race cards with stats
    skill: { min: 180, max: 300, base: 220 },   // Skill cards
    trait: { min: 160, max: 280, base: 200 },   // Trait cards
    birthsign: { min: 200, max: 320, base: 240 }, // Birthsign cards
    religion: { min: 180, max: 300, base: 220 },  // Religion cards
    perk: { min: 200, max: 400, base: 280 },      // Perk cards (can be large)
    spell: { min: 180, max: 350, base: 240 },     // Spell cards
    recipe: { min: 220, max: 400, base: 280 },    // Recipe cards (can be large)
    'perk-reference': { min: 160, max: 280, base: 200 }, // Perk reference cards
  }

  const typeConfig = baseHeights[characteristics.type] || { min: 200, max: 400, base: 250 }
  
  let estimatedHeight = typeConfig.base
  let confidence = 0.7 // Base confidence

  // Adjust based on content characteristics
  if (characteristics.hasDescription) {
    // Add height for description (roughly 20px per 100 characters)
    const descriptionHeight = Math.min(characteristics.descriptionLength * 0.2, 80)
    estimatedHeight += descriptionHeight
    confidence += 0.1
  }

  if (characteristics.hasEffects) {
    // Add height for effects (roughly 25px per effect)
    const effectsHeight = Math.min(characteristics.effectsCount * 25, 150)
    estimatedHeight += effectsHeight
    confidence += 0.1
  }

  if (characteristics.hasTags) {
    // Add height for tags (roughly 30px for tag section)
    estimatedHeight += 30
    confidence += 0.05
  }

  // Clamp to min/max for this type
  estimatedHeight = Math.max(typeConfig.min, Math.min(typeConfig.max, estimatedHeight))
  
  // Cap confidence at 1.0
  confidence = Math.min(1.0, confidence)

  return {
    minHeight: typeConfig.min,
    maxHeight: typeConfig.max,
    estimatedHeight: Math.round(estimatedHeight),
    confidence
  }
}

/**
 * Get a simple estimated height for quick calculations
 */
export function getQuickEstimate(item: SearchableItem): number {
  return estimateHeight(item).estimatedHeight
}

/**
 * Batch estimate heights for multiple items
 */
export function batchEstimateHeights(items: SearchableItem[]): Map<string, HeightEstimate> {
  const estimates = new Map<string, HeightEstimate>()
  
  for (const item of items) {
    estimates.set(item.id, estimateHeight(item))
  }
  
  return estimates
}
