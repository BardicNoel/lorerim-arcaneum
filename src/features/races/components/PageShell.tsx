import React from 'react'
import { H1, Muted } from '@/shared/ui/ui/typography'

interface PageShellProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function PageShell({ title, subtitle, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div>
          <H1 className="text-2xl font-bold text-foreground">{title}</H1>
          {subtitle && (
            <Muted className="text-sm mt-1">{subtitle}</Muted>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  )
} 