import { cn } from '@/lib/utils'
import { FuzzySearchBox } from '@/shared/components/playerCreation/FuzzySearchBox'
import type {
  SearchCategory,
} from '@/shared/components/playerCreation/types'
import { useGlobalSearch } from '@/shared/hooks/useGlobalSearch'
import { useSearchData } from '../adapters/useSearchData'
import { useSearchFilters } from '../adapters/useSearchFilters'

interface GlobalSearchViewProps {
  className?: string
  placeholder?: string
}

export function GlobalSearchView({
  className,
  placeholder = 'Search skills, races, traits, religions...',
}: GlobalSearchViewProps) {
  const { isReady } = useSearchData()
  const { availableFilters } = useSearchFilters()
  const { handleSearchSelect } = useGlobalSearch()

  // Generate just the primary search category (same as the first box on search page)
  const generateSearchCategories = (): SearchCategory[] => {
    return [
      {
        id: 'fuzzy-search',
        name: 'Search All',
        placeholder: placeholder,
        options: availableFilters.types.map(type => ({
          id: `type-${type.value}`,
          label: type.label,
          value: type.value,
          category: 'Search All',
          description: `${type.count} ${type.label}${type.count !== 1 ? 's' : ''}`,
        })),
      },
    ]
  }

  const searchCategories = generateSearchCategories()

  if (!isReady) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="flex-1 h-10 bg-muted animate-pulse rounded-md"></div>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex-1">
        <FuzzySearchBox
          categories={searchCategories}
          onSelect={handleSearchSelect}
          onCustomSearch={handleSearchSelect}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}
