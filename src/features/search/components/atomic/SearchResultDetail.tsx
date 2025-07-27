import { cn } from '@/lib/utils'
import { Badge } from '@/shared/ui/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import type { SearchResult } from '../../model/SearchModel'
import { SearchTypeBadge } from './SearchTypeBadge'

interface SearchResultDetailProps {
  result: SearchResult
  className?: string
}

export function SearchResultDetail({
  result,
  className,
}: SearchResultDetailProps) {
  return (
    <Card className={cn('h-full', className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <SearchTypeBadge type={result.item.type} />
          <div className="flex-1">
            <CardTitle className="text-lg">{result.item.name}</CardTitle>
            {result.item.category && (
              <p className="text-sm text-muted-foreground">
                {result.item.category}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {result.item.description && (
          <div>
            <h4 className="font-medium text-sm mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">
              {result.item.description}
            </p>
          </div>
        )}

        {result.item.tags.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Tags</h4>
            <div className="flex flex-wrap gap-1">
              {result.item.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="font-medium text-sm mb-2">Type</h4>
          <Badge variant="outline" className="text-xs">
            {result.item.type}
          </Badge>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2">URL</h4>
          <p className="text-sm text-muted-foreground font-mono">
            {result.item.url}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
