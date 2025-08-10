import { useBirthsigns } from '@/shared/stores'
import { useState } from 'react'
import { BirthsignCard, BirthsignDetailsSheet } from '../components'
import type { Birthsign } from '../types'

export function BirthsignCardsDemoPage() {
  const { data: birthsignsData, loading, error } = useBirthsigns()
  const birthsigns = birthsignsData || []

  // State for details sheet
  const [selectedBirthsign, setSelectedBirthsign] = useState<Birthsign | null>(
    null
  )
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const handleCardClick = (birthsign: Birthsign) => {
    setSelectedBirthsign(birthsign)
    setIsDetailsOpen(true)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Birthsign Cards Demo</h1>
        <p>Loading birthsigns...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Birthsign Cards Demo</h1>
        <p className="text-red-500">Error loading birthsigns: {error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Birthsign Cards Demo</h1>
      <p className="text-muted-foreground mb-6">
        New birthsign cards following the race card pattern with visual parity.
      </p>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {birthsigns.slice(0, 6).map(birthsign => (
          <BirthsignCard
            key={birthsign.edid}
            originalBirthsign={birthsign}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick(birthsign)}
          />
        ))}
      </div>

      {/* Details Sheet */}
      <BirthsignDetailsSheet
        birthsign={selectedBirthsign}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  )
}
