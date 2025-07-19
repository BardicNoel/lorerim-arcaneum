import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SidebarHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  SidebarHeaderProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'px-3 py-2 border-b border-skyrim-gold/20 flex items-center gap-2 min-h-[48px]',
      className
    )}
    {...props}
  />
))
SidebarHeader.displayName = 'SidebarHeader'
