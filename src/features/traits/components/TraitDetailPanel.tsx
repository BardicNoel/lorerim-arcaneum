import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { Badge } from '@/shared/ui/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import type { Trait } from '../types'

interface TraitDetailPanelProps {
  item: PlayerCreationItem
  originalTrait?: Trait
}

export function TraitDetailPanel({ item }: TraitDetailPanelProps) {
  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'magic':
        return '✨'
      case 'combat':
        return '⚔️'
      case 'stealth':
        return '👤'
      case 'crafting':
        return '🔨'
      case 'survival':
        return '🌿'
      default:
        return '🎯'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl flex-shrink-0">
            {getCategoryIcon(item.category || '')}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold truncate">{item.name}</h2>
            {item.category && (
              <Badge variant="secondary" className="mt-1">
                {item.category}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {item.description}
          </p>
        </CardContent>
      </Card>

      {/* Tags */}
      {item.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
