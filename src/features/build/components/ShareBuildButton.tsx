import React from 'react'
import { GenericShareButton } from '@/shared/components/generic/ShareButton'

interface ShareBuildButtonProps {
  link: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'lg'
  text?: string
  onCopied?: () => void
  className?: string
}

/**
 * Share Build Button Component
 *
 * Feature-specific wrapper around GenericShareButton that handles
 * sharing character build links.
 *
 * This follows the birthsigns pattern of feature-specific wrappers
 * around generic components for better separation of concerns.
 */
export function ShareBuildButton({
  link,
  variant = 'outline',
  size = 'sm',
  text = 'Export / Share',
  onCopied,
  className,
}: ShareBuildButtonProps) {
  return (
    <GenericShareButton
      link={link}
      variant={variant}
      size={size}
      text={text}
      onCopied={onCopied}
      className={className}
    />
  )
}

/**
 * Build Link Share Button
 *
 * Specialized share button that automatically gets the current
 * build link from the window location.
 */
export function BuildLinkShareButton({
  onCopied,
  className,
}: {
  onCopied?: () => void
  className?: string
}) {
  const currentLink = window.location.href

  return (
    <ShareBuildButton
      link={currentLink}
      onCopied={onCopied}
      className={className}
    />
  )
}
