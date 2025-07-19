import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SidebarMenuSubProps
  extends React.HTMLAttributes<HTMLUListElement> {}

export const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  SidebarMenuSubProps
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      'ml-4 pl-3 border-l-2 border-skyrim-gold/20 flex flex-col gap-0.5',
      className
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = 'SidebarMenuSub'
