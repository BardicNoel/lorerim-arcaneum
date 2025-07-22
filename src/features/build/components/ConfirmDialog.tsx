import React from 'react'
import { GenericConfirmDialog } from '@/shared/components/generic/ConfirmDialog'

interface ConfirmDialogProps {
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

/**
 * Confirm Dialog Component
 *
 * Feature-specific wrapper around GenericConfirmDialog that provides
 * consistent confirmation dialogs throughout the application.
 *
 * This follows the birthsigns pattern of feature-specific wrappers
 * around generic components for better separation of concerns.
 */
export function ConfirmDialog({
  open,
  title,
  message,
  variant = 'warning',
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  className,
}: ConfirmDialogProps) {
  return (
    <GenericConfirmDialog
      open={open}
      title={title}
      message={message}
      variant={variant}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      onCancel={onCancel}
      className={className}
    />
  )
}

/**
 * Build Reset Confirmation Dialog
 *
 * Specialized confirmation dialog for resetting character builds.
 * This demonstrates how to create domain-specific dialog variants.
 */
export function BuildResetConfirmDialog({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <ConfirmDialog
      open={open}
      title="Reset Build?"
      message="This will clear all selections and start a new build. This action cannot be undone."
      variant="warning"
      confirmText="Confirm Reset"
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  )
}
