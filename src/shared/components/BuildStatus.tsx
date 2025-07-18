import { useCharacterBuild } from '../hooks/useCharacterBuild'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/ui/card'
import { Badge } from '../ui/ui/badge'
import { Button } from '../ui/ui/button'
import { useNavigate } from 'react-router-dom'

export const BuildStatus = () => {
  const { build, getSummary } = useCharacterBuild()
  const navigate = useNavigate()
  const summary = getSummary()

  if (!build.name && !build.race) {
    return (
      <Card className="border-dashed border-2 border-muted">
        <CardHeader>
          <CardTitle className="text-lg">No Character Build</CardTitle>
          <CardDescription>
            Start building your character to see it here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => navigate('/build')}
            className="w-full"
          >
            Create Character Build
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{summary.name}</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/build')}
          >
            Edit
          </Button>
        </CardTitle>
        <CardDescription>
          Current character build status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Race:</span>
            <Badge variant="secondary" className="ml-2">
              {summary.race}
            </Badge>
          </div>
          <div>
            <span className="text-muted-foreground">Birth Sign:</span>
            <Badge variant="secondary" className="ml-2">
              {summary.stone}
            </Badge>
          </div>
          <div>
            <span className="text-muted-foreground">Religion:</span>
            <Badge variant="secondary" className="ml-2">
              {summary.religion}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span>{summary.traitCount} traits</span>
          <span>•</span>
          <span>{summary.majorSkillCount} major skills</span>
          <span>•</span>
          <span>{summary.minorSkillCount} minor skills</span>
          <span>•</span>
          <span>{summary.equipmentCount} equipment</span>
        </div>
      </CardContent>
    </Card>
  )
} 