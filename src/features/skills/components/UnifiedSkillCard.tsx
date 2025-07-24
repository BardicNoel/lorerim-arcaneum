import React from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import type { SkillWithPerks } from '../hooks/useUnifiedSkills'

export interface UnifiedSkillCardProps {
  skill: SkillWithPerks
  onSkillSelect: () => void
  onAssignmentChange: (type: 'major' | 'minor' | 'none') => void
}

export function UnifiedSkillCard({
  skill,
  onSkillSelect,
  onAssignmentChange,
}: UnifiedSkillCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // Only trigger skill selection if not clicking on badges
    if (!(e.target as HTMLElement).closest('[data-badge]')) {
      onSkillSelect()
    }
  }

  const handleBadgeClick = (e: React.MouseEvent, type: 'major' | 'minor') => {
    e.stopPropagation()

    if (type === 'major') {
      if (skill.isMajor) {
        onAssignmentChange('none')
      } else {
        onAssignmentChange('major')
      }
    } else if (type === 'minor') {
      if (skill.isMinor) {
        onAssignmentChange('none')
      } else {
        onAssignmentChange('minor')
      }
    }
  }

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">{skill.name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {skill.description}
        </p>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Perks Count */}
        {skill.perksCount > 0 && (
          <div className="text-sm text-muted-foreground">
            ⭐ {skill.perksCount} Perks
          </div>
        )}

        {/* Assignment Badges */}
        <div className="flex gap-2">
          <Badge
            data-badge="major"
            variant={skill.isMajor ? 'default' : 'outline'}
            className={`cursor-pointer transition-colors ${
              skill.isMajor
                ? 'bg-skyrim-gold text-skyrim-dark hover:bg-skyrim-gold/90'
                : 'hover:bg-skyrim-gold/10 hover:border-skyrim-gold'
            }`}
            onClick={e => handleBadgeClick(e, 'major')}
          >
            {skill.isMajor ? 'Major' : '+ Major'}
          </Badge>

          <Badge
            data-badge="minor"
            variant={skill.isMinor ? 'default' : 'outline'}
            className={`cursor-pointer transition-colors ${
              skill.isMinor
                ? 'bg-gray-600 text-white hover:bg-gray-700'
                : 'hover:bg-gray-100 hover:border-gray-400'
            }`}
            onClick={e => handleBadgeClick(e, 'minor')}
          >
            {skill.isMinor ? 'Minor' : '+ Minor'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
