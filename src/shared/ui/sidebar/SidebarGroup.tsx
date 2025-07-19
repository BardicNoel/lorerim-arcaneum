import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SidebarGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-2', className)} {...props} />
  )
)
SidebarGroup.displayName = 'SidebarGroup'
