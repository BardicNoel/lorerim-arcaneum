import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, collapsed, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        data-collapsed={collapsed ? '' : undefined}
        className={cn(
          'flex flex-col bg-card border-r border-skyrim-gold/20 h-[calc(100vh-3rem)] sticky top-12 transition-all duration-300',
          collapsed ? 'w-0 overflow-hidden' : 'w-64',
          className
        )}
        {...props}
      />
    )
  }
)
Sidebar.displayName = 'Sidebar'
