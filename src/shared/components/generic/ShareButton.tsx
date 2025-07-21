import React, { useState } from 'react'
import { Button } from '@/shared/ui/ui/button'
import { cn } from '@/lib/utils'
import { 
  getShareButtonColor, 
  getShareButtonIcon 
} from '@/shared/config/buildConfig'
import { Share2, Check, Link } from 'lucide-react'

interface GenericShareButtonProps {
  link: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'lg'
  icon?: React.ReactNode
  text?: string
  onCopied?: () => void
  className?: string
}

export function GenericShareButton({
  link,
  variant = 'outline',
  size = 'sm',
  icon,
  text = 'Share / Export',
  onCopied,
  className,
}: GenericShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      onCopied?.()
      setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      console.error('Failed to copy link:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = link
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      onCopied?.()
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const getIcon = () => {
    if (icon) return icon
    if (copied) {
      return <Check className="w-4 h-4" />
    }
    return <Share2 className="w-4 h-4" />
  }

  const getText = () => {
    if (copied) {
      return 'Copied!'
    }
    return text
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={variant}
        size={size}
        onClick={handleCopy}
        className={cn(
          'cursor-pointer hover:opacity-90',
          copied && getShareButtonColor('copied'),
          className
        )}
      >
        {getIcon()}
        <span className="ml-2">{getText()}</span>
      </Button>
    </div>
  )
} 