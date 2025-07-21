import React from 'react'
import { 
  GenericSummaryCard, 
  createBuildSummaryItems 
} from '@/shared/components/generic/SummaryCard'

interface BuildSummaryCardProps {
  build: {
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
  }
  title?: string
  layout?: 'grid' | 'list'
  className?: string
}

/**
 * Build Summary Card Component
 * 
 * Feature-specific wrapper around GenericSummaryCard that displays
 * character build summary information.
 * 
 * This follows the birthsigns pattern of feature-specific wrappers
 * around generic components for better separation of concerns.
 */
export function BuildSummaryCard({
  build,
  title = 'Build Summary',
  layout = 'grid',
  className,
}: BuildSummaryCardProps) {
  const summaryItems = createBuildSummaryItems(build)

  return (
    <GenericSummaryCard
      title={title}
      items={summaryItems}
      layout={layout}
      className={className}
    />
  )
}

/**
 * Compact Build Summary Card
 * 
 * Specialized summary card for compact display in sidebars
 * or smaller spaces.
 */
export function CompactBuildSummaryCard({
  build,
  className,
}: {
  build: BuildSummaryCardProps['build']
  className?: string
}) {
  return (
    <BuildSummaryCard
      build={build}
      title="Summary"
      layout="list"
      className={className}
    />
  )
} 