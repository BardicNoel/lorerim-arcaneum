import { useState, useEffect } from 'react'
import { useDestinyStepperStore, type PathStep } from '../../stores/destinyStepperStore'
import { useDestinyNodes } from '../../adapters/useDestinyNodes'
import { DestinyStepperHeader } from '../atomic/DestinyStepperHeader'
import { DestinyCurrentStepCard } from '../atomic/DestinyCurrentStepCard'
import { DestinyChoiceCard } from '../atomic/DestinyChoiceCard'
import { DestinyBottomStepperBar } from '../atomic/DestinyBottomStepperBar'
import { DestinyPathOverviewSheet } from '../atomic/DestinyPathOverviewSheet'
import { DestinyDetailsSheet } from '../atomic/DestinyDetailsSheet'
import { DestinyCompletionCard } from '../atomic/DestinyCompletionCard'
import type { DestinyNode } from '@/shared/data/schemas'

export function DestinyMobileStepper() {
  const {
    steps,
    currentIndex,
    nextChoices,
    selectChoice,
    jumpTo,
    clear,
  } = useDestinyStepperStore()

  // Compute derived values
  const currentStep = currentIndex >= 0 && currentIndex < steps.length ? steps[currentIndex] : null
  const pathLength = steps.length
  const isComplete = nextChoices.length === 0

  const { nodes, rootNodes } = useDestinyNodes()
  
  // UI state
  const [overviewOpen, setOverviewOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [activeChoice, setActiveChoice] = useState<DestinyNode | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  // Compute next choices based on current step
  useEffect(() => {
    const { setNextChoices } = useDestinyStepperStore.getState()
    
    if (currentIndex === -1) {
      // At the start - show root nodes
      setNextChoices(rootNodes)
    } else if (currentStep) {
      // Find nodes that have the current step as a prerequisite
      const nextNodes = nodes.filter(node => 
        node.prerequisites?.includes(currentStep.node.edid)
      )
      setNextChoices(nextNodes)
    } else {
      setNextChoices([])
    }
  }, [currentIndex, currentStep, nodes, rootNodes])

  // Handle choice selection
  const handleSelectChoice = (choiceId: string) => {
    selectChoice(choiceId)
    setDetailsOpen(false)
    setActiveChoice(null)
  }

  // Handle opening details
  const handleOpenDetails = (choice: DestinyNode) => {
    setActiveChoice(choice)
    setDetailsOpen(true)
  }

  // Handle jumping to previous step
  const handleBack = () => {
    if (currentIndex > 0) {
      jumpTo(currentIndex - 1)
    }
  }

  // Handle jumping to specific step
  const handleJumpTo = (index: number) => {
    jumpTo(index)
    setOverviewOpen(false)
  }

  // Handle clearing path
  const handleClear = () => {
    clear()
    setOverviewOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <DestinyStepperHeader
        stepIndex={currentIndex}
        totalSteps={pathLength}
        title={currentStep?.name ?? "Start Destiny"}
        onBack={handleBack}
        onOverview={() => setOverviewOpen(true)}
        onClear={handleClear}
        canBack={currentIndex > 0}
      />

      {/* Main Content */}
      <main className="flex-1 px-3 py-2 space-y-4">
        {/* Current Step Card - Previous Selection */}
        {currentStep && (
          <div className="space-y-2 p-3 rounded-lg bg-muted/20">
            <div className="flex items-center space-x-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-muted-foreground px-2">
                CURRENT STEP
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <DestinyCurrentStepCard
              step={currentStep}
              onChange={() => setPickerOpen(true)}
            />
          </div>
        )}

        {/* Connection Line */}
        {currentStep && !isComplete && nextChoices.length > 0 && (
          <div className="flex justify-center">
            <div className="w-px h-6 bg-primary/30" />
          </div>
        )}

        {/* Next Choices - Available Options */}
        {!isComplete && nextChoices.length > 0 && (
          <section aria-label="Next choices" className="space-y-3 p-3 rounded-lg bg-background border border-border">
            <div className="flex items-center space-x-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-muted-foreground px-2">
                {currentIndex === -1 ? 'CHOOSE STARTING DESTINY' : 'CHOOSE NEXT STEP'}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            
            <div className="space-y-2">
              {nextChoices.slice(0, 3).map(choice => (
                <DestinyChoiceCard
                  key={choice.edid}
                  choice={choice}
                  onOpenDetails={() => handleOpenDetails(choice)}
                  onSelect={() => handleSelectChoice(choice.edid)}
                />
              ))}
              {nextChoices.length > 3 && (
                <div className="text-center py-2">
                  <span className="text-sm text-muted-foreground">
                    +{nextChoices.length - 3} more choices available
                  </span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Completion State */}
        {isComplete && pathLength > 0 && (
          <DestinyCompletionCard
            steps={steps}
            onRestart={() => clear()}
            onShare={() => {
              // TODO: Implement share functionality
              console.log('Share path:', useDestinyStepperStore.getState().toQuery())
            }}
          />
        )}

        {/* Empty State */}
        {pathLength === 0 && nextChoices.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No destiny paths available. Please check your prerequisites.
            </p>
          </div>
        )}
      </main>

      {/* Bottom Stepper Bar */}
      <DestinyBottomStepperBar
        canBack={currentIndex > 0}
        canNext={false} // Next is handled by individual choice selection
        onBack={handleBack}
        onOverview={() => setOverviewOpen(true)}
      />

      {/* Path Overview Sheet */}
      <DestinyPathOverviewSheet
        open={overviewOpen}
        steps={steps}
        currentIndex={currentIndex}
        onJump={handleJumpTo}
        onClear={handleClear}
        onClose={() => setOverviewOpen(false)}
      />

      {/* Details Sheet */}
      <DestinyDetailsSheet
        open={detailsOpen}
        choice={activeChoice}
        onSelect={() => activeChoice && handleSelectChoice(activeChoice.edid)}
        onClose={() => {
          setDetailsOpen(false)
          setActiveChoice(null)
        }}
      />
    </div>
  )
}
