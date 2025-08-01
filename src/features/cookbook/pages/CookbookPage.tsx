import { BuildPageShell } from '@/shared/components/playerCreation'
import { RecipePageView } from '../views/RecipePageView'

export function CookbookPage() {
  return (
    <BuildPageShell
      title="Cookbook Reference"
      description="Browse and search all available recipes. Find the perfect dish for your character's needs."
    >
      <RecipePageView />
    </BuildPageShell>
  )
} 