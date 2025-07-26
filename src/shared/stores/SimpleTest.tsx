import { useEffect, useState } from 'react'
import { useDestinyNodesStore, useSkillsStore, useTraitsStore } from './index'

export function SimpleTest() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use selectors to get only the data and load function
  const destinyNodesData = useDestinyNodesStore(state => state.data)
  const destinyNodesLoad = useDestinyNodesStore(state => state.load)

  const skillsData = useSkillsStore(state => state.data)
  const skillsLoad = useSkillsStore(state => state.load)

  const traitsData = useTraitsStore(state => state.data)
  const traitsLoad = useTraitsStore(state => state.load)

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        setError(null)

        // Load data manually
        await Promise.all([destinyNodesLoad(), skillsLoad(), traitsLoad()])

        setIsLoading(false)
      } catch (err) {
        console.error('Failed to load data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
        setIsLoading(false)
      }
    }

    loadData()
  }, [destinyNodesLoad, skillsLoad, traitsLoad])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data manually...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <h2 className="text-xl font-semibold">Failed to Load Data</h2>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Simple Store Test</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Destiny Nodes */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">Destiny Nodes</h3>
          <p className="text-green-600">
            ✅ Loaded {destinyNodesData.length} nodes
          </p>
          <ul className="text-sm mt-2">
            {destinyNodesData.slice(0, 3).map(node => (
              <li key={node.id}>• {node.name}</li>
            ))}
          </ul>
        </div>

        {/* Skills */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">Skills</h3>
          <p className="text-green-600">✅ Loaded {skillsData.length} skills</p>
          <ul className="text-sm mt-2">
            {skillsData.slice(0, 3).map(skill => (
              <li key={skill.id}>• {skill.name}</li>
            ))}
          </ul>
        </div>

        {/* Traits */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">Traits</h3>
          <p className="text-green-600">✅ Loaded {traitsData.length} traits</p>
          <ul className="text-sm mt-2">
            {traitsData.slice(0, 3).map(trait => (
              <li key={trait.id}>• {trait.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
