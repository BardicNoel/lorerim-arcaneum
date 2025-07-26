import { useDestinyNodes, useSkills, useTraits } from './index'

export function StoreTest() {
  const destinyNodes = useDestinyNodes()
  const skills = useSkills()
  const traits = useTraits()

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Store Test</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Destiny Nodes */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">Destiny Nodes</h3>
          {destinyNodes.loading && <p className="text-blue-600">Loading...</p>}
          {destinyNodes.error && (
            <p className="text-red-600">Error: {destinyNodes.error}</p>
          )}
          {destinyNodes.data && (
            <div>
              <p className="text-green-600">
                ✅ Loaded {destinyNodes.data.length} nodes
              </p>
              <ul className="text-sm mt-2">
                {destinyNodes.data.slice(0, 3).map(node => (
                  <li key={node.id}>• {node.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">Skills</h3>
          {skills.loading && <p className="text-blue-600">Loading...</p>}
          {skills.error && (
            <p className="text-red-600">Error: {skills.error}</p>
          )}
          {skills.data && (
            <div>
              <p className="text-green-600">
                ✅ Loaded {skills.data.length} skills
              </p>
              <ul className="text-sm mt-2">
                {skills.data.slice(0, 3).map(skill => (
                  <li key={skill.id}>• {skill.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Traits */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">Traits</h3>
          {traits.loading && <p className="text-blue-600">Loading...</p>}
          {traits.error && (
            <p className="text-red-600">Error: {traits.error}</p>
          )}
          {traits.data && (
            <div>
              <p className="text-green-600">
                ✅ Loaded {traits.data.length} traits
              </p>
              <ul className="text-sm mt-2">
                {traits.data.slice(0, 3).map(trait => (
                  <li key={trait.id}>• {trait.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
