import { cn } from '@/lib/utils'
import { Badge } from '@/shared/ui/ui/badge'
import { Card, CardContent } from '@/shared/ui/ui/card'
import type { SearchResult } from '../../model/SearchModel'
import { SearchTypeBadge } from './SearchTypeBadge'

interface SearchResultCardProps {
  result: SearchResult
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

export function SearchResultCard({
  result,
  isSelected = false,
  onClick,
  className,
}: SearchResultCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isSelected && 'ring-2 ring-primary',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <SearchTypeBadge type={result.item.type} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm truncate">
                {result.item.name}
              </h4>
              {result.item.category && (
                <Badge variant="outline" className="text-xs">
                  {result.item.category}
                </Badge>
              )}
            </div>
            {result.item.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {result.item.description}
              </p>
            )}
            {result.item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {result.item.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {result.item.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{result.item.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
