import React, { useMemo, type ElementType } from 'react'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { getBirthsignTextFormattingOptions } from '@/shared/utils/birthsignTextFormatting'

interface BirthsignFormattedTextProps {
  text: string
  className?: string
  as?: ElementType
}

export function BirthsignFormattedText({
  text,
  className,
  as,
}: BirthsignFormattedTextProps) {
  const options = useMemo(() => getBirthsignTextFormattingOptions(), [])

  return (
    <FormattedText
      text={text}
      options={options}
      className={className}
      as={as}
    />
  )
} 