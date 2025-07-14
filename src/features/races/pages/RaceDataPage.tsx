import React, { useState } from 'react'
import { PageShell } from '../components/PageShell'
import { RaceListFilter } from '../components/RaceListFilter'
import { RaceList } from '../components/RaceList'
import { RaceGrid } from '../components/RaceGrid'
import { RaceDetailsPanel } from '../components/RaceDetailsPanel'
import { useRaces } from '../hooks/useRaces'
import { Card, CardContent } from '@/shared/ui/ui/card'
import { P } from '@/shared/ui/ui/typography'
import { Button } from '@/shared/ui/ui/button'
import { Loader2, List, Grid3X3 } from 'lucide-react'
import type { Race } from '../types'

function PlayerRacePage() {
  const { races, loading, error, filters, setFilters } = useRaces()
  const [layout, setLayout] = useState<'list' | 'grid'>('grid')
  const [selectedRace, setSelectedRace] = useState<Race | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleViewDetails = (race: Race) => {
    setSelectedRace(race)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRace(null)
  }

  if (loading) {
    return (
      <PageShell title="Races of Skyrim" subtitle="Browse and compare Skyrim races">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <P>Loading races...</P>
          </div>
        </div>
      </PageShell>
    )
  }

  if (error) {
    return (
      <PageShell title="Races of Skyrim" subtitle="Browse and compare Skyrim races">
        <Card>
          <CardContent className="pt-6">
            <P className="text-destructive">Error loading race data: {error}</P>
          </CardContent>
        </Card>
      </PageShell>
    )
  }

  return (
    <PageShell 
      title="Races of Skyrim" 
      subtitle="Browse and compare Skyrim races with their unique traits and abilities"
    >
      <div className="space-y-6">
        {/* Filters */}
        <RaceListFilter 
          filters={filters}
          onFilterChange={setFilters}
        />

        {/* Results Count and Layout Toggle */}
        <div className="flex items-center justify-between">
          <P className="text-sm text-muted-foreground">
            {races.length} race{races.length !== 1 ? 's' : ''} found
          </P>
          
          <div className="flex items-center gap-2">
            <Button
              variant={layout === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLayout('list')}
              className="h-8 px-2"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={layout === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLayout('grid')}
              className="h-8 px-2"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Race Display */}
        {races.length > 0 ? (
          layout === 'list' ? (
            <RaceList 
              races={races}
              onViewDetails={handleViewDetails}
            />
          ) : (
            <RaceGrid 
              races={races}
              onViewDetails={handleViewDetails}
            />
          )
        ) : (
          <Card>
            <CardContent className="pt-6">
              <P className="text-center text-muted-foreground">
                No races found matching your filters. Try adjusting your search criteria.
              </P>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Race Details Panel */}
      <RaceDetailsPanel race={selectedRace} isOpen={isModalOpen} onClose={handleCloseModal} />
    </PageShell>
  )
}

export default PlayerRacePage 