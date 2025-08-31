import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/ui/sheet'
import React, { useEffect, useRef } from 'react'

interface ResponsivePanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: React.ReactNode
  description?: React.ReactNode
  side?: 'left' | 'right' | 'top' | 'bottom'
  className?: string
  // Optional breakpoint override (defaults to mobile <= 640px)
  mobileQuery?: string
  // Optional key to reset scroll when content changes (e.g., selected id)
  resetKey?: string | number
  children: React.ReactNode
}

/**
 * ResponsivePanel
 * Renders a side sheet on desktop and a full-width drawer on mobile.
 * Keeps a uniform API for consumers.
 *
 * Default sizing:
 * - Mobile: Full width/height drawer
 * - Small screens (sm): 800px width
 * - Large screens (lg): 800px width (max-width: 800px)
 *
 * Note: Uses !important classes to override base Sheet component max-width constraints.
 */
export function ResponsivePanel({
  open,
  onOpenChange,
  title,
  description,
  side = 'right',
  className,
  mobileQuery = '(max-width: 640px)',
  resetKey,
  children,
}: ResponsivePanelProps) {
  const isMobile = useMediaQuery(mobileQuery)
  const bodyRef = useRef<HTMLDivElement>(null)

  // Reset internal scroll when the panel opens
  useEffect(() => {
    if (open && bodyRef.current) {
      bodyRef.current.scrollTop = 0
    }
  }, [open, isMobile])

  // Also reset when resetKey changes while open (e.g., new item selected)
  useEffect(() => {
    if (open && bodyRef.current) {
      bodyRef.current.scrollTop = 0
    }
  }, [resetKey])

  const contentClassName = cn(
    'flex flex-col',
    isMobile
      ? 'inset-0 top-0 left-0 right-0 bottom-0 h-[100dvh] max-h-[100dvh] w-[100vw] p-0 rounded-none border-0 overflow-y-auto'
      : 'w-[450px] sm:w-[800px] lg:w-[800px] sm:!max-w-[800px] lg:!max-w-[800px] p-0 overflow-y-auto bg-background',
    className
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? 'bottom' : side}
        className={contentClassName}
      >
        {(title || description) && (
          <div
            className={cn(
              'sticky top-0 z-10 bg-background border-b',
              isMobile ? 'p-4 pr-16' : 'p-4' // Add right padding on mobile to avoid close button overlap
            )}
          >
            <SheetHeader className="p-0">
              {title && <SheetTitle>{title}</SheetTitle>}
              {description && (
                <SheetDescription>{description}</SheetDescription>
              )}
            </SheetHeader>
          </div>
        )}
        <div
          ref={bodyRef}
          className={cn(
            'flex-1 overflow-y-auto overscroll-contain',
            isMobile ? 'p-4' : 'p-6'
          )}
        >
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}
