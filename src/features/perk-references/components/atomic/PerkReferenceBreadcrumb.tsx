import React from 'react'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Breadcrumb item interface
 */
interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
}

/**
 * PerkReferenceBreadcrumb component for navigation breadcrumbs
 */
interface PerkReferenceBreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function PerkReferenceBreadcrumb({
  items,
  className,
}: PerkReferenceBreadcrumbProps) {
  return (
    <nav className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}>
      {/* Home icon */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center hover:text-foreground transition-colors"
        title="Go back"
      >
        <Home className="h-4 w-4" />
      </button>

      {/* Breadcrumb items */}
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4" />
          {item.href || item.onClick ? (
            <button
              onClick={item.onClick}
              className="hover:text-foreground transition-colors font-medium"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
} 