import { useEffect } from 'react'
import { useAlchemyData } from '../adapters/useAlchemyData'
import { IngredientGrid } from '../components'

export function AlchemyPage() {
  const { ingredients, loadIngredients, loading, error } = useAlchemyData()

  useEffect(() => {
    console.log('AlchemyPage: Loading ingredients...')
    loadIngredients()
  }, [loadIngredients])

  useEffect(() => {
    console.log(
      'AlchemyPage: Ingredients updated:',
      ingredients?.length || 0,
      'items'
    )
  }, [ingredients])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-skyrim-gold">Loading alchemy ingredients...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          Error loading alchemy ingredients: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-skyrim-gold mb-2">
          Alchemy Ingredients
        </h1>
        <p className="text-muted-foreground">
          Discover and explore all available alchemy ingredients in LoreRim.
        </p>
      </div>

      <IngredientGrid ingredients={ingredients} />
    </div>
  )
}
