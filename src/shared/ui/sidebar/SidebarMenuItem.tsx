import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SidebarMenuItemProps
  extends React.LiHTMLAttributes<HTMLLIElement> {}

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  SidebarMenuItemProps
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn('relative flex items-stretch', className)}
    {...props}
  />
))
SidebarMenuItem.displayName = 'SidebarMenuItem'
