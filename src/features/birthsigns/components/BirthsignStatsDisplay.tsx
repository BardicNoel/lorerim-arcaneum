import { cn } from '@/lib/utils'
import { Badge } from '@/shared/ui/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { H4 } from '@/shared/ui/ui/typography'
import type { Birthsign } from '../types'

interface BirthsignStatsDisplayProps {
  birthsign: Birthsign
  title?: string
  className?: string
}

export function BirthsignStatsDisplay({
  birthsign,
  title = 'Stat Modifications',
  className,
}: BirthsignStatsDisplayProps) {
  const hasStatModifications = birthsign.stat_modifications.length > 0
  const hasSkillBonuses = birthsign.skill_bonuses.length > 0

  if (!hasStatModifications && !hasSkillBonuses) {
    return null
  }

  return (
    <Card className={cn('border-muted/50', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stat Modifications */}
        {hasStatModifications && (
          <div>
            <H4 className="text-sm font-medium mb-2">Attributes</H4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {birthsign.stat_modifications.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg border bg-muted/30"
                >
                  <span className="text-sm font-medium capitalize">
                    {stat.stat}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs',
                      stat.type === 'bonus'
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-red-100 text-red-800 border-red-200'
                    )}
                  >
                    {stat.type === 'bonus' ? '+' : '-'}
                    {stat.value}
                    {stat.value_type === 'percentage' ? '%' : ''}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skill Bonuses */}
        {hasSkillBonuses && (
          <div>
            <H4 className="text-sm font-medium mb-2">Skill Bonuses</H4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {birthsign.skill_bonuses.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg border bg-muted/30"
                >
                  <span className="text-sm font-medium capitalize">
                    {skill.stat}
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-800 border-blue-200 text-xs"
                  >
                    +{skill.value}
                    {skill.value_type === 'percentage' ? '%' : ''}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
