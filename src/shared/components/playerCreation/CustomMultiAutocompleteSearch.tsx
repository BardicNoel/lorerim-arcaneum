// Shared CustomMultiAutocompleteSearch component for all features (migrated from features/religions/components/CustomMultiAutocompleteSearch.tsx)
import { AutocompleteSearch } from './AutocompleteSearch'
import { FuzzySearchBox } from './FuzzySearchBox'
import type {
  SearchCategory,
  SearchOption,
} from './types'

interface CustomMultiAutocompleteSearchProps {
  categories: SearchCategory[]
  onSelect: (option: SearchOption | string) => void
  onCustomSearch: (query: string) => void
  className?: string
}

export function CustomMultiAutocompleteSearch({
  categories,
  onSelect,
  onCustomSearch,
  className = '',
}: CustomMultiAutocompleteSearchProps) {
  // Support both 'fuzzy-search' and 'keywords' as fuzzy search category ids for backward compatibility
  const fuzzySearchCategory = categories.find(cat => cat.id === 'fuzzy-search' || cat.id === 'keywords')
  const otherCategories = categories.filter(cat => cat.id !== 'fuzzy-search' && cat.id !== 'keywords')

  return (
    <div className={`flex flex-wrap gap-4 justify-start ${className}`}>
      {/* Fuzzy Search Box - for keywords - takes remaining space */}
      {fuzzySearchCategory && (
        <div className="flex-1 min-w-[300px]">
          <FuzzySearchBox
            categories={[fuzzySearchCategory]}
            onSelect={onSelect}
            onCustomSearch={onCustomSearch}
            placeholder={fuzzySearchCategory.placeholder}
            className="w-full"
          />
        </div>
      )}

      {/* Regular Autocomplete Search - for other categories - fixed width */}
      {otherCategories.map(category => (
        <div
          key={category.id}
          className="flex-shrink-0 min-w-[200px] max-w-[300px]"
        >
          <AutocompleteSearch
            categories={[category]}
            onSelect={onSelect}
            placeholder={category.placeholder}
            className="w-full"
          />
        </div>
      ))}
    </div>
  )
} 