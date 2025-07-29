import { cn } from '@/lib/utils'
import { AccordionCard } from '@/shared/components/generic/AccordionCard'
import { Badge } from '@/shared/ui/ui/badge'
import type { SearchableItem } from '../../model/SearchModel'
import { SearchTypeBadge } from './SearchTypeBadge'

interface DefaultSearchCardProps {
  item: SearchableItem
  className?: string
  isExpanded?: boolean
  onToggle?: () => void
  viewMode?: 'grid' | 'list'
}

export function DefaultSearchCard({
  item,
  className,
  isExpanded = false,
  onToggle,
  viewMode = 'grid',
}: DefaultSearchCardProps) {
  return (
    <AccordionCard
      className={cn('transition-all hover:shadow-md', className)}
      expanded={isExpanded}
      onToggle={onToggle}
    >
      <AccordionCard.Header>
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
          </div>
        </div>
      </AccordionCard.Header>

      <AccordionCard.Summary>
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
      </AccordionCard.Summary>

      <AccordionCard.Details>
        {item.tags.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-foreground">All Tags</h5>
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag, idx) => (
                <Badge
                  key={`${tag}-${idx}`}
                  variant="secondary"
                  className="text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {item.description && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-foreground">Description</h5>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        )}
      </AccordionCard.Details>
    </AccordionCard>
  )
}
