import { ChevronLeft, MoreVertical, Map } from 'lucide-react'
import { Button } from '@/shared/ui/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/ui/dropdown-menu'

interface DestinyStepperHeaderProps {
  stepIndex: number
  totalSteps: number
  title: string
  onBack: () => void
  onOverview: () => void
  onClear: () => void
  canBack: boolean
}

export function DestinyStepperHeader({
  stepIndex,
  totalSteps,
  title,
  onBack,
  onOverview,
  onClear,
  canBack,
}: DestinyStepperHeaderProps) {
  const stepText = totalSteps > 0 ? `${stepIndex + 1} of ${totalSteps}` : 'Start'

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Back button */}
        <div className="flex items-center space-x-2">
          {canBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Go back</span>
            </Button>
          )}
        </div>

        {/* Center: Step info */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground truncate max-w-[200px]">
            {title}
          </div>
          <div className="text-xs text-muted-foreground">
            {stepText}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOverview}
            className="h-8 w-8 p-0"
          >
            <Map className="h-4 w-4" />
            <span className="sr-only">Path overview</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onClear}>
                Clear Path
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
