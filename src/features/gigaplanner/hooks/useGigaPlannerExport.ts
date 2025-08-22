import { useCallback, useState } from 'react'
import { GigaPlannerConverter } from '../adapters/gigaplannerConverter'
import { AdvancedGigaPlannerTransformer } from '../utils/advancedTransformation'
import type { BuildState } from '../utils/transformation'

export interface GigaPlannerExportState {
  isLoading: boolean
  error: string | null
  warnings: string[]
  success: boolean
}

export interface GigaPlannerExportResult {
  url: string | null
  buildCode: string | null
  warnings: string[]
}

export function useGigaPlannerExport() {
  const [state, setState] = useState<GigaPlannerExportState>({
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
            : 'Failed to initialize GigaPlanner export',
        success: false,
      }))
    }
  }, [converter, transformer])

  // Export BuildState to GigaPlanner URL
  const exportToUrl = useCallback(
    async (
      buildState: BuildState,
      perkListName: string = 'LoreRim v3.0.4',
      gameMechanicsName: string = 'LoreRim v4'
    ): Promise<GigaPlannerExportResult | null> => {
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
        // Transform BuildState to GigaPlanner format
        const transformResult = transformer.transformBuildStateToGigaPlanner(
          buildState,
          perkListName,
          gameMechanicsName
        )

        if (!transformResult.success) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: transformResult.error || 'Failed to transform build state',
            success: false,
          }))
          return null
        }

        if (!transformResult.data) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: 'No character data generated',
            success: false,
          }))
          return null
        }

        // Encode to GigaPlanner URL
        const encodeResult = converter.encodeUrl(transformResult.data)

        if (!encodeResult.success) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: encodeResult.error || 'Failed to encode GigaPlanner URL',
            success: false,
          }))
          return null
        }

        // Extract build code from URL
        const url = encodeResult.url
        const buildCode = url ? url.split('?b=')[1]?.split('&')[0] : null

        const warnings = transformResult.warnings || []

        setState(prev => ({
          ...prev,
          isLoading: false,
          warnings,
          success: true,
        }))

        return {
          url,
          buildCode,
          warnings,
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to export to GigaPlanner URL',
          success: false,
        }))
        return null
      }
    },
    [converter, transformer, initialize]
  )

  // Export BuildState to build code only
  const exportToBuildCode = useCallback(
    async (
      buildState: BuildState,
      perkListName: string = 'LoreRim v3.0.4',
      gameMechanicsName: string = 'LoreRim v4'
    ): Promise<GigaPlannerExportResult | null> => {
      const result = await exportToUrl(
        buildState,
        perkListName,
        gameMechanicsName
      )
      if (result) {
        return {
          url: null,
          buildCode: result.buildCode,
          warnings: result.warnings,
        }
      }
      return null
    },
    [exportToUrl]
  )

  // Copy URL to clipboard
  const copyUrlToClipboard = useCallback(
    async (
      buildState: BuildState,
      perkListName: string = 'LoreRim v3.0.4',
      gameMechanicsName: string = 'LoreRim v4'
    ): Promise<boolean> => {
      const result = await exportToUrl(
        buildState,
        perkListName,
        gameMechanicsName
      )

      if (!result?.url) {
        return false
      }

      try {
        await navigator.clipboard.writeText(result.url)
        return true
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to copy URL to clipboard',
        }))
        return false
      }
    },
    [exportToUrl]
  )

  // Copy build code to clipboard
  const copyBuildCodeToClipboard = useCallback(
    async (
      buildState: BuildState,
      perkListName: string = 'LoreRim v3.0.4',
      gameMechanicsName: string = 'LoreRim v4'
    ): Promise<boolean> => {
      const result = await exportToBuildCode(
        buildState,
        perkListName,
        gameMechanicsName
      )

      if (!result?.buildCode) {
        return false
      }

      try {
        await navigator.clipboard.writeText(result.buildCode)
        return true
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to copy build code to clipboard',
        }))
        return false
      }
    },
    [exportToBuildCode]
  )

  // Reset the export state
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
    exportToUrl,
    exportToBuildCode,
    copyUrlToClipboard,
    copyBuildCodeToClipboard,
    reset,

    // Utilities
    isInitialized: !!converter && !!transformer,
  }
}
