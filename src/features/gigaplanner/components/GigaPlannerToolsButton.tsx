import { Button } from '@/shared/ui/ui/button'
import { Settings } from 'lucide-react'

interface GigaPlannerToolsButtonProps {
  onClick: () => void
  className?: string
}

export function GigaPlannerToolsButton({
  onClick,
  className,
}: GigaPlannerToolsButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={className}
      title="GigaPlanner Tools - Import character builds"
      aria-label="Open GigaPlanner tools"
    >
      <Settings className="w-4 h-4 mr-2" />
      GigaPlanner Tools
    </Button>
  )
}
