import React from 'react'
import { ErrorBoundary } from '@/shared/components/generic/ErrorBoundary'
import { BirthsignAccordion } from './BirthsignAccordion'

interface BirthsignAccordionProps {
  item: any
  originalBirthsign?: any
  isExpanded?: boolean
  onToggle?: () => void
  className?: string
  showStats?: boolean
  showPowers?: boolean
  showSkills?: boolean
  showEffects?: boolean
}

export function BirthsignAccordionWithErrorBoundary(props: BirthsignAccordionProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 border rounded-lg bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Failed to load birthsign details
          </p>
        </div>
      }
    >
      <BirthsignAccordion {...props} />
    </ErrorBoundary>
  )
} 