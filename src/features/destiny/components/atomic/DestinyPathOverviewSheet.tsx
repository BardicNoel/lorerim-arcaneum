import { RotateCcw } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/ui/ui/sheet'
import { Button } from '@/shared/ui/ui/button'
import { ScrollArea } from '@/shared/ui/ui/scroll-area'
import { Badge } from '@/shared/ui/ui/badge'
import type { PathStep } from '../../stores/destinyStepperStore'

interface DestinyPathOverviewSheetProps {
  open: boolean
  steps: PathStep[]
  currentIndex: number
  onJump: (index: number) => void
  onClear: () => void
  onClose: () => void
}

export function DestinyPathOverviewSheet({
  open,
  steps,
  currentIndex,
  onJump,
  onClear,
  onClose,
}: DestinyPathOverviewSheetProps) {
  if (steps.length === 0) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Path Overview</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground mb-4">
              No destiny path selected yet
            </p>
            <Button onClick={onClose}>
              Start Building
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader className="flex flex-row items-center justify-between px-0">
          <SheetTitle className="flex-1 min-w-0">Path Overview</SheetTitle>
        </SheetHeader>
        
                 <ScrollArea className="flex-1 mt-6">
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  index === currentIndex
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => onJump(index)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={index === currentIndex ? "default" : "secondary"}>
                        {index + 1}
                      </Badge>
                      <h3 className="font-medium text-sm">
                        {step.name}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {step.summary}
                    </p>
                    
                    {/* Tags */}
                    {step.meta.tags && step.meta.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {step.meta.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {step.meta.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{step.meta.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {index === currentIndex && (
                    <div className="ml-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="mt-4 pt-4 border-t space-y-3">
          <div className="text-sm text-muted-foreground text-center">
            Tap any step to jump to that point in your path
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="w-full text-destructive hover:text-destructive border-destructive/20 hover:border-destructive/40"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Restart Path
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
