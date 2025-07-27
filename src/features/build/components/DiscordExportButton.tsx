import { cn } from '@/lib/utils'
import { hydrateBuildData } from '@/shared/services/buildExportService'
import type { BuildState } from '@/shared/types/build'
import { Button } from '@/shared/ui/ui/button'
import { formatBuildForDiscord } from '@/shared/utils/discordExportFormatter'
import { AlertCircle, Check, MessageSquare } from 'lucide-react'
import { useCallback, useState } from 'react'

interface DiscordExportButtonProps {
  build: BuildState
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'lg'
  className?: string
}

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
 * Discord Export Button Component
 *
 * Exports the current build to Discord format and copies to clipboard
 */
export function DiscordExportButton({
  build,
  variant = 'outline',
  size = 'sm',
  className,
}: DiscordExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleExport = useCallback(async () => {
    setIsExporting(true)
    setExportStatus('idle')
    setErrorMessage('')

    try {
      // Hydrate build data
      const hydratedData = hydrateBuildData(build)

      // Format for Discord
      const formattedText = formatBuildForDiscord(hydratedData)

      // Copy to clipboard
      await copyToClipboard(formattedText)

      setExportStatus('success')
      setTimeout(() => setExportStatus('idle'), 2000)
    } catch (error) {
      console.error('Discord export failed:', error)
      setExportStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Export failed')
      setTimeout(() => setExportStatus('idle'), 3000)
    } finally {
      setIsExporting(false)
    }
  }, [build])

  const getButtonContent = () => {
    if (isExporting) {
      return (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
          <span className="ml-2">Exporting...</span>
        </>
      )
    }

    if (exportStatus === 'success') {
      return (
        <>
          <Check className="w-4 h-4" />
          <span className="ml-2">Copied!</span>
        </>
      )
    }

    if (exportStatus === 'error') {
      return (
        <>
          <AlertCircle className="w-4 h-4" />
          <span className="ml-2">Error</span>
        </>
      )
    }

    return (
      <>
        <MessageSquare className="w-4 h-4" />
        <span className="ml-2">Export to Discord</span>
      </>
    )
  }

  const getButtonVariant = () => {
    if (exportStatus === 'success') return 'default'
    if (exportStatus === 'error') return 'destructive'
    return variant
  }

  return (
    <div className="relative">
      <Button
        variant={getButtonVariant()}
        size={size}
        onClick={handleExport}
        disabled={isExporting}
        className={cn(
          'transition-all duration-200',
          exportStatus === 'success' && 'bg-green-600 hover:bg-green-700',
          exportStatus === 'error' && 'bg-red-600 hover:bg-red-700',
          className
        )}
        title={errorMessage || 'Export build to Discord format'}
        aria-label="Export build to Discord format"
      >
        {getButtonContent()}
      </Button>

      {errorMessage && exportStatus === 'error' && (
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
