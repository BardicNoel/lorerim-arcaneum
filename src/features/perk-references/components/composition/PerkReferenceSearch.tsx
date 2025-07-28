import React from 'react'
import { Input } from '@/shared/ui/ui/input'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PerkReferenceSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function PerkReferenceSearch({
  value,
  onChange,
  placeholder = 'Search perks...',
  className,
}: PerkReferenceSearchProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  )
} 