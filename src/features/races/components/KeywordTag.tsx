import React from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import { cn } from '@/lib/utils'

interface KeywordTagProps {
  keyword: string
  type?: 'ability' | 'trait' | 'flag' | 'skill'
  size?: 'sm' | 'md'
  className?: string
}

const keywordTypeStyles = {
  ability: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200'
  },
  trait: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200'
  },
  flag: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200'
  },
  skill: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200'
  }
}

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-xs px-2 py-1'
}

// Auto-detect keyword type based on content
function detectKeywordType(keyword: string): 'ability' | 'trait' | 'flag' | 'skill' {
  const lowerKeyword = keyword.toLowerCase()
  
  // Skill keywords
  if (['destruction', 'restoration', 'alteration', 'illusion', 'conjuration', 
       'light armor', 'heavy armor', 'one-handed', 'two-handed', 'archery',
       'block', 'smithing', 'enchanting', 'alchemy', 'speechcraft', 'sneak',
       'lockpicking', 'pickpocket'].some(skill => lowerKeyword.includes(skill))) {
    return 'skill'
  }
  
  // Ability keywords
  if (['waterbreathing', 'night eye', 'claws', 'histskin', 'dragonskin',
       'magic resistance', 'voice of the emperor', 'battle cry'].some(ability => 
       lowerKeyword.includes(ability))) {
    return 'ability'
  }
  
  // Trait keywords
  if (['strong stomach', 'beast race', 'bleeds', 'natural'].some(trait => 
      lowerKeyword.includes(trait))) {
    return 'trait'
  }
  
  // Default to flag
  return 'flag'
}

export function KeywordTag({ 
  keyword, 
  type, 
  size = 'sm', 
  className 
}: KeywordTagProps) {
  const detectedType = type || detectKeywordType(keyword)
  const styles = keywordTypeStyles[detectedType]
  
  return (
    <Badge 
      variant="outline"
      className={cn(
        styles.bg,
        styles.text,
        styles.border,
        sizeClasses[size],
        'font-medium',
        className
      )}
    >
      {keyword}
    </Badge>
  )
} 