import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, collapsed, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        data-collapsed={collapsed ? '' : undefined}
        className={cn(
          'relative flex flex-col bg-skyrim-dark border-r border-skyrim-gold/20 min-h-screen transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          className
        )}
        {...props}
      />
    );
  }
);
Sidebar.displayName = 'Sidebar'; 