import { cn } from '@/lib/utils'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { Card, CardContent } from '@/shared/ui/ui/card'
import { Input } from '@/shared/ui/ui/input'
import { ScrollArea } from '@/shared/ui/ui/scroll-area'
import {
  ArrowDown,
  ArrowUp,
  Command,
  ExternalLink,
  Search,
  X,
} from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchData } from '../adapters/useSearchData'
import { useSearchFilters } from '../adapters/useSearchFilters'
import { useSearchState } from '../adapters/useSearchState'
import { SearchTypeBadge } from '../components/atomic/SearchTypeBadge'
import type { SearchResult } from '../model/SearchModel'

interface GlobalSearchViewProps {
  className?: string
  placeholder?: string
}

export function GlobalSearchView({
  className,
  placeholder = 'Search skills, races, traits, religions...',
}: GlobalSearchViewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const resultsRef = React.useRef<HTMLDivElement>(null)

  // Use search adapters
  const { isReady } = useSearchData()
  const { query, setQuery } = useSearchState()
  const { searchResults } = useSearchFilters()

  // Debounced search
  useEffect(() => {
    if (!isOpen || !isReady) return

    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        setIsLoading(true)
        // Search is handled by useSearchFilters
        setTimeout(() => setIsLoading(false), 100) // Small delay for UX
        setSelectedIndex(0)
      } else {
        setSelectedIndex(0)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, isOpen, isReady])

  // Handle keyboard events on the input
  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev =>
            prev < searchResults.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev =>
            prev > 0 ? prev - 1 : searchResults.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (searchResults[selectedIndex]) {
            handleResultClick(searchResults[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          setIsOpen(false)
          setQuery('')
          break
      }
    },
    [isOpen, searchResults, selectedIndex, setQuery]
  )

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  // Scroll selected result into view
  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selectedElement = resultsRef.current.children[
        selectedIndex
      ] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        })
      }
    }
  }, [selectedIndex])

  const handleResultClick = (result: SearchResult) => {
    // Navigate based on result type
    switch (result.item.type) {
      case 'skill':
        navigate(`/build/perks?skill=${result.item.id}`)
        break
      case 'race':
        navigate(`/races`)
        break
      case 'trait':
        navigate(`/traits`)
        break
      case 'religion':
        navigate(`/religions`)
        break
      case 'birthsign':
        navigate(`/birthsigns`)
        break
      case 'destiny':
        navigate(`/destiny`)
        break
      case 'perk':
        navigate(`/build/perks`)
        break
    }

    setIsOpen(false)
    setQuery('')
  }

  const handleViewAllResults = () => {
    // Navigate to search page with current query
    navigate(`/search?q=${encodeURIComponent(query)}`)
    setIsOpen(false)
  }

  return (
    <div className={cn('relative', className)}>
      {/* Search Trigger Button */}
      <Button
        variant="outline"
        className="w-full justify-start text-sm text-muted-foreground"
        onClick={() => setIsOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        {placeholder}
        <div className="ml-auto flex items-center gap-1">
          <Command className="h-3 w-3" />
          <span className="text-xs">K</span>
        </div>
      </Button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
            {/* Search Input */}
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder={placeholder}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsOpen(false)
                  setQuery('')
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Results */}
            <div className="max-h-[400px] overflow-hidden">
              {!isReady ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2 text-sm text-muted-foreground">
                    Building search index...
                  </span>
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2 text-sm text-muted-foreground">
                    Searching...
                  </span>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <ScrollArea className="h-[400px]">
                    <div ref={resultsRef} className="space-y-1">
                      {searchResults.map((result, index) => (
                        <Card
                          key={`${result.item.type}-${result.item.id}`}
                          className={cn(
                            'cursor-pointer transition-colors hover:bg-accent',
                            selectedIndex === index &&
                              'bg-accent border-primary'
                          )}
                          onClick={() => handleResultClick(result)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                <SearchTypeBadge type={result.item.type} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-sm truncate">
                                    {result.item.name}
                                  </h4>
                                  {result.item.category && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {result.item.category}
                                    </Badge>
                                  )}
                                </div>
                                {result.item.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {result.item.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex-shrink-0 text-xs text-muted-foreground">
                                {selectedIndex === index && (
                                  <div className="flex items-center gap-1">
                                    <ArrowUp className="h-3 w-3" />
                                    <ArrowDown className="h-3 w-3" />
                                    <span>Enter</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* View All Results Button */}
                  <div className="mt-3 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={handleViewAllResults}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View all {searchResults.length} results
                    </Button>
                  </div>
                </>
              ) : query.trim() ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <p className="text-sm">No results found for "{query}"</p>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <p className="text-sm">Start typing to search...</p>
                </div>
              )}
            </div>

            {/* Keyboard Shortcuts Help */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  <ArrowDown className="h-3 w-3" />
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <span className="bg-muted px-1 rounded">Enter</span>
                  Select
                </span>
                <span className="flex items-center gap-1">
                  <span className="bg-muted px-1 rounded">Esc</span>
                  Close
                </span>
              </div>
              <span className="text-xs">
                {searchResults.length} result
                {searchResults.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
