import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  isActive?: boolean
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, asChild, isActive, ...props }, ref) => {
  const Comp = asChild ? 'span' : 'button'
  return (
    <Comp
      ref={ref}
      data-active={isActive ? '' : undefined}
      className={cn(
        'group flex items-center w-full text-left px-3 py-2 text-sm font-medium rounded transition-all duration-200 ease-in-out',
        'hover:bg-skyrim-gold/15 hover:text-skyrim-gold hover:shadow-md hover:scale-[1.02] hover:border-l-4',
        'active:scale-[0.98] active:bg-skyrim-gold/25',
        'cursor-pointer focus:outline-none focus:ring-2 focus:ring-skyrim-gold/50 focus:ring-offset-1',
        isActive
          ? 'bg-skyrim-gold/20 text-skyrim-gold border-l-4 border-skyrim-gold font-bold shadow-sm'
          : 'text-skyrim-gold/80 border-l-4 border-transparent',
        className
      )}
      tabIndex={0}
      {...props}
    />
  )
})
SidebarMenuButton.displayName = 'SidebarMenuButton'
