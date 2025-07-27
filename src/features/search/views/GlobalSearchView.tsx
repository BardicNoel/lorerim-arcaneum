import { cn } from '@/lib/utils'
import { FuzzySearchBox } from '@/shared/components/playerCreation/FuzzySearchBox'
import type {
  SearchCategory,
  SearchOption,
} from '@/shared/components/playerCreation/types'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const { isReady } = useSearchData()
  const { availableFilters } = useSearchFilters()

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

  const handleTagSelect = (optionOrTag: SearchOption | string) => {
    let searchTerm: string
    if (typeof optionOrTag === 'string') {
      searchTerm = optionOrTag
    } else {
      searchTerm = optionOrTag.value
    }

    // Navigate to search page with the selected term as a tag
    navigate(`/search?tags=${encodeURIComponent(searchTerm)}`)
  }

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
          onSelect={handleTagSelect}
          onCustomSearch={handleTagSelect}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}
