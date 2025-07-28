import { cn } from '@/lib/utils'
import { Badge } from '@/shared/ui/ui/badge'
import { Card, CardContent } from '@/shared/ui/ui/card'
import type { SearchableItem } from '../../model/SearchModel'
import { SearchTypeBadge } from './SearchTypeBadge'

interface DefaultSearchCardProps {
  item: SearchableItem
  className?: string
}

export function DefaultSearchCard({ item, className }: DefaultSearchCardProps) {
  return (
    <Card className={cn('transition-all hover:shadow-md', className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <SearchTypeBadge type={item.type} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm truncate">{item.name}</h4>
              {item.category && (
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
              )}
            </div>
            {item.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            )}
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.slice(0, 3).map((tag, idx) => (
                  <Badge
                    key={`${tag}-${idx}`}
                    variant="secondary"
                    className="text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{item.tags.length - 3}
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
