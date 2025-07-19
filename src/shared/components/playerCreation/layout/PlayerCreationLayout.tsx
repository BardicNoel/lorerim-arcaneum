import React from 'react'
import { H1, P } from '@/shared/ui/ui/typography'

interface PlayerCreationLayoutProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function PlayerCreationLayout({
  title,
  description,
  children,
  className = '',
}: PlayerCreationLayoutProps) {
  return (
    <div className={`bg-background ${className}`}>
      {/* Header */}
      <div className="bg-card/50">
        <div className="max-w-none mx-auto px-4 py-6">
          <H1 className="text-3xl font-bold text-primary mb-2">{title}</H1>
          {description && (
            <P className="text-muted-foreground max-w-4xl">{description}</P>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`px-4 py-6 ${className.includes('max-w-none') ? '' : 'max-w-none mx-auto'}`}
      >
        {children}
      </div>
    </div>
  )
}
