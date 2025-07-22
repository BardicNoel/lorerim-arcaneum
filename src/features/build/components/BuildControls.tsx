import React from 'react'
import { Button } from '@/shared/ui/ui/button'
import { RotateCcw } from 'lucide-react'
import { BuildLinkShareButton } from './ShareBuildButton'

interface BuildControlsProps {
  onReset: () => void
  className?: string
}

/**
 * Build Controls Component
 *
 * Handles the build control buttons (reset and share).
 * This follows the birthsigns pattern of feature-specific components
 * that delegate to shared UI components.
 */
export function BuildControls({ onReset, className }: BuildControlsProps) {
  return (
    <div className={`flex flex-wrap gap-2 mb-6 ${className || ''}`}>
      <Button
        variant="destructive"
        size="sm"
        className="text-destructive-foreground cursor-pointer hover:opacity-90"
        onClick={onReset}
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset Build
      </Button>
      <BuildLinkShareButton />
    </div>
  )
}
