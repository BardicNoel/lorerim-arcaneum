import React from 'react'
import { AutocompleteSearch } from './AutocompleteSearch'
import type { SearchCategory, SearchOption } from './types'

interface MultiAutocompleteSearchProps {
  categories: SearchCategory[]
  onSelect: (option: SearchOption) => void
  className?: string
}

export function MultiAutocompleteSearch({
  categories,
  onSelect,
  className = '',
}: MultiAutocompleteSearchProps) {
  return (
    <div className={`flex flex-wrap gap-4 justify-start ${className}`}>
      {categories.map(category => (
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
