import { Edit3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Button } from '@/shared/ui/ui/button'
import { Badge } from '@/shared/ui/ui/badge'
import type { PathStep } from '../../stores/destinyStepperStore'

interface DestinyCurrentStepCardProps {
  step: PathStep
  onChange: () => void
}

export function DestinyCurrentStepCard({ step, onChange }: DestinyCurrentStepCardProps) {
  return (
    <Card className="border-primary/20 bg-primary/5 relative overflow-hidden">
      {/* Selected indicator */}
      <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <CardTitle className="text-base font-medium text-primary">
              {step.name}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onChange}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <Edit3 className="h-4 w-4" />
            <span className="sr-only">Change step</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3">
          {step.summary}
        </p>
        
        {/* Tags */}
        {step.meta.tags && step.meta.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {step.meta.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Level requirement */}
        {step.meta.levelRequirement && (
          <div className="mt-2 text-xs text-muted-foreground">
            Level {step.meta.levelRequirement} required
          </div>
        )}
      </CardContent>
    </Card>
  )
}
