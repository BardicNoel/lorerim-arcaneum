import { AccordionBirthsignsPage } from '@/features/birthsigns/pages/AccordionBirthsignsPage'
import { UnifiedDestinyPage } from '@/features/destiny'
import { AccordionRacesPage } from '@/features/races/pages/AccordionRacesPage'
import { RacesMVADemoPage } from '@/features/races-v2'
import { AccordionReligionsPage } from '@/features/religions/pages/AccordionReligionsPage'
import { SkillsPage } from '@/features/skills'
import { AccordionTraitsPage } from '@/features/traits/pages/AccordionTraitsPage'
import { BuildPage } from '@/pages/BuildPage'
import CraftingPage from '@/pages/CraftingPage'
import EquipmentPage from '@/pages/EquipmentPage'
import { CharacterBuildLayout } from '@/shared/components/playerCreation'

import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import { Route, Routes } from 'react-router-dom'

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Character Build Flow - Nested Routes */}
      <Route path="/build" element={<CharacterBuildLayout />}>
        <Route index element={<BuildPage />} />
        <Route path="race" element={<AccordionRacesPage />} />
        <Route path="birth-signs" element={<AccordionBirthsignsPage />} />
        <Route path="traits" element={<AccordionTraitsPage />} />
        <Route path="religions" element={<AccordionReligionsPage />} />
        <Route path="destiny" element={<UnifiedDestinyPage />} />
        <Route path="perks" element={<SkillsPage />} />
      </Route>

      {/* Other pages */}
      <Route path="/races-mva-demo" element={<RacesMVADemoPage />} />
      <Route path="/skills-mva" element={<SkillsPage />} />
      <Route path="/equipment" element={<EquipmentPage />} />
      <Route path="/crafting" element={<CraftingPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
