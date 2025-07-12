import React from 'react'
import { PageShell } from '../components/PageShell'
import { RaceListFilter } from '../components/RaceListFilter'
import { RaceList } from '../components/RaceList'
import { useRaces } from '../hooks/useRaces'
import { Card, CardContent } from '@/shared/ui/ui/card'
import { P } from '@/shared/ui/ui/typography'
import { Loader2 } from 'lucide-react'
import type { Race } from '../types'

export function RaceDataPage() {
  const { races, loading, error, filters, setFilters } = useRaces()

  const handleViewDetails = (race: Race) => {
    // TODO: Implement race details modal/page
    console.log('View details for:', race.name)
  }

  if (loading) {
    return (
      <PageShell title="Race Data" subtitle="Browse and compare Skyrim races">
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
      <PageShell title="Race Data" subtitle="Browse and compare Skyrim races">
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
      title="Race Data" 
      subtitle="Browse and compare Skyrim races with their unique traits and abilities"
    >
      <div className="space-y-6">
        {/* Filters */}
        <RaceListFilter 
          filters={filters}
          onFilterChange={setFilters}
        />

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <P className="text-sm text-muted-foreground">
            {races.length} race{races.length !== 1 ? 's' : ''} found
          </P>
        </div>

        {/* Race List */}
        {races.length > 0 ? (
          <RaceList 
            races={races}
            onViewDetails={handleViewDetails}
          />
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
    </PageShell>
  )
} 