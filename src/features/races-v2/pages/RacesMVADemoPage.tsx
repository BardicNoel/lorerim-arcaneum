import React from 'react'
import { useRaceData } from '../adapters/useRaceData'
import { RaceAvatar, CategoryBadge, KeywordTag, StatBar } from '../components/atomic'

export function RacesMVADemoPage() {
  const { races, isLoading, error, categories, tags } = useRaceData()

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Races MVA Demo - Loading...</h1>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Races MVA Demo - Error</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    )
  }

  const sampleRace = races[0] // Use first race for demonstrations

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Races MVA Demo - Atomic Components</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Data Summary</h2>
          <div className="space-y-2">
            <p><strong>Total Races:</strong> {races.length}</p>
            <p><strong>Categories:</strong> {categories.join(', ')}</p>
            <p><strong>Total Tags:</strong> {tags.length}</p>
          </div>
        </div>

        {/* Sample Race Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Sample Race: {sampleRace?.name}</h2>
          {sampleRace && (
            <div className="space-y-2">
              <p className="text-gray-600 text-sm">{sampleRace.description}</p>
              <p className="text-sm"><strong>Category:</strong> {sampleRace.category}</p>
              <p className="text-sm"><strong>Keywords:</strong> {sampleRace.keywords.length}</p>
            </div>
          )}
        </div>

        {/* RaceAvatar Demo */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">RaceAvatar Component</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Small</p>
                <RaceAvatar raceName={sampleRace?.name || 'Nord'} size="sm" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Medium</p>
                <RaceAvatar raceName={sampleRace?.name || 'Nord'} size="md" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Large</p>
                <RaceAvatar raceName={sampleRace?.name || 'Nord'} size="lg" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Extra Large</p>
                <RaceAvatar raceName={sampleRace?.name || 'Nord'} size="xl" />
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <p>Uses generic EntityAvatar with race-specific configuration</p>
            </div>
          </div>
        </div>

        {/* CategoryBadge Demo */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">CategoryBadge Component</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Small</p>
                <CategoryBadge category="Human" size="sm" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Medium</p>
                <CategoryBadge category="Elf" size="md" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Large</p>
                <CategoryBadge category="Beast" size="lg" />
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <p>Uses generic CategoryBadge with race-specific styling</p>
            </div>
          </div>
        </div>

        {/* KeywordTag Demo */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">KeywordTag Component</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Auto-detected types:</p>
              <div className="flex flex-wrap gap-2">
                <KeywordTag keyword="destruction" />
                <KeywordTag keyword="waterbreathing" />
                <KeywordTag keyword="strong stomach" />
                <KeywordTag keyword="custom_flag" />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Explicit types:</p>
              <div className="flex flex-wrap gap-2">
                <KeywordTag keyword="alteration" type="skill" />
                <KeywordTag keyword="night eye" type="ability" />
                <KeywordTag keyword="beast race" type="trait" />
                <KeywordTag keyword="magic" type="flag" />
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <p>Auto-detects keyword types or accepts explicit type prop</p>
            </div>
          </div>
        </div>

        {/* StatBar Demo */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">StatBar Component</h2>
          <div className="space-y-4">
            {sampleRace && (
              <div className="space-y-3">
                <StatBar 
                  value={sampleRace.startingStats.health} 
                  maxValue={200} 
                  label="Health" 
                  color="red" 
                  size="md" 
                />
                <StatBar 
                  value={sampleRace.startingStats.magicka} 
                  maxValue={200} 
                  label="Magicka" 
                  color="blue" 
                  size="md" 
                />
                <StatBar 
                  value={sampleRace.startingStats.stamina} 
                  maxValue={200} 
                  label="Stamina" 
                  color="green" 
                  size="md" 
                />
              </div>
            )}
            <div className="text-xs text-gray-500">
              <p>Progress bars with configurable colors, sizes, and labels</p>
            </div>
          </div>
        </div>

        {/* Sample Races with Components */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Sample Races with Atomic Components</h2>
          <div className="space-y-4">
            {races.slice(0, 3).map(race => (
              <div key={race.edid} className="border rounded p-4">
                <div className="flex items-center gap-4 mb-3">
                  <RaceAvatar raceName={race.name} size="md" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{race.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <CategoryBadge category={race.category as 'Human' | 'Elf' | 'Beast'} size="sm" />
                    </div>
                  </div>
                </div>
                <p className="text-sm mb-3">{race.description}</p>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <StatBar 
                    value={race.startingStats.health} 
                    maxValue={200} 
                    label="Health" 
                    color="red" 
                    size="sm" 
                  />
                  <StatBar 
                    value={race.startingStats.magicka} 
                    maxValue={200} 
                    label="Magicka" 
                    color="blue" 
                    size="sm" 
                  />
                  <StatBar 
                    value={race.startingStats.stamina} 
                    maxValue={200} 
                    label="Stamina" 
                    color="green" 
                    size="sm" 
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {race.keywords.slice(0, 5).map((keyword, index) => (
                    <KeywordTag key={index} keyword={keyword.edid} />
                  ))}
                  {race.keywords.length > 5 && (
                    <span className="text-xs text-gray-500">+{race.keywords.length - 5} more</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 