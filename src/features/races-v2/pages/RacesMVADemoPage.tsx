import React from 'react'
import { useRaceData } from '../adapters/useRaceData'

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Races MVA Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Data Summary</h2>
          <div className="space-y-2">
            <p><strong>Total Races:</strong> {races.length}</p>
            <p><strong>Categories:</strong> {categories.join(', ')}</p>
            <p><strong>Total Tags:</strong> {tags.length}</p>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="space-y-2">
            {categories.map(category => (
              <div key={category} className="flex justify-between">
                <span>{category}</span>
                <span className="text-gray-500">
                  {races.filter(race => race.category === category).length} races
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Races */}
        <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Sample Races (First 5)</h2>
          <div className="space-y-4">
            {races.slice(0, 5).map(race => (
              <div key={race.edid} className="border rounded p-4">
                <h3 className="font-semibold text-lg">{race.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{race.category}</p>
                <p className="text-sm mb-2">{race.description}</p>
                <div className="text-xs text-gray-500">
                  <p>Health: {race.startingStats.health} | 
                     Magicka: {race.startingStats.magicka} | 
                     Stamina: {race.startingStats.stamina}</p>
                  <p>Skills: {race.skillBonuses.length} | 
                     Spells: {race.racialSpells.length} | 
                     Keywords: {race.keywords.length}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags Sample */}
        <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Sample Tags (First 20)</h2>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 20).map(tag => (
              <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 