import { H1, P } from '@/shared/ui/ui/typography'
import React from 'react'

interface SearchPageLayoutProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function SearchPageLayout({
  title,
  description,
  children,
}: SearchPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <H1 className="text-3xl font-bold text-primary mb-2">{title}</H1>
          {description && (
            <P className="text-muted-foreground max-w-2xl">{description}</P>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">{children}</div>
    </div>
  )
}
