import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SidebarMenuSubButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isActive?: boolean;
}

export const SidebarMenuSubButton = React.forwardRef<HTMLButtonElement, SidebarMenuSubButtonProps>(
  ({ className, asChild, isActive, ...props }, ref) => {
    const Comp = asChild ? 'span' : 'button';
    return (
      <Comp
        ref={ref}
        data-active={isActive ? '' : undefined}
        className={cn(
          'group flex items-center w-full text-left px-3 py-1.5 text-sm rounded transition-colors',
          'hover:bg-skyrim-gold/10 hover:text-skyrim-gold',
          isActive ? 'bg-skyrim-gold/20 text-skyrim-gold border-l-2 border-skyrim-gold font-bold' : 'text-skyrim-gold/80 border-l-2 border-transparent',
          className
        )}
        tabIndex={0}
        {...props}
      />
    );
  }
);
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton'; 