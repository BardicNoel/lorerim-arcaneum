import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import { useSearchRenderers } from '../../adapters/useSearchRenderers'
import type { SearchResult } from '../../model/SearchModel'

interface SearchResultWrapperProps {
  result: SearchResult
  isSelected: boolean
  onSelect: (result: SearchResult) => void
  variant?: 'card' | 'compact' | 'detail'
  className?: string
}

export function SearchResultWrapper({
  result,
  isSelected,
  onSelect,
  variant = 'card',
  className,
}: SearchResultWrapperProps) {
  const { renderSearchResultCard, renderSearchResultDetail } =
    useSearchRenderers()
  const [renderedComponent, setRenderedComponent] =
    useState<React.ReactNode>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const renderComponent = async () => {
      setIsLoading(true)
      try {
        let component: React.ReactNode

        if (variant === 'detail') {
          component = await renderSearchResultDetail(result)
        } else {
          component = await renderSearchResultCard(result, isSelected, variant)
        }

        setRenderedComponent(component)
      } catch (error) {
        console.error('Failed to render search result:', error)
        setRenderedComponent(
          <div className="p-4 border rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">
              Failed to load {result.item.type} component
            </p>
          </div>
        )
      } finally {
        setIsLoading(false)
      }
    }

    renderComponent()
  }, [
    result,
    isSelected,
    variant,
    renderSearchResultCard,
    renderSearchResultDetail,
  ])

  const handleClick = () => {
    onSelect(result)
  }

  if (isLoading) {
    return (
      <div className={cn('animate-pulse', className)}>
        <div className="p-4 border rounded-lg bg-muted">
          <div className="h-4 bg-muted-foreground/20 rounded mb-2"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (variant === 'detail') {
    return <div className={className}>{renderedComponent}</div>
  }

  return (
    <div
      className={cn(
        'cursor-pointer transition-all',
        isSelected && 'ring-2 ring-primary',
        className
      )}
      onClick={handleClick}
    >
      {renderedComponent}
    </div>
  )
}
