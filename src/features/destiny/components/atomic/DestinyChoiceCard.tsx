import { Info, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Button } from '@/shared/ui/ui/button'
import { Badge } from '@/shared/ui/ui/badge'
import type { DestinyNode } from '@/shared/data/schemas'

interface DestinyChoiceCardProps {
  choice: DestinyNode
  onOpenDetails: () => void
  onSelect: () => void
}

export function DestinyChoiceCard({ choice, onOpenDetails, onSelect }: DestinyChoiceCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow border-2 border-dashed border-muted hover:border-primary/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
            <CardTitle className="text-base font-medium">
              {choice.name}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenDetails}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <Info className="h-4 w-4" />
            <span className="sr-only">View details</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {choice.description || 'No description available'}
        </p>
        
        {/* Tags */}
        {choice.tags && choice.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {choice.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Level requirement */}
        {choice.levelRequirement && (
          <div className="text-xs text-muted-foreground mb-3">
            Level {choice.levelRequirement} required
          </div>
        )}
        
        {/* Select button */}
        <Button
          onClick={onSelect}
          className="w-full"
          size="sm"
        >
          <Check className="h-4 w-4 mr-2" />
          Select
        </Button>
      </CardContent>
    </Card>
  )
}
