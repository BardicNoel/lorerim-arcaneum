import { cn } from '@/lib/utils'
import { hydrateBuildData } from '@/shared/services/buildExportService'
import type { BuildState } from '@/shared/types/build'
import { Button } from '@/shared/ui/ui/button'
import {
  formatBuildForDiscord,
  formatBuildForDiscordNamesOnly,
} from '@/shared/utils/discordExportFormatter'
import { AlertCircle, Check, FileText, MessageSquare } from 'lucide-react'
import { useCallback, useState } from 'react'

interface ExportControlsProps {
  build: BuildState
  className?: string
}

type ExportMode = 'full' | 'names'

/**
 * Copy text to clipboard with fallback for older browsers
 */
async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      document.execCommand('copy')
    } catch (fallbackError) {
      throw new Error('Failed to copy to clipboard')
    } finally {
      document.body.removeChild(textArea)
    }
  }
}

/**
 * Export Controls Component
 *
 * Provides a toggle group for exporting builds with different detail levels
 */
export function ExportControls({ build, className }: ExportControlsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [successMode, setSuccessMode] = useState<ExportMode | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [activeMode, setActiveMode] = useState<ExportMode>('names')

  const handleExport = useCallback(
    async (mode: ExportMode) => {
      setIsExporting(true)
      setSuccessMode(null)
      setErrorMessage('')
      setActiveMode(mode)

      try {
        // Hydrate build data
        const hydratedData = hydrateBuildData(build)

        // Get the current build link
        const buildLink = window.location.href

        // Format for Discord based on mode
        const formattedText =
          mode === 'full'
            ? formatBuildForDiscord(hydratedData, buildLink)
            : formatBuildForDiscordNamesOnly(hydratedData, buildLink)

        // Copy to clipboard
        await copyToClipboard(formattedText)

        setSuccessMode(mode)
        setTimeout(() => setSuccessMode(null), 2000)
      } catch (error) {
        console.error('Discord export failed:', error)
        setErrorMessage(
          error instanceof Error ? error.message : 'Export failed'
        )
        setTimeout(() => setErrorMessage(''), 3000)
      } finally {
        setIsExporting(false)
      }
    },
    [build]
  )

  return (
    <div className={cn('relative', className)}>
      {/* Toggle Group */}
      <div className="flex rounded-md border border-input bg-background">
        <Button
          variant={
            isExporting ? 'ghost' : activeMode === 'names' ? 'default' : 'ghost'
          }
          size="sm"
          onClick={() => handleExport('names')}
          disabled={isExporting}
          className={cn(
            'rounded-r-none border-r',
            activeMode === 'names' &&
              !isExporting &&
              'bg-primary text-primary-foreground',
            successMode === 'names' &&
              'bg-green-600 hover:bg-green-700 text-white',
            errorMessage && 'bg-red-600 hover:bg-red-700 text-white'
          )}
          title={errorMessage || 'Export build to Discord format (short form)'}
          aria-label="Export build to Discord format (short form)"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
              <span className="ml-2">Exporting...</span>
            </>
          ) : successMode === 'names' ? (
            <>
              <Check className="w-4 h-4" />
              <span className="ml-2">Copied!</span>
            </>
          ) : errorMessage ? (
            <>
              <AlertCircle className="w-4 h-4" />
              <span className="ml-2">Error</span>
            </>
          ) : (
            <>
              <MessageSquare className="w-4 h-4" />
              <span className="ml-2">Export (short form)</span>
            </>
          )}
        </Button>
        <Button
          variant={
            isExporting ? 'ghost' : activeMode === 'full' ? 'default' : 'ghost'
          }
          size="sm"
          onClick={() => handleExport('full')}
          disabled={isExporting}
          className={cn(
            'rounded-l-none',
            activeMode === 'full' &&
              !isExporting &&
              'bg-primary text-primary-foreground',
            successMode === 'full' &&
              'bg-green-600 hover:bg-green-700 text-white',
            errorMessage && 'bg-red-600 hover:bg-red-700 text-white'
          )}
          title={errorMessage || 'Export build to Discord format (long form)'}
          aria-label="Export build to Discord format (long form)"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
              <span className="ml-2">Exporting...</span>
            </>
          ) : successMode === 'full' ? (
            <>
              <Check className="w-4 h-4" />
              <span className="ml-2">Copied!</span>
            </>
          ) : errorMessage ? (
            <>
              <AlertCircle className="w-4 h-4" />
              <span className="ml-2">Error</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span className="ml-2">Export (long form)</span>
            </>
          )}
        </Button>
      </div>

      {errorMessage && (
        <div
          className="absolute top-full left-0 mt-1 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-800 max-w-xs z-50"
          role="alert"
          aria-live="polite"
        >
          {errorMessage}
        </div>
      )}
    </div>
  )
}
