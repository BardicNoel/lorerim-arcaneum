import * as React from 'react'
import { cn } from '@/lib/utils'

interface RadioGroupProps {
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

interface RadioGroupItemProps {
  value: string
  id: string
  className?: string
}

interface LabelProps {
  children: React.ReactNode
  htmlFor?: string
  className?: string
}

export function RadioGroup({
  children,
  value,
  onValueChange,
  className,
}: RadioGroupProps) {
  return <div className={cn('space-y-2', className)}>{children}</div>
}

export function RadioGroupItem({ value, id, className }: RadioGroupItemProps) {
  return (
    <input
      type="radio"
      value={value}
      id={id}
      className={cn(
        'h-4 w-4 border-gray-300 text-primary focus:ring-primary',
        className
      )}
    />
  )
}

export function Label({ children, htmlFor, className }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
    >
      {children}
    </label>
  )
}
