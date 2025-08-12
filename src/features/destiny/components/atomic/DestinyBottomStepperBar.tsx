import { ChevronLeft, Map } from 'lucide-react'
import { Button } from '@/shared/ui/ui/button'

interface DestinyBottomStepperBarProps {
  canBack: boolean
  canNext: boolean
  onBack: () => void
  onOverview: () => void
}

export function DestinyBottomStepperBar({
  canBack,
  canNext,
  onBack,
  onOverview,
}: DestinyBottomStepperBarProps) {
  return (
    <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Back button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          disabled={!canBack}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>

        {/* Center: Progress indicator */}
        <div className="flex-1 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOverview}
            className="flex items-center space-x-2"
          >
            <Map className="h-4 w-4" />
            <span>Path Overview</span>
          </Button>
        </div>

        {/* Right: Next button (disabled in stepper mode) */}
        <Button
          variant="outline"
          size="sm"
          disabled={!canNext}
          className="flex items-center space-x-2 opacity-50"
        >
          <span>Next</span>
        </Button>
      </div>
    </div>
  )
}
