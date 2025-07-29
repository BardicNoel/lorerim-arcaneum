import { cn } from '@/lib/utils'
import React, { useState } from 'react'

/**
 * Compound AccordionCard component with slottable Header, Summary, Footer, and Details.
 * Each slot has healthy default styling, but allows className override.
 *
 * Usage:
 * <AccordionCard>
 *   <AccordionCard.Header>...</AccordionCard.Header>
 *   <AccordionCard.Summary>...</AccordionCard.Summary>
 *   <AccordionCard.Footer>...</AccordionCard.Footer>
 *   <AccordionCard.Details>...</AccordionCard.Details>
 * </AccordionCard>
 *
 * Supports controlled (expanded/onToggle) or uncontrolled expansion.
 */
export function AccordionCard({
  children,
  className,
  expanded,
  onToggle,
  disableHover = false,
}: {
  children: React.ReactNode
  className?: string
  expanded?: boolean
  onToggle?: () => void
  disableHover?: boolean
}) {
  // Find slots by type
  let header, summary, footer, details
  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) return
    if (child.type === AccordionCard.Header) header = child
    if (child.type === AccordionCard.Summary) summary = child
    if (child.type === AccordionCard.Footer) footer = child
    if (child.type === AccordionCard.Details) details = child
  })
  // Expansion state (controlled or uncontrolled)
  const [internalExpanded, setInternalExpanded] = useState(false)
  const isExpanded = expanded !== undefined ? expanded : internalExpanded
  const handleToggle = onToggle || (() => setInternalExpanded(e => !e))

  const hoverClasses = disableHover ? '' : 'hover:shadow-md hover:scale-[1.02]'

  return (
    <div
      className={cn(
        'rounded-lg border bg-background shadow-sm transition-all duration-200 flex flex-col',
        hoverClasses,
        className
      )}
    >
      {/* Header (always visible, toggles expansion) */}
      {header &&
        React.cloneElement(header, {
          onClick: handleToggle,
          expanded: isExpanded,
        })}
      {/* Main content area (takes available space) */}
      <div className="flex-1">
        {/* Summary (always visible) */}
        {summary}
        {/* Details (only if expanded) */}
        {isExpanded && details}
      </div>
      {/* Footer (always at bottom) */}
      {footer}
    </div>
  )
}
AccordionCard.Header = function Header({
  children,
  className,
  onClick,
  expanded,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  expanded?: boolean
}) {
  const handleClick = () => {
    console.log('AccordionCard.Header clicked, expanded:', expanded)
    onClick?.()
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 bg-muted/30 cursor-pointer select-none hover:bg-muted/50 transition-colors duration-200 rounded-t-lg',
        expanded && 'bg-muted/50',
        className
      )}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-expanded={expanded}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      {children}
      <span
        className={cn(
          'ml-auto transition-transform duration-200 text-muted-foreground',
          expanded ? 'rotate-180' : ''
        )}
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  )
}
AccordionCard.Summary = function Summary({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('px-4 py-2 space-y-3', className)}>{children}</div>
}
AccordionCard.Footer = function Footer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('px-4 py-2', className)}>{children}</div>
}
AccordionCard.Details = function Details({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'px-4 py-4 space-y-4 bg-background rounded-b-lg',
        className
      )}
    >
      {children}
    </div>
  )
}
