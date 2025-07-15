import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex-1 flex flex-col justify-start overflow-y-auto px-2 py-2', className)}
      {...props}
    />
  )
);
SidebarContent.displayName = 'SidebarContent'; 