import React from 'react'
import { Card, CardContent, CardHeader } from '@/shared/ui/ui/card'
import { Button } from '@/shared/ui/ui/button'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Generic accordion card component that can be used across all entity types.
 * Provides consistent accordion behavior with customizable content rendering.
 * 
 * @template T - The type of item being displayed
 * @param item - The item data to display
 * @param isExpanded - Whether the accordion is currently expanded
 * @param onToggle - Callback function when toggle button is clicked
 * @param renderHeader - Function to render the header content
 * @param renderCollapsedContent - Function to render content when collapsed
 * @param renderExpandedContent - Function to render content when expanded
 * @param className - Additional CSS classes
 */
interface GenericAccordionCardProps<T> {
  item: T
  isExpanded: boolean
  onToggle: () => void
  renderHeader: (item: T, isExpanded: boolean) => React.ReactNode
  renderCollapsedContent: (item: T) => React.ReactNode
  renderExpandedContent: (item: T) => React.ReactNode
  renderLeftControls?: (item: T) => React.ReactNode
  className?: string
}

export function GenericAccordionCard<T>({
  item,
  isExpanded,
  onToggle,
  renderHeader,
  renderCollapsedContent,
  renderExpandedContent,
  renderLeftControls,
  className
}: GenericAccordionCardProps<T>) {
  return (
    <Card className={cn('bg-card border rounded-lg shadow-sm transition-all duration-200 w-full', className)}>
      {/* Header - Always visible */}
      <CardHeader className="pb-3 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between">
          {/* Left controls column */}
          {renderLeftControls && (
            <div className="flex flex-col items-center gap-2 mr-4">
              {renderLeftControls(item)}
            </div>
          )}
          
          {/* Custom header content */}
          <div className="flex items-center gap-3 flex-1">
            {renderHeader(item, isExpanded)}
          </div>
          
          {/* Expand/collapse button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onToggle()
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {/* Collapsed content - Quick preview */}
      {!isExpanded && (
        <CardContent className="pt-0 pb-3">
          {renderCollapsedContent(item)}
        </CardContent>
      )}

      {/* Expanded content - Detailed view */}
      {isExpanded && (
        <CardContent className="pt-0 space-y-6">
          {renderExpandedContent(item)}
        </CardContent>
      )}
    </Card>
  )
} 