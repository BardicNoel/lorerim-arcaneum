import React from 'react'
import { Button } from '@/shared/ui/ui/button'
import { cn } from '@/lib/utils'
import {
  getConfirmDialogColor,
  getConfirmDialogIcon,
  getBackgroundColor,
  getBorderColor,
} from '@/shared/config/buildConfig'
import { AlertTriangle, Info, XCircle, CheckCircle } from 'lucide-react'

interface GenericConfirmDialogProps {
  open: boolean
  title: string
  message: string
  variant?: 'warning' | 'info' | 'error' | 'success'
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  className?: string
}

export function GenericConfirmDialog({
  open,
  title,
  message,
  variant = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  className,
}: GenericConfirmDialogProps) {
  if (!open) return null

  const getIcon = () => {
    switch (variant) {
      case 'warning':
        return (
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        )
      case 'info':
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
      case 'success':
        return (
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
        )
      default:
        return (
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        )
    }
  }

  const getConfirmVariant = () => {
    switch (variant) {
      case 'error':
        return 'destructive'
      case 'success':
        return 'default'
      default:
        return 'default'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div
        className={cn(
          'bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-xs space-y-4 border',
          getBorderColor(variant),
          className
        )}
      >
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="font-semibold">{title}</span>
        </div>

        <p className="text-sm text-muted-foreground">{message}</p>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant={getConfirmVariant()} size="sm" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
