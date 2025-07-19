import { useCharacterBuild } from '../hooks/useCharacterBuild'
import { Button } from '../ui/ui/button'
import { Badge } from '../ui/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/ui/sheet'
import { User, Settings, Trash2, Copy, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Z_INDEX } from '@/lib/constants'
import { useState } from 'react'

export const FloatingBuildButton = () => {
  const { build, resetBuild, getSummary } = useCharacterBuild()
  const navigate = useNavigate()
  const summary = getSummary()
  const [isOpen, setIsOpen] = useState(false)

  // Check if build has any content
  const hasBuildContent =
    build.name ||
    build.race ||
    build.traits.length > 0 ||
    build.stone ||
    build.religion ||
    build.skills.major.length > 0 ||
    build.skills.minor.length > 0 ||
    build.equipment.length > 0

  const handleCopyURL = () => {
    navigator.clipboard.writeText(window.location.href)
    // You could add a toast notification here
  }

  const handleResetBuild = () => {
    if (
      confirm(
        'Are you sure you want to reset your character build? This cannot be undone.'
      )
    ) {
      resetBuild()
    }
  }

  const handleNavigate = (path: string) => {
    setIsOpen(false)
    navigate(path)
  }

  return (
    <div
      className="fixed bottom-4 right-4"
      style={{ zIndex: Z_INDEX.MODAL + 1 }}
    >
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className={`h-12 w-12 rounded-full shadow-lg transition-opacity duration-200 ${
              isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            style={{
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
            }}
          >
            <User className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] p-6">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {hasBuildContent ? summary.name : 'Character Build'}
            </SheetTitle>
            <SheetDescription>
              {hasBuildContent
                ? 'Your current character build status'
                : 'Create and manage your character build'}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {hasBuildContent ? (
              <>
                {/* Race */}
                {build.race && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Race
                    </h3>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">{summary.race}</span>
                      <Badge variant="secondary" className="bg-blue-500">
                        Selected
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Birth Sign */}
                {build.stone && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Birth Sign
                    </h3>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">{summary.stone}</span>
                      <Badge variant="secondary" className="bg-purple-500">
                        Selected
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Religion */}
                {build.religion && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Religion
                    </h3>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">{summary.religion}</span>
                      <Badge variant="secondary" className="bg-orange-500">
                        Selected
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Traits */}
                {build.traits.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Traits ({build.traits.length})
                    </h3>
                    <div className="space-y-2">
                      {build.traits.map(traitId => (
                        <div
                          key={traitId}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <span className="font-medium">{traitId}</span>
                          <Badge variant="secondary" className="bg-green-500">
                            Added
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {(build.skills.major.length > 0 ||
                  build.skills.minor.length > 0) && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Skills
                    </h3>
                    <div className="space-y-2">
                      {build.skills.major.length > 0 && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Major Skills</span>
                            <Badge variant="outline">
                              {build.skills.major.length}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {build.skills.major.map(skill => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="bg-red-500 text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {build.skills.minor.length > 0 && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Minor Skills</span>
                            <Badge variant="outline">
                              {build.skills.minor.length}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {build.skills.minor.map(skill => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="bg-blue-500 text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Equipment */}
                {build.equipment.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Equipment ({build.equipment.length})
                    </h3>
                    <div className="space-y-2">
                      {build.equipment.map(equipment => (
                        <div
                          key={equipment}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <span className="font-medium">{equipment}</span>
                          <Badge variant="secondary" className="bg-gray-500">
                            Equipped
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Character Build</h3>
                <p className="text-muted-foreground mb-6">
                  Start building your character by selecting a race, traits, and
                  other options.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            {hasBuildContent ? (
              <>
                <Button
                  onClick={() => handleNavigate('/build')}
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Edit Build
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopyURL}
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Share URL
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleResetBuild}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Reset Build
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => handleNavigate('/build')}
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Create Character Build
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleNavigate('/race')}
                  className="w-full"
                >
                  Browse Races
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleNavigate('/traits')}
                  className="w-full"
                >
                  Browse Traits
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
