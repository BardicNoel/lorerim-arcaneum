import { useCharacterBuild } from '../hooks/useCharacterBuild'
import { Button } from '../ui/ui/button'
import { Badge } from '../ui/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/ui/card'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../ui/ui/dropdown-menu'
import { 
  ChevronUp, 
  ChevronDown, 
  User, 
  Settings, 
  Trash2,
  Copy,
  ExternalLink
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const FloatingBuildStatus = () => {
  const { build, resetBuild, getSummary } = useCharacterBuild()
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  const summary = getSummary()

  // Don't show if no build exists
  if (!build.name && !build.race && build.traits.length === 0) {
    return null
  }

  const handleCopyURL = () => {
    navigator.clipboard.writeText(window.location.href)
    // You could add a toast notification here
  }

  const handleResetBuild = () => {
    if (confirm('Are you sure you want to reset your character build? This cannot be undone.')) {
      resetBuild()
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg border-2 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              {summary.name}
            </CardTitle>
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Settings className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/build')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Edit Build
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyURL}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy URL
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleResetBuild} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Reset Build
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 w-6 p-0"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronUp className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="pt-0 space-y-3">
            {/* Race */}
            {build.race && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Race:</span>
                <Badge variant="secondary" className="bg-blue-500">
                  {summary.race}
                </Badge>
              </div>
            )}
            
            {/* Birth Sign */}
            {build.stone && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Birth Sign:</span>
                <Badge variant="secondary" className="bg-purple-500">
                  {summary.stone}
                </Badge>
              </div>
            )}
            
            {/* Religion */}
            {build.religion && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Religion:</span>
                <Badge variant="secondary" className="bg-orange-500">
                  {summary.religion}
                </Badge>
              </div>
            )}
            
            {/* Traits */}
            {build.traits.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Traits:</span>
                  <Badge variant="outline">{build.traits.length}</Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {build.traits.slice(0, 3).map((trait) => (
                    <Badge key={trait} variant="secondary" className="bg-green-500 text-xs">
                      {trait}
                    </Badge>
                  ))}
                  {build.traits.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{build.traits.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            {/* Skills */}
            {(build.skills.major.length > 0 || build.skills.minor.length > 0) && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Skills:</span>
                  <div className="flex gap-1">
                    {build.skills.major.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {build.skills.major.length} major
                      </Badge>
                    )}
                    {build.skills.minor.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {build.skills.minor.length} minor
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Equipment */}
            {build.equipment.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Equipment:</span>
                <Badge variant="outline">{build.equipment.length} items</Badge>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
} 