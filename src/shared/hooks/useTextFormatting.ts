import { useMemo } from 'react'
import {
  parseFormattedText,
  type TextFormattingOptions,
} from '@/shared/utils/textFormatting'

export function useTextFormatting(
  text: string,
  options?: TextFormattingOptions
) {
  return useMemo(() => {
    if (!text) return []
    return parseFormattedText(text, options)
  }, [text, options])
}
