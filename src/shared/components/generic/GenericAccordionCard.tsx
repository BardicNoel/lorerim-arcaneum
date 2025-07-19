import React from 'react'
import { Card, CardContent, CardHeader } from '@/shared/ui/ui/card'
import { Button } from '@/shared/ui/ui/button'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Generic accordion card component that uses slot-based children.
 * Similar to Dialog pattern - children are slotted into specific areas.
 */
interface GenericAccordionCardProps {
  children: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
  className?: string
}

export function GenericAccordionCard({
  children,
  isExpanded,
  onToggle,
  className,
}: GenericAccordionCardProps) {
  // Extract slot components from children
  const leftControls = React.Children.toArray(children).find(
    child => React.isValidElement(child) && child.type === AccordionLeftControls
  )

  const header = React.Children.toArray(children).find(
    child => React.isValidElement(child) && child.type === AccordionHeader
  )

  const collapsedContent = React.Children.toArray(children).find(
    child =>
      React.isValidElement(child) &&
      child.type === AccordionCollapsedContentSlot
  )

  const expandedContent = React.Children.toArray(children).find(
    child =>
      React.isValidElement(child) && child.type === AccordionExpandedContentSlot
  )

  return (
    <Card
      className={cn(
        'bg-card border rounded-lg shadow-sm transition-all duration-200 w-full',
        className
      )}
    >
      {/* Header - Always visible */}
      <CardHeader className="pb-3 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between">
          {/* Left side: Controls + Header */}
          <div className="flex items-center gap-3 flex-1">
            {leftControls}
            {header}
          </div>

          {/* Right side: Expand/collapse button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={e => {
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
      {!isExpanded && collapsedContent && (
        <CardContent className="pt-0 pb-3">{collapsedContent}</CardContent>
      )}

      {/* Expanded content - Detailed view */}
      {isExpanded && expandedContent && (
        <CardContent className="pt-0 space-y-6">{expandedContent}</CardContent>
      )}
    </Card>
  )
}

/**
 * Slot component for left controls (switches, etc.)
 */
interface AccordionLeftControlsProps {
  children: React.ReactNode
  className?: string
}

export function AccordionLeftControls({
  children,
  className,
}: AccordionLeftControlsProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2 mr-4', className)}>
      {children}
    </div>
  )
}

/**
 * Slot component for header content
 */
interface AccordionHeaderProps {
  children: React.ReactNode
  className?: string
}

export function AccordionHeader({ children, className }: AccordionHeaderProps) {
  return (
    <div className={cn('flex items-center gap-3 flex-1', className)}>
      {children}
    </div>
  )
}

/**
 * Slot components that can be used as children
 */
interface AccordionCollapsedContentSlotProps {
  children: React.ReactNode
  className?: string
}

export function AccordionCollapsedContentSlot({
  children,
  className,
}: AccordionCollapsedContentSlotProps) {
  return <div className={className}>{children}</div>
}

interface AccordionExpandedContentSlotProps {
  children: React.ReactNode
  className?: string
}

export function AccordionExpandedContentSlot({
  children,
  className,
}: AccordionExpandedContentSlotProps) {
  return <div className={className}>{children}</div>
}
