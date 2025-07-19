import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SidebarMenuProps
  extends React.HTMLAttributes<HTMLUListElement> {}

export const SidebarMenu = React.forwardRef<HTMLUListElement, SidebarMenuProps>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn('flex flex-col gap-0.5 list-none p-0 m-0', className)}
      {...props}
    />
  )
)
SidebarMenu.displayName = 'SidebarMenu'
