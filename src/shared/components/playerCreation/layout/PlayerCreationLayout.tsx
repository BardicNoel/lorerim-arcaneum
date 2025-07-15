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
  className = "" 
}: PlayerCreationLayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <H1 className="text-3xl font-bold text-primary mb-2">{title}</H1>
          {description && (
            <P className="text-muted-foreground max-w-2xl">{description}</P>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`px-4 py-6 ${className.includes('max-w-none') ? '' : 'container mx-auto'}`}>
        {children}
      </div>
    </div>
  )
} 