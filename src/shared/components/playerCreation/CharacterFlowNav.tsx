import { cn } from '@/lib/utils'
import { Button } from '@/shared/ui/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/ui/tabs'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

// Character build steps configuration
const characterBuildSteps = [
  { label: 'Build', value: 'build', to: '/build' },
  { label: 'Race', value: 'race', to: '/build/race' },
  { label: 'Birth Signs', value: 'birth-signs', to: '/build/birth-signs' },
  { label: 'Traits', value: 'traits', to: '/build/traits' },
  { label: 'Religion', value: 'religions', to: '/build/religions' },
  { label: 'Destiny', value: 'destiny', to: '/build/destiny' },
  { label: 'Perks', value: 'perks', to: '/build/perks' },
]

interface CharacterFlowNavProps {
  currentPath: string
}

export const CharacterFlowNav = ({ currentPath }: CharacterFlowNavProps) => {
  const navigate = useNavigate()

  // Find current step index
  const currentStepIndex = characterBuildSteps.findIndex(
    step => step.to === currentPath
  )
  const currentStep = currentStepIndex >= 0 ? currentStepIndex : 0

  // Navigation handlers
  const handleTabChange = (value: string) => {
    const step = characterBuildSteps.find(s => s.value === value)
    if (step) {
      navigate(step.to)
    }
  }

  const handleTabClick = (step: (typeof characterBuildSteps)[0]) => {
    navigate(step.to)
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      navigate(characterBuildSteps[currentStep - 1].to)
    }
  }

  const handleNext = () => {
    if (currentStep < characterBuildSteps.length - 1) {
      navigate(characterBuildSteps[currentStep + 1].to)
    }
  }

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault()
        handlePrevious()
        break
      case 'ArrowRight':
        event.preventDefault()
        handleNext()
        break
      case 'Home':
        event.preventDefault()
        navigate(characterBuildSteps[0].to)
        break
      case 'End':
        event.preventDefault()
        navigate(characterBuildSteps[characterBuildSteps.length - 1].to)
        break
    }
  }

  // Get current tab value
  const currentTabValue = characterBuildSteps[currentStep]?.value || 'build'

  return (
    <div
      className="bg-background border-b border-border shadow-sm sticky top-12 backdrop-blur-sm"
      style={{
        backgroundColor: 'hsl(var(--background))',
        backgroundImage: 'none',
      }}
      role="navigation"
      aria-label="Character build progress"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        style={{
          backgroundColor: 'hsl(var(--background))',
          backgroundImage: 'none',
        }}
      >
        <div className="flex items-center gap-2 md:gap-4">
          {/* Previous Button */}
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center justify-center shrink-0 w-10 h-10 cursor-pointer"
            aria-label={`Go to previous step: ${currentStep > 0 ? characterBuildSteps[currentStep - 1].label : 'none'}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Enhanced Tabs - Matching ShadCN exactly with gold accent bar */}
          <div className="flex-1 min-w-0">
            <Tabs value={currentTabValue} onValueChange={handleTabChange}>
              <TabsList
                className="flex w-full h-auto p-1 bg-muted relative"
                style={{
                  backgroundColor: 'hsl(var(--muted))',
                  backgroundImage: 'none',
                }}
                role="tablist"
                aria-label="Character build steps"
              >
                {characterBuildSteps.map((step, index) => (
                  <TabsTrigger
                    key={step.value}
                    value={step.value}
                    onClick={() => handleTabClick(step)}
                    className={cn(
                      'inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] relative',
                      'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
                      'dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30',
                      'text-foreground dark:text-muted-foreground',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      'disabled:pointer-events-none disabled:opacity-50',
                      'cursor-pointer select-none'
                    )}
                    style={{
                      backgroundColor:
                        currentTabValue === step.value
                          ? 'hsl(var(--background))'
                          : 'transparent',
                      backgroundImage: 'none',
                    }}
                    title={`Step ${index + 1}: ${step.label}`}
                    role="tab"
                    aria-selected={currentTabValue === step.value}
                    aria-label={`Step ${index + 1}: ${step.label}`}
                  >
                    <span className="hidden sm:inline">{step.label}</span>
                    <span className="sm:hidden">
                      {step.label.split(' ')[0]}
                    </span>

                    {/* Gold accent bar under active tab - similar to sidebar */}
                    {currentTabValue === step.value && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-skyrim-gold rounded-b-md transition-all duration-200" />
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={currentStep === characterBuildSteps.length - 1}
            className="flex items-center justify-center shrink-0 w-10 h-10 cursor-pointer"
            aria-label={`Go to next step: ${currentStep < characterBuildSteps.length - 1 ? characterBuildSteps[currentStep + 1].label : 'none'}`}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
