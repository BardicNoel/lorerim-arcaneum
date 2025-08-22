import { GigaPlannerToolsButton } from '@/features/gigaplanner/components/GigaPlannerToolsButton'
import type { BuildState } from '@/shared/types/build'
import { Button } from '@/shared/ui/ui/button'
import { RotateCcw } from 'lucide-react'
import { ExportControls } from './ExportControls'

interface BuildControlsProps {
  onReset: () => void
  build: BuildState
  onOpenGigaPlannerTools?: () => void
  className?: string
}

/**
 * Build Controls Component
 *
 * Handles the build control buttons (reset and share).
 * This follows the birthsigns pattern of feature-specific components
 * that delegate to shared UI components.
 */
export function BuildControls({
  onReset,
  build,
  onOpenGigaPlannerTools,
  className,
}: BuildControlsProps) {
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
      <ExportControls build={build} />
      {onOpenGigaPlannerTools && (
        <GigaPlannerToolsButton onClick={onOpenGigaPlannerTools} />
      )}
    </div>
  )
}
