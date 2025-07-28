import { cn } from '@/lib/utils'
import { Badge } from '@/shared/ui/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import type { SearchableItem } from '../../model/SearchModel'
import { SearchTypeBadge } from './SearchTypeBadge'

interface SearchDetailPanelProps {
  item: SearchableItem | null
  className?: string
}

export function SearchDetailPanel({ item, className }: SearchDetailPanelProps) {
  if (!item) {
    return (
      <Card className={cn('h-full', className)}>
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">
            Select an item to view details
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <SearchTypeBadge type={item.type} />
          <div className="flex-1">
            <CardTitle className="text-lg">{item.name}</CardTitle>
            {item.category && (
              <p className="text-sm text-muted-foreground">{item.category}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {item.description && (
          <div>
            <h4 className="font-medium text-sm mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        )}

        {item.tags.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Tags</h4>
            <div className="flex flex-wrap gap-1">
              {item.tags.map(tag => (
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
            {item.type}
          </Badge>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2">URL</h4>
          <p className="text-sm text-muted-foreground font-mono">{item.url}</p>
        </div>

        {/* TODO: Add type-specific detail content here */}
        <div>
          <h4 className="font-medium text-sm mb-2">Raw Data</h4>
          <details className="text-xs">
            <summary className="cursor-pointer text-muted-foreground">
              Click to view raw data
            </summary>
            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
              {JSON.stringify(item.originalData, null, 2)}
            </pre>
          </details>
        </div>
      </CardContent>
    </Card>
  )
}
