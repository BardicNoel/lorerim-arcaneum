import React, { useState, useCallback } from 'react'
import { Input } from '@/shared/ui/ui/input'
import { Search } from 'lucide-react'

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  className?: string
}

export function SearchBar({
  placeholder = 'Search...',
  onSearch,
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value
      setQuery(newQuery)
      onSearch(newQuery)
    },
    [onSearch]
  )

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="pl-10 bg-background border-border"
      />
    </div>
  )
}
