import { BuildPageShell } from '@/shared/components/playerCreation'
import { SpellPageView } from '../views/SpellPageView'

export function SpellsPage() {
  return (
    <BuildPageShell
      title="Spell Reference"
      description="Browse and search all available spells. Find the perfect magic for your character build."
    >
      <SpellPageView />
    </BuildPageShell>
  )
} 