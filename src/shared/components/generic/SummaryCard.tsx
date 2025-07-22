import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { cn } from '@/lib/utils'
import {
  getSummaryCardColor,
  getSummaryCardIcon,
  buildSpacing,
} from '@/shared/config/buildConfig'
import { User, Star, Heart, Tag } from 'lucide-react'

interface SummaryItem {
  label: string
  value: string | number
  icon?: React.ReactNode
  type?: 'race' | 'birthsign' | 'religion' | 'traits'
  className?: string
}

interface GenericSummaryCardProps {
  title: string
  items: SummaryItem[]
  layout?: 'grid' | 'list'
  className?: string
}

export function GenericSummaryCard({
  title,
  items,
  layout = 'grid',
  className,
}: GenericSummaryCardProps) {
  const getIcon = (type?: string) => {
    switch (type) {
      case 'race':
        return <User className="h-4 w-4" />
      case 'birthsign':
        return <Star className="h-4 w-4" />
      case 'religion':
        return <Heart className="h-4 w-4" />
      case 'traits':
        return <Tag className="h-4 w-4" />
      default:
        return null
    }
  }

  const getLayoutClasses = () => {
    switch (layout) {
      case 'grid':
        return 'grid grid-cols-2 md:grid-cols-4 gap-4'
      case 'list':
        return 'space-y-3'
      default:
        return 'grid grid-cols-2 md:grid-cols-4 gap-4'
    }
  }

  return (
    <Card className={cn(buildSpacing.card, className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className={cn(buildSpacing.section)}>
        <div className={getLayoutClasses()}>
          {items.map((item, index) => (
            <div key={index} className={cn(buildSpacing.item, item.className)}>
              <div className="flex items-center gap-2 mb-1">
                {item.icon || getIcon(item.type)}
                <span
                  className={cn(
                    'font-medium text-sm',
                    getSummaryCardColor('primary')
                  )}
                >
                  {item.label}:
                </span>
              </div>
              <div className={cn('text-sm', getSummaryCardColor('secondary'))}>
                {item.value || 'Not selected'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to create summary items from build data
export function createBuildSummaryItems(build: {
  race: string | null
  stone: string | null
  religion: string | null
  traits: {
    regular: string[]
    bonus: string[]
  }
  traitLimits: {
    regular: number
    bonus: number
  }
}): SummaryItem[] {
  return [
    {
      label: 'Race',
      value: build.race || 'Not selected',
      type: 'race',
    },
    {
      label: 'Birth Sign',
      value: build.stone || 'Not selected',
      type: 'birthsign',
    },
    {
      label: 'Religion',
      value: build.religion || 'Not selected',
      type: 'religion',
    },
    {
      label: 'Traits',
      value: `${build.traits.regular.length}/${build.traitLimits.regular} starting, ${build.traits.bonus.length}/${build.traitLimits.bonus} late game`,
      type: 'traits',
    },
  ]
}
