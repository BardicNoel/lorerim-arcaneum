import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Input } from '@/shared/ui/ui/input'
import { Label } from '@/shared/ui/ui/label'
import { Badge } from '@/shared/ui/ui/badge'
import { cn } from '@/lib/utils'
import {
  getTraitLimitColor,
  getTraitLimitIcon,
  getBackgroundColor,
  getBorderColor,
  buildSpacing,
} from '@/shared/config/buildConfig'
import { AlertTriangle, Info, Circle, Star } from 'lucide-react'

interface GenericConfigCardProps {
  title: string
  description?: string
  icon?: React.ReactNode
  variant?: 'default' | 'warning' | 'info' | 'error'
  children?: React.ReactNode
  className?: string
}

interface ConfigInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  currentCount?: number
  type?: 'regular' | 'bonus'
  className?: string
}

interface ConfigAlertProps {
  type: 'warning' | 'info' | 'error' | 'success'
  title: string
  message: string
  className?: string
}

// Generic Config Card - follows birthsigns pattern
export function GenericConfigCard({
  title,
  description,
  icon,
  variant = 'default',
  children,
  className,
}: GenericConfigCardProps) {
  const getIcon = () => {
    if (icon) return icon
    switch (variant) {
      case 'warning':
        return (
          <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        )
      case 'info':
        return <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      default:
        return null
    }
  }

  return (
    <Card className={cn(buildSpacing.card, className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getIcon()}
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className={cn(buildSpacing.section)}>{children}</CardContent>
    </Card>
  )
}

// Config Input Component
export function ConfigInput({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  currentCount,
  type = 'regular',
  className,
}: ConfigInputProps) {
  const getTypeIcon = () => {
    switch (type) {
      case 'regular':
        return <Circle className="h-4 w-4" />
      case 'bonus':
        return <Star className="h-4 w-4" />
      default:
        return null
    }
  }

  const getTypeColor = () => {
    return getTraitLimitColor(type)
  }

  return (
    <div className={cn(buildSpacing.item, className)}>
      <div className="flex items-center gap-2 mb-2">
        {getTypeIcon()}
        <Label htmlFor={`${type}-limit`} className={getTypeColor()}>
          {label}
        </Label>
      </div>
      <Input
        id={`${type}-limit`}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(parseInt(e.target.value) || 0)}
        className="mt-1"
      />
      {currentCount !== undefined && (
        <p className="text-xs text-muted-foreground mt-1">
          Currently selected: {currentCount}
        </p>
      )}
    </div>
  )
}

// Config Alert Component
export function ConfigAlert({
  type,
  title,
  message,
  className,
}: ConfigAlertProps) {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return (
          <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        )
      case 'info':
        return <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      case 'error':
        return (
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
        )
      case 'success':
        return <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        'flex items-start gap-2 p-4 rounded-lg border',
        getBackgroundColor(type),
        getBorderColor(type),
        className
      )}
    >
      {getIcon()}
      <div className="text-sm">
        <strong>{title}</strong>
        <p className="mt-1">{message}</p>
      </div>
    </div>
  )
}
