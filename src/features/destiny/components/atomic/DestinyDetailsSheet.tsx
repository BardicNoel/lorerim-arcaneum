import { X, Check, BookOpen } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/ui/ui/sheet'
import { Button } from '@/shared/ui/ui/button'
import { Badge } from '@/shared/ui/ui/badge'
import { Separator } from '@/shared/ui/ui/separator'
import type { DestinyNode } from '@/shared/data/schemas'

interface DestinyDetailsSheetProps {
  open: boolean
  choice: DestinyNode | null
  onSelect: () => void
  onClose: () => void
}

export function DestinyDetailsSheet({
  open,
  choice,
  onSelect,
  onClose,
}: DestinyDetailsSheetProps) {
  if (!choice) return null

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh]">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle className="text-left">{choice.name}</SheetTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto mt-4 space-y-4">
          {/* Description */}
          <div>
            <h3 className="font-medium text-sm mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">
              {choice.description || 'No description available'}
            </p>
          </div>
          
          {/* Tags */}
          {choice.tags && choice.tags.length > 0 && (
            <div>
              <h3 className="font-medium text-sm mb-2">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {choice.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Level requirement */}
          {choice.levelRequirement && (
            <div>
              <h3 className="font-medium text-sm mb-2">Requirements</h3>
              <div className="text-sm text-muted-foreground">
                Level {choice.levelRequirement} required
              </div>
            </div>
          )}
          
          {/* Prerequisites */}
          {choice.prerequisites && choice.prerequisites.length > 0 && (
            <div>
              <h3 className="font-medium text-sm mb-2">Prerequisites</h3>
              <div className="space-y-1">
                {choice.prerequisites.map(prereq => (
                  <div key={prereq} className="text-sm text-muted-foreground">
                    • {prereq}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Lore */}
          {choice.lore && (
            <>
              <Separator />
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm">Lore</h3>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  {choice.lore}
                </p>
              </div>
            </>
          )}
        </div>
        
        {/* Actions */}
        <div className="mt-4 pt-4 border-t space-y-2">
          <Button
            onClick={onSelect}
            className="w-full"
            size="lg"
          >
            <Check className="h-4 w-4 mr-2" />
            Select This Destiny
          </Button>
          
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
