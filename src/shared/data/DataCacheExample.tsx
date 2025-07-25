// src/shared/data/DataCacheExample.tsx
// Example component demonstrating the new cache-based data loading system

import { useState } from 'react'
import { Button } from '@/shared/ui/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { 
  loadDataset, 
  getDataset, 
  isCached, 
  clearCache,
  preloadDatasets 
} from './dataCache'
import { useTraits, useSkills, useRaces } from './useDataCache'

export function DataCacheExample() {
  const [manualData, setManualData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Hook-based loading (recommended)
  const { data: traitsData, loading: traitsLoading, error: traitsError, reload: reloadTraits } = useTraits()
  const { data: skillsData, loading: skillsLoading, error: skillsError, reload: reloadSkills } = useSkills()
  const { data: racesData, loading: racesLoading, error: racesError, reload: reloadRaces } = useRaces()

  // Manual loading example
  const handleManualLoad = async () => {
    try {
      setError(null)
      const data = await loadDataset('traits')
      setManualData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    }
  }

  const handlePreload = async () => {
    try {
      setError(null)
      await preloadDatasets(['skills', 'races', 'birthsigns'])
      alert('Preloaded skills, races, and birthsigns!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to preload data')
    }
  }

  const handleClearCache = () => {
    clearCache()
    setManualData(null)
    alert('Cache cleared!')
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cache-Based Data Loading System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleManualLoad} variant="outline">
              Load Traits Manually
            </Button>
            <Button onClick={handlePreload} variant="outline">
              Preload Multiple Datasets
            </Button>
            <Button onClick={handleClearCache} variant="outline">
              Clear Cache
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cache Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Cache Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Traits:</span>
                  <Badge variant={isCached('traits') ? 'default' : 'secondary'}>
                    {isCached('traits') ? 'Cached' : 'Not Cached'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Skills:</span>
                  <Badge variant={isCached('skills') ? 'default' : 'secondary'}>
                    {isCached('skills') ? 'Cached' : 'Not Cached'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Races:</span>
                  <Badge variant={isCached('races') ? 'default' : 'secondary'}>
                    {isCached('races') ? 'Cached' : 'Not Cached'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Hook-Based Loading */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Hook-Based Loading</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Traits:</span>
                  <Badge variant={traitsLoading ? 'secondary' : traitsError ? 'destructive' : 'default'}>
                    {traitsLoading ? 'Loading...' : traitsError ? 'Error' : `${traitsData?.traits?.length || 0} items`}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Skills:</span>
                  <Badge variant={skillsLoading ? 'secondary' : skillsError ? 'destructive' : 'default'}>
                    {skillsLoading ? 'Loading...' : skillsError ? 'Error' : `${skillsData?.skills?.length || 0} items`}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Races:</span>
                  <Badge variant={racesLoading ? 'secondary' : racesError ? 'destructive' : 'default'}>
                    {racesLoading ? 'Loading...' : racesError ? 'Error' : `${racesData?.races?.length || 0} items`}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Manual Loading */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Manual Loading</CardTitle>
              </CardHeader>
              <CardContent>
                {manualData ? (
                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>Traits loaded:</strong> {manualData.traits?.length || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      First trait: {manualData.traits?.[0]?.name || 'None'}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No manual data loaded
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sample Data Display */}
          {traitsData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Sample Traits Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {traitsData.traits?.slice(0, 6).map((trait: any) => (
                    <div key={trait.id} className="p-2 border rounded text-sm">
                      <div className="font-medium">{trait.name}</div>
                      <div className="text-xs text-muted-foreground">{trait.category}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 