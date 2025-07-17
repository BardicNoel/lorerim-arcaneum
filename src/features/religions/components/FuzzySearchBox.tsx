import React, { useState, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/shared/ui/ui/input'
import { Button } from '@/shared/ui/ui/button'
import { cn } from '@/lib/utils'

interface FuzzySearchBoxProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export function FuzzySearchBox({ 
  onSearch, 
  placeholder = "Search religions...",
  className 
}: FuzzySearchBoxProps) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    try {
      onSearch(searchQuery)
    } finally {
      setIsSearching(false)
    }
  }, [onSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
          disabled={isSearching}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </form>
  )
} 