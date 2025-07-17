import React from 'react'
import { MultiAutocompleteSearch } from '@/shared/components/playerCreation'
import { FuzzySearchBox } from './FuzzySearchBox'
import type { SearchCategory, SearchOption } from '@/shared/components/playerCreation/types'

interface CustomMultiAutocompleteSearchProps {
  categories: SearchCategory[]
  onSelect: (option: SearchOption) => void
  onCustomSearch: (query: string) => void
  className?: string
}

export function CustomMultiAutocompleteSearch({
  categories,
  onSelect,
  onCustomSearch,
  className
}: CustomMultiAutocompleteSearchProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Fuzzy Search Box */}
      <FuzzySearchBox
        onSearch={onCustomSearch}
        placeholder="Search religions by name, description, or effects..."
      />
      
      {/* Multi Autocomplete Search */}
      <MultiAutocompleteSearch
        categories={categories}
        onSelect={onSelect}
        className="w-full"
      />
    </div>
  )
} 