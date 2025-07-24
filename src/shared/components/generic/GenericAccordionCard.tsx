import React from 'react'
import { cn } from '@/lib/utils'

/**
 * GenericAccordionCard: A fully slottable accordion/card shell for entity display.
 *
 * Props:
 * - isExpanded: whether the card is expanded
 * - onToggle: function to toggle expansion
 * - className: additional classes
 * - leftControls: slot for left-side controls (e.g., toggle switch)
 * - header: slot for the card header (name, avatar, tags, etc.)
 * - collapsedContent: slot for summary/preview content
 * - expandedContent: slot for full details (shown when expanded)
 * - actionArea: slot for custom actions (e.g., skill actions)
 * - children: fallback for custom layouts (if provided, overrides all slots)
 */
export type GenericAccordionCardProps = {
  isExpanded: boolean
  onToggle: () => void
  className?: string
  leftControls?: React.ReactNode
  header?: React.ReactNode
  collapsedContent?: React.ReactNode
  expandedContent?: React.ReactNode
  actionArea?: React.ReactNode
  children?: React.ReactNode
}

export function GenericAccordionCard({
  isExpanded,
  onToggle,
  className,
  leftControls,
  header,
  collapsedContent,
  expandedContent,
  actionArea,
  children,
}: GenericAccordionCardProps) {
  // If children is provided, render it directly (full custom layout)
  if (children) {
    return (
      <div
        className={cn(
          'rounded-lg border bg-background shadow-sm transition-all',
          className
        )}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-lg border bg-background shadow-sm transition-all group',
        isExpanded ? 'ring-2 ring-skyrim-gold/60' : '',
        className
      )}
    >
      <div className="flex items-start">
        {leftControls && (
          <div className="mr-2 flex-shrink-0">{leftControls}</div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            {header && <div className="flex-1 min-w-0">{header}</div>}
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={isExpanded}
              className="ml-2 p-1 rounded hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-skyrim-gold"
              tabIndex={0}
            >
              <span className="sr-only">
                {isExpanded ? 'Collapse' : 'Expand'}
              </span>
              <svg
                className={cn(
                  'h-4 w-4 transition-transform',
                  isExpanded ? 'rotate-90' : ''
                )}
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  d="M6 8l4 4 4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        {actionArea && <div className="ml-2 flex-shrink-0">{actionArea}</div>}
      </div>
      {/* Collapsed content always shown */}
      {collapsedContent && <div className="mt-2">{collapsedContent}</div>}
      {/* Expanded content only shown if expanded */}
      {isExpanded && expandedContent && (
        <div className="mt-4">{expandedContent}</div>
      )}
    </div>
  )
}
