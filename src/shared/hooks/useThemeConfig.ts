import { useMemo } from 'react'
import { themeColors, effectTypeColors, groupColors } from '@/shared/config/theme'

export function useThemeConfig() {
  return useMemo(
    () => ({
      colors: themeColors,
      effectColors: effectTypeColors,
      groupColors,
    }),
    []
  )
} 