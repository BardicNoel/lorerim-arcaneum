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
import { AlertTriangle, CheckCircle, Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useGigaPlannerImport } from '../hooks/useGigaPlannerImport'
import type { BuildState } from '../utils/transformation'

interface GigaPlannerImportCardProps {
  onImport?: (buildState: BuildState) => void
  className?: string
}

export function GigaPlannerImportCard({
  onImport,
  className,
}: GigaPlannerImportCardProps) {
  const [url, setUrl] = useState('')
  const [buildCode, setBuildCode] = useState('')
  const [activeTab, setActiveTab] = useState<'url' | 'code'>('url')

  const {
    isLoading,
    error,
    warnings,
    success,
    importFromUrl,
    importFromBuildCode,
    reset,
  } = useGigaPlannerImport()

  const handleImportFromUrl = async () => {
    if (!url.trim()) return

    console.log('🚀 [Import Card] Starting URL import:', url.trim())
    const result = await importFromUrl(url.trim())
    console.log('📥 [Import Card] Import result received:', result)

    if (result?.buildState) {
      console.log(
        '✅ [Import Card] BuildState found, calling onImport:',
        result.buildState
      )
      if (onImport) {
        onImport(result.buildState)
        console.log('✅ [Import Card] onImport callback executed')
      } else {
        console.log('⚠️ [Import Card] No onImport callback provided')
      }
    } else {
      console.log('❌ [Import Card] No buildState in result or result is null')
    }
  }

  const handleImportFromBuildCode = async () => {
    if (!buildCode.trim()) return

    console.log(
      '🚀 [Import Card] Starting build code import:',
      buildCode.trim()
    )
    const result = await importFromBuildCode(buildCode.trim())
    console.log('📥 [Import Card] Import result received:', result)

    if (result?.buildState) {
      console.log(
        '✅ [Import Card] BuildState found, calling onImport:',
        result.buildState
      )
      if (onImport) {
        onImport(result.buildState)
        console.log('✅ [Import Card] onImport callback executed')
      } else {
        console.log('⚠️ [Import Card] No onImport callback provided')
      }
    } else {
      console.log('❌ [Import Card] No buildState in result or result is null')
    }
  }

  const handleReset = () => {
    setUrl('')
    setBuildCode('')
    reset()
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Import from GigaPlanner
        </CardTitle>
        <CardDescription>
          Import character builds from GigaPlanner URLs or build codes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex space-x-1">
          <Button
            variant={activeTab === 'url' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('url')}
          >
            URL
          </Button>
          <Button
            variant={activeTab === 'code' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('code')}
          >
            Build Code
          </Button>
        </div>

        {/* URL Import */}
        {activeTab === 'url' && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="gigaplanner-url">GigaPlanner URL</Label>
              <Input
                id="gigaplanner-url"
                placeholder="https://gigaplanner.com?b=..."
                value={url}
                onChange={e => setUrl(e.target.value)}
                disabled={isLoading}
              />
              <div className="text-xs text-muted-foreground">
                Example: https://gigaplanner.com?b=AgAAAAAA...
              </div>
            </div>
            <Button
              onClick={handleImportFromUrl}
              disabled={!url.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Import from URL
                </>
              )}
            </Button>
          </div>
        )}

        {/* Build Code Import */}
        {activeTab === 'code' && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="gigaplanner-build-code">Build Code</Label>
              <Input
                id="gigaplanner-build-code"
                placeholder="AgAAAAAA..."
                value={buildCode}
                onChange={e => setBuildCode(e.target.value)}
                disabled={isLoading}
              />
              <div className="text-xs text-muted-foreground">
                Example: AgAAAAAA...
              </div>
            </div>
            <Button
              onClick={handleImportFromBuildCode}
              disabled={!buildCode.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Import from Build Code
                </>
              )}
            </Button>
          </div>
        )}

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
              Character imported successfully!
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
                  Import completed with warnings:
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
