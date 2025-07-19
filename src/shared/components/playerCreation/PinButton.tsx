import React from 'react'
import { Button } from '@/shared/ui/ui/button'
import { Pin, PinOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PinButtonProps {
  itemId: string
  isPinned?: boolean
  onToggle?: (itemId: string) => void
  className?: string
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export function PinButton({
  itemId,
  isPinned = false,
  onToggle,
  className,
  size = 'sm',
  variant = 'ghost',
  onClick,
}: PinButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    // Call custom onClick handler if provided
    if (onClick) {
      onClick(e)
      return
    }

    // Default toggle behavior
    if (onToggle) {
      onToggle(itemId)
    }
    // For now, this is a placeholder - no functionality
    console.log(`Pin button clicked for item: ${itemId}`)
  }

  return (
    <Button
      onClick={handleClick}
      size={size}
      variant={variant}
      className={cn(
        'transition-all duration-200 group relative overflow-hidden',
        isPinned
          ? 'text-skyrim-gold hover:text-skyrim-gold/80 hover:scale-110 hover:shadow-md'
          : 'hover:bg-muted hover:text-foreground hover:scale-110 hover:shadow-md',
        className
      )}
      title={isPinned ? 'Unpin this item' : 'Pin this item for quick reference'}
    >
      <span className="relative z-10 transition-transform duration-200 group-hover:scale-110">
        {isPinned ? (
          <Pin className="h-4 w-4 fill-current" />
        ) : (
          <PinOff className="h-4 w-4" />
        )}
      </span>
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />
    </Button>
  )
}
