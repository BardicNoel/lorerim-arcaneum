// New composable components (recommended)
export {
  PlayerCreationContent,
  PlayerCreationDetailSection,
  PlayerCreationEmptyDetail,
  PlayerCreationFilters,
  PlayerCreationItemsSection,
  PlayerCreationLayout,
} from './layout'

// Existing components
export { AutocompleteSearch } from './AutocompleteSearch'
export { DetailPanel } from './DetailPanel'
export { FilterSidebar } from './FilterSidebar'
export { GenericItemCard } from './GenericItemCard'
export { ItemGrid } from './ItemGrid'
export { MultiAutocompleteSearch } from './MultiAutocompleteSearch'
export { SearchBar } from './SearchBar'
export { SelectedTags } from './SelectedTags'

// Build and Pin controls
export { AddToBuildButton } from './AddToBuildButton'
export { AddToBuildSwitch } from './AddToBuildSwitch'
export { AddToBuildSwitchSimple } from './AddToBuildSwitchSimple'
export { PinButton } from './PinButton'

// Legacy monolithic component (deprecated - use composable components instead)
/** @deprecated Use PlayerCreationLayout, PlayerCreationContent, etc. instead */
export { PlayerCreationPage } from './PlayerCreationPage'

// Types
export type * from './types'

// Generic entity components for build page
export { EntityDisplayCard } from './EntityDisplayCard'
export type { EntityDetail } from './EntityDisplayCard'
export { EntitySelectionCard } from './EntitySelectionCard'
export type { EntityOption } from './EntitySelectionCard'
