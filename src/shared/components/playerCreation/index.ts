// Character build flow components
export { BuildPageShell } from './BuildPageShell'
export { CharacterBuildLayout } from './CharacterBuildLayout'
export { CharacterFlowNav } from './CharacterFlowNav'

// Existing components
export { AddToBuildButton } from './AddToBuildButton'
export { AddToBuildSwitch } from './AddToBuildSwitch'
export { AddToBuildSwitchSimple } from './AddToBuildSwitchSimple'
export { AutocompleteSearch } from './AutocompleteSearch'
export { DetailPanel } from './DetailPanel'
export { EntityDisplayCard } from './EntityDisplayCard'
export { EntitySelectionCard } from './EntitySelectionCard'
export { FilterSidebar } from './FilterSidebar'
export { GenericItemCard } from './GenericItemCard'
export { ItemGrid } from './ItemGrid'
export { MultiAutocompleteSearch } from './MultiAutocompleteSearch'
export { PinButton } from './PinButton'
export { PlayerCreationPage } from './PlayerCreationPage'
export { SearchBar } from './SearchBar'
export { SelectedTags } from './SelectedTags'

// Layout components
export {
  PlayerCreationContent,
  PlayerCreationDetailSection,
  PlayerCreationEmptyDetail,
  PlayerCreationItemsSection,
} from './layout/PlayerCreationContent'
export { PlayerCreationFilters } from './layout/PlayerCreationFilters'

export type {
  PlayerCreationItem,
  SearchCategory,
  SearchOption,
  SelectedTag,
} from './types'

/** @deprecated Use PlayerCreationLayout, PlayerCreationContent, etc. instead */
export { PlayerCreationPage as PlayerCreationPageDeprecated } from './PlayerCreationPage'
