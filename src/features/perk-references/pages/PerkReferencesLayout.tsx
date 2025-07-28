import React from 'react'
import { cn } from '@/lib/utils'

interface PerkReferencesLayoutProps {
  children: React.ReactNode
  className?: string
}

export function PerkReferencesLayout({ children, className }: PerkReferencesLayoutProps) {
  return (
    <div className={cn('container mx-auto p-6 space-y-6', className)}>
      {children}
    </div>
  )
} 