import { BuildPageShell } from '@/shared/components/playerCreation'
import { AlchemyPageView } from '../views/AlchemyPageView'

export function AlchemyPage() {
  return (
    <BuildPageShell
      title="Alchemy Ingredients"
      description="Discover and explore all available alchemy ingredients in LoreRim. Search by effects, skills, plugins, and more."
    >
      <AlchemyPageView />
    </BuildPageShell>
  )
}
