// Type definitions for search result rendering
export type ViewMode = 'card' | 'accordion' | 'grid' | 'detail' | 'compact'

// Default view modes for each type
export const TYPE_DEFAULT_VIEWS: Record<string, ViewMode> = {
  race: 'card',
  birthsign: 'accordion',
  skill: 'grid',
  destiny: 'accordion',
  trait: 'card',
  religion: 'card',
  perk: 'grid',
  'perk-reference': 'card',
  spell: 'grid',
}

// Get the effective view mode for a type
export function getEffectiveViewMode(
  type: string,
  userViewMode?: ViewMode
): ViewMode {
  // If user has a preference, use it
  if (userViewMode) {
    return userViewMode
  }

  // Otherwise use type default
  return TYPE_DEFAULT_VIEWS[type] || 'card'
}

// Get available view modes for a type
export function getAvailableViewModes(type: string): ViewMode[] {
  // For now, all types support card view
  const modes: ViewMode[] = ['card']

  // Add type-specific modes
  switch (type) {
    case 'birthsign':
    case 'destiny':
      modes.push('accordion')
      break
    case 'skill':
    case 'perk':
    case 'perk-reference':
    case 'spell':
      modes.push('grid')
      break
  }

  return modes
}
