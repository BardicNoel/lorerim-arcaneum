export interface PlayerCreationItem {
  id: string
  name: string
  description: string
  summary?: string
  tags: string[]
  effects?: ItemEffect[]
  associatedItems?: AssociatedItem[]
  imageUrl?: string
  category?: string
}

export interface ItemEffect {
  type: 'positive' | 'negative' | 'neutral'
  name: string
  description: string
  value?: number
  target?: string
}

export interface AssociatedItem {
  id: string
  name: string
  type: string
  icon?: string
  description?: string
}

export interface FilterGroup {
  id: string
  name: string
  options: FilterOption[]
  multiSelect?: boolean
}

export interface FilterOption {
  id: string
  label: string
  value: string
  count?: number
}

export interface SearchCategory {
  id: string
  name: string
  placeholder: string
  options: SearchOption[]
}

export interface SearchOption {
  id: string
  label: string
  value: string
  category: string
  description?: string
}

export interface SelectedTag {
  id: string
  label: string
  value: string
  category: string
}

export interface PlayerCreationFilters {
  search: string
  selectedFilters: Record<string, string[]>
  selectedTags: SelectedTag[]
}

export interface PlayerCreationPageProps<T extends PlayerCreationItem> {
  title: string
  description?: string
  items: T[]
  searchCategories: SearchCategory[]
  selectedItem?: T | null
  onItemSelect: (item: T) => void
  onFiltersChange: (filters: PlayerCreationFilters) => void
  onSearch: (query: string) => void
  onTagSelect: (tag: SelectedTag) => void
  onTagRemove: (tagId: string) => void
  viewMode?: 'grid' | 'list'
  onViewModeChange?: (mode: 'grid' | 'list') => void
  renderItemCard: (item: T, isSelected: boolean) => React.ReactNode
  renderDetailPanel: (item: T) => React.ReactNode
  searchPlaceholder?: string
} 