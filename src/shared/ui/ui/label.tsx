'use client'

import * as React from 'react'
import { Label as RadixLabel } from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

// Add explicit props interface
interface CustomLabelProps extends React.ComponentPropsWithoutRef<typeof RadixLabel>, VariantProps<typeof labelVariants> {
  children?: React.ReactNode;
  className?: string;
}

const Label = React.forwardRef<
  React.ElementRef<typeof RadixLabel>,
  CustomLabelProps
>(({ className, children, ...props }, ref) => (
  <RadixLabel
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  >
    {children}
  </RadixLabel>
))
Label.displayName = 'Label'

export { Label }
