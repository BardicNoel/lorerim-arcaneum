import React from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/shared/ui/ui/input'
import { Search } from 'lucide-react'

// Component for skill search functionality
interface SkillSearchProps {
  query: string
  onQueryChange: (query: string) => void
  placeholder?: string
  className?: string
}

export function SkillSearch({ 
  query, 
  onQueryChange, 
  placeholder = "Search skills...",
  className 
}: SkillSearchProps) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  )
} 