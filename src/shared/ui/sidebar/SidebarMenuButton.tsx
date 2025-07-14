import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isActive?: boolean;
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, asChild, isActive, ...props }, ref) => {
    const Comp = asChild ? 'span' : 'button';
    return (
      <Comp
        ref={ref}
        data-active={isActive ? '' : undefined}
        className={cn(
          'group flex items-center w-full text-left px-3 py-2 text-sm font-medium rounded transition-colors',
          'hover:bg-skyrim-gold/10 hover:text-skyrim-gold',
          'cursor-pointer',
          isActive ? 'bg-skyrim-gold/20 text-skyrim-gold border-l-2 border-skyrim-gold font-bold' : 'text-skyrim-gold/80 border-l-2 border-transparent',
          className
        )}
        tabIndex={0}
        {...props}
      />
    );
  }
);
SidebarMenuButton.displayName = 'SidebarMenuButton'; 