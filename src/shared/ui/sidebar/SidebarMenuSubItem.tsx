import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SidebarMenuSubItemProps
  extends React.LiHTMLAttributes<HTMLLIElement> {}

export const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  SidebarMenuSubItemProps
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn('relative flex items-stretch', className)}
    {...props}
  />
))
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem'
