import { useCallback, useState } from 'react'
import { GigaPlannerConverter } from '../adapters/gigaplannerConverter'
import { transformGigaPlannerToBuildState } from '../utils/transformation'
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
  const [transformer, setTransformer] = useState<typeof transformGigaPlannerToBuildState | null>(null)

  // Initialize the converter and transformer
  const initialize = useCallback(async () => {
    console.log('🔄 [GigaPlanner Import] Initialize called')
    console.log('🔧 [GigaPlanner Import] Current converter:', !!converter)
    console.log('🔧 [GigaPlanner Import] Current transformer:', !!transformer)
    
    if (converter && transformer) {
      console.log('✅ [GigaPlanner Import] Already initialized, skipping')
      return { converter, transformer } // Already initialized
    }

    console.log('🔄 [GigaPlanner Import] Starting initialization...')
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      console.log('🔄 [GigaPlanner Import] Creating GigaPlannerConverter...')
      // Initialize converter
      const newConverter = new GigaPlannerConverter()
      console.log('🔄 [GigaPlanner Import] Initializing converter...')
      await newConverter.initialize()
      console.log('✅ [GigaPlanner Import] Converter initialized successfully')

      console.log('🔄 [GigaPlanner Import] Loading transformation function...')
      // Load the transformation function
      const { transformGigaPlannerToBuildState } = await import('../utils/transformation')
      console.log('✅ [GigaPlanner Import] Transformation function loaded successfully')

      console.log('🔄 [GigaPlanner Import] Setting converter and transformer...')
      setConverter(newConverter)
      setTransformer(() => transformGigaPlannerToBuildState)
      setState(prev => ({ ...prev, isLoading: false, success: true }))
      console.log('✅ [GigaPlanner Import] Initialization completed successfully')
      
      return { converter: newConverter, transformer: transformGigaPlannerToBuildState }
    } catch (error) {
      console.log('💥 [GigaPlanner Import] Initialization error:', error)
      console.log('💥 [GigaPlanner Import] Error type:', typeof error)
      console.log('💥 [GigaPlanner Import] Error message:', error instanceof Error ? error.message : String(error))
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to initialize GigaPlanner import',
        success: false,
      }))
      
      return null
    }
  }, [converter, transformer])

  // Import from GigaPlanner URL
  const importFromUrl = useCallback(
    async (url: string): Promise<GigaPlannerImportResult | null> => {
      console.log('🚀 [GigaPlanner Import] importFromUrl called with URL:', url)
      console.log('🔧 [GigaPlanner Import] Initial converter state:', !!converter)
      console.log('🔧 [GigaPlanner Import] Initial transformer state:', !!transformer)
      
      let currentConverter = converter
      let currentTransformer = transformer
      
      if (!currentConverter || !currentTransformer) {
        console.log('🔄 [GigaPlanner Import] Converter or transformer missing, initializing...')
        const initResult = await initialize()
        
        if (!initResult) {
          console.log('❌ [GigaPlanner Import] Initialization failed')
          return null
        }
        
        currentConverter = initResult.converter
        currentTransformer = initResult.transformer
        
        console.log('🔧 [GigaPlanner Import] After initialization - converter:', !!currentConverter)
        console.log('🔧 [GigaPlanner Import] After initialization - transformer:', !!currentTransformer)
      }

      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        warnings: [],
      }))

      console.log('🚀 [GigaPlanner Import] About to start import process...')
              console.log('🔧 [GigaPlanner Import] Converter available:', !!currentConverter)
        console.log('🔧 [GigaPlanner Import] Transformer available:', !!currentTransformer)
        console.log('🔧 [GigaPlanner Import] Converter instance:', currentConverter)
        console.log('🔧 [GigaPlanner Import] Transformer instance:', currentTransformer)
      
      try {
        console.log('🔄 [GigaPlanner Import] Starting import process for URL:', url)
        
        // Decode the GigaPlanner URL
        const decodeResult = currentConverter!.decodeUrl(url)
        console.log('📥 [GigaPlanner Import] Decode result:', decodeResult)

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
          console.log('❌ [GigaPlanner Import] No character data found in decode result')
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: 'No character data found in URL',
            success: false,
          }))
          return null
        }
        
        console.log('👤 [GigaPlanner Import] Character data found:', decodeResult.character)

        // Transform to our BuildState format
        console.log('🔄 [GigaPlanner Import] Starting transformation to BuildState...')
        const transformResult = await currentTransformer!(decodeResult.character)
        console.log('🔀 [GigaPlanner Import] Transform result:', transformResult)

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

        const result = {
          buildState: transformResult.data || null,
          warnings,
        }
        
        console.log('✅ [GigaPlanner Import] Import completed successfully!')
        console.log('📦 [GigaPlanner Import] Final result:', result)
        
        return result
      } catch (error) {
        console.log('💥 [GigaPlanner Import] Error caught during import:', error)
        console.log('💥 [GigaPlanner Import] Error type:', typeof error)
        console.log('💥 [GigaPlanner Import] Error message:', error instanceof Error ? error.message : String(error))
        
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
      let currentConverter = converter
      let currentTransformer = transformer
      
      if (!currentConverter || !currentTransformer) {
        const initResult = await initialize()
        
        if (!initResult) {
          return null
        }
        
        currentConverter = initResult.converter
        currentTransformer = initResult.transformer
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
