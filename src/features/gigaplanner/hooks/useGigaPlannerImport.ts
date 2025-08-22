import { useCallback, useState } from 'react'
import { GigaPlannerConverter } from '../adapters/gigaplannerConverter'
import { AdvancedGigaPlannerTransformer } from '../utils/advancedTransformation'
import type { BuildState } from '../utils/transformation'

export interface GigaPlannerImportState {
  isLoading: boolean
  error: string | null
  warnings: string[]
  success: boolean
}

export interface GigaPlannerImportResult {
  buildState: BuildState | null
  warnings: string[]
}

export function useGigaPlannerImport() {
  const [state, setState] = useState<GigaPlannerImportState>({
    isLoading: false,
    error: null,
    warnings: [],
    success: false,
  })

  const [converter, setConverter] = useState<GigaPlannerConverter | null>(null)
  const [transformer, setTransformer] =
    useState<AdvancedGigaPlannerTransformer | null>(null)

  // Initialize the converter and transformer
  const initialize = useCallback(async () => {
    if (converter && transformer) return // Already initialized

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Initialize converter
      const newConverter = new GigaPlannerConverter()
      await newConverter.initialize()

      // Initialize transformer
      const newTransformer = new AdvancedGigaPlannerTransformer()
      await newTransformer.initialize()

      setConverter(newConverter)
      setTransformer(newTransformer)
      setState(prev => ({ ...prev, isLoading: false, success: true }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to initialize GigaPlanner import',
        success: false,
      }))
    }
  }, [converter, transformer])

  // Import from GigaPlanner URL
  const importFromUrl = useCallback(
    async (url: string): Promise<GigaPlannerImportResult | null> => {
      if (!converter || !transformer) {
        await initialize()
        if (!converter || !transformer) {
          return null
        }
      }

      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        warnings: [],
      }))

      try {
        // Decode the GigaPlanner URL
        const decodeResult = converter.decodeUrl(url)

        if (!decodeResult.success) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: decodeResult.error || 'Failed to decode GigaPlanner URL',
            success: false,
          }))
          return null
        }

        if (!decodeResult.character) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: 'No character data found in URL',
            success: false,
          }))
          return null
        }

        // Transform to our BuildState format
        const transformResult = transformer.transformGigaPlannerToBuildState(
          decodeResult.character
        )

        if (!transformResult.success) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error:
              transformResult.error || 'Failed to transform character data',
            success: false,
          }))
          return null
        }

        const warnings = [
          ...(decodeResult.preset
            ? [`Imported from preset: ${decodeResult.preset}`]
            : []),
          ...(transformResult.warnings || []),
        ]

        setState(prev => ({
          ...prev,
          isLoading: false,
          warnings,
          success: true,
        }))

        return {
          buildState: transformResult.data || null,
          warnings,
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to import from GigaPlanner URL',
          success: false,
        }))
        return null
      }
    },
    [converter, transformer, initialize]
  )

  // Import from build code (for testing or direct input)
  const importFromBuildCode = useCallback(
    async (buildCode: string): Promise<GigaPlannerImportResult | null> => {
      if (!converter || !transformer) {
        await initialize()
        if (!converter || !transformer) {
          return null
        }
      }

      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        warnings: [],
      }))

      try {
        // Create a mock URL with the build code
        const mockUrl = `https://gigaplanner.com?b=${buildCode}`
        return await importFromUrl(mockUrl)
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to import from build code',
          success: false,
        }))
        return null
      }
    },
    [converter, transformer, initialize, importFromUrl]
  )

  // Reset the import state
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      warnings: [],
      success: false,
    })
  }, [])

  return {
    // State
    isLoading: state.isLoading,
    error: state.error,
    warnings: state.warnings,
    success: state.success,

    // Actions
    initialize,
    importFromUrl,
    importFromBuildCode,
    reset,

    // Utilities
    isInitialized: !!converter && !!transformer,
  }
}
