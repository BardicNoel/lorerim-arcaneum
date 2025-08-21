import { Z_INDEX } from '@/lib/constants'
import { Copy, ExternalLink, Trash2, User } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCharacterBuild } from '../hooks/useCharacterBuild'
import { Button } from '../ui/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/ui/sheet'

// Import build components
import { BasicInfoCard, BuildSummaryCard } from '@/features/build/components'
import { AttributeAssignmentCard } from '@/features/attributes'
import { BirthsignSelectionCard } from '@/features/birthsigns'
import BuildPageDestinyCard from '@/features/destiny/views/BuildPageDestinyCard'
import { RaceSelectionCard } from '@/features/races-v2'
import { ReligionSelectionCard, FavoriteBlessingSelectionCard } from '@/features/religions/components'
import { BuildPageSkillCard } from '@/features/skills/components'
import { TraitSelectionCard } from '@/features/traits/components'

export const FloatingBuildButton = () => {
  const {
    build,
    resetBuild,
    getSummary,
    setBuildName,
    setBuildNotes,
  } = useCharacterBuild()
  const navigate = useNavigate()
  const summary = getSummary()
  const [isOpen, setIsOpen] = useState(false)

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

  const handleNavigateToBuild = () => {
    setIsOpen(false)
    navigate('/build')
  }

  const handleJumpToSection = (sectionId: string) => {
    setIsOpen(false)
    navigate(`/build#${sectionId}`)
    
    // Smooth scroll to section after navigation
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
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
        <SheetContent 
          side="right" 
          className="w-[450px] sm:w-[800px] lg:w-[800px] sm:!max-w-[800px] lg:!max-w-[800px] p-0"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader className="p-6 pb-4 border-b">
              <SheetTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {summary.name || 'Character Build'}
              </SheetTitle>
              <SheetDescription>
                Quick reference and editing for your character build
              </SheetDescription>
            </SheetHeader>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic Info */}
              <BasicInfoCard
                name={build.name}
                notes={build.notes}
                onNameChange={setBuildName}
                onNotesChange={setBuildNotes}
                className="mb-0"
              />
              
              {/* Selection Cards - Single Column */}
              <div className="space-y-6">
                <RaceSelectionCard />
                <BirthsignSelectionCard />
                <TraitSelectionCard />
                <ReligionSelectionCard />
                <FavoriteBlessingSelectionCard />
              </div>
              
              {/* Full-width Cards */}
              <AttributeAssignmentCard 
                showControls={true}
                showSummary={true}
                compact={false}
              />
              <BuildPageSkillCard />
              <BuildPageDestinyCard navigate={navigate} />
              <BuildSummaryCard build={build} />
            </div>

            {/* Footer Actions */}
            <div className="p-6 pt-4 border-t bg-muted/50">
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={handleNavigateToBuild} 
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Full Build Page
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopyURL}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleResetBuild}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
              
              {/* Quick Navigation */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Quick Navigation:</p>
                <div className="flex flex-wrap gap-1">
                  {!build.race && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleJumpToSection('race')}
                    >
                      Race
                    </Button>
                  )}
                  {!build.stone && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleJumpToSection('birthsign')}
                    >
                      Birthsign
                    </Button>
                  )}
                  {(build.traits.regular.length === 0 && build.traits.bonus.length === 0) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleJumpToSection('traits')}
                    >
                      Traits
                    </Button>
                  )}
                  {!build.religion && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleJumpToSection('religion')}
                    >
                      Religion
                    </Button>
                  )}
                  {!build.favoriteBlessing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleJumpToSection('favorite-blessing')}
                    >
                      Favorite Blessing
                    </Button>
                  )}
                  {(build.skills.major.length === 0 && build.skills.minor.length === 0) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleJumpToSection('skills')}
                    >
                      Skills
                    </Button>
                  )}
                  {build.destinyPath.length === 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleJumpToSection('destiny')}
                    >
                      Destiny
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
