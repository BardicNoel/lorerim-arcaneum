// New composable components (recommended)
export {
  PlayerCreationLayout,
  PlayerCreationContent,
  PlayerCreationItemsSection,
  PlayerCreationDetailSection,
  PlayerCreationEmptyDetail,
  PlayerCreationFilters,
} from './layout'

// Existing components
export { MultiAutocompleteSearch } from './MultiAutocompleteSearch'
export { SelectedTags } from './SelectedTags'
export { ItemGrid } from './ItemGrid'
export { DetailPanel } from './DetailPanel'
export { AutocompleteSearch } from './AutocompleteSearch'
export { FilterSidebar } from './FilterSidebar'
export { SearchBar } from './SearchBar'
export { GenericItemCard } from './GenericItemCard'

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
