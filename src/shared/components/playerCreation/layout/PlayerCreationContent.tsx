import React from 'react'
import { Z_INDEX } from '@/lib/constants'
import { H2, P } from '@/shared/ui/ui/typography'

interface PlayerCreationContentProps {
  children: React.ReactNode
  className?: string
}

export function PlayerCreationContent({ children, className = "" }: PlayerCreationContentProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-6 gap-6 ${className}`}>
      {children}
    </div>
  )
}

interface PlayerCreationItemsSectionProps {
  children: React.ReactNode
  className?: string
}

export function PlayerCreationItemsSection({ children, className = "" }: PlayerCreationItemsSectionProps) {
  return (
    <div className={`lg:col-span-5 ${className}`}>
      {children}
    </div>
  )
}

interface PlayerCreationDetailSectionProps {
  children: React.ReactNode
  className?: string
}

export function PlayerCreationDetailSection({ children, className = "" }: PlayerCreationDetailSectionProps) {
  return (
    <div className={`lg:col-span-1 ${className}`}>
      <div 
        className="sticky top-6"
        style={{ zIndex: Z_INDEX.STICKY }}
      >
        {children}
      </div>
    </div>
  )
}

interface PlayerCreationEmptyDetailProps {
  title?: string
  description?: string
}

export function PlayerCreationEmptyDetail({ 
  title = "Select an Item", 
  description = "Choose an item from the list to view its details" 
}: PlayerCreationEmptyDetailProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 text-center">
      <H2 className="text-lg font-semibold mb-2">{title}</H2>
      <P className="text-muted-foreground">{description}</P>
    </div>
  )
} 