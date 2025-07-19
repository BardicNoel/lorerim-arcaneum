import React from 'react'
import { Switch } from '@/shared/ui/ui/switch'
import { Label } from '@/shared/ui/ui/label'
import { cn } from '@/lib/utils'

interface SwitchCardProps {
  title: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
  disabled?: boolean
  onClick?: () => void
  showSwitch?: boolean
}

export function SwitchCard({
  title,
  description,
  checked,
  onCheckedChange,
  className,
  disabled = false,
  onClick,
  showSwitch = true
}: SwitchCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (!disabled) {
      onCheckedChange(!checked)
    }
  }

  return (
    <div 
      className={cn(
        "flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1 min-h-[80px] cursor-pointer hover:bg-muted/50 transition-colors",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={handleClick}
    >
      <div className="space-y-0.5">
        <Label className="text-base font-medium">{title}</Label>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {showSwitch && (
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
      )}
    </div>
  )
} 