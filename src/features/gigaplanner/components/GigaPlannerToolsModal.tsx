import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/ui/dialog'
import type { BuildState } from '../utils/transformation'
import { GigaPlannerImportCard } from './GigaPlannerImportCard'

interface GigaPlannerToolsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport?: (buildState: BuildState) => void
}

export function GigaPlannerToolsModal({
  open,
  onOpenChange,
  onImport,
}: GigaPlannerToolsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>GigaPlanner Tools</DialogTitle>
          <DialogDescription>
            Import character builds from GigaPlanner URLs or build codes.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <GigaPlannerImportCard onImport={onImport} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
