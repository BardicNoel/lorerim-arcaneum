import { Alert, AlertDescription } from '@/shared/ui/ui/alert'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/ui/card'
import { Input } from '@/shared/ui/ui/input'
import { Label } from '@/shared/ui/ui/label'
import {
  AlertTriangle,
  CheckCircle,
  Copy,
  ExternalLink,
  Loader2,
  Upload,
} from 'lucide-react'
import { useState } from 'react'
import { useGigaPlannerExport } from '../hooks/useGigaPlannerExport'
import type { BuildState } from '../utils/transformation'

interface GigaPlannerExportCardProps {
  buildState: BuildState
  className?: string
}

export function GigaPlannerExportCard({
  buildState,
  className,
}: GigaPlannerExportCardProps) {
  const [perkListName, setPerkListName] = useState('LoreRim v3.0.4')
  const [gameMechanicsName, setGameMechanicsName] = useState('LoreRim v4')
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  const {
    isLoading,
    error,
    warnings,
    success,
    exportToUrl,
    copyUrlToClipboard,
    copyBuildCodeToClipboard,
    reset,
  } = useGigaPlannerExport()

  const handleExportUrl = async () => {
    const result = await exportToUrl(
      buildState,
      perkListName,
      gameMechanicsName
    )
    if (result?.url) {
      // URL is available in result.url
    }
  }

  const handleCopyUrl = async () => {
    const success = await copyUrlToClipboard(
      buildState,
      perkListName,
      gameMechanicsName
    )
    if (success) {
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    }
  }

  const handleCopyBuildCode = async () => {
    const success = await copyBuildCodeToClipboard(
      buildState,
      perkListName,
      gameMechanicsName
    )
    if (success) {
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const handleReset = () => {
    setCopiedUrl(false)
    setCopiedCode(false)
    reset()
  }

  const openGigaPlanner = () => {
    // This would open GigaPlanner in a new tab with the exported URL
    // For now, we'll just show a placeholder
    alert('This would open GigaPlanner with your exported build')
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Export to GigaPlanner
        </CardTitle>
        <CardDescription>
          Export your character build to GigaPlanner format
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Configuration */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="perk-list-name">Perk List</Label>
            <Input
              id="perk-list-name"
              value={perkListName}
              onChange={e => setPerkListName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="game-mechanics-name">Game Mechanics</Label>
            <Input
              id="game-mechanics-name"
              value={gameMechanicsName}
              onChange={e => setGameMechanicsName(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Export Actions */}
        <div className="space-y-2">
          <Button
            onClick={handleExportUrl}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Export to GigaPlanner
              </>
            )}
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCopyUrl}
              disabled={isLoading || !success}
              className="flex-1"
            >
              {copiedUrl ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy URL
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleCopyBuildCode}
              disabled={isLoading || !success}
              className="flex-1"
            >
              {copiedCode ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Code
                </>
              )}
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={openGigaPlanner}
            disabled={isLoading || !success}
            className="w-full"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in GigaPlanner
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Display */}
        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Character exported successfully!
              {warnings.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Warnings:</p>
                  <ul className="mt-1 space-y-1">
                    {warnings.map((warning, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Warnings Display (when no error) */}
        {!error && warnings.length > 0 && (
          <Alert variant="default">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Export completed with warnings:
                </p>
                <div className="space-y-1">
                  {warnings.map((warning, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="mr-1 mb-1"
                    >
                      {warning}
                    </Badge>
                  ))}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Reset Button */}
        {(success || error) && (
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full"
            disabled={isLoading}
          >
            Reset
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
