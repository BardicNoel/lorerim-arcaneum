import { CheckCircle, RotateCcw, Share2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Button } from '@/shared/ui/ui/button'
import { Badge } from '@/shared/ui/ui/badge'
import type { PathStep } from '../../stores/destinyStepperStore'

interface DestinyCompletionCardProps {
  steps: PathStep[]
  onRestart: () => void
  onShare: () => void
}

export function DestinyCompletionCard({ steps, onRestart, onShare }: DestinyCompletionCardProps) {
  return (
    <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <CardTitle className="text-base text-green-800 dark:text-green-200">
            Destiny Path Complete!
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-green-700 dark:text-green-300 mb-4">
          You have successfully built a destiny path with {steps.length} steps.
        </p>
        
        {/* Path summary */}
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2 text-green-800 dark:text-green-200">
            Your Path:
          </h4>
          <div className="space-y-1">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-2 text-sm">
                <Badge variant="outline" className="text-xs">
                  {index + 1}
                </Badge>
                <span className="text-green-700 dark:text-green-300">
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRestart}
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Start Over
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="flex-1"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Path
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
